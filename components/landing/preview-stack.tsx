"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FileText, 
  Check, 
  Paperclip, 
  ArrowRight, 
  Pause, 
  Play, 
  Moon, 
  Sun,
  Search,
  MousePointer,
  Sparkles,
  Layers
} from "lucide-react"

export function PreviewStack() {
  // =========================================================================
  // CARD 1: DRAFT & INTERACTIVE TITLE SANDBOX
  // =========================================================================
  const [draftTime, setDraftTime] = useState(0)
  const [isDraftPaused, setIsDraftPaused] = useState(false)
  const [draftMode, setDraftMode] = useState<"dark" | "light">("dark")

  // Interactive user sandbox states
  const [isUserActive, setIsUserActive] = useState(false)
  const [userTitleInput, setUserTitleInput] = useState("")
  const [auditedTitle, setAuditedTitle] = useState("I Tested 50 AI Video Tools (Only 3 Actually Work)")
  const [activeTab, setActiveTab] = useState<"draft" | "questions" | "comments">("draft")

  const DRAFT_PROMPT = "Audit title: 'I Tested 50 AI Video Tools (Only 3 Actually Work)'"

  useEffect(() => {
    if (isDraftPaused || isUserActive) return
    const interval = setInterval(() => {
      setDraftTime((t) => (t + 50) % 16000)
    }, 50)
    return () => clearInterval(interval)
  }, [isDraftPaused, isUserActive])

  // Draft loop phases:
  const draftPhase = isUserActive
    ? "ready"
    : draftTime < 2800 ? "prompt"
    : draftTime < 3600 ? "sending"
    : draftTime < 9000 ? "drafting" : "ready"

  const draftTypedChars = Math.min(DRAFT_PROMPT.length, Math.max(0, Math.floor((draftTime - 200) / 40)))

  // Handle user submitting custom title
  const handleUserAuditSubmit = (titleToAudit?: string) => {
    const title = (titleToAudit || userTitleInput).trim()
    if (!title) return
    setAuditedTitle(title)
    setIsUserActive(true)
    setIsDraftPaused(true)
  }

  const handleResetToDemo = () => {
    setIsUserActive(false)
    setUserTitleInput("")
    setAuditedTitle("I Tested 50 AI Video Tools (Only 3 Actually Work)")
    setIsDraftPaused(false)
    setDraftTime(0)
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setActiveTab(id as any)
    }
  }

  // Keyboard shortcut listener: 1, 2, 3 to navigate; Space to pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === "1") scrollToSection("draft")
      if (e.key === "2") scrollToSection("questions")
      if (e.key === "3") scrollToSection("comments")
      if (e.key === " ") {
        e.preventDefault()
        setIsDraftPaused(p => !p)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // =========================================================================
  // CARD 2: QUESTIONS LOOP STATE MACHINE (14,000ms loop)
  // =========================================================================
  const [questionsTime, setQuestionsTime] = useState(0)
  const [isQuestionsPaused, setIsQuestionsPaused] = useState(false)

  const QUESTION_PROMPT = "What do top videos on 5AM routines miss in their comments?"

  useEffect(() => {
    if (isQuestionsPaused) return
    const interval = setInterval(() => {
      setQuestionsTime((t) => (t + 50) % 14000)
    }, 50)
    return () => clearInterval(interval)
  }, [isQuestionsPaused])

  const questionsPhase =
    questionsTime < 2600 ? "prompt" :
    questionsTime < 4200 ? "thinking" :
    questionsTime < 7400 ? "answering" : "complete"

  const questionsTypedChars = Math.min(QUESTION_PROMPT.length, Math.max(0, Math.floor((questionsTime - 200) / 38)))

  // =========================================================================
  // CARD 3: COMMENTS LOOP STATE MACHINE (18,000ms loop)
  // =========================================================================
  const [commentsTime, setCommentsTime] = useState(0)
  const [isCommentsPaused, setIsCommentsPaused] = useState(false)

  useEffect(() => {
    if (isCommentsPaused) return
    const interval = setInterval(() => {
      setCommentsTime((t) => (t + 50) % 18000)
    }, 50)
    return () => clearInterval(interval)
  }, [isCommentsPaused])

  const commentsPhase =
    commentsTime < 2200 ? "reading" :
    commentsTime < 5000 ? "selected" :
    commentsTime < 7800 ? "commented" :
    commentsTime < 11200 ? "replying" :
    commentsTime < 14000 ? "updated" : "resolved"

  return (
    <div className="landing-col space-y-16 md:space-y-24 pb-28 relative z-10" id="draft">
      
      {/* Floating Feature Switcher Bar */}
      <div className="sticky top-4 sm:top-6 z-30 flex justify-center pb-2 pointer-events-auto">
        <div className="inline-flex items-center p-1 rounded-full bg-white/95 border border-neutral-200/90 shadow-md backdrop-blur-md gap-1">
          <button
            type="button"
            onClick={() => scrollToSection("draft")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === "draft"
                ? "bg-[#161512] text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            1. Audit with AI
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("questions")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === "questions"
                ? "bg-[#161512] text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            2. Competitor Radar
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("comments")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === "comments"
                ? "bg-[#161512] text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            3. Editor Collab
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: AUDIT WITH AI (#draft)                                         */}
      {/* ========================================================================= */}
      <section aria-labelledby="preview-draft" className="w-full">
        <div className="squircle-card">
          {/* Header with Terms.so SVG dashed border & playback toggle */}
          <header className="relative p-6 sm:p-10 md:p-12 min-h-[144px] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent">
            <svg
              className="absolute inset-0 w-full h-full text-neutral-200 pointer-events-none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 max-w-2xl">
              <h3 id="preview-draft" className="text-lg sm:text-xl font-semibold text-[#161512] tracking-tight">
                Audit with AI
              </h3>
              <p className="mt-1 text-sm sm:text-base text-neutral-500 font-normal leading-relaxed">
                Describe what you need. Turn a raw video concept into a benchmarked package before you film.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 self-start md:self-center">
              {isUserActive ? (
                <button
                  type="button"
                  onClick={handleResetToDemo}
                  className="action-button action-button--secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>Reset Demo</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  14.8M BENCHMARK MODEL
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsDraftPaused(!isDraftPaused)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                title={isDraftPaused ? "Resume animation" : "Pause animation"}
                aria-label={isDraftPaused ? "Resume animation" : "Pause animation"}
              >
                {isDraftPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </header>

          {/* Dynamic Stage Body */}
          <div className="border-t border-neutral-200 bg-neutral-50/20">
            {draftPhase === "prompt" || draftPhase === "sending" ? (
              /* Launch / Prompt Stage */
              <div className="p-8 sm:p-14 md:p-16 flex flex-col items-center justify-center min-h-[540px] transition-all">
                <div className="w-full max-w-xl text-center space-y-6">
                  <div className="space-y-1.5">
                    <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512]">
                      Start with what you need.
                    </h4>
                    <p className="text-sm text-neutral-500">
                      Type your title idea or pick a preset below to run an instant pre-filming audit.
                    </p>
                  </div>

                  {/* Interactive Typing Composer */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleUserAuditSubmit()
                    }}
                    className="rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-xs transition-all focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent"
                  >
                    <div className="min-h-[70px] text-sm sm:text-base text-[#161512] font-medium p-2">
                      <input
                        type="text"
                        value={userTitleInput}
                        onChange={(e) => {
                          setUserTitleInput(e.target.value)
                          setIsDraftPaused(true)
                        }}
                        placeholder={DRAFT_PROMPT.slice(0, draftTypedChars)}
                        className="w-full bg-transparent border-none outline-none text-[#161512] font-medium placeholder:text-neutral-400"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 px-2 border-t border-neutral-100">
                      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Try any video title</span>
                      </span>
                      <button
                        type="submit"
                        className="action-button action-button--primary text-xs px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Audit Title</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </form>

                  {/* Quick Try Presets */}
                  <div className="pt-2 text-left space-y-2">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Or click a channel draft to test:
                    </span>
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleUserAuditSubmit("I Tested 50 AI Video Tools (Only 3 Actually Work)")}
                        className="w-full p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs flex items-center justify-between transition-colors text-left cursor-pointer"
                      >
                        <span className="font-medium text-neutral-800">I Tested 50 AI Video Tools (Only 3 Actually Work)</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">9.4% Est. CTR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUserAuditSubmit("Apple M4 Mac Mini: Stop Buying the $599 Base Model")}
                        className="w-full p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs flex items-center justify-between transition-colors text-left cursor-pointer"
                      >
                        <span className="font-medium text-neutral-800">Apple M4 Mac Mini: Stop Buying the $599 Base Model</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">9.8% Est. CTR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUserAuditSubmit("5AM Morning Routine: What Top Creators Never Tell You")}
                        className="w-full p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs flex items-center justify-between transition-colors text-left cursor-pointer"
                      >
                        <span className="font-medium text-neutral-800">5AM Morning Routine: What Top Creators Never Tell You</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">8.9% Est. CTR</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* Dual-Pane Workspace */
              <div className="grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300">
                {/* Left Pane: Chat Workspace (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white border-b lg:border-b-0 lg:border-r border-neutral-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 tracking-wide uppercase">
                      <span>Your conversation</span>
                      <button
                        type="button"
                        onClick={handleResetToDemo}
                        className="text-[11px] text-[#EE1122] hover:underline font-medium cursor-pointer"
                      >
                        ← Test another title
                      </button>
                    </div>

                    {/* User Prompt */}
                    <div className="bg-[#f7f7f7] border border-neutral-200/80 rounded-2xl p-4 text-sm text-[#161512] font-medium leading-relaxed">
                      <strong>Audit title: &quot;{auditedTitle}&quot;</strong>
                    </div>

                    {/* Assistant Answer */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="text-sm text-[#333] space-y-2 leading-relaxed">
                        <p>
                          I’ve audited your draft against 14.8M uploads. {auditedTitle.length > 50 ? (
                            <>Your title is <strong>{auditedTitle.length} characters</strong> (cuts off at ~48 chars on 82% of phone screens). Consider shortening or leading with the primary tension word.</>
                          ) : (
                            <>Your title is <strong>{auditedTitle.length} characters</strong> (fits 100% within mobile feeds without truncation).</>
                          )}
                        </p>
                        <p>
                          Recommended winner prediction: <strong>9.4% estimated CTR</strong> (+161% views lift vs benchmark baseline).
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ready for your review</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Composer at Bottom */}
                  <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-2 text-xs text-neutral-400">
                    <textarea
                      rows={2}
                      readOnly
                      placeholder="Make it yours. Ask for a change…"
                      className="w-full bg-transparent px-3 py-1.5 text-xs text-[#161512] placeholder:text-neutral-400 focus:outline-none resize-none font-medium"
                    />
                    <div className="flex items-center justify-between pt-1 px-2 border-t border-neutral-100">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Paperclip className="w-3 h-3" />
                        <span>Attach thumbnail / script</span>
                      </span>
                      <span className="action-button action-button--secondary text-[11px] px-2.5 py-1 rounded-md font-semibold">
                        Enter →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Packaging Report Document (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between bg-white">
                  <div className="border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center gap-2 font-medium text-neutral-700">
                      <FileText className="w-4 h-4 text-[#EE1122]" />
                      <span>Pre-upload packaging report</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      <Check className="w-3 h-3" />
                      <span>Saved</span>
                    </span>
                  </div>

                  {/* Paper Clauses */}
                  <div className="p-6 sm:p-10 space-y-6 text-[#161512]">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161512]">
                        Packaging audit report
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        AI &amp; Tech Niche · Benchmark Model Active
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-neutral-900">
                          1. Mobile Feed Safe Area ({auditedTitle.length} Chars)
                        </h5>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          auditedTitle.length <= 50 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {auditedTitle.length <= 50 ? "✓ Safe (No Truncation)" : "⚠ Mobile Truncation Risk"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {auditedTitle.length <= 50
                          ? "Winner title fits 100% within the 2-line boundary without cutting off key tension anchor."
                          : "Title exceeds 50 characters. YouTube mobile app may cut off the end with '...' on smaller displays."}
                      </p>
                    </div>

                    {/* YouTube Card Simulation */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-neutral-900">
                          2. Mobile Feed Glanceability
                        </h5>
                        <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs">
                          <button
                            type="button"
                            onClick={() => setDraftMode("dark")}
                            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                              draftMode === "dark" ? "bg-neutral-900 text-white font-medium" : "text-neutral-500"
                            }`}
                          >
                            <Moon className="w-3 h-3" />
                            <span>Dark</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDraftMode("light")}
                            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                              draftMode === "light" ? "bg-white text-neutral-900 font-medium shadow-2xs" : "text-neutral-500"
                            }`}
                          >
                            <Sun className="w-3 h-3" />
                            <span>Light</span>
                          </button>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-2xl border transition-colors ${
                          draftMode === "dark"
                            ? "bg-[#0f0f0f] border-neutral-800 text-white"
                            : "bg-white border-neutral-200 text-neutral-950"
                        }`}
                      >
                        <div className="aspect-video bg-neutral-950 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border border-neutral-800">
                          <div className="flex justify-start">
                            <span className="px-2.5 py-1 bg-[#EE1122] text-white font-black text-xs uppercase tracking-wider rounded shadow-xs">
                              TESTED WINNER
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                            <span className="text-emerald-400 font-semibold">92% Dark Feed Contrast · Pass</span>
                            <span className="px-1.5 py-0.5 bg-black/80 text-white rounded">11:42</span>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EE1122] shrink-0 flex items-center justify-center text-xs font-bold text-white">
                            YT
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                              {auditedTitle}
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
                              <span>Creator Channel</span>
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>•</span>
                              <span className="text-[#EE1122] font-bold">380K views</span>
                              <span>•</span>
                              <span className="text-emerald-400">Predicted CTR: 9.4%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <h5 className="text-sm font-semibold text-neutral-900">
                        3. Psychological Curiosity Loop (+161% CTR Gain)
                      </h5>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        Contrarian skepticism challenge dismantles tool hype without misleading clickbait.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-neutral-50/30">
                    <span className="text-neutral-500 font-medium">Your pre-upload audit is complete.</span>
                    <Link
                      href="/signup"
                      className="action-button action-button--primary text-xs px-4 py-2 font-medium"
                    >
                      Start free audit
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE 2: ASK YOUR COMPETITORS (#questions)                              */}
      {/* ========================================================================= */}
      <section id="questions" aria-labelledby="preview-questions" className="w-full">
        <div className="squircle-card">
          <header className="relative p-6 sm:p-10 md:p-12 min-h-[144px] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent">
            <svg
              className="absolute inset-0 w-full h-full text-neutral-200 pointer-events-none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 max-w-2xl">
              <h3 id="preview-questions" className="text-lg sm:text-xl font-semibold text-[#161512] tracking-tight">
                Ask your competitors
              </h3>
              <p className="mt-1 text-sm sm:text-base text-neutral-500 font-normal leading-relaxed">
                Find dates, details, and questions top channels forgot to answer in their videos.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 self-start md:self-center">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-semibold border border-red-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EE1122] animate-pulse" />
                DEMAND GAP RADAR
              </span>
              <button
                type="button"
                onClick={() => setIsQuestionsPaused(!isQuestionsPaused)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                title={isQuestionsPaused ? "Resume animation" : "Pause animation"}
                aria-label={isQuestionsPaused ? "Resume animation" : "Pause animation"}
              >
                {isQuestionsPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </header>

          {/* Centered Question Workspace with Terms.so Citation Card */}
          <div className="p-8 sm:p-14 md:p-16 border-t border-neutral-200 bg-neutral-50/30 flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-8">
              <div className="text-center space-y-1.5">
                <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161512]">
                  Your competitors have unanswered questions.
                </h4>
                <p className="text-sm sm:text-base text-neutral-500">
                  Ask a topic. Get straight to the missed viewer demand.
                </p>
              </div>

              {/* Messages Stack */}
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-2xl p-4 text-sm text-[#161512] font-semibold shadow-xs">
                  {questionsPhase === "prompt"
                    ? QUESTION_PROMPT.slice(0, questionsTypedChars)
                    : QUESTION_PROMPT}
                  {questionsPhase === "prompt" && (
                    <span className="inline-block w-0.5 h-4 bg-[#EE1122] ml-0.5 animate-pulse" />
                  )}
                </div>

                {questionsPhase === "thinking" && (
                  <div className="flex items-center gap-2.5 text-xs text-neutral-500 px-1 py-2">
                    <span className="home-opening-dots text-[#EE1122]">
                      <span style={{ animationDelay: "0ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "90ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "180ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "90ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "180ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "270ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "180ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "270ms" } as React.CSSProperties} />
                      <span style={{ animationDelay: "360ms" } as React.CSSProperties} />
                    </span>
                    <span>Scanning top 12 competitor video comments…</span>
                  </div>
                )}

                {(questionsPhase === "answering" || questionsPhase === "complete") && (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-sm sm:text-base text-[#161512] leading-relaxed shadow-xs space-y-2 animate-in fade-in duration-300">
                    <p>
                      Across 12 top videos, <strong>84% of viewer comments</strong> ask what to do when working <strong>irregular night shifts</strong> or waking up exhausted.
                    </p>
                    <p className="text-neutral-600 text-xs sm:text-sm">
                      Top creators like Ali Abdaal never addressed irregular shift fatigue. This represents a <strong>4.2x search demand gap</strong>.
                    </p>
                  </div>
                )}

                {/* Terms.so Citation Card */}
                {questionsPhase === "complete" && (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#EE1122] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-neutral-900">
                          Competitor video breakdown · Ali Abdaal (4.2M views)
                        </h5>
                        <p className="text-xs text-neutral-400">
                          Comment Intelligence · Section: Viewer Demand Gap
                        </p>
                      </div>
                    </div>
                    <blockquote className="text-xs sm:text-sm text-neutral-700 italic border-l-2 border-[#EE1122] pl-3 py-1">
                      &ldquo;Top comment with 14,200 likes: &apos;Please make a video for people who work rotating night shifts, the 5AM advice is impossible for us.&apos;&rdquo;
                    </blockquote>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-2 flex items-center gap-2 shadow-xs">
                  <Search className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value="Ask about an agreement or competitor channel…"
                    className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-[#161512] placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                  <span className="action-button action-button--secondary text-xs px-4 py-2 font-semibold">
                    Enter →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE 3: REVIEW WITH YOUR EDITOR (#comments)                            */}
      {/* ========================================================================= */}
      <section id="comments" aria-labelledby="preview-comments" className="w-full">
        <div className="squircle-card">
          <header className="relative p-6 sm:p-10 md:p-12 min-h-[144px] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent">
            <svg
              className="absolute inset-0 w-full h-full text-neutral-200 pointer-events-none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 max-w-2xl">
              <h3 id="preview-comments" className="text-lg sm:text-xl font-semibold text-[#161512] tracking-tight">
                Review with your editor
              </h3>
              <p className="mt-1 text-sm sm:text-base text-neutral-500 font-normal leading-relaxed">
                Discuss packaging, agree on a thumbnail, and resolve it right in the browser.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 self-start md:self-center">
              <Link
                href="/spec/m4-mac-mini"
                className="action-button action-button--secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold hover:border-neutral-400"
              >
                <span>Live Spec</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                PACKAGING COLLAB
              </span>
              <button
                type="button"
                onClick={() => setIsCommentsPaused(!isCommentsPaused)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                title={isCommentsPaused ? "Resume animation" : "Pause animation"}
                aria-label={isCommentsPaused ? "Resume animation" : "Pause animation"}
              >
                {isCommentsPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </header>

          {/* Dual-Pane Workspace with Real Cursor and Highlight Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-neutral-200">
            {/* Left Pane: The Video Document (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 space-y-6 relative overflow-hidden">
              {/* Simulated Demo Cursor (Terms.so demoCursor) */}
              <div
                className={`absolute pointer-events-none z-30 transition-all duration-700 ease-out ${
                  commentsPhase !== "reading" ? "opacity-100 top-48 left-64" : "opacity-0 top-72 left-80"
                }`}
              >
                <div className="relative">
                  <MousePointer className="w-5 h-5 text-neutral-900 fill-neutral-900 filter drop-shadow-sm" />
                  <span className="absolute left-4 top-2 text-[10px] font-mono bg-neutral-900 text-white px-1.5 py-0.5 rounded shadow">
                    Alex (Editor)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 text-xs text-neutral-500">
                <span className="font-medium text-neutral-800">
                  Packaging Spec — Hardware / Tech
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  <span>{commentsPhase === "resolved" ? "Changes resolved" : "Changes saved"}</span>
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#161512]">
                  M4 Mac Mini Packaging Spec
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Creator &amp; Video Editor Review Session
                </p>
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-semibold text-neutral-900">
                  1. Title &amp; Core Tension
                </h5>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Apple M4 Mac Mini: Stop Buying the $599 Base Model
                </p>
              </div>

              {/* Highlighted Clause (Animates between states) */}
              <div
                className={`space-y-1.5 p-4 rounded-xl border transition-all duration-500 relative ${
                  commentsPhase === "reading"
                    ? "bg-neutral-50 border-neutral-200"
                    : commentsPhase === "updated" || commentsPhase === "resolved"
                    ? "bg-emerald-50/70 border-emerald-300"
                    : "bg-blue-50/80 border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-neutral-900">
                    2. Thumbnail Concept &amp; Visual Contrast
                  </h5>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors ${
                      commentsPhase === "updated" || commentsPhase === "resolved"
                        ? "bg-emerald-600"
                        : "bg-blue-600"
                    }`}
                  >
                    1
                  </span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed">
                  {commentsPhase === "reading" || commentsPhase === "selected" || commentsPhase === "commented" || commentsPhase === "replying" ? (
                    <span>
                      Concept A: Standard photo of desktop with text &quot;M4 SPEED TEST&quot;.
                    </span>
                  ) : (
                    <div>
                      <span className="line-through text-neutral-400 mr-2">
                        Concept A: Standard photo of desktop
                      </span>
                      <strong className="text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                        Concept B: Red warning badge &apos;STOP BUYING 8GB&apos; (92% Dark Mode Contrast)
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-sm font-semibold text-neutral-900">
                  3. First 30 Seconds Retention Anchor
                </h5>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Side-by-side memory swap test at 0:08 immediately confirms thumbnail thesis.
                </p>
              </div>
            </div>

            {/* Right Pane: Comments Sidebar (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-50/40 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  <span>Comments</span>
                  <span className={commentsPhase === "resolved" ? "text-emerald-700 font-bold" : "text-[#EE1122]"}>
                    {commentsPhase === "resolved" ? "0 open" : "1 open"}
                  </span>
                </div>

                {/* Comment Cards */}
                {commentsPhase !== "reading" && commentsPhase !== "selected" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {/* Alex's Comment */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="font-bold text-neutral-900">Alex (Lead Editor)</span>
                        <span>Just now</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                        Swapped Concept A for Concept B — dark mode feed contrast jumped from 61% to 92%. Let&apos;s lock this in.
                      </p>
                    </div>

                    {/* Creator's Reply */}
                    {(commentsPhase === "replying" || commentsPhase === "updated" || commentsPhase === "resolved") && (
                      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-2 ml-4 border-l-2 border-l-[#EE1122] animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-bold text-neutral-900">You (Creator)</span>
                          <span>Just now</span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                          Agreed. Pushing to render queue now.
                        </p>
                      </div>
                    )}

                    {/* Resolution Pill */}
                    {commentsPhase === "resolved" && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium animate-in zoom-in-95 duration-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                        <span>Resolved by creator</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="rounded-xl border border-neutral-200 bg-white p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <input
                    type="text"
                    readOnly
                    placeholder="Leave a comment for your editor…"
                    className="w-full bg-transparent px-2 text-xs text-[#161512] placeholder:text-neutral-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="action-button action-button--primary text-xs px-3 py-1 font-medium rounded-lg"
                  >
                    Reply
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
                  <span>Collaborating on an upcoming video?</span>
                  <Link
                    href="/spec/m4-mac-mini"
                    className="font-semibold text-neutral-900 hover:text-[#EE1122] flex items-center gap-1 transition-colors"
                  >
                    <span>Open live spec</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
