import { Suspense } from "react";
import CompanyCard from "@/components/CompanyCard";

type SearchResult = {
  companies?: { name: string; industry?: string; signals?: string[] }[];
  industries?: string[];
  signals?: string[];
  people?: string[];
};

async function fetchResults(query: string): Promise<SearchResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/search?q=${encodeURIComponent(query)}`,
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
        <h1 className="text-xl font-semibold">No search query provided</h1>
      </div>
    );
  }

  const data = await fetchResults(query);

  const companies = data.companies ?? [];
  const industries = data.industries ?? [];
  const signals = data.signals ?? [];

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
      <h1 className="text-2xl font-semibold mb-8">
        Results for "{query}"
      </h1>

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
                <ul className="space-y-1 text-sm text-neutral-600">
                  {industries.map((industry) => (
                    <li key={industry}>{industry}</li>
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
