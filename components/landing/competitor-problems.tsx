import { ExternalLink, AlertTriangle, CheckCircle2, MessageSquareQuote, ShieldAlert } from "lucide-react"

/**
 * COMPETITOR PROBLEMS & PROOF SECTION
 *
 * Demonstrates that creator frustrations with existing SEO tools are real,
 * backed by actual Reddit discussions, and shows PreYT's practical solution.
 */

const problems = [
  {
    num: "01",
    tag: "THE 100/100 SEO SCORE TRAP",
    problem: "A high SEO score does not guarantee views.",
    quote:
      "“I got a 100% TubeBuddy SEO score, followed every recommendation, and the video got 30 views in 48 hours. What is the point of SEO scores if no one actually clicks the video?”",
    source: {
      label: "Read actual discussion on r/NewTubers",
      href: "https://www.reddit.com/r/NewTubers/comments/ryjjc2/high_tubebuddy_score_poor_video_performance/",
    },
    whyItHappens:
      "SEO tools only check if your keywords match search terms. But modern YouTube is driven by browse & suggested feeds where real humans decide to click or scroll based on thumbnail contrast and title curiosity—not hidden keyword tags.",
    preytSolution:
      "PreYT tests Click-Through Rate (CTR) potential—checking mobile title cutoffs, dark-mode thumbnail contrast, and curiosity tension—so you know if viewers will actually stop scrolling and tap.",
  },
  {
    num: "02",
    tag: "GENERIC AI SUGGESTIONS",
    problem: "AI recommendations feel robotic and out of touch with your niche.",
    quote:
      "“Is anyone else finding the AI suggestions completely useless? It keeps recommending generic, corporate-sounding titles that don't match my audience or niche at all.”",
    source: {
      label: "Read actual discussion on r/NewTubers",
      href: "https://www.reddit.com/r/NewTubers/comments/1qxfoge/is_anyone_still_using_vidiq/",
    },
    whyItHappens:
      "Most tools run a standard AI prompt with zero awareness of your specific niche. They generate generic, dated titles like 'The Ultimate Guide To...' that modern viewers instinctively ignore.",
    preytSolution:
      "PreYT benchmarks your drafts directly against top-performing videos in your exact category. Recommendations reflect what is actually earning views in your niche today, not generic ChatGPT templates.",
  },
  {
    num: "03",
    tag: "MYSTERY SCORES WITHOUT FIXES",
    problem: "Tools give you a score, but leave you guessing what to fix.",
    quote:
      "“The AI coach tells me my title 'needs work' and gives it a 60/100, but doesn't explain what is wrong or give me practical suggestions to improve it. What am I supposed to do with that?”",
    source: {
      label: "Read actual discussion on r/aitubers",
      href: "https://www.reddit.com/r/aitubers/comments/1r5nl8k/vidiq_ai_coach_is_well_uhm_needing_help/",
    },
    whyItHappens:
      "A black-box score like '68/100' gives you anxiety without direction. Creators spend hours rewriting titles blindly without knowing what the algorithm or viewer is actually reacting to.",
    preytSolution:
      "PreYT gives you plain-English, actionable fixes: 'Your main hook is cut off after 48 letters on iPhone. Move the word “Never” to the first 4 words to make the hook visible on mobile.'",
  },
  {
    num: "04",
    tag: "DISCONNECTED WORKFLOW GAP",
    problem: "Research in one tool, design in another, and upload blindly.",
    quote:
      "“I spend an hour researching tags in TubeBuddy, spy on competitors in another tab, make a thumbnail in Photoshop, and by upload time I still don't know if the package will actually work.”",
    source: {
      label: "Read actual discussion on r/NewTubers",
      href: "https://www.reddit.com/r/NewTubers/comments/1hig28a/is_tubebuddy_still_worth_using/",
    },
    whyItHappens:
      "Creators have to jump between 4 different browser tabs with no connection between finding a good topic and packaging the video. Most packaging mistakes happen right before publish because there was no pre-filming check.",
    preytSolution:
      "PreYT unites topic discovery, mobile feed simulation, and pre-filming packaging audit into a single 60-second workflow before you spend 40 hours recording.",
  },
]

export function CompetitorProblems() {
  return (
    <section
      id="creator-challenges"
      className="py-20 md:py-24 bg-neutral-50/50 border-b border-neutral-200"
      aria-labelledby="challenges-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-mono font-bold tracking-wider uppercase border border-amber-200/80">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>REAL PROBLEMS CREATORS REPORT DAILY</span>
          </div>

          <h2
            id="challenges-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]"
          >
            The tools exist.{" "}
            <span className="text-[#161512]">The problems</span>
            <br className="hidden sm:inline" />{" "}
            <span className="text-[#EE1122]">are very real.</span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
            YouTube creators are tired of paying for metadata scores and generic AI that don't lead to views. Here is the proof of what creators experience—and how PreYT fixes it.
          </p>
        </div>

        {/* 4 Proven Problem & Solution Cards */}
        <div className="space-y-6">
          {problems.map((item) => (
            <div
              key={item.num}
              className="squircle-card bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:border-neutral-300 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
                
                {/* Left: Real Creator Proof & Issue (6 cols) */}
                <div className="lg:col-span-6 p-7 sm:p-9 space-y-4 bg-neutral-50/40 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                        <ShieldAlert className="w-3 h-3 text-amber-700" />
                        {item.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        PROBLEM #{item.num}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#161512] leading-snug tracking-tight">
                      {item.problem}
                    </h3>

                    {/* Actual Reddit Creator Discussion Quote */}
                    <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 font-semibold">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-neutral-400" />
                        <span>REAL CREATOR REPORT:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                        {item.quote}
                      </p>
                    </div>

                    {/* Why this is a real problem */}
                    <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal pt-1">
                      <strong className="text-neutral-900 font-semibold">Why this happens: </strong>
                      {item.whyItHappens}
                    </div>
                  </div>

                  {/* Reddit Source Link */}
                  <div className="pt-3 border-t border-neutral-200/60">
                    <a
                      href={item.source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#EE1122] hover:underline font-semibold"
                    >
                      <span>{item.source.label}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Right: How PreYT Fixes It (6 cols) */}
                <div className="lg:col-span-6 p-7 sm:p-9 space-y-4 bg-white flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>HOW PREYT SOLVES THIS</span>
                    </div>

                    <p className="text-base sm:text-lg text-[#161512] font-semibold leading-relaxed">
                      {item.preytSolution}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
