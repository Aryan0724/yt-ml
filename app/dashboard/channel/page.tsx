"use client"

import React, { useState } from "react"
import { Database, Youtube, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"

export default function ChannelDnaPage() {
  const [channelInput, setChannelInput] = useState("")

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-left pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Channel DNA Intelligence
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Connect your verified YouTube channel to calibrate personalized visual thresholds and niche baselines.
        </p>
      </div>

      {/* Honest Empty State / Connection Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
          <Youtube className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Connect Your YouTube Channel
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Unlock personalized thumbnail scoring based on your actual audience recognition patterns, upload history, and niche category.
          </p>
        </div>

        {/* Benefits List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 max-w-lg mx-auto">
          {[
            "Real subscriber & view baseline calibration",
            "Personalized channel visual style match %",
            "Niche competitor overlap tracking",
            "Zero guesswork or fabricated statistics"
          ].map((benefit, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => alert("OAuth connection feature is in private rollout. Stay tuned!")}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>Connect YouTube via OAuth</span>
          </button>
          <p className="text-[10px] text-zinc-400 mt-2">
            Read-only analytics access · Safe & compliant with YouTube API Terms
          </p>
        </div>
      </div>
    </div>
  )
}
