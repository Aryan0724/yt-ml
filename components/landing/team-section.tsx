"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Sparkles, MessageSquareQuote } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  vision: string
  imageUrl: string
  isActive: boolean
}

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [activeCard, setActiveCard] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.team) {
          setTeam(data.team)
        }
      })
      .catch(console.error)
  }, [])

  const displayTeam = team.length > 0 ? team : [
    {
      id: "placeholder_1",
      name: "Founder Name",
      role: "CEO & Founder",
      vision: "Our vision is to empower creators globally with next-generation analytics.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600",
      isActive: true
    },
    {
      id: "placeholder_2",
      name: "Co-Founder Name",
      role: "CTO",
      vision: "Building the next generation architecture to scale effortlessly.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600",
      isActive: true
    },
    {
      id: "placeholder_3",
      name: "Co-Founder Name",
      role: "Head of Design",
      vision: "Crafting beautiful, intuitive, and premium experiences.",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600",
      isActive: true
    },
    {
      id: "placeholder_4",
      name: "Co-Founder Name",
      role: "Head of Growth",
      vision: "Scaling our impact across the creative industry worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600",
      isActive: true
    }
  ]

  return (
    <section className="py-32 relative bg-[#FAF9F6] border-t border-zinc-200 overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F0EBE1]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" /> Leadership
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-zinc-900 leading-tight">
                Architects of <span className="text-zinc-400 italic font-serif">the future.</span>
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                Meet the minds behind preYT. Tap on any profile to uncover their vision for the next generation of the creator economy.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {displayTeam.map((member, index) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer group shadow-xl"
                  onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
                >
                  {/* Base Image */}
                  <img 
                    src={member.imageUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600"} 
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Default Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                  
                  {/* Default Info Label */}
                  <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-500 ease-out z-10">
                    <h3 className="text-2xl font-display font-bold text-white">{member.name}</h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-300 mt-1">{member.role}</div>
                  </div>

                  {/* Active Vision Overlay (Glassmorphism) */}
                  <AnimatePresence>
                    {activeCard === member.id && (
                      <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-20 bg-black/60 p-8 flex flex-col justify-center items-center text-center"
                      >
                        <MessageSquareQuote className="w-8 h-8 text-white/40 mb-6" />
                        <p className="text-lg md:text-xl font-serif italic text-white leading-relaxed">
                          "{member.vision}"
                        </p>
                        
                        <div className="absolute bottom-8 text-[9px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Tap to close
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
