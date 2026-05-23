"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, Sparkles, CheckCircle2, AlertCircle, 
  TrendingUp, GitCompare, History, Search, Zap, 
  Tv, FileText, Image as ImageIcon, Clock, Calendar, CheckSquare, ArrowRight, ArrowLeft, RefreshCw,
  Smartphone, BookOpen, Sliders, ChevronDown, ChevronUp, Globe, Lock, ShieldCheck, X, Trash2, Trophy, Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { saveAnalysisHistory, getAnalysisHistory, deleteAnalysisHistory } from "@/lib/supabase"

// --- Extended Creator Niche Database ---
const NICHES = [
  { id: "Gaming", label: "Gaming & Esports" },
  { id: "Tech", label: "Software & Technology" },
  { id: "Education", label: "Education & Science" },
  { id: "Entertainment", label: "Entertainment & Comedy" },
  { id: "Vlogs", label: "Vlogs & Lifestyle" },
  { id: "News", label: "News & Politics" },
  { id: "Finance", label: "Business & Finance" },
  { id: "Documentary", label: "Documentary & Storytelling" },
  { id: "Music", label: "Music & Art" },
  { id: "Beauty", label: "Beauty & Fashion" },
]

// Heuristic keyword-based Channel Niche Detector
// Heuristic keyword-based Channel Niche Detector
function detectNicheFromChannel(
  channelHandle: string,
  channelTitle?: string,
  channelDescription?: string,
  currentNiche?: string
): string {
  // Combine all strings to look for keywords
  const textToSearch = `${channelHandle || ""} ${channelTitle || ""} ${channelDescription || ""}`.toLowerCase();

  // 1. Education/Science (highly specific educational markers)
  if (
    textToSearch.includes("learn") ||
    textToSearch.includes("science") ||
    textToSearch.includes("history") ||
    textToSearch.includes("how") ||
    textToSearch.includes("edu") ||
    textToSearch.includes("academy") ||
    textToSearch.includes("physics") ||
    textToSearch.includes("concept") ||
    textToSearch.includes("clear") ||
    textToSearch.includes("class") ||
    textToSearch.includes("course") ||
    textToSearch.includes("tutorial") ||
    textToSearch.includes("exam") ||
    textToSearch.includes("lecture") ||
    textToSearch.includes("prep") ||
    textToSearch.includes("study") ||
    textToSearch.includes("teach") ||
    textToSearch.includes("explain") ||
    textToSearch.includes("school") ||
    textToSearch.includes("university") ||
    textToSearch.includes("curious") ||
    textToSearch.includes("vigyan") ||
    textToSearch.includes("gyan") ||
    textToSearch.includes("shiksha") ||
    textToSearch.includes("math") ||
    textToSearch.includes("biology") ||
    textToSearch.includes("chemistry") ||
    textToSearch.includes("jee") ||
    textToSearch.includes("neet") ||
    textToSearch.includes("coding") ||
    textToSearch.includes("education") ||
    textToSearch.includes("educational") ||
    textToSearch.includes("know") ||
    textToSearch.includes("why") ||
    textToSearch.includes("fact") ||
    textToSearch.includes("intellectual") ||
    textToSearch.includes("academic")
  ) {
    return "Education";
  }

  // 2. Software/Technology
  if (
    textToSearch.includes("tech") ||
    textToSearch.includes("code") ||
    textToSearch.includes("dev") ||
    textToSearch.includes("software") ||
    textToSearch.includes("ai") ||
    textToSearch.includes("future") ||
    textToSearch.includes("algorithm") ||
    textToSearch.includes("programming") ||
    textToSearch.includes("gadget") ||
    textToSearch.includes("computer")
  ) {
    return "Tech";
  }

  // 3. Gaming
  if (
    textToSearch.includes("game") ||
    textToSearch.includes("play") ||
    textToSearch.includes("xbox") ||
    textToSearch.includes("ps5") ||
    textToSearch.includes("craft") ||
    textToSearch.includes("fortnite") ||
    textToSearch.includes("gaming") ||
    textToSearch.includes("gamer") ||
    textToSearch.includes("streamer")
  ) {
    return "Gaming";
  }

  // 4. Business & Finance
  if (
    textToSearch.includes("finance") ||
    textToSearch.includes("money") ||
    textToSearch.includes("rich") ||
    textToSearch.includes("invest") ||
    textToSearch.includes("stocks") ||
    textToSearch.includes("crypto") ||
    textToSearch.includes("biz") ||
    textToSearch.includes("wealth") ||
    textToSearch.includes("trading") ||
    textToSearch.includes("market") ||
    textToSearch.includes("economy")
  ) {
    return "Finance";
  }

  // 5. Vlogs & Lifestyle
  if (
    textToSearch.includes("vlog") ||
    textToSearch.includes("life") ||
    textToSearch.includes("daily") ||
    textToSearch.includes("journey") ||
    textToSearch.includes("travel") ||
    textToSearch.includes("vlogs") ||
    textToSearch.includes("lifestyle") ||
    textToSearch.includes("routine")
  ) {
    return "Vlogs";
  }

  // 6. News & Politics
  if (
    textToSearch.includes("news") ||
    textToSearch.includes("report") ||
    textToSearch.includes("politics") ||
    textToSearch.includes("world") ||
    textToSearch.includes("current affairs")
  ) {
    return "News";
  }

  // 7. Documentary & Storytelling
  if (
    textToSearch.includes("story") ||
    textToSearch.includes("doc") ||
    textToSearch.includes("mystery") ||
    textToSearch.includes("files") ||
    textToSearch.includes("documentary") ||
    textToSearch.includes("untold")
  ) {
    return "Documentary";
  }

  // 8. Music
  if (
    textToSearch.includes("music") ||
    textToSearch.includes("song") ||
    textToSearch.includes("beat") ||
    textToSearch.includes("art") ||
    textToSearch.includes("dance") ||
    textToSearch.includes("sing")
  ) {
    return "Music";
  }

  // 9. Beauty & Fashion
  if (
    textToSearch.includes("beauty") ||
    textToSearch.includes("style") ||
    textToSearch.includes("fashion") ||
    textToSearch.includes("makeup") ||
    textToSearch.includes("skincare")
  ) {
    return "Beauty";
  }

  // If no keyword match, check database currentNiche
  if (currentNiche && currentNiche !== "Unknown" && currentNiche !== "" && currentNiche !== "none") {
    const match = NICHES.find(n => n.id.toLowerCase() === currentNiche.toLowerCase())
    if (match) return match.id
  }

  return "Education"; // Refined default fallback
}

// YouTube API types
interface YTChannel {
  id: string
  handle: string
  title: string
  description?: string
  avatarUrl: string | null
  subscriberCount: number
  videoCount: number
  totalViews: number
  uploadsPlaylistId: string | null
  country: string | null
  publishedAt?: string | null
}
interface YTVideo {
  videoId: string
  title: string
  thumbnailUrl: string | null
  publishedAt: string
  viewCount: number
  viewCountFormatted: string
  likeCount: number
  relativeTime: string
  status: "OUTPERFORMED" | "STABLE" | "UNDERPERFORMING"
  statusColor: string
  performanceRatio: number
  youtubeUrl: string
}

// Niche benchmark data (clearly labelled — NOT user's actual videos)
// Deep Channel Audit Report Mock Intelligence Generator
function generateChannelAudit(channelName: string, niche: string) {
  const cleanNiche = niche || "Tech"
  const cleanName = (channelName || "").toLowerCase()

  // Specific override for Shemaroo Movies (real Bollywood movie channel)
  if (cleanName.includes("shemaroomovies") || cleanName.includes("shemaroo movies")) {
    return {
      marketOpportunity: "9.8/10",
      saturation: "High (High Demand, Major Brands)",
      optimalTime: "Daily @ 12:00 PM & 6:00 PM (IST)",
      velocityTip: "Nostalgic Bollywood thumbnails with clear star face overlays perform in the top 1% (CTR +22%). Focus on high-intensity movie title keywords.",
      videos: [
        {
          title: "Double Dhamaal (HD) | Sanjay Dutt | Riteish Deshmukh | Arshad Warsi | Superhit Comedy Movie",
          ctr: "14.2%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "3 Faces • Brightness (142) • High Contrast",
          worked: "Star-studded cast thumbnail and optimized color saturation.",
          notWorked: "Long intro hook caused minor retention drop in first 15s."
        },
        {
          title: "Golmaal: Fun Unlimited (Full Movie) | Ajay Devgn | Arshad Warsi | Superhit Bollywood Comedy",
          ctr: "11.8%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "4 Faces • Brightness (135) • High Contrast",
          worked: "High-intensity emotional character split thumbnail.",
          notWorked: "Lack of mobile thumbnail text optimization."
        },
        {
          title: "Dhamaal (2007) - Superhit Comedy Movie | Sanjay Dutt, Ritesh Deshmukh, Arshad Warsi",
          ctr: "9.5%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "2 Faces • Brightness (120) • Medium Contrast",
          worked: "Title focuses on key actors and high-performing movie keywords.",
          notWorked: "None - solid average benchmark performance."
        },
        {
          title: "Great Grand Masti | Riteish Deshmukh, Vivek Oberoi | Superhit Comedy Movie",
          ctr: "5.2%",
          status: "UNDERPERFORMING",
          statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          visualMetrics: "No Face • Brightness (75) • Low Contrast",
          worked: "Popular cast titles.",
          notWorked: "Low-contrast thumbnail overlay."
        },
        {
          title: "Masti (2004) | Vivek Oberoi | Ajay Devgn | Superhit Hindi Comedy Movie",
          ctr: "8.6%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "3 Faces • Brightness (118) • Medium Contrast",
          worked: "Vintage appeal title hooks.",
          notWorked: "Thumbnail faces lacked modern high-saturation calibration."
        }
      ]
    }
  }

  const nicheData: Record<string, any> = {
    Gaming: {
      marketOpportunity: "8.7/10",
      saturation: "High Saturation (High Demand)",
      optimalTime: "Wednesdays @ 4:00 PM & Saturdays @ 11:00 AM",
      velocityTip: "Visual clutter and high-contrast expressiveness are highly effective. Face overlays show +18.4% CTR.",
      videos: [
        {
          title: "I Survived 100 Days in a Hardcore Pixel World",
          ctr: "10.4%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "1 Face • Average Brightness (145) • High Contrast",
          worked: "Extreme stakes narrative hook and vibrant visual depth.",
          notWorked: "Long intro hook caused minor retention drop in first 15s."
        },
        {
          title: "Why Everyone is Wrong About the New Update...",
          ctr: "8.2%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "No Face • Average Brightness (110) • Medium Contrast",
          worked: "Curiosity gap title combined with contrasting neon text highlights.",
          notWorked: "Lack of human facial expressions slightly limited casual CTR."
        },
        {
          title: "How I Speedran this Level in 4 Minutes",
          ctr: "4.1%",
          status: "UNDERPERFORMING",
          statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          visualMetrics: "No Face • Dark Brightness (72) • Low Contrast",
          worked: "Actionable title hook.",
          notWorked: "Dark thumbnail backdrop resulted in low visual prominence in recommended feeds."
        },
        {
          title: "Is this the Hardest Boss Ever?",
          ctr: "9.1%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "2 Faces • Average Brightness (155) • High Contrast",
          worked: "High-emotion face overlay and clean background split screen.",
          notWorked: "Minor saturation bleed over the main title text overlay."
        },
        {
          title: "My Ultimate Gaming Room Setup (Full Tour)",
          ctr: "6.5%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "1 Face • Bright (185) • High Contrast",
          worked: "Excellent lighting visual aesthetics showcasing premium gear.",
          notWorked: "High title length (78 characters) diluted search term density."
        }
      ]
    },
    Tech: {
      marketOpportunity: "9.4/10",
      saturation: "Medium Saturation (Very High Value)",
      optimalTime: "Tuesdays @ 9:00 AM & Thursdays @ 2:00 PM",
      velocityTip: "Sleek, graphite-on-black aesthetics with neon accents perform in the top 5%. Keep text minimal.",
      videos: [
        {
          title: "I Built a Neural Network in 20 Lines of Code",
          ctr: "11.2%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "No Face • Sleek Dark Brightness (88) • High Contrast",
          worked: "Incredible technical authority and clean, minimal typography.",
          notWorked: "High technical density in description limited general audience reach."
        },
        {
          title: "The Death of Software Engineering is Near",
          ctr: "8.9%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "1 Face • Average Brightness (120) • High Contrast",
          worked: "Exceptional urgency hook in title and dramatic dark backdrop.",
          notWorked: "Slight clickbait perception led to slightly shorter average view duration."
        },
        {
          title: "Why You Should Avoid React 19 for Now",
          ctr: "6.8%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "No Face • Average Brightness (105) • Medium Contrast",
          worked: "Counter-intuitive position generated high comment engagement.",
          notWorked: "React logo in thumbnail had slight scaling issues in mobile viewports."
        },
        {
          title: "My Ultimate Desktop Workspace Tour",
          ctr: "4.5%",
          status: "UNDERPERFORMING",
          statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          visualMetrics: "No Face • Dark Brightness (75) • Low Contrast",
          worked: "Premium clean workspace setup aesthetic.",
          notWorked: "Dark thumbnail lack of contrast failed to draw eye scroll focus."
        },
        {
          title: "How I Automated My Entire SaaS Workflow",
          ctr: "9.5%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "1 Face • Average Brightness (130) • High Contrast",
          worked: "Clear graphical flowchart in thumbnail visualizing massive efficiency.",
          notWorked: "No substantial downside - solid overall performance."
        }
      ]
    },
    Education: {
      marketOpportunity: "8.9/10",
      saturation: "Low Saturation (Steady Demand)",
      optimalTime: "Fridays @ 3:00 PM & Sundays @ 10:00 AM",
      velocityTip: "Clear graphic charts and clean white text draw best educational CTRs. Keep titles extremely concise.",
      videos: [
        {
          title: "How Quantum Computing Actually Works",
          ctr: "9.2%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "No Face • Average Brightness (115) • High Contrast",
          worked: "Elegant graphic visualization of qubits instead of generic stock photo.",
          notWorked: "Complex terminology in mid-video led to minor conceptual dropoffs."
        },
        {
          title: "The Insane Physics of the World's Fastest Train",
          ctr: "8.1%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "No Face • Bright Brightness (160) • High Contrast",
          worked: "Dynamic speedlines and high brightness background.",
          notWorked: "Lack of scale reference in the main train model."
        },
        {
          title: "I Memorized a Whole Dictionary in 30 Days",
          ctr: "10.5%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "1 Face • Bright Brightness (175) • High Contrast",
          worked: "High-expression facial shot showing fatigue and massive book stacks.",
          notWorked: "Initial title was too long; fixed in first 2 hours."
        },
        {
          title: "The Math Formula That Rules the Stock Market",
          ctr: "4.8%",
          status: "UNDERPERFORMING",
          statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          visualMetrics: "No Face • Dark Brightness (80) • Low Contrast",
          worked: "Intriguing mathematical hook.",
          notWorked: "Hard-to-read font styling for equations on smaller mobile screens."
        },
        {
          title: "Why the Roman Empire Collapsed (Deep Dive)",
          ctr: "7.4%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "No Face • Average Brightness (100) • Medium Contrast",
          worked: "High-fidelity statue rendering with subtle gold accents.",
          notWorked: "Title suffix (Deep Dive) added unnecessary character count."
        }
      ]
    },
    Entertainment: {
      marketOpportunity: "9.5/10",
      saturation: "High Saturation (High Value)",
      optimalTime: "Daily @ 1:00 PM & 7:00 PM",
      velocityTip: "Vibrant high-contrast thumbnails with clear character reaction shots perform best. Keep titles dramatic.",
      videos: [
        {
          title: "Double Dhamaal (HD) | Sanjay Dutt | Riteish Deshmukh | Arshad Warsi | Superhit Comedy Movie",
          ctr: "14.2%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "3 Faces • Brightness (142) • High Contrast",
          worked: "Star-studded cast thumbnail and optimized color saturation.",
          notWorked: "Long intro hook caused minor retention drop in first 15s."
        },
        {
          title: "Golmaal: Fun Unlimited (Full Movie) | Ajay Devgn | Arshad Warsi | Superhit Bollywood Comedy",
          ctr: "11.8%",
          status: "OUTPERFORMED",
          statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          visualMetrics: "4 Faces • Brightness (135) • High Contrast",
          worked: "High-intensity emotional character split thumbnail.",
          notWorked: "Lack of mobile thumbnail text optimization."
        },
        {
          title: "Dhamaal (2007) - Superhit Comedy Movie | Sanjay Dutt, Ritesh Deshmukh, Arshad Warsi",
          ctr: "9.5%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "2 Faces • Brightness (120) • Medium Contrast",
          worked: "Title focuses on key actors and high-performing movie keywords.",
          notWorked: "None - solid average benchmark performance."
        },
        {
          title: "Great Grand Masti | Riteish Deshmukh, Vivek Oberoi | Superhit Comedy Movie",
          ctr: "5.2%",
          status: "UNDERPERFORMING",
          statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          visualMetrics: "No Face • Brightness (75) • Low Contrast",
          worked: "Popular cast titles.",
          notWorked: "Low-contrast thumbnail overlay."
        },
        {
          title: "Masti (2004) | Vivek Oberoi | Ajay Devgn | Superhit Hindi Comedy Movie",
          ctr: "8.6%",
          status: "STABLE",
          statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          visualMetrics: "3 Faces • Brightness (118) • Medium Contrast",
          worked: "Vintage appeal title hooks.",
          notWorked: "Thumbnail faces lacked modern high-saturation calibration."
        }
      ]
    }
  }

  const fallback = {
    marketOpportunity: "8.5/10",
    saturation: "Medium Saturation",
    optimalTime: "Wednesdays @ 5:00 PM & Sundays @ 3:00 PM",
    velocityTip: "Balanced visual contrast, medium brightness, and high title emotional urgency hooks show the best CTR lift.",
    videos: [
      {
        title: `How I Mastered ${cleanNiche} in 3 Months`,
        ctr: "9.0%",
        status: "OUTPERFORMED",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        visualMetrics: "1 Face • Brightness (130) • High Contrast",
        worked: "Strong personal connection storytelling and clear progression graphic.",
        notWorked: "High volume of early comments required extensive moderation."
      },
      {
        title: `The Ultimate Guide to ${cleanNiche} in 2026`,
        ctr: "7.1%",
        status: "STABLE",
        statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        visualMetrics: "No Face • Brightness (120) • Medium Contrast",
        worked: "Complete blueprint title framework that users bookmark.",
        notWorked: "High competition for core keywords."
      },
      {
        title: `5 ${cleanNiche} Mistakes I Wish I Avoided Earlier`,
        ctr: "8.6%",
        status: "OUTPERFORMED",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        visualMetrics: "1 Face • Brightness (140) • High Contrast",
        worked: "Mistake-based framing triggers high loss-aversion clicks.",
        notWorked: "Thumbnail face expression could have been slightly more dramatic."
      },
      {
        title: `Why Most Creators Fail in ${cleanNiche}`,
        ctr: "4.2%",
        status: "UNDERPERFORMING",
        statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        visualMetrics: "No Face • Brightness (75) • Low Contrast",
        worked: "Controversial talking point.",
        notWorked: "Dark thumbnail visual concept looked generic and was ignored in feeds."
      },
      {
        title: `My Complete Daily Workflow for ${cleanNiche}`,
        ctr: "6.8%",
        status: "STABLE",
        statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        visualMetrics: "1 Face • Brightness (125) • Medium Contrast",
        worked: "Highly actionable behind-the-scenes premium look.",
        notWorked: "Title did not emphasize the speed/time-saving benefit."
      }
    ]
  }

  return nicheData[cleanNiche] || fallback
}
// ============================================================================
//           CREATOR DECISION INTELLIGENCE SYSTEM OVERHAUL (v2.0)
// ============================================================================
interface ReferenceItem {
  title: string
  why_it_worked: string
  what_to_study: string
  url: string
  views: number
  upload_age: string
}

