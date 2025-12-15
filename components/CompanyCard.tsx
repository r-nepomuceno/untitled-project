const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Props = {
  name: string;
  industry?: string;
  signalCount?: number;
};

export default function CompanyCard({
  name,
  industry,
  signalCount,
}: Props) {
  return (
    <a
      href={`/company/${slugify(name)}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-300"
    >
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">
          {name}
        </h3>
        {industry && (
          <p className="mt-1 text-xs text-neutral-500">
            {industry}
          </p>
        )}
      </div>
    </a>
  );
}
