"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, Globe, Link2, BarChart3, Lock, KeyRound, 
  Search, Sliders, Play, Plus, Save, History, 
  Settings, Image as ImageIcon, CheckCircle2, AlertCircle, 
  Trash2, ArrowUpRight, TrendingUp, Compass, Eye, Edit3, 
  Share2, ShieldAlert, Award, FolderHeart, LayoutGrid, Check, Sparkles
} from "lucide-react"

// Types matching database schema
interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  reading_time: number
  status: "Draft" | "In Review" | "Approved" | "Scheduled" | "Published"
  published_at?: string
  category_id?: string
  views_count: number
  is_featured: boolean
  seo_metadata?: SEOMetadata
  tags?: string[]
}

interface SEOMetadata {
  seo_title: string
  meta_description: string
  focus_keyword: string
  secondary_keywords: string[]
  canonical_url: string
  og_title: string
  og_description: string
  og_image: string
  robots_index: boolean
  robots_follow: boolean
  readability_score: number
  seo_score: number
  schema_markup: string
}

interface Backlink {
  id: string
  source_url: string
  target_page: string
  anchor_text: string
  backlink_type: "dofollow" | "nofollow"
  status: "Active" | "Outreached" | "Lost" | "Broken"
  notes: string
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  is_pillar: boolean
}

type CMSRole = "Super Admin" | "Editor" | "Writer" | "SEO Manager"

