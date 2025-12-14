import LoadingIndicator from "@/components/LoadingIndicator"
import { CompanyCardSkeleton, SignalSkeleton, Skeleton } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Skeleton className="h-8 w-64 mb-8" />

      {/* Industry Activity Skeleton */}
      <section className="mb-12 max-w-3xl">
        <Skeleton className="h-5 w-48 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </section>

      {/* What's Driving Activity Skeleton */}
      <section className="mb-14 max-w-4xl">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="ml-2 space-y-2">
                <SignalSkeleton />
                <SignalSkeleton />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="space-y-8 md:col-span-1">
          <section>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4" />
              ))}
            </div>
          </section>
          <section>
            <Skeleton className="h-5 w-20 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SignalSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Companies */}
        <div className="md:col-span-2">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <section key={i}>
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <CompanyCardSkeleton key={j} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

