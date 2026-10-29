"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Eye,
  Film
} from "lucide-react"

interface IdeaRecord {
  title: string
  thumbnailConcept: string
  curiosityHook: string
  targetCtr: string
  archetype: string
}

const DATABASE: Record<string, IdeaRecord[]> = {
  tech: [
    {
      title: "Why Senior Developers Don't Write Code Anymore",
      thumbnailConcept: "Close-up of dual terminal screens with 0 lines of code; frustrated senior engineer looking away; bold text 'OBSOLETE?'",
      curiosityHook: "Counter-intuitive role reversal challenging the conventional path of software engineers.",
      targetCtr: "8.2% – 10.4%",
      archetype: "Contrarian Career"
    },
    {
      title: "I Replaced My Entire Engineering Team With Local LLMs",
      thumbnailConcept: "Split view: 5 empty desks with chairs turned on left; single glowing black Mac Studio on right with green activity light.",
      curiosityHook: "Extreme business challenge with high stakes and tangible productivity claims.",
      targetCtr: "7.8% – 9.6%",
      archetype: "Extreme Experiment"
    },
    {
      title: "The Linux Distro That Will Kill Windows in 2026",
      thumbnailConcept: "Sleek dark futuristic desktop OS preview; cracked Windows 11 logo falling into shadow in the background.",
      curiosityHook: "David vs Goliath software rivalry creating an open technical question.",
      targetCtr: "8.9% – 11.2%",
      archetype: "David vs Goliath"
    },
    {
      title: "How Apple Secretly Won the AI Hardware War",
      thumbnailConcept: "Macro photo of M4 chip die glowing gold; small shadow of Nvidia logo fading in corner.",
      curiosityHook: "Hidden corporate strategy reveal with contrarian hardware analysis.",
      targetCtr: "7.5% – 9.1%",
      archetype: "Corporate Deep Dive"
    }
  ],
  finance: [
    {
      title: "The Stock Market Trap Nobody is Talking About in 2026",
      thumbnailConcept: "Wall Street bull statue shrouded in red fog; line chart showing sharp upward spike followed by a question mark.",
      curiosityHook: "Hidden systemic financial risk warning that creates immediate viewer FOMO and caution.",
      targetCtr: "8.4% – 10.8%",
      archetype: "Systemic Warning"
    },
    {
      title: "I Built a $10M Business With 0 Employees (Full Blueprint)",
      thumbnailConcept: "Solo laptop on a simple wooden table overlooking mountains; verified Stripe dashboard showing $830,000/mo.",
      curiosityHook: "Zero-employee leverage case study establishing extreme efficiency.",
      targetCtr: "9.1% – 11.8%",
      archetype: "Solopreneur Proof"
    },
    {
      title: "Why Index Funds Are No Longer Enough (Math Breakdown)",
      thumbnailConcept: "Calculator with glowing red screen showing 'INSUFFICIENT'; stack of retirement books in soft background focus.",
      curiosityHook: "Attacks foundational Boglehead wisdom with empirical financial math.",
      targetCtr: "7.9% – 9.8%",
      archetype: "Dogma Challenge"
    },
    {
      title: "How Real Estate Private Equity Actually Screws Investors",
      thumbnailConcept: "Modern glass skyscraper behind blueprint schematic; highlighted clause with red magnifying glass.",
      curiosityHook: "Behind-the-curtain institutional exposé revealing hidden fees.",
      targetCtr: "8.0% – 10.2%",
      archetype: "Industry Exposé"
    }
  ],
  gaming: [
    {
      title: "The Unsolved GTA 6 Mystery Rockstar Tried to Delete",
      thumbnailConcept: "High-contrast Vice City neon coastline at dusk; redacted FBI dossier file stamped 'REMOVED' over map coordinates.",
      curiosityHook: "Corporate secrecy and deleted content in gaming's most anticipated franchise.",
      targetCtr: "9.5% – 12.4%",
      archetype: "Gaming Investigation"
    },
    {
      title: "I Survived 100 Days in The Hardest Minecraft Mod Ever Made",
      thumbnailConcept: "Player character standing on edge of obsidian cliff; red sky with massive looming shadow titan; health bar at half-heart.",
      curiosityHook: "Survival jeopardy with visually unmistakable stakes and near-death threshold.",
      targetCtr: "8.8% – 11.0%",
      archetype: "Jeopardy Challenge"
    },
    {
      title: "Why Elden Ring's DLC Broke Competitive Gamers",
      thumbnailConcept: "Split reaction: Elite gamer with head in hands; boss silhouette holding dual red blades in golden ruins.",
      curiosityHook: "Difficulty breakdown exploring the limits of player mechanical skill.",
      targetCtr: "8.1% – 9.9%",
      archetype: "Meta Breakdown"
    },
    {
      title: "The Forgotten MMORPG Economy That Collapsed Overnight",
      thumbnailConcept: "Barren virtual marketplace with abandoned shops; gold coin with giant red slash through it.",
      curiosityHook: "Virtual economic catastrophe with documentary narrative tension.",
      targetCtr: "7.6% – 9.4%",
      archetype: "Virtual History"
    }
  ],
  essay: [
    {
      title: "The Architecture of Loneliness in Modern Megacities",
      thumbnailConcept: "Lone illuminated apartment window in a massive towering dark Tokyo high-rise at 3 AM; rain streaks on glass.",
      curiosityHook: "Deep emotional resonance connecting physical architecture to human existential isolation.",
      targetCtr: "8.3% – 10.5%",
      archetype: "Cultural Philosophy"
    },
    {
      title: "How Fast Fashion Engineered a Psychological Addiction",
      thumbnailConcept: "Giant landfill of colorful clothing forming a silhouette of a smartphone; shopping cart notification badge.",
      curiosityHook: "Consumer psychology deconstruction explaining modern dopamine loops.",
      targetCtr: "7.9% – 9.7%",
      archetype: "Psychology Exposé"
    },
    {
      title: "The Bizarre Rise and Sudden Fall of Cinephile Culture",
      thumbnailConcept: "Empty vintage velvet theater seats with a single projector beam showing static noise; glowing smartphone in lap.",
      curiosityHook: "Nostalgic cultural shift exploring how streaming altered media reverence.",
      targetCtr: "7.4% – 9.2%",
      archetype: "Media Ecology"
    },
    {
      title: "Why Every Modern Hollywood Movie Looks So Ugly",
      thumbnailConcept: "Side-by-side color comparison: Warm saturated 1999 35mm film frame vs muted muddy grey 2025 CGI scene.",
      curiosityHook: "Visual aesthetic critique validating a widespread unspoken viewer frustration.",
      targetCtr: "9.2% – 11.9%",
      archetype: "Aesthetic Critique"
    }
  ]
}

