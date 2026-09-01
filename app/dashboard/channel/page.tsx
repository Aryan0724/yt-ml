"use client"

import React, { useState } from "react"
import { Database, Youtube, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ChannelDnaPage() {
  const [channelInput, setChannelInput] = useState("")

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Channel DNA Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your verified YouTube channel to calibrate personalized visual thresholds and niche baselines.
        </p>
      </div>

      {/* Honest Empty State / Connection Card */}
      <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 bg-muted/10">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-600">
          <Youtube className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Connect Your YouTube Channel
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Unlock personalized thumbnail scoring based on your actual audience recognition patterns, upload history, and niche category.
          </p>
        </div>

        {/* Benefits List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4 max-w-lg mx-auto">
          {[
            "Real subscriber & view baseline calibration",
            "Personalized channel visual style match %",
            "Niche competitor overlap tracking",
            "Zero guesswork or fabricated statistics"
          ].map((benefit, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-background border flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs text-foreground font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-6 max-w-sm mx-auto">
          <Button
            size="lg"
            onClick={() => alert("OAuth connection feature is in private rollout. Stay tuned!")}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Connect YouTube via OAuth
          </Button>
          <p className="text-[10px] text-muted-foreground mt-3">
            Read-only analytics access · Safe & compliant with YouTube API Terms
          </p>
        </div>
      </Card>
    </div>
  )
}
