/**
 * Extracts readable text from a webpage URL.
 * Fetches HTML, strips scripts/styles/metadata, and returns cleaned text.
 */
export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    // Validate URL format
    new URL(url)
  } catch {
    throw new Error(`Invalid URL: ${url}`)
  }

  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    if (!html || html.trim().length === 0) {
      throw new Error("Empty response from URL")
    }

    // Remove script tags and their content
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    // Remove style tags and their content
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

    // Remove head tag and its content (metadata)
    cleaned = cleaned.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "")

    // Remove other metadata tags
    cleaned = cleaned.replace(/<meta[^>]*>/gi, "")
    cleaned = cleaned.replace(/<link[^>]*>/gi, "")
    cleaned = cleaned.replace(/<noscript[^>]*>.*?<\/noscript>/gi, "")

    // Remove all remaining HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, "")

    // Decode HTML entities (basic common ones)
    cleaned = cleaned
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")

    // Collapse whitespace: replace multiple spaces/tabs/newlines with single space
    cleaned = cleaned.replace(/\s+/g, " ")

    // Trim leading/trailing whitespace
    cleaned = cleaned.trim()

    if (cleaned.length === 0) {
      throw new Error("No readable content extracted from URL")
    }

    return cleaned
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`Request timeout: ${url}`)
      }
      throw error
    }

    throw new Error(`Failed to extract text from URL: ${url}`)
  }
}

