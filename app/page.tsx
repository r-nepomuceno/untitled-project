"use client"

import SearchBar from "@/components/SearchBar"

export default function Home() {
  return (
    <div 
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: "#F8F6F2" }}
    >
      {/* Contour Background */}
      <div className="contour-background" />

      {/* Navigation Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-neutral-900/80 font-medium">
            untitled project
          </div>
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

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-neutral-900">
            Map the market.
          </h1>
          
          {/* Accent Bar */}
          <div className="w-12 h-1 bg-accent rounded-full mt-4" />
          
          {/* Subheadline */}
          <p className="max-w-xl mx-auto mt-6 text-base md:text-lg text-muted-foreground">
            AI-powered mapping that reveals companies, clusters, people, and patterns — all from a single search.
          </p>

          {/* Search Bar */}
          <div className="mt-4 w-full">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  )
}

