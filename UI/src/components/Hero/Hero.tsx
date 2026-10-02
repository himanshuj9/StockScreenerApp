import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCompanies } from "../../services/api";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (queryOverride?: string) => {
    const query = (queryOverride ?? searchQuery).trim();
    if (!query || searching) return;

    try {
      setSearching(true);
      const results = await searchCompanies(query);
      if (results.length === 0) {
        alert("Company not found");
        return;
      }
      navigate(`/company/${results[0].symbol}`);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Unable to search companies");
    } finally {
      setSearching(false);
    }
  };

  const quickSearches = ["Tata Motors", "TCS", "Reliance", "Infosys"];
  const sectors = [
    "Banks",
    "Pharmaceuticals",
    "Power",
    "Consumer Durables",
    "Telecom",
    "Auto Components",
    "Insurance",
    "Capital Markets",
    "Chemicals",
    "IT Services",
    "Metals & Mining",
    "Cement",
  ];

  return (
    <div className="market-shell">
      <section className="market-ticker border-b border-slate-200 bg-white" aria-label="Market snapshot">
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-5 py-2.5 sm:px-6">
          {[
            ["NIFTY 50", "22,421.95", "−0.88%"],
            ["NIFTY BANK", "54,450.75", "−0.33%"],
            ["NIFTY 100", "23,516.50", "−0.92%"],
            ["NIFTY FIN SERVICE", "24,556.10", "−0.38%"],
          ].map(([name, value, change]) => (
            <div key={name} className="ticker-item flex shrink-0 items-center gap-3 px-5 first:pl-0 last:border-0">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{name}</span>
              <span className="text-sm font-semibold text-slate-800">{value}</span>
              <span className="text-xs font-bold text-rose-500">↓ {change.replace("−", "-")}</span>
            </div>
          ))}
        </div>
      </section>

      <main className="market-grid relative overflow-hidden">
        <div className="hero-glow" />
        <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Data-driven stock research
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Find the next stock worth <span className="bg-gradient-to-r from-violet-700 via-violet-600 to-orange-500 bg-clip-text text-transparent">researching.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Search Indian companies, explore financial fundamentals, and move from market data to deeper analysis in seconds.
          </p>

          <div id="screener" className="search-shell relative z-20 mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 sm:p-2.5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center rounded-xl border border-transparent bg-slate-50 px-4 focus-within:border-violet-300 focus-within:bg-white">
                <svg className="mr-3 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                  placeholder="Search company or ticker..."
                  className="w-full bg-transparent px-0 py-3.5 text-base text-slate-900 outline-none placeholder:text-slate-400"
                  aria-label="Search company or ticker"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={searching}
                className="home-search-button violet-accent relative z-20 flex shrink-0 items-center justify-center rounded-xl px-7 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="px-1 py-2 text-sm font-semibold text-slate-500">Popular:</span>
            {quickSearches.map((item) => (
              <button
                key={item}
                onClick={() => { setSearchQuery(item); handleSearch(item); }}
                className="pill rounded-full px-3.5 py-2 text-sm font-semibold"
              >
                {item}
              </button>
            ))}
          </div>

          <section id="markets" className="mx-auto mt-14 max-w-5xl text-left">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-700">Explore the market</p>
                <h2 className="section-heading mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Browse by sector</h2>
              </div>
              <span className="hidden rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 sm:inline-flex">2000+ equities</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sectors.map((sector, index) => (
                <button key={sector} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${index % 4 === 0 ? "border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300" : index % 4 === 1 ? "border-yellow-200 bg-yellow-50 text-yellow-800 hover:border-yellow-300" : index % 4 === 2 ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300" : "border-orange-200 bg-orange-50 text-orange-800 hover:border-orange-300"}`}>
                  {sector}
                </button>
              ))}
            </div>
          </section>

          <section id="about" className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              ["01", "Search fast", "Find a company by name or NSE ticker and jump directly to its profile."],
              ["02", "Read fundamentals", "Review ratios, financial results, balance sheet data and shareholding."],
              ["03", "Research in context", "Combine structured company data with current market price information."],
            ].map(([number, title, body], index) => (
              <div key={title} className="market-card market-card-hover rounded-2xl p-6">
                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${index === 0 ? "bg-violet-100 text-violet-800" : index === 1 ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800"}`}>
                  {number}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Hero;