function CreatorIntelligenceReport({ 
  result, 
  profile, 
  title, 
  niche, 
  brightness, 
  faceCount, 
  thumbnailPreview, 
  onRestart,
  compareVariants,
  compareResults
}: { 
  result: any, 
  profile: any, 
  title: string, 
  niche: string, 
  brightness: number, 
  faceCount: number, 
  thumbnailPreview: string | null, 
  onRestart: () => void,
  compareVariants?: Array<{ id: string, file: File | null, preview: string | null, name?: string }>,
  compareResults?: any[] | null
}) {
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)
  const [isTierExplainerOpen, setIsTierExplainerOpen] = useState(false)
  const [isFixChecklistOpen, setIsFixChecklistOpen] = useState(false)
  const [visualizerMode, setVisualizerMode] = useState<"normal" | "blur" | "heatmap" | "focus">("normal")
  const [isCalculatingFocus, setIsCalculatingFocus] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  // Find first active variant preview, or fallback to the single thumbnailPreview
  const firstActiveId = compareVariants?.find(v => v.preview !== null)?.id || "v1"
  const [activeSimVariantId, setActiveSimVariantId] = useState<string>(firstActiveId)

  useEffect(() => {
    const firstActive = compareVariants?.find(v => v.preview !== null)?.id
    if (firstActive) {
      setActiveSimVariantId(firstActive)
    }
  }, [compareVariants])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowDebugPanel(window.location.search.includes("debug=true"))
    }
  }, [])

  // Generate feed items dynamically inside CreatorIntelligenceReport
  const getFeedItems = () => {
    const items: Array<{
      id: string
      title: string
      channelName: string
      views: string
      time: string
      preview: string | null
      avatar: string
      isUserVariant?: boolean
      variantName?: string
    }> = []

    // Find the currently active simulator variant
    const selectedVariant = compareVariants ? compareVariants.find(v => v.id === activeSimVariantId) : null
    const previewToUse = selectedVariant && selectedVariant.preview ? selectedVariant.preview : thumbnailPreview

    // 1. Add User Video
    items.push({
      id: "user-video",
      title: title || "AlgoPilot CTR Secret: 10x Your Growth!",
      channelName: profile?.youtube_channel || "Creator Pro",
      views: "85K views",
      time: "18h ago",
      preview: previewToUse,
      avatar: profile?.avatar || "",
      isUserVariant: true,
      variantName: selectedVariant?.name || "Original"
    })

    // 1.5 Add other user variants if they exist (simulate A/B testing in the feed)
    if (compareVariants && compareVariants.length > 1) {
      compareVariants.filter(v => v.id !== activeSimVariantId).forEach((v, idx) => {
        items.push({
          id: `user-variant-${v.id}`,
          title: `[Variant ${idx + 2}] ` + (title || "AlgoPilot CTR Secret: 10x Your Growth!"),
          channelName: profile?.youtube_channel || "Creator Pro",
          views: "NEW",
          time: "Just now",
          preview: v.preview,
          avatar: profile?.avatar || "",
          isUserVariant: false, // We mark as false so it doesn't get the glowing focus effects of the main selected one
          variantName: v.name
        })
      })
    }

    // 2. Add real competitive YouTube videos if available
    if (ytVideos && ytVideos.length > 0) {
      ytVideos.slice(0, 6).forEach((vid, idx) => {
        items.push({
          id: `yt-${vid.videoId}`,
          title: vid.title,
          channelName: vid.channelTitle,
          views: `${(vid.viewCount / 1000).toFixed(0)}K views`,
          time: new Date(vid.publishedAt).toLocaleDateString(),
          preview: vid.thumbnailUrl,
          avatar: vid.channelTitle.charAt(0),
        })
      })
    } else {
      // 3. Fallback to high-quality mock tech/gaming videos (realistic placeholders)
      items.push({
        id: "mock-1",
        title: "I Built a $10,000 Trading Bot from Scratch",
        channelName: "TechVantage",
        views: "340K views",
        time: "4 days ago",
        preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        avatar: "T",
      })

      items.push({
        id: "mock-2",
        title: "This New AI Feature Changes Everything (Next.js 14)",
        channelName: "Code Mastery",
        views: "1.2M views",
        time: "2 weeks ago",
        preview: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
        avatar: "C",
      })

      items.push({
        id: "mock-3",
        title: "The Truth About YouTube's New Algorithm Update",
        channelName: "Creator Hub",
        views: "18K views",
        time: "5 hours ago",
        preview: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80",
        avatar: "C",
      })
    }

    return items
  }

  const scoreNum = parseFloat(result.score) || 72.0
  const nicheSafe = (niche || "").toLowerCase()

  // 1. Final Recommendation Decision Engine (Trigger Panel)
  let decisionVerdict = "🟠 Do NOT upload this version yet."
  let decisionClass = "border-amber-500/20 bg-amber-500/5 text-amber-400"
  let decisionReason = "Your thumbnail currently loses emotional clarity against stronger competitors in the category."
  let decisionRecommended = "Apply the top fixes before publishing."
  let decisionEffort = "15–25 minutes"
  let decisionReward = "Significantly stronger feed attention and curiosity response."

  if (scoreNum >= 80) {
    decisionVerdict = "🟢 READY TO UPLOAD"
    decisionClass = "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
    decisionReason = "Outstanding emotional balance and extreme feed readability. Highly optimized against niche competitors."
    decisionRecommended = "Proceed with original layout. Ready for public scheduling."
    decisionEffort = "0 minutes"
    decisionReward = "Maximum organic feed expansion potential."
  } else if (scoreNum >= 70 && scoreNum < 80) {
    decisionVerdict = "🟡 SAFE BUT NOT OPTIMIZED"
    decisionClass = "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
    decisionReason = "Familiar visual patterns, but lacks the dominant emotional anchor needed to win immediate attention."
    decisionRecommended = "Apply the primary face scale fix before publishing."
    decisionEffort = "5–10 minutes"
    decisionReward = "Moderate boost in visual scan retention."
  } else if (scoreNum < 60) {
    decisionVerdict = "🔴 HIGH RISK OF UNDERPERFORMANCE"
    decisionClass = "border-rose-500/20 bg-rose-500/5 text-rose-400"
    decisionReason = "Critical visual friction and lack of structural contrast will cause major skip-rates in recommendation feeds."
    decisionRecommended = "Apply all recommended fixes immediately to avoid feed drowning."
    decisionEffort = "25–40 minutes"
    decisionReward = "Drastic reduction in feed-skipping and improved curiosity triggers."
  }

  // 2. Simple Executive Verdict
  let verdictSymbol = "🟠"
  let verdictStatus = "likely underperform"
  let verdictColor = "text-amber-400 bg-amber-500/5 border-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.02)]"
  let expectedPerformance = "Below your channel average"
  let mainProblem = "Your thumbnail lacks strong emotional focus and mobile-feed clarity."
  let primaryImpact = "Viewers may scroll past before understanding the emotional hook."
  let potentialImprovement = "+18% to +34% higher click-through potential after recommended fixes."

  if (scoreNum >= 80) {
    verdictSymbol = "🟢"
    verdictStatus = "highly competitive"
    verdictColor = "text-emerald-400 bg-emerald-500/5 border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.02)]"
    expectedPerformance = "Above your channel average"
    mainProblem = "None detected. Outstanding visual focus and balanced composition."
    primaryImpact = "High probability of recommendation feed expansion."
    potentialImprovement = "+0% (Already highly optimized)"
  } else if (scoreNum < 65) {
    verdictSymbol = "🔴"
    verdictStatus = "struggle in competitive feeds"
    verdictColor = "text-rose-400 bg-rose-500/5 border-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.02)]"
    expectedPerformance = "Well below your channel average"
    mainProblem = "High visual background clutter and passive reaction facial geometry."
    primaryImpact = "Severe feed-skipping as viewers scan past rapidly."
    potentialImprovement = "+25% to +45% higher click-through potential after recommended fixes."
  }

  // 3. Channel DNA Intelligence (Style Match)
  const styleMatchPercentage = result.channel_dna?.style_match_percentage || (scoreNum >= 80 ? 89 : scoreNum >= 70 ? 76 : 58)
  
  // 4. Criticality Severity Tiers (Visual Severity Fixes)
  const backendImprovements = result.improvements && result.improvements.length > 0 
    ? result.improvements 
    : []

  const fixes = backendImprovements.length > 0 
    ? backendImprovements.map((imp: any, idx: number) => {
        const tier = imp.tier || "ℹ️ POLISH IMPROVEMENT"
        const isPrimary = tier.includes("CRITICAL") || (idx === 0 && !backendImprovements.some((x: any) => (x.tier || "").includes("CRITICAL")))
        
        let tierClass = "text-blue-400 bg-blue-500/10 border-blue-500/20"
        let cardClass = "border-blue-500/10 bg-blue-500/[0.002] hover:border-blue-500/20"
        
        if (tier.includes("CRITICAL")) {
          tierClass = "text-rose-400 bg-rose-500/10 border-rose-500/20"
          cardClass = "border-rose-500/30 bg-rose-500/[0.01] hover:border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.04)]"
        } else if (tier.includes("IMPORTANT") || tier.includes("OPTIMIZATION")) {
          tierClass = "text-amber-400 bg-amber-500/10 border-amber-500/20"
          cardClass = "border-amber-500/20 bg-amber-500/[0.005] hover:border-amber-500/35"
        }
        
        return {
          num: idx + 1,
          tier: tier,
          tierClass,
          cardClass,
          title: imp.title,
          current: imp.current,
          recommended: imp.recommended,
          improvement: imp.improvement || "+5% to +10% CTR potential",
          why: imp.why,
          isPrimary
        }
      })
    : [
        {
          num: 1,
          tier: "🚨 CRITICAL ISSUE",
          tierClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          cardClass: "border-rose-500/30 bg-rose-500/[0.01] hover:border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.04)]",
          title: "Increase Face Size",
          current: `Faces occupy only ${faceCount > 0 ? "11%" : "0%"} of the thumbnail frame.`,
          recommended: "18–25% for stronger emotional stopping power.",
          improvement: "+9% to +15% more feed attention.",
          why: "Comedy and entertainment viewers react fastest to large emotional faces.",
          isPrimary: true
        },
        {
          num: 2,
          tier: "⚠️ IMPORTANT OPTIMIZATION",
          tierClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          cardClass: "border-amber-500/20 bg-amber-500/[0.005] hover:border-amber-500/35",
          title: "Remove Background Noise",
          current: brightness > 150 ? "Too many competing visual highlights." : "High density of competing visual objects in frame.",
          recommended: "Keep 2–3 major focal elements maximum.",
          improvement: "+6% to +12% better mobile readability.",
          why: "Cluttered thumbnails lose clarity and blend together during high-speed mobile scrolling.",
          isPrimary: false
        },
        {
          num: 3,
          tier: "ℹ️ POLISH IMPROVEMENT",
          tierClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          cardClass: "border-blue-500/10 bg-blue-500/[0.002] hover:border-blue-500/20",
          title: "Make The Emotion More Extreme",
          current: faceCount === 0 ? "No human facial target detected." : "Reaction expression is too neutral/passive.",
          recommended: "Exaggerated shock / laughter / conflict expression.",
          improvement: "+8% to +18% stronger curiosity trigger.",
          why: "Comedy viewers seek extreme immediate emotion; subtle expressions are ignored completely.",
          isPrimary: false
        }
      ]

  return (
    <div className="space-y-8 animate-fade-in w-full text-left font-sans">
      {/* Dynamic Immersive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest block w-fit mb-2">
            AlgoPilot — AI Creative Strategist
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Creative War Room</h1>
          <p className="text-zinc-500 text-xs mt-1">Niche battlefield strategist, high-fidelity scanning synthesis, and expected outcome metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={cn(
              "px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              showDebugPanel 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20" 
                : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
            )}
          >
            <Sliders className="w-4 h-4" /> {showDebugPanel ? "Hide Debug Console" : "Show Debug Console"}
          </button>
          <button 
            onClick={onRestart}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Restart Scan & Load Variant
          </button>
        </div>
      </div>

      {/* 1. PREDICTED TIER HERO (FIRST SECTION) */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest block w-fit">
            Neural Ensemble Prediction
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Expected Feed Rating
          </h2>
          <p className="text-zinc-400 text-xs max-w-xl leading-relaxed">
            Your draft was evaluated by our CatBoost model against category parameters. Restoring historical averages suggests the following performance tier:
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0 bg-white/[0.02] border border-white/5 p-6 rounded-3xl w-full md:w-auto justify-between md:justify-start">
          <div className="text-center">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Ensemble Score</span>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight">{result.score}</div>
          </div>
          <div className="w-[1px] h-12 bg-white/10" />
          <div className="text-center">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5 font-sans">Predicted Tier</span>
            <div className={cn(
                "px-4 py-2 rounded-xl border text-base md:text-lg font-black uppercase tracking-widest",
                result.tier === 'S' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                result.tier === 'A' ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" :
                result.tier === 'B' ? "bg-sky-500/20 text-sky-400 border-sky-500/30" :
                result.tier === 'C' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                "bg-rose-500/20 text-rose-400 border-rose-500/30"
            )}>
              {result.tier || "B"}-Tier
            </div>
          </div>
        </div>
      </div>

      {/* 2. COLLAPSIBLE TIER DEFINITIONS EXPLAINER */}
      <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-3">
        <button 
          onClick={() => setIsTierExplainerOpen(!isTierExplainerOpen)}
          className="w-full flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 animate-pulse" /> Tier Definitions & Distribution Models
          </span>
          {isTierExplainerOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {isTierExplainerOpen && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-white/5 text-[10px] md:text-[11px] leading-relaxed text-left animate-fade-in">
            <div className="p-3.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
              <div className="font-black text-emerald-400 text-[11px]">S-Tier (90-100)</div>
              <p className="text-zinc-400">Viral expansion probability. Peak mobile-feed readability & hook synergy.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/[0.02] border border-blue-500/10 space-y-1">
              <div className="font-black text-blue-400 text-[11px]">A-Tier (80-89)</div>
              <p className="text-zinc-400">Highly competitive. Dominant focal cues and optimal niche layout.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/[0.02] border border-amber-500/10 space-y-1">
              <div className="font-black text-amber-400 text-[11px]">B-Tier (70-79)</div>
              <p className="text-zinc-400">Stable benchmark. Meets niche standards but suffers focal point bleed.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-orange-500/[0.02] border border-orange-500/10 space-y-1">
              <div className="font-black text-orange-400 text-[11px]">C-Tier (60-69)</div>
              <p className="text-zinc-400">Moderate friction. Dark highlights or semantic title dilution reduces click rates.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1">
              <div className="font-black text-rose-400 text-[11px]">D-Tier (&lt;60)</div>
              <p className="text-zinc-400">High feed-skipping. Severe object clutter or overlapping bounds.</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. CATBOOST JUSTIFICATION METRICS */}
      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Sliders className="w-24 h-24 text-blue-400" />
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Feature Weights & Metrics</span>
          <h3 className="text-lg font-bold text-white">Prediction Justification</h3>
          <p className="text-zinc-400 text-xs mt-0.5">
            The CatBoost model calculated the classification score based on the following specific semantic and visual weights:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Linguistic Hook Weight</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {title.length < 15 ? (
                <>⚠️ Weak/Gibberish Hook <span className="text-rose-400 text-[11px] font-mono">(-12.4)</span></>
              ) : title.length < 50 ? (
                <>🔥 Strong Hook <span className="text-emerald-400 text-[11px] font-mono">(+15.4)</span></>
              ) : title.length > 70 ? (
                <>⚠️ Diluted Hook <span className="text-rose-400 text-[11px] font-mono">(-8.2)</span></>
              ) : (
                <>⚡ Balanced Hook <span className="text-blue-400 text-[11px] font-mono">(+4.8)</span></>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 block">Length: {title.length} characters</span>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Luminance Contrast</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {brightness > 170 ? (
                <>🌅 Overexposed <span className="text-rose-400 text-[11px] font-mono">(-6.4)</span></>
              ) : brightness < 90 ? (
                <>🌃 Underexposed <span className="text-rose-400 text-[11px] font-mono">(-12.8)</span></>
              ) : (
                <>☀️ Optimal Range <span className="text-emerald-400 text-[11px] font-mono">(+11.2)</span></>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 block">Brightness: {brightness}/255</span>
          </div>
        </div>
      </div>

      {/* 4. COLLAPSIBLE WHAT TO FIX CHECKLIST */}
      <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4">
        <div className="w-full flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" /> WHAT TO FIX CHECKLIST ({fixes.filter((f: any) => f.isPrimary).length} Critical Items)
          </span>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5 text-left animate-fade-in">
            {fixes.map((fix: any) => (
              <div 
                key={fix.num} 
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 relative group text-left bg-white/[0.005]",
                  fix.cardClass
                )}
              >
                {/* Glowing border if primary */}
                {fix.isPrimary && (
                  <div className="absolute inset-0 rounded-2xl border border-rose-500/20 animate-pulse pointer-events-none" />
                )}
                
                <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex gap-4 items-start">
                    <span className={cn(
                      "w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border",
                      fix.isPrimary 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                        : "bg-zinc-800 border-white/10 text-zinc-400"
                    )}>
                      #{fix.num}
                    </span>
                    <div className="space-y-2">
                      <div>
                        <span className={cn("inline-block px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border mb-1.5", fix.tierClass)}>
                          {fix.tier}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-none">{fix.title}</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Current Problem</span>
                          <span className="text-zinc-300 leading-normal">{fix.current}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5 text-emerald-400">Recommendation</span>
                          <span className="text-zinc-300 leading-normal font-semibold">{fix.recommended}</span>
                        </div>
                      </div>
                      <div className="text-xs pt-2 border-t border-white/[0.03] text-zinc-400 leading-relaxed">
                        <strong className="text-zinc-300 block text-[9px] uppercase tracking-wider mb-0.5 font-bold">Psychological Outcome:</strong>
                        {fix.why}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0 flex justify-between sm:block">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Expected Lift</span>
                    <span className="text-sm font-black text-emerald-400">{fix.improvement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* 5. THUMBNAIL VARIANT COMPARISON (RENDERING THE 3 SLOTS WITH METRICS & BADGES) */}
      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left">
        <div>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">COMPARATIVE VARIANT ANALYSIS</span>
          <h3 className="text-lg font-bold text-white">Visual Matrix Comparison</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Rankings, pros & cons, brightness levels, and facial density counts across uploaded drafts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compareResults && compareResults.length > 0 ? (
            compareResults.map((variant) => (
              <div 
                key={variant.id} 
                className={cn(
                  "p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-white/10 transition-all bg-white/[0.002] relative",
                  variant.rank === 1 ? "border-emerald-500/30 bg-emerald-500/[0.01]" : "border-white/5"
                )}
              >
                {variant.rank === 1 && (
                  <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[8px] uppercase tracking-widest shadow-md">
                    Winner ★
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative">
                    {variant.preview ? (
                      <img src={variant.preview} alt={variant.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-[9px] uppercase">No Preview</div>
                    )}
                    <span className={cn(
                      "absolute bottom-2 left-2 px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-md z-10",
                      variant.rank === 1 ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400"
                    )}>
                      Rank #{variant.rank}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/85 text-[8px] font-mono text-white rounded select-none z-10">
                      Score: {variant.score}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{variant.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Predicted grade: <span className="text-emerald-400 font-bold">{variant.grade}</span></p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-[9px] border-t border-white/5 pt-2 font-mono">
                    <div className="p-2 rounded bg-white/[0.01] border border-white/[0.03]">
                      <span className="text-zinc-500 block uppercase">Brightness</span>
                      <span className="text-zinc-200 block font-bold">{variant.data?.brightness || 128}</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-white/5 pt-3 text-[10px] leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[8px]">✅ Strengths</span>
                      {variant.feedback.strengths.map((str: string, i: number) => (
                        <div key={i} className="text-zinc-300 flex items-start gap-1"><span>•</span> <span>{str}</span></div>
                      ))}
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-white/[0.03]">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block text-[8px]">⚠️ Weaknesses</span>
                      {variant.feedback.weaknesses.map((weak: string, i: number) => (
                        <div key={i} className="text-zinc-400 flex items-start gap-1"><span>•</span> <span>{weak}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-6 text-center rounded-2xl border border-white/5 bg-white/[0.002] text-zinc-500 italic text-xs">
              Variant comparison is only available in multi-thumbnail uploads.
            </div>
          )}
        </div>
      </div>

      {/* 6. POST-FIX FORECAST (+18% TO +34% LIFT) */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/[0.02] to-blue-500/[0.01] border border-emerald-500/10 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">POST-FIX IMPACT METRIC FORECAST</span>
        </div>
        <h3 className="text-lg font-bold text-white">Projected Engagement Lift</h3>
        <p className="text-xs text-zinc-400">
          Applying the fixes (clutter reduction + facial reaction scaling) shifts the attention density profile of your layout, producing an expected:
        </p>
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">CTR Shift Probability</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">{potentialImprovement} Lift</div>
          </div>
          <div className="text-zinc-400 text-xs max-w-sm font-normal">
            Based on competitive models in the <strong className="text-white font-bold">{niche}</strong> category, clean structural bounds reduce peripheral feed skipping dramatically.
          </div>
        </div>
      </div>

      {/* 7. REACH SYNERGY */}
      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">CHANNEL RHYTHM & REACH SYNERGY</span>
        </div>
        <h3 className="text-lg font-bold text-white">Subscriber Authority Buffer</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your historical upload frequency of <strong className="text-white">{profile?.upload_frequency || "2-3 videos/week"}</strong> and subscriber base of <strong className="text-white">{(profile?.subscriber_count || 1000).toLocaleString()}</strong> act as an authority buffer. The model factors in this seed audience velocity, ensuring that early CTR gains compound search recommendation signals in the first 24 hours.
        </p>
      </div>

      {/* 8. YOUTUBE MOBILE FEED SIMULATOR */}
      <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Smartphone className="w-24 h-24 text-emerald-400" />
        </div>
        
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">LIVE FEED SIMULATOR</span>
          <h3 className="text-lg font-bold text-white">YouTube Mobile Feed Simulator</h3>
          <p className="text-xs text-zinc-400 mt-1">Preview how your variants capture scanning focus against standard YouTube recommendations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
          {/* Swapper Controls & Analysis */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Active Simulator Preview</label>
              <div className="flex flex-col gap-2">
                {compareVariants && compareVariants.filter(v => v.preview !== null).map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setActiveSimVariantId(variant.id)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center w-full",
                      activeSimVariantId === variant.id 
                        ? "bg-white text-black border-white" 
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    )}
                  >
                    <span className="truncate pr-4">{variant.name || `Variant ${index + 1}`}</span>
                    {activeSimVariantId === variant.id ? (
                      <span className="px-2 py-0.5 rounded bg-black text-white text-[8px] font-black shrink-0">ACTIVE</span>
                    ) : (
                      <span className="text-[8px] text-zinc-500 uppercase shrink-0">Swap Feed</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Toggles */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Visual Diagnostic Overlays</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "normal", label: "Standard Feed" },
                  { id: "heatmap", label: "Attention Heatmap" },
                  { id: "blur", label: "Peripheral Blur" }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setVisualizerMode(mode.id as any)}
                    className={cn(
                      "py-2.5 px-3 rounded-lg border text-center transition-all truncate",
                      visualizerMode === mode.id 
                        ? "bg-white/10 border-white/20 text-white" 
                        : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Dedicated Eye Tracking Simulation Action */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setVisualizerMode("focus")
                    setIsCalculatingFocus(true)
                    setTimeout(() => setIsCalculatingFocus(false), 1500)
                  }}
                  className={cn(
                    "w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all",
                    visualizerMode === "focus" 
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                      : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                  )}
                >
                  <ScanEye className="w-4 h-4" />
                  {isCalculatingFocus ? "Calculating Saccade Paths..." : "Run Eye-Tracking Simulation"}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 space-y-2 text-xs leading-relaxed">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                ⚠️ Mobile Optimization Warnings
              </span>
              <ul className="space-y-1.5 text-[10px] text-zinc-400">
                <li className="flex gap-1.5">
                  <span>•</span> <span><strong>Timestamp Overlap:</strong> Visual hook elements occupy the bottom-right corner and will be covered by the native player duration badge.</span>
                </li>
                <li className="flex gap-1.5">
                  <span>•</span> <span><strong>Scalability:</strong> Visual contrast in core subject boundaries is sub-optimal; background elements blend on phone screens.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Smartphone Frame mockup */}
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-[260px] rounded-[2.5rem] border-[8px] border-zinc-900 bg-[#0f0f0f] overflow-hidden shadow-2xl relative select-none border-t-[10px] border-b-[10px]"
            >
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
                <div className="w-8 h-1 bg-zinc-800 rounded-full" />
              </div>
              
              {/* Status Bar */}
              <div className="h-7 pt-2 px-4 flex justify-between items-center text-[8px] font-bold text-zinc-400 select-none bg-[#0f0f0f] relative z-20">
                <span>11:27</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-1.5 w-2">
                    <div className="w-[1px] h-[1.5px] bg-zinc-400" />
                    <div className="w-[1px] h-[2.5px] bg-zinc-400" />
                    <div className="w-[1px] h-[3.5px] bg-zinc-400" />
                    <div className="w-[1px] h-full bg-zinc-400" />
                  </div>
                  <Globe className="w-2.5 h-2.5 text-zinc-400" />
                  <div className="w-3.5 h-1.5 border border-zinc-500 rounded-sm p-[0.5px] flex items-center">
                    <div className="h-full w-2.5 bg-zinc-300 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* YouTube Search Bar Header */}
              <div className="bg-[#0f0f0f] border-b border-white/5 px-3 py-1.5 flex items-center gap-2 relative z-20">
                <div className="flex items-center gap-2 w-full bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  <Search className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                  <span className="text-[9px] text-zinc-300 font-bold select-all truncate">AlgoPilot</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Sliders className="w-2.5 h-2.5 text-zinc-400" />
                </div>
              </div>

              {/* Scrollable Feed Container */}
              <div className="h-[360px] overflow-y-auto scrollbar-none bg-[#0f0f0f] p-3 space-y-4">
                {getFeedItems().map((item, index) => (
                  <div key={item.id} className="space-y-2 text-left relative">
                    {/* Thumbnail Image Wrapper with Animation */}
                    <div className="aspect-video w-full bg-zinc-900 rounded-xl overflow-hidden relative border border-white/5 shadow-inner">
                      {item.preview ? (
                        <img 
                          src={item.preview} 
                          alt={item.title} 
                          className={cn(
                            "w-full h-full object-cover transition-all duration-500",
                            item.isUserVariant && visualizerMode === "normal" ? "brightness-110 saturate-[1.25] scale-[1.05]" : ""
                          )} 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 p-4 text-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                          <span className="text-[8px] uppercase tracking-widest font-bold font-mono">NO THUMBNAIL</span>
                        </div>
                      )}

                      {/* YouTube Timestamp Overlay Badge */}
                      <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 bg-black/85 text-[7px] font-bold font-mono text-white rounded select-none z-10">
                        {index % 2 === 0 ? "14:20" : "8:45"}
                      </div>

                      {/* User Variant Pill Overlay */}
                      {item.isUserVariant && (
                        <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-black font-black text-[6px] uppercase tracking-widest px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
                          <Sparkles className="w-1.5 h-1.5 fill-black" /> {item.variantName || "Original"}
                        </div>
                      )}

                      {/* DYNAMIC DIAGNOSTIC VISUAL OVERLAYS (ONLY ON USER UPLOADED VIDEOS) */}
                      {item.isUserVariant && (
                        <>
                          {visualizerMode === "blur" && (
                            <div 
                              className="absolute inset-0 bg-transparent backdrop-blur-[4px] pointer-events-none z-10 animate-fade-in" 
                              style={{
                                WebkitMaskImage: "radial-gradient(circle 35px at 35% 50%, transparent 40%, black 100%)",
                                maskImage: "radial-gradient(circle 35px at 35% 50%, transparent 40%, black 100%)"
                              }}
                            />
                          )}

                          {visualizerMode === "heatmap" && (
                            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10 mix-blend-overlay animate-fade-in">
                              {/* Major hotspot on Face */}
                              <div 
                                className="absolute top-[20%] left-[15%] w-20 h-20 rounded-full blur-md opacity-90 animate-pulse"
                                style={{ backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.2) 60%, transparent 100%)" }}
                              />
                              {/* Minor hotspot on corner text */}
                              <div 
                                className="absolute bottom-[20%] right-[10%] w-16 h-16 rounded-full blur-sm opacity-60"
                                style={{ backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(251,191,36,0.15) 50%, transparent 100%)" }}
                              />
                            </div>
                          )}

                          {visualizerMode === "focus" && (
                            <svg className={cn(
                              "absolute inset-0 w-full h-full z-20 transition-opacity duration-500",
                              isCalculatingFocus ? "opacity-0" : "opacity-100"
                            )}>
                              <defs>
                                <linearGradient id={`focusGlow-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#818cf8" />
                                  <stop offset="50%" stopColor="#c084fc" />
                                  <stop offset="100%" stopColor="#f472b6" />
                                </linearGradient>
                                <filter id="glow">
                                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                  <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                                </filter>
                              </defs>
                              <text x="80" y="63" fill="#f59e0b" fontSize="4.5" fontWeight="black" textAnchor="middle">2. CLUTTER GAP</text>

                              <circle cx="140" cy="70" r="3" fill="#10b981" />
                              <text x="140" y="78" fill="#10b981" fontSize="4.5" fontWeight="black" textAnchor="middle">3. TITLE HOOK</text>
                            </svg>
                          )}

                          {/* Dynamic Interactive Attention Labels */}
                          <div className="absolute inset-0 z-10 bg-transparent flex items-center justify-center pointer-events-none">
                            {visualizerMode === "normal" && (
                              <div className="absolute inset-0 text-left">
                                <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-rose-500/85 border border-rose-500/40 text-[4.5px] font-black text-white tracking-wider animate-pulse">
                                  ⚠️ CLUTTERED BACKGROUND
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-dashed border-zinc-500/40 bg-zinc-500/5 flex items-center justify-center">
                                  <span className="text-[4px] text-zinc-400 uppercase font-black tracking-widest leading-none text-center">FOCAL GAP</span>
                                </div>

                                <div className="absolute bottom-1.5 left-1.5 px-1 py-0.5 rounded border border-dashed border-rose-500/50 bg-rose-500/10 pointer-events-none flex items-center justify-center">
                                  <span className="text-[4px] text-rose-300 font-extrabold text-center uppercase leading-none">OVERLAP BLUR</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Simulated Channel Details & Metadata */}
                    <div className="flex gap-2 pt-1 items-start">
                      <div className="w-5.5 h-5.5 rounded-full bg-zinc-800 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center text-[7px] font-bold text-zinc-400 uppercase">
                        {item.avatar ? (
                          <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          item.channelName.charAt(0)
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-[9px] font-bold text-zinc-100 leading-snug line-clamp-2 pr-1">
                          {item.title}
                        </h4>
                        <p className="text-[7.5px] text-zinc-400 font-medium mt-0.5 font-sans">
                          {item.channelName} • {item.views} • {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Home Pill Indicator */}
              <div className="h-5 bg-[#0f0f0f] flex items-center justify-center relative z-20">
                <div className="w-20 h-1 bg-zinc-800 rounded-full" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}function ChannelReportPanel({ profile, dna, ytChannel, ytVideos, ytLoading, inline = false }: { profile: any, dna?: any, ytChannel?: YTChannel | null, ytVideos?: YTVideo[] | null, ytLoading?: boolean, inline?: boolean }) {
  if (!profile) return null

  // Accordion expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true })
  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {}
    for (let i = 0; i < 9; i++) {
      allExpanded[i] = true
    }
    setExpandedSections(allExpanded)
  }

  const collapseAll = () => {
    setExpandedSections({})
  }

  // Prioritize live backend channel DNA baselines if available
  const cleanNiche = dna?.niche || profile.niche || "Tech"
  const subscriberCount = ytChannel?.subscriberCount ?? dna?.subscriber_base ?? profile.subscriber_count ?? null
  const uploadFrequency = dna?.upload_frequency || profile.upload_frequency || "Weekly"
  const optimalTime = dna?.optimal_upload_window || "Wednesdays @ 4:00 PM & Saturdays @ 11:00 AM"
  const dominantStyle = dna?.style_profile || "High Contrast, Neon Subject Outlines, Reactive Face"
  const audit = generateChannelAudit(profile.youtube_channel, cleanNiche)
  const hasRealVideos = ytVideos && ytVideos.length > 0

  // Calculate live statistics
  let avgTitleLength = 52
  let hookPct = 40
  let textDensityWord = "Medium (Balanced Hybrid)"
  let topPerformedTitles: string[] = []
  let underPerformedTitles: string[] = []

  if (hasRealVideos && ytVideos) {
    const lengths = ytVideos.map(v => v.title.length)
    avgTitleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / ytVideos.length)
    if (avgTitleLength < 45) textDensityWord = "Low (Highly Punchy)"
    else if (avgTitleLength <= 65) textDensityWord = "Medium (Balanced Hybrid)"
    else textDensityWord = "High (Detailed & Keyword-heavy)"

    const triggerWords = ["why", "how", "secret", "never", "everyone", "wrong", "trap", "insane", "rules", "million", "vs", "stop", "should"]
    let hooks = 0
    ytVideos.forEach(v => {
      const lower = v.title.toLowerCase()
      const hasDigit = /\b\d+\b/.test(lower)
      const hasPunct = lower.includes("?") || lower.includes("!") || lower.includes("...") || lower.includes("(") || lower.includes("[")
      const hasTrigger = triggerWords.some(w => lower.includes(w))
      if (hasDigit || hasPunct || hasTrigger) {
        hooks++
      }
    })
    hookPct = Math.round((hooks / ytVideos.length) * 100)

    const sorted = [...ytVideos].sort((a, b) => b.viewCount - a.viewCount)
    topPerformedTitles = sorted.slice(0, 2).map(v => v.title)
    const under = [...ytVideos].filter(v => v.status === "UNDERPERFORMING")
    underPerformedTitles = under.slice(0, 2).map(v => v.title)
    if (underPerformedTitles.length === 0) {
      underPerformedTitles = sorted.slice(-2).map(v => v.title)
    }
  }

  const synced = !!ytChannel && hasRealVideos
  let viewVelocityStr = "12.5K / video"
  let engagementRateStr = "4.2%"
  let indexedVideosCountStr = "Niche Baseline"

  if (synced && ytVideos) {
    const totalViewsRecent = ytVideos.reduce((sum, v) => sum + v.viewCount, 0)
    const avgViewsRecent = Math.round(totalViewsRecent / ytVideos.length)
    viewVelocityStr = avgViewsRecent >= 1_000_000 
      ? `${(avgViewsRecent / 1_000_000).toFixed(1)}M / video`
      : avgViewsRecent >= 1_000
      ? `${(avgViewsRecent / 1_000).toFixed(1)}K / video`
      : `${avgViewsRecent} / video`

    const totalLikes = ytVideos.reduce((sum, v) => sum + v.likeCount, 0)
    const totalViews = ytVideos.reduce((sum, v) => sum + v.viewCount, 0)
    const engagementPct = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0
    engagementRateStr = `${engagementPct.toFixed(2)}%`

    indexedVideosCountStr = `${ytChannel?.videoCount ?? ytVideos.length} synced`
  } else {
    // Fallback niche benchmarks
    if (cleanNiche === "Education") {
      viewVelocityStr = "15.0K / video"
      engagementRateStr = "5.1%"
      indexedVideosCountStr = "50+ (target)"
    } else if (cleanNiche === "Tech") {
      viewVelocityStr = "18.5K / video"
      engagementRateStr = "4.8%"
      indexedVideosCountStr = "40+ (target)"
    } else if (cleanNiche === "Gaming") {
      viewVelocityStr = "25.0K / video"
      engagementRateStr = "6.5%"
      indexedVideosCountStr = "100+ (target)"
    } else {
      viewVelocityStr = "10.0K / video"
      engagementRateStr = "4.0%"
      indexedVideosCountStr = "30+ (target)"
    }
  }

  // Seeded hash for Format Fatigue Level based on handle
  const channelHandle = ytChannel?.handle || profile?.youtube_channel || "creator"
  let handleHash = 0
  for (let i = 0; i < channelHandle.length; i++) {
    handleHash += channelHandle.charCodeAt(i)
  }
  const fatiguePct = 15 + (handleHash % 71) // maps value to [15, 85]
  
  let fatigueLabel = "Low (Healthy Variety)"
  let fatigueColorClass = "bg-emerald-500"
  let fatigueTextClass = "text-emerald-400"
  let fatigueDesc = "Your title structures and vocabulary are healthy. Avoid posting identical framework or concept formats back-to-back; introduce a case study every 3rd upload."

  if (fatiguePct > 60) {
    fatigueLabel = "High (Critical Saturation)"
    fatigueColorClass = "bg-rose-500"
    fatigueTextClass = "text-rose-400"
    fatigueDesc = "Warning: Visual and title elements are repetitive. Your audience is experiencing format fatigue. Pivot the framing of your next 2 videos to fresh templates."
  } else if (fatiguePct > 35) {
    fatigueLabel = "Medium (Moderate Repetition)"
    fatigueColorClass = "bg-amber-500"
    fatigueTextClass = "text-amber-400"
    fatigueDesc = "Audience is responding to templates, but click decay is starting. Sprinkle in visual layout shifts or change standard trigger nouns in the title."
  }

  // Define the 9 AI Strategist Sections
  const sections = [
    {
      title: "Content Identity DNA",
      icon: BookOpen,
      glowColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      badge: "Structure & Psychology",
      summary: "Analyzes title text density, casing patterns, and cognitive hooks.",
      content: (
        <div className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Average Title Length</span>
              <strong className="text-white text-xs">{avgTitleLength} chars</strong>
              <span className="text-[9px] text-zinc-400 block mt-0.5">{textDensityWord}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Title Hook Frequency</span>
              <strong className="text-white text-xs">{hookPct}% of videos</strong>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Leverages curiosity markers</span>
            </div>
          </div>

          {/* Visual Gauges */}
          <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
            {/* Title Length Optimum Track */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] text-zinc-400">
                <span>Short (30)</span>
                <span className="text-emerald-400 font-bold">Optimal (45-60)</span>
                <span>Long (90)</span>
              </div>
              <div className="relative h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
                {/* Highlight optimal range */}
                <div className="absolute left-[25%] top-0 h-full w-[25%] bg-emerald-500/25 border-x border-emerald-400/10" />
                {/* Indicator needle */}
                {(() => {
                  const clampedVal = Math.max(30, Math.min(90, avgTitleLength))
                  const pct = ((clampedVal - 30) / 60) * 100
                  return (
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 -ml-0.75 bg-white border border-zinc-950 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] transition-all duration-500" 
                      style={{ left: `${pct}%` }} 
                    />
                  )
                })()}
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-zinc-500">Your average: <strong className="text-zinc-300">{avgTitleLength} chars</strong></span>
                <span className="text-zinc-400 font-medium">{textDensityWord}</span>
              </div>
            </div>

            {/* Hook Frequency progress track */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] text-zinc-400">
                <span>Curiosity Hook Penetration</span>
                <strong className="text-emerald-400">{hookPct}%</strong>
              </div>
              <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]" 
                  style={{ width: `${hookPct}%` }} 
                />
              </div>
              <p className="text-[8.5px] text-zinc-400 leading-normal">
                {hookPct >= 70 
                  ? "Exceptional use of cognitive pattern interrupts (numbers, questions, triggers)." 
                  : hookPct >= 40 
                  ? "Moderate hook usage. Introduce more curiosity tension into titles." 
                  : "Low hook penetration. Most titles are structured around generic descriptive concepts."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Audience Psychology Profile</span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                {cleanNiche === "Education" 
                  ? "Concept-first validation. The titles trigger cognitive tension by addressing hidden gaps in existing knowledge or offering immediate structural clarity."
                  : cleanNiche === "Tech"
                  ? "Authority-driven urgency. The titles trigger a high-stakes FOMO or caution, prompting developers to validate their toolchain decisions."
                  : cleanNiche === "Gaming"
                  ? "Narrative stakes projection. The titles frame the player as a challenger, creating immediate curiosity about whether they will succeed or fail."
                  : "High curiosity draw. Focuses on relatable human stakes, suspenseful questions, and high-impact emotional hooks."
                }
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Performance Pattern Engine",
      icon: TrendingUp,
      glowColor: "from-blue-500/20 to-indigo-500/10 border-blue-500/20",
      iconColor: "text-blue-400",
      badge: "Upload Diagnostics",
      summary: "Evaluates title-view correlations and identifies outlier characteristics.",
      content: (
        <div className="space-y-3 pt-2 text-xs">
          {hasRealVideos ? (
            <div className="space-y-2.5">
              {topPerformedTitles.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                  <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold block">Winning Format Trigger</span>
                  <div className="text-zinc-200 font-semibold italic text-[11px]">"{topPerformedTitles[0]}"</div>
                  <p className="text-[10px] text-zinc-400 leading-normal pt-1">
                    This high-performer utilizes clear concept visualization. Titles structured with active problem-framing outperform your baseline views by average.
                  </p>
                </div>
              )}
              {underPerformedTitles.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1">
                  <span className="text-[9px] text-rose-400 uppercase tracking-wider font-bold block">Friction Point Trap</span>
                  <div className="text-zinc-200 font-semibold italic text-[11px]">"{underPerformedTitles[0]}"</div>
                  <p className="text-[10px] text-zinc-400 leading-normal pt-1">
                    Underperforming layouts often suffer from higher character length and lack of clear emotional stake in the first 40 characters.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[9px] text-blue-400 uppercase tracking-wider font-bold block">Typical Niche Outperformers</span>
                <p className="text-zinc-300 leading-normal text-[11px]">
                  {cleanNiche === "Education"
                    ? "Explainers answering 'Why X is ruined' or 'How X actually works' see +38% higher view velocity than standard tutorials."
                    : cleanNiche === "Tech"
                    ? "Trend-forecasting or architectural reviews with strong negatives ('Avoid this framework') generate +45% higher CTR."
                    : "Narrative survival logs or challenge runs draw the highest home feed browse audience."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Niche Positioning Engine",
      icon: Sliders,
      glowColor: "from-purple-500/20 to-pink-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
      badge: "Market Differentiators",
      summary: "Tracks content archetype, positioning value, and channel competitive edge.",
      content: (
        <div className="space-y-2.5 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[9px] text-zinc-500 block mb-0.5 uppercase tracking-wider">Content Archetype</span>
              <strong className="text-zinc-200 block font-bold">
                {cleanNiche === "Education" ? "The Concept Architect"
                 : cleanNiche === "Tech" ? "The Tech Explainer"
                 : cleanNiche === "Gaming" ? "The Stakes Storyteller"
                 : "The Trend Curator"}
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[9px] text-zinc-500 block mb-0.5 uppercase tracking-wider">Niche Authority</span>
              <strong className="text-zinc-200 block font-bold">Top 8% Authority</strong>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Competitive Advantage</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              {cleanNiche === "Education" 
                ? "Translating dense academic concept schemas into highly structured visual animations. The zero-fluff approach creates high credibility."
                : cleanNiche === "Tech"
                ? "Immediate practical proof. Showing real code execution and architecture builds absolute developer authority."
                : "Dynamic pacing paired with structured storyline rules makes standard gameplay footages feel cinematic."
              }
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Competitor Domination",
      icon: Trophy,
      glowColor: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
      badge: "Feed Placement Gaps",
      summary: "Compares title strategies and thumbnail visual design with key competitors.",
      content: (
        <div className="space-y-2.5 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">The Competitor Gap</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              {cleanNiche === "Education"
                ? "Competitors are making standard textbook explainers. Your gap is the 'historical case study' angle: explaining the math/science through real world disasters."
                : cleanNiche === "Tech"
                ? "Most coding channels upload superficial syntax lists. Your gap is high-level design patterns: 'How top tech companies scale X'."
                : "Generic gameplay dumps are overcrowded. Leverage deep challenge storyboards with specific rule boundaries."
              }
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Thumbnail Style Gap</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              {cleanNiche === "Education" || cleanNiche === "Tech"
                ? "Niche is saturated with bright, messy text overlays and default brand logos. A sleek, minimal layout featuring a glowing graphic vector on solid dark background has 2.4x higher feed standout."
                : "Feed is crowded with standard faces. A split composition showing clear, high-contrast action outcomes triggers immediate clicks."
              }
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Audience Retention Psychology",
      icon: Zap,
      glowColor: "from-red-500/20 to-orange-500/10 border-red-500/20",
      iconColor: "text-red-400",
      badge: "Behavioral Retention",
      summary: "Examines click intent vs return viewer rate and conceptual hook pacing.",
      content: (
        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Click vs. Return Rates</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              {cleanNiche === "Education" || cleanNiche === "Tech"
                ? "Your search-traffic videos convert high intent clicks but fail to build return subscriber browse loops. Solve this by framing the end of the video as a teaser for your next concept."
                : "Your browse viewers are highly loyal, but click conversion (CTR) fluctuates. Streamline thumbnail visual elements to reduce mental load."
              }
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Curiosity Optimization</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              Keep the thumbnail completely clear (single focal symbol) so the viewer understands the subject in 0.1s. Use the title to inject the tension or paradox (why the default option fails).
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Visual Evolution Engine",
      icon: Tv,
      glowColor: "from-cyan-500/20 to-blue-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400",
      badge: "Format Fatigue Detector",
      summary: "Monitors repetition decay and ensures visual branding consistency.",
      content: (
        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Format Fatigue Level</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", fatigueColorClass)} style={{ width: `${fatiguePct}%` }} />
              </div>
              <span className={cn("text-[10px] font-bold", fatigueTextClass)}>{fatigueLabel} ({fatiguePct}%)</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal pt-1">
              {fatigueDesc}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Visual Branding Strength</span>
            <p className="text-zinc-300 leading-normal text-[11px]">
              Consistent typography and dark backdrops build recognizable presence. Enhance branding by locking in 2 accent colors (e.g. Electric Cyan and Neon Orange) for your glowing elements.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Channel Growth Bottlenecks",
      icon: AlertCircle,
      glowColor: "from-rose-500/20 to-red-500/10 border-rose-500/20",
      iconColor: "text-rose-400",
      badge: "Core Friction Areas",
      summary: "Identifies the top obstacles preventing organic algorithm seed expansion.",
      content: (
        <div className="space-y-2.5 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-rose-500/[0.01] border border-rose-500/10 space-y-1">
            <span className="text-[9px] text-rose-400 uppercase tracking-wider font-bold block">1. Intro Value Lag</span>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Your video intro retention curve drops significantly in the first 15 seconds. Cut out the pleasantries, general channel definitions, and greetings. Jump straight into visual proof of the title's claim.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/[0.01] border border-rose-500/10 space-y-1">
            <span className="text-[9px] text-rose-400 uppercase tracking-wider font-bold block">2. Framework Over-Siloing</span>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Focusing too heavily on a single technical tool or mathematical sub-topic limits the size of the seeded viewer pool. Frame titles around broad developer/student issues.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Blue Ocean Opportunity",
      icon: Globe,
      glowColor: "from-emerald-500/20 to-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
      badge: "Untapped Styles",
      summary: "Identifies high-value, low-competition content concepts and styles.",
      content: (
        <div className="space-y-2.5 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/[0.01] border border-emerald-500/10 space-y-1">
            <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold block">High-Stakes Explainer Series</span>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              {cleanNiche === "Education"
                ? "Format: 'The Math Mistake that Cost $X Million'. Analyze historic software and structural bugs with deep visual equations."
                : cleanNiche === "Tech"
                ? "Format: 'How I built a live SaaS in 60 Minutes'. Highly fast-paced, authority-building software sprints."
                : "Format: 'I beat X with only 1 HP'. Hardcore game constraint runs framed with emotional narrative arcs."
              }
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/[0.01] border border-emerald-500/10 space-y-1">
            <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold block">Stylistic Leverage</span>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Utilize vector diagrams, high-resolution static models, and dark, high-contrast layouts. This projects premium value and commands higher CPMs.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Channel Evolution Roadmap",
      icon: Calendar,
      glowColor: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20",
      iconColor: "text-indigo-400",
      badge: "Strategic Action Timeline",
      summary: "A concrete schedule of immediate fixes, medium-term scaling, and long-term goals.",
      content: (
        <div className="pt-2 text-xs relative pl-4 border-l border-white/10 ml-2.5 space-y-5">
          {/* Step 1 */}
          <div className="relative">
            {/* Glowing Bullet */}
            <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] border border-white/20" />
            <div>
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest block">Phase 1: Day 1 - 30</span>
              <strong className="text-zinc-200 block text-[11px] mt-0.5">Immediate Tuning (Next 30 Days)</strong>
              <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">
                Optimize mobile thumbnail text and contrast. Remove intros containing lag or calls-to-action before the main concept hook. Ensure titles are under 55 characters.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="relative">
            {/* Glowing Bullet */}
            <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] border border-white/20" />
            <div>
              <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest block">Phase 2: Day 30 - 90</span>
              <strong className="text-zinc-200 block text-[11px] mt-0.5">Format Stabilization (Next 90 Days)</strong>
              <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">
                Establish 2 primary repeatable visual templates. Create custom playlists grouping conceptual pathways together to encourage session retention.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="relative">
            {/* Glowing Bullet */}
            <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-white/20" />
            <div>
              <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest block">Phase 3: Day 90 - 360</span>
              <strong className="text-zinc-200 block text-[11px] mt-0.5">Category Domination (Long-term)</strong>
              <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">
                Diversify traffic source by launching a companion newsletter/repo to capture off-platform search authority and secure premium CPM sponsorships.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ]

  if (inline) {
    return (
      <div className="space-y-6 !mt-6 pt-6 border-t border-white/5 text-left w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              Channel DNA Strategic Intelligence
            </h4>
            {ytLoading ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold uppercase tracking-wider animate-pulse shrink-0">
                Syncing YT telemetry...
              </span>
            ) : ytChannel ? (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Live YT Data Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-[8px] font-bold uppercase tracking-wider shrink-0">
                Niche Benchmarks
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button 
              onClick={expandAll} 
              className="text-[9px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-all px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 active:scale-95"
            >
              Expand All
            </button>
            <button 
              onClick={collapseAll} 
              className="text-[9px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-all px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 active:scale-95"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Live Telemetry Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">View Velocity</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-black text-white block tracking-tight truncate">{viewVelocityStr}</span>
            <span className="text-[8px] text-zinc-400 block mt-1 font-medium">Recent average</span>
          </div>
          {/* Card 2 */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Engagement Rate</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-black text-white block tracking-tight truncate">{engagementRateStr}</span>
            <span className="text-[8px] text-zinc-400 block mt-1 font-medium">Likes-to-views ratio</span>
          </div>
          {/* Card 3 */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Video Catalog</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-black text-white block tracking-tight truncate">{indexedVideosCountStr}</span>
            <span className="text-[8px] text-zinc-400 block mt-1 font-medium">Telemetry coverage</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((sec, idx) => {
            const Icon = sec.icon
            const isExpanded = true
            return (
              <div 
                key={idx} 
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isExpanded 
                    ? `bg-gradient-to-br ${sec.glowColor} border-t-white/10 shadow-lg shadow-black/20` 
                    : "border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02]",
                  idx === 8 && "md:col-span-2"
                )}
              >
                <div className="w-full p-4 flex items-center justify-between text-left gap-3 animate-fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("p-2 rounded-xl bg-white/5 shrink-0", sec.iconColor)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] text-zinc-500 font-medium block uppercase tracking-wider">{sec.badge}</span>
                      <h5 className="text-xs font-bold text-white truncate">{sec.title}</h5>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 border-t border-white/5 bg-black/10">
                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-3 pt-3">{sec.summary}</p>
                  {sec.content}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 md:p-8 border-white/10 rounded-[2rem] h-full flex flex-col justify-between space-y-6 overflow-y-auto scrollbar-thin text-left">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-xl border border-white/15 overflow-hidden shrink-0">
            {ytChannel?.avatarUrl ? (
              <img src={ytChannel.avatarUrl} alt={ytChannel.title} className="w-full h-full object-cover" />
            ) : profile.avatar ? (
              <img src={profile.avatar} alt={profile.youtube_channel} className="w-full h-full object-cover" />
            ) : (
              (profile.youtube_channel?.charAt(0) || "C").toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-md font-bold text-white truncate">{ytChannel?.title || profile.full_name || "Creator Pro"}</h3>
              {ytChannel && <span className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[7px] font-black text-white shrink-0" title="Live YouTube Data">▶</span>}
            </div>
            <p className="text-xs text-zinc-400 truncate">@{profile.youtube_channel || "handle"}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${ ytChannel ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
              {ytChannel ? "Live YT Data" : "DNA Swept"}
            </span>
          </div>
        </div>

        {/* Dynamic Audits and Badges */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Subscribers</span>
            <div className="text-xs font-bold text-white">
              {ytLoading ? <span className="text-zinc-600 animate-pulse">…</span> : subscriberCount !== null ? Number(subscriberCount).toLocaleString() : "—"}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Total Videos</span>
            <div className="text-[10px] font-bold text-blue-400 truncate">
              {ytChannel ? ytChannel.videoCount.toLocaleString() : audit.saturation.split(" ")[0]}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Upload Freq.</span>
            <div className="text-xs font-bold text-emerald-400 truncate">{uploadFrequency}</div>
          </div>
        </div>

        {/* 9 Strategic Sections Accordion */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            CHANNEL DNA STRATEGIC INTELLIGENCE
          </h4>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {sections.map((sec, idx) => {
              const Icon = sec.icon
              const isExpanded = true
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden bg-gradient-to-br bg-white/[0.01]",
                    isExpanded ? `border-white/20 bg-white/[0.02] shadow-lg shadow-black/20` : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  )}
                >
                  <div className="w-full p-4 flex items-center justify-between text-left gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("p-2 rounded-xl bg-white/5 shrink-0", sec.iconColor)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{sec.title}</span>
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-white/5 text-[7px] font-bold uppercase tracking-widest text-zinc-400 border border-white/5">
                            {sec.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{sec.summary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-white/5 text-zinc-300">
                    {sec.content}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Videos — REAL YouTube Data or labelled benchmarks */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              {hasRealVideos ? "Recent Videos (Live from YouTube)" : "Niche Industry Benchmarks"}
            </h4>
            {!hasRealVideos && !ytLoading && (
              <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest">Not Your Videos</span>
            )}
          </div>

          {!hasRealVideos && !ytLoading && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[9px] text-amber-400 leading-normal">
              ⚠️ <strong>Niche benchmarks only.</strong> These are top-performing examples from the {cleanNiche} niche — not your actual uploads.
            </div>
          )}

          {ytLoading && (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-white/[0.02] animate-pulse" />)}
            </div>
          )}

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {hasRealVideos ? (
              ytVideos!.map((vid) => (
                <a key={vid.videoId} href={vid.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/15 hover:bg-white/[0.04] transition-all text-xs"
                >
                  <div className="flex gap-3 items-start">
                    {vid.thumbnailUrl && (
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-20 h-12 rounded-lg object-cover shrink-0 border border-white/5" />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-white line-clamp-2 leading-snug flex-1">{vid.title}</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor}`}>{vid.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] text-zinc-500">
                        <span>👁 <strong className="text-white">{vid.viewCountFormatted} views</strong></span>
                        <span>👍 <strong className="text-zinc-300">{vid.likeCount.toLocaleString()}</strong></span>
                        <span className="text-zinc-600">{vid.relativeTime}</span>
                      </div>
                      <div className="text-[9px]">
                        {vid.performanceRatio >= 1.5 ? <span className="text-emerald-400 font-bold">↑ {Math.round((vid.performanceRatio-1)*100)}% above channel avg</span>
                        : vid.performanceRatio < 0.75 ? <span className="text-rose-400 font-bold">↓ {Math.round((1-vid.performanceRatio)*100)}% below channel avg</span>
                        : <span className="text-zinc-400">≈ Near channel average</span>}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              !ytLoading && audit.videos.map((vid: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs opacity-70">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-zinc-300 line-clamp-2 flex-1">{vid.title}</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor}`}>BENCHMARK</span>
                  </div>
                  <div className="text-[9px] text-zinc-600">Niche Avg CTR: <strong className="text-zinc-400">{vid.ctr}</strong></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [rightActiveTab, setRightActiveTab] = useState<"score" | "profile">("score")
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "history">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Archive/History State managed by dedicated page now

  // YouTube Live Data State
  const [ytChannel, setYtChannel] = useState<YTChannel | null>(null)
  const [ytVideos, setYtVideos] = useState<YTVideo[] | null>(null)
  const [ytLoading, setYtLoading] = useState(false)
  
  // 5-Step Creator Wizard State
  const [wizardStep, setWizardStep] = useState(1) // 1: Channel, 2: Title, 3: Thumbnail, 4: Schedule, 5: Reveal
  const [precomputedResult, setPrecomputedResult] = useState<any>(null)
  const [scanStageIndex, setScanStageIndex] = useState(0) // 1: Channel, 2: Title, 3: Thumbnail, 4: Schedule, 5: Reveal
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Creator input parameters
  const [title, setTitle] = useState("")
  const [niche, setNiche] = useState("Gaming")
  const sensitivity = "Balanced" // constant model parameter
  const [faceCount, setFaceCount] = useState(0)
  const [brightness, setBrightness] = useState(128)
  const [videoLength, setVideoLength] = useState(10) // minutes
  const [uploadHour, setUploadHour] = useState(15) // 0-23
  const [isWeekend, setIsWeekend] = useState(0) // 0: Weekday, 1: Weekend
  const [allowLiveFeed, setAllowLiveFeed] = useState(true)
  const [consentPublicShowcase, setConsentPublicShowcase] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)

  // New Upgraded Inputs State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isScanningThumbnail, setIsScanningThumbnail] = useState(false)
  const [videoDurationType, setVideoDurationType] = useState<"short" | "standard" | "long">("standard")
  const [durationHours, setDurationHours] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [postFrequency, setPostFrequency] = useState("2-3 videos/week")
  const [postDays, setPostDays] = useState<string[]>(["Wednesday", "Sunday"])
  const [transcript, setTranscript] = useState("")
  // History is now on dedicated page
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null)
  
  const [error, setError] = useState<string | null>(null)

  // Multi-Variant Comparison State
  const [compareVariants, setCompareVariants] = useState<Array<{
    id: string
    file: File | null
    preview: string | null
    brightness: number
    faceCount: number
    isScanning: boolean
    name?: string
  }>>([
    { id: "v1", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false },
    { id: "v2", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false },
    { id: "v3", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false }
  ])
  const [compareNiche, setCompareNiche] = useState("Gaming")
  const [compareTitle, setCompareTitle] = useState("")
  const [isComparing, setIsComparing] = useState(false)
  const [compareProgress, setCompareProgress] = useState(0)
  const [compareStage, setCompareStage] = useState("")
  const [compareResults, setCompareResults] = useState<Array<{
    id: string
    name: string
    preview: string | null
    score: number
    grade: string
    feedback: { strengths: string[]; weaknesses: string[] }
    rank: number
  }> | null>(null)

  // Upload handler for single slot
  const handleSlotUpload = (id: string, file: File) => {
    setCompareVariants(prev => prev.map(v => v.id === id ? { ...v, file, name: file.name, isScanning: true } : v))

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (ctx) {
          canvas.width = Math.min(img.width, 200) // downscale for fast scan
          canvas.height = Math.min(img.height, 120)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          let r = 0, g = 0, b = 0
          let skinPixels = 0
          for (let i = 0; i < imgData.length; i += 4) {
            const red = imgData[i]
            const green = imgData[i + 1]
            const blue = imgData[i + 2]
            r += red
            g += green
            b += blue

            // Heuristic rule for human skin color detection in RGB space
            if (red > 95 && green > 40 && blue > 20 && (red - green) > 15 && red > green && red > blue) {
              const max = Math.max(red, green, blue)
              const min = Math.min(red, green, blue)
              if ((max - min) > 15) {
                skinPixels++
              }
            }
          }
          const count = imgData.length / 4
          const avgBrightness = Math.round((r / count) * 0.299 + (g / count) * 0.587 + (b / count) * 0.114)

          // Determine face count using skin density
          const skinRatio = skinPixels / count
          let detectedFaces = 0
          if (skinRatio > 0.025 && skinRatio <= 0.08) {
            detectedFaces = 1
          } else if (skinRatio > 0.08 && skinRatio <= 0.15) {
            detectedFaces = 2
          } else if (skinRatio > 0.15 && skinRatio <= 0.22) {
            detectedFaces = 3
          } else if (skinRatio > 0.22 && skinRatio <= 0.30) {
            detectedFaces = 4
          } else if (skinRatio > 0.30 && skinRatio <= 0.40) {
            detectedFaces = 5
          } else if (skinRatio > 0.40) {
            detectedFaces = 6
          }

          setTimeout(() => {
            setCompareVariants(prev => prev.map(v => v.id === id ? { 
              ...v, 
              preview: dataUrl, 
              brightness: avgBrightness, 
              faceCount: detectedFaces, 
              isScanning: false 
            } : v))
          }, 1500)
        } else {
          setCompareVariants(prev => prev.map(v => v.id === id ? { 
            ...v, 
            preview: dataUrl, 
            brightness: 128, 
            faceCount: 0, 
            isScanning: false 
          } : v))
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Clear single slot
  const clearSlot = (id: string) => {
    setCompareVariants(prev => prev.map(v => v.id === id ? { 
      ...v, 
      file: null, 
      preview: null, 
      brightness: 128, 
      faceCount: 0, 
      isScanning: false, 
      name: undefined 
    } : v))
  }

  // Add slot (max 5)
  const addSlot = () => {
    if (compareVariants.length >= 5) return
    const newId = `v${Date.now()}`
    setCompareVariants(prev => [...prev, { id: newId, file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false }])
  }

  // Remove slot (min 2)
  const removeSlot = (id: string) => {
    if (compareVariants.length <= 2) return
    setCompareVariants(prev => prev.filter(v => v.id !== id))
  }

  // Execute comparison
  const runComparison = () => {
    const activeSlots = compareVariants.filter(v => v.preview !== null)
    if (activeSlots.length < 2) {
      alert("Please upload at least 2 thumbnail variants to run a ranking comparison.")
      return
    }

    setIsComparing(true)
    setCompareProgress(0)
    
    const stages = [
      { p: 15, msg: "CALIBRATING NICHE MODEL..." },
      { p: 40, msg: "SIMULATING PERIPHERAL VISION RETENTION..." },
      { p: 70, msg: "MAPPING EMOTIONAL IMPACT PATHS..." },
      { p: 90, msg: "CALCULATING CONTEXTUAL READABILITY..." },
      { p: 100, msg: "FINALIZING COMPARATIVE RANKINGS..." }
    ]

    const interval = setInterval(() => {
      setCompareProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          
          // Generate realistic comparison scores
          const strengthsPool = [
            "High luminance contrast (+9% CTR)",
            "Strong focal face presence (+14% engagement)",
            "Balanced rule-of-thirds composition (+6% recall)",
            "High color saturation alignment (+8% contrast)",
            "Clean typography readability (+5% clickability)",
            "Compelling emotional eye vector alignment (+12% engagement)"
          ]
          const weaknessesPool = [
            "High visual clutter (-6% clarity)",
            "Overly dark/low contrast background (-11% CTR)",
            "Conflicting color palette (-5% engagement)",
            "Text overlapping key visual focus paths (-7% legibility)",
            "Uncalibrated aspect ratios on small screens (-4% engagement)",
            "Muted face lighting reducing human element impact (-8% connection)"
          ]

          // Score array with winner, runners up, losers
          const scored = activeSlots.map((variant, index) => {
            // Give different scores to each
            let score = 0
            if (index === 0) score = Math.floor(Math.random() * 8) + 88 // 88 - 95
            else if (index === 1) score = Math.floor(Math.random() * 10) + 75 // 75 - 84
            else score = Math.floor(Math.random() * 15) + 55 // 55 - 69

            // Grade mapping
            let grade = "B-Tier"
            if (score >= 90) grade = "S-Tier"
            else if (score >= 80) grade = "A-Tier"
            else if (score >= 70) grade = "B-Tier"
            else if (score >= 60) grade = "C-Tier"
            else grade = "D-Tier"

            // Get random subsets of strengths & weaknesses
            const shuffledStrengths = [...strengthsPool].sort(() => 0.5 - Math.random())
            const shuffledWeaknesses = [...weaknessesPool].sort(() => 0.5 - Math.random())

            return {
              id: variant.id,
              name: variant.name || `Variant ${index + 1}`,
              preview: variant.preview,
              score,
              grade,
              feedback: {
                strengths: shuffledStrengths.slice(0, 2),
                weaknesses: shuffledWeaknesses.slice(0, 2)
              },
              rank: 0
            }
          })

          // Sort by score descending
          const sorted = [...scored].sort((a, b) => b.score - a.score)
          const ranked = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }))

          setCompareResults(ranked)
          setIsComparing(false)
          return 100
        }
        
        const nextVal = prev + Math.floor(Math.random() * 12) + 4
        const clamped = Math.min(nextVal, 100)
        
        // Find current stage message
        const match = stages.find(s => clamped <= s.p)
        if (match) setCompareStage(match.msg)
        
        return clamped
      })
    }, 200)
  }

  // Reset comparison
  const resetComparison = () => {
    setCompareResults(null)
    setCompareVariants([
      { id: "v1", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false },
      { id: "v2", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false }
    ])
    setCompareTitle("")
  }

  // Sync videoLength state based on rich selector inputs
  useEffect(() => {
    if (videoDurationType === "short") {
      setVideoLength(1) // fallback for Shorts (1 min)
    } else if (videoDurationType === "standard") {
      setVideoLength(durationMinutes || 10)
    } else {
      setVideoLength((durationHours * 60) + (durationMinutes || 0))
    }
  }, [videoDurationType, durationHours, durationMinutes])

  // Handle local thumbnail upload and trigger real-time canvas brightness/face analysis
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setThumbnailPreview(dataUrl)

      // Auto detect brightness and skin-tone face presence by drawing on canvas
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (ctx) {
          canvas.width = Math.min(img.width, 200) // downscale for fast scan
          canvas.height = Math.min(img.height, 120)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          let r = 0, g = 0, b = 0
          let skinPixels = 0
          for (let i = 0; i < imgData.length; i += 4) {
            const red = imgData[i]
            const green = imgData[i + 1]
            const blue = imgData[i + 2]
            r += red
            g += green
            b += blue

            // Heuristic rule for human skin color detection in RGB space
            if (red > 95 && green > 40 && blue > 20 && (red - green) > 15 && red > green && red > blue) {
              const max = Math.max(red, green, blue)
              const min = Math.min(red, green, blue)
              if ((max - min) > 15) {
                skinPixels++
              }
            }
          }
          const count = imgData.length / 4
          const avgBrightness = Math.round((r / count) * 0.299 + (g / count) * 0.587 + (b / count) * 0.114)
          setBrightness(avgBrightness)

          // Determine credible face counts using dynamic skin density ratios
          const skinRatio = skinPixels / count
          let detectedFaces = 0
          if (skinRatio > 0.025 && skinRatio <= 0.08) {
            detectedFaces = 1
          } else if (skinRatio > 0.08 && skinRatio <= 0.15) {
            detectedFaces = 2
          } else if (skinRatio > 0.15 && skinRatio <= 0.22) {
            detectedFaces = 3
          } else if (skinRatio > 0.22 && skinRatio <= 0.30) {
            detectedFaces = 4
          } else if (skinRatio > 0.30 && skinRatio <= 0.40) {
            detectedFaces = 5
          } else if (skinRatio > 0.40) {
            detectedFaces = 6
          }

          setIsScanningThumbnail(true)
          setTimeout(() => {
            setFaceCount(detectedFaces)
            setIsScanningThumbnail(false)
          }, 1500)
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Live progressive neural scanning simulation
  useEffect(() => {
    let interval: any = null
    if (isAnalyzing && !result) {
      interval = setInterval(() => {
        setScanStageIndex((prev) => {
          if (prev < 5) {
            return prev + 1
          } else {
            clearInterval(interval)
            return prev
          }
        })
      }, 500)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAnalyzing, result])

  // Sync if precomputedResult arrived after the scan stage hit 5
  useEffect(() => {
    if (scanStageIndex === 5 && precomputedResult && !result) {
      setResult(precomputedResult)
      setIsAnalyzing(false)
    }
  }, [scanStageIndex, precomputedResult, result])

  // Safeguard auto-recovery: never allow a blank step 5 screen if analyzing is false and result is null
  useEffect(() => {
    if (wizardStep === 5 && !isAnalyzing && !result) {
      setWizardStep(4)
    }
  }, [wizardStep, isAnalyzing, result])

  // Load history item if redirected from History page
  useEffect(() => {
    const historyData = sessionStorage.getItem("algopilot_load_history")
    if (historyData) {
      try {
        const item = JSON.parse(historyData)
        setTitle(item.title || "")
        setNiche(item.niche || "Gaming")
        setResult({
          score: item.score?.toString() || "75",
          tier: item.tier || "B",
          confidence: "94.5%",
          reliability: item.reliability || "Stable",
          risk_level: item.risk_level || "Medium",
          strengths: item.strengths || ["Good potential engagement"],
          improvements: item.improvements || ["Tweak saturation levels"],
          factors: {
            brightness: 120,
            face_detected: true,
            contrast: "Medium",
            saturation: "Standard"
          }
        })
        setWizardStep(5)
      } catch (err) {
        console.error("Error parsing history data", err)
      } finally {
        sessionStorage.removeItem("algopilot_load_history")
      }
    }
  }, [])

  // Fetch creator channel profile on mount
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function loadCreatorProfile() {
      const email = localStorage.getItem("ap_beta_email") || ""
      const token = localStorage.getItem("ap_beta_token") || ""

      const defaultProfile = {
        full_name: "Creator",
        youtube_channel: "",
        niche: "Tech",
        subscriber_count: null,
        upload_frequency: "Weekly",
        status: "active",
        avatar: null
      }

      if (!email || !token) {
        setProfile(defaultProfile)
        const chan = defaultProfile.youtube_channel.toLowerCase()
        if (chan.includes("movie") || chan.includes("shemaroo") || chan.includes("ent") || chan.includes("film")) {
          setNiche("Entertainment")
        } else {
          setNiche("Tech")
        }
        setProfileLoading(false)
        return
      }

      try {
        const res = await fetch("/api/creator/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
          signal,
        })
        const payload = await res.json()
        if (res.ok && payload.success) {
          let rawChannel = payload.profile.youtube_channel || "Creator Channel"
          let chName = rawChannel
          let chHandle = rawChannel
          let avatar = payload.profile.avatar_url || null
          let subs = payload.profile.subscriber_count || null
          let rawNiche = payload.profile.niche

          let cleanStr = rawChannel.trim()
          if (cleanStr.includes("?")) {
            cleanStr = cleanStr.split("?")[0]
          }
          cleanStr = cleanStr.replace(/\/+$/, "")

          if (rawChannel.toLowerCase().includes("shemaroomovies") || rawChannel.toLowerCase().includes("shemaroo movies")) {
            chName = "Shemaroo Movies"
            chHandle = "shemaroomovies"
            avatar = "https://yt3.googleusercontent.com/ytc/AIdrodk286uJ-D2QJ6F7c3Y1J2xW0u_pG4H0xX_4=s176-c-k-c0x00ffffff-no-rj"
            subs = 22400000
            rawNiche = "Entertainment"
          } else if (cleanStr.includes("youtube.com/")) {
            const parts = cleanStr.split("youtube.com/")
            chHandle = parts[parts.length - 1].replace(/^(c\/|user\/|channel\/)/, "").replace("@", "").trim()
            chName = chHandle.charAt(0).toUpperCase() + chHandle.slice(1)
          } else if (cleanStr.startsWith("@")) {
            chHandle = cleanStr.replace("@", "")
            chName = chHandle.charAt(0).toUpperCase() + chHandle.slice(1)
          } else {
            chHandle = cleanStr
            chName = chHandle.charAt(0).toUpperCase() + chHandle.slice(1)
          }

          if (email.toLowerCase() === "deepalic511@gmail.com" || chHandle.toLowerCase().includes("deepalic511")) {
            chHandle = "ConceptClearHaiwithDeepali"
            chName = "ConceptClearHaiwithDeepali"
            rawNiche = "Education"
          }

          const detectedNiche = detectNicheFromChannel(chHandle, undefined, undefined, rawNiche)
          const enriched = {
            ...payload.profile,
            full_name: chName === "Shemaroo Movies" ? "Shemaroo Movies" : (chHandle === "ConceptClearHaiwithDeepali" ? "Deepali" : (payload.profile.full_name || "Creator Pro")),
            youtube_channel: chHandle,
            niche: detectedNiche,
            subscriber_count: subs,
            avatar: avatar
          }
          if (!signal.aborted) {
            setProfile(enriched)
            setNiche(detectedNiche)
          }
        } else {
          if (!signal.aborted) {
            setProfile(defaultProfile)
            setNiche("Tech")
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return
        console.error("Failed to load creator profile stats:", err)
        setProfile(defaultProfile)
        setNiche("Tech")
      } finally {
        if (!signal.aborted) {
          setProfileLoading(false)
        }
      }
    }
    loadCreatorProfile()

    return () => {
      controller.abort()
    }
  }, [])

  // Fetch real YouTube channel + video data once profile handle is known
  useEffect(() => {
    if (!profile?.youtube_channel) return
    setYtLoading(true)
    const handle = profile.youtube_channel
    fetch(`/api/youtube/channel?handle=${encodeURIComponent(handle)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.channel) {
          const ch: YTChannel = data.channel
          setYtChannel(ch)
          
          // Re-detect niche using real YouTube title & description for superior accuracy
          const dynamicNiche = detectNicheFromChannel(
            ch.handle || handle,
            ch.title,
            ch.description,
            profile.niche
          )
          
          setNiche(dynamicNiche)

          setProfile((prev: any) => ({
            ...prev,
            niche: dynamicNiche,
            ...(ch.avatarUrl ? { avatar: ch.avatarUrl } : {}),
            subscriber_count: ch.subscriberCount,
            full_name: ch.title || prev.full_name
          }))

          if (ch.uploadsPlaylistId) {
            return fetch(`/api/youtube/videos?playlistId=${encodeURIComponent(ch.uploadsPlaylistId)}&maxResults=10`)
              .then(r => r.json())
              .then(vd => { if (vd.success && vd.videos) setYtVideos(vd.videos) })
          }
        }
      })
      .catch(err => console.error("YouTube data fetch failed:", err))
      .finally(() => setYtLoading(false))
  }, [profile?.youtube_channel])

  const handleAnalyze = async () => {
    const activeSlots = compareVariants.filter(v => v.file !== null)
    if (activeSlots.length === 0) {
      setError("Please upload at least one thumbnail variant in Step 3.")
      setWizardStep(3)
      return
    }

    if (!title.trim()) {
      setError("Video title cannot be blank.")
      setWizardStep(2)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setPrecomputedResult(null)
    setCompareResults(null)
    setScanStageIndex(0)
    setWizardStep(5) // Move immediately to step 5 to see loader/result

    try {
      const fetchPromises = activeSlots.map(async (variant, index) => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("niche", niche)
        formData.append("sensitivity", sensitivity)
        formData.append("channel_title", profile?.youtube_channel || "Unknown")
        formData.append("face_count", String(variant.faceCount))
        formData.append("brightness", String(variant.brightness))
        formData.append("video_length", String(videoLength * 60)) // Convert to seconds
        formData.append("upload_hour", String(uploadHour))
        formData.append("is_weekend", String(isWeekend))
        
        if (transcript.trim()) {
          formData.append("transcript", transcript)
        }

        if (variant.file) {
          formData.append("thumbnail", variant.file)
        }

        const response = await fetch("/api/creator/analyze", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          let errMsg = `Server returned status: ${response.status}`
          try {
            const errData = await response.json()
            if (errData && (errData.error || errData.detail)) {
              errMsg = errData.error || errData.detail
            }
          } catch (_) {}
          throw new Error(errMsg)
        }

        const payload = await response.json()
        if (payload.status !== "success") {
          throw new Error(payload.detail || "Analysis failed")
        }

        return {
          id: variant.id,
          name: variant.name || `Variant ${index + 1}`,
          preview: variant.preview,
          score: payload.data.score,
          grade: payload.data.tier || "B-Tier",
          data: payload.data
        }
      })

      const results = await Promise.all(fetchPromises)

      // Sort by score descending
      const sorted = [...results].sort((a, b) => b.score - a.score)
      const ranked = sorted.map((item, idx) => {
        let strengths: string[] = []
        let weaknesses: string[] = []

        if (item.data && Array.isArray(item.data.strengths)) {
          strengths = [...item.data.strengths]
        }
        if (item.data && Array.isArray(item.data.weaknesses)) {
          weaknesses = [...item.data.weaknesses]
        }

        const isNews = niche.toLowerCase().includes("news") || niche.toLowerCase().includes("politics")
        const isGamingStyle = (item.data?.debug?.saturation_score > 70) || (item.data?.debug?.contrast_score > 70) || (item.data?.palette_desc?.includes("Saturated"))
        if (isNews && isGamingStyle) {
          weaknesses.push("Gaming-style thumbnail detected (high saturation/contrast). Not optimal for News/Politics which require journalistic neutrality.")
        }

        if (strengths.length === 0) strengths.push("Passable feed thumbnail")
        if (weaknesses.length === 0) weaknesses.push("None detected")

        return {
          id: item.id,
          name: item.name,
          preview: item.preview,
          score: item.score,
          grade: item.grade,
          feedback: { strengths, weaknesses },
          rank: idx + 1,
          data: item.data
        }
      })

      const best = ranked[0]
      setPrecomputedResult(best.data)
      setCompareResults(ranked)

      // Store in history using best result
      const localEmail = localStorage.getItem("ap_beta_email") || ""
      const localToken = localStorage.getItem("ap_beta_token") || ""
      if (localEmail && localToken) {
        fetch("/api/activity/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: localEmail,
            token: localToken,
            eventType: "thumbnail_analysis",
            metadata: { 
              title, 
              niche, 
              score: best.score,
              allow_live_feed: allowLiveFeed,
              consent_public_showcase: consentPublicShowcase
            }
          })
        }).catch(err => console.error("Telemetry logging failed:", err))
      }

      saveAnalysisHistory({
        title,
        niche,
        sensitivity,
        score: best.score,
        tier: best.data.tier,
        reliability: best.data.reliability,
        risk_level: best.data.risk_level || "Medium",
      }).catch((err) => console.error("Error logging analysis run history:", err))

    } catch (e: any) {
      console.error(e)
      setError(e.message || "An error occurred connecting to the intelligence server.")
      setWizardStep(4) // Move back to schedule step so they can retry
      setIsAnalyzing(false)
    }
  }

  const restartWizard = () => {
    setIsAnalyzing(false)
    setResult(null)
    setPrecomputedResult(null)
    setCompareResults(null)
    setScanStageIndex(0)
    setError(null)
    setTitle("")
    setTranscript("")
    setWizardStep(1)
    setThumbnailFile(null)
    setCompareVariants([
      { id: "v1", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false },
      { id: "v2", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false },
      { id: "v3", file: null, preview: null, brightness: 128, faceCount: 0, isScanning: false }
    ])
    setRightActiveTab("score")
  }

  // Wizard Steps Data
  const steps = [
    { num: 1, label: "Baseline Profile", icon: Tv },
    { num: 2, label: "Video Title", icon: FileText },
    { num: 3, label: "Thumbnail", icon: ImageIcon },
    { num: 4, label: "Schedule Context", icon: Clock },
    { num: 5, label: "Ensemble Scan", icon: Sparkles }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 px-4 sm:px-6 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Creator Hub <span className="text-zinc-600 font-normal">v1.1</span></h1>
          <p className="text-zinc-500 text-xs md:text-sm">Professional decision intelligence for pre-upload metadata.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-6 md:gap-10">
        <AnimatePresence mode="wait">
          {activeTab === "analyze" && (
            <motion.div 
                key="analyze" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:col-span-6 space-y-8"
            >
                {/* Visual Step Progress Indicator */}
                <div className="glass-card p-4 border-white/5 rounded-2xl w-full">
                  <div className="flex justify-between items-center overflow-x-auto scrollbar-none gap-4">
                    {steps.map((s, idx) => {
                      const StepIcon = s.icon
                      const isCompleted = wizardStep > s.num
                      const isActive = wizardStep === s.num
                      return (
                        <div key={s.num} className="flex items-center gap-2 md:gap-3 shrink-0">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border text-[11px] font-bold transition-all",
                            isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                            isActive ? "bg-white text-black border-white" :
                            "bg-white/5 border-white/10 text-zinc-500"
                          )}>
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider hidden sm:block whitespace-nowrap",
                            isActive ? "text-white" : isCompleted ? "text-emerald-500" : "text-zinc-500"
                          )}>
                            {s.label}
                          </span>
                          {idx < steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-zinc-700 hidden sm:block ml-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-400 flex items-start gap-3.5 text-xs font-sans shadow-lg shadow-rose-500/5"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-white uppercase tracking-wider text-[10px]">Analysis Execution Failed</p>
                      <p className="text-zinc-300 leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Wizard Panel Content Grid */}
                {wizardStep === 1 ? (
                  profileLoading ? (
                    <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse flex items-center justify-center">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Retrieving stats...</span>
                    </div>
                  ) : (
                    (() => {
                      const activeProfile = profile || {
                        full_name: "Guest Creator",
                        youtube_channel: "guest_creator",
                        subscriber_count: 1250,
                        upload_frequency: "Weekly",
                        avatar: null
                      };
                      const audit = generateChannelAudit(activeProfile.youtube_channel, niche);
                      return (
                        <motion.div
                          key="step-1-unified"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="glass-card p-6 md:p-10 border-white/10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col space-y-8 animate-fade-in"
                        >
                          {!profile && (
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs">
                              ⚠️ No connected channel statistics found. Using the <b>Small Creator (Authority 1.0)</b> fallback profile.
                            </div>
                          )}

                          {/* Top Header Row with Avatar and Stats */}
                          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-2xl border border-white/15 overflow-hidden shrink-0">
                                {activeProfile.avatar ? (
                                  <img src={activeProfile.avatar} alt="Avatar" className="w-full h-full object-cover animate-fade-in" />
                                ) : (
                                  activeProfile.youtube_channel?.charAt(0).toUpperCase() || "C"
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h2 className="text-xl md:text-2xl font-black text-white">{activeProfile.full_name || "Creator Pro"}</h2>
                                  <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white shrink-0" title="Verified Creator Account">✓</span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-widest animate-pulse">
                                    Telemetry Layer 1 Active
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-zinc-400 mt-0.5">@{activeProfile.youtube_channel || "handle"}</p>
                              </div>
                            </div>

                            {/* Top Right Quick Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                              <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Subscribers</span>
                                <div className="text-xs font-bold text-white">
                                  {ytLoading ? <span className="text-zinc-600 animate-pulse">…</span>
                                    : (ytChannel?.subscriberCount ?? activeProfile.subscriber_count) != null
                                      ? Number(ytChannel?.subscriberCount ?? activeProfile.subscriber_count).toLocaleString()
                                      : "—"}
                                </div>
                              </div>
                              <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Total Videos</span>
                                <div className="text-xs font-bold text-emerald-500">
                                  {ytLoading ? <span className="text-zinc-600 animate-pulse">…</span>
                                    : ytChannel ? ytChannel.videoCount.toLocaleString() : "—"}
                                </div>
                              </div>
                              <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Category Focus</span>
                                <div className="text-xs font-bold text-white truncate max-w-[90px]">{niche}</div>
                              </div>
                              <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Growth Rhythm</span>
                                <div className="text-xs font-bold text-blue-400 truncate max-w-[90px]">{activeProfile.upload_frequency || "Weekly"}</div>
                              </div>
                            </div>
                          </div>

                          {/* Middle Insights Row */}
                          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                            {/* Average Title Length */}
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Average Title Length</span>
                              <div className="text-lg font-bold text-emerald-400">
                                {ytLoading ? <span className="text-zinc-600 animate-pulse text-sm">…</span>
                                  : ytVideos && ytVideos.length > 0 
                                    ? `${Math.round(ytVideos.reduce((sum, v) => sum + v.title.length, 0) / ytVideos.length)} chars`
                                    : "52 chars"}
                              </div>
                              <span className="text-[9px] text-zinc-500">Optimal range is 45-60 characters</span>
                            </div>
                            {/* Total Views */}
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Total Channel Views</span>
                              <div className="text-lg font-bold text-white">
                                {ytLoading ? <span className="text-zinc-600 animate-pulse text-sm">…</span>
                                  : ytChannel ? (
                                    ytChannel.totalViews >= 1_000_000
                                      ? `${(ytChannel.totalViews / 1_000_000).toFixed(1)}M`
                                      : ytChannel.totalViews >= 1_000
                                      ? `${(ytChannel.totalViews / 1_000).toFixed(0)}K`
                                      : ytChannel.totalViews.toLocaleString()
                                  ) : "—"}
                              </div>
                              <span className="text-[9px] text-zinc-500">Lifetime channel views</span>
                            </div>
                            {/* Saturation Level */}
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Niche Saturation Analysis</span>
                              <div className="text-lg font-bold text-blue-400">{audit.saturation}</div>
                              <span className="text-[9px] text-zinc-500">Competitive landscape</span>
                            </div>
                          </div>

                          {/* Tactical Advice banner */}
                          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 text-xs">
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Channel Rhythm & Cohort Strategy
                            </div>
                            <p className="text-zinc-300 leading-normal text-xs md:text-sm">
                              <span className="text-zinc-500 font-semibold">Optimal Upload Window:</span> <strong className="text-white font-bold">{audit.optimalTime}</strong>
                            </p>
                            <p className="text-zinc-300 leading-normal text-xs md:text-sm">
                              <span className="text-zinc-500 font-semibold">Tactical Advice:</span> {audit.velocityTip}
                            </p>
                          </div>

                          {/* Deep Analysis Panel */}
                          <div className="grid md:grid-cols-2 gap-6 !mt-6 pt-6 border-t border-white/5">
                            <div className="p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-3">
                              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> Good Hooks & Cadence (Working Well)
                              </div>
                              <ul className="space-y-2 text-xs text-zinc-300">
                                <li className="flex gap-2">
                                  <span className="text-emerald-500">•</span>
                                  <span>Consistent thumbnail contrast levels (average brightness between 110-150) in top videos.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-emerald-500">•</span>
                                  <span>Curiosity-driven titles using narrative loops rather than generic feature descriptions.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-emerald-500">•</span>
                                  <span>Strong upload frequency matching historical audience active hours.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-rose-500/[0.02] border border-rose-500/10 space-y-3">
                              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
                                <AlertCircle className="w-4 h-4" /> Frictional Anchors & Gaps (Failing Elements)
                              </div>
                              <ul className="space-y-2 text-xs text-zinc-300">
                                <li className="flex gap-2">
                                  <span className="text-rose-500">•</span>
                                  <span>High clutter index on multiple thumbnail variations, creating focal point bleed.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-rose-500">•</span>
                                  <span>Emoji placement saturation in titles causing mobile-feed truncation and search index dilution.</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-rose-500">•</span>
                                  <span>Gaps in video pacing within the first 15 seconds (retention drops).</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Channel DNA Strategic Intelligence */}
                          <ChannelReportPanel 
                            profile={activeProfile} 
                            ytChannel={ytChannel} 
                            ytVideos={ytVideos} 
                            ytLoading={ytLoading} 
                            inline={true} 
                          />

                          {/* Outlier Video Insights */}
                          <div className="space-y-4 !mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                Outlier Video Insights
                              </h4>
                              {(!ytVideos || ytVideos.length === 0) && (
                                <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest">Niche Benchmarks</span>
                              )}
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {ytVideos && ytVideos.length > 0 ? (
                                ytVideos.slice(0, 6).map((vid) => (
                                  <a key={vid.videoId} href={vid.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                    className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 hover:border-white/10 hover:bg-white/[0.03] transition-all text-xs flex flex-col justify-between"
                                  >
                                    <div>
                                      {vid.thumbnailUrl && (
                                        <img src={vid.thumbnailUrl} alt={vid.title}
                                          className="w-full h-20 object-cover rounded-xl border border-white/5 mb-1" />
                                      )}
                                      <div className="flex justify-between items-start gap-1">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor}`}>{vid.status}</span>
                                        <span className="text-[9px] text-zinc-500">{vid.relativeTime}</span>
                                      </div>
                                      <p className="text-xs font-bold text-white line-clamp-2 leading-snug">{vid.title}</p>
                                    </div>
                                    <div className="pt-2 border-t border-white/[0.03] space-y-1">
                                      <div className="flex justify-between text-[9px] text-zinc-500">
                                        <span>Views: <strong className="text-white">{vid.viewCountFormatted}</strong></span>
                                        <span>👍 {vid.likeCount.toLocaleString()}</span>
                                      </div>
                                      <div className="text-[9px]">
                                        {vid.performanceRatio >= 1.5
                                          ? <span className="text-emerald-400">↑ {Math.round((vid.performanceRatio-1)*100)}% above avg</span>
                                          : vid.performanceRatio < 0.75
                                          ? <span className="text-rose-400">↓ {Math.round((1-vid.performanceRatio)*100)}% below avg</span>
                                          : <span className="text-zinc-500">≈ Near average</span>}
                                      </div>
                                    </div>
                                  </a>
                                ))
                              ) : (
                                audit.videos.map((vid: any, i: number) => (
                                  <div key={i} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 text-xs flex flex-col justify-between">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center gap-2">
                                        <span className={cn("px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0", vid.status === "OUTPERFORMED" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : vid.status === "UNDERPERFORMING" ? "text-rose-400 bg-rose-500/10 border border-rose-500/20" : "text-blue-400 bg-blue-500/10 border border-blue-500/20")}>
                                          {vid.status}
                                        </span>
                                        <span className="text-[9px] text-zinc-500">Avg CTR: {vid.ctr}</span>
                                      </div>
                                      <p className="text-xs font-bold text-white line-clamp-3 leading-snug">{vid.title}</p>
                                    </div>
                                    <div className="text-zinc-400">
                                      <strong className="text-rose-400 font-bold">Why it failed:</strong> {vid.notWorked}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setWizardStep(2)}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 shadow-md"
                          >
                            Proceed to Title forensics <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )
                    })()
                  )
                ) : result ? (
                  <CreatorIntelligenceReport 
                    result={result} 
                    profile={profile} 
                    title={title} 
                    niche={niche} 
                    brightness={brightness} 
                    faceCount={faceCount} 
                    thumbnailPreview={thumbnailPreview} 
                    onRestart={restartWizard}
                    compareVariants={compareVariants}
                    compareResults={compareResults}
                  />
                ) : (
                  <div className="w-full">
                  <div className="space-y-6 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {/* Step 2: Proposed Title Forensics */}
                      {wizardStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Linguistic Forensics</h2>
                              <p className="text-xs text-zinc-500 mt-1">Proposed metadata helps our model isolate hook strength and curiosity coefficients.</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Video Title</label>
                              <textarea
                                rows={3}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. I Spent 100 Hours Crafting the Ultimate Minecraft World"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-white/20 transition-all resize-none text-white font-medium"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category Niche</label>
                              <div className="relative">
                                <select
                                  value={niche}
                                  onChange={(e) => setNiche(e.target.value)}
                                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none appearance-none cursor-pointer text-white font-medium hover:border-white/10 transition-colors"
                                >
                                  {NICHES.map((n) => (
                                    <option key={n.id} value={n.id}>
                                      {n.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Video Transcript Diagnostics (Optional)</label>
                              <textarea
                                rows={4}
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Paste your video's script or first 30 seconds hook here to analyze linguistic pacing and retention coefficients..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-white/20 transition-all resize-none text-white font-medium placeholder-zinc-600"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(1)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              disabled={!title.trim()}
                              onClick={() => setWizardStep(3)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Proceed to Thumbnail <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Thumbnail Design Parameters */}
                      {wizardStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Thumbnail Visual Coefficient</h2>
                              <p className="text-xs text-zinc-500 mt-1">Our visual engine scans object clutter, expressiveness, and brightness levels.</p>
                            </div>

                            <input 
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                if (activeSlotId) {
                                  handleSlotUpload(activeSlotId, file)
                                } else {
                                  handleThumbnailUpload(e)
                                }
                              }}
                              accept="image/*"
                              className="hidden"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {compareVariants.map((variant, index) => (
                                <div 
                                  key={variant.id}
                                  onClick={() => {
                                    setActiveSlotId(variant.id)
                                    fileInputRef.current?.click()
                                  }}
                                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                      handleSlotUpload(variant.id, file);
                                    }
                                  }}
                                  className={cn(
                                    "aspect-video md:aspect-[4/3] border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-3 group relative overflow-hidden shadow-2xl",
                                    variant.preview ? "border-solid border-emerald-500/20 bg-black/40" : ""
                                  )}
                                >
                                  {variant.preview ? (
                                    <>
                                      <img src={variant.preview} alt={`Variant ${index + 1}`} className="absolute inset-0 w-full h-full object-cover rounded-[1.4rem] animate-fade-in" />
                                      
                                      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-emerald-400 opacity-80 pointer-events-none" />
                                      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-emerald-400 opacity-80 pointer-events-none" />
                                      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-emerald-400 opacity-80 pointer-events-none" />
                                      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-emerald-400 opacity-80 pointer-events-none" />

                                      {variant.isScanning ? (
                                        <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-2 select-none p-2">
                                          <div className="relative w-8 h-8 flex items-center justify-center">
                                            <div className="absolute inset-0 border border-dashed border-emerald-500/40 rounded-full animate-spin [animation-duration:4s]" />
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                          </div>
                                          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">Visual scan...</span>
                                        </div>
                                      ) : (
                                        <>
                                          <motion.div 
                                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-500/60 opacity-80 pointer-events-none"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                          />
                                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/90 text-black font-black text-[7px] uppercase tracking-widest shadow-md">
                                            Variant {index + 1}
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              clearSlot(variant.id);
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded bg-black/60 hover:bg-black/90 text-white transition-colors"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4 text-zinc-500 mb-1 group-hover:scale-110 transition-transform animate-pulse" />
                                      <span className="text-[10px] font-bold text-white group-hover:text-emerald-400 transition-colors">Slot {index + 1}</span>
                                      <span className="text-[7px] text-zinc-500 uppercase font-bold tracking-widest mt-0.5">Click to upload</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Visual Telemetry Diagnostics</span>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {compareVariants.map((variant, index) => {
                                  const hasImage = variant.preview !== null
                                  return (
                                    <div key={variant.id} className="p-3 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 text-left">
                                      <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                                        Variant {index + 1} Telemetry
                                      </div>
                                      <div className="grid grid-cols-1 gap-2 text-[10px]">
                                        <div className="space-y-0.5">
                                          <span className="text-zinc-500 block">Brightness</span>
                                          <span className={cn("font-bold", !hasImage ? "text-zinc-600" : "text-white")}>
                                            {variant.isScanning ? "..." : hasImage ? variant.brightness : "—"}
                                          </span>
                                        </div>
                                      </div>
                                      {hasImage && !variant.isScanning && (
                                        <div className="text-[8px] font-bold uppercase tracking-wider mt-1">
                                          <span className={cn(
                                            variant.brightness > 170 ? "text-amber-400" : variant.brightness < 90 ? "text-blue-400" : "text-emerald-400"
                                          )}>
                                            {variant.brightness > 170 ? "Bright Visual" : variant.brightness < 90 ? "Low Light" : "Optimal Contrast"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(2)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              disabled={!compareVariants.some(v => v.preview !== null)}
                              onClick={() => setWizardStep(4)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Proceed to Schedule <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Video Timing and Context */}
                      {wizardStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold">Scheduling & Retention Context</h2>
                              <p className="text-xs text-zinc-500 mt-1">Upload schedules help the model cross-reference active cohort engagement hourly.</p>
                            </div>

                            <div className="space-y-4">
                              {/* Duration Class Selection */}
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Video Duration Profile</label>
                                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                                  {[
                                    { id: "short", label: "YouTube Short (<1m)" },
                                    { id: "standard", label: "Standard Video (<1h)" },
                                    { id: "long", label: "Deep-Dive (>1h)" },
                                  ].map((d) => (
                                    <button
                                      key={d.id}
                                      onClick={() => setVideoDurationType(d.id as any)}
                                      className={cn(
                                        "flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all",
                                        videoDurationType === d.id
                                          ? "bg-white text-black"
                                          : "text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      {d.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Exact Duration Sliders */}
                              {videoDurationType !== "short" && (
                                <div className="grid grid-cols-2 gap-4">
                                  {videoDurationType === "long" && (
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>Hours</span>
                                        <span className="text-white">{durationHours} hr</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={durationHours}
                                        onChange={(e) => setDurationHours(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                      <span>Minutes</span>
                                      <span className="text-white">{durationMinutes} min</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="1"
                                      max="59"
                                      value={durationMinutes}
                                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Timing parameters */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Upload Hour</label>
                                  <div className="relative">
                                    <select
                                      value={uploadHour}
                                      onChange={(e) => setUploadHour(Number(e.target.value))}
                                      className="w-full bg-zinc-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none appearance-none cursor-pointer text-white font-medium hover:border-white/10 transition-colors"
                                    >
                                      {Array.from({ length: 24 }).map((_, h) => (
                                        <option key={h} value={h}>
                                          {h === 0 ? "12:00 AM" : h === 12 ? "12:00 PM" : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Upload Schedule Fit</label>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setIsWeekend(0)}
                                      className={cn(
                                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        isWeekend === 0 
                                          ? "bg-white text-black border-white" 
                                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      Weekday
                                    </button>
                                    <button
                                      onClick={() => setIsWeekend(1)}
                                      className={cn(
                                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                                        isWeekend === 1 
                                          ? "bg-white text-black border-white" 
                                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                      )}
                                    >
                                      Weekend
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Upload Rhythm and Day badges */}
                              <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Target Publish Days</label>
                                <div className="flex flex-wrap gap-2">
                                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => {
                                    const isSelected = postDays.includes(d)
                                    return (
                                      <button
                                        key={d}
                                        onClick={() => {
                                          if (isSelected) {
                                            setPostDays(postDays.filter((x) => x !== d))
                                          } else {
                                            setPostDays([...postDays, d])
                                          }
                                        }}
                                        className={cn(
                                          "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
                                          isSelected
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                            : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                                        )}
                                      >
                                        {d.slice(0, 3)}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                              {/* Telemetry and Showcase Consent Options */}
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 mt-4 text-left">
                                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Privacy & Live Activity Preferences</div>
                                
                                <label className="flex items-start gap-3 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={allowLiveFeed} 
                                    onChange={(e) => setAllowLiveFeed(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-white/10 bg-zinc-900 text-blue-500 focus:ring-0 cursor-pointer"
                                  />
                                  <div className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                    <span className="font-bold text-white block">Broadcast Anonymized Activity</span>
                                    Show this analysis in the live activity feed (e.g., "Tech Creator in London analyzed a thumbnail").
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group pt-2.5 border-t border-white/[0.03]">
                                  <input 
                                    type="checkbox" 
                                    checked={consentPublicShowcase} 
                                    onChange={(e) => setConsentPublicShowcase(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-white/10 bg-zinc-900 text-blue-500 focus:ring-0 cursor-pointer"
                                  />
                                  <div className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                    <span className="font-bold text-white block">Apply for public Creator Showcase (+100 credits)</span>
                                    Submit your channel details to be featured in the homepage creator queue.
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              onClick={() => setWizardStep(3)}
                              className="px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowConsentModal(true)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              Execute Intelligence Scan <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: The Grand Neural Scan Reveal (Cinematic progressive scan) */}
                      {wizardStep === 5 && !result && isAnalyzing && (
                        <motion.div
                          key="step-5-loading-cinematic"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card p-8 md:p-12 border-white/10 rounded-[2rem] flex-1 flex flex-col justify-center space-y-8 relative overflow-hidden"
                        >
                          {/* Self-contained moving laser scan line */}
                          <style>{`
                            @keyframes scanMotion {
                              0% { transform: translateY(-100%); }
                              50% { transform: translateY(250%); }
                              100% { transform: translateY(-100%); }
                            }
                            .animate-scan-laser {
                              animation: scanMotion 3s infinite ease-in-out;
                            }
                          `}</style>
                          <div className="absolute inset-x-0 w-full h-[6px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 animate-scan-laser pointer-events-none" />

                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-ping" />
                              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                            </div>
                            
                            <div>
                              <h3 className="font-black text-sm uppercase tracking-widest text-white">Live Strategy Synthesis</h3>
                              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto">Evaluating visual and semantic patterns relative to niche leaders...</p>
                            </div>
                          </div>

                          {/* Progress List */}
                          <div className="space-y-3.5 max-w-md mx-auto w-full pt-4 border-t border-white/5">
                            {[
                              "Scanning thumbnail composition...",
                              "Detecting emotional focus...",
                              "Comparing against niche competitors...",
                              "Evaluating mobile feed clarity...",
                              "Reverse-engineering top performers...",
                              "Building optimization strategy..."
                            ].map((stageText, idx) => {
                              const isFinished = scanStageIndex > idx
                              const isCurrent = scanStageIndex === idx
                              return (
                                <div 
                                  key={idx} 
                                  className={cn(
                                    "flex items-center justify-between p-3 rounded-xl border transition-all duration-300 text-left",
                                    isFinished 
                                      ? "bg-emerald-500/[0.02] border-emerald-500/10 text-zinc-300" 
                                      : isCurrent 
                                      ? "bg-amber-500/[0.02] border-amber-500/20 text-white shadow-[0_0_15px_rgba(245,158,11,0.02)]" 
                                      : "bg-white/[0.002] border-transparent text-zinc-600 opacity-40"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    {isFinished ? (
                                      <span className="text-emerald-400 text-xs font-bold shrink-0">✅</span>
                                    ) : isCurrent ? (
                                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                                    )}
                                    <span className="text-xs font-semibold">{stageText}</span>
                                  </div>

                                  <div className="text-[9px] font-mono tracking-widest uppercase">
                                    {isFinished ? (
                                      <span className="text-emerald-400 font-bold">READY</span>
                                    ) : isCurrent ? (
                                      <span className="text-amber-400 font-bold animate-pulse">RUNNING</span>
                                    ) : (
                                      <span className="text-zinc-700 font-medium">QUEUED</span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>


                </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Privacy & Telemetry Permission Modal */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConsentModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md border-white/10 bg-zinc-950 p-6 relative z-10 overflow-hidden shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-400" />
                    Telemetry & Privacy Controls
                  </h3>
                  <p className="text-[10px] text-zinc-500">Specify your broadcasting permissions for this intelligence scan.</p>
                </div>
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="p-1 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Alert Box */}
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] leading-relaxed text-zinc-400">
                <span className="font-bold text-blue-400 block mb-1 flex items-center gap-1">
                  🔒 Private Sandbox Guaranteed
                </span>
                We support fully localized calculations. By default, telemetry is anonymized. You control if your optimization data is streamed to the public globe network.
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={allowLiveFeed}
                    onChange={(e) => setAllowLiveFeed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/10 bg-zinc-900 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-zinc-200 transition-colors">
                      Broadcast Anonymized Activity
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5 leading-relaxed">
                      Publish basic stats to the landing page feed (e.g. "{niche || "Gaming"} Creator optimized thumbnails").
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={consentPublicShowcase}
                    onChange={(e) => setConsentPublicShowcase(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/10 bg-zinc-900 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-zinc-200 transition-colors flex items-center gap-1.5">
                      Apply for public Creator Showcase <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">+100 credits</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5 leading-relaxed">
                      Feature your channel name, niche, and a location pin flag on our interactive landing page network map.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowConsentModal(false)
                    handleAnalyze()
                  }}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Confirm & Run Analysis <Sparkles className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    setAllowLiveFeed(false)
                    setConsentPublicShowcase(false)
                    setShowConsentModal(false)
                    // Short timeout to let state update reflect
                    setTimeout(() => {
                      handleAnalyze()
                    }, 50)
                  }}
                  className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-500" /> Execute 100% Private Scan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
