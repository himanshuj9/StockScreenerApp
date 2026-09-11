import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

        console.log("Company page data:", data);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 text-lg">
          Loading company data...
        </p>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">
          {error || "Company not found"}
        </p>
      </div>
    );
  }

  const company = companyData.company;
  const ratios = companyData.ratios || {};
  const information = companyData.information || {};
  const financials = companyData.financials || [];
  const shareholding = companyData.shareholding || [];
  const balanceSheet = companyData.balance_sheet || [];

  const tabs: Tab[] = [
    "Overview",
    "Chart",
    "Profit & Loss",
    "Balance Sheet",
    "Cash Flow",
    "Ratios",
    "Shareholding",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* COMPANY HEADER */}
      <header className="border-b border-slate-800 px-6 py-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm text-slate-400">
            NSE: {company.symbol}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {company.company_name}
          </h1>

          <div className="mt-4 flex items-center gap-6">

            <span className="text-2xl font-semibold">
            ₹{companyData.market_data?.current_price ?? "N/A"}
            </span>

            <span className="text-slate-400">
              Current Price
            </span>

          </div>

        </div>
      </header>


      {/* TABS */}
      <nav className="border-b border-slate-800 bg-slate-900">

        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "border-b-2 border-white py-4 text-sm font-medium whitespace-nowrap"
                  : "py-4 text-sm text-slate-400 hover:text-white whitespace-nowrap"
              }
            >
              {tab}
            </button>

          ))}

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* OVERVIEW */}

        {activeTab === "Overview" && (

          <OverviewTab
            ratios={ratios}
            information={information}
          />

        )}


        {/* CHART */}

        {activeTab === "Chart" && (

          <ChartTab
            financials={financials}
          />

        )}


        {/* PROFIT & LOSS */}

        {activeTab === "Profit & Loss" && (

          <ProfitLossTab
            financials={financials}
          />

        )}


        {/* BALANCE SHEET */}

        {activeTab === "Balance Sheet" && (

          <BalanceSheetTab
            balanceSheet={balanceSheet}
          />

        )}


        {/* CASH FLOW */}

        {activeTab === "Cash Flow" && (

          <CashFlowTab />

        )}


        {/* RATIOS */}

        {activeTab === "Ratios" && (

          <RatiosTab
            ratios={ratios}
          />

        )}


        {/* SHAREHOLDING */}

        {activeTab === "Shareholding" && (

          <ShareholdingTab
            shareholding={shareholding}
          />

        )}

      </main>

    </div>
  );
}


/* =========================================================
   OVERVIEW
========================================================= */

function OverviewTab({
  ratios,
  information,
}: {
  ratios: any;
  information: any;
}) {
  return (
    <>

      <h2 className="text-2xl font-semibold">
        Company Overview
      </h2>


      {/* KEY METRICS */}

      <section className="mt-6">

        <h3 className="mb-4 text-lg font-medium text-slate-300">
          Key Metrics
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <MetricCard
            title="Market Cap"
            value={ratios["Market Cap"]}
          />

          <MetricCard
            title="Stock P/E"
            value={ratios["Stock PE"]}
          />

          <MetricCard
            title="Book Value"
            value={ratios["Book Value"]}
          />

          <MetricCard
            title="ROE"
            value={ratios["ROE"]}
          />

          <MetricCard
            title="ROCE"
            value={ratios["ROCE"]}
          />

          <MetricCard
            title="EPS"
            value={ratios["EPS"]}
          />

          <MetricCard
            title="Dividend Yield"
            value={ratios["Dividend Yield"]}
          />

          <MetricCard
            title="Debt to Equity"
            value={ratios["Debt to Equity"]}
          />

        </div>

      </section>


      {/* ABOUT */}

      <section className="mt-10">

        <h3 className="text-lg font-medium text-slate-300">
          About
        </h3>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <p className="leading-7 text-slate-400">
            {information.about ||
              "No company information available."}
          </p>

        </div>

      </section>


      {/* KEY POINTS */}

      <section className="mt-8">

        <h3 className="text-lg font-medium text-slate-300">
          Key Points
        </h3>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <p className="leading-7 text-slate-400">
            {information.key_points ||
              "No key points available."}
          </p>

        </div>

      </section>

    </>
  );
}


/* =========================================================
   CHART
========================================================= */

