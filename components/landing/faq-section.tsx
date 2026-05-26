"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "How long does it take to implement an AI Agent?",
    answer: "Typically, our custom AI agents take between 2 to 4 weeks to deploy, depending on the complexity of your internal data and the specific workflows you want to automate."
  },
  {
    question: "Do you integrate with our existing tech stack?",
    answer: "Yes, we build custom integrations for almost any software that has an API (Salesforce, Hubspot, Slack, Notion, Zendesk, etc.). If it has an API, we can automate it."
  },
  {
    question: "What happens if the AI makes a mistake?",
    answer: "We implement rigorous 'human-in-the-loop' safeguards. The AI can draft responses or actions, but high-stakes decisions are routed to your team for approval before execution."
  },
  {
    question: "How is my company data secured?",
    answer: "We use enterprise-grade encryption and partner with SOC-2 compliant LLM providers. Your data is never used to train public models without explicit opt-in."
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Absolutely. All our Growth and Enterprise plans include dedicated support SLAs, weekly strategy calls, and continuous model fine-tuning to ensure peak performance."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            Frequently asked questions
          </h2>
          <p className="text-zinc-500 text-lg">
            Everything you need to know about our services and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-white border-zinc-200 premium-shadow' : 'bg-transparent border-zinc-200/60 hover:border-zinc-300'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className={`font-bold text-lg ${isOpen ? 'text-black' : 'text-zinc-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-red-50 text-primary' : 'bg-zinc-100 text-zinc-400'}`}>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-zinc-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
