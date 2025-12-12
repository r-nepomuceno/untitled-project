const DEV_MODE = process.env.DEV_MODE === "true";

async function generateIndustrySummary(
  industry: string,
  companies: {
    name: string;
    industry?: string;
    signals?: string[];
  }[]
) {
  const allSignals = companies.flatMap(
    (c) => c.signals ?? []
  );

  const topSignals = Array.from(
    new Set(allSignals)
  ).slice(0, 5);

  if (DEV_MODE) {
    return `This industry includes companies operating in ${industry}. Common themes suggest activity around ${
      topSignals.join(", ") || "product development and market expansion"
    }.`;
  }

  const prompt = `
You are a market intelligence analyst.

Write a concise 2–4 sentence summary describing the industry below.
Focus on:
- What types of companies operate in this industry
- Common themes or signals across companies
- What appears to be emerging or notable

Industry: ${industry}

Companies:
${companies.map((c) => `- ${c.name}`).join("\n")}

Signals:
${topSignals.join(", ") || "None"}

Tone:
- Neutral
- Analytical
- No hype
`;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 160,
      }),
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? null;
}

type Company = {
  name: string;
  industry?: string;
  signals?: string[];
};

async function fetchIndustry(name: string): Promise<Company[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(name)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const data = await res.json();

  const normalizedIndustry = name.toLowerCase();

  return (data.companies ?? []).filter((c) => {
    if (!c.industry) return false;

    const industryValue = c.industry.toLowerCase();

    return (
      industryValue.includes(normalizedIndustry) ||
      normalizedIndustry.includes(industryValue)
    );
  });
}

type Props = {
  params: { name: string };
};

export default async function IndustryPage({ params }: Props) {
  const industryName = params.name.replace(/-/g, " ");
  const companies = await fetchIndustry(industryName);

  const signalCounts: Record<string, number> = {};

  for (const company of companies) {
    for (const signal of company.signals ?? []) {
      signalCounts[signal] = (signalCounts[signal] ?? 0) + 1;
    }
  }

  const topSignals = Object.entries(signalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const summary = await generateIndustrySummary(
    industryName,
    companies
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        {industryName}
      </h1>

      {summary && (
        <section className="mb-10 max-w-3xl">
          <h2 className="text-sm font-medium text-neutral-700 mb-2">
            Overview
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {topSignals.length > 0 && (
        <section className="mb-10 max-w-3xl">
          <h2 className="text-sm font-medium text-neutral-700 mb-2">
            Dominant Signals
          </h2>
          <ul className="text-sm text-neutral-600 space-y-1">
            {topSignals.map(([signal, count]) => (
              <li key={signal}>
                {signal}
                <span className="text-neutral-400 ml-2">
                  ({count})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {companies.length === 0 && (
        <p className="text-sm text-neutral-500">
          No companies found for this industry.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companies.map((company) => (
          <a
            key={company.name}
            href={`/company/${company.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`}
            className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-300"
          >
            <h3 className="text-sm font-semibold">
              {company.name}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
}
