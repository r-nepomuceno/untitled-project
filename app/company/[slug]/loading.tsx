import { Skeleton, SignalSkeleton } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Company Name Skeleton */}
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-48 mb-8" />

      {/* Overview Section Skeleton */}
      <section className="mb-10">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton lines={3} className="w-full" />
      </section>

      {/* Signals Section Skeleton */}
      <div className="space-y-8 text-sm text-neutral-700">
        <section>
          <Skeleton className="h-5 w-20 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SignalSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* People Section Skeleton */}
        <section>
          <Skeleton className="h-5 w-16 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-48" />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

