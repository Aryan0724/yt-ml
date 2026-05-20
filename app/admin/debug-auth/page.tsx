"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Search, ShieldCheck, KeyRound, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react"

type ProbeResponse = {
  success: boolean
  latestUsers: Array<{
    id: string
    full_name: string
    email: string
    status: string
    beta_access_token?: string | null
    approved_at?: string | null
    created_at?: string | null
    daily_usage_limit?: number
    usage_remaining?: number
  }>
  dbError: { message: string; code?: string } | null
  probe: null | {
    ok: boolean
    status: string
    error?: string
    debug?: Record<string, unknown>
    user?: Record<string, unknown>
  }
}

export default function DebugAuthPage() {
  const [email, setEmail] = useState("rabindraojha3002@gmail.com")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ProbeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (email.trim()) params.set("email", email.trim())
      if (token.trim()) params.set("token", token.trim())
      const res = await fetch(`/api/admin/debug-auth?${params.toString()}`)
      const payload = await res.json()
      if (!res.ok || payload.success === false) {
        throw new Error(payload.error || "Failed to load debug auth data.")
      }
      setData(payload)
    } catch (err: any) {
      setError(err.message || "Debug auth request failed.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Beta Auth Debug
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Inspect production beta rows and validate email + token lookup.</p>
        </div>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <section className="p-5 rounded-[2rem] glass-card border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Lookup Probe</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-xs text-white outline-none"
            />
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Beta token"
              className="w-full rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-xs text-white outline-none font-mono"
            />
          </div>
          <button
            onClick={load}
            className="px-4 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Run Lookup
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              {error}
            </div>
          )}

          {data?.probe && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${data.probe.ok ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-100" : "bg-red-500/5 border-red-500/20 text-red-100"}`}>
              <div className="font-bold uppercase tracking-widest">
                {data.probe.ok ? "Match found" : `Lookup failed: ${data.probe.status}`}
              </div>
              <div>{data.probe.error || "No error"}</div>
              <pre className="whitespace-pre-wrap text-[10px] text-zinc-300 overflow-auto">
                {JSON.stringify(data.probe.debug || {}, null, 2)}
              </pre>
            </div>
          )}
        </section>

        <section className="p-5 rounded-[2rem] glass-card border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Latest Beta Rows</h2>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
            {(data?.latestUsers || []).map((user) => (
              <div key={user.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{user.full_name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{user.email}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : user.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> token: {user.beta_access_token ? "yes" : "no"}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> approved: {user.approved_at ? "yes" : "no"}</span>
                  <span className="inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" /> credits: {user.usage_remaining ?? 0}/{user.daily_usage_limit ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
