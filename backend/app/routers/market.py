from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import math

import yfinance as yf
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/market",
    tags=["Market"],
)

# Yahoo Finance symbols for the indices shown in the home-page marquee.
# ^CNXSC is the Yahoo/yfinance symbol commonly used for Nifty Smallcap 100.
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
    Get the latest available price and previous close from Yahoo Finance.

    fast_info is attempted first. If Yahoo does not return it for an index,
    the endpoint falls back to recent 1-minute/daily history.
    """
    ticker = yf.Ticker(yahoo_symbol)

    current_price = None
    previous_close = None

    try:
        fast_info = ticker.fast_info
        current_price = _safe_float(fast_info.get("last_price"))
        previous_close = _safe_float(fast_info.get("previous_close"))
    except Exception as exc:
        print(f"fast_info failed for {yahoo_symbol}: {exc}")

    # During market hours, 1-minute history gives us the latest available
    # intraday point when fast_info is unavailable.
    try:
        intraday = ticker.history(
            period="1d",
            interval="1m",
            prepost=False,
            auto_adjust=False,
        )

        if current_price is None and not intraday.empty:
            close_prices = intraday["Close"].dropna()
            if not close_prices.empty:
                current_price = _safe_float(close_prices.iloc[-1])
    except Exception as exc:
        print(f"intraday fallback failed for {yahoo_symbol}: {exc}")

    # Daily history supplies a reliable previous close and also works when
    # the market is closed and no intraday candle is available.
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

            if previous_close is None and len(close_prices) >= 2:
                previous_close = _safe_float(close_prices.iloc[-2])

    except Exception as exc:
        print(f"daily fallback failed for {yahoo_symbol}: {exc}")

    if current_price is None:
        return None

    # Some Yahoo index responses do not expose previous_close through
    # fast_info. In that case, without a previous close we cannot calculate
    # a trustworthy daily percentage change.
    if previous_close is None:
        return {
            "price": round(current_price, 2),
            "change": None,
            "change_percent": None,
        }

    change = current_price - previous_close
    change_percent = (change / previous_close) * 100 if previous_close else None

    return {
        "price": round(current_price, 2),
        "change": round(change, 2),
        "change_percent": round(change_percent, 2) if change_percent is not None else None,
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
            }),
        }
    except Exception as exc:
        print(f"Index fetch failed for {index['ticker']}: {exc}")

        return {
            **index,
            "price": None,
            "change": None,
            "change_percent": None,
        }


@router.get("/indices")
def get_market_indices():
    """
    Return the latest available Yahoo Finance levels for the home-page marquee.

    The requests are fetched concurrently so one slow index does not make the
    entire marquee wait for eleven sequential Yahoo Finance calls.
    """
    results = [None] * len(INDEXES)

    with ThreadPoolExecutor(max_workers=len(INDEXES)) as executor:
        futures = {
            executor.submit(_fetch_index, index): position
            for position, index in enumerate(INDEXES)
        }

        for future in as_completed(futures):
            position = futures[future]
            results[position] = future.result()

    return {
        "source": "Yahoo Finance via yfinance",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "indices": results,
    }
