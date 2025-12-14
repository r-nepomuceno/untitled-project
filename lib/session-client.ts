"use client"

/**
 * Get session ID from cookies (client-side)
 */
export function getSessionId(): string | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=")
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies["session_id"] || null
}

/**
 * Ensure session ID exists (creates one via API if needed)
 */
export async function ensureSessionId(): Promise<string> {
  let sessionId = getSessionId()

  if (!sessionId) {
    // Call API to create session (this will set the cookie)
    const response = await fetch("/api/session", {
      method: "POST",
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json()
      sessionId = data.sessionId
    } else {
      throw new Error("Failed to create session")
    }
  }

  return sessionId
}

