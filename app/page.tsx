"use client"

import SearchBar from "@/components/SearchBar"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center text-center max-w-2xl w-full">
          {/* Heading - Black text */}
          <h1 className="text-6xl md:text-7xl font-semibold text-black mb-8 tracking-tight">
            Map any market.
          </h1>

          {/* Subheading - Dark gray */}
          <p className="text-sm text-neutral-600 mb-12">
            AI-powered mapping that reveals companies, clusters, people, and patterns — all from a single search.
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </main>
    </div>
  )
}