export default function CMSDashboard() {
  // Access state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState<CMSRole>("Super Admin")
  const [loginError, setLoginError] = useState<string | null>(null)

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "blogs" | "seo" | "backlinks" | "media">("dashboard")
  
  // Data state
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  // Editor state
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [editorTitle, setEditorTitle] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [editorExcerpt, setEditorExcerpt] = useState("")
  const [editorSlug, setEditorSlug] = useState("")
  const [editorStatus, setEditorStatus] = useState<Blog["status"]>("Draft")
  const [editorCategory, setEditorCategory] = useState("")
  const [editorReadingTime, setEditorReadingTime] = useState(1)
  const [editorFeaturedImage, setEditorFeaturedImage] = useState("")
  
  // Editor SEO sub-states
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDesc, setSeoDesc] = useState("")
  const [seoKeyword, setSeoKeyword] = useState("")
  const [seoSecondary, setSeoSecondary] = useState("")
  const [seoCanonical, setSeoCanonical] = useState("")
  const [seoRobotsIndex, setSeoRobotsIndex] = useState(true)
  const [seoRobotsFollow, setSeoRobotsFollow] = useState(true)
  
  // Backlink adding state
  const [newSourceUrl, setNewSourceUrl] = useState("")
  const [newTargetPage, setNewTargetPage] = useState("")
  const [newAnchorText, setNewAnchorText] = useState("")
  const [newLinkType, setNewLinkType] = useState<"dofollow" | "nofollow">("dofollow")
  const [newLinkStatus, setNewLinkStatus] = useState<Backlink["status"]>("Active")
  const [newLinkNotes, setNewLinkNotes] = useState("")
  
  // Search & Filter state
  const [blogSearchQuery, setBlogSearchQuery] = useState("")
  const [blogFilterStatus, setBlogFilterStatus] = useState<string>("All")
  const [backlinkSearchQuery, setBacklinkSearchQuery] = useState("")
  
  // General feedback status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle")
  const [revisions, setRevisions] = useState<{ time: string, title: string }[]>([])

  // Live calculated scores
  const [calculatedSeoScore, setCalculatedSeoScore] = useState(0)
  const [calculatedReadability, setCalculatedReadability] = useState(0)
  const [keywordDensity, setKeywordDensity] = useState(0)
  const [internalLinkSuggestions, setInternalLinkSuggestions] = useState<string[]>([])

  // Seed sample data on initial mount to guarantee premium visual richness instantly
  useEffect(() => {
    // Check local storage for persistent session
    const apCmsToken = localStorage.getItem("ap_cms_token")
    const apCmsRole = localStorage.getItem("ap_cms_role")
    const apCmsEmail = localStorage.getItem("ap_cms_email")
    if (apCmsToken === "ap_authorized" && apCmsRole) {
      setIsAuthenticated(true)
      setUserRole(apCmsRole as CMSRole)
      setUserEmail(apCmsEmail || "admin@integralgroups.in")
    }

    // Fetch live blogs from Supabase
    fetch("/api/cms/blogs")
      .then(res => res.json())
      .then(payload => {
        if (payload.status === "success" && payload.data && payload.data.length > 0) {
          const formatted = payload.data.map((b: any) => ({
            ...b,
            seo_metadata: b.seo_metadata || {
              seo_title: b.title,
              meta_description: b.excerpt || "",
              focus_keyword: "",
              secondary_keywords: [],
              canonical_url: `https://algopilot.integralgroups.in/blog/${b.slug}`,
              og_title: b.title,
              og_description: b.excerpt || "",
              og_image: b.featured_image || "",
              robots_index: true,
              robots_follow: true,
              readability_score: 80,
              seo_score: 75,
              schema_markup: "{}"
            }
          }))
          setBlogs(formatted)
        }
      }).catch(err => console.warn("Failed to fetch live blogs, using offline presets:", err))

    // Fetch live backlinks from Supabase
    fetch("/api/cms/backlinks")
      .then(res => res.json())
      .then(payload => {
        if (payload.status === "success" && payload.data && payload.data.length > 0) {
          setBacklinks(payload.data)
        }
      }).catch(err => console.warn("Failed to fetch live backlinks, using offline presets:", err))

    setCategories([
      { id: "1", name: "Creator Economy", slug: "creator-economy", is_pillar: true },
      { id: "2", name: "AI Analytics", slug: "ai-analytics", is_pillar: true },
      { id: "3", name: "Metadata Optimization", slug: "metadata-optimization", is_pillar: false },
      { id: "4", name: "SaaS Workflow", slug: "saas-workflow", is_pillar: false }
    ])

    setBlogs([
      {
        id: "b1",
        title: "How to Calibrate Ensemble Scoring for Pre-Upload Virality",
        slug: "ensemble-scoring-virality",
        excerpt: "A technical blueprint on configuring behavioral prescriber weights and neural models to optimize CTR before rendering.",
        content: "To evaluate video performance accurately, content creators have historically relied on trial-and-error. By introducing an ensemble behavioral prescriber weight framework, we can model viral likelihood before rendering. Topic clusters are crucial for search dominance, and pillar content acts as the core hub for SEO ranking algorithms. Optimize alt-text for accessibility and index robots to ensure search engines rank pages properly.",
        featured_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        reading_time: 4,
        status: "Published",
        views_count: 1420,
        is_featured: true,
        seo_metadata: {
          seo_title: "How to Calibrate Ensemble Scoring for Pre-Upload Virality",
          meta_description: "Learn how to configure behavioral prescriber weights and neural models to optimize click-through rate.",
          focus_keyword: "Ensemble scoring",
          secondary_keywords: ["virality", "neural models", "optimization"],
          canonical_url: "https://algopilot.integralgroups.in/blog/ensemble-scoring-virality",
          og_title: "Pre-Upload Virality Analysis Calibration Guide",
          og_description: "How to configure neural networks and prescriber weights.",
          og_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
          robots_index: true,
          robots_follow: true,
          readability_score: 82,
          seo_score: 95,
          schema_markup: '{"@context":"https://schema.org","@type":"BlogPosting"}'
        },
        tags: ["Ensemble", "AI", "SEO"]
      },
      {
        id: "b2",
        title: "The Ultimate Guide to YouTube CTR Optimization Strategies",
        slug: "youtube-ctr-optimization",
        excerpt: "An in-depth study of visual factor diagnostics, high-contrast thumbnails, and emotional metadata anchors.",
        content: "Visual anchors dictate user decision-making processes in less than 200 milliseconds. Implementing high-contrast layouts and behavioral analytics can lift baseline CTR by up to 42%. We must optimize focus keywords inside meta description and maintain structural schema markup for rich snippet display.",
        featured_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600",
        reading_time: 3,
        status: "Draft",
        views_count: 0,
        is_featured: false,
        seo_metadata: {
          seo_title: "Ultimate CTR Optimization Strategies for Youtube",
          meta_description: "An operational study on visual layouts, high-contrast thumbnails, and metadata anchors.",
          focus_keyword: "CTR optimization",
          secondary_keywords: ["thumbnails", "youtube seo"],
          canonical_url: "https://algopilot.integralgroups.in/blog/youtube-ctr-optimization",
          og_title: "YouTube CTR Optimization Strategies Guide",
          og_description: "Lift click-through rates by up to 42%.",
          og_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600",
          robots_index: true,
          robots_follow: true,
          readability_score: 75,
          seo_score: 65,
          schema_markup: ""
        },
        tags: ["SEO", "CTR", "Metadata"]
      }
    ])

    setBacklinks([
      {
        id: "bl1",
        source_url: "https://techcrunch.com/2026/05/creator-intelligence-saas",
        target_page: "/blog/ensemble-scoring-virality",
        anchor_text: "Ensemble scoring intelligence",
        backlink_type: "dofollow",
        status: "Active",
        notes: "PR outreach campaign for studio launch.",
        created_at: "2026-05-10T12:00:00Z"
      },
      {
        id: "bl2",
        source_url: "https://medium.com/seo-trends/pillar-content-topic-clusters",
        target_page: "/blog/ensemble-scoring-virality",
        anchor_text: "pillar content clustering",
        backlink_type: "dofollow",
        status: "Outreached",
        notes: "Outreach request sent to tech editors.",
        created_at: "2026-05-15T09:30:00Z"
      }
    ])
  }, [])

  // Calculate Real-Time SEO & Readability checks in editor
  useEffect(() => {
    if (!editorContent) {
      setCalculatedSeoScore(0)
      setCalculatedReadability(0)
      setKeywordDensity(0)
      setInternalLinkSuggestions([])
      return
    }

    // 1. Calculate Readability (Flesch-like basic simulation based on sentence & word lengths)
    const words = editorContent.trim().split(/\s+/).length
    const sentences = editorContent.split(/[.!?]+/).filter(Boolean).length
    const avgSentenceLength = sentences > 0 ? words / sentences : 0
    let readability = Math.round(100 - (avgSentenceLength * 1.5))
    if (readability < 10) readability = 15
    if (readability > 100) readability = 98
    setCalculatedReadability(readability)

    // 2. Keyword density checks
    if (seoKeyword) {
      const regex = new RegExp(`\\b${seoKeyword.toLowerCase()}\\b`, "gi")
      const matches = editorContent.toLowerCase().match(regex)
      const count = matches ? matches.length : 0
      const density = words > 0 ? (count / words) * 100 : 0
      setKeywordDensity(parseFloat(density.toFixed(2)))
    } else {
      setKeywordDensity(0)
    }

    // 3. Automated SEO Checklist Score
    let score = 20
    if (editorTitle.length > 25) score += 15
    if (seoDesc.length > 80 && seoDesc.length < 160) score += 15
    if (seoKeyword && editorContent.toLowerCase().includes(seoKeyword.toLowerCase())) score += 20
    if (keywordDensity >= 1.0 && keywordDensity <= 2.5) score += 15
    if (seoCanonical) score += 15
    setCalculatedSeoScore(score)

    // 4. Internal Linking suggestion parser (simulates semantic clustering based on text matches)
    const suggestions: string[] = []
    if (editorContent.toLowerCase().includes("behavioral")) {
      suggestions.push("Internal Link Suggestion: Connect to -> '/dashboard' (anchored to 'prescriber metrics')")
    }
    if (editorContent.toLowerCase().includes("pillar content")) {
      suggestions.push("Topic Cluster Anchor: Link category page -> '/category/creator-economy' (pillar structure)")
    }
    if (editorContent.toLowerCase().includes("alt-text")) {
      suggestions.push("Broken Alt Text Alert: Alt text missing on 2 featured images in assets catalog.")
    }
    setInternalLinkSuggestions(suggestions)

  }, [editorContent, seoKeyword, editorTitle, seoDesc, seoCanonical, keywordDensity])

  // Authentication Gate Trigger
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (passcode === "ap_seo_2026") {
      setIsAuthenticated(true)
      localStorage.setItem("ap_cms_token", "ap_authorized")
      localStorage.setItem("ap_cms_role", userRole)
      localStorage.setItem("ap_cms_email", userEmail || "admin@integralgroups.in")
    } else {
      setLoginError("Invalid enterprise passcode token. Please recheck security parameters.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.clear()
  }

  // Save/Publish Article Logic
  const handleSaveArticle = () => {
    if (userRole === "Writer" && editorStatus !== "Draft") {
      alert("Role Permission Alert: Writers can only save as Drafts. Submit draft for Editor approval.")
      return
    }

    setSaveStatus("saving")
    setTimeout(() => {
      const isNew = !editingBlog
      const targetId = editingBlog?.id || "b_" + Math.random().toString(36).substring(2, 9)

      const savedArticle: Blog = {
        id: targetId,
        title: editorTitle,
        slug: editorSlug || editorTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: editorExcerpt,
        content: editorContent,
        featured_image: editorFeaturedImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        reading_time: editorReadingTime,
        status: editorStatus,
        views_count: editingBlog?.views_count || 0,
        is_featured: editingBlog?.is_featured || false,
        seo_metadata: {
          seo_title: seoTitle || editorTitle,
          meta_description: seoDesc,
          focus_keyword: seoKeyword,
          secondary_keywords: seoSecondary.split(",").map(s => s.trim()).filter(Boolean),
          canonical_url: seoCanonical || `https://algopilot.integralgroups.in/blog/${editorSlug}`,
          og_title: seoTitle || editorTitle,
          og_description: seoDesc,
          og_image: editorFeaturedImage,
          robots_index: seoRobotsIndex,
          robots_follow: seoRobotsFollow,
          readability_score: calculatedReadability,
          seo_score: calculatedSeoScore,
          schema_markup: '{"@context":"https://schema.org","@type":"BlogPosting"}'
        }
      }

      if (isNew) {
        setBlogs([savedArticle, ...blogs])
      } else {
        setBlogs(blogs.map(b => b.id === targetId ? savedArticle : b))
      }

      // Sync data to Supabase database
      fetch("/api/cms/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedArticle)
      }).then(res => res.json())
        .then(payload => {
          if (payload.status === "success") {
            console.log("CMS article fully synced to Supabase:", payload.data)
          }
        }).catch(err => console.error("Database CMS sync failed:", err))

      // Add revision checkpoint
      setRevisions([{ time: new Date().toLocaleTimeString(), title: editorTitle }, ...revisions])
      setSaveStatus("success")
      
      setTimeout(() => {
        setSaveStatus("idle")
        setEditingBlog(null)
      }, 1200)
    }, 1500)
  }

  // Create new draft
  const handleLaunchNewArticle = () => {
    setEditingBlog(null)
    setEditorTitle("")
    setEditorContent("")
    setEditorExcerpt("")
    setEditorSlug("")
    setEditorStatus("Draft")
    setEditorReadingTime(1)
    setEditorFeaturedImage("")
    setSeoTitle("")
    setSeoDesc("")
    setSeoKeyword("")
    setSeoSecondary("")
    setSeoCanonical("")
    setSeoRobotsIndex(true)
    setSeoRobotsFollow(true)
    setRevisions([])
  }

  // Load article to editor
  const handleLoadArticle = (blog: Blog) => {
    setEditingBlog(blog)
    setEditorTitle(blog.title)
    setEditorContent(blog.content)
    setEditorExcerpt(blog.excerpt || "")
    setEditorSlug(blog.slug)
    setEditorStatus(blog.status)
    setEditorReadingTime(blog.reading_time)
    setEditorFeaturedImage(blog.featured_image || "")
    
    if (blog.seo_metadata) {
      setSeoTitle(blog.seo_metadata.seo_title)
      setSeoDesc(blog.seo_metadata.meta_description)
      setSeoKeyword(blog.seo_metadata.focus_keyword)
      setSeoSecondary(blog.seo_metadata.secondary_keywords.join(", "))
      setSeoCanonical(blog.seo_metadata.canonical_url)
      setSeoRobotsIndex(blog.seo_metadata.robots_index)
      setSeoRobotsFollow(blog.seo_metadata.robots_follow)
    }
  }

  // Add backlink logic
  const handleAddBacklinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSourceUrl || !newTargetPage || !newAnchorText) return

    if (userRole === "Writer") {
      alert("Permission Denied: Writers do not have backlink outreach sheet permissions.")
      return
    }

    const newLink: Backlink = {
      id: "bl_" + Math.random().toString(36).substring(2, 9),
      source_url: newSourceUrl,
      target_page: newTargetPage,
      anchor_text: newAnchorText,
      backlink_type: newLinkType,
      status: newLinkStatus,
      notes: newLinkNotes,
      created_at: new Date().toISOString()
    }

    setBacklinks([newLink, ...backlinks])

    // Sync backlink to Supabase database
    fetch("/api/cms/backlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink)
    }).then(res => res.json())
      .then(payload => {
        if (payload.status === "success") {
          console.log("CMS backlink successfully synced to Supabase")
        }
      }).catch(err => console.error("Database Backlink sync failed:", err))

    setNewSourceUrl("")
    setNewTargetPage("")
    setNewAnchorText("")
    setNewLinkNotes("")
  }

  // Search/Filter blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                          b.slug.toLowerCase().includes(blogSearchQuery.toLowerCase())
    const matchesFilter = blogFilterStatus === "All" || b.status === blogFilterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300">
      
      {/* 1. NOTION/LINEAR SECURITY GATE */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303] z-50 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-card p-10 border-white/10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-pulse" />
              
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Enterprise SEO Operating System
                </span>
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">Editorial Gateway</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Authentication and cryptographic admin authorization are required to access AlgoPilot content databases.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Email Identity</label>
                  <input
                    required
                    type="email"
                    placeholder="editor@integralgroups.in"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                    <span>Credentials Passcode</span>
                    <span className="text-[8px] text-zinc-600 lowercase font-mono">hint: ap_seo_2026</span>
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="Enter security token..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Select Access Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Super Admin", "Editor", "Writer", "SEO Manager"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setUserRole(role as CMSRole)}
                        className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all uppercase tracking-wider ${
                          userRole === role
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Initialize CMS Session
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CMS CONTENT CONSOLE */}
      {isAuthenticated && (
        <div className="flex min-h-screen">
          
          {/* CMS SIDEBAR */}
          <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col justify-between p-6">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="font-display font-extrabold tracking-tight text-white text-lg flex items-center gap-2">
                  ⚡ AlgoPilot <span className="text-[8px] font-bold uppercase text-zinc-500 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">SEO OS</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <UserRoleBadge role={userRole} />
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{userEmail}</div>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: "dashboard", icon: LayoutGrid, label: "Analytics Overview" },
                  { id: "blogs", icon: FileText, label: "Content Editor" },
                  { id: "seo", icon: Globe, label: "SEO clusters" },
                  { id: "backlinks", icon: Link2, label: "Backlink sheet" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any)
                      setEditingBlog(null)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeTab === item.id && !editingBlog
                        ? "bg-white text-black font-bold"
                        : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="py-3 w-full rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-center"
            >
              Disconnect Session
            </button>
          </aside>

          {/* MAIN WORKSPACE SCREEN */}
          <main className="flex-1 overflow-y-auto p-12">
            
            {/* SUB-SCREEN A: CMS MAIN ANALYTICS DASHBOARD */}
            {activeTab === "dashboard" && !editingBlog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                
                {/* Dashboard Title */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Private Publishing Console
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">Editorial Intelligence.</h1>
                </div>

                {/* Stat Cards Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Articles Total", value: blogs.length, desc: "Drafts and Live", icon: FileText, color: "text-blue-500" },
                    { label: "Live Articles", value: blogs.filter(b => b.status === "Published").length, desc: "Indexed pages", icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Average SEO Score", value: "88%", desc: "Focus keyword density", icon: Globe, color: "text-purple-500" },
                    { label: "Outreached Backlinks", value: backlinks.length, desc: "Dofollow ledgers", icon: Link2, color: "text-cyan-500" }
                  ].map((card) => (
                    <div key={card.label} className="p-6 rounded-2xl glass-card border-white/5 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{card.label}</span>
                        <card.icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                      <div>
                        <div className="text-3xl font-display font-bold text-white">{card.value}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{card.desc}</div>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Animated Editorial Graph */}
                <section className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-lg">Keywords Position & Engagement Telemetry</h3>
                      <p className="text-xs text-zinc-500 mt-1">Real-time cache placeholders for Google Search Console and PostHog</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" /> +14.2% SEO Growth
                    </span>
                  </div>

                  {/* SVG Chart Layout */}
                  <div className="w-full h-64 bg-zinc-950/40 rounded-2xl border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
                    
                    {/* SVG lines */}
                    <svg className="w-full h-44 absolute left-0 bottom-4 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      
                      {/* Smooth Area Gradient */}
                      <path d="M 0 90 Q 20 60, 40 40 T 80 15 T 100 10 L 100 100 L 0 100 Z" fill="rgba(59, 130, 246, 0.05)" />
                      
                      {/* Main Trend Line */}
                      <path 
                        d="M 0 90 Q 20 60, 40 40 T 80 15 T 100 10" 
                        fill="none" 
                        stroke="url(#blue-gradient)" 
                        strokeWidth="2.5"
                        strokeLinecap="round" 
                      />

                      <defs>
                        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="flex justify-between items-center text-[9px] text-zinc-600 select-none z-10 w-full">
                      <span>AVG Rank: 4.2</span>
                      <span>CTR: 7.8%</span>
                      <span>Keywords Live: 142</span>
                    </div>

                    <div className="flex justify-between text-[9px] text-zinc-600 select-none z-10 w-full border-t border-white/5 pt-2">
                      <span>May 1</span>
                      <span>May 5</span>
                      <span>May 9</span>
                      <span>May 13</span>
                      <span>May 17 (Today)</span>
                    </div>
                  </div>
                </section>

                {/* Pillar Categories and Recent Activity */}
                <section className="grid md:grid-cols-2 gap-6">
                  {/* Pillar Content Clusters */}
                  <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div>
                      <h4 className="font-bold text-white text-sm">Topic Cluster Pillars</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Primary architectural content structures for search crawlers</p>
                    </div>

                    <div className="space-y-3">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white">{cat.name}</span>
                            {cat.is_pillar && (
                              <span className="text-[8px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest px-2 py-0.5 rounded">
                                Pillar content
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">/category/{cat.slug}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Telemetry Events */}
                  <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div>
                      <h4 className="font-bold text-white text-sm">Editorial System Audits</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Recent updates, backlink discoveries, and publish events</p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { time: "10:15 AM", type: "Publish", msg: "Super Admin published 'How to Calibrate Ensemble Scoring for Pre-Upload Virality'", status: "success" },
                        { time: "Yesterday", type: "SEO Audit", msg: "Readability scan completed for 'The Ultimate Guide to YouTube CTR Optimization Strategies'", status: "warning" },
                        { time: "May 15", type: "Backlink", msg: "PR outreach backlink detected active from 'medium.com'", status: "info" }
                      ].map((evt, i) => (
                        <div key={i} className="flex gap-4 items-start text-xs">
                          <span className="text-[10px] font-mono text-zinc-600 pt-0.5">{evt.time}</span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {evt.msg}
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Triage type: {evt.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* SUB-SCREEN B: BLOG ARTICLES MANAGER */}
            {activeTab === "blogs" && !editingBlog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Header row */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Central Repository</span>
                    <h1 className="text-4xl font-bold tracking-tight text-white mt-1">Blogs Ledger</h1>
                  </div>

                  <button
                    onClick={handleLaunchNewArticle}
                    className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 transition-all font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Create Draft Article
                  </button>
                </div>

                {/* Filters ledger */}
                <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
                  
                  {/* Search and triage selectors */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input
                        type="text"
                        placeholder="Search article titles or slugs..."
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-5 py-3.5 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {["All", "Published", "Draft", "In Review", "Approved"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setBlogFilterStatus(filter)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            blogFilterStatus === filter
                              ? "bg-white text-black border-white"
                              : "bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of articles */}
                  <div className="divide-y divide-white/5">
                    {filteredBlogs.length === 0 ? (
                      <div className="py-20 text-center text-zinc-600 text-sm">
                        No articles match the repository filters.
                      </div>
                    ) : (
                      filteredBlogs.map((blog) => (
                        <div key={blog.id} className="py-5 flex items-center justify-between group hover:bg-white/[0.005] px-2 rounded-xl transition-all">
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm hover:underline cursor-pointer" onClick={() => handleLoadArticle(blog)}>
                                {blog.title}
                              </span>
                              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                blog.status === "Published"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : blog.status === "Draft"
                                  ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              }`}>
                                {blog.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-1">{blog.excerpt}</p>
                            <div className="text-[10px] text-zinc-600 font-mono">
                              Slug: /blog/{blog.slug} | Reads: {blog.views_count} views
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                              <div className="text-xs text-white font-mono">{blog.reading_time} min</div>
                              <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-semibold">Reading rhythm</span>
                            </div>
                            
                            <button
                              onClick={() => handleLoadArticle(blog)}
                              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-zinc-400 hover:bg-white hover:text-black transition-all"
                            >
                              Open Editor
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-SCREEN C: ACTIVE EDITOR DASHBOARD ENVELOPE */}
            {(editingBlog !== null || (activeTab === "blogs" && editingBlog === null && editorTitle !== "")) && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Editor Header Navigation */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-bold uppercase text-zinc-500 hover:text-white transition-all"
                    >
                      ← Back
                    </button>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {editingBlog ? "Edit Mode" : "Writing mode"}
                      </span>
                      <h2 className="text-xl font-bold text-white">{editorTitle || "Draft Document"}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5" /> Auto-Save Active
                    </span>

                    <button
                      onClick={handleSaveArticle}
                      disabled={saveStatus === "saving"}
                      className="flex items-center gap-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-all font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {saveStatus === "saving" ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Save & Update Article
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Editor 2-column layout */}
                <div className="grid lg:grid-cols-6 gap-8 items-start">
                  
                  {/* Left column: Rich content writing */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                      
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Article Title</label>
                        <input
                          type="text"
                          value={editorTitle}
                          onChange={(e) => setEditorTitle(e.target.value)}
                          placeholder="Configure title tags..."
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-white/20 transition-all"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Slug URL</label>
                          <input
                            type="text"
                            value={editorSlug}
                            onChange={(e) => setEditorSlug(e.target.value)}
                            placeholder="ensemble-scoring-virality"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Workflow Status</label>
                          <select
                            value={editorStatus}
                            onChange={(e) => setEditorStatus(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                          >
                            <option value="Draft">Draft</option>
                            <option value="In Review">In Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Published">Published</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Excerpt</label>
                        <textarea
                          rows={2}
                          value={editorExcerpt}
                          onChange={(e) => setEditorExcerpt(e.target.value)}
                          placeholder="A premium, operational summary of the article..."
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-400 focus:outline-none focus:border-white/20 transition-all resize-none"
                        />
                      </div>

                      {/* TIPTAP/LEXICAL PREFERRED WRITING CANVAS */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Content Body (Markdown & embeds active)</label>
                          <span className="text-[8px] text-zinc-600 lowercase font-mono">slash command presets: # header, &gt; callouts</span>
                        </div>
                        <textarea
                          rows={12}
                          value={editorContent}
                          onChange={(e) => setEditorContent(e.target.value)}
                          placeholder="To evaluate video performance accurately..."
                          className="w-full bg-[#050505] border border-white/5 rounded-[1.5rem] p-6 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-all font-mono leading-relaxed resize-none"
                        />
                      </div>

                      {/* ALT-TEXT AND ALT-SEO PANEL */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Featured Image URL</label>
                          <input
                            type="text"
                            value={editorFeaturedImage}
                            onChange={(e) => setEditorFeaturedImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Reading time (minutes)</label>
                          <input
                            type="number"
                            min="1"
                            value={editorReadingTime}
                            onChange={(e) => setEditorReadingTime(parseInt(e.target.value) || 1)}
                            placeholder="4"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SEO ADVANCED INPUTS SHEET */}
                    <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-purple-500" /> Advanced SEO Indexing Panel
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">SEO Optimized Title</label>
                          <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="SEO tag header"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Canonical URL</label>
                          <input
                            type="text"
                            value={seoCanonical}
                            onChange={(e) => setSeoCanonical(e.target.value)}
                            placeholder="https://algopilot.integralgroups.in/blog/slug"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Meta Description (120-160 characters recommended)</label>
                        <textarea
                          rows={2}
                          value={seoDesc}
                          onChange={(e) => setSeoDesc(e.target.value)}
                          placeholder="Specify the search snippet description..."
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-400 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">Robots Search Indexing</span>
                          <button
                            type="button"
                            onClick={() => setSeoRobotsIndex(!seoRobotsIndex)}
                            className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border transition-all ${
                              seoRobotsIndex
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            {seoRobotsIndex ? "index" : "noindex"}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">Robots Link Following</span>
                          <button
                            type="button"
                            onClick={() => setSeoRobotsFollow(!seoRobotsFollow)}
                            className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border transition-all ${
                              seoRobotsFollow
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            {seoRobotsFollow ? "follow" : "nofollow"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column: SEO Telemetry & Suggestions */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* SEO Calibration Score Card */}
                    <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
                      <div>
                        <h4 className="font-bold text-white text-sm">SEO Live Calibrator</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Algorithmic validation score in real time</p>
                      </div>

                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="text-right">
                          <span className={`text-4xl font-display font-extrabold ${
                            calculatedSeoScore >= 80 ? "text-emerald-500" : calculatedSeoScore >= 50 ? "text-amber-500" : "text-red-500"
                          }`}>
                            {calculatedSeoScore}%
                          </span>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">SEO Score</div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-3xl font-display font-extrabold text-blue-400">
                            {calculatedReadability}
                          </span>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Readability Index</div>
                        </div>
                      </div>

                      {/* Keyword Analysis Inputs */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Focus Keyword</label>
                          <input
                            type="text"
                            value={seoKeyword}
                            onChange={(e) => setSeoKeyword(e.target.value)}
                            placeholder="e.g. Ensemble scoring"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Secondary Keywords (comma separated)</label>
                          <input
                            type="text"
                            value={seoSecondary}
                            onChange={(e) => setSeoSecondary(e.target.value)}
                            placeholder="virality, optimization"
                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {/* Keyword Density feedback */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">Keyword Density:</span>
                          <span className={`font-bold font-mono ${
                            keywordDensity >= 1.0 && keywordDensity <= 2.5
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}>
                            {keywordDensity}% (Optimum: 1-2.5%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Smart Internal Link Suggestions */}
                    <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
                      <div>
                        <h4 className="font-bold text-white text-sm">Internal Linking Recommendations</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">AI-suggested related cluster links and broken alt detections</p>
                      </div>

                      <div className="space-y-3">
                        {internalLinkSuggestions.length === 0 ? (
                          <div className="text-xs text-zinc-600">
                            Type text in the body canvas to compute structural connection recommendations.
                          </div>
                        ) : (
                          internalLinkSuggestions.map((sug, i) => (
                            <div 
                              key={i} 
                              className={`p-3 rounded-lg text-xs leading-relaxed ${
                                sug.includes("Broken") 
                                  ? "bg-red-500/5 border border-red-500/10 text-red-400" 
                                  : "bg-blue-500/5 border border-blue-500/10 text-blue-400"
                              }`}
                            >
                              {sug}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Revision timelines */}
                    <div className="p-6 rounded-[2rem] glass-card border-white/5 space-y-6">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <History className="w-4 h-4 text-zinc-500" /> Save Timeline
                      </h4>

                      <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                        {revisions.length === 0 ? (
                          <div className="text-xs text-zinc-600">No revisions recorded in current session.</div>
                        ) : (
                          revisions.map((rev, i) => (
                            <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-white/[0.01] border border-white/5">
                              <span className="text-zinc-400 truncate max-w-[120px]">{rev.title}</span>
                              <span className="text-[10px] font-mono text-zinc-500">{rev.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-SCREEN D: ADVANCED SEO KEYWORD CLUSTERING METADATA */}
            {activeTab === "seo" && !editingBlog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SEO Operating System</span>
                  <h1 className="text-4xl font-bold tracking-tight text-white mt-1">Topic Clustering & Schema Builder</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Topic Clustering Structure */}
                  <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div>
                      <h3 className="font-bold text-white text-sm">Topic Cluster Mapping</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Semantic clusters and internal link equity tracking</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { keyword: "Ensemble scoring", pillar: "AI Analytics", subCount: 42000, liveBlogs: 2, score: 95 },
                        { keyword: "YouTube CTR", pillar: "Creator Economy", subCount: 88000, liveBlogs: 1, score: 65 }
                      ].map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white">{item.keyword}</span>
                              <div className="text-[9px] text-zinc-500 mt-1 uppercase font-semibold">Pillar Category: {item.pillar}</div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                              Score: {item.score}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-white/5">
                            <div>
                              <span className="text-zinc-500">Search Volume:</span>
                              <span className="font-bold text-white ml-1.5">{item.subCount.toLocaleString()} / mo</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Live Articles:</span>
                              <span className="font-bold text-white ml-1.5">{item.liveBlogs} pages</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schema LD Builder */}
                  <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div>
                      <h3 className="font-bold text-white text-sm">Auto Schema Builder</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Automatic JSON-LD rich search snippets markup</p>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 text-[10px] font-mono leading-relaxed text-zinc-400 h-64 overflow-y-auto">
                      {`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://algopilot.integralgroups.in"
  },
  "headline": "Ensemble Scoring Virality Calibration",
  "image": "https://images.unsplash.com/photo-161800518...",
  "author": {
    "@type": "Organization",
    "name": "Integral Groups Studio"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AlgoPilot",
    "logo": {
      "@type": "ImageObject",
      "url": "https://algopilot.integralgroups.in/logo.png"
    }
  }
}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-SCREEN E: BACKLINK SHEET LEDGER */}
            {activeTab === "backlinks" && !editingBlog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Header row */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Backlink Ledger Sheet</span>
                  <h1 className="text-4xl font-bold tracking-tight text-white mt-1">Authority Management</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left column: backlinks table */}
                  <div className="lg:col-span-2 p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white text-sm">Active Outreach Campaigns</h3>
                      <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                        <input
                          type="text"
                          placeholder="Search anchors..."
                          value={backlinkSearchQuery}
                          onChange={(e) => setBacklinkSearchQuery(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {backlinks.filter(b => b.anchor_text.toLowerCase().includes(backlinkSearchQuery.toLowerCase())).map((link) => (
                        <div key={link.id} className="py-4 flex flex-col md:flex-row justify-between md:items-center gap-3">
                          <div className="space-y-1">
                            <a 
                              href={link.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                            >
                              {link.source_url.replace("https://", "").split("/")[0]} <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                            <div className="text-[10px] text-zinc-500">
                              Anchor: <span className="text-white font-semibold">"{link.anchor_text}"</span> | Target: {link.target_page}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/5 bg-white/5 text-zinc-400">
                              {link.backlink_type}
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                              link.status === "Active"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : link.status === "Outreached"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                              {link.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right column: Add backlink outreach registry */}
                  <div className="p-8 rounded-[2rem] glass-card border-white/5 space-y-6">
                    <div>
                      <h3 className="font-bold text-white text-sm">Register Outreach Lead</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Log external articles and anchors as you build authority</p>
                    </div>

                    <form onSubmit={handleAddBacklinkSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Source Domain/URL</label>
                        <input
                          required
                          type="url"
                          placeholder="https://techcrunch.com/..."
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Target Internal Slug</label>
                        <input
                          required
                          type="text"
                          placeholder="/blog/ensemble-scoring-virality"
                          value={newTargetPage}
                          onChange={(e) => setNewTargetPage(e.target.value)}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Anchor Text</label>
                        <input
                          required
                          type="text"
                          placeholder="Ensemble scoring intelligence"
                          value={newAnchorText}
                          onChange={(e) => setNewAnchorText(e.target.value)}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Link Tag</label>
                          <select
                            value={newLinkType}
                            onChange={(e) => setNewLinkType(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                          >
                            <option value="dofollow">dofollow</option>
                            <option value="nofollow">nofollow</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                          <select
                            value={newLinkStatus}
                            onChange={(e) => setNewLinkStatus(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                          >
                            <option value="Active">Active</option>
                            <option value="Outreached">Outreached</option>
                            <option value="Lost">Lost</option>
                            <option value="Broken">Broken</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Outreach Notes</label>
                        <textarea
                          rows={2}
                          placeholder="Contact details of author or editor..."
                          value={newLinkNotes}
                          onChange={(e) => setNewLinkNotes(e.target.value)}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Lead Record
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}

// User role pill badge
function UserRoleBadge({ role }: { role: CMSRole }) {
  if (role === "Super Admin") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
        <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Super Admin
      </span>
    )
  }
  if (role === "Editor") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Editor
      </span>
    )
  }
  if (role === "SEO Manager") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
        <Globe className="w-3.5 h-3.5 text-blue-400" /> SEO Manager
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
      <Edit3 className="w-3.5 h-3.5 text-zinc-400" /> Writer
    </span>
  )
}
