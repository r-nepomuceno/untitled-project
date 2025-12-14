"use client"

import { useState, useEffect } from "react"
import Spinner from "./Spinner"

type Props = {
  message?: string
  estimatedTime?: string
}

export default function LoadingIndicator({
  message = "Loading...",
  estimatedTime,
}: Props) {
  const [progressMessage, setProgressMessage] = useState(message)

  // Simulate progress messages for better UX
  useEffect(() => {
    const messages = [
      "Searching for results...",
      "Extracting company data...",
      "Processing signals...",
      "Rendering results...",
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < messages.length - 1) {
        currentIndex++
        setProgressMessage(messages[currentIndex])
      }
    }, 5000) // Change message every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Spinner size="lg" className="text-neutral-400" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-neutral-700">{progressMessage}</p>
        {estimatedTime && (
          <p className="text-xs text-neutral-500">{estimatedTime}</p>
        )}
      </div>
    </div>
  )
}

