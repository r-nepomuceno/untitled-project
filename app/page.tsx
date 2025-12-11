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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Market Intelligence Agent
        </h1>
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your market query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </form>
          {loading && (
            <div className="mt-4 text-center text-gray-600">
              Searching...
            </div>
          )}
          {error && (
            <div className="mt-4 text-center text-red-600">
              {error}
            </div>
          )}
          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

