"use client"

import { useEffect, useState } from "react"
import { getStoredSession, AuthSession } from "@/lib/api/auth"
import { fetchRadarTopics, RadarTopicItem } from "@/lib/api/radar"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, TrendingDown, Bookmark, Settings, ArrowRight, Youtube, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardIndex() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [radarTopics, setRadarTopics] = useState<RadarTopicItem[]>([])
  
  useEffect(() => {
    const s = getStoredSession()
    if (s) setSession(s)

    fetchRadarTopics({ limit: 4 })
      .then(res => setRadarTopics(res.topics.slice(0, 4)))
      .catch(console.error)
  }, [])

  const firstName = session?.user?.full_name?.split(" ")[0] || "User"
  const channel = session?.user?.youtube_channel

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's your creator intelligence for today.
        </p>
      </header>

      {/* Connected Channel Status Banner */}
      {channel ? (
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-shadow">
          <div className="flex items-center gap-3.5">
            {channel.avatarUrl ? (
              <Image
                src={channel.avatarUrl}
                alt={channel.title}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Youtube className="w-6 h-6 fill-red-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-neutral-900">{channel.title}</h2>
                <CheckCircle2 className="w-4 h-4 text-red-600 fill-red-50" />
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                {channel.handle} • {channel.subscriberCount ? `${Number(channel.subscriberCount).toLocaleString()} subscribers` : "Verified Channel"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/channel"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Channel DNA
            </Link>
            <Link
              href="/dashboard/analyze"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Audit New Video
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Youtube className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Connect your YouTube Channel</h2>
              <p className="text-xs text-neutral-600">Import your channel baseline velocity and customize CTR predictions.</p>
            </div>
          </div>
          <Link
            href="/dashboard/channel"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-center shrink-0"
          >
            Connect Channel →
          </Link>
        </div>
      )}

      {/* What's happening now */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm">What's happening now</h2>
          <Link href="/dashboard/radar" className="text-xs text-primary font-medium hover:underline">
            View Radar &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {radarTopics.length > 0 ? radarTopics.map(topic => (
            <div key={topic.id} className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
              <span className={cn(
                "inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border mb-3",
                topic.classification === "BREAKING" ? "bg-red-50 text-red-600 border-red-100" :
                topic.classification === "HOT" ? "bg-orange-50 text-orange-600 border-orange-100" :
                "bg-primary/10 text-primary border-primary/20"
              )}>
                {topic.classification}
              </span>
              <h3 className="font-semibold text-[13px] leading-snug mb-4 line-clamp-1">{topic.canonical_name}</h3>
              <div className="text-[10px] text-muted-foreground mb-1">Opportunity Score</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold leading-none">{Math.round(topic.opportunity.score)}</span>
                {topic.metrics.momentum > 0.5 ? (
                  <span className="text-[10px] font-medium leading-none mb-0.5 text-primary flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {(topic.metrics.momentum * 100).toFixed(0)}%
                  </span>
                ) : (
                  <span className="text-[10px] font-medium leading-none mb-0.5 text-muted-foreground flex items-center">
                    {(topic.metrics.momentum * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          )) : (
            [1,2,3,4].map(i => (
              <div key={i} className="p-4 rounded-xl border bg-card h-[120px] animate-pulse" />
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <section className="border rounded-2xl p-6 bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-sm">Top opportunities for you</h2>
            <Link href="/dashboard/ideas" className="text-xs text-primary font-medium hover:underline">
              View all &rarr;
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground mb-2">No ideas generated yet.</p>
              <Link href="/dashboard/ideas" className="text-xs font-semibold text-primary">
                Find your first idea
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Analyses */}
        <section className="border rounded-2xl p-6 bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-sm">Recent analyses</h2>
            <Link href="/dashboard/history" className="text-xs text-primary font-medium hover:underline">
              View all &rarr;
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground mb-2">You haven't analyzed any packages yet.</p>
              <Link href="/dashboard/analyze" className="text-xs font-semibold text-primary">
                Analyze a package
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Performance Overview (Placeholder visually matching design, empty state) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="border rounded-2xl p-6 bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-sm">Your performance overview</h2>
            <select className="text-xs border rounded px-2 py-1 bg-transparent text-muted-foreground outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Analyses</div>
              <div className="text-2xl font-semibold mb-2">0</div>
              <div className="text-[10px] text-muted-foreground">vs last 7 days</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Avg. Score</div>
              <div className="text-2xl font-semibold mb-2">-</div>
              <div className="text-[10px] text-muted-foreground">vs last 7 days</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Ideas Created</div>
              <div className="text-2xl font-semibold mb-2">0</div>
              <div className="text-[10px] text-muted-foreground">vs last 7 days</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Credits Used</div>
              <div className="text-2xl font-semibold mb-2">0</div>
              <div className="text-[10px] text-muted-foreground">vs last 7 days</div>
            </div>
          </div>
        </div>

        <div className="border rounded-2xl p-6 bg-card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-sm">Credits remaining</h2>
              <span className="text-[10px] text-muted-foreground">Reset on 1st</span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-semibold">3,000</span>
              <span className="text-xs text-muted-foreground"> / 3,000 left</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full w-[0%] bg-primary rounded-full" />
            </div>
          </div>
          <button className="w-full py-2 bg-background border rounded-lg text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </section>

    </div>
  )
}
