import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompany } from "../../services/api";

type Tab =
  | "Overview"
  | "Chart"
  | "Profit & Loss"
  | "Balance Sheet"
  | "Cash Flow"
  | "Ratios"
  | "Shareholding";

function Company() {
  const { symbol } = useParams();
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

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

  if (loading) return <StatusScreen label="Loading company data..." />;
  if (error || !companyData) return <StatusScreen label={error || "Company not found"} error />;

  const company = companyData.company;
  const ratios = companyData.ratios || {};
  const information = companyData.information || {};
  const financials = companyData.financials || [];
  const shareholding = companyData.shareholding || [];
  const balanceSheet = companyData.balance_sheet || [];
  const tabs: Tab[] = ["Overview", "Chart", "Profit & Loss", "Balance Sheet", "Cash Flow", "Ratios", "Shareholding"];

  return (
    <div className="company-shell">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="brand-mark" aria-label="Back to home" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">NSE: {company.symbol}</p>
                <h1 className="mt-0.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{company.company_name}</h1>
              </div>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-3 text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current price</p>
              <p className="mt-0.5 text-xl font-black text-slate-950">₹{companyData.market_data?.current_price ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 sm:px-6">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`company-tab shrink-0 py-4 text-sm whitespace-nowrap ${activeTab === tab ? "company-tab-active" : ""}`}>
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
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

function StatusScreen({ label, error = false }: { label: string; error?: boolean }) {
  return (
    <div className="company-shell flex min-h-screen items-center justify-center px-6 text-center">
      <div className="market-card rounded-2xl px-8 py-10">
        <div className={`mx-auto h-12 w-12 rounded-2xl ${error ? "bg-rose-100" : "bg-violet-100"}`} />
        <p className={`mt-4 text-lg font-bold ${error ? "text-rose-600" : "text-slate-700"}`}>{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({ ratios, information }: { ratios: any; information: any }) {
  return (
    <>
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-700">Company research</p>
        <h2 className="section-heading mt-1 text-3xl font-black text-slate-950">Overview</h2>
        <p className="mt-2 text-sm text-slate-500">Key valuation, profitability and capital structure metrics.</p>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">Key metrics</h3>
          <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700">Fundamentals</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard title="Market Cap" value={ratios["Market Cap"]} />
          <MetricCard title="Stock P/E" value={ratios["Stock PE"]} />
          <MetricCard title="Book Value" value={ratios["Book Value"]} />
          <MetricCard title="ROE" value={ratios["ROE"]} />
          <MetricCard title="ROCE" value={ratios["ROCE"]} />
          <MetricCard title="EPS" value={ratios["EPS"]} />
          <MetricCard title="Dividend Yield" value={ratios["Dividend Yield"]} />
          <MetricCard title="Debt to Equity" value={ratios["Debt to Equity"]} />
        </div>
      </section>

      <InfoBlock title="About" content={information.about || "No company information available."} />
      <InfoBlock title="Key points" content={information.key_points || "No key points available."} />
    </>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="mt-8">
      <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
      <div className="market-card mt-3 rounded-2xl p-6">
        <p className="leading-7 text-slate-600">{content}</p>
      </div>
    </section>
  );
}

function ChartTab({ financials }: { financials: any[] }) {
  return (
    <DataSection title="Financial chart" subtitle="Financial performance over time.">
      {financials.length === 0 ? <EmptyState text="No financial data available." /> : (
        <div className="space-y-0">
          {financials.map((item: any, index: number) => {
            const numericValues = Object.entries(item).filter(([key, value]) => key !== "year" && key !== "quarter" && typeof value === "number");
            return (
              <div key={index} className="border-b border-slate-100 px-6 py-5 last:border-0 hover:bg-slate-50">
                <div className="mb-4 text-sm font-bold text-violet-800">{item.year}{item.quarter ? ` · ${item.quarter}` : ""}</div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {numericValues.map(([key, value]) => <div key={key}><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key}</p><p className="mt-1 text-lg font-black text-slate-900">{String(value)}</p></div>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DataSection>
  );
}

function ProfitLossTab({ financials }: { financials: any[] }) {
  if (financials.length === 0) return <DataSection title="Profit & Loss" subtitle="Financial results from the database."><EmptyState text="No financial results available." /></DataSection>;
  return <TableSection title="Profit & Loss" subtitle="Financial results from the database." rows={financials} />;
}

function BalanceSheetTab({ balanceSheet }: { balanceSheet: any[] }) {
  if (balanceSheet.length === 0) return <DataSection title="Balance Sheet" subtitle="Annual balance sheet information."><EmptyState text="No balance sheet data available." /></DataSection>;
  return <TableSection title="Balance Sheet" subtitle="Annual balance sheet information." rows={balanceSheet} />;
}

function CashFlowTab() {
  return <DataSection title="Cash Flow" subtitle="Cash flow statement"><div className="px-6 py-10"><p className="font-bold text-slate-700">Cash flow data is not currently being returned by the backend API.</p><p className="mt-2 text-sm text-slate-500">This section is ready to connect when the cash flow table is exposed.</p></div></DataSection>;
}

function RatiosTab({ ratios }: { ratios: any }) {
  return <><div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-700">Fundamentals</p><h2 className="section-heading mt-1 text-3xl font-black text-slate-950">Financial ratios</h2></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Object.entries(ratios).map(([name, value]) => <MetricCard key={name} title={name} value={value} />)}</div></>;
}

function ShareholdingTab({ shareholding }: { shareholding: any[] }) {
  if (shareholding.length === 0) return <DataSection title="Shareholding Pattern" subtitle="Quarterly shareholding information."><EmptyState text="No shareholding data available." /></DataSection>;
  return <TableSection title="Shareholding Pattern" subtitle="Quarterly shareholding information." rows={shareholding} />;
}

function DataSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <><div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-700">Market data</p><h2 className="section-heading mt-1 text-3xl font-black text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-500">{subtitle}</p></div><div className="data-table overflow-hidden rounded-2xl">{children}</div></>;
}

function TableSection({ title, subtitle, rows }: { title: string; subtitle: string; rows: any[] }) {
  const columns = Object.keys(rows[0]);
  return <DataSection title={title} subtitle={subtitle}><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{rows.map((row: any, index: number) => <tr key={index}>{columns.map((column) => <td key={column} className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{row[column] ?? "N/A"}</td>)}</tr>)}</tbody></table></div></DataSection>;
}

function EmptyState({ text }: { text: string }) { return <div className="px-6 py-10 text-sm font-semibold text-slate-500">{text}</div>; }

function MetricCard({ title, value }: { title: string; value: any }) {
  return <div className="metric-tile market-card-hover rounded-2xl p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{title}</p><p className="mt-2 break-words text-xl font-black text-slate-950 sm:text-2xl">{value ?? "N/A"}</p></div>;
}

export default Company;
