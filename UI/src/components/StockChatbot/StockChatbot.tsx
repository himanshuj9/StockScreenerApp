import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatApiResponse = { reply: string; session_id: string };

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://stockscreenerapp-fb4k.onrender.com";
const SESSION_STORAGE_KEY = "stockscreener_chat_session_v1";

function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().replace(/-/g, "");
  return `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}
function getSessionId(): string {
  try {
    const saved = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) return saved;
    const created = makeSessionId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return makeSessionId();
  }
}

export default function StockChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I’m MarketMate, your StockScreener AI assistant. Ask me about valuation ratios, financial statements, Indian markets, or how to analyze a company." },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const companySymbol = location.pathname.match(/^\/company\/([^/]+)/i)?.[1];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, session_id: sessionId, ...(companySymbol ? { company_symbol: companySymbol.toUpperCase() } : {}) }),
      });
      const data = (await response.json().catch(() => ({}))) as ChatApiResponse | { detail?: string };
      if (!response.ok) {
        const detail = "detail" in data ? data.detail : undefined;
        throw new Error(detail || "Unable to reach the AI assistant. Please try again.");
      }
      setMessages((current) => [...current, { role: "assistant", content: (data as ChatApiResponse).reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: `Sorry — ${error instanceof Error ? error.message : "Something went wrong. Please try again."}` }]);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    const nextSessionId = makeSessionId();
    setSessionId(nextSessionId);
    setMessages([{ role: "assistant", content: "New chat started. Ask me about Indian equities, stock-market concepts, or company financial metrics." }]);
    try { window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId); } catch { /* Session storage is optional. */ }
  }

  return (
    <div className="stock-chatbot-root">
      {open && (
        <section className="stock-chatbot-panel" aria-label="StockScreener AI chat">
          <header className="stock-chatbot-header">
            <div className="stock-chatbot-avatar" aria-hidden="true">M</div>
            <div className="min-w-0 flex-1">
              <div className="stock-chatbot-title">MarketMate AI</div>
              <div className="stock-chatbot-subtitle">{companySymbol ? `Context: ${companySymbol.toUpperCase()}` : "Indian equity research assistant"}</div>
            </div>
            <button type="button" className="stock-chatbot-icon-button" onClick={startNewChat} title="Start a new chat" aria-label="Start a new chat">↻</button>
            <button type="button" className="stock-chatbot-icon-button" onClick={() => setOpen(false)} title="Close chat" aria-label="Close chat">×</button>
          </header>
          <div className="stock-chatbot-messages" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`stock-chatbot-message-row ${message.role === "user" ? "is-user" : "is-assistant"}`}>
                <div className="stock-chatbot-message">
                  {message.content.split("\n").map((line, lineIndex, lines) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}
                </div>
              </div>
            ))}
            {loading && <div className="stock-chatbot-message-row is-assistant"><div className="stock-chatbot-message stock-chatbot-typing">MarketMate is thinking…</div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="stock-chatbot-suggestions">
            {["Explain P/E ratio", "What is ROCE?", "How do I analyze a stock?"].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => setInput(suggestion)} disabled={loading}>{suggestion}</button>
            ))}
          </div>
          <form className="stock-chatbot-form" onSubmit={sendMessage}>
            <label className="sr-only" htmlFor="stock-chatbot-input">Message MarketMate</label>
            <textarea id="stock-chatbot-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a stock or market concept…" rows={1} maxLength={2000} onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); }
            }} disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">{loading ? "…" : "↑"}</button>
          </form>
          <div className="stock-chatbot-disclaimer">Educational use only — not investment advice. Verify figures from official sources.</div>
        </section>
      )}
      <button type="button" className="stock-chatbot-launcher" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close MarketMate AI chat" : "Open MarketMate AI chat"} aria-expanded={open}>
        {open ? <span aria-hidden="true">×</span> : <><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 18.4 3.8 21l4.1-1.2c1.2.6 2.6.9 4.1.9 5.1 0 9.2-3.7 9.2-8.3S17.1 4 12 4 2.8 7.7 2.8 12.3c0 2.4.8 4.5 2.2 6.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg><span>AI Assistant</span></>}
      </button>
    </div>
  );
}