export function IdeaGenerator() {
  const [selectedNiche, setSelectedNiche] = useState<string>("tech")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const ideas = useMemo(() => {
    return DATABASE[selectedNiche] || DATABASE.tech
  }, [selectedNiche, refreshKey])

  const copyBrief = (idea: IdeaRecord, idx: number) => {
    const text = `TITLE: ${idea.title}\nTHUMBNAIL: ${idea.thumbnailConcept}\nWHY IT CLICKS: ${idea.curiosityHook}`
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Selector Rail */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              [ NICHE CATEGORY SELECTOR ]
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: "tech", label: "Tech & Coding" },
                { id: "finance", label: "Finance & Business" },
                { id: "gaming", label: "Gaming & Lore" },
                { id: "essay", label: "Video Essays & Culture" }
              ].map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNiche(n.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedNiche === n.id
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Shuffle Hooks</span>
          </button>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all space-y-4 flex flex-col justify-between shadow-2xs group"
            >
              <div className="space-y-3">
                {/* Meta Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-neutral-200/70 text-neutral-800 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {idea.archetype}
                  </span>
                  <span className="text-emerald-700 font-mono font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    Est. CTR: {idea.targetCtr}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-neutral-950 group-hover:text-red-600 transition-colors leading-snug">
                  &quot;{idea.title}&quot;
                </h3>

                {/* Thumbnail Visual Brief */}
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-500 uppercase">
                    <Eye className="w-3 h-3 text-red-600" />
                    <span>Visual Thumbnail Concept</span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                    {idea.thumbnailConcept}
                  </p>
                </div>

                {/* Why It Works */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Curiosity Trigger:</div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {idea.curiosityHook}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">{idea.title.length} characters</span>
                <button
                  type="button"
                  onClick={() => copyBrief(idea, idx)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-red-600 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Brief Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Brief</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
