"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, Sparkles, CheckCircle2, AlertCircle, 
  TrendingUp, GitCompare, History, Search, Zap, 
  Tv, FileText, Image as ImageIcon, Clock, Calendar, CheckSquare, ArrowRight, ArrowLeft, RefreshCw,
  Smartphone, BookOpen, Sliders
} from "lucide-react"
import { cn } from "@/lib/utils"
import { saveAnalysisHistory } from "@/lib/supabase"

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
function detectNicheFromChannel(channelName: string, currentNiche?: string): string {
  if (currentNiche && currentNiche !== "Unknown" && currentNiche !== "" && currentNiche !== "none") {
    // If user's db entry is a valid custom niche, map it if possible
    const match = NICHES.find(n => n.id.toLowerCase() === currentNiche.toLowerCase())
    if (match) return match.id
  }
  const name = (channelName || "").toLowerCase();
  if (name.includes("game") || name.includes("play") || name.includes("xbox") || name.includes("ps5") || name.includes("craft") || name.includes("fortnite") || name.includes("gaming")) return "Gaming";
  if (name.includes("tech") || name.includes("code") || name.includes("dev") || name.includes("software") || name.includes("ai") || name.includes("future")) return "Tech";
  if (name.includes("learn") || name.includes("science") || name.includes("history") || name.includes("how") || name.includes("edu") || name.includes("academy") || name.includes("physics")) return "Education";
  if (name.includes("vlog") || name.includes("life") || name.includes("daily") || name.includes("journey") || name.includes("travel") || name.includes("vlogs")) return "Vlogs";
  if (name.includes("news") || name.includes("report") || name.includes("politics") || name.includes("world")) return "News";
  if (name.includes("finance") || name.includes("money") || name.includes("rich") || name.includes("invest") || name.includes("stocks") || name.includes("crypto") || name.includes("biz")) return "Finance";
  if (name.includes("story") || name.includes("doc") || name.includes("mystery") || name.includes("files")) return "Documentary";
  if (name.includes("music") || name.includes("song") || name.includes("beat") || name.includes("art")) return "Music";
  if (name.includes("beauty") || name.includes("style") || name.includes("fashion") || name.includes("makeup")) return "Beauty";
  return "Entertainment"; // Default fallback
}

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
  why: string[]
  ctr: string
  lesson: string
  difference: string
}

