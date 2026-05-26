"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$999",
    period: "/mo",
    description: "Perfect for small teams looking to automate specific workflows.",
    features: [
      "1 Custom AI Agent",
      "Basic Workflow Automation",
      "Standard Support",
      "Monthly Strategy Call"
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$2,499",
    period: "/mo",
    description: "For scaling businesses that need comprehensive AI integration.",
    features: [
      "3 Custom AI Agents",
      "Advanced Data Pipelines",
      "Priority Support (24hr SL)",
      "Weekly Strategy Calls",
      "Custom Internal Tooling"
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and bespoke AI modeling for large orgs.",
    features: [
      "Unlimited AI Agents",
      "LLM Fine-tuning",
      "Dedicated Slack Channel",
      "On-premise Deployment",
      "Custom Security Audits"
    ],
    buttonText: "Contact Sales",
    popular: false,
  }
]

export function PricingSection() {
  return (
    <section className="py-32 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">
            SIMPLE PRICING
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black max-w-2xl mx-auto leading-tight">
            Invest in AI that <br /> pays for itself.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[40px] border cursor-default ${
                plan.popular 
                  ? "bg-black text-white border-black premium-shadow transform md:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-10" 
                  : "bg-white text-black border-zinc-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full border-4 border-white">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-black'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'} mb-6 min-h-[40px]`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className={`text-sm font-semibold ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.period}</span>
                </div>
              </div>

              <button className={`w-full py-4 rounded-full font-bold mb-10 transition-all ${
                plan.popular 
                  ? "bg-primary text-white hover:bg-red-600 shadow-[0_10px_20px_-10px_rgba(255,0,0,0.5)] hover:-translate-y-0.5" 
                  : "bg-zinc-100 text-black hover:bg-zinc-200"
              }`}>
                {plan.buttonText}
              </button>

              <div className="flex-1">
                <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${plan.popular ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  What's included
                </p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-white/20 text-white" : "bg-red-50 text-primary"
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={`text-sm font-medium ${plan.popular ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
