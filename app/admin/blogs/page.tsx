"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, FileText, CheckCircle, Clock, Search, 
  BarChart3, Calendar, ShieldCheck, Play
} from "lucide-react"

interface BlogMetrics {
  title: string
  slug: string
  author: string
  status: "Published" | "Draft" | "Scheduled"
  organic_ctr: string
  reading_time: string
  clicks: number
  impressions: number
  published_at: string
}

const MOCK_BLOG_METRICS: BlogMetrics[] = [
  {
    title: "Venture-Scale Growth Secrets for Video Content Creators",
    slug: "venture-scale-growth-secrets",
    author: "Aryan Tiwari",
    status: "Published",
    organic_ctr: "4.8%",
    reading_time: "8 mins",
    clicks: 1240,
    impressions: 25800,
    published_at: "May 12, 2026"
  },
  {
    title: "Reverse Engineering the YouTube Algorithm: Titles & CTR Science",
    slug: "reverse-engineering-youtube-algorithm",
    author: "Aryan Tiwari",
    status: "Published",
    organic_ctr: "5.2%",
    reading_time: "12 mins",
    clicks: 840,
    impressions: 16100,
    published_at: "May 08, 2026"
  },
  {
    title: "Why Retention Curves Trump View Counts for Sustainable Growth",
    slug: "why-retention-curves-trump-views",
    author: "Elena Rostova",
    status: "Published",
    organic_ctr: "3.4%",
    reading_time: "6 mins",
    clicks: 412,
    impressions: 12100,
    published_at: "April 28, 2026"
  },
  {
    title: "Mastering YouTube Telemetry in the Era of AI-Driven Recommenders",
    slug: "mastering-youtube-telemetry-ai",
    author: "Sophia Martinez",
    status: "Draft",
    organic_ctr: "—",
    reading_time: "10 mins",
    clicks: 0,
    impressions: 0,
    published_at: "In Drafts"
  }
]

export default function BlogManagementDashboard() {
  const [blogs, setBlogs] = useState<BlogMetrics[]>(MOCK_BLOG_METRICS)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Title */}
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            CMS Editorial & Blog Metrics <BookOpen className="w-5 h-5 text-blue-400" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Review dynamic published blog metrics, click-through rates, and creator engagement logs.</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
            3 Published Articles
          </span>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Blog Impression Pool", value: "54,000", desc: "Total organic visibility", color: "text-blue-500" },
          { label: "Blog Click-Through Rate", value: "4.5%", desc: "Average organic CTR", color: "text-emerald-500" },
          { label: "Avg Article Reading Time", value: "8m 42s", desc: "High creator retention", color: "text-purple-500" }
        ].map((card, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-card border-white/5 flex flex-col justify-between space-y-2 hover:border-white/10 transition-all">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{card.label}</span>
            <div className="text-2xl font-display font-bold text-white">{card.value}</div>
            <span className="text-[10px] text-zinc-600">{card.desc}</span>
          </div>
        ))}
      </section>

      {/* Blogs list */}
      <section className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Search published logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                <th className="py-4 px-3">Title & Path</th>
                <th className="py-4 px-3">Author</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3 text-right">CTR</th>
                <th className="py-4 px-3 text-right">Impressions</th>
                <th className="py-4 px-3 text-right">Organic Clicks</th>
                <th className="py-4 px-3 text-right">Read Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredBlogs.map((b, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                  <td className="py-4 px-3 font-semibold text-white">
                    <div>{b.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">/blog/{b.slug}</div>
                  </td>
                  <td className="py-4 px-3 text-zinc-400 font-medium">{b.author}</td>
                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                      b.status === "Published"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-emerald-400 font-bold">{b.organic_ctr}</td>
                  <td className="py-4 px-3 text-right font-mono">{b.impressions.toLocaleString()}</td>
                  <td className="py-4 px-3 text-right font-mono font-semibold text-white">{b.clicks.toLocaleString()}</td>
                  <td className="py-4 px-3 text-right text-zinc-400 font-semibold">{b.reading_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