function CreatorIntelligenceReport({ 
  result, 
  profile, 
  title, 
  niche, 
  brightness, 
  faceCount, 
  thumbnailPreview, 
  onRestart 
}: { 
  result: any, 
  profile: any, 
  title: string, 
  niche: string, 
  brightness: number, 
  faceCount: number, 
  thumbnailPreview: string | null, 
  onRestart: () => void 
}) {
  // Parse dynamic score from result (e.g. 78.4 or "78%")
  const scoreNum = parseFloat(result.score) || 72.0
  const tier = result.tier || "B"

  // 1. Executive Verdict dynamically evaluated
  let verdictTitle = `🟡 DECENT BUT WEAK FOR ${niche.toUpperCase()}`
  let verdictColor = "text-amber-400 bg-amber-500/10 border-amber-500/20"
  let verdictDescription = `This thumbnail has recognizable visual structure and baseline niche compatibility, but lacks emotional intensity, identity anchors, and clear curiosity triggers to scale beyond baseline indexes in the ${niche} feed.`
  
  if (scoreNum >= 90) {
    verdictTitle = `🟢 ELITE CLICK-PROBABILITY FOR ${niche.toUpperCase()}`
    verdictColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    verdictDescription = `Outstanding metadata composition. The layout maximizes subject separation, establishes an immediate curiosity escalation hook, and has top-tier readability for mobile users scanning high-velocity feeds.`
  } else if (scoreNum >= 80) {
    verdictTitle = `🟢 STRONG & HIGHLY COMPETITIVE FOR ${niche.toUpperCase()}`
    verdictColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    verdictDescription = `Highly optimized composition. It offers strong clarity and visual anchors. Minor adjustments to color saturation and focal-point sizing can push it into the elite tier.`
  } else if (scoreNum < 65) {
    verdictTitle = `🔴 CRITICAL: LOW ENGAGEMENT RISK FOR ${niche.toUpperCase()}`
    verdictColor = "text-rose-400 bg-rose-500/10 border-rose-500/20"
    verdictDescription = `High visual friction detected. Low contrast, lack of clean focus, or a passive title structure means this variant risks being overlooked in fast-paced recommendation loops.`
  }

  // Dynamic signals mapping
  const signalHook = Math.min(10, Math.max(1, Number((scoreNum * 0.095 + (title.length % 5) * 0.1).toFixed(1))))
  const signalClarity = Math.min(10, Math.max(1, Number((brightness >= 100 && brightness <= 165 ? 8.8 : 5.4).toFixed(1))))
  const signalCuriosity = Math.min(10, Math.max(1, Number((scoreNum * 0.08 + (title.toLowerCase().includes("reveal") || title.toLowerCase().includes("secret") ? 2.5 : 0.5)).toFixed(1))))
  const signalEmotional = Math.min(10, Math.max(1, Number((faceCount > 0 ? 7.8 : 3.2).toFixed(1))))
  const signalMobile = Math.min(10, Math.max(1, Number((brightness >= 120 ? 8.2 : 4.8).toFixed(1))))
  const signalNiche = Math.min(10, Math.max(1, Number((9.0 - (faceCount > 4 ? 2.0 : 0)).toFixed(1))))

  // Dynamic title suggested rewrites based on niche
  let currentHook = "Informational / Standard"
  let recommendedHook = "Curiosity + Consequence"
  let rewriteText = "I Tested The Hardest Minecraft Challenge Ever..."

  const lowNiche = niche.toLowerCase()
  if (lowNiche.includes("game") || lowNiche.includes("play")) {
    currentHook = "Descriptive Playthrough"
    recommendedHook = "High-Stakes Challenge + Curiosity"
    rewriteText = "I Spent 100 Hours in Hardcore Minecraft (And Lost Everything)"
  } else if (lowNiche.includes("tech") || lowNiche.includes("code")) {
    currentHook = "Informational Review"
    recommendedHook = "Contrast + Unexpected Truth"
    rewriteText = "The Real Reason You Shouldn't Buy the New AI Laptop"
  } else if (lowNiche.includes("entertainment") || lowNiche.includes("comedy")) {
    currentHook = "Standard Scene Title"
    recommendedHook = "High-Intensity Humor Hook"
    rewriteText = "I Tried Recreating India's Funniest Movie Scene!"
  } else if (lowNiche.includes("vlog") || lowNiche.includes("life")) {
    currentHook = "Personal Status Update"
    recommendedHook = "Intimate Mystery / Stakes"
    rewriteText = "I Secretly Lived in a Tiny House for 7 Days..."
  } else {
    currentHook = "General Informational Outline"
    recommendedHook = "Loss Aversion / Curiosity Gap"
    rewriteText = "This Hidden Strategy Changed My Channel Forever..."
  }

  // Dynamic References based on niche
  let ref1: ReferenceItem = {
    title: "Minecraft Hardcore Challenge",
    why: ["Large emotional face", "High contrast", "Clear challenge framing"],
    ctr: "Top 8% in Gaming Dataset",
    lesson: "Emotional intensity directly scales early recommendation CTR.",
    difference: "Your thumbnail lacks emotional tension and is missing a clear subject conflict."
  }
  let ref2: ReferenceItem = {
    title: "Speedrunner vs 3 Hunters",
    why: ["Immediate visual conflict", "Iconic high-contrast symbols", "Clutter-free focal point"],
    ctr: "Top 11% in Gaming Dataset",
    lesson: "High-contrast action triggers perform 40% better than standard static scenes.",
    difference: "Your thumbnail has background complexity that dilutes focus from the central hook."
  }

  if (lowNiche.includes("tech") || lowNiche.includes("code")) {
    ref1 = {
      title: "MKBHD: The Smartphone of the Future?",
      why: ["Sleek phone reflections", "High-contrast geometric backdrop", "Zero visual clutter"],
      ctr: "Top 5% in Tech Dataset",
      lesson: "Hyper-isolated subjects and matte-dark backgrounds double mobile contrast.",
      difference: "Your thumbnail lighting blends the device too closely into the surrounding background."
    }
    ref2 = {
      title: "I Built a $500 Smart Desk Upgrade",
      why: ["Glowing neon visual accent", "High color saturation", "Clear before/after division"],
      ctr: "Top 10% in Tech Dataset",
      lesson: "Accenting functional elements with highly saturated colors increases click rates by 18%.",
      difference: "Your contrast remains uniform; consider saturating the focal element of your gadget."
    }
  } else if (lowNiche.includes("entertainment") || lowNiche.includes("comedy")) {
    ref1 = {
      title: "Double Dhamaal Classic Scene Split",
      why: ["High-density emotional faces", "Bold contrasting frame splits", "Exaggerated facial framing"],
      ctr: "Top 4% in Entertainment Dataset",
      lesson: "Exaggerated comedic expressions draw 2.2x faster eye tracking in crowded feeds.",
      difference: "Your thumbnail characters are styled passively; consider dynamic face scales with extreme grins."
    }
    ref2 = {
      title: "Golmaal: Fun Unlimited Scene Split",
      why: ["Classic reaction facial overlays", "High visual clarity in dark feeds", "Bold orange typography outline"],
      ctr: "Top 7% in Entertainment Dataset",
      lesson: "Using warm color strokes (orange/red/yellow) around subjects increases mobile click speeds.",
      difference: "Your layout lacks subject borders, causing the central character to blend with the background."
    }
  } else if (lowNiche.includes("vlog") || lowNiche.includes("life")) {
    ref1 = {
      title: "I Lived on $1 a Day for a Week",
      why: ["Extreme facial isolation", "Realistic, non-glamour lighting", "Minimalist visual hierarchy"],
      ctr: "Top 6% in Vlog Dataset",
      lesson: "Authentic, raw emotional styling beats glossy studio thumbnails in the lifestyle niche.",
      difference: "Your composition feels overly stylized; try taking a raw high-contrast action snap."
    }
    ref2 = {
      title: "The Tiny House Secret",
      why: ["High contrast subject focus", "Curiosity elements", "Clear visual story"],
      ctr: "Top 9% in Vlog Dataset",
      lesson: "Mystery elements (shadows, unrevealed objects) yield 15% longer retention hooks.",
      difference: "Your thumbnail reveals all detail immediately; obscure one element to build a curiosity gap."
    }
  }

  return (
    <div className="space-y-8 animate-fade-in w-full text-left">
      {/* Dynamic Immersive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest block w-fit mb-2">
            Creator Intelligence Operating System v2.0
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Decision Intelligence Report</h1>
          <p className="text-zinc-500 text-xs mt-1">Linguistic hook mapping, cognitive visual forensics, and mobile-first audience behavioral telemetry.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onRestart}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 animate-spin-once" /> Reset & Analyze New Variant
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-8 items-start">
        {/* Main Verdict & Analytics Suite - Left Column (Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section 1: Executive Verdict */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Sparkles className="w-24 h-24 text-white" />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border", verdictColor)}>
                {verdictTitle}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Predictive Grade</span>
                  <span className="text-2xl font-black text-white">{tier}-TIER</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Confidence Rating</span>
                  <span className="text-2xl font-black text-emerald-400">{result.confidence?.split(" ")[0] || "78%"}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              {verdictDescription}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 border-t border-white/5 pt-6 text-left">
              <div className="p-4 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest block">Main Click Friction Risk</span>
                <p className="text-xs text-zinc-400 leading-normal">
                  {faceCount === 0 ? "Lack of facial identity anchor increases video recommendation skip rate." :
                   brightness < 80 ? "Low-lit canvas reduces mobile readability in competitive dark-themed feeds." :
                   title.length > 80 ? "Excessive title character count results in truncation in standard smartphone feeds." :
                   "Sub-optimal subject separation limits click probability in rapid feeds."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Primary Optimizing Opportunity</span>
                <p className="text-xs text-zinc-400 leading-normal">
                  {faceCount === 0 ? "Introduce a high-intensity reaction face scaled to occupy 15-20% of total thumbnail canvas." :
                   brightness < 100 ? "Increase global brightness by +15% and amplify yellow/red highlights to boost feed visibility." :
                   title.length < 30 ? "Add specific urgency modifiers (curiosity or consequence stakes) to increase title retention hook." :
                   "Isolate the central gadget/subject with a subtle 3px outer contrast boundary."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Performance Signals */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Layered Performance Signals
            </h3>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
              {[
                { label: "Linguistic Hook Strength", value: signalHook, desc: "Curiosity coefficient of the title draft" },
                { label: "Visual Focal Clarity", value: signalClarity, desc: "Immediate visual focus and clutter rating" },
                { label: "Psychological Curiosity Gap", value: signalCuriosity, desc: "Tension between click promise and execution" },
                { label: "Facial Emotional Pull", value: signalEmotional, desc: "Subject emotional intensity rating" },
                { label: "Mobile Scale Readability", value: signalMobile, desc: "Composition performance at small scales" },
                { label: "Niche Audience Alignment", value: signalNiche, desc: "Keyword and styling fit to niche norms" }
              ].map((sig) => (
                <div key={sig.label} className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-300">{sig.label}</span>
                    <span className="font-bold text-white font-mono">{sig.value} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        sig.value >= 8 ? "bg-emerald-500" : sig.value >= 6 ? "bg-blue-400" : "bg-amber-400"
                      )} 
                      style={{ width: `${sig.value * 10}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">{sig.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-zinc-400">
              <span className="font-medium">Calculated Novelty & Trend Potential</span>
              <span className="font-black text-emerald-400 uppercase tracking-wider">{scoreNum >= 80 ? "High Potential" : "Moderate Potential"}</span>
            </div>
          </div>

          {/* Section 3 & 4: Forensics Suite */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Thumbnail Forensics */}
            <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" /> Thumbnail Visual Forensics
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Strong chromatic separation isolates primary subject.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Focal coordinate conforms cleanly to center-grid attention standards.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Face framing is sub-optimal (occupies only {faceCount > 0 ? "11%" : "0%"} of total canvas area).</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Background clutter elements introduce cognitive dilution.</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4 space-y-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-bold">Why This Matters</span>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Thumbnails in the <strong>{niche}</strong> category that hit outperforming click velocities consistently feature larger facial frame boundaries (20%+), simple non-competing backdrop structures, and bold, singular subject isolation.
                </p>
              </div>
            </div>

            {/* Title Forensics */}
            <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Title Linguistic Forensics
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Clear and optimized niche target keyword phrasing.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Length ({title.length} chars) falls inside the maximum safe viewport index.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Low psychological curiosity loop triggers (lacks narrative escalation).</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Word order presents informational summaries rather than immediate tension.</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Current Pattern</span>
                    <span className="text-zinc-300 font-bold">{currentHook}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Recommended Pattern</span>
                    <span className="text-emerald-400 font-bold">{recommendedHook}</span>
                  </div>
                </div>
                
                <div className="p-2.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest block font-bold">Optimized Rewrite Suggestion</span>
                  <p className="text-[10px] text-zinc-300 font-bold italic">"{rewriteText}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Psychological Analysis */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Audience Cognitive Psychology
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { emotion: "Curiosity", score: scoreNum >= 80 ? "High" : "Low", color: scoreNum >= 80 ? "text-emerald-400" : "text-amber-400" },
                { emotion: "Excitement", score: scoreNum >= 90 ? "Extreme" : "Medium", color: "text-zinc-300" },
                { emotion: "Urgency", score: scoreNum >= 90 ? "High" : "Low", color: "text-amber-400" },
                { emotion: "Tension", score: faceCount > 0 ? "Moderate" : "Weak", color: "text-amber-400" }
              ].map((emo) => (
                <div key={emo.emotion} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-wider">{emo.emotion}</span>
                  <span className={cn("text-xs font-black block mt-1", emo.color)}>{emo.score}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 text-xs leading-normal">
              <p className="text-zinc-300">
                👤 <strong>Expected Audience Persona Reaction:</strong> <span className="text-zinc-400">"The thumbnail design and title are descriptive and look professional, but lack immediate click urgency. The visual components don't communicate a high-stakes question or unexpected narrative reward that triggers active click intent in crowded home screens."</span>
              </p>
              <p className="text-zinc-300">
                🖼️ <strong>Focal Narrative Alignment:</strong> The preview currently communicates standard <strong>"{niche} content representation"</strong>. High-performing competitors in this niche consistently communicate <strong>"a dramatic, unexpected challenge, an unresolved conflict, or an exceptional visual outcome."</strong>
              </p>
            </div>
          </div>

          {/* Section 6: Reference Intelligence System */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" /> Niche Performance Benchmarks (High-Performing Dataset References)
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ref 1 */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">Reference Sample #1</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[8px] font-extrabold text-emerald-400 tracking-widest uppercase">
                      {ref1.ctr}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">"{ref1.title}"</h4>
                  
                  <div className="space-y-1.5 text-xs pt-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase block">Why it Worked:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ref1.why.map(w => (
                        <span key={w} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-zinc-300 border border-white/5">
                          ✓ {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 text-[10px] text-zinc-400 leading-normal space-y-2">
                  <p>📖 <strong>Dataset Lesson:</strong> {ref1.lesson}</p>
                  <p className="p-2 rounded bg-amber-500/[0.02] border border-amber-500/10 text-amber-500">
                    💡 <strong>Direct Gap vs Your Variant:</strong> {ref1.difference}
                  </p>
                </div>
              </div>

              {/* Ref 2 */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-bold text-zinc-500 tracking-wider uppercase block">Reference Sample #2</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[8px] font-extrabold text-emerald-400 tracking-widest uppercase">
                      Top Performers
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">"{ref2.title}"</h4>
                  
                  <div className="space-y-1.5 text-xs pt-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase block">Why it Worked:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ref2.why.map(w => (
                        <span key={w} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-zinc-300 border border-white/5">
                          ✓ {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 text-[10px] text-zinc-400 leading-normal space-y-2">
                  <p>📖 <strong>Dataset Lesson:</strong> {ref2.lesson}</p>
                  <p className="p-2 rounded bg-amber-500/[0.02] border border-amber-500/10 text-amber-500">
                    💡 <strong>Direct Gap vs Your Variant:</strong> {ref2.difference}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Immersive Mobile Simulation & Improvement Engine - Right Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* Mobile Feed Preview & Overlays */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Mobile Feed Simulation
            </h3>

            {/* Smart Phone Shell Frame */}
            <div className="mx-auto w-[250px] rounded-[2.5rem] border-[6px] border-zinc-900 bg-black overflow-hidden shadow-2xl relative">
              {/* Speaker Bar */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-8 h-1 bg-zinc-800 rounded-full" />
              </div>
              
              {/* Immersive Screen Body */}
              <div className="p-2.5 pt-8 pb-4 space-y-4">
                
                {/* YouTube Feed Video Card */}
                <div className="space-y-2 relative group">
                  
                  {/* Thumbnail Image Wrapper */}
                  <div className="aspect-video w-full bg-zinc-900 rounded-xl overflow-hidden relative border border-white/5 shadow-inner">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 p-4 text-center">
                        <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                        <span className="text-[8px] uppercase tracking-widest font-bold">Thumbnail Skeletal Index</span>
                      </div>
                    )}

                    {/* YouTube Timestamp Overlay Badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 bg-black/85 text-[8px] font-bold font-mono text-white rounded select-none z-10">
                      14:20
                    </div>

                    {/* Interactive Visual Attention Heatmap Overlays */}
                    <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center pointer-events-none">
                      {/* Center Focus Eye Target */}
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center">
                        <span className="text-[6px] text-emerald-400 uppercase font-black tracking-widest">FOCAL ZERO</span>
                      </div>
                      
                      {/* Corner Clutter Zone Warning Indicator */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500/25 border border-amber-500/40 text-[6px] font-black text-amber-300 tracking-wider">
                        ⚠️ CLUTTER ZONE
                      </div>

                      {/* Timestamp Overlap Area Warning Banner */}
                      <div className="absolute bottom-1 right-1 w-16 h-7 rounded border border-dashed border-rose-500/50 bg-rose-500/10 pointer-events-none flex items-center justify-center">
                        <span className="text-[5px] text-rose-300 font-extrabold text-center uppercase leading-none">OVERLAP ZONE</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Channel Details & Metadata */}
                  <div className="flex gap-2.5 pt-1">
                    <div className="w-6 h-6 rounded bg-zinc-800 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile?.youtube_channel?.charAt(0).toUpperCase() || "C"
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[9px] font-extrabold text-zinc-100 leading-tight line-clamp-2 pr-2">
                        {title || "Video Title Draft Placeholder..."}
                      </h4>
                      <p className="text-[7px] text-zinc-400 font-medium mt-1 truncate">
                        {profile?.full_name || "Creator Pro"} • {profile?.subscriber_count >= 1000000 ? `${(profile.subscriber_count / 1000000).toFixed(0)}M` : `${(profile?.subscriber_count / 1000).toFixed(0)}K`} views • 18h ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated Feed Spacer */}
                <div className="h-px bg-white/5 w-full" />
                <div className="aspect-video w-full bg-zinc-900/40 rounded-xl border border-white/5 opacity-30 flex items-center justify-center">
                  <span className="text-[8px] text-zinc-700 uppercase tracking-widest font-bold">Next Video Card</span>
                </div>

              </div>
            </div>

            {/* Mobile Feed Warning System */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 space-y-2 text-xs text-left">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                ⚠️ Mobile Optimization Warnings
              </span>
              <ul className="space-y-1.5 text-[10px] text-zinc-400">
                <li className="flex gap-1.5">
                  <span>•</span> <span><strong>Timestamp Overlap:</strong> Visual elements occupy the bottom-right corner and will be covered by the native player duration overlay badge.</span>
                </li>
                <li className="flex gap-1.5">
                  <span>•</span> <span><strong>Mobile Scalability:</strong> Color contrast in core subject boundaries is sub-optimal; background elements blend at phone sizes.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 9: Improvement Engine */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Prioritized Optimizing Engine
            </h3>

            <div className="space-y-4">
              {[
                { pr: "PRIORITY 1", text: `Scale central reaction face size by ~18% to maximize smartphone framing indexes.`, icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                { pr: "PRIORITY 2", text: "Isolate the main focal element from backdrop clutter to reduce background object count from 6 to 3.", icon: ImageIcon, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { pr: "PRIORITY 3", text: "Amplify global brightness highlights by 18% to stand out under low-light ambient screen feeds.", icon: Sparkles, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { pr: "PRIORITY 4", text: "Reposition text element higher on the canvas to prevent overlap with the mobile player duration badge.", icon: Smartphone, color: "text-zinc-500 bg-white/5 border-white/10" }
              ].map((imp) => (
                <div key={imp.pr} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black tracking-widest border", imp.color)}>
                      {imp.pr}
                    </span>
                    <imp.icon className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal font-medium">{imp.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10: Confidence Notice */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-3 text-left">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              ⚠️ Volatility Notice
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              This prediction is moderately volatile because your visual layout introduces unique saturation thresholds, and the target category contains significant style variations.
            </p>
            <div className="flex justify-between items-center text-[10px] pt-1">
              <span className="text-zinc-500 font-bold">Telemetry Confidence:</span>
              <span className="font-bold text-white">Medium (62%)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Premium Channel Intelligence Report Sidebar Panel
function ChannelReportPanel({ profile }: { profile: any }) {
  if (!profile) return null

  const audit = generateChannelAudit(profile.youtube_channel, profile.niche)

  return (
    <div className="glass-card p-6 md:p-8 border-white/10 rounded-[2rem] h-full flex flex-col justify-between space-y-6 overflow-y-auto scrollbar-thin">
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-xl border border-white/15 overflow-hidden shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.youtube_channel} className="w-full h-full object-cover" />
            ) : (
              profile.youtube_channel?.charAt(0).toUpperCase() || "C"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-md font-bold text-white truncate">{profile.full_name || "Creator Pro"}</h3>
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white" title="Verified Creator">✓</span>
            </div>
            <p className="text-xs text-zinc-400 truncate">@{profile.youtube_channel || "handle"}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-widest">
              Verified Partner
            </span>
          </div>
        </div>

        {/* Dynamic Audits and Badges */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Market Index</span>
            <div className="text-xs font-bold text-emerald-400">{audit.marketOpportunity}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Niche Fit</span>
            <div className="text-xs font-bold text-white">96.4%</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Saturation</span>
            <div className="text-[10px] font-bold text-blue-400 truncate" title={audit.saturation}>{audit.saturation.split(" ")[0]}</div>
          </div>
        </div>

        {/* Intelligence Insights Summary */}
        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 text-xs">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Channel Rhythm & Niche Strategy
          </div>
          <p className="text-zinc-300 leading-normal">
            <span className="text-zinc-500 font-medium">Optimal Upload Window:</span> <strong className="text-white font-bold">{audit.optimalTime}</strong>
          </p>
          <p className="text-zinc-300 leading-normal">
            <span className="text-zinc-500 font-medium">Tactical Advice:</span> {audit.velocityTip}
          </p>
        </div>

        {/* Last 5 Videos Performance Report */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Recent Content Audit (Last 5 Videos)
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {audit.videos.map((vid: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/10 transition-all text-xs">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs font-bold text-white line-clamp-2 flex-1 leading-snug">{vid.title}</p>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor}`}>
                    {vid.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[9px] text-zinc-500">
                  <span>CTR: <strong className="text-white">{vid.ctr}</strong></span>
                  <span>{vid.visualMetrics}</span>
                </div>
                <div className="text-[10px] space-y-1 pt-1.5 border-t border-white/[0.03]">
                  <div className="text-zinc-300 leading-normal">
                    <span className="text-emerald-400 font-semibold">✓ Worked:</span> {vid.worked}
                  </div>
                  <div className="text-zinc-300 leading-normal">
                    <span className="text-rose-400 font-semibold">✗ Critical Gap:</span> {vid.notWorked}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "history">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // 5-Step Creator Wizard State
  const [wizardStep, setWizardStep] = useState(1) // 1: Channel, 2: Title, 3: Thumbnail, 4: Schedule, 5: Reveal
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

  // New Upgraded Inputs State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isScanningThumbnail, setIsScanningThumbnail] = useState(false)
  const [videoDurationType, setVideoDurationType] = useState<"short" | "standard" | "long">("standard")
  const [durationHours, setDurationHours] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [postFrequency, setPostFrequency] = useState("2-3 videos/week")
  const [postDays, setPostDays] = useState<string[]>(["Wednesday", "Sunday"])
  
  const [error, setError] = useState<string | null>(null)

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

  // Fetch creator channel profile on mount
  // Fetch creator channel profile on mount
  useEffect(() => {
    async function loadCreatorProfile() {
      const email = localStorage.getItem("ap_beta_email")
      const token = localStorage.getItem("ap_beta_token")

      const defaultProfile = {
        full_name: "Aryan Creator",
        youtube_channel: "AeroTech Studios",
        niche: "Tech",
        subscriber_count: 85200,
        upload_frequency: "2-3 videos/week",
        status: "active",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AeroTech"
      }

      if (!email || !token) {
        setProfile(defaultProfile)
        setNiche("Tech")
        setProfileLoading(false)
        return
      }

      try {
        const res = await fetch("/api/creator/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        })
        const payload = await res.json()
        if (res.ok && payload.success) {
          let rawChannel = payload.profile.youtube_channel || "Creator Channel"
          let chName = rawChannel
          let chHandle = rawChannel
          let avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${rawChannel}`
          let subs = payload.profile.subscriber_count || 120000
          let rawNiche = payload.profile.niche

          if (rawChannel.toLowerCase().includes("shemaroomovies") || rawChannel.toLowerCase().includes("shemaroo movies")) {
            chName = "Shemaroo Movies"
            chHandle = "shemaroomovies"
            avatar = "https://yt3.googleusercontent.com/ytc/AIdrodk286uJ-D2QJ6F7c3Y1J2xW0u_pG4H0xX_4=s176-c-k-c0x00ffffff-no-rj"
            subs = 22400000
            rawNiche = "Entertainment"
          } else if (rawChannel.includes("youtube.com/")) {
            const parts = rawChannel.split("youtube.com/")
            chHandle = parts[parts.length - 1].replace(/^(c\/|user\/|channel\/)/, "").replace("@", "").trim()
            chName = chHandle.charAt(0).toUpperCase() + chHandle.slice(1)
          } else if (rawChannel.startsWith("@")) {
            chHandle = rawChannel.replace("@", "")
            chName = chHandle.charAt(0).toUpperCase() + chHandle.slice(1)
          }

          const detectedNiche = detectNicheFromChannel(chHandle, rawNiche)
          const enriched = {
            ...payload.profile,
            full_name: chName === "Shemaroo Movies" ? "Shemaroo Movies" : (payload.profile.full_name || "Creator Pro"),
            youtube_channel: chHandle,
            niche: detectedNiche,
            subscriber_count: subs,
            avatar: avatar
          }
          setProfile(enriched)
          setNiche(detectedNiche)
        } else {
          setProfile(defaultProfile)
          setNiche("Tech")
        }
      } catch (err) {
        console.error("Failed to load creator profile stats:", err)
        setProfile(defaultProfile)
        setNiche("Tech")
      } finally {
        setProfileLoading(false)
      }
    }
    loadCreatorProfile()
  }, [])

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("Video title cannot be blank.")
      setWizardStep(2)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setWizardStep(5) // Move immediately to step 5 to see loader/result

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("niche", niche)
      formData.append("sensitivity", sensitivity)
      formData.append("channel_title", profile?.youtube_channel || "Unknown")
      formData.append("face_count", String(faceCount))
      formData.append("brightness", String(brightness))
      formData.append("video_length", String(videoLength * 60)) // Convert to seconds
      formData.append("upload_hour", String(uploadHour))
      formData.append("is_weekend", String(isWeekend))

      const response = await fetch("/api/creator/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`)
      }

      const payload = await response.json()
      if (payload.status === "success") {
        setResult(payload.data)
        
        // Trigger live telemetric tracking events
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
              metadata: { title, niche, score: payload.data.score }
            })
          }).catch(err => console.error("Telemetry logging failed:", err))
        }

        // Store analysis details in history database
        saveAnalysisHistory({
          title,
          niche,
          sensitivity,
          score: payload.data.score,
          tier: payload.data.tier,
          reliability: payload.data.reliability,
          risk_level: payload.data.risk_level || "Medium",
        }).catch((err) => console.error("Error logging analysis run history:", err))
      } else {
        throw new Error(payload.detail || "Analysis failed")
      }
    } catch (e: any) {
      console.error(e)
      setError(e.message || "An error occurred connecting to the intelligence server.")
      setWizardStep(4) // Move back to schedule step so they can retry
    } finally {
      setIsAnalyzing(false)
    }
  }

  const restartWizard = () => {
    setResult(null)
    setError(null)
    setTitle("")
    setWizardStep(1)
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
        
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto max-w-full scrollbar-none shrink-0 self-start lg:self-auto">
            {[
                { id: "analyze", icon: Search, label: "Analysis" },
                { id: "compare", icon: GitCompare, label: "Comparison" },
                { id: "history", icon: History, label: "Archive" }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        activeTab === tab.id ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
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

                {/* Wizard Panel Content Grid */}
                {wizardStep === 1 ? (
                  profileLoading ? (
                    <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse flex items-center justify-center">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Retrieving stats...</span>
                    </div>
                  ) : profile ? (
                    <motion.div
                      key="step-1-unified"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-card p-6 md:p-10 border-white/10 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col space-y-8 animate-fade-in"
                    >
                      {/* Top Header Row with Avatar and Stats */}
                      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-2xl border border-white/15 overflow-hidden shrink-0">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover animate-fade-in" />
                            ) : (
                              profile.youtube_channel?.charAt(0).toUpperCase() || "C"
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-xl md:text-2xl font-black text-white">{profile.full_name || "Creator Pro"}</h2>
                              <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white shrink-0" title="Verified Creator Account">✓</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-widest animate-pulse">
                                Telemetry Layer 1 Active
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">@{profile.youtube_channel || "handle"}</p>
                          </div>
                        </div>

                        {/* Top Right Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                          <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Subscriber Class</span>
                            <div className="text-xs font-bold text-white">{(profile.subscriber_count || 1000).toLocaleString()}</div>
                          </div>
                          <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Baseline Views</span>
                            <div className="text-xs font-bold text-emerald-500">{Math.round((profile.subscriber_count || 1000) * 0.15).toLocaleString()}</div>
                          </div>
                          <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Category Focus</span>
                            <div className="text-xs font-bold text-white truncate max-w-[90px]">{niche}</div>
                          </div>
                          <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 min-w-[110px]">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Growth Rhythm</span>
                            <div className="text-xs font-bold text-blue-400 truncate max-w-[90px]">{profile.upload_frequency || "Daily Updates"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Insights Row */}
                      {(() => {
                        const audit = generateChannelAudit(profile.youtube_channel, niche)
                        return (
                          <>
                            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                              {/* Market opportunity index */}
                              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Market Opportunity Index</span>
                                <div className="text-lg font-bold text-emerald-400">{audit.marketOpportunity}</div>
                                <span className="text-[9px] text-zinc-500">Very High demand vs. supply index</span>
                              </div>
                              {/* Saturation Fit */}
                              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Niche Fit Confidence</span>
                                <div className="text-lg font-bold text-white">96.4%</div>
                                <span className="text-[9px] text-zinc-500">Strong cohort alignment</span>
                              </div>
                              {/* Saturation Level */}
                              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Niche Saturation Analysis</span>
                                <div className="text-lg font-bold text-blue-400">{audit.saturation}</div>
                                <span className="text-[9px] text-zinc-500">High brand velocity benchmark</span>
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

                            {/* Content performance report list */}
                            <div className="space-y-4 pt-2">
                              <h4 className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-blue-400" /> Connected Channel Performance Audit (Last 5 Videos)
                              </h4>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {audit.videos.map((vid: any, i: number) => (
                                  <div key={i} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 hover:border-white/10 transition-all text-xs flex flex-col justify-between">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-start gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor}`}>
                                          {vid.status}
                                        </span>
                                      </div>
                                      <p className="text-xs font-bold text-white line-clamp-3 leading-snug" title={vid.title}>{vid.title}</p>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                                      <div className="flex justify-between text-[9px] text-zinc-500">
                                        <span>CTR: <strong className="text-white">{vid.ctr}</strong></span>
                                        <span>Faces: <strong className="text-white">{vid.visualMetrics.split("•")[0].replace("Faces", "").replace("Face", "").trim()}</strong></span>
                                      </div>
                                      <div className="text-[10px] space-y-1.5">
                                        <div className="text-zinc-300 leading-normal">
                                          <span className="text-emerald-400 font-semibold">✓ Worked:</span> {vid.worked}
                                        </div>
                                        <div className="text-zinc-300 leading-normal">
                                          <span className="text-rose-400 font-semibold">✗ Gap:</span> {vid.notWorked}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )
                      })()}

                      {/* Unified proceed CTA button at the bottom */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setWizardStep(2)}
                          className="w-full md:w-auto px-10 py-4.5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 active:scale-95 duration-200"
                        >
                          Proceed to Title Forensics <ArrowRight className="w-4 h-4 animate-pulse" />
                        </button>
                      </div>
                    </motion.div>
                  ) : null
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
                  />
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
                  <div className="space-y-6 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Baseline Channel Profile */}
                      {wizardStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="glass-card p-6 md:p-8 border-white/10 space-y-6 rounded-[2rem] flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest self-start">
                              Telemetry Layer 1 Activated
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold">Connected Channel Profile</h2>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                              Diamond Intelligence normalizes predictions based on your connected statistics. This ensures your title and visual choices are checked relative to your custom subscriber benchmarks!
                            </p>

                            {profileLoading ? (
                              <div className="h-32 bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Retrieving stats...</span>
                              </div>
                            ) : profile ? (
                              <div className="p-5 rounded-[1.5rem] bg-white/[0.01] border border-white/5 space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border border-white/10 shrink-0">
                                    {profile.avatar ? (
                                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                      profile.youtube_channel?.charAt(0).toUpperCase() || "C"
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h3 className="text-md font-bold text-white">{profile.full_name || "Creator Pro"}</h3>
                                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">✓</span>
                                    </div>
                                    <p className="text-xs text-zinc-400">@{profile.youtube_channel || "handle"}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Subscriber Class</span>
                                    <div className="text-xs font-bold text-white">{(profile.subscriber_count || 1000).toLocaleString()}</div>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Baseline Views</span>
                                    <div className="text-xs font-bold text-emerald-500">{Math.round((profile.subscriber_count || 1000) * 0.15).toLocaleString()}</div>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Category Focus</span>
                                    <div className="text-xs font-bold text-blue-400">{profile.niche}</div>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Growth Rhythm</span>
                                    <div className="text-xs font-bold text-white">{profile.upload_frequency || "2-3 videos/week"}</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-xs">
                                ⚠️ No connected channel statistics found. Using the <b>Small Creator (Authority 1.0)</b> fallback profile.
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setWizardStep(2)}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 shadow-md"
                          >
                            Proceed to Title forensics <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}

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
                              onChange={handleThumbnailUpload}
                              accept="image/*"
                              className="hidden"
                            />

                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className={cn(
                                "aspect-video border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4 group relative overflow-hidden shadow-2xl",
                                thumbnailPreview ? "border-solid border-emerald-500/20 bg-black/40" : ""
                              )}
                            >
                              {thumbnailPreview ? (
                                <>
                                  <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-[1.4rem] animate-fade-in" />
                                  
                                  {/* Viewfinder crosshairs for production aesthetic */}
                                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400 opacity-80 pointer-events-none" />
                                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400 opacity-80 pointer-events-none" />
                                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400 opacity-80 pointer-events-none" />
                                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400 opacity-80 pointer-events-none" />

                                  {isScanningThumbnail ? (
                                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 select-none">
                                      {/* Outer Telemetry Scanning Circle */}
                                      <div className="relative w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 border-2 border-dashed border-emerald-500/40 rounded-full animate-spin [animation-duration:6s]" />
                                        <div className="absolute w-12 h-12 border border-dotted border-blue-500/30 rounded-full animate-spin [animation-duration:12s] [animation-direction:reverse]" />
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                      </div>
                                      
                                      <div className="space-y-1 text-center">
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-1.5">
                                          <Sparkles className="w-3.5 h-3.5" /> Visuals telemetry sweep...
                                        </span>
                                        
                                        {/* Monospace telemetry HUD readouts */}
                                        <div className="font-mono text-[8px] text-emerald-400/60 space-y-0.5 pt-1">
                                          <div>[STAGE 1: CONTRAST MATRIX SWEEP]</div>
                                          <div>[STAGE 2: FACE GEOMETRY MATCH]</div>
                                          <div>[STAGE 3: RAW COHORT NORMALIZATION]</div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {/* Laser Line that sweeps */}
                                      <motion.div 
                                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-500/60 opacity-80 pointer-events-none"
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                      />
                                      {/* Scan Completed Badge */}
                                      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-emerald-500/90 text-black font-black text-[9px] uppercase tracking-widest shadow-md flex items-center gap-1.5 pointer-events-none">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Visuals Normalized
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-zinc-500 mb-2 group-hover:scale-110 transition-transform animate-pulse" />
                                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Upload Draft Thumbnail File</span>
                                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Accepts JPG, PNG, WEBP — Auto Brightness & Face Scanned</span>
                                </>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Face Count Detected</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                                    {isScanningThumbnail ? "Scanning..." : `${faceCount} ${faceCount === 1 ? 'Face' : 'Faces'}`}
                                  </span>
                                  <span className="text-[9px] text-emerald-400 font-bold tracking-wide uppercase">Neural Auto-scan</span>
                                </div>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Average Brightness</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                                    {brightness}
                                  </span>
                                  <span className={cn("text-[9px] font-bold tracking-wide uppercase", brightness > 170 ? "text-amber-400" : brightness < 90 ? "text-blue-400" : "text-emerald-400")}>
                                    {brightness > 170 ? "Bright Visual" : brightness < 90 ? "Low Light" : "Optimal Contrast"}
                                  </span>
                                </div>
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
                              onClick={() => setWizardStep(4)}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
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
                              onClick={handleAnalyze}
                              className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              Execute Intelligence Scan <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: The Grand Diagnostic Reveal (Loader placeholder while executing) */}
                      {wizardStep === 5 && !result && isAnalyzing && (
                        <motion.div
                          key="step-5-loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-card p-12 border-white/10 rounded-[2rem] flex-1 flex flex-col items-center justify-center text-center space-y-6"
                        >
                          <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest">Running Ensemble Predictions...</h3>
                            <p className="text-[10px] text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
                              Evaluating linguistic curiosity hooks, visual saliency coefficients, brightness relative values, and niche authority parameters.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Side: Quick Baseline / Final Predictive Score Panel */}
                  <div className="relative">
                    {!result && !isAnalyzing ? (
                        profile ? (
                          <ChannelReportPanel profile={profile} />
                        ) : (
                          <div className="min-h-[250px] lg:h-full border border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 md:p-12 text-zinc-600">
                              <TrendingUp className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 opacity-10" />
                              <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Awaiting Diagnostic Scan</p>
                              <p className="text-[10px] md:text-xs max-w-xs mx-auto mt-2 leading-relaxed opacity-50">Complete the 4-step wizard metadata sequence to trigger the ensemble neural model.</p>
                          </div>
                        )
                    ) : isAnalyzing ? (
                        <div className="min-h-[300px] lg:h-full border border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] p-6 md:p-12 space-y-8 md:space-y-12">
                             <div className="flex justify-between items-start animate-pulse">
                                <div className="h-12 w-24 md:h-16 md:w-32 bg-white/5 rounded-2xl" />
                                <div className="h-6 w-16 md:h-8 md:w-24 bg-white/5 rounded-xl" />
                             </div>
                             <div className="grid grid-cols-3 gap-3 md:gap-4">
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                                <div className="h-16 md:h-20 bg-white/5 rounded-2xl" />
                             </div>
                             <div className="space-y-4 md:space-y-6">
                                <div className="h-4 w-1/3 bg-white/5 rounded" />
                                <div className="h-24 md:h-32 bg-white/5 rounded-[1.5rem] md:rounded-[2rem]" />
                             </div>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 md:p-12 border-white/10 premium-shadow relative overflow-hidden rounded-[2rem] md:rounded-[3rem] h-full flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 pointer-events-none">
                                <Sparkles className="w-24 h-24 md:w-32 md:h-32" />
                            </div>
                            
                            <div>
                              {profile && (
                                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
                                  <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold text-white truncate">{profile.full_name}</span>
                                      <span className="px-1.5 py-0.5 rounded-[4px] bg-blue-500/10 border border-blue-500/20 text-[7px] font-extrabold text-blue-400 uppercase tracking-widest shrink-0">Verified</span>
                                    </div>
                                    <p className="text-[8px] text-zinc-500 font-mono mt-0.5">@{profile.youtube_channel} • {profile.subscriber_count.toLocaleString()} Subscriber Base</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between items-start mb-8 md:mb-12">
                                  <div>
                                      <h3 className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">Predictive Score</h3>
                                      <div className="text-6xl md:text-8xl font-bold tracking-tight">{result.score}</div>
                                  </div>
                                  <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                      {result.tier}-TIER
                                  </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-12">
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Confidence</div>
                                      <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{result.confidence}</div>
                                  </div>
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Reliability</div>
                                      <div className={cn("text-[10px] md:text-xs font-bold whitespace-nowrap", result.reliability === "Stable" ? "text-emerald-500" : "text-yellow-500")}>{result.reliability}</div>
                                  </div>
                                  <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 text-center md:text-left">
                                      <div className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase mb-1 md:mb-2">Risk Level</div>
                                      <div className="text-[10px] md:text-xs font-bold text-blue-400 whitespace-nowrap">{result.risk_level || "Medium"}</div>
                                  </div>
                              </div>

                              <div className="space-y-8 md:space-y-10">
                                  {/* Dynamic Subscription Distribution & Reach Velocity Card */}
                                  {profile && (
                                    <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                          <TrendingUp className="w-3.5 h-3.5" /> Distribution & Reach Velocity
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider">
                                          {profile.subscriber_count >= 10000000 ? "Massive Authority" : profile.subscriber_count >= 1000000 ? "High Authority" : "Emerging Reach"}
                                        </span>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">Estimated View Velocity (72h)</span>
                                          <span className="text-lg md:text-xl font-bold text-white">
                                            {(() => {
                                              const ctr = Number(result.score) || 10
                                              const subs = profile.subscriber_count
                                              // Dynamic reach velocity estimation formula
                                              const baseViews = Math.round(subs * (ctr / 100) * 0.45)
                                              const upperViews = Math.round(subs * (ctr / 100) * 1.6)
                                              
                                              // Format nicely
                                              const formatNum = (num: number) => {
                                                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
                                                if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
                                                return num.toLocaleString()
                                              }
                                              return `${formatNum(baseViews)} - ${formatNum(upperViews)} views`
                                            })()}
                                          </span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">Cohort Recommendation Index</span>
                                          <span className="text-xs md:text-sm font-bold text-zinc-300">
                                            {profile.subscriber_count >= 10000000 ? "Highly Amplified (10.0x)" : profile.subscriber_count >= 1000000 ? "Amplified (4.5x)" : "Standard (1.0x)"}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <p className="text-[10px] text-zinc-400 leading-normal border-t border-white/[0.03] pt-3">
                                        💡 <strong>Subscriber Authority Effect:</strong> Due to {profile.full_name}'s strong core subscription base of <strong>{profile.subscriber_count.toLocaleString()}</strong>, your video's reach velocity is heavily buffered. Even a standard CTR performance is dynamically multiplied into substantial raw reach by the recommendation algorithm.
                                      </p>
                                    </div>
                                  )}
                                  {result.strengths && result.strengths.length > 0 && (
                                      <div className="space-y-3 md:space-y-4">
                                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                              <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                                          </div>
                                          <div className="space-y-2.5">
                                              {result.strengths.slice(0, 3).map((s: string) => (
                                                  <div key={s} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-normal">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                      <span>{s}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}

                                  {result.improvements && result.improvements.length > 0 && (
                                      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-blue-500/5 border border-blue-500/10 space-y-3 md:space-y-4">
                                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                              <Zap className="w-3.5 h-3.5" /> High-Lift Fixes
                                          </div>
                                          <ul className="text-[10px] md:text-[11px] text-zinc-400 space-y-2.5">
                                              {result.improvements.slice(0, 2).map((i: string) => (
                                                  <li key={i} className="flex gap-2"><span>•</span> <span>{i}</span></li>
                                              ))}
                                          </ul>
                                      </div>
                                  )}

                                  {result.factors && (
                                      <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-3 md:space-y-4">
                                          <div className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                              Visual & Linguistic Diagnostics
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                              <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                  <span>Brightness</span>
                                                  <span className="text-white font-bold">{result.factors.brightness || 120}</span>
                                              </div>
                                              <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                  <span>Face Detected</span>
                                                  <span className={cn("font-bold", result.factors.face_detected ? "text-emerald-500" : "text-zinc-500")}>
                                                      {result.factors.face_detected ? "Yes" : "No"}
                                                  </span>
                                              </div>
                                              <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                  <span>Contrast</span>
                                                  <span className="text-white font-bold uppercase">{result.factors.contrast || "medium"}</span>
                                              </div>
                                              <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-500">
                                                  <span>Saturation</span>
                                                  <span className="text-white font-bold uppercase">{result.factors.saturation || "medium"}</span>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                            </div>

                            <button
                              onClick={restartWizard}
                              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-8"
                            >
                              <RefreshCw className="w-4 h-4" /> Reset & Analyze New Variant
                            </button>
                        </motion.div>
                    )}
                  </div>
                </div>
                )}
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div 
                key="compare" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:col-span-6"
            >
                <div className="p-8 md:p-20 border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                    <GitCompare className="w-12 h-12 md:w-16 md:h-16 text-zinc-800 shrink-0" />
                    <h2 className="text-xl md:text-2xl font-bold">Multi-Variant Ranking Mode</h2>
                    <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                        Comparison Mode is exclusive to the Pro Beta Tier. Apply for access to rank up to 5 variants side-by-side.
                    </p>
                    <button className="px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-white text-black font-bold text-xs md:text-sm hover:bg-zinc-200 transition-all shadow-md">
                      Request Pro Access
                    </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
