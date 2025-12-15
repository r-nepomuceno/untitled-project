"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ensureSessionId } from "@/lib/session-client"

type SavedMap = {
  id: string
  query: string
  created_at: string
  updated_at: string
  metadata?: {
    companyCount?: number
    industryCount?: number
    signalCount?: number
  }
}

export default function MySavedMapsPage() {
  const router = useRouter()
  const [maps, setMaps] = useState<SavedMap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMaps() {
      try {
        setIsLoading(true)
        await ensureSessionId()

        const response = await fetch("/api/maps", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to load maps")
        }

        const data = await response.json()
        setMaps(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load maps")
      } finally {
        setIsLoading(false)
      }
    }

    loadMaps()
  }, [])

  async function handleDelete(mapId: string) {
    if (!confirm("Are you sure you want to delete this map?")) {
      return
    }

    try {
      const response = await fetch(`/api/maps/${mapId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete map")
      }

      // Remove from list
      setMaps(maps.filter((map) => map.id !== mapId))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete map")
    }
  }

  function handleReload(map: SavedMap) {
    router.push(`/search?q=${encodeURIComponent(map.query)}`)
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-8">My Saved Maps</h1>
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-8">My Saved Maps</h1>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Saved Maps</h1>
        <a
          href="/"
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          ← Back to search
        </a>
      </div>

      {maps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-neutral-500 mb-4">
            No saved maps yet.
          </p>
          <a
            href="/"
            className="text-sm text-neutral-900 hover:underline"
          >
            Create your first map →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {maps.map((map) => (
            <div
              key={map.id}
              className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {map.query}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
                    <span>Created: {formatDate(map.created_at)}</span>
                    {map.metadata && (
                      <>
                        {map.metadata.companyCount !== undefined && (
                          <span>{map.metadata.companyCount} companies</span>
                        )}
                        {map.metadata.industryCount !== undefined && (
                          <span>{map.metadata.industryCount} industries</span>
                        )}
                        {map.metadata.signalCount !== undefined && (
                          <span>{map.metadata.signalCount} signals</span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">
                    ID: {map.id.substring(0, 8)}...
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReload(map)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
                  >
                    Reload
                  </button>
                  <button
                    onClick={() => handleDelete(map.id)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

