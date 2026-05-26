"use client"

import { motion } from "framer-motion"

export function MarqueeTicker() {
  const items = [
    "Workflow Automation",
    "•",
    "Custom Chatbots",
    "•",
    "LLM Fine-tuning",
    "•",
    "Data Pipelines",
    "•",
    "AI Strategy Consulting",
    "•",
    "Agentic AI",
    "•"
  ]

  // Duplicate for seamless infinite loop
  const marqueeItems = [...items, ...items, ...items, ...items]

  return (
    <section className="py-6 border-y border-zinc-100 bg-[#fafafa] overflow-hidden flex items-center relative z-20">
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Adjust speed
        }}
      >
        <div className="flex gap-8 items-center px-4">
          {marqueeItems.map((item, index) => (
            <span
              key={index}
              className={`text-sm font-bold tracking-wider uppercase ${
                item === "•" ? "text-primary/40" : "text-zinc-400"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
