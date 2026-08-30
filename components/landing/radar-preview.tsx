"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Flame, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { fetchRadarTopics, RadarTopicItem } from "@/lib/api/radar"

export function RadarPreview() {
  const [topics, setTopics] = useState<RadarTopicItem[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("IN")

  useEffect(() => {
    fetchRadarTopics({ region: selectedRegion, limit: 4 })
      .then((res) => setTopics(res.topics || []))
      .catch((err) => console.error("Radar preview fetch error:", err))
  }, [selectedRegion])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Creator Radar
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Evidence-Backed Trends
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            What&apos;s Hot Right Now
          </h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Real search demand and acceleration signals across creator niches. Know what your audience wants before you hit record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["IN", "US", "GLOBAL"].map((code) => {
            const labels: Record<string, string> = {
              IN: "🇮🇳 India",
              US: "🇺🇸 US",
              GLOBAL: "🌎 Global"
            }
            const isActive = selectedRegion === code
            return (
              <button
                key={code}
                onClick={() => setSelectedRegion(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {labels[code]}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => {
          return (
            <div
              key={topic.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-500">{topic.category}</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                    {topic.classification}
                  </span>
                </div>
                <h3 className="font-bold text-base text-zinc-900 leading-snug">
                  {topic.canonical_name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {topic.why_this_matters}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-medium">Opportunity</span>
                  <span className="text-sm font-extrabold text-zinc-900">
                    {Math.round(topic.opportunity.score)}/100
                  </span>
                </div>
                <Link
                  href={`/dashboard/radar/${topic.slug}?region=${selectedRegion}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 hover:text-amber-600 transition"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center sm:text-right">
        <Link
          href="/dashboard/radar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition shadow-sm"
        >
          <span>Open Creator Radar Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
