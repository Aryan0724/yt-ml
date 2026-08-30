"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Image as ImageIcon, Sparkles, Globe, X, ArrowRight } from "lucide-react"

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
  { code: "GLOBAL", label: "Worldwide (Global)" }
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

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle)
    }
  }, [initialTitle])

  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion)
    }
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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6 text-left">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Analyze Video Package
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            PreYT evaluates your Topic, Title, and Thumbnail to identify your primary bottleneck.
          </p>
        </div>

        {/* 1. Thumbnail Upload Area (Hero) */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            1. Thumbnail (16:9)
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
              isDragging
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100/50 dark:bg-zinc-900/50"
                : thumbnailPreview
                ? "border-zinc-200 dark:border-zinc-800 bg-zinc-950"
                : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/20"
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
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearThumbnail}
                  className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-all shadow-md"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-6 px-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Click to upload or drag & drop thumbnail
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    1280x720 recommended · PNG, JPG, or WebP
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Title Input */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              2. Video Title / Concept
            </label>
            <span className="text-xs text-zinc-400 font-mono">
              {title.length} / 100
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., I Built an AI Agent That Runs My Entire Business"
            maxLength={120}
            className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>

        {/* 3. Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-zinc-500" /> Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Intelligence Toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Topic Intelligence
            </label>
            <button
              type="button"
              onClick={() => setIncludeTopic(!includeTopic)}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                includeTopic
                  ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200"
                  : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
              }`}
            >
              <span>{includeTopic ? "Enabled (Trends)" : "Disabled (Fast)"}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  includeTopic ? "bg-indigo-500" : "bg-zinc-400"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span>Analyzing package...</span>
          ) : (
            <>
              <span>Analyze Video Package</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
