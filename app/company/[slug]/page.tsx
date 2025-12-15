import BackButton from "@/components/BackButton"

type Company = {
  name: string;
  industry?: string;
  signals?: string[];
  people?: string[];
  sources?: string[];
};

const DEV_MODE = process.env.DEV_MODE === "true";
const SUMMARY_MODE = process.env.SUMMARY_MODE === "true";

console.log("SUMMARY_MODE =", SUMMARY_MODE);

async function generateCompanySummary(company: {
  name: string;
  industry?: string;
  signals?: string[];
  people?: string[];
}) {
  if (!SUMMARY_MODE) {
    return null;
  }

  try {
    const prompt = `
You are a market intelligence analyst.

Write a concise 2–3 sentence summary describing the company below.

Incorporate:
- What the company appears to do
- The industry or market it operates in
- How it fits within broader industry activity or themes

Company:
Name: ${company.name}
Industry: ${company.industry ?? "Unknown"}
Signals: ${company.signals?.join(", ") ?? "None"}
People: ${company.people?.join(", ") ?? "None"}

Guidance:
- Be specific where possible
- Avoid generic startup language
- If information is limited, state uncertainty clearly
- Do not invent facts

Tone:
- Neutral
- Analytical
- Clear
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
          max_tokens: 120,
        }),
      }
    );

    if (!response.ok) {
      console.error("OpenAI error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("Company summary generation failed:", err);
    return null;
  }
}

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchCompanyData(slug: string): Promise<Company | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const nameGuess = slug.replace(/-/g, " ");

  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(nameGuess)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const companies = data.companies ?? [];

  return (
    companies.find(
      (c: Company) =>
        normalize(c.name) === normalize(nameGuess)
    ) ??
    companies[0] ??
    null
  );
}

export default async function CompanyPage({
  params,
}: {
  params: { slug: string };
}) {
  const company = await fetchCompanyData(params.slug);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-6">
          {<BackButton />}
        </div>
        <h1 className="text-xl font-semibold">
          Company not found
        </h1>
      </div>
    );
  }

  const summary = await generateCompanySummary(company);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-6">
        {<BackButton />}
      </div>

      <h1 className="text-4xl font-bold mb-2">
        {company.name}
      </h1>

      {company.industry && (
        <p className="text-sm text-neutral-500 mb-8">
          {company.industry}
        </p>
      )}

      <section className="mb-10">
        <h2 className="text-sm font-medium text-neutral-700 mb-2">
          Overview
        </h2>

        {!SUMMARY_MODE ? (
          <p className="text-sm text-neutral-400 italic">
            AI-generated summaries are disabled in development mode.
          </p>
        ) : summary ? (
          <p className="text-sm text-neutral-600 leading-relaxed">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-neutral-400 italic">
            Summary unavailable.
          </p>
        )}
      </section>

      <div className="space-y-10">
        <section>
          <h2 className="text-sm font-medium text-neutral-700 mb-2">Signals</h2>
          {company.signals?.length ? (
            <ul className="text-sm text-neutral-600 leading-relaxed space-y-1">
              {company.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No signals extracted yet.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium text-neutral-700 mb-2">People</h2>
          {company.people?.length ? (
            <ul className="text-sm text-neutral-600 leading-relaxed space-y-1">
              {company.people.map((person) => (
                <li key={person}>{person}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No people extracted yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}