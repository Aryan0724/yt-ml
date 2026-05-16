import Link from "next/link"
import { Diamond, Twitter, Github, Play } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <Diamond className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              <span className="font-display font-bold text-xl tracking-tight">DIAMOND</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Pre-upload intelligence for serious creators. Analyze performance signals before you publish.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/intelligence" className="hover:text-white transition-colors">Intelligence</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Beta App</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/integral-groups" className="hover:text-white transition-colors">Integral Groups</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs">
            &copy; 2026 Diamond Intelligence. Built under the Integral Groups Studio.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Github className="w-4 h-4" /></Link>
            <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Play className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
