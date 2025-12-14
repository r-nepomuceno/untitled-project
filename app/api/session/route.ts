import { NextRequest, NextResponse } from "next/server"
import { getSessionId } from "@/lib/session"

// POST /api/session - Create or get session ID
export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId()

    return NextResponse.json({ sessionId })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create session" },
      { status: 500 }
    )
  }
}

