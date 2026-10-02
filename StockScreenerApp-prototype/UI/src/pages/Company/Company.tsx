import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompany, searchCompanies } from "../../services/api";

type Tab = "Overview" | "Chart" | "Profit & Loss" | "Balance Sheet" | "Cash Flow" | "Ratios" | "Shareholding";

function Company() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!symbol) return;
      try {
        setLoading(true);
        setError("");
        const data = await getCompany(symbol);
        setCompanyData(data);
      } catch (err) {
        console.error("Failed to load company:", err);
        setError("Unable to load company data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [symbol]);

  const handleCompanySearch = async () => {
    const query = searchQuery.trim();
    if (!query || searching) return;
    try {
      setSearching(true);
      const results = await searchCompanies(query);
      if (results.length === 0) {
        alert("Company not found");
        return;
      }
      setSearchQuery("");
      setActiveTab("Overview");
      navigate(`/company/${results[0].symbol}`);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Unable to search companies");
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-slate-700"><p className="text-lg">Loading company data...</p></div>;
  }
  if (error || !companyData) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-slate-700"><p className="text-lg text-red-500">{error || "Company not found"}</p></div>;
  }

  const company = companyData.company;
  const ratios = companyData.ratios || {};
  const information = companyData.information || {};
  const financials = companyData.financials || [];
  const shareholding = companyData.shareholding || [];
  const balanceSheet = companyData.balance_sheet || [];
  const tabs: Tab[] = ["Overview", "Chart", "Profit & Loss", "Balance Sheet", "Cash Flow", "Ratios", "Shareholding"];

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-lg leading-none">←</span> Back
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">NSE: {company.symbol}</p>
              <h1 className="mt-1 truncate text-xl font-black sm:text-2xl">{company.company_name}</h1>
            </div>

            <div className="order-last w-full sm:order-none sm:w-auto sm:min-w-[280px]">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-400 focus-within:bg-white">
                <svg className="mr-2 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") handleCompanySearch(); }}
                  placeholder="Search another company..."
                  className="w-full bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button type="button" onClick={handleCompanySearch} disabled={searching} className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white hover:bg-violet-800 disabled:opacity-60">
                  {searching ? "..." : "Search"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2.5 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Current Price</p>
              <p className="text-lg font-black text-slate-950">₹{companyData.market_data?.current_price ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 sm:px-6">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? "border-b-2 border-violet-700 py-4 text-sm font-bold whitespace-nowrap text-violet-700" : "py-4 text-sm text-slate-500 hover:text-violet-700 whitespace-nowrap"}>
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        {activeTab === "Overview" && <OverviewTab ratios={ratios} information={information} />}
        {activeTab === "Chart" && <ChartTab financials={financials} />}
        {activeTab === "Profit & Loss" && <ProfitLossTab financials={financials} />}
        {activeTab === "Balance Sheet" && <BalanceSheetTab balanceSheet={balanceSheet} />}
        {activeTab === "Cash Flow" && <CashFlowTab />}
        {activeTab === "Ratios" && <RatiosTab ratios={ratios} />}
        {activeTab === "Shareholding" && <ShareholdingTab shareholding={shareholding} />}
      </main>
    </div>
  );
}

