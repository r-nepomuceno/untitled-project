import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getSessionIdFromCookies } from "@/lib/session"

// GET /api/maps/[id] - Get a specific map
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const cookieHeader = request.headers.get("cookie")
    const sessionId = getSessionIdFromCookies(cookieHeader)

    const { data, error } = await supabase
      .from("maps")
      .select("id, query, results_json, created_at, updated_at, session_id")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      )
    }

    // Verify session matches (security check)
    if (sessionId && data.session_id !== sessionId) {
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// DELETE /api/maps/[id] - Delete a map
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const cookieHeader = request.headers.get("cookie")
    const sessionId = getSessionIdFromCookies(cookieHeader)

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 401 }
      )
    }

    // First verify the map exists and belongs to this session
    const { data: map, error: fetchError } = await supabase
      .from("maps")
      .select("session_id")
      .eq("id", id)
      .single()

    if (fetchError || !map) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      )
    }

    if (map.session_id !== sessionId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Delete the map
    const { error: deleteError } = await supabase
      .from("maps")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Supabase error:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete map", details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

