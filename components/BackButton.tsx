"use client"

import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium"
    >
      ← Back
    </button>
  )
}