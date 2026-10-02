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

  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        <p className="mx-auto mb-6 inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700">
          Data-driven stock research
        </p>
        <h1 className="text-5xl font-black tracking-tight text-slate-950">
          Analyze stocks. <span className="text-violet-700">Invest smarter.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Search and analyze Indian companies using financial fundamentals and market data.
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-violet-400 focus-within:bg-white">
            <svg className="mr-3 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") handleSearch(); }}
              placeholder="Search company or ticker..."
              className="w-full bg-transparent px-0 py-3.5 text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={searching}
            className="shrink-0 rounded-xl bg-violet-700 px-8 py-3.5 font-bold text-white shadow-md transition hover:bg-violet-800 hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-semibold text-slate-500">Popular:</span>
          {["Tata Motors", "TCS", "Reliance", "Infosys"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => { setSearchQuery(item); handleSearch(item); }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
