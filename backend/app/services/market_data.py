import yfinance as yf


def _safe_float(value):
    """Convert Yahoo Finance values to float when possible."""
    try:
        if value is None:
            return None

        number = float(value)

        # Ignore NaN / infinite values returned by Yahoo Finance.
        if number != number or number in (float("inf"), float("-inf")):
            return None

        return number
    except (TypeError, ValueError):
        return None


def _percentage(value):
    """Convert a decimal ratio such as 0.143 into 14.3."""
    number = _safe_float(value)
    return round(number * 100, 2) if number is not None else None


def get_market_data(yahoo_symbol: str):
    """
    Fetch the current price and currently available fundamental metrics
    directly from Yahoo Finance through yfinance.

    Yahoo Finance does not guarantee that every field exists for every
    company, so only fields that are actually returned are included.
    """
    result = {
        "current_price": None,
        "fundamentals": {}
    }

    try:
        ticker = yf.Ticker(yahoo_symbol)

        # -----------------------------
        # Current market price
        # -----------------------------
        try:
            fast_info = ticker.fast_info
            result["current_price"] = _safe_float(fast_info.get("last_price"))

        except Exception as exc:
            print(f"fast_info failed for {yahoo_symbol}: {exc}")

        if result["current_price"] is None:
            try:
                history = ticker.history(
                    period="5d",
                    interval="1d",
                    auto_adjust=False
                )

                if not history.empty:
                    close_prices = history["Close"].dropna()
                    if not close_prices.empty:
                        result["current_price"] = _safe_float(close_prices.iloc[-1])

            except Exception as exc:
                print(f"history fallback failed for {yahoo_symbol}: {exc}")

        # -----------------------------
        # Dynamic fundamental metrics
        # -----------------------------
        try:
            info = ticker.info or {}

            # Each tuple contains:
            # (display name, Yahoo Finance field, conversion function)
            metric_fields = [
                ("Market Cap", "marketCap", _safe_float),
                ("P/E Ratio", "trailingPE", _safe_float),
                ("Forward P/E", "forwardPE", _safe_float),
                ("Price to Book", "priceToBook", _safe_float),
                ("Book Value", "bookValue", _safe_float),
                ("ROE", "returnOnEquity", _percentage),
                ("ROA", "returnOnAssets", _percentage),
                ("ROCE", "returnOnCapital", _percentage),
                ("EPS", "trailingEps", _safe_float),
                ("Forward EPS", "forwardEps", _safe_float),
                ("Dividend Yield", "dividendYield", _percentage),
                ("Debt to Equity", "debtToEquity", _safe_float),
                ("Current Ratio", "currentRatio", _safe_float),
                ("Quick Ratio", "quickRatio", _safe_float),
                ("Profit Margin", "profitMargins", _percentage),
                ("Operating Margin", "operatingMargins", _percentage),
                ("Gross Margin", "grossMargins", _percentage),
                ("Price to Sales", "priceToSalesTrailing12Months", _safe_float),
                ("Enterprise Value", "enterpriseValue", _safe_float),
                ("EV / EBITDA", "enterpriseToEbitda", _safe_float),
                ("Beta", "beta", _safe_float),
                ("52W High", "fiftyTwoWeekHigh", _safe_float),
                ("52W Low", "fiftyTwoWeekLow", _safe_float),
            ]

            for display_name, yahoo_field, converter in metric_fields:
                value = converter(info.get(yahoo_field))

                # Only expose metrics Yahoo Finance actually returned.
                if value is not None:
                    result["fundamentals"][display_name] = value

        except Exception as exc:
            print(f"fundamental data failed for {yahoo_symbol}: {exc}")

    except Exception as exc:
        print(f"yfinance error for {yahoo_symbol}: {exc}")

    return result


def get_current_price(yahoo_symbol: str):
    """Backward-compatible helper for code that only needs the price."""
    return get_market_data(yahoo_symbol)["current_price"]
