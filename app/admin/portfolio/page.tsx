"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Loader2, Play, Users } from "lucide-react"

interface PortfolioCreator {
  id: string
  full_name: string
  email: string
  youtube_channel: string
  niche: string
  consent_public_showcase: boolean
  is_featured_in_portfolio: boolean
}

export default function AdminPortfolioPage() {
  const [creators, setCreators] = useState<PortfolioCreator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCreators(data.creators)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const newVal = !currentStatus
    setCreators(prev => prev.map(c => c.id === id ? { ...c, is_featured_in_portfolio: newVal } : c))
    
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: newVal })
      })
      if (!res.ok) throw new Error("Failed to update")
    } catch (err) {
      console.error(err)
      // Revert on error
      setCreators(prev => prev.map(c => c.id === id ? { ...c, is_featured_in_portfolio: currentStatus } : c))
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-zinc-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#FF0000]" />
            Portfolio Management
          </h1>
          <p className="text-zinc-500 mt-2">Manage which opted-in creators appear on the landing page ticker.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading creators...
        </div>
      ) : creators.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900">No Opt-Ins Yet</h3>
          <p className="text-zinc-500">Creators who opt-in to the portfolio showcase will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Channel / Niche</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Featured on Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {creators.map(creator => (
                <tr key={creator.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900">{creator.full_name}</div>
                    <div className="text-sm text-zinc-500">{creator.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3 text-[#FF0000]" />
                      <span className="font-medium text-zinc-900">{creator.youtube_channel}</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{creator.niche}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(creator.id, creator.is_featured_in_portfolio)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${creator.is_featured_in_portfolio ? 'bg-black' : 'bg-zinc-200'}`}
                    >
                      <span className="sr-only">Toggle feature</span>
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${creator.is_featured_in_portfolio ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                    {creator.is_featured_in_portfolio && (
                      <span className="ml-3 text-xs font-bold text-[#FF0000] uppercase tracking-wider">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
