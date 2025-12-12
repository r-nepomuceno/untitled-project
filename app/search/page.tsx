import { headers } from "next/headers"
import CompanyCard from "@/components/CompanyCard"

interface SearchParams {
  q?: string
}

interface CompanyEntity {
  name: string
  description: string
  category: string
  signals: string[]
}

interface ExtractedEntities {
  companies: CompanyEntity[]
}

interface SearchResult {
  title: string
  link: string
  snippet: string
  entities: ExtractedEntities | null
}

interface SearchResponse {
  results: SearchResult[]
  error?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = searchParams.q || ""

  // Fetch search results
  let data: SearchResponse | null = null
  let error: string | null = null

  if (query) {
    try {
      // Get the host from headers for server-side fetch
      const headersList = await headers()
      const host = headersList.get("host") || "localhost:3000"
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
      const baseUrl = `${protocol}://${host}`
      const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        error = `Failed to fetch results: ${res.status}`
      } else {
        data = await res.json()
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An unexpected error occurred"
    }
  }

  // Aggregate entities from all results
  const allCompanies: CompanyEntity[] = []
  const industries = new Set<string>()
  const signals = new Set<string>()

  if (data?.results) {
    for (const result of data.results) {
      if (result.entities?.companies) {
        for (const company of result.entities.companies) {
          allCompanies.push(company)
          if (company.category) {
            industries.add(company.category)
          }
          company.signals.forEach((signal) => signals.add(signal))
        }
      }
    }
  }

  // Remove duplicate companies by name
  const uniqueCompanies = Array.from(
    new Map(allCompanies.map((c) => [c.name.toLowerCase(), c])).values()
  )

  const hasResults = uniqueCompanies.length > 0 || industries.size > 0 || signals.size > 0

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F8F6F2" }}
    >
      {/* Navigation Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-neutral-900/80 font-medium">
            untitled project
          </a>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-900/80 hover:text-accent transition-colors">
              About
            </a>
            <a href="#" className="text-neutral-900/80 hover:text-accent transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!query ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-semibold text-text-primary mb-4">
              Enter a search query
            </h1>
            <p className="text-text-secondary">
              Add <code className="bg-white px-2 py-1 rounded">?q=your+query</code> to the URL
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-semibold text-text-primary mb-4">
              Error
            </h1>
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-semibold text-text-primary mb-4">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-text-secondary">No results found</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-text-primary mb-8">
              Results for &ldquo;{query}&rdquo;
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Lists */}
              <div className="lg:col-span-1 space-y-6">
                {/* Industries */}
                {industries.size > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-3">
                      Industries
                    </h2>
                    <ul className="space-y-2">
                      {Array.from(industries).map((industry) => (
                        <li
                          key={industry}
                          className="text-text-secondary text-sm"
                        >
                          {industry}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Signals */}
                {signals.size > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-3">
                      Signals
                    </h2>
                    <ul className="space-y-2">
                      {Array.from(signals).slice(0, 10).map((signal) => (
                        <li
                          key={signal}
                          className="text-text-secondary text-sm"
                        >
                          {signal}
                        </li>
                      ))}
                      {signals.size > 10 && (
                        <li className="text-text-secondary text-sm italic">
                          +{signals.size - 10} more
                        </li>
                      )}
                    </ul>
                  </section>
                )}
              </div>

              {/* Right Column: Company Cards Grid */}
              <div className="lg:col-span-2">
                <section>
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Companies ({uniqueCompanies.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueCompanies.map((company) => (
                      <CompanyCard
                        key={company.name}
                        name={company.name}
                        industry={company.category}
                        signalCount={company.signals.length}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
