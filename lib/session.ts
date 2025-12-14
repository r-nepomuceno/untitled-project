import { cookies } from "next/headers"
import { randomUUID } from "crypto"

const SESSION_COOKIE_NAME = "session_id"
const SESSION_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Get or create a session ID from cookies
 * Server-side only
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    sessionId = randomUUID()
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
  }

  return sessionId
}

/**
 * Get session ID from cookies (client-side compatible)
 * For use in API routes
 */
export function getSessionIdFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=")
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies[SESSION_COOKIE_NAME] || null
}

