import Link from "next/link"
import { ArrowRight, Search, CheckCircle2, Workflow } from "lucide-react"

const differentiators = [
  {
    icon: Search,
    title: "Niche Data, Not Generic AI",
    description:
      "Recommendations are built from what is actually getting views in your specific niche right now—not robotic suggestions from an AI chatbot that doesn't understand your audience.",
  },
  {
    icon: CheckCircle2,
    title: "Exact Fixes, Not Mystery Scores",
    description:
      "Instead of giving you a score like '72/100' and leaving you guessing, PreYT tells you in plain English: 'Your main hook cuts off after 48 letters on iPhone. Move this word to the front.'",
  },
  {
    icon: Workflow,
    title: "One Connected Workflow, Not 5 Open Tabs",
    description:
      "Stop jumping between keyword tools, competitor tabs, and Photoshop. PreYT connects your topic idea directly to your title and thumbnail test in one simple workflow before you film.",
  },
]

export function WhyPreYT() {
  return (
    <section
      id="why-preyt"
      className="py-20 md:py-24 bg-white border-b border-neutral-200"
      aria-labelledby="why-preyt-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Positioning statement */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#EE1122] text-xs font-mono font-bold tracking-wider uppercase border border-red-200/60">
              <span>[ WHY PREYT ]</span>
            </div>

            <h2
              id="why-preyt-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#161512] leading-[1.12]"
            >
              Fix your packaging before you film.{" "}
              <span className="text-[#EE1122]">
                Not 5 minutes before you publish.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-lg">
              Most creators spend 40 hours shooting, scripting, and editing—and then spend 10 rushed minutes brainstorming a title right before uploading.
            </p>

            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-lg">
              PreYT flips that workflow: make sure people will actually stop scrolling and click <strong>before you press record</strong>.
            </p>

            <p className="text-sm text-neutral-500 font-normal leading-relaxed max-w-lg">
              We aren't another bloated dashboard with useless charts. PreYT is a fast, 60-second check you run between finishing your outline and picking up your camera.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 action-button action-button--primary text-sm font-semibold"
            >
              <span>Start free trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Three differentiators */}
          <div className="space-y-6">
            {differentiators.map((d, i) => {
              const Icon = d.icon
              return (
                <div
                  key={i}
                  className="p-7 rounded-2xl border border-neutral-200 bg-neutral-50/40 hover:border-neutral-300 hover:bg-neutral-50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EE1122] border border-red-100 shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#161512] leading-snug tracking-tight">
                        {d.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                        {d.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
