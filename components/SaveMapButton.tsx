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
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <svg
          className="w-4 h-4"
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
        <span>Saved</span>
        {mapId && (
          <span className="text-xs text-neutral-400">
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
        className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? "Saving..." : "Save this map"}
      </button>
      {error && (
        <p className="text-xs text-neutral-500">{error}</p>
      )}
    </div>
  )
}

