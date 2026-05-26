import Link from "next/link"
import { Twitter, Github, Play, ArrowRight, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-24 pb-12 px-6 overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[100px] bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <img src="/logo-1.png" alt="preYT" className="h-8 logo-dark-mode transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed mb-8">
              Pre-upload intelligence for serious creators. Analyze performance signals before you publish. Built for the YouTube algorithm.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all shadow-[0_0_0_rgba(255,0,0,0)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all shadow-[0_0_0_rgba(255,0,0,0)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                <Youtube className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all shadow-[0_0_0_rgba(255,0,0,0)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/features" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Features</Link></li>
              <li><Link href="/intelligence" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Intelligence</Link></li>
              <li><Link href="/changelog" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Changelog</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Beta App</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Blog</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-primary transition-all group-hover:w-2" />Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
             <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Stay Updated</h4>
             <p className="text-sm text-zinc-500 mb-4 leading-relaxed">Join the waitlist to get early access and updates on new algorithmic models.</p>
             <div className="flex gap-2">
               <input type="email" placeholder="Enter your email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none focus:border-primary transition-colors text-white" />
               <button className="px-4 py-3 bg-white text-black rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs">
            &copy; 2026 preYT. Built under the Integral Groups Studio.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
             <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
