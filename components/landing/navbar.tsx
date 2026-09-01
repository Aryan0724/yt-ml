import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2" aria-label="PreYT Home">
            <span className="text-xl font-bold tracking-tight">PREYT<span className="text-primary ml-[2px]" aria-hidden="true">↗</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground" aria-label="Main Navigation">
            <Link href="/product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="/dashboard/radar" className="hover:text-foreground transition-colors">Radar</Link>
            <Link href="/dashboard/ideas" className="hover:text-foreground transition-colors">Ideas</Link>
            <Link href="/dashboard/analyze" className="hover:text-foreground transition-colors">Analyze</Link>
            <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Button asChild className="rounded-full px-6 hidden sm:inline-flex">
            <Link href="/signup">Get started free →</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open mobile menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
