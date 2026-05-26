"use client"

import { motion } from "framer-motion"

export function TrustedBrands() {
  const brands = [
    {
      name: "MRBEAST",
      logo: (
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-zinc-900">
          <div className="w-6 h-6 bg-zinc-900 rounded-full" />
          MRBEAST
        </div>
      )
    },
    {
      name: "vidIQ",
      logo: <div className="font-bold text-xl tracking-tight text-zinc-900">vidIQ</div>
    },
    {
      name: "Linus Tech Tips",
      logo: (
        <div className="flex items-center gap-2 font-black text-lg tracking-tight uppercase text-zinc-900">
          <div className="w-5 h-5 border-[3px] border-zinc-900 rounded-md" />
          Linus Tech Tips
        </div>
      )
    },
    {
      name: "PewDiePie",
      logo: (
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-zinc-900">
          <div className="w-6 h-6 bg-red-500 rounded-full" />
          PewDiePie
        </div>
      )
    },
    {
      name: "JennaMarbles",
      logo: <div className="font-bold text-lg font-serif italic text-zinc-900">JennaMarbles</div>
    },
    {
      name: "Nas Daily",
      logo: (
        <div className="flex items-center gap-2 font-black text-xl tracking-tight text-zinc-900">
          <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center text-white text-[10px] font-black">N</div>
          Nas Daily
        </div>
      )
    }
  ]

  // Duplicate to make a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands]

  return (
    <section className="py-12 border-b border-zinc-200 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <h3 className="text-center text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-8">
          Trusted by top creators and brands
        </h3>

        {/* Marquee Ticker Wrap */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks for edge fading */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Row */}
          <motion.div
            className="flex gap-20 items-center w-max opacity-50 grayscale hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {duplicatedBrands.map((brand, idx) => (
              <div key={idx} className="flex-shrink-0">
                {brand.logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
