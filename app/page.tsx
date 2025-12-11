"use client"

import { useState, FormEvent } from "react"

export default function Home() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setError("Please enter a query")
      setResponse(null)
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setResponse(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8"
      style={{ backgroundColor: "#F6F1E7" }}
    >
      <div className="relative w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="contour-background" />
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Map any market.
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Search companies, industries, and ecosystems — and see how everything connects.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto mt-12">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter your market query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-[#FFD000] transition-colors duration-200 bg-white shadow-sm"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#FFD000] text-gray-900 font-semibold rounded-2xl hover:bg-[#E6BB00] transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading, Error, and Response states */}
        {loading && (
          <div className="mt-8 text-center text-gray-600 text-lg">
            Searching...
          </div>
        )}
        {error && (
          <div className="mt-8 text-center text-red-600 text-lg">
            {error}
          </div>
        )}
        {response && (
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm max-w-4xl mx-auto">
            <pre className="text-sm whitespace-pre-wrap break-words text-left">
              {response}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}

