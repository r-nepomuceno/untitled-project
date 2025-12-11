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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center mt-24 md:mt-32">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight">
            Map the market.
          </h1>
          
          {/* Accent Bar */}
          <div className="w-12 h-1 bg-accent rounded-full mt-4" />
          
          {/* Subheadline */}
          <p className="max-w-2xl mt-4 text-neutral-700 text-lg md:text-xl leading-relaxed">
            AI-powered mapping that reveals companies, clusters, people, and patterns — all from a single search.
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  )
}

