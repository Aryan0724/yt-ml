"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  X
} from "lucide-react"
import {
  YouTubeChannel,
  getStoredSession,
  getConnectedYouTubeChannel,
  setConnectedYouTubeChannel,
  saveOnboardingPreferences
} from "@/lib/api/auth"
import { trackFunnelEvent } from "@/lib/analytics/events"

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

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlError = searchParams.get("error")
  const urlEmail = searchParams.get("email")
  const urlStep = searchParams.get("step")

  const [step, setStep] = useState<OnboardingStep>("connect")
  const [connectedChannel, setChannel] = useState<YouTubeChannel | null>(null)
  const [availableChannels, setAvailableChannels] = useState<YouTubeChannel[]>([])
  const [loadingOAuth, setLoadingOAuth] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Personalization Answers
  const [contentType, setContentType] = useState<string>("Technology")
  const [growthGoal, setGrowthGoal] = useState<string>("Improve CTR")
  const [frequency, setFrequency] = useState<string>("Weekly")
  const [savingPrefs, setSavingPrefs] = useState(false)

  // Progressive Activation State
  const [activationProgress, setActivationProgress] = useState(0)
  const [pipelineSteps, setPipelineSteps] = useState([
    { title: "Channel verified with Google", status: "complete" },
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

    if (session.user?.available_channels && session.user.available_channels.length > 1) {
      setAvailableChannels(session.user.available_channels)
    }

    const channel = getConnectedYouTubeChannel() || session.user.youtube_channel
    if (channel) {
      setChannel(channel)
      if (urlStep === "personalize" || !urlStep) {
        setStep("personalize")
      }
    } else if (session.user?.available_channels && session.user.available_channels.length > 1) {
      setStep("select_channel")
    }
  }, [router, urlStep])

  // Check URL error from Google callback
  useEffect(() => {
    if (urlError === "no_youtube_channel") {
      setAuthError(
        urlEmail
          ? `No YouTube channel was found under Google account (${urlEmail}). Please authenticate using the Google account that owns or manages your YouTube channel.`
          : "No YouTube channel was found under this Google account. Please authenticate using the account that owns your YouTube channel."
      )
    }
  }, [urlError, urlEmail])

  // Initiate Authentic Google & YouTube OAuth
  const handleConnectYouTube = async () => {
    trackFunnelEvent("youtube_connect_clicked")
    setLoadingOAuth(true)
    setAuthError(null)

    try {
      const res = await fetch("/api/auth/google/url?redirect=/onboarding")
      const data = await res.json()

      if (data.configured && data.url) {
        // Redirect directly to Google's official OAuth consent screen
        window.location.href = data.url
        return
      }

      // Credentials not yet configured in environment
      setShowConfigModal(true)
    } catch (err: any) {
      setAuthError(err.message || "Failed to reach Google OAuth service")
      setShowConfigModal(true)
    } finally {
      setLoadingOAuth(false)
    }
  }

  // Handle selecting one of the user's verified channels
  const handleSelectOwnedChannel = (channel: YouTubeChannel) => {
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
      runActivationPipeline()
    }
  }

  // Multi-step progressive pipeline simulation for dashboard loading
  const runActivationPipeline = () => {
    const durations = [1000, 1500, 1800, 1200]

    // Step 2: Fetching Library
    setTimeout(() => {
      setActivationProgress(30)
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

        {/* STEP 1: CONNECT YOUTUBE CHANNEL VIA GOOGLE OAUTH */}
        {step === "connect" && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wide uppercase mb-2">
                <Youtube className="w-4 h-4 fill-red-600" />
                <span>Google & YouTube Verification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Connect your YouTube channel.
              </h1>
              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
                PreYT verifies channel ownership via official Google OAuth. Only channels owned or managed by your Google account can be connected.
              </p>
            </div>

            {/* Error Notification if Google account has no channel */}
            {authError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{authError}</p>
                  <p className="text-xs text-amber-700">
                    If your channel is under a different email or Brand Account, authorize with that specific Google account.
                  </p>
                </div>
              </div>
            )}

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
                    <span>AUTHORIZE WITH GOOGLE & YOUTUBE</span>
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
              <span>Read-only permissions (youtube.readonly). PreYT will never modify or post to your channel.</span>
            </div>
          </div>
        )}

        {/* STEP 1.5: SELECT OWNED CHANNEL (IF MULTIPLE CHANNELS EXIST UNDER GOOGLE ACCOUNT) */}
        {step === "select_channel" && availableChannels.length > 0 && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight">
                Select your YouTube channel
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                We found {availableChannels.length} YouTube channels under your Google account. Choose the one to manage in PreYT:
              </p>
            </div>

            <div className="space-y-3">
              {availableChannels.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectOwnedChannel(ch)}
                  className="w-full p-4 rounded-xl border border-neutral-200 hover:border-red-500 hover:bg-red-50/30 transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0 relative">
                      {ch.avatarUrl ? (
                        <Image src={ch.avatarUrl} alt={ch.title} fill className="object-cover" />
                      ) : (
                        <Youtube className="w-6 h-6 text-red-600 m-3" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500">
                        {ch.handle} · {ch.subscriberCount?.toLocaleString()} subscribers
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleConnectYouTube}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Sign in with a different Google account
              </button>
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
                  <span className="text-[11px] font-mono text-neutral-500">{connectedChannel.handle} · Verified Channel</span>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                1. What is your primary content category?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setContentType(cat)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      contentType === cat
                        ? "bg-red-50 border-red-500 text-red-600 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 2 */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                2. What is your primary YouTube growth goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GROWTH_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setGrowthGoal(goal)}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      growthGoal === goal
                        ? "bg-red-50 border-red-500 text-red-600 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    <span>{goal}</span>
                    {growthGoal === goal && <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION 3 */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                3. How often do you publish new videos?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PUBLISHING_FREQUENCIES.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      frequency === freq
                        ? "bg-red-50 border-red-500 text-red-600 shadow-xs"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit / Skip buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => handleCompletePersonalization(false)}
                disabled={savingPrefs}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {savingPrefs ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>LAUNCH MY CREATOR WORKSPACE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCompletePersonalization(true)}
                className="w-full text-center py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                Skip personalization for now
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROGRESSIVE ACTIVATION PIPELINE */}
        {step === "activating" && (
          <div className="bg-white border border-neutral-200/90 shadow-sm rounded-2xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
                Setting up your creator intelligence workspace.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Calibrating your baseline packaging models and analyzing recent uploads...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold text-neutral-600">
                <span>SYSTEM CALIBRATION</span>
                <span>{activationProgress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${activationProgress}%` }}
                />
              </div>
            </div>

            {/* Pipeline Checklist */}
            <div className="space-y-3 pt-2">
              {pipelineSteps.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/50"
                >
                  <div className="flex items-center gap-3">
                    {s.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : s.status === "processing" ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        s.status === "complete"
                          ? "text-neutral-900 font-semibold"
                          : s.status === "processing"
                          ? "text-red-600 font-semibold"
                          : "text-neutral-500"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                    {s.status === "complete" && <span className="text-emerald-700">Complete</span>}
                    {s.status === "processing" && <span className="text-red-600">Processing</span>}
                    {s.status === "pending" && <span className="text-neutral-400">Pending</span>}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-neutral-400 pt-2 font-mono">
              PREYT HYBRID INTELLIGENCE ENGINE · v2.1
            </p>
          </div>
        )}
      </div>

      {/* Google Cloud OAuth Configuration Required Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="h-1.5 bg-red-600" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-950">Google Cloud OAuth Setup Required</h3>
                    <p className="text-xs text-neutral-500">Official YouTube verification is enabled</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-600 leading-relaxed">
                <p>
                  To verify your YouTube channel ownership directly with Google, PreYT requires your Google Cloud OAuth Client ID and Secret in your environment.
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 font-mono text-[11px]">
                  <div className="text-neutral-500 uppercase tracking-wider font-bold">Required Environment Variables:</div>
                  <div className="text-neutral-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;.apps.googleusercontent.com</div>
                  <div className="text-neutral-800">GOOGLE_CLIENT_SECRET=GOCSPX-&lt;your_secret&gt;</div>
                  <div className="text-neutral-500 pt-1">Authorized redirect URI:</div>
                  <div className="text-red-700 font-bold break-all">https://preyt.integralgroups.in/api/auth/google/callback</div>
                </div>

                <p className="text-[11px] text-neutral-500">
                  PreYT strictly enforces official Google OAuth verification so that no unauthorized user can ever claim or access another creator&apos;s channel.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  )
}