function ChartTab({
  financials,
}: {
  financials: any[];
}) {
  return (
    <>

      <h2 className="text-2xl font-semibold">
        Financial Chart
      </h2>

      <p className="mt-2 text-slate-400">
        Financial performance over time.
      </p>


      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

        {financials.length === 0 ? (

          <p className="text-slate-400">
            No financial data available.
          </p>

        ) : (

          <div className="space-y-6">

            {financials.map((item: any, index: number) => {

              const numericValues = Object.entries(item)
                .filter(
                  ([key, value]) =>
                    key !== "year" &&
                    key !== "quarter" &&
                    typeof value === "number"
                );

              return (
                <div
                  key={index}
                  className="border-b border-slate-800 pb-5 last:border-0"
                >

                  <div className="mb-3 text-sm font-medium text-slate-300">
                    {item.year}
                    {item.quarter
                      ? ` - ${item.quarter}`
                      : ""}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                    {numericValues.map(
                      ([key, value]) => (

                        <div key={key}>

                          <p className="text-xs text-slate-500">
                            {key}
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {String(value)}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>
              );

            })}

          </div>

        )}

      </div>

    </>
  );
}


/* =========================================================
   PROFIT & LOSS
========================================================= */

function ProfitLossTab({
  financials,
}: {
  financials: any[];
}) {
  if (financials.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold">
          Profit & Loss
        </h2>

        <p className="mt-6 text-slate-400">
          No financial results available.
        </p>
      </>
    );
  }

  const columns = Object.keys(financials[0]);

  return (
    <>

      <h2 className="text-2xl font-semibold">
        Profit & Loss
      </h2>

      <p className="mt-2 text-slate-400">
        Financial results from the database.
      </p>


      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">

        <table className="w-full text-left">

          <thead className="bg-slate-900">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-5 py-4 text-sm font-medium text-slate-400"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {financials.map(
              (row: any, index: number) => (

                <tr
                  key={index}
                  className="border-t border-slate-800"
                >

                  {columns.map((column) => (

                    <td
                      key={column}
                      className="px-5 py-4 text-sm"
                    >
                      {row[column] ?? "N/A"}
                    </td>

                  ))}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </>
  );
}


/* =========================================================
   BALANCE SHEET
========================================================= */

function BalanceSheetTab({
  balanceSheet,
}: {
  balanceSheet: any[];
}) {
  if (balanceSheet.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold">
          Balance Sheet
        </h2>

        <p className="mt-6 text-slate-400">
          No balance sheet data available.
        </p>
      </>
    );
  }

  const columns = Object.keys(balanceSheet[0]);

  return (
    <>

      <h2 className="text-2xl font-semibold">
        Balance Sheet
      </h2>

      <p className="mt-2 text-slate-400">
        Annual balance sheet information.
      </p>


      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">

        <table className="w-full text-left">

          <thead className="bg-slate-900">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-5 py-4 text-sm font-medium text-slate-400 whitespace-nowrap"
                >
                  {column.replaceAll("_", " ")}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {balanceSheet.map(
              (row: any, index: number) => (

                <tr
                  key={index}
                  className="border-t border-slate-800"
                >

                  {columns.map((column) => (

                    <td
                      key={column}
                      className="px-5 py-4 text-sm whitespace-nowrap"
                    >
                      {row[column] ?? "N/A"}
                    </td>

                  ))}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </>
  );
}


/* =========================================================
   CASH FLOW
========================================================= */

function CashFlowTab() {
  return (
    <>

      <h2 className="text-2xl font-semibold">
        Cash Flow
      </h2>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-8">

        <p className="text-slate-400">
          Cash flow data is not currently being returned
          by the backend API.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          We will connect this section to the MySQL cash flow
          table next.
        </p>

      </div>

    </>
  );
}


/* =========================================================
   RATIOS
========================================================= */

function RatiosTab({
  ratios,
}: {
  ratios: any;
}) {
  return (
    <>

      <h2 className="text-2xl font-semibold">
        Financial Ratios
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        {Object.entries(ratios).map(
          ([name, value]) => (

            <MetricCard
              key={name}
              title={name}
              value={value}
            />

          )
        )}

      </div>

    </>
  );
}


/* =========================================================
   SHAREHOLDING
========================================================= */

function ShareholdingTab({
  shareholding,
}: {
  shareholding: any[];
}) {
  if (shareholding.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold">
          Shareholding Pattern
        </h2>

        <p className="mt-6 text-slate-400">
          No shareholding data available.
        </p>
      </>
    );
  }

  const columns = Object.keys(shareholding[0]);

  return (
    <>

      <h2 className="text-2xl font-semibold">
        Shareholding Pattern
      </h2>

      <p className="mt-2 text-slate-400">
        Quarterly shareholding information.
      </p>


      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">

        <table className="w-full text-left">

          <thead className="bg-slate-900">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-5 py-4 text-sm font-medium text-slate-400 whitespace-nowrap"
                >
                  {column.replaceAll("_", " ")}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {shareholding.map(
              (row: any, index: number) => (

                <tr
                  key={index}
                  className="border-t border-slate-800"
                >

                  {columns.map((column) => (

                    <td
                      key={column}
                      className="px-5 py-4 text-sm whitespace-nowrap"
                    >
                      {row[column] ?? "N/A"}
                    </td>

                  ))}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        {value ?? "N/A"}
      </p>

    </div>
  );
}


export default Company;
