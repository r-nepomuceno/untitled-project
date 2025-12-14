"use client"

import { useState } from "react"
import { ensureSessionId } from "@/lib/session-client"

type Props = {
  query: string
  results: {
    companies?: any[]
    industries?: string[]
    signals?: any[]
    people?: string[]
  }
}

export default function SaveMapButton({ query, results }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mapId, setMapId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setIsSaving(true)
    setError(null)

    try {
      // Ensure session exists
      await ensureSessionId()

      const response = await fetch("/api/maps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query,
          results,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save map")
      }

      const data = await response.json()
      setMapId(data.mapId)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save map")
    } finally {
      setIsSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Map saved!</span>
        {mapId && (
          <span className="text-xs text-neutral-500">
            (ID: {mapId.substring(0, 8)}...)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
      >
        {isSaving ? "Saving..." : "Save this map"}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}

