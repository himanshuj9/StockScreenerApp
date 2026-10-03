import { useEffect, useState } from "react";
import { getMarketIndices } from "../../services/api";

type MarketIndex = {
  name: string;
  ticker: string;
  price: number | null;
  change: number | null;
  change_percent: number | null;
};

type MarketResponse = {
  source: string;
  updated_at: string;
  indices: MarketIndex[];
};

function formatNumber(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function MarketItem({ item }: { item: MarketIndex }) {
  const isPositive = (item.change_percent ?? 0) >= 0;
  const hasChange = item.change_percent !== null;

  return (
    <div className="market-marquee-item">
      <span className="market-marquee-name">{item.name}</span>
      <span className="market-marquee-price">
        {formatNumber(item.price)}
      </span>

      {hasChange ? (
        <span
          className={
            isPositive
              ? "market-marquee-change market-marquee-positive"
              : "market-marquee-change market-marquee-negative"
          }
        >
          {isPositive ? "↑" : "↓"}{" "}
          {Math.abs(item.change_percent ?? 0).toFixed(2)}%
        </span>
      ) : (
        <span className="market-marquee-change market-marquee-muted">
          —
        </span>
      )}
    </div>
  );
}

function MarketMarquee() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadIndices = async () => {
      try {
        const data: MarketResponse = await getMarketIndices();

        if (mounted) {
          setIndices(data.indices.filter((item) => item.price !== null));
        }
      } catch (error) {
        console.error("Market indices failed:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadIndices();

    // Refresh the marquee regularly so it does not remain on stale levels.
    const intervalId = window.setInterval(loadIndices, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const items = loading && indices.length === 0 ? Array(6).fill(null) : indices;

  return (
    <section
      className="market-marquee"
      aria-label="Live market indices"
      title="Market data is refreshed every 30 seconds"
    >
      <div className="market-marquee-header">
        <span className="market-live-dot" aria-hidden="true" />
        <span>MARKET DATA</span>
      </div>

      <div className="market-marquee-viewport">
        <div className="market-marquee-track">
          <div className="market-marquee-group">
            {items.map((item, index) =>
              item ? (
                <MarketItem key={item.ticker} item={item} />
              ) : (
                <div className="market-marquee-item market-marquee-skeleton" key={index}>
                  <span />
                  <span />
                  <span />
                </div>
              )
            )}
          </div>

          {!loading && indices.length > 0 && (
            <div className="market-marquee-group" aria-hidden="true">
              {indices.map((item) => (
                <MarketItem key={`duplicate-${item.ticker}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketMarquee;
