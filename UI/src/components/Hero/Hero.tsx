import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCompanies } from "../../services/api";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    try {
      console.log("Searching for:", query);

      // Search database using company name OR symbol
      const results = await searchCompanies(query);

      console.log("Search results:", results);

      if (results.length === 0) {
        alert("Company not found");
        return;
      }

      // Take the first matching company
      const company = results[0];

      console.log("Selected company:", company);

      // Navigate using the actual symbol returned by database
      navigate(`/company/${company.symbol}`);

    } catch (error) {
      console.error("Search failed:", error);
      alert("Unable to search companies");
    }
  };

  return (
    <section className="px-6 py-24 text-center">

      <h1 className="text-5xl font-bold tracking-tight text-white">
        Analyze stocks. Invest smarter.
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
        Search and analyze Indian companies using financial
        fundamentals and market data.
      </p>

      <div className="mx-auto mt-10 flex max-w-2xl gap-3">

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search company or ticker..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
        />

        <button
          onClick={handleSearch}
          className="rounded-lg bg-white px-6 py-3 text-slate-900"
        >
          Search
        </button>

      </div>

      <p className="mt-5 text-sm text-slate-500">
        Popular: Tata Motors · TCS · Reliance · Infosys
      </p>

    </section>
  );
}

export default Hero;