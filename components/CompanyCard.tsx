interface CompanyCardProps {
  name: string
  industry?: string
  signalCount?: number
}

export default function CompanyCard({ name, industry, signalCount }: CompanyCardProps) {
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  
  return (
    <a
      href={`/company/${slug}`}
      className="block bg-[#FAF9F6] border border-[#E6E1D9] rounded-lg p-4 hover:shadow-sm hover:border-[#D4CFC4] transition-all"
    >
      <h3 className="font-semibold text-text-primary mb-1">{name}</h3>
      {industry && (
        <p className="text-sm text-text-secondary mb-2">{industry}</p>
      )}
      {signalCount !== undefined && signalCount > 0 && (
        <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F3C43F]/20 text-text-primary">
          {signalCount} signal{signalCount !== 1 ? "s" : ""}
        </div>
      )}
    </a>
  )
}
