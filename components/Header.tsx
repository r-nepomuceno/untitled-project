import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <Link 
          href="/" 
          className="text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
        >
          untitled project
        </Link>
      </div>
    </header>
  )
}