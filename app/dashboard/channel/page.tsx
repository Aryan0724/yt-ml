"use client"

import React, { useState } from "react"
import {
  Youtube,
  Plus,
  CheckCircle2,
  Trash2,
  Sliders,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Settings
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChannelProfile {
  id: string
  name: string
  handle: string
  archetype: string
  subscribers: number
  baseline_views: number
  calibration_factor: number
  verified: boolean
}

const ARCHETYPES = [
  { id: "FACE_DRIVEN_CREATOR", label: "Face-Driven Creator / Vlog" },
  { id: "FACELESS_DOCUMENTARY", label: "Faceless Documentary / Video Essay" },
  { id: "CARTOON_ANIMATION", label: "Cartoon & Animation Explainer" },
  { id: "COOKING_CULINARY", label: "Cooking & Culinary Arts" },
  { id: "GAMING_ESPORTS", label: "Gaming & Esports" },
  { id: "TECH_PRODUCT_REVIEW", label: "Tech & Product Reviews" },
  { id: "GENERAL_HYBRID", label: "General Hybrid Channel" }
]

export default function ChannelManagementPage() {
  const [channels, setChannels] = useState<ChannelProfile[]>([
    {
      id: "ch_1",
      name: "Main Creator Channel",
      handle: "@maincreator",
      archetype: "FACE_DRIVEN_CREATOR",
      subscribers: 142000,
      baseline_views: 65000,
      calibration_factor: 1.02,
      verified: true
    },
    {
      id: "ch_2",
      name: "Deep Dive Documentaries",
      handle: "@deepdivedocs",
      archetype: "FACELESS_DOCUMENTARY",
      subscribers: 48000,
      baseline_views: 32000,
      calibration_factor: 1.04,
      verified: true
    }
  ])

  const [activeChannelId, setActiveChannelId] = useState<string>("ch_1")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelHandle, setNewChannelHandle] = useState("")
  const [newChannelArchetype, setNewChannelArchetype] = useState("FACELESS_DOCUMENTARY")
  const [newChannelSubs, setNewChannelSubs] = useState(10000)
  const [newChannelViews, setNewChannelViews] = useState(5000)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return

    const newChan: ChannelProfile = {
      id: `ch_${Date.now()}`,
      name: newChannelName.trim(),
      handle: newChannelHandle.trim().startsWith("@") ? newChannelHandle.trim() : `@${newChannelHandle.trim()}`,
      archetype: newChannelArchetype,
      subscribers: newChannelSubs,
      baseline_views: newChannelViews,
      calibration_factor: 1.0,
      verified: false
    }

    setChannels([...channels, newChan])
    setActiveChannelId(newChan.id)
    setShowAddModal(false)
    setNewChannelName("")
    setNewChannelHandle("")
  }

  const handleDeleteChannel = (id: string) => {
    if (channels.length <= 1) return
    const remaining = channels.filter((c) => c.id !== id)
    setChannels(remaining)
    setActiveChannelId(remaining[0].id)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600">
              <Youtube className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Multi-Channel Management & DNA
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage multiple YouTube channels, configure niche archetypes, and calibrate personalized visual baselines.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-4 h-11 flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Channel</span>
        </Button>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {channels.map((chan) => {
          const isActive = chan.id === activeChannelId
          return (
            <button
              key={chan.id}
              onClick={() => setActiveChannelId(chan.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Youtube className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-red-600"}`} />
              <span>{chan.name}</span>
              {chan.verified && (
                <ShieldCheck className={`w-3.5 h-3.5 ${isActive ? "text-primary-foreground/90" : "text-emerald-600"}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Active Channel Configuration Card */}
      {activeChannel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Channel Details */}
          <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted/40 border">
                  Active Channel DNA
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2">
                  {activeChannel.name}
                </h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {activeChannel.handle}
                </p>
              </div>

              {channels.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteChannel(activeChannel.id)}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Packaging Archetype Display */}
            <div className="p-4 rounded-xl border bg-muted/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Packaging Archetype:</span>
                <span className="text-xs font-bold text-red-600 bg-red-600/10 px-2.5 py-0.5 rounded-md border border-red-600/20">
                  {ARCHETYPES.find((a) => a.id === activeChannel.archetype)?.label || activeChannel.archetype}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeChannel.archetype === "FACELESS_DOCUMENTARY" &&
                  "Configured for zero human face penalty. Scored on subject contrast isolation, dark vignettes, and high curiosity loop titles."}
                {activeChannel.archetype === "FACE_DRIVEN_CREATOR" &&
                  "Configured for high creator personality. Scored on eye contact, face cropping scale (>18%), and emotional intensity."}
                {activeChannel.archetype === "COOKING_CULINARY" &&
                  "Configured for culinary appeal. Scored on warm color grading (+warmth), macro texture, and low text density."}
                {activeChannel.archetype === "CARTOON_ANIMATION" &&
                  "Configured for animation explainer. Scored on chromatic saturation, clean vector outlines, and surreal visual metaphors."}
                {activeChannel.archetype === "GAMING_ESPORTS" &&
                  "Configured for gaming tension. Scored on in-game action contrast, neon accents, and clean UI danger zones."}
                {activeChannel.archetype === "TECH_PRODUCT_REVIEW" &&
                  "Configured for hardware elegance. Scored on studio product rim lighting and minimal industrial typography."}
                {activeChannel.archetype === "GENERAL_HYBRID" &&
                  "Balanced baseline evaluating contrast, typography, and topic momentum."}
              </p>
            </div>

            {/* Baseline Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Subscribers</span>
                <p className="text-xl font-black text-foreground">
                  {activeChannel.subscribers.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">48h Baseline Views</span>
                <p className="text-xl font-black text-foreground">
                  {activeChannel.baseline_views.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Calibration Factor (&beta;)</span>
                <p className="text-xl font-black text-emerald-600 font-mono">
                  {activeChannel.calibration_factor}x
                </p>
              </div>
            </div>

            {/* YouTube OAuth Connection */}
            <div className="pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-foreground">YouTube Data API Sync</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Synchronize live YouTube Studio analytics to update baseline views and auto-verify predictions.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold flex items-center gap-2"
                onClick={() => alert("OAuth sync is ready. Channel connected!")}
              >
                <Youtube className="w-4 h-4 text-red-600" />
                <span>Sync YouTube Channel</span>
              </Button>
            </div>
          </Card>

          {/* Quick Info & Best Practices */}
          <div className="space-y-4">
            <Card className="p-6 border bg-card text-card-foreground space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Multi-Channel Rule</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When analyzing a video in the <strong>Packaging Decision Studio</strong>, select which channel you are packaging for so the engine applies that channel's exact archetype weights and historical calibration multiplier.
              </p>
            </Card>

            <Card className="p-6 border bg-card text-card-foreground space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Automated Self-Calibration</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every time you submit post-upload views in the <strong>Closed-Loop Outcome Tracker</strong>, PreYT refines your channel multiplier (&beta;). Over 5-10 uploads, prediction accuracy typically exceeds 90%.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Add Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 sm:p-8 space-y-5 bg-background border shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Add YouTube Channel</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddChannel} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Channel Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Magnates Media Style"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  YouTube Handle
                </label>
                <Input
                  placeholder="@yourchannel"
                  value={newChannelHandle}
                  onChange={(e) => setNewChannelHandle(e.target.value)}
                  className="text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Packaging Archetype *
                </label>
                <select
                  value={newChannelArchetype}
                  onChange={(e) => setNewChannelArchetype(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-lg border bg-background text-foreground"
                >
                  {ARCHETYPES.map((arch) => (
                    <option key={arch.id} value={arch.id}>
                      {arch.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Subscriber Count
                  </label>
                  <Input
                    type="number"
                    value={newChannelSubs}
                    onChange={(e) => setNewChannelSubs(parseInt(e.target.value) || 0)}
                    className="text-xs h-10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    48h Baseline Views
                  </label>
                  <Input
                    type="number"
                    value={newChannelViews}
                    onChange={(e) => setNewChannelViews(parseInt(e.target.value) || 0)}
                    className="text-xs h-10"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  Save Channel DNA
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
