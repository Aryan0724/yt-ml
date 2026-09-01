import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-xl font-bold tracking-tight">PREYT<span className="text-primary ml-[2px]">↗</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Creator Intelligence Platform. Turning signals into decisions.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard/radar" className="hover:text-foreground transition-colors">Creator Radar</Link></li>
              <li><Link href="/dashboard/ideas" className="hover:text-foreground transition-colors">Ideas</Link></li>
              <li><Link href="/dashboard/analyze" className="hover:text-foreground transition-colors">Package Analyzer</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">

              <li><Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link></li>
              <li><Link href="/help-center" className="hover:text-foreground transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PreYT. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Designed for creators.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
