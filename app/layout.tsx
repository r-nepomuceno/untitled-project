import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Market Intelligence Agent",
  description: "AI-powered market & talent intelligence agent",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

