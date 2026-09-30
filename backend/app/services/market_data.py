import yfinance as yf


def get_current_price(yahoo_symbol: str):
    try:
        ticker = yf.Ticker(yahoo_symbol)

        # First try the regular market quote.
        try:
            fast_info = ticker.fast_info

            last_price = fast_info.get("last_price")

            if last_price is not None:
                return float(last_price)

        except Exception as e:
            print(f"fast_info failed for {yahoo_symbol}: {e}")

        # Fallback: use recent daily history.
        history = ticker.history(
            period="5d",
            interval="1d",
            auto_adjust=False
        )

        if history.empty:
            print(f"No historical data found for {yahoo_symbol}")
            return None

        close_prices = history["Close"].dropna()

        if close_prices.empty:
            print(f"No close price found for {yahoo_symbol}")
            return None

        latest_price = close_prices.iloc[-1]

        return float(latest_price)

    except Exception as e:
        print(f"yfinance error for {yahoo_symbol}: {e}")
        return None
