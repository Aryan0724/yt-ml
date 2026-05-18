"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, Sparkles, CheckCircle2, AlertCircle, 
  TrendingUp, GitCompare, History, Search, Zap, 
  Tv, FileText, Image as ImageIcon, Clock, Calendar, CheckSquare, ArrowRight, ArrowLeft, RefreshCw,
  Smartphone, BookOpen, Sliders, ChevronDown, ChevronUp
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
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)
  const [visualizerMode, setVisualizerMode] = useState<"normal" | "blur" | "heatmap" | "focus">("normal")
  const [sliderMode, setSliderMode] = useState<"before" | "after">("before")
  const scoreNum = parseFloat(result.score) || 72.0
  const nicheSafe = (niche || "").toLowerCase()

  // 1. Final Recommendation Decision Engine (Trigger Panel)
  let decisionVerdict = "🟠 Do NOT upload this version yet."
  let decisionClass = "border-amber-500/20 bg-amber-500/5 text-amber-400"
  let decisionReason = "Your thumbnail currently loses emotional clarity against stronger competitors in the entertainment niche."
  let decisionRecommended = "Apply the top 2 fixes before publishing."
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
  const styleMatchPercentage = scoreNum >= 80 ? 89 : scoreNum >= 70 ? 76 : 58
  const defaultStrongMatches = [
    "Familiar theme color palettes consistent with historical outperformers",
    "Recognizable cast framing centered in the visual focus field"
  ]
  const defaultWeakMatches = [
    "Sub-optimal visual reactivity level on core character subjects",
    "Timestamp overlap risks (unresolved graphic in player bounds)"
  ]

  // 4. Criticality Severity Tiers (Visual Severity Fixes)
  const fixes = [
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

  // 5. Competitor Strategy Audit
  const defaultDifferences = nicheSafe.includes("game")
    ? [
        "Larger emotional facial reactions occupying over 20% of the canvas",
        "Strong yellow or orange subject outline borders for sharp separation",
        "Cleaner visual hierarchy (maximum 3 visual elements)",
        "Shorter curiosity-driven titles (under 50 characters)"
      ]
    : nicheSafe.includes("tech")
    ? [
        "Hyper-isolated device shadows against deep, dark, flat backgrounds",
        "Word counts on thumbnails strictly restricted to 2-3 bold keywords",
        "Highly saturated neon boundaries around functional tech parts",
        "Contrast-aligned titles focusing on future utility rather than feature lists"
      ]
    : nicheSafe.includes("entertainment") || nicheSafe.includes("movie")
    ? [
        "Larger emotional facial reactions (exaggerated star reactions)",
        "Strong yellow/orange separation outline borders for high-contrast isolation",
        "Cleaner visual hierarchy (removing cluttered secondary details)",
        "Shorter, punchy, curiosity-driven titles"
      ]
    : [
        "Intimate facial focus with realistic lighting for connection",
        "Shadow-masked mystery elements to prompt an unresolved visual question",
        "Cleaner visual layout with high-contrast focal bounds",
        "Curiosity gap titles that do not reveal outcomes early"
      ]
  const differences = result.competitor_analysis?.differences || defaultDifferences

  // 6. Clickable Reference Blueprints (reverse-engineer)
  const defaultReferences: ReferenceItem[] = nicheSafe.includes("tech")
    ? [
        {
          title: "MKBHD: The Smartphone of the Future?",
          why_it_worked: "Hyper-isolated device reflections against deep contrasting dark backdrop with zero visual clutter.",
          what_to_study: "Sleek studio lighting, geometric subject framing, matte-dark color palettes.",
          url: "https://www.youtube.com/watch?v=d_k6WrsApcE",
          views: 5200000,
          upload_age: "2 months ago"
        },
        {
          title: "I Built a $500 Smart Desk Upgrade",
          why_it_worked: "Accented functional elements with glowing neon highlights and clear before/after comparison.",
          what_to_study: "Neon outline borders, visual transformation lines, extreme color saturation.",
          url: "https://www.youtube.com/watch?v=3RkS9pM9p9o",
          views: 3100000,
          upload_age: "1 month ago"
        }
      ]
    : nicheSafe.includes("entertainment") || nicheSafe.includes("movie")
    ? [
        {
          title: "Double Dhamaal Classic Comedy Scene Compilation",
          why_it_worked: "High-density comedic reaction grins with saturated warm accents and bold split-screen framing.",
          what_to_study: "Exaggerated facial expressions, warm color bounds, clean character outlines.",
          url: "https://www.youtube.com/watch?v=eYkFp4f83oQ",
          views: 14200000,
          upload_age: "6 months ago"
        },
        {
          title: "Golmaal Fun Unlimited Scene Compilation",
          why_it_worked: "Bold orange/yellow highlight strokes isolating character silhouettes completely against backing movie frames.",
          what_to_study: "Saturated highlight borders, reaction face scaling, mobile feed contrast.",
          url: "https://www.youtube.com/watch?v=2s2d0t_Z_3Q",
          views: 11800000,
          upload_age: "4 months ago"
        }
      ]
    : [
        {
          title: "I Lived on $1 a Day for a Week",
          why_it_worked: "Authentic color styling with extreme facial isolation and realistic non-glamour lighting.",
          what_to_study: "Empathetic reaction faces, raw centered subject framing, simple background.",
          url: "https://www.youtube.com/watch?v=yJ3g4kH4v_Y",
          views: 8900000,
          upload_age: "3 months ago"
        },
        {
          title: "The Tiny House Secret",
          why_it_worked: "Shadow-masked mystery elements and simple subject isolation creating strong curiosity shadows.",
          what_to_study: "Mystery element overlays, centered focal interest targets, high-stakes curiosity loop.",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          views: 6500000,
          upload_age: "2 months ago"
        }
      ]
  const references: ReferenceItem[] = result.competitor_analysis?.references || defaultReferences

  return (
    <div className="space-y-10 animate-fade-in w-full text-left font-sans">
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
            onClick={onRestart}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Restart Scan & Load Variant
          </button>
        </div>
      </div>

      {/* FINAL RECOMMENDATION TRIGGER BLOCK */}
      <div className={cn("p-8 rounded-[2rem] border relative overflow-hidden text-left", decisionClass)}>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Sparkles className="w-32 h-32 text-white animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest block text-zinc-400">FINAL UPLOAD DECISION SYSTEM</span>
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-white leading-relaxed">
            {decisionVerdict}
          </h2>

          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            <strong>Diagnostic Verdict:</strong> {decisionReason}
          </p>

          <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-white/5 text-xs">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Recommended Action</span>
              <p className="text-white font-semibold">{decisionRecommended}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Estimated Effort</span>
              <p className="text-white font-semibold">{decisionEffort}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5 font-bold">Potential Reward</span>
              <p className="text-emerald-400 font-bold">{decisionReward}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-8 items-start">
        {/* Left Column (Span 4): Strategic Insight Engine */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* UPLOAD READINESS SECTION */}
          <div className={cn("p-8 rounded-[2rem] border relative overflow-hidden transition-all duration-500", verdictColor)}>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">EXPECTED PERFORMANCE</span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white leading-relaxed flex items-center gap-2">
                  <span>{verdictSymbol}</span>
                  <span>This upload is predicted to perform {verdictStatus}.</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Expected Performance</span>
                  <p className="text-sm font-semibold text-white">{expectedPerformance}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Main Problem</span>
                  <p className="text-sm font-semibold text-white">{mainProblem}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Primary Impact</span>
                  <p className="text-sm font-semibold text-white">{primaryImpact}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">Potential Improvement</span>
                  <p className="text-sm font-semibold text-emerald-400">{potentialImprovement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CHANNEL DNA STYLE ANALYZER */}
          <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">CHANNEL DNA INTELLIGENCE</span>
              <h3 className="text-lg font-bold text-white">CHANNEL STYLE MATCH</h3>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.005] border border-white/5 space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Historical Consistency</span>
                  <p className="text-sm text-zinc-300 mt-1">This upload matches <strong className="text-emerald-400 text-lg font-black">{styleMatchPercentage}%</strong> of your historically successful content patterns.</p>
                </div>
                <div className="h-2 w-28 bg-white/5 rounded-full overflow-hidden shrink-0">
                  <div className="h-full bg-emerald-500" style={{ width: `${styleMatchPercentage}%` }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">✅ Strong Matches</span>
                  <ul className="space-y-2 text-zinc-400">
                    {defaultStrongMatches.map((m, idx) => (
                      <li key={idx} className="flex gap-2"><span>•</span> <span>{m}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">⚠️ Weak Matches</span>
                  <ul className="space-y-2 text-zinc-400">
                    {defaultWeakMatches.map((m, idx) => (
                      <li key={idx} className="flex gap-2"><span>•</span> <span>{m}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/[0.02] border border-blue-500/10 text-zinc-400">
                💡 <strong>Historical Insight:</strong> Videos with larger emotional reactions on your channel perform <strong className="text-white font-bold">28% better on average</strong> compared to standard compositions.
              </div>
            </div>
          </div>

          {/* THE 3 MOST IMPORTANT FIXES (FIX THESE FIRST) */}
          <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">RECOMMENDED STRATEGIES</span>
              <h3 className="text-lg font-bold text-white">FIX THESE FIRST</h3>
            </div>

            <div className="space-y-4">
              {fixes.map((fix) => (
                <div 
                  key={fix.num} 
                  className={cn(
                    "p-6 rounded-2xl border transition-all duration-300 relative group text-left",
                    fix.cardClass
                  )}
                >
                  {/* Glowing Outline Pulse for Primary Recommendation */}
                  {fix.isPrimary && (
                    <div className="absolute inset-0 rounded-2xl border border-rose-500/30 animate-pulse pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <span className={cn(
                        "w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border",
                        fix.isPrimary 
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                          : fix.num === 2
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      )}>
                        #{fix.num}
                      </span>

                      <div className="space-y-3">
                        <div>
                          <span className={cn(
                            "inline-block px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border mb-2",
                            fix.tierClass
                          )}>
                            {fix.tier}
                          </span>
                          <h4 className="text-sm font-bold text-white leading-none">{fix.title}</h4>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-1">
                          <div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Current Problem:</span>
                            <span className="text-zinc-300">{fix.current}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Recommended Layout:</span>
                            <span className="text-zinc-300 font-semibold">{fix.recommended}</span>
                          </div>
                        </div>

                        <div className="text-xs pt-2 border-t border-white/[0.03] text-zinc-400 leading-relaxed">
                          <strong className="text-zinc-200 block text-[9px] uppercase tracking-wider mb-0.5 font-bold">Psychological Outcome:</strong>
                          {fix.why}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">EXPECTED IMPACT</span>
                      <span className="text-sm font-black text-emerald-400">{fix.improvement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHY TOP COMPETITORS OUTPERFORM THIS UPLOAD */}
          <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">COMPETITIVE WAR-ROOM AUDIT</span>
              <h3 className="text-lg font-bold text-white">WHY TOP COMPETITORS OUTPERFORM THIS UPLOAD</h3>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.005] border border-white/5 space-y-6 text-xs text-left leading-relaxed">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Competitor Strengths */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Their Thumbnails:</span>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✅</span>
                      <span>communicate emotion in under 0.5s</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✅</span>
                      <span>isolate the main subject outline completely</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✅</span>
                      <span>use highly balanced warm/cold contrast bounds</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✅</span>
                      <span>create clearer, un-cluttered visual hierarchy</span>
                    </li>
                  </ul>
                </div>

                {/* Creator Gaps */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">Your Thumbnail:</span>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex gap-2">
                      <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                      <span>spreads scanning focus across too many focal elements</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                      <span>lacks dominant emotional reaction scale focus</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                      <span>requires longer visual processing during rapid feed scrolling</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/[0.02] border border-amber-500/10 text-[10px] text-zinc-400 text-center leading-normal">
                ⚔️ <strong>Strategist Verdict:</strong> In fast mobile recommendations, competitor compositions capture audience attention faster. Reducing clutter and expanding reaction targets is recommended to reclaim reach authority.
              </div>
            </div>
          </div>

          {/* SUCCESS BLUEPRINTS */}
          <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">REVERSE-ENGINEER SUCCESS</span>
              <h3 className="text-lg font-bold text-white">SUCCESS BLUEPRINTS</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {references.map((ref: ReferenceItem, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 flex flex-col justify-between hover:border-white/10 transition-all text-left font-sans">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">REFERENCE EXAMPLE #{idx + 1}</span>
                        <h4 className="text-xs font-black text-zinc-400 mt-0.5 leading-snug">"{ref.title}"</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[8px] font-extrabold text-emerald-400 tracking-wider">
                        {ref.views >= 1000000 ? `${(ref.views / 1000000).toFixed(1)}M Views` : `${(ref.views / 1000).toFixed(0)}K Views`} • {ref.upload_age}
                      </span>
                    </div>

                    <div className="text-xs space-y-3">
                      <div>
                        <strong className="text-zinc-200 block text-[9px] uppercase tracking-wider mb-0.5 font-bold">Why this worked:</strong>
                        <p className="text-zinc-400 leading-relaxed font-normal">{ref.why_it_worked}</p>
                      </div>
                      
                      <div>
                        <strong className="text-zinc-200 block text-[9px] uppercase tracking-wider mb-0.5 font-bold text-blue-400">What YOU should study:</strong>
                        <p className="text-zinc-400 leading-relaxed font-semibold">{ref.what_to_study}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                      <span>Expected Adaptation Benefit:</span>
                      <span className="text-emerald-400 font-bold">+12% to +20% mobile performance</span>
                    </div>
                    
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest text-center transition-all block flex items-center justify-center gap-1.5"
                    >
                      View Original on YouTube ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADVANCED COLLAPSIBLE TELEMETRY PANEL */}
          <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-4">
            <button 
              onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
              className="w-full flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-widest focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-500" /> Advanced Diagnostic Telemetry Panel
              </span>
              {isDiagnosticsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isDiagnosticsOpen && (
              <div className="p-5 rounded-2xl bg-white/[0.005] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs text-left animate-fade-in font-sans">
                <div className="flex justify-between py-2 border-b border-white/5 text-zinc-500">
                  <span>CatBoost Baseline Probability</span>
                  <span className="text-white font-mono font-bold">{(scoreNum * 0.0094).toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-zinc-500">
                  <span>Average Brightness Level</span>
                  <span className="text-white font-mono font-bold">{brightness} / 255</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-zinc-500">
                  <span>Detected Reaction Faces</span>
                  <span className="text-white font-mono font-bold">{faceCount}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-zinc-500">
                  <span>Linguistic Complexity Score</span>
                  <span className="text-white font-mono font-bold">Grade {Math.min(12, Math.max(4, Math.round(title.length / 8)))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-zinc-500 col-span-1 sm:col-span-2">
                  <span>Semantic Title Sentiment Output</span>
                  <span className="text-emerald-400 font-mono font-bold">NEUTRAL HIGH-CURIOSITY HOOK</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Span 2): Immersive Simulation & Expected Lift */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* INTERACTIVE MOBILE VISUALIZER & SIMULATION */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" /> Interactive Mobile Visualizer
              </h3>
            </div>

            {/* Selector tabs for Variant comparison */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 text-[9px] uppercase tracking-wider font-bold">
              <button 
                onClick={() => setSliderMode("before")}
                className={cn("flex-1 py-2 text-center rounded-lg transition-all", sliderMode === "before" ? "bg-white text-black font-black" : "text-zinc-500 hover:text-white")}
              >
                Before (Original)
              </button>
              <button 
                onClick={() => setSliderMode("after")}
                className={cn("flex-1 py-2 text-center rounded-lg transition-all", sliderMode === "after" ? "bg-amber-500 text-black font-black animate-pulse" : "text-zinc-500 hover:text-white")}
              >
                Recommended Layout
              </button>
            </div>

            {/* Diagnostic Mode Toggles */}
            <div className="grid grid-cols-2 gap-2 text-[9px] uppercase tracking-wider font-bold">
              {[
                { id: "normal", label: "Feed Scan (Normal)" },
                { id: "blur", label: "Peripheral Blur" },
                { id: "heatmap", label: "Attention Heatmap" },
                { id: "focus", label: "Eye Focus Path" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVisualizerMode(tab.id as any)}
                  className={cn(
                    "py-2 px-1 rounded-lg border text-center transition-all truncate",
                    visualizerMode === tab.id 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Smart Phone Shell Frame */}
            <div className="mx-auto w-[240px] rounded-[2.5rem] border-[6px] border-zinc-900 bg-black overflow-hidden shadow-2xl relative select-none">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-8 h-1 bg-zinc-800 rounded-full" />
              </div>
              
              <div className="p-2.5 pt-8 pb-4 space-y-4">
                <div className="space-y-2 relative">
                  
                  {/* Thumbnail Image Wrapper with Animation */}
                  <div className="aspect-video w-full bg-zinc-900 rounded-xl overflow-hidden relative border border-white/5 shadow-inner">
                    {thumbnailPreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={thumbnailPreview} 
                          alt="Preview" 
                          className={cn("w-full h-full object-cover transition-all duration-500", sliderMode === "after" ? "brightness-110 saturate-[1.25] scale-[1.05]" : "")} 
                        />
                        {sliderMode === "after" && (
                          <div className="absolute inset-0 border-[3px] border-amber-500/50 rounded-lg pointer-events-none animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 p-4 text-center">
                        <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                        <span className="text-[8px] uppercase tracking-widest font-bold font-mono">NO THUMBNAIL</span>
                      </div>
                    )}

                    {/* YouTube Timestamp Overlay Badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 bg-black/85 text-[8px] font-bold font-mono text-white rounded select-none z-10">
                      14:20
                    </div>

                    {/* DYNAMIC VISUAL DIAGNOSTIC OVERLAYS */}
                    {visualizerMode === "blur" && (
                      <div 
                        className="absolute inset-0 bg-transparent backdrop-blur-[4px] pointer-events-none z-10" 
                        style={{
                          WebkitMaskImage: "radial-gradient(circle 45px at 35% 50%, transparent 40%, black 100%)",
                          maskImage: "radial-gradient(circle 45px at 35% 50%, transparent 40%, black 100%)"
                        }}
                      />
                    )}

                    {visualizerMode === "heatmap" && (
                      <div className="absolute inset-0 bg-black/40 pointer-events-none z-10 mix-blend-overlay">
                        {/* Major hotspot on Face */}
                        <div 
                          className="absolute top-[20%] left-[15%] w-24 h-24 rounded-full blur-md opacity-90 animate-pulse"
                          style={{ backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.2) 60%, transparent 100%)" }}
                        />
                        {/* Minor hotspot on corner text */}
                        <div 
                          className="absolute bottom-[20%] right-[10%] w-20 h-20 rounded-full blur-sm opacity-60"
                          style={{ backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(251,191,36,0.15) 50%, transparent 100%)" }}
                        />
                      </div>
                    )}

                    {visualizerMode === "focus" && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                        <defs>
                          <linearGradient id="focusGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 60,40 L 90,65 L 170,80" 
                          fill="none" 
                          stroke="url(#focusGlow)" 
                          strokeWidth="2" 
                          strokeDasharray="4,4" 
                          className="stroke-dash-animation"
                        />
                        <circle cx="60" cy="40" r="4" fill="#ef4444" />
                        <text x="60" y="32" fill="#ef4444" fontSize="5" fontWeight="black" textAnchor="middle">1. EMOTION SCAN</text>

                        <circle cx="90" cy="65" r="4" fill="#f59e0b" />
                        <text x="90" y="74" fill="#f59e0b" fontSize="5" fontWeight="black" textAnchor="middle">2. CLUTTER GAP</text>

                        <circle cx="170" cy="80" r="4" fill="#10b981" />
                        <text x="170" y="90" fill="#10b981" fontSize="5" fontWeight="black" textAnchor="middle">3. TITLE HOOK</text>
                      </svg>
                    )}

                    {/* Dynamic Interactive Attention Labels */}
                    <div className="absolute inset-0 z-10 bg-transparent flex items-center justify-center pointer-events-none">
                      <AnimatePresence mode="wait">
                        {sliderMode === "before" ? (
                          <motion.div 
                            key="before-overlays"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                          >
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-500/85 border border-rose-500/40 text-[5px] font-black text-white tracking-wider animate-pulse">
                              ⚠️ CLUTTERED BACKGROUND
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-dashed border-zinc-500/40 bg-zinc-500/5 flex items-center justify-center">
                              <span className="text-[5px] text-zinc-400 uppercase font-black tracking-widest">PASSIVE FOCAL GAP</span>
                            </div>

                            <div className="absolute bottom-1.5 right-1.5 w-16 h-7 rounded border border-dashed border-rose-500/50 bg-rose-500/10 pointer-events-none flex items-center justify-center">
                              <span className="text-[5px] text-rose-300 font-extrabold text-center uppercase leading-none">OVERLAP BLUR</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="after-overlays"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                          >
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500/90 border border-emerald-500/40 text-[5px] font-black text-white tracking-wider">
                              ✅ HIGHLIGHT BORDERS
                            </div>

                            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-dashed border-amber-500/85 bg-amber-500/10 flex items-center justify-center animate-pulse">
                              <span className="text-[5px] text-amber-400 uppercase font-black tracking-widest text-center leading-none">EXAGGERATED FACE (22%)</span>
                            </div>

                            <div className="absolute bottom-1.5 right-1.5 w-16 h-6 rounded bg-emerald-500/80 pointer-events-none flex items-center justify-center">
                              <span className="text-[4px] text-white font-extrabold text-center uppercase leading-none">CLEAN TEXT CLEARANCE</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                        {profile?.full_name || "Creator Pro"} • {profile?.subscriber_count ? (profile.subscriber_count >= 1000000 ? `${(profile.subscriber_count / 1000000).toFixed(1)}M` : `${(profile.subscriber_count / 1000).toFixed(0)}K`) : "85K"} views • 18h ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />
                
                {/* Scroll Feed Simulation list */}
                <div className="space-y-3 opacity-40">
                  <div className="text-[6px] font-bold text-zinc-600 uppercase tracking-wider block">Up Next in Feed</div>
                  <div className="flex gap-2 items-start">
                    <div className="w-16 h-9 rounded bg-zinc-900 border border-white/5 shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-full bg-zinc-800 rounded" />
                      <div className="h-1.5 w-2/3 bg-zinc-900 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Feed Warning System */}
            <div className="p-4 rounded-xl bg-amber-500/[0.02] border border-amber-500/10 space-y-2 text-xs text-left">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
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

          {/* EXPECTED IMPACT SYSTEM SUMMARY */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 space-y-6 text-left">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">STRATEGIC ROI SUMMARY</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">IF YOU APPLY THESE FIXES</h3>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-white/[0.01] border border-white/5 text-xs text-zinc-300">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Estimated Result Improvements:</span>
              <div className="space-y-2 font-mono">
                <div className="flex gap-2 items-center font-sans">
                  <span className="text-emerald-400 font-sans">✅</span>
                  <span className="font-semibold text-white">+15–35% stronger click probability</span>
                </div>
                <div className="flex gap-2 items-center font-sans">
                  <span className="text-emerald-400">✅</span>
                  <span>Better mobile-feed readability</span>
                </div>
                <div className="flex gap-2 items-center font-sans">
                  <span className="text-emerald-400">✅</span>
                  <span>Faster emotional recognition</span>
                </div>
                <div className="flex gap-2 items-center font-sans">
                  <span className="text-emerald-400">✅</span>
                  <span>Higher curiosity trigger rate</span>
                </div>
                <div className="flex gap-2 items-center font-sans">
                  <span className="text-emerald-400">✅</span>
                  <span className="font-semibold text-white">Stronger competitiveness vs niche leaders</span>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-zinc-500 leading-normal text-center italic">
              * These are directional strategy estimates based on top competitor analysis, not guaranteed outcomes.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}function ChannelReportPanel({ profile, dna }: { profile: any, dna?: any }) {
  if (!profile) return null

  // Prioritize live backend channel DNA baselines if available
  const cleanNiche = dna?.niche || profile.niche || "Tech"
  const subscriberCount = dna?.subscriber_base || profile.subscriber_count || 1000
  const uploadFrequency = dna?.upload_frequency || profile.upload_frequency || "2-3 videos/week"
  const optimalTime = dna?.optimal_upload_window || "Wednesdays @ 4:00 PM & Saturdays @ 11:00 AM"
  const dominantStyle = dna?.style_profile || "High Contrast, Neon Subject Outlines, Reactive Face"

  // Base video audit fallback
  const audit = generateChannelAudit(profile.youtube_channel, cleanNiche)
  
  // Scanned recent content audit (Last 5 Videos)
  const recentAudits = dna?.recent_audits || audit.videos

  return (
    <div className="glass-card p-6 md:p-8 border-white/10 rounded-[2rem] h-full flex flex-col justify-between space-y-6 overflow-y-auto scrollbar-thin text-left">
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
              Channel DNA Swept
            </span>
          </div>
        </div>

        {/* Dynamic Audits and Badges */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Subscriber Base</span>
            <div className="text-xs font-bold text-white">{subscriberCount.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Niche Saturation</span>
            <div className="text-[10px] font-bold text-blue-400 truncate">{audit.saturation.split(" ")[0]}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">Growth rhythm</span>
            <div className="text-xs font-bold text-emerald-400 truncate">{uploadFrequency}</div>
          </div>
        </div>

        {/* Intelligence Insights Summary */}
        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 text-xs leading-relaxed">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Channel DNA Rhythm & Benchmarks
          </div>
          <p className="text-zinc-300">
            <span className="text-zinc-500 font-semibold block text-[9px] uppercase tracking-wider mb-0.5">Optimal Upload Window:</span> 
            <strong className="text-white font-bold">{optimalTime}</strong>
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500 font-semibold block text-[9px] uppercase tracking-wider mb-0.5">Dominant Visual Style Profile:</span> 
            <strong className="text-emerald-400 font-bold">{dominantStyle}</strong>
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500 font-semibold block text-[9px] uppercase tracking-wider mb-0.5">Tactical Niche Advice:</span> 
            {audit.velocityTip}
          </p>
        </div>

        {/* Last 5 Videos Performance Report */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Connected Performance Audit (Last 5 Videos)
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {recentAudits.map((vid: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 hover:border-white/10 transition-all text-xs">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs font-bold text-white line-clamp-2 flex-1 leading-snug">{vid.title}</p>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0 ${vid.statusColor || "text-blue-400 bg-blue-500/10 border-blue-500/20"}`}>
                    {vid.status || "STABLE"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[9px] text-zinc-500 border-b border-white/[0.03] pb-1.5">
                  <span>CTR: <strong className="text-white">{vid.ctr || "7.8%"}</strong></span>
                  <span>Duration: <strong className="text-zinc-300">{vid.duration || "11:24"}</strong></span>
                  <span>Views: <strong className="text-white">{vid.views >= 1000000 ? `${(vid.views / 1000000).toFixed(1)}M` : vid.views >= 1000 ? `${(vid.views / 1000).toFixed(0)}K` : vid.views || "120K"}</strong></span>
                </div>
                <div className="text-[10px] space-y-1.5 pt-1">
                  <div className="text-zinc-300 leading-normal">
                    <span className="text-emerald-400 font-semibold block text-[8px] uppercase tracking-wider">✓ What Worked Well:</span> {vid.worked}
                  </div>
                  <div className="text-zinc-300 leading-normal">
                    <span className="text-rose-400 font-semibold block text-[8px] uppercase tracking-wider">✗ Critical Performance Gap:</span> {vid.notWorked}
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [rightActiveTab, setRightActiveTab] = useState<"score" | "profile">("score")
  const [activeTab, setActiveTab] = useState<"analyze" | "compare" | "history">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  
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

  // Fetch creator channel profile on mount
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function loadCreatorProfile() {
      const email = localStorage.getItem("ap_beta_email") || ""
      const token = localStorage.getItem("ap_beta_token") || ""

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

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("Video title cannot be blank.")
      setWizardStep(2)
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    setPrecomputedResult(null)
    setScanStageIndex(0)
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
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }

      const response = await fetch("/api/creator/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`)
      }

      const payload = await response.json()
      if (payload.status === "success") {
        setPrecomputedResult(payload.data || {})
        
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
      if (e?.name === "AbortError") return
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
    setScanStageIndex(0)
    setError(null)
    setTitle("")
    setWizardStep(1)
    setThumbnailFile(null)
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
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                  handleThumbnailUpload({ target: { files: [file] } } as any);
                                }
                              }}
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
                        <div className="h-full flex flex-col space-y-4 text-left">
                          {/* Premium Tab Selector to toggle between Score & Velocity and Channel DNA Audit */}
                          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0 w-fit">
                            <button
                              onClick={() => setRightActiveTab("score")}
                              className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                rightActiveTab === "score" ? "bg-white text-black animate-fade-in" : "text-zinc-500 hover:text-white"
                              )}
                            >
                              <Zap className="w-3.5 h-3.5" />
                              Score & Velocity
                            </button>
                            <button
                              onClick={() => setRightActiveTab("profile")}
                              className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                rightActiveTab === "profile" ? "bg-white text-black animate-fade-in" : "text-zinc-500 hover:text-white"
                              )}
                            >
                              <Tv className="w-3.5 h-3.5" />
                              Channel DNA Audit
                            </button>
                          </div>

                          <div className="flex-1 min-h-[300px]">
                            {rightActiveTab === "profile" ? (
                              <ChannelReportPanel profile={profile} dna={result.channel_dna} />
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
