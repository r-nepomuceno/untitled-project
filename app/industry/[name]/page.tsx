type Company = {
  name: string;
  industry?: string;
};

async function fetchIndustry(name: string): Promise<Company[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/search?q=${encodeURIComponent(
      name
    )}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.companies ?? []).filter(
    (c: Company) =>
      c.industry?.toLowerCase() === name.toLowerCase()
  );
}

type Props = {
  params: { name: string };
};

export default async function IndustryPage({ params }: Props) {
  const industryName = params.name.replace(/-/g, " ");
  const companies = await fetchIndustry(industryName);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        {industryName}
      </h1>

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
