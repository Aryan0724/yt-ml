"use client"

import React, { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { RadarRegion } from "@/lib/api/radar"
import { getStoredSession } from "@/lib/api/auth"

interface RadarHeaderProps {
  regions: RadarRegion[]
  selectedRegion: string
  onSelectRegion: (code: string) => void
  categories: string[]
  selectedCategory: string
  onSelectCategory: (cat: string) => void
  lastMeasured?: string
}

export function RadarHeader({
  regions,
  selectedRegion,
  onSelectRegion,
  categories,
  selectedCategory,
  onSelectCategory
}: RadarHeaderProps) {
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    const session = getStoredSession()
    if (session?.user?.full_name) {
      setFirstName(session.user.full_name.split(" ")[0])
    }
  }, [])

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl text-muted-foreground font-medium">
          {firstName ? `Good morning, ${firstName}.` : "Good morning."}
        </h1>
      </div>
      <h2 className="text-3xl font-display font-bold text-foreground mb-8">
        What's worth creating today?
      </h2>

      <div className="flex items-center gap-4">
        {/* Region Dropdown */}
        <div className="relative inline-block text-left">
          <select
            value={selectedRegion}
            onChange={(e) => onSelectRegion(e.target.value)}
            className="appearance-none bg-transparent text-foreground font-medium text-sm h-10 pr-6 cursor-pointer focus:outline-none hover:text-primary transition-colors"
            aria-label="Select Market Region"
          >
            {regions.map((reg) => (
              <option key={reg.code} value={reg.code}>
                {reg.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative inline-block text-left">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="appearance-none bg-transparent text-foreground font-medium text-sm h-10 pr-6 cursor-pointer focus:outline-none hover:text-primary transition-colors"
            aria-label="Select Category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All niches" : cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
