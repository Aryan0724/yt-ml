"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react"
import { getTestimonials } from "@/lib/supabase"

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTestimonials() {
      setIsLoading(true)
      const { data } = await getTestimonials()
      
      // Fallback if no testimonials in database yet
      if (!data || data.length === 0) {
        setTestimonials([
          {
            name: "Jack Cole",
            subs: "2.1M subscribers",
            text: "\"preYT helped me 3x my growth in just 2 months. The AI insights are insane. I no longer guess visual hook patterns.\"",
            img: "11",
            handle: "@jackcole"
          },
          {
            name: "Liza Koshy",
            subs: "4.2M subscribers",
            text: "\"The competitor tracking feed is a total game changer. I always know exactly what pacing formulas are converting.\"",
            img: "44",
            handle: "@lizakoshy"
          }
        ])
      } else {
        setTestimonials(data)
      }
      setIsLoading(false)
    }
    
    loadTestimonials()
  }, [])

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-zinc-200" id="blog">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        
        <div className="inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest text-[#FF0000] uppercase mb-4 border border-red-500/10 bg-red-500/5 rounded">
          [ CREATORS // VERIFIED ]
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-16 font-display">
          Hear from our community<span className="text-[#FF0000]">.</span>
        </h2>

        {/* Carousel deck */}
        <div className="relative flex items-center justify-center gap-6 max-w-3xl mx-auto">
          
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors absolute left-0 z-20 -translate-x-12 hidden md:flex active:scale-95"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-zinc-500" />
          </button>

          <div className="w-full min-h-[260px] flex items-center justify-center">
            {isLoading ? (
              <div className="w-full bg-white rounded border border-zinc-100 p-8 h-[260px] animate-pulse flex flex-col justify-between">
                 <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                 <div className="h-4 bg-zinc-200 rounded w-full mb-2"></div>
                 <div className="h-4 bg-zinc-200 rounded w-5/6 mb-8"></div>
                 <div className="flex gap-4 items-center border-t border-zinc-100 pt-5">
                    <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
                    <div className="flex flex-col gap-2"><div className="w-20 h-3 bg-zinc-200 rounded"></div><div className="w-16 h-2 bg-zinc-200 rounded"></div></div>
                 </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {testimonials.map((t, idx) => {
                  if (idx !== activeIndex) return null
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.98, x: 15 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.98, x: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full bg-white rounded border border-zinc-200 p-8 md:p-10 text-left shadow-[4px_4px_0px_rgba(0,0,0,0.06)] flex flex-col justify-between relative overflow-hidden"
                    >
                      <span className="absolute top-3 right-4 font-mono text-[7px] text-zinc-350 tracking-widest uppercase">ID // TESTIMONIAL_0{idx + 1}</span>
                      
                      <div>
                        <div className="text-[4rem] leading-none text-[#FF0000] font-serif mb-2 select-none h-8 opacity-25 font-black">“</div>
                        <p className="text-sm md:text-base font-bold text-zinc-800 leading-relaxed mb-8 pr-6">
                          "{t.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 border-t border-zinc-150 pt-5">
                        <div className="relative flex-shrink-0">
                          <img src={`https://i.pravatar.cc/100?img=${t.img || '11'}`} alt={t.name} className="w-10 h-10 rounded object-cover border border-zinc-200 shadow-sm" />
                          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-[#FF0000] rounded-full border border-white flex items-center justify-center shadow-sm">
                            <Play className="w-2 h-2 text-white fill-white translate-x-[0.5px]" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-zinc-900 flex items-center gap-1">
                            {t.name}
                            <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-50" />
                            <span className="text-[9px] text-zinc-400 font-normal font-mono">{t.handle}</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-450 tracking-wide mt-0.5">{t.subs}</div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>

          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors absolute right-0 z-20 translate-x-12 hidden md:flex active:scale-95"
          >
            <ChevronRight className="w-4.5 h-4.5 text-zinc-500" />
          </button>
        </div>

        {/* Carousel Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded transition-all duration-300 ${
                activeIndex === idx ? "w-5 bg-[#FF0000]" : "w-1.5 bg-zinc-200"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
