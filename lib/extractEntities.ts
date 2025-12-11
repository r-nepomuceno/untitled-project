import Anthropic from "@anthropic-ai/sdk"

export type CompanyEntity = {
  name: string
  description: string
  category: string
  signals: string[]
}

export type ExtractedEntities = {
  companies: CompanyEntity[]
}

/**
 * Extracts structured market intelligence entities from text using Claude 3.5 Sonnet.
 * Returns companies with their descriptions, categories, and signals.
 */
export async function extractEntitiesFromText(text: string): Promise<ExtractedEntities> {
  console.log("extractEntitiesFromText called. Text length:", text?.length);
  console.log("extractEntitiesFromText text:", text);

  const dev = process.env.DEV_MODE === "true"
  
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured")
  }

  if (!text || text.trim().length === 0) {
    return { companies: [] }
  }

  // Truncate text in dev mode
  let processedText = text
  if (dev) {
    processedText = text.substring(0, 4000)
    console.log("Running in DEV_MODE with Haiku")
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  })

  const systemPrompt = `You are a market intelligence analyst. Extract structured information about companies, products, and organizations from the provided text.

Your task:
1. Identify relevant companies, products, or organizations mentioned in the text.
2. Infer high-level categories/segments (e.g., "AI infrastructure", "dev tools", "agent frameworks", "SaaS platforms", "enterprise software").
3. Extract short, clear, factual descriptions (1-2 sentences max).
4. Capture any signals such as:
   - Funding announcements or amounts
   - Partnerships or collaborations
   - Scale indicators (user counts, revenue, growth)
   - Notable customers or clients
   - Product launches or major updates
   - Market positioning or competitive advantages

Return ONLY valid JSON in this exact format:
{
  "companies": [
    {
      "name": "Company Name",
      "description": "Brief factual description",
      "category": "Category/Segment",
      "signals": ["Signal 1", "Signal 2"]
    }
  ]
}

If no companies are found, return: {"companies": []}
Always return valid JSON, nothing else.`

  // Select model based on dev mode
  const model = dev ? "claude-3-5-haiku-20241022" : "claude-3-5-sonnet-20241022"

  try {
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Extract market intelligence entities from this text:\n\n${processedText}`,
        },
      ],
    })

    // Extract text content from the response
    const content = message.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API")
    }

    const responseText = content.text.trim()

    // Sometimes the response might have markdown code blocks, try to extract JSON
    let jsonText = responseText
    
    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]
    }

    // Parse JSON from the response
    let parsed: ExtractedEntities
    try {
      parsed = JSON.parse(jsonText) as ExtractedEntities
    } catch (err) {
      console.error("JSON parse error:", err)
      return { companies: [] }
    }

    // Validate the structure
    if (!parsed || typeof parsed !== "object") {
      return { companies: [] }
    }

    if (!Array.isArray(parsed.companies)) {
      return { companies: [] }
    }

    // Validate and clean each company entry
    const validatedCompanies: CompanyEntity[] = parsed.companies
      .filter((company: any) => {
        return (
          company &&
          typeof company === "object" &&
          typeof company.name === "string" &&
          company.name.trim().length > 0
        )
      })
      .map((company: any) => ({
        name: String(company.name || "").trim(),
        description: String(company.description || "").trim(),
        category: String(company.category || "").trim(),
        signals: Array.isArray(company.signals)
          ? company.signals.map((s: any) => String(s).trim()).filter((s: string) => s.length > 0)
          : [],
      }))

    return { companies: validatedCompanies }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract entities: ${error.message}`)
    }
    throw new Error("Failed to extract entities: Unknown error")
  }
}