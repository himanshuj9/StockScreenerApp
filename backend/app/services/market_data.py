import yfinance as yf


def get_current_price(yahoo_symbol: str):
    try:
        ticker = yf.Ticker(yahoo_symbol)

        history = ticker.history(
            period="1d",
            interval="1m"
        )

        if history.empty:
            return None

        close_prices = history["Close"].dropna()

        if close_prices.empty:
            return None

        latest_price = close_prices.iloc[-1]

        return float(latest_price)

    except Exception as e:
        print(f"yfinance error for {yahoo_symbol}: {e}")
        return None