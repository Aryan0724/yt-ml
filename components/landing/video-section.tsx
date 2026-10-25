"use client"

import { useState } from "react"
import { Play, Sparkles, ArrowDown, CheckCircle2 } from "lucide-react"

/**
 * VIDEO_ID: Set this to the actual YouTube video ID once available.
 * Example: "dQw4w9WgXcQ" → https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *
 * Configured via NEXT_PUBLIC_INTRO_VIDEO_ID in .env.local
 */
const VIDEO_ID = process.env.NEXT_PUBLIC_INTRO_VIDEO_ID || "ZxDEOgFOfy4"

export function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section
      id="demo-video"
      className="py-20 md:py-24 bg-white border-b border-neutral-200"
      aria-labelledby="video-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>SEE PREYT IN ACTION</span>
          </div>

          <h2
            id="video-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]"
          >
            From raw draft to data-backed decision{" "}
            <br className="hidden sm:inline" />
            <span className="text-[#EE1122]">in under 60 seconds.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Watch how PreYT tests your title and thumbnail on real mobile feeds,
            catches cutoffs before your audience does, and gives you exact fixes
            before you spend 40 hours filming.
          </p>
        </div>

        {/* 16:9 Video Container */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-neutral-950">
          <div className="aspect-video w-full">
            {VIDEO_ID && playing ? (
              /* Live YouTube embed — autoplay on user click */
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="PreYT platform walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : VIDEO_ID ? (
              /* Thumbnail click-to-play */
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full group cursor-pointer"
                aria-label="Play PreYT product walkthrough video"
              >
                <img
                  src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                  alt="PreYT product walkthrough thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/25 transition-colors">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-200">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#EE1122] fill-current ml-1" />
                  </div>
                </div>
              </button>
            ) : (
              /* High-fidelity interactive preview card shown until VIDEO_ID is added */
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white">
                {/* Top status */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    PREYT PRE-UPLOAD WORKFLOW
                  </span>
                  <span className="text-neutral-400">Duration: 60 Seconds</span>
                </div>

                {/* Center Visual Summary */}
                <div className="text-center max-w-xl mx-auto space-y-4 py-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EE1122] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/30">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current ml-1" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    How Creators Audit a Video in 3 Steps
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="text-[#EE1122] font-mono font-bold">STEP 1</div>
                      <div className="font-semibold text-white">Pick a High-Demand Topic</div>
                      <div className="text-neutral-400 text-[11px]">Scan search volume gaps</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="text-[#EE1122] font-mono font-bold">STEP 2</div>
                      <div className="font-semibold text-white">Preview on Mobile Feeds</div>
                      <div className="text-neutral-400 text-[11px]">Test 48-char cutoff & dark theme</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="text-[#EE1122] font-mono font-bold">STEP 3</div>
                      <div className="font-semibold text-white">Get Pre-Filming Fixes</div>
                      <div className="text-neutral-400 text-[11px]">Audit hook before filming</div>
                    </div>
                  </div>
                </div>

                {/* Bottom link to capabilities */}
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10 font-mono">
                  <span>No channel connection needed</span>
                  <a
                    href="#capabilities"
                    className="text-white hover:text-red-400 flex items-center gap-1.5 transition-colors font-semibold"
                  >
                    <span>See interactive tools below</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Below-video sub-copy */}
        <p className="mt-6 text-center text-xs sm:text-sm text-neutral-500 font-mono">
          No YouTube channel connection required · Works on any video concept, draft, or outline
        </p>
      </div>
    </section>
  )
}
