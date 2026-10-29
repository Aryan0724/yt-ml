"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, ArrowRight, Settings2, Sparkles, Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface PackageInputProps {
  onAnalyze: (params: {
    thumbnail: File
    title: string
    category: string
    region: string
    includeTopic: boolean
    archetype?: string
  }) => void
  isLoading?: boolean
  initialTitle?: string
  initialCategory?: string
  initialRegion?: string
  initialArchetype?: string
}

const ARCHETYPES = [
  { id: "AUTO", label: "Auto-Detect Format" },
  { id: "FACELESS_DOCUMENTARY", label: "Faceless Documentary / Video Essay" },
  { id: "FACE_DRIVEN_CREATOR", label: "Face-Driven Creator / Vlog" },
  { id: "CARTOON_ANIMATION", label: "Cartoon & Animation Explainer" },
  { id: "COOKING_CULINARY", label: "Cooking & Culinary Arts" },
  { id: "GAMING_ESPORTS", label: "Gaming & Esports" },
  { id: "TECH_PRODUCT_REVIEW", label: "Tech & Product Reviews" },
  { id: "GENERAL_HYBRID", label: "General Hybrid Channel" }
]

const CATEGORIES = [
  "Entertainment",
  "Gaming",
  "Technology",
  "Education",
  "Finance",
  "Fitness",
  "Vlogs & Lifestyle",
  "Comedy",
  "Music",
  "News & Commentary",
  "General"
]

const REGIONS = [
  { code: "IN", label: "India (IN)" },
  { code: "US", label: "United States (US)" },
  { code: "GB", label: "United Kingdom (GB)" },
  { code: "CA", label: "Canada (CA)" },
  { code: "AU", label: "Australia (AU)" },
  { code: "GLOBAL", label: "Worldwide" }
]

export function PackageInput({
  onAnalyze,
  isLoading = false,
  initialTitle = "",
  initialCategory = "Entertainment",
  initialRegion = "IN",
  initialArchetype = "AUTO"
}: PackageInputProps) {
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [region, setRegion] = useState(initialRegion)
  const [archetype, setArchetype] = useState(initialArchetype)
  const [includeTopic, setIncludeTopic] = useState(true)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle)
  }, [initialTitle])

  useEffect(() => {
    if (initialRegion) setRegion(initialRegion)
  }, [initialRegion])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, or WebP).")
      return
    }
    setError(null)
    setThumbnailFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  // Direct Clipboard Paste (Ctrl+V) listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) {
            handleFileSelect(file)
            break
          }
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [handleFileSelect])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const clearThumbnail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setThumbnailFile(null)
    setThumbnailPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!thumbnailFile) {
      setError("Please upload or paste a thumbnail image to analyze.")
      return
    }
    if (!title.trim()) {
      setError("Please enter your video title or working concept.")
      return
    }
    setError(null)
    onAnalyze({
      thumbnail: thumbnailFile,
      title: title.trim(),
      category,
      region,
      includeTopic,
      archetype: archetype !== "AUTO" ? archetype : undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Packaging Decision Studio
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Simulate mobile feed glanceability, title truncation cutoffs, and audience curiosity before filming.
          </p>
        </div>

        {/* Thumbnail Upload Area with Clipboard paste */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Thumbnail (16:9)
            </label>
            <span className="text-[11px] font-semibold text-red-600 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20">
              Supports Ctrl+V Paste
            </span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
              isDragging
                ? "border-primary bg-primary/5"
                : thumbnailPreview
                ? "border-border bg-black"
                : "border-border hover:border-primary/50 bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />

            {thumbnailPreview ? (
              <div className="relative w-full h-full group">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearThumbnail}
                  className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors backdrop-blur-xs"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center text-muted-foreground shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload, drag & drop, or paste (Ctrl+V)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1280x720 recommended · PNG, JPG, or WebP
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Candidate Video Title
            </label>
            <span className={`text-xs font-mono font-medium ${title.length > 55 ? "text-amber-600 font-bold" : "text-muted-foreground"}`}>
              {title.length} / 100 {title.length > 55 ? "(Mobile Cutoff Warning)" : ""}
            </span>
          </div>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., I Built an AI Agent That Runs My Entire Business"
            maxLength={120}
            className="h-14 text-base px-4 rounded-xl bg-background"
          />
        </div>

        {/* Archetype Selector */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>3. Channel Archetype</span>
          </label>
          <select
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="w-full h-11 px-3 bg-background border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ARCHETYPES.map((arch) => (
              <option key={arch.id} value={arch.id}>
                {arch.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Advanced Settings Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            {showSettings ? "Hide Advanced Settings" : "Show Advanced Settings (Niche & Region)"}
          </button>
        </div>

        {/* Settings Grid */}
        {showSettings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 rounded-xl border bg-muted/20">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2 space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeTopic} 
                  onChange={(e) => setIncludeTopic(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium">Include real-time Google Trends topic intelligence</span>
              </label>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 mb-6 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            {error}
          </div>
        )}

        {/* CTA Button */}
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full h-14 text-base rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-md"
        >
          {isLoading ? (
            "Auditing packaging on mobile feed..."
          ) : (
            <>
              Predict Video Packaging Performance <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </Card>
    </form>
  )
}
