from __future__ import annotations

import logging
import os
import threading
from collections import defaultdict, deque
from typing import Deque

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["AI Assistant"])

SYSTEM_PROMPT = """
You are MarketMate, the AI research assistant inside StockScreener, an Indian equity research application.
Help users understand Indian equities, NSE/BSE market concepts, company financial statements, valuation,
profitability ratios (P/E, P/B, ROE, ROCE), shareholding, risk, diversification, and technical-analysis
concepts in clear, practical language.

Rules:
- Be concise, conversational, and educational. Use simple language and short headings/bullets when useful.
- You are not a registered investment adviser. Do not promise returns or describe any stock as guaranteed.
- Never fabricate live prices, company financials, news, or citations. Unless data is explicitly supplied in the chat,
  say that you cannot verify the latest value and direct the user to the app's company page or an official exchange filing.
- Distinguish factual explanations from opinions and state important assumptions.
- Encourage users to consider risk tolerance, time horizon, diversification, and their own research.
- For personalized buy/sell/target-price requests, provide a balanced analytical framework rather than certainty.
- Do not claim to have executed trades or accessed private brokerage accounts.
"""

# In-process memory: four recent user/assistant exchanges. Use Redis/database for multi-worker persistence.
_MAX_MESSAGES = 8
_conversations: dict[str, Deque[tuple[str, str]]] = defaultdict(lambda: deque(maxlen=_MAX_MESSAGES))
_conversation_lock = threading.Lock()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: str = Field(min_length=8, max_length=100, pattern=r"^[a-zA-Z0-9_-]+$")
    company_symbol: str | None = Field(default=None, max_length=20)


class ChatResponse(BaseModel):
    reply: str
    session_id: str


def _generate_reply(message: str, history: list[tuple[str, str]], company_symbol: str | None) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI assistant is not configured yet. Set GEMINI_API_KEY in the backend environment.",
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt_parts = [SYSTEM_PROMPT.strip()]
        if company_symbol:
            prompt_parts.append(
                f"The user is currently viewing company symbol {company_symbol.upper()}. "
                "Use this only as context; no company-specific financial data has been provided automatically."
            )
        for user_message, assistant_message in history:
            prompt_parts.append(f"User: {user_message}\nMarketMate: {assistant_message}")
        prompt_parts.append(f"User: {message}\nMarketMate:")

        response = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            contents="\n\n".join(prompt_parts),
            config=types.GenerateContentConfig(temperature=0.4, max_output_tokens=600),
        )
        reply = (response.text or "").strip()
        if not reply:
            raise RuntimeError("Gemini returned an empty response")
        return reply
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Gemini chat request failed")
        raise HTTPException(
            status_code=502,
            detail="The AI assistant could not generate a reply. Please try again shortly.",
        ) from exc


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    message = request.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Message cannot be empty.")

    with _conversation_lock:
        history = list(_conversations[request.session_id])

    reply = _generate_reply(message, history, request.company_symbol)

    with _conversation_lock:
        _conversations[request.session_id].append((message, reply))

    return ChatResponse(reply=reply, session_id=request.session_id)
