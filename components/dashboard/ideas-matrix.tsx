"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Lightbulb, ArrowRight, Target, Activity } from "lucide-react"
import Link from "next/link"

// Dummy data for ideas matrix
const IDEAS = [
  {
    id: "1",
    title: "I Survived 50 Hours In A VR Headset",
    topic: "Apple Vision Pro",
    category: "Technology",
    score: 88,
    demand: "High",
    competition: "Low",
    rationale: "Search volume for 'VR endurance' is up 124%, but only 3 high-quality videos exist. Strong retention format applied to trending hardware."
  },
  {
    id: "2",
    title: "The Real Reason Your AI Startup Will Fail",
    topic: "AI Agents",
    category: "Business",
    score: 84,
    demand: "High",
    competition: "Moderate",
    rationale: "Contrarian angle on a highly saturated topic. Viewers are experiencing 'AI fatigue' and respond well to skeptical/realistic framing."
  },
  {
    id: "3",
    title: "How I Automated My Finances in 10 Minutes",
    topic: "Personal Finance",
    category: "Finance",
    score: 79,
    demand: "Moderate",
    competition: "Low",
    rationale: "High intent audience looking for actionable utility. 'Automated finances' searches peak at the start of every month."
  }
]

export function IdeasMatrix() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const categories = ["All", "Technology", "Business", "Finance", "Gaming", "Entertainment"]

  const filteredIdeas = IDEAS.filter(idea => 
    (selectedCategory === "All" || idea.category === selectedCategory) &&
    (idea.title.toLowerCase().includes(search.toLowerCase()) || idea.topic.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by topic or keyword..." 
            className="pl-9 h-10 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIdeas.length === 0 ? (
          <div className="py-20 text-center bg-card border rounded-3xl">
            <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto opacity-50 mb-4" />
            <h3 className="text-lg font-bold text-foreground">No ideas found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <Card key={idea.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">{idea.category}</Badge>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> Topic: {idea.topic}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground leading-tight">{idea.title}</h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    <strong className="text-foreground font-semibold">Why it works: </strong>
                    {idea.rationale}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:items-end">
                  <div className="flex items-center gap-4 bg-muted/30 px-4 py-3 rounded-xl border">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Demand</span>
                      <span className="text-sm font-semibold text-foreground">{idea.demand}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Competition</span>
                      <span className="text-sm font-semibold text-emerald-600">{idea.competition}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-primary leading-none">{idea.score}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Score</span>
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto rounded-xl" asChild>
                    <Link href={`/dashboard/analyze?title=${encodeURIComponent(idea.title)}&topic=${encodeURIComponent(idea.topic)}`}>
                      Analyze Package <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
