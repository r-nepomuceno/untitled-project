import { Suspense } from "react";
import CompanyCard from "@/components/CompanyCard";
import SaveMapButton from "@/components/SaveMapButton";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SearchResult = {
  companies?: { name: string; industry?: string; signals?: string[] }[];
  industries?: string[];
  signals?: string[];
  people?: string[];
};

async function fetchResults(query: string): Promise<SearchResult> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}

function EmptyState() {
  return (
    <div className="mt-12 text-sm text-neutral-500">
      No results found.
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim();

  if (!query) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold">No search query provided</h1>
      </div>
    );
  }

  const data = await fetchResults(query);

  const companies = data.companies ?? [];
  const industries = data.industries ?? [];
  const signals = data.signals ?? [];

  const graph = {
    industries: {} as Record<
      string,
      {
        companies: string[];
        signals: Record<string, number>;
      }
    >,
  };

  for (const company of companies) {
    const industry = company.industry ?? "Other";

    if (!graph.industries[industry]) {
      graph.industries[industry] = {
        companies: [],
        signals: {},
      };
    }

    graph.industries[industry].companies.push(company.name);

    for (const signal of company.signals ?? []) {
      graph.industries[industry].signals[signal] =
        (graph.industries[industry].signals[signal] ?? 0) + 1;
    }
  }

  if (process.env.DEV_MODE === "true") {
    console.log("GRAPH STRUCTURE:", graph);
  }

  const industryActivity = Object.entries(graph.industries)
    .map(([industry, data]) => {
      const totalSignals = Object.values(data.signals).reduce(
        (sum, count) => sum + count,
        0
      );

      return {
        industry,
        totalSignals,
        companyCount: data.companies.length,
      };
    })
    .sort((a, b) => b.totalSignals - a.totalSignals)
    .slice(0, 5);

  function getIndustryLabel(
    companyCount: number,
    totalSignals: number
  ) {
    if (companyCount <= 3 && totalSignals <= 5) {
      return "Emerging";
    }

    if (companyCount <= 6 && totalSignals <= 10) {
      return "Active";
    }

    return "Crowded";
  }

  const industryTopSignals = Object.entries(graph.industries).map(
    ([industry, data]) => {
      const rankedSignals = Object.entries(data.signals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return {
        industry,
        signals: rankedSignals,
      };
    }
  );

  const companiesByIndustry = companies.reduce(
    (acc, company) => {
      const key = company.industry ?? "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(company);
      return acc;
    },
    {} as Record<string, typeof companies>
  );

  const hasResults =
    companies.length || industries.length || signals.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Results for "{query}"
        </h1>
        <SaveMapButton query={query} results={data} />
      </div>

      {industryActivity.length > 0 && (
        <section className="mb-12 max-w-3xl">
          <h2 className="text-sm font-medium text-neutral-700 mb-3">
            Most Active Industries
          </h2>

          <ul className="text-sm text-neutral-600 space-y-1">
            {industryActivity.map(
              ({ industry, totalSignals, companyCount }) => (
                <li key={industry}>
                  <a
                    href={`/industry/${slugify(industry)}`}
                    className="hover:underline"
                  >
                    {industry}
                  </a>
                  <span className="text-neutral-400 ml-2">
                    — {getIndustryLabel(companyCount, totalSignals)} ·{" "}
                    {totalSignals} signals / {companyCount} companies
                  </span>
                </li>
              )
            )}
          </ul>
        </section>
      )}

      {industryTopSignals.length > 0 && (
        <section className="mb-14 max-w-4xl">
          <h2 className="text-sm font-medium text-neutral-700 mb-4">
            What's Driving Activity
          </h2>

          <div className="space-y-4">
            {industryTopSignals.map(({ industry, signals }) => (
              <div key={industry}>
                <a
                  href={`/industry/${slugify(industry)}`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  {industry}
                </a>

                {signals.length > 0 ? (
                  <ul className="mt-1 text-sm text-neutral-600 flex flex-wrap gap-x-3">
                    {signals.map(([signal]) => (
                      <li key={signal} className="after:content-[','] last:after:content-['']">
                        {signal}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-400 mt-1">
                    No dominant signals detected
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasResults && <EmptyState />}

      {hasResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* LEFT COLUMN — ENTITY LISTS */}
          <div className="space-y-8 md:col-span-1">
            {industries.length > 0 && (
              <section>
                <h2 className="text-sm font-medium mb-3 text-neutral-700">
                  Industries
                </h2>
                <ul className="space-y-1 text-sm">
                  {industries.map((industry) => (
                    <li key={industry}>
                      <a
                        href={`/industry/${slugify(industry)}`}
                        className="text-neutral-700 hover:underline"
                      >
                        {industry}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {signals.length > 0 && (
              <section>
                <h2 className="text-sm font-medium mb-3 text-neutral-700">
                  Signals
                </h2>
                <ul className="space-y-1 text-sm text-neutral-600">
                  {signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — COMPANIES */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-medium mb-4 text-neutral-700">
              Companies
            </h2>

            <div className="space-y-8">
              {Object.entries(companiesByIndustry).map(
                ([industry, companies]) => (
                  <section key={industry}>
                    <h3 className="text-sm font-medium mb-3 text-neutral-700">
                      {industry}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {companies.map((company) => (
                        <CompanyCard
                          key={company.name}
                          name={company.name}
                          industry={company.industry}
                          signalCount={company.signals?.length}
                        />
                      ))}
                    </div>
                  </section>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
