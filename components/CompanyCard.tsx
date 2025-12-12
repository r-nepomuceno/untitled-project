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
    <div className="rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-300">
      <div className="flex items-start justify-between gap-2">
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

        {typeof signalCount === "number" && signalCount > 0 && (
          <span className="text-xs rounded-full bg-[#F3C43F]/20 text-[#8A6A00] px-2 py-0.5">
            {signalCount}
          </span>
        )}
      </div>
    </div>
  );
}
