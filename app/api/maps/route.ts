import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getSessionIdFromCookies } from "@/lib/session"

// POST /api/maps - Save a new map
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie")
    const sessionId = getSessionIdFromCookies(cookieHeader)

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { query, results } = body

    if (!query || !results) {
      return NextResponse.json(
        { error: "query and results are required" },
        { status: 400 }
      )
    }

    // Extract metadata from results
    const metadata = {
      companyCount: results.companies?.length || 0,
      industryCount: results.industries?.length || 0,
      signalCount: results.signals?.length || 0,
    }

    const { data, error } = await supabase
      .from("maps")
      .insert({
        session_id: sessionId,
        query: query,
        results_json: results,
        metadata: metadata,
      })
      .select("id, created_at")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to save map", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      mapId: data.id,
      createdAt: data.created_at,
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// GET /api/maps - List maps for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mapId = searchParams.get("id")
    const sessionId = searchParams.get("sessionId")

    const cookieHeader = request.headers.get("cookie")
    const cookieSessionId = getSessionIdFromCookies(cookieHeader)

    // If specific map ID requested
    if (mapId) {
      const { data, error } = await supabase
        .from("maps")
        .select("id, query, results_json, created_at, updated_at, session_id")
        .eq("id", mapId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: "Map not found" },
          { status: 404 }
        )
      }

      // Verify session matches (security check)
      if (cookieSessionId && data.session_id !== cookieSessionId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        )
      }

      return NextResponse.json({
        id: data.id,
        query: data.query,
        results: data.results_json,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      })
    }

    // List maps for session
    const effectiveSessionId = sessionId || cookieSessionId

    if (!effectiveSessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("maps")
      .select("id, query, created_at, updated_at, metadata")
      .eq("session_id", effectiveSessionId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch maps", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

