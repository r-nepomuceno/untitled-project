"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const hasQuery = query.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="w-full relative max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your market query..."
        className="w-full rounded border border-neutral-300 bg-white px-4 py-3 pr-12 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-colors"
      />
      <button
        type="button"
        onClick={() => handleSubmit()}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded transition-all ${
          hasQuery
            ? "bg-neutral-300 hover:bg-neutral-400 cursor-pointer"
            : "cursor-pointer bg-transparent hover:bg-neutral-100"
        }`}
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            hasQuery ? "text-white" : "text-neutral-300"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}