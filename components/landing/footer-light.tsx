import NextLink from "next/link"
import { Youtube, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react"

export function FooterLight() {
  return (
    <footer className="bg-[#FAF9F6] border-t border-zinc-200 pt-20 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16 text-sm">
          
          {/* Logo Column */}
          <div className="col-span-2">
            <NextLink href="/" className="flex items-center mb-4 group">
              <img src="/logo-1.png" alt="preYT" className="h-[32px] w-auto" />
            </NextLink>
            <p className="text-zinc-500 max-w-[200px] mb-6 font-mono text-xs font-semibold leading-relaxed">
              [ CREATOR_DECISION_ENGINE ]
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Youtube className="w-4 h-4" />, href: "#" },
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Linkedin className="w-4 h-4" />, href: "#" },
                { icon: <Instagram className="w-4 h-4" />, href: "#" }
              ].map((item, idx) => (
                <NextLink key={idx} href={item.href} className="w-7 h-7 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-450 hover:text-black hover:border-zinc-300 transition-all shadow-sm">
                  {item.icon}
                </NextLink>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          <div>
            <h4 className="font-mono font-bold text-zinc-800 mb-4 uppercase tracking-widest text-[9.5px]">[ Product ]</h4>
            <ul className="space-y-3 text-zinc-500 text-xs font-semibold uppercase font-mono tracking-wider">
              <li><NextLink href="/features" className="hover:text-black transition-colors">Features</NextLink></li>
              <li><NextLink href="/integrations" className="hover:text-black transition-colors">Integrations</NextLink></li>
              <li><NextLink href="/changelog" className="hover:text-black transition-colors">Updates</NextLink></li>
              <li><NextLink href="/roadmap" className="hover:text-black transition-colors">Roadmap</NextLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-zinc-800 mb-4 uppercase tracking-widest text-[9.5px]">[ Solutions ]</h4>
            <ul className="space-y-3 text-zinc-500 text-xs font-semibold uppercase font-mono tracking-wider">
              <li><NextLink href="/creators" className="hover:text-black transition-colors">Creators</NextLink></li>
              <li><NextLink href="/brands" className="hover:text-black transition-colors">Brands</NextLink></li>
              <li><NextLink href="/agencies" className="hover:text-black transition-colors">Agencies</NextLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-zinc-800 mb-4 uppercase tracking-widest text-[9.5px]">[ Resources ]</h4>
            <ul className="space-y-3 text-zinc-500 text-xs font-semibold uppercase font-mono tracking-wider">
              <li><NextLink href="/blog" className="hover:text-black transition-colors">Blog</NextLink></li>
              <li><NextLink href="/guides" className="hover:text-black transition-colors">Guides</NextLink></li>
              <li><NextLink href="/help-center" className="hover:text-black transition-colors">Help Center</NextLink></li>
              <li><NextLink href="/templates" className="hover:text-black transition-colors">Templates</NextLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-zinc-800 mb-4 uppercase tracking-widest text-[9.5px]">[ Company ]</h4>
            <ul className="space-y-3 text-zinc-500 text-xs font-semibold uppercase font-mono tracking-wider">
              <li><NextLink href="/about" className="hover:text-black transition-colors">About Us</NextLink></li>
              <li><NextLink href="/careers" className="hover:text-black transition-colors">Careers</NextLink></li>
              <li><NextLink href="/contact" className="hover:text-black transition-colors">Contact</NextLink></li>
              <li><NextLink href="/partners" className="hover:text-black transition-colors">Partners</NextLink></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 lg:col-span-6 lg:border-t lg:border-zinc-200 lg:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
                <h4 className="font-mono font-bold text-zinc-800 text-[10px] uppercase tracking-widest mb-1">[ Newsletter ]</h4>
                <p className="text-zinc-500 text-xs font-semibold font-mono uppercase tracking-wider">Get the latest news and insights.</p>
             </div>
             <div className="flex gap-2 w-full md:w-auto">
               <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-white border border-zinc-200 rounded px-4 py-2 text-[10px] font-mono w-full md:w-64 focus:outline-none focus:border-black transition-colors text-black shadow-sm" />
               <button className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black rounded transition-all flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-none">
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9.5px] font-mono text-zinc-450 uppercase tracking-widest">
          <p>&copy; 2026 preYT. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <NextLink href="/legal/privacy" className="hover:text-black transition-colors">Privacy</NextLink>
             <NextLink href="/legal/terms" className="hover:text-black transition-colors">Terms</NextLink>
             <NextLink href="/legal/cookies" className="hover:text-black transition-colors">Cookies</NextLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

