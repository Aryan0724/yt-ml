"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, ArrowRight, Settings2 } from "lucide-react"
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
  }) => void
  isLoading?: boolean
  initialTitle?: string
  initialCategory?: string
  initialRegion?: string
}

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
  initialRegion = "IN"
}: PackageInputProps) {
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState(initialCategory)
  const [region, setRegion] = useState(initialRegion)
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
      setError("Please upload a thumbnail image to analyze.")
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
      includeTopic
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Analyze Video Package
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate your Topic, Title, and Thumbnail to identify performance bottlenecks.
          </p>
        </div>

        {/* Thumbnail Upload Area */}
        <div className="space-y-3 mb-8">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            1. Thumbnail (16:9)
          </label>

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
                  className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center text-muted-foreground">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload or drag & drop
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
              2. Video Title
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              {title.length} / 100
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
        
        {/* Advanced Settings Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            {showSettings ? "Hide Settings" : "Show Settings"}
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
                <span className="text-sm font-medium">Include real-time topic intelligence</span>
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
          className="w-full h-14 text-base rounded-xl"
        >
          {isLoading ? (
            "Analyzing package..."
          ) : (
            <>
              Analyze Video Package <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </Card>
    </form>
  )
}
