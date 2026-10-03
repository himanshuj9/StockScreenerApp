import math

import yfinance as yf


def _safe_float(value):
    """Convert a Yahoo Finance value to a finite float."""
    try:
        if value is None:
            return None

        number = float(value)

        if not math.isfinite(number):
            return None

        return number
    except (TypeError, ValueError):
        return None


def _percentage(value):
    """Convert a decimal ratio such as 0.143 into 14.3."""
    number = _safe_float(value)
    return round(number * 100, 2) if number is not None else None


def _latest_statement_value(statement, *labels):
    """Read the newest available value for one of the supplied statement labels."""
    if statement is None or getattr(statement, "empty", True):
        return None

    for label in labels:
        if label not in statement.index:
            continue

        try:
            row = statement.loc[label].dropna()
            if not row.empty:
                return _safe_float(row.iloc[0])
        except Exception:
            continue

    return None


def _set_metric(metrics, name, value, converter=_safe_float):
    """Add a metric only when Yahoo Finance supplied a usable value."""
    converted = converter(value)

    if converted is not None:
        metrics[name] = converted


def get_market_data(yahoo_symbol: str):
    """
    Fetch live market/fundamental data from Yahoo Finance through yfinance.

    The database is intentionally NOT used for ratios/fundamentals.
    Yahoo Finance may omit fields for some companies, so only metrics that
    are available or safely derivable from Yahoo Finance data are returned.
    """
    result = {
        "current_price": None,
        "fundamentals": {}
    }

    try:
        ticker = yf.Ticker(yahoo_symbol)

        # ---------------------------------------------------------
        # 1. Current market price
        # ---------------------------------------------------------
        fast_info = None

        try:
            fast_info = ticker.fast_info
            result["current_price"] = _safe_float(
                fast_info.get("last_price")
            )
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
                        result["current_price"] = _safe_float(
                            close_prices.iloc[-1]
                        )
            except Exception as exc:
                print(f"history fallback failed for {yahoo_symbol}: {exc}")

        price = result["current_price"]

        # ---------------------------------------------------------
        # 2. Yahoo Finance quote/fundamental information
        # ---------------------------------------------------------
        info = {}

        try:
            # Explicit get_info() makes the source of the fundamentals clear.
            info = ticker.get_info() or {}
        except Exception as exc:
            print(f"Yahoo Finance info failed for {yahoo_symbol}: {exc}")

        metrics = result["fundamentals"]

        # Values supplied directly by Yahoo Finance.
        info_fields = [
            ("Market Cap", "marketCap", _safe_float),
            ("P/E Ratio", "trailingPE", _safe_float),
            ("Forward P/E", "forwardPE", _safe_float),
            ("PEG Ratio", "pegRatio", _safe_float),
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

        for name, field, converter in info_fields:
            _set_metric(metrics, name, info.get(field), converter)

        # fast_info is also Yahoo Finance data and can provide market cap
        # even when the slower quoteSummary/info endpoint omits it.
        if "Market Cap" not in metrics and fast_info is not None:
            try:
                _set_metric(metrics, "Market Cap", fast_info.get("market_cap"))
            except Exception:
                pass

        # ---------------------------------------------------------
        # 3. Safely derive missing ratios from Yahoo Finance
        #    financial statements, never from the SQL ratios table.
        # ---------------------------------------------------------
        income_stmt = None
        balance_sheet = None

        needs_statement_data = any(
            metric not in metrics
            for metric in (
                "EPS",
                "ROE",
                "ROCE",
                "Debt to Equity",
                "Current Ratio",
                "Book Value",
            )
        )

        if needs_statement_data:
            try:
                income_stmt = ticker.income_stmt
            except Exception as exc:
                print(f"income statement failed for {yahoo_symbol}: {exc}")

            try:
                balance_sheet = ticker.balance_sheet
            except Exception as exc:
                print(f"balance sheet failed for {yahoo_symbol}: {exc}")

        net_income = _latest_statement_value(
            income_stmt,
            "Net Income"
        )
        ebit = _latest_statement_value(
            income_stmt,
            "EBIT",
            "Operating Income"
        )
        diluted_shares = _latest_statement_value(
            income_stmt,
            "Diluted Average Shares",
            "Basic Average Shares"
        )

        total_equity = _latest_statement_value(
            balance_sheet,
            "Stockholders Equity",
            "Common Stock Equity",
            "Total Equity Gross Minority Interest"
        )
        total_assets = _latest_statement_value(
            balance_sheet,
            "Total Assets"
        )
        current_assets = _latest_statement_value(
            balance_sheet,
            "Current Assets"
        )
        current_liabilities = _latest_statement_value(
            balance_sheet,
            "Current Liabilities"
        )
        total_debt = _latest_statement_value(
            balance_sheet,
            "Total Debt",
            "Long Term Debt And Capital Lease Obligation"
        )

        # EPS
        if "EPS" not in metrics and net_income is not None and diluted_shares:
            _set_metric(metrics, "EPS", net_income / diluted_shares)

        # Book value per share
        if "Book Value" not in metrics and total_equity is not None and diluted_shares:
            _set_metric(metrics, "Book Value", total_equity / diluted_shares)

        # ROE = Net income / equity
        if "ROE" not in metrics and net_income is not None and total_equity:
            _set_metric(metrics, "ROE", net_income / total_equity, _percentage)

        # ROCE = EBIT / (Total assets - Current liabilities)
        if (
            "ROCE" not in metrics
            and ebit is not None
            and total_assets is not None
            and current_liabilities is not None
        ):
            capital_employed = total_assets - current_liabilities

            if capital_employed != 0:
                _set_metric(
                    metrics,
                    "ROCE",
                    ebit / capital_employed,
                    _percentage
                )

        # Debt / equity
        if (
            "Debt to Equity" not in metrics
            and total_debt is not None
            and total_equity
        ):
            _set_metric(
                metrics,
                "Debt to Equity",
                (total_debt / total_equity) * 100
            )

        # Current ratio
        if (
            "Current Ratio" not in metrics
            and current_assets is not None
            and current_liabilities
        ):
            _set_metric(
                metrics,
                "Current Ratio",
                current_assets / current_liabilities
            )

        # ---------------------------------------------------------
        # 4. Derive valuation metrics from Yahoo Finance values
        # ---------------------------------------------------------
        if "P/E Ratio" not in metrics and price is not None and metrics.get("EPS"):
            eps = metrics["EPS"]

            if eps != 0:
                _set_metric(metrics, "P/E Ratio", price / eps)

        if "Price to Book" not in metrics and price is not None and metrics.get("Book Value"):
            book_value = metrics["Book Value"]

            if book_value != 0:
                _set_metric(metrics, "Price to Book", price / book_value)

        # If Yahoo provides dividendRate rather than dividendYield.
        if "Dividend Yield" not in metrics and price:
            dividend_rate = _safe_float(info.get("dividendRate"))

            if dividend_rate is not None:
                _set_metric(
                    metrics,
                    "Dividend Yield",
                    dividend_rate / price,
                    _percentage
                )

        return result

    except Exception as exc:
        print(f"yfinance error for {yahoo_symbol}: {exc}")
        return result


def get_current_price(yahoo_symbol: str):
    """Backward-compatible helper for code that only needs the price."""
    return get_market_data(yahoo_symbol)["current_price"]


def get_price_history(yahoo_symbol: str, period: str = "500d"):
    """Return daily closing prices for the requested Yahoo Finance period."""
    try:
        ticker = yf.Ticker(yahoo_symbol)
        history = ticker.history(
            period=period,
            interval="1d",
            auto_adjust=False,
        )

        if history.empty:
            return []

        close_prices = history["Close"].dropna().tail(500)

        return [
            {
                "date": index.strftime("%Y-%m-%d"),
                "close": round(float(value), 2),
            }
            for index, value in close_prices.items()
        ]
    except Exception as exc:
        print(f"price history failed for {yahoo_symbol}: {exc}")
        return []
