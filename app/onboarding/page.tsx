"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Youtube,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Dna,
  BarChart3,
  Image as ImageIcon,
  FileText,
  Search,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Layers,
  HelpCircle
} from "lucide-react"
import {
  YouTubeChannel,
  getStoredSession,
  getConnectedYouTubeChannel,
  setConnectedYouTubeChannel,
  saveOnboardingPreferences
} from "@/lib/api/auth"
import { trackFunnelEvent } from "@/lib/analytics/events"
import { YouTubeConnectModal } from "@/components/auth/youtube-connect-modal"

type OnboardingStep = "connect" | "select_channel" | "personalize" | "activating"

const CONTENT_TYPES = [
  "Education",
  "Entertainment",
  "Gaming",
  "Technology",
  "Finance",
  "Lifestyle",
  "Business",
  "Other"
]

const GROWTH_GOALS = [
  "Grow subscribers",
  "Increase video views",
  "Improve CTR",
  "Understand competitors",
  "Improve content quality",
  "Build content strategy"
]

const PUBLISHING_FREQUENCIES = [
  "Daily",
  "2–3 times a week",
  "Weekly",
  "Occasionally"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("connect")
  const [connectedChannel, setChannel] = useState<YouTubeChannel | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [loadingOAuth, setLoadingOAuth] = useState(false)

  // Personalization Answers
  const [contentType, setContentType] = useState<string>("Technology")
  const [growthGoal, setGrowthGoal] = useState<string>("Improve CTR")
  const [frequency, setFrequency] = useState<string>("Weekly")
  const [savingPrefs, setSavingPrefs] = useState(false)

  // Progressive Activation State
  const [activationProgress, setActivationProgress] = useState(0)
  const [pipelineSteps, setPipelineSteps] = useState([
    { title: "Channel connected", status: "complete" },
    { title: "Fetching video library", status: "pending" },
    { title: "Analyzing performance", status: "pending" },
    { title: "Building channel DNA", status: "pending" },
    { title: "Preparing insights", status: "pending" }
  ])

  // Check initial session & channel state
  useEffect(() => {
    const session = getStoredSession()
    if (!session?.access_token) {
      router.push("/login?redirect=/onboarding")
      return
    }

    const channel = getConnectedYouTubeChannel() || session.user.youtube_channel
    if (channel) {
      setChannel(channel)
      // If already connected, move directly to personalization
      setStep("personalize")
    }
  }, [router])

  // Initiate YouTube OAuth or Handle Modal
  const handleConnectYouTube = async () => {
    trackFunnelEvent("youtube_connect_clicked")
    setLoadingOAuth(true)
    try {
      // Check if full Google/YouTube OAuth is configured
      const res = await fetch("/api/auth/google/url")
      const data = await res.json()

      if (data.configured && data.url) {
        window.location.href = data.url
        return
      }

      // If OAuth credentials need consent screen approval, open direct verified Data API modal
      setShowConnectModal(true)
    } catch {
      setShowConnectModal(true)
    } finally {
      setLoadingOAuth(false)
    }
  }

  // Handle Channel Connected from Modal
  const handleChannelConnected = (channel: YouTubeChannel) => {
    trackFunnelEvent("youtube_channel_selected", { channelId: channel.id, handle: channel.handle })
    setChannel(channel)
    setConnectedYouTubeChannel(channel)
    setStep("personalize")
  }

  // Save Personalization and Start Progressive Activation
  const handleCompletePersonalization = async (skip = false) => {
    trackFunnelEvent("onboarding_completed", { skipped: skip, category: contentType, goal: growthGoal })
    trackFunnelEvent("first_analysis_started")
    setSavingPrefs(true)
    try {
      if (!skip) {
        await saveOnboardingPreferences({
          creatorCategory: contentType,
          primaryGoal: growthGoal,
          publishingFrequency: frequency
        })
      }
    } catch (e) {
      console.warn("Could not save preferences to backend:", e)
    } finally {
      setSavingPrefs(false)
      setStep("activating")
      startProgressiveActivation()
    }
  }

  // Progressive Pipeline Animation
  const startProgressiveActivation = () => {
    const durations = [700, 1200, 1400, 1000]

    // Step 2: Fetching Video Library
    setTimeout(() => {
      setActivationProgress(25)
      setPipelineSteps((prev) => [
        prev[0],
        { title: "Fetching video library", status: "complete" },
        { title: "Analyzing performance", status: "processing" },
        prev[3],
        prev[4]
      ])
    }, durations[0])

    // Step 3: Analyzing Performance
    setTimeout(() => {
      setActivationProgress(55)
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        { title: "Analyzing performance", status: "complete" },
        { title: "Building channel DNA", status: "processing" },
        prev[4]
      ])
    }, durations[0] + durations[1])

    // Step 4: Building Channel DNA
    setTimeout(() => {
      setActivationProgress(80)
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { title: "Building channel DNA", status: "complete" },
        { title: "Preparing insights", status: "processing" }
      ])
    }, durations[0] + durations[1] + durations[2])

    // Step 5: Preparing Insights & Redirect
    setTimeout(() => {
      setActivationProgress(100)
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        prev[3],
        { title: "Preparing insights", status: "complete" }
      ])

      setTimeout(() => {
        trackFunnelEvent("dashboard_activated")
        router.push("/dashboard")
      }, 800)
    }, durations[0] + durations[1] + durations[2] + durations[3])
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Dot Texture */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40" />

      {/* Red Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-red-100/30 blur-3xl pointer-events-none rounded-full" />

      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 text-center mb-8">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Image
            src="/preyt-logo-light.png"
            alt="PreYT"
            width={130}
            height={40}
            className="h-9 w-auto mx-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">

        {/* STEP 1: CONNECT YOUTUBE CHANNEL */}
        {step === "connect" && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wide uppercase mb-2">
                <Youtube className="w-4 h-4 fill-red-600" />
                <span>Creator Intelligence Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Let&apos;s connect your YouTube channel.
              </h1>
              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
                PreYT becomes exponentially more powerful when it understands your channel&apos;s baseline, audience retention, and packaging DNA.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                { icon: Dna, title: "Channel DNA Analysis", desc: "Automated calibration of your creator archetype & visual style" },
                { icon: BarChart3, title: "Performance Intelligence", desc: "True packaging CTR benchmarks calibrated to your niche" },
                { icon: ImageIcon, title: "Thumbnail Forensics", desc: "Pre-upload contrast, text density & visual safe-zone audit" },
                { icon: FileText, title: "Title & Hook Analysis", desc: "Mobile viewport title truncation and curiosity gap detection" },
                { icon: Search, title: "Competitor Intelligence", desc: "Track competitor breakout videos and comment demand gaps" },
                { icon: Sparkles, title: "Personalized Video Ideas", desc: "Algorithmic topic opportunities calibrated to your subscribers" }
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200/60 hover:bg-neutral-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-xs">
                    <b.icon className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">{b.title}</h3>
                    <p className="text-[11px] text-neutral-500 leading-snug mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleConnectYouTube}
                disabled={loadingOAuth}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm transition-all cursor-pointer group"
              >
                {loadingOAuth ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <Youtube className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                    <span>CONNECT YOUTUBE CHANNEL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("personalize")}
                className="w-full text-center py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                I&apos;LL DO THIS LATER
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-mono text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Read-only permissions. PreYT will never modify or post to your channel.</span>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONALIZATION (MAX 3 QUESTIONS) */}
        {step === "personalize" && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            {connectedChannel && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50/60 border border-red-200/70">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0 relative">
                  {connectedChannel.avatarUrl ? (
                    <Image
                      src={connectedChannel.avatarUrl}
                      alt={connectedChannel.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Youtube className="w-5 h-5 text-red-600 m-2.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 truncate">{connectedChannel.title}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">{connectedChannel.handle} · Connected</span>
                </div>
              </div>
            )}

            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight">
                Personalize your intelligence engine.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                Help PreYT tailor CTR forecasts and topic recommendations specifically to your publishing workflow.
              </p>
            </div>

            {/* QUESTION 1 */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                1. What type of content do you create?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setContentType(cat)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      contentType === cat
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 2 */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                2. What is your primary growth goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GROWTH_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setGrowthGoal(goal)}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      growthGoal === goal
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span>{goal}</span>
                    {growthGoal === goal && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 3 */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                3. How frequently do you publish?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PUBLISHING_FREQUENCIES.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      frequency === freq
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => handleCompletePersonalization(false)}
                disabled={savingPrefs}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm transition-all cursor-pointer"
              >
                {savingPrefs ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Finish Setup & Launch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCompletePersonalization(true)}
                className="w-full text-center py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                Skip questions
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROGRESSIVE FIRST-TIME DASHBOARD ACTIVATION */}
        {step === "activating" && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center mx-auto text-red-600 mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
                Your channel intelligence is being prepared.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Calibrating your custom prediction models and packaging radar...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${activationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>INITIALIZING ENGINE</span>
                <span>{activationProgress}% COMPLETE</span>
              </div>
            </div>

            {/* Progressive Steps Checklist */}
            <div className="space-y-3 pt-2">
              {pipelineSteps.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    s.status === "complete"
                      ? "bg-emerald-50/40 border-emerald-200 text-neutral-900"
                      : s.status === "processing"
                      ? "bg-red-50/40 border-red-200 text-neutral-900 shadow-xs"
                      : "bg-neutral-50/50 border-neutral-200/60 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {s.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : s.status === "processing" ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span className="text-xs font-bold">{s.title}</span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                    {s.status === "complete" && <span className="text-emerald-700">Complete</span>}
                    {s.status === "processing" && <span className="text-red-600">Processing</span>}
                    {s.status === "pending" && <span className="text-neutral-400">Pending</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Reassuring Note */}
            <p className="text-center text-xs text-neutral-400 pt-2 font-mono">
              PREYT HYBRID INTELLIGENCE ENGINE · v2.1
            </p>
          </div>
        )}
      </div>

      {/* YouTube Connect Modal */}
      <YouTubeConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={handleChannelConnected}
        title="Connect Your YouTube Channel"
        subtitle="Search your channel handle or URL to link your statistics and enable live automated packaging audits."
      />
    </div>
  )
}
