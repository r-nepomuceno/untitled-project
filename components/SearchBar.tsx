"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your market query..."
        className="w-full max-w-xl rounded-md border border-neutral-300 bg-white px-4 py-3 shadow-sm focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/40"
      />
    </form>
  )
}

