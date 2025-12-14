type Props = {
  className?: string
  lines?: number
}

export function Skeleton({ className = "", lines = 1 }: Props) {
  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-neutral-200 rounded animate-pulse"
            style={{ width: i === lines - 1 ? "75%" : "100%" }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`h-4 bg-neutral-200 rounded animate-pulse ${className}`}
      aria-label="Loading"
    />
  )
}

export function CompanyCardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-8 rounded-full" />
      </div>
    </div>
  )
}

export function SignalSkeleton() {
  return (
    <div className="border-l-2 border-neutral-200 pl-3 py-2">
      <div className="flex items-start gap-2 mb-1.5">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 flex-1" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

