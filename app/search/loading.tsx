import Spinner from "@/components/Spinner"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner size="lg" className="text-neutral-400 mb-4" />
        <p className="text-sm text-neutral-600">Searching for companies...</p>
      </div>
    </div>
  )
}

