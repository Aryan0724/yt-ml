import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function Waitlist() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-16 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Sparkles className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">Join the <span className="text-gradient">Next Generation</span> <br /> of Creator Intelligence.</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
                We are currently in a closed beta phase, manually onboarding high-signal creators into the Diamond Intelligence ecosystem.
            </p>
            <div className="pt-8">
                <Link 
                    href="/waitlist" 
                    className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all inline-flex items-center gap-3"
                >
                    Apply for Beta Access
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Limited slots available for the May 2026 cohort.</p>
        </div>
      </div>
    </section>
  )
}
