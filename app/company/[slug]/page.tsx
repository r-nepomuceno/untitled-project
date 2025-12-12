type Company = {
  name: string;
  industry?: string;
  signals?: string[];
  people?: string[];
  sources?: string[];
};

const DEV_MODE = process.env.DEV_MODE === "true";

async function generateCompanySummary(company: {
  name: string;
  industry?: string;
  signals?: string[];
  people?: string[];
}) {
  if (DEV_MODE) {
    return `This is an early-stage company operating in the ${
      company.industry ?? "broader market"
    }. Initial signals suggest activity around ${
      company.signals?.slice(0, 3).join(", ") || "product development and growth"
    }.`;
  }

  const prompt = `
You are a market intelligence analyst.

Write a concise 2–3 sentence summary describing the company below.
Focus on:
- What the company does
- The market or industry it operates in
- Any notable signals or themes

Company:
Name: ${company.name}
Industry: ${company.industry ?? "Unknown"}
Signals: ${company.signals?.join(", ") ?? "None"}
People: ${company.people?.join(", ") ?? "None"}

Tone:
- Neutral
- Informative
- No hype
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? null;
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
        <h1 className="text-xl font-semibold">
          Company not found
        </h1>
      </div>
    );
  }

  const summary = await generateCompanySummary(company);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-2">
        {company.name}
      </h1>

      {company.industry && (
        <p className="text-sm text-neutral-500 mb-8">
          {company.industry}
        </p>
      )}

      {summary && (
        <section className="mb-10">
          <h2 className="text-sm font-medium text-neutral-700 mb-2">
            Overview
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      <div className="space-y-8 text-sm text-neutral-700">
        <section>
          <h2 className="font-medium mb-2">Signals</h2>
          {company.signals?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {company.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">
              No signals extracted yet.
            </p>
          )}
        </section>

        <section>
          <h2 className="font-medium mb-2">People</h2>
          {company.people?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {company.people.map((person) => (
                <li key={person}>{person}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">
              No people extracted yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
