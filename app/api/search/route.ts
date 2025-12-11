import { NextRequest, NextResponse } from "next/server"
import { extractTextFromUrl } from "@/lib/extract"
import { extractEntitiesFromText, type ExtractedEntities } from "@/lib/extractEntities"

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Search endpoint - placeholder" })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPAPI_KEY is not configured" },
        { status: 500 }
      )
    }

    const encodedQuery = encodeURIComponent(query.trim())
    const serpApiUrl = `https://serpapi.com/search.json?q=${encodedQuery}&api_key=${apiKey}`

    const response = await fetch(serpApiUrl)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `SerpAPI request failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract only the required fields from organic_results
    type SearchResult = {
      title: string
      link: string
      snippet: string
    }

    const results: SearchResult[] = (data.organic_results || []).map((result: any) => ({
      title: result.title || "",
      link: result.link || "",
      snippet: result.snippet || "",
    }))

    // Enrich results with extracted text from URLs in parallel
    const textEnrichedResults = await Promise.all(
      results.map(async (result: SearchResult) => {
        if (!result.link) {
          return { ...result, text: "" }
        }

        try {
          const text = await extractTextFromUrl(result.link)
          return { ...result, text }
        } catch (error) {
          // Individual URL errors don't break the whole search
          // Return the result with empty text or error message
          return {
            ...result,
            text: "",
            extractionError: error instanceof Error ? error.message : "Failed to extract text",
          }
        }
      })
    )

    console.log("DEV_MODE:", process.env.DEV_MODE);
    console.log("Text lengths:", textEnrichedResults.map(r => r.text?.length));

    // Enrich results with extracted entities from text
    const dev = process.env.DEV_MODE === "true"
    console.log(`DEV_MODE: ${dev}`)

    // Find the index of the first result with non-empty text
    const firstResultWithTextIndex = textEnrichedResults.findIndex(
      (result) => result.text && result.text.trim().length > 0
    )

    const enrichedResults = await Promise.all(
      textEnrichedResults.map(async (result, index) => {
        // Only extract entities if we have text
        if (!result.text || result.text.trim().length === 0) {
          console.log(`Skipping entity extraction for result ${index + 1} (${result.link}): empty text`)
          return { ...result, entities: null }
        }

        // In dev mode, only process the first result with non-empty text
        if (dev && index !== firstResultWithTextIndex) {
          console.log(`Skipping entity extraction for result ${index + 1} (${result.link}): DEV_MODE - only processing first result`)
          return { ...result, entities: null }
        }

        console.log(`Processing entity extraction for result ${index + 1} (${result.link})`)

        try {
          const entities = await extractEntitiesFromText(result.text)
          return { ...result, entities }
        } catch (error) {
          // Individual entity extraction errors don't break the whole search
          // Return the result with null entities
          console.error(`Entity extraction failed for result ${index + 1} (${result.link}):`, error)
          return { ...result, entities: null }
        }
      })
    )

    return NextResponse.json({ results: enrichedResults })
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

