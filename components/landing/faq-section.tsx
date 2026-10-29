"use client"

import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"
import { FaqSchema } from "@/components/seo/json-ld"

const faqs = [
  {
    question: "How does PreYT predict CTR before a video is published?",
    answer: "PreYT benchmarks your draft title and thumbnail against an empirical database of 14.8M analyzed YouTube uploads. We score character cutoff boundaries on mobile viewports, evaluate subject isolation against YouTube's dark and light UI themes, and measure title curiosity tension using linguistic semantic vectors."
  },
  {
    question: "Do you require my YouTube channel login or password?",
    answer: "No. PreYT works using official YouTube Data API public statistics. You can audit titles, test thumbnails, and scan competitor channels without granting any sensitive channel management permissions or passwords."
  },
  {
    question: "Can my video editor or thumbnail designer collaborate with me?",
    answer: "Yes. PreYT includes collaborative team seats. You can share pre-upload packaging reports with your editor, evaluate variants, and agree on thumbnail compositions directly in the browser before rendering."
  },
  {
    question: "How is PreYT different from TubeBuddy or VidIQ?",
    answer: "Traditional browser extensions focus primarily on retrospective keyword tags. PreYT is built specifically for pre-upload packaging intelligence: testing mobile feed truncations, dark mode contrast pop, and mining competitor comments for unserved viewer demand before you shoot."
  },
  {
    question: "What is your refund and cancellation policy?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied with your packaging diagnostics, simply message support for a full refund. You can cancel your subscription at any time with zero long-term commitments."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-neutral-50/50 border-b border-neutral-200">
      <FaqSchema items={faqs} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#EE1122]" />
            <span>[ FREQUENTLY ASKED QUESTIONS ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#161512] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto font-normal">
            Common questions about our benchmark model, data privacy, and creator workflows.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#161512] pr-4">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600">
                    {isOpen ? <Minus className="w-4 h-4 text-[#EE1122]" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div
                  className={`px-6 sm:px-8 pb-6 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
