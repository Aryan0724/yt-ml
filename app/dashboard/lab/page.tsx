"use client"

import React from "react"
import { ThumbnailTester } from "@/components/tools/thumbnail-tester"
import { FlaskConical, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardLabPage() {
  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-950">A/B Packaging Lab</h1>
          </div>
          <p className="text-xs text-neutral-500">
            Compare thumbnail variants and title hooks side-by-side in simulated mobile and desktop feeds before rendering final assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/analyze"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Single Video Audit</span>
          </Link>
        </div>
      </div>

      {/* Main Tool Component */}
      <ThumbnailTester />
    </div>
  )
}
