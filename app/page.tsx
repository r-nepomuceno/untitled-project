"use client"

import SearchBar from "@/components/SearchBar"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-neutral-50">
      {/* Navigation Bar */}
      <nav className="relative z-10 w-full border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex justify-between items-center">
          <div className="text-base font-semibold text-neutral-900">
            untitled project
          </div>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900 mb-4">
            Map the market.
          </h1>

          {/* Subheading */}
          <p className="text-lg leading-[1.6] text-neutral-600 max-w-[600px] mb-8">
            Get competitive intelligence and market insights in minutes.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-[600px] mt-2">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  )
}