/* Keep the existing tab components below unchanged. */
function OverviewTab({ ratios, information }: { ratios: any; information: any }) {
  return (<><h2 className="text-2xl font-semibold">Company Overview</h2><section className="mt-6"><h3 className="mb-4 text-lg font-medium text-slate-600">Key Metrics</h3><div className="grid grid-cols-2 gap-4 md:grid-cols-4"><MetricCard title="Market Cap" value={ratios["Market Cap"]}/><MetricCard title="Stock P/E" value={ratios["Stock PE"]}/><MetricCard title="Book Value" value={ratios["Book Value"]}/><MetricCard title="ROE" value={ratios["ROE"]}/><MetricCard title="ROCE" value={ratios["ROCE"]}/><MetricCard title="EPS" value={ratios["EPS"]}/><MetricCard title="Dividend Yield" value={ratios["Dividend Yield"]}/><MetricCard title="Debt to Equity" value={ratios["Debt to Equity"]}/></div></section><section className="mt-10"><h3 className="text-lg font-medium text-slate-600">About</h3><div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="leading-7 text-slate-600">{information.about || "No company information available."}</p></div></section><section className="mt-8"><h3 className="text-lg font-medium text-slate-600">Key Points</h3><div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="leading-7 text-slate-600">{information.key_points || "No key points available."}</p></div></section></>);
}
function ChartTab({ financials }: { financials: any[] }) { return (<><h2 className="text-2xl font-semibold">Financial Chart</h2><p className="mt-2 text-slate-500">Financial performance over time.</p><div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{financials.length === 0 ? <p className="text-slate-500">No financial data available.</p> : <div className="space-y-6">{financials.map((item:any,index:number)=>{const numericValues=Object.entries(item).filter(([key,value])=>key!=="year"&&key!=="quarter"&&typeof value==="number");return <div key={index} className="border-b border-slate-100 pb-5 last:border-0"><div className="mb-3 text-sm font-medium text-violet-700">{item.year}{item.quarter? ` - ${item.quarter}`:""}</div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{numericValues.map(([key,value])=><div key={key}><p className="text-xs text-slate-400">{key}</p><p className="mt-1 text-lg font-semibold text-slate-900">{String(value)}</p></div>)}</div></div>})}</div>}</div></>); }
function ProfitLossTab({ financials }: { financials:any[] }) { if(!financials.length)return <><h2 className="text-2xl font-semibold">Profit & Loss</h2><p className="mt-6 text-slate-500">No financial results available.</p></>; const columns=Object.keys(financials[0]); return <><h2 className="text-2xl font-semibold">Profit & Loss</h2><p className="mt-2 text-slate-500">Financial results from the database.</p><div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left"><thead className="bg-slate-50"><tr>{columns.map(column=><th key={column} className="px-5 py-4 text-sm font-medium text-slate-500">{column}</th>)}</tr></thead><tbody>{financials.map((row:any,index:number)=><tr key={index} className="border-t border-slate-100">{columns.map(column=><td key={column} className="px-5 py-4 text-sm text-slate-700">{row[column]??"N/A"}</td>)}</tr>)}</tbody></table></div></>; }
function BalanceSheetTab({ balanceSheet }: { balanceSheet:any[] }) { if(!balanceSheet.length)return <><h2 className="text-2xl font-semibold">Balance Sheet</h2><p className="mt-6 text-slate-500">No balance sheet data available.</p></>; const columns=Object.keys(balanceSheet[0]); return <><h2 className="text-2xl font-semibold">Balance Sheet</h2><p className="mt-2 text-slate-500">Annual balance sheet information.</p><div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left"><thead className="bg-slate-50"><tr>{columns.map(column=><th key={column} className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-500">{column.replaceAll("_"," ")}</th>)}</tr></thead><tbody>{balanceSheet.map((row:any,index:number)=><tr key={index} className="border-t border-slate-100">{columns.map(column=><td key={column} className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{row[column]??"N/A"}</td>)}</tr>)}</tbody></table></div></>; }
function CashFlowTab(){return <><h2 className="text-2xl font-semibold">Cash Flow</h2><div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-slate-600">Cash flow data is not currently being returned by the backend API.</p><p className="mt-2 text-sm text-slate-500">We will connect this section to the MySQL cash flow table next.</p></div></>;}
function RatiosTab({ratios}:{ratios:any}){return <><h2 className="text-2xl font-semibold">Financial Ratios</h2><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{Object.entries(ratios).map(([name,value])=><MetricCard key={name} title={name} value={value}/>)}</div></>;}
function ShareholdingTab({shareholding}:{shareholding:any[]}){if(!shareholding.length)return <><h2 className="text-2xl font-semibold">Shareholding Pattern</h2><p className="mt-6 text-slate-500">No shareholding data available.</p></>; const columns=Object.keys(shareholding[0]); return <><h2 className="text-2xl font-semibold">Shareholding Pattern</h2><p className="mt-2 text-slate-500">Quarterly shareholding information.</p><div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left"><thead className="bg-slate-50"><tr>{columns.map(column=><th key={column} className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-500">{column.replaceAll("_"," ")}</th>)}</tr></thead><tbody>{shareholding.map((row:any,index:number)=><tr key={index} className="border-t border-slate-100">{columns.map(column=><td key={column} className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{row[column]??"N/A"}</td>)}</tr>)}</tbody></table></div></>;}
function MetricCard({title,value}:{title:string;value:any}){return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-xl font-semibold text-slate-900">{value??"N/A"}</p></div>;}
export default Company;
