from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import math

import yfinance as yf
from fastapi import APIRouter

router = APIRouter(prefix="/api/market", tags=["Market"])

# Yahoo Finance symbols for the indices shown in the home-page marquee.
INDEXES = [
    {"name": "Nifty 50", "ticker": "^NSEI"},
    {"name": "Nifty Next 50", "ticker": "^NSMIDCP"},
    {"name": "Nifty 100", "ticker": "^CNX100"},
    {"name": "Nifty Midcap 50", "ticker": "^NSEMDCP50"},
    {"name": "Nifty Smallcap 100", "ticker": "^CNXSC"},
    {"name": "Nifty Bank", "ticker": "^NSEBANK"},
    {"name": "Nifty IT", "ticker": "^CNXIT"},
    {"name": "Nifty FMCG", "ticker": "^CNXFMCG"},
    {"name": "Nifty Pharma", "ticker": "^CNXPHARMA"},
    {"name": "Nifty Infrastructure", "ticker": "^CNXINFRA"},
    {"name": "Nifty 50 Dividend Points", "ticker": "^NSEDIV"},
]


def _safe_float(value):
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def _latest_price_data(yahoo_symbol: str):
    """
    Prefer the newest available one-minute candle over fast_info.

    fast_info can be cached/stale, so it should only be used when intraday
    history is unavailable. Yahoo Finance data may itself be delayed.
    """
    ticker = yf.Ticker(yahoo_symbol)
    current_price = None
    previous_close = None
    price_timestamp = None

    # First choice: newest available intraday candle. Do not let a potentially
    # cached fast_info value override this newer observation.
    try:
        intraday = ticker.history(
            period="1d",
            interval="1m",
            prepost=False,
            auto_adjust=False,
        )
        if not intraday.empty:
            close_prices = intraday["Close"].dropna()
            if not close_prices.empty:
                current_price = _safe_float(close_prices.iloc[-1])
                if current_price is not None:
                    price_timestamp = intraday.index[-1].isoformat()
    except Exception as exc:
        print(f"intraday history failed for {yahoo_symbol}: {exc}")

    # Daily history provides the previous trading day's close and a fallback
    # price when intraday data is unavailable (for example, market holidays).
    try:
        daily = ticker.history(
            period="5d",
            interval="1d",
            prepost=False,
            auto_adjust=False,
        )
        if not daily.empty:
            close_prices = daily["Close"].dropna()
            if current_price is None and not close_prices.empty:
                current_price = _safe_float(close_prices.iloc[-1])
                if current_price is not None:
                    price_timestamp = daily.index[-1].isoformat()
            if len(close_prices) >= 2:
                previous_close = _safe_float(close_prices.iloc[-2])
            elif len(close_prices) == 1:
                previous_close = _safe_float(close_prices.iloc[-1])
    except Exception as exc:
        print(f"daily history failed for {yahoo_symbol}: {exc}")

    # Use fast_info only as a fallback, not as the preferred live price.
    try:
        fast_info = ticker.fast_info
        if current_price is None:
            current_price = _safe_float(fast_info.get("last_price"))
        if previous_close is None:
            previous_close = _safe_float(fast_info.get("previous_close"))
    except Exception as exc:
        print(f"fast_info fallback failed for {yahoo_symbol}: {exc}")

    if current_price is None:
        return None

    change = None
    change_percent = None
    if previous_close is not None:
        change = current_price - previous_close
        if previous_close:
            change_percent = (change / previous_close) * 100

    return {
        "price": round(current_price, 2),
        "change": round(change, 2) if change is not None else None,
        "change_percent": round(change_percent, 2) if change_percent is not None else None,
        "price_timestamp": price_timestamp,
    }


def _fetch_index(index):
    try:
        data = _latest_price_data(index["ticker"])
        return {
            **index,
            **(data or {
                "price": None,
                "change": None,
                "change_percent": None,
                "price_timestamp": None,
            }),
        }
    except Exception as exc:
        print(f"Index fetch failed for {index['ticker']}: {exc}")
        return {
            **index,
            "price": None,
            "change": None,
            "change_percent": None,
            "price_timestamp": None,
        }


@router.get("/indices")
def get_market_indices():
    """Return the latest available Yahoo Finance index prices concurrently."""
    results = [None] * len(INDEXES)

    with ThreadPoolExecutor(max_workers=min(len(INDEXES), 6)) as executor:
        futures = {
            executor.submit(_fetch_index, index): position
            for position, index in enumerate(INDEXES)
        }
        for future in as_completed(futures):
            results[futures[future]] = future.result()

    return {
        "source": "Yahoo Finance via yfinance",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "indices": results,
    }
