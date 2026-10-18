"use client"

import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How does PreYT predict CTR before a video is published?",
    answer: "PreYT benchmarks your draft title and thumbnail against a proprietary database of 14.8M analyzed YouTube uploads. We score character cutoff boundaries on mobile viewports, evaluate subject isolation against YouTube's dark and light UI themes, and measure title curiosity tension using linguistic semantic vectors."
  },
  {
    question: "Do you require my YouTube channel login or password?",
    answer: "No. PreYT works using official YouTube Data API public statistics. You can audit titles, test thumbnails, and scan competitor channels without granting any sensitive channel management permissions or passwords."
  },
  {
    question: "Can my video editor or thumbnail designer collaborate with me?",
    answer: "Yes! PreYT Pro and Studio plans include team workspace seats. You can share pre-upload packaging reports with your editor, leave timestamped feedback, and agree on thumbnail variants directly in the browser before rendering."
  },
  {
    question: "How is PreYT different from TubeBuddy or VidIQ?",
    answer: "Traditional browser extensions focus primarily on tags and retrospective keyword density. PreYT is built specifically for pre-upload packaging intelligence: testing mobile feed truncations, dark mode contrast pop, and mining competitor comments for unserved viewer demand before you shoot."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you don't see a measurable increase in your channel's click-through rates and browse impressions within 30 days, simply message us for a full refund—no questions asked."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#EE1122]" />
            <span>[ FREQUENTLY ASKED QUESTIONS ]</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#161512] tracking-tight">
            Everything you need to know.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto font-normal">
            Common questions about our benchmark model, data privacy, and creator workflows.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen 
                    ? "bg-white border-neutral-300 shadow-sm" 
                    : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-base sm:text-lg tracking-tight ${
                    isOpen ? "text-[#161512]" : "text-neutral-800"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "bg-red-50 text-[#EE1122]" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 leading-relaxed border-t border-neutral-100 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
