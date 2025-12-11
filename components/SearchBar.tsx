"use client"

import { useState, FormEvent } from "react"

interface SearchBarProps {
  onResults?: (results: any) => void
}

export default function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setError("Please enter a query")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      })

      const data = await res.json()
      
      // Call the onResults callback if provided
      if (onResults) {
        onResults(data)
      } else {
        // Default: console.log for now
        console.log("Search results:", data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Search error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          placeholder="Enter your market query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="w-full max-w-xl rounded-md border border-neutral-300 bg-white px-4 py-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
      {loading && (
        <div className="mt-2 text-sm text-neutral-600 text-center">
          Searching...
        </div>
      )}
    </div>
  )
}

