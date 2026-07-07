"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Plus, Star, RefreshCw } from "lucide-react"
import { getTestimonials, saveTestimonial, deleteTestimonial } from "@/lib/supabase"

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [subs, setSubs] = useState("")
  const [text, setText] = useState("")
  const [handle, setHandle] = useState("")
  const [img, setImg] = useState("")

  const loadData = async () => {
    setIsLoading(true)
    const { data } = await getTestimonials()
    if (data) setTestimonials(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !text || !subs || !handle) return
    setIsSubmitting(true)
    
    await saveTestimonial({
      name, subs, text, handle, img: img || "11"
    })
    
    // Reset Form
    setName("")
    setSubs("")
    setText("")
    setHandle("")
    setImg("")
    
    await loadData()
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    await deleteTestimonial(id)
    await loadData()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Testimonials Manager</h1>
        <p className="text-zinc-500 text-sm">Add, remove, and manage community testimonials shown on the landing page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="glass-card p-6 border-white/5 h-fit space-y-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FF0000]" /> Add New Testimonial
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">Creator Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FF0000] focus:outline-none transition-colors" placeholder="e.g. Jack Cole" />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">Social Handle</label>
              <input required value={handle} onChange={e => setHandle(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FF0000] focus:outline-none transition-colors" placeholder="e.g. @jackcole" />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">Subscriber Count</label>
              <input required value={subs} onChange={e => setSubs(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FF0000] focus:outline-none transition-colors" placeholder="e.g. 2.1M subscribers" />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">Avatar Image ID (Pravatar)</label>
              <input value={img} onChange={e => setImg(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FF0000] focus:outline-none transition-colors" placeholder="e.g. 11 (optional)" />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 mb-1">Testimonial Quote</label>
              <textarea required value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#FF0000] focus:outline-none transition-colors" placeholder="Enter the testimonial text here..." />
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full py-2.5 rounded bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Testimonial"}
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 glass-card p-6 border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" /> Active Testimonials
            </h2>
            <button onClick={loadData} className="p-2 hover:bg-white/5 rounded transition-colors text-zinc-400 hover:text-white">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.length === 0 && !isLoading && (
              <div className="text-center py-10 text-zinc-500 text-sm">No testimonials added yet.</div>
            )}
            
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex gap-4 items-start relative group">
                <img src={`https://i.pravatar.cc/100?img=${t.img || '11'}`} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className="text-xs text-zinc-500">{t.handle}</span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-1.5 rounded">{t.subs}</span>
                  </div>
                  <p className="text-sm text-zinc-300">"{t.text}"</p>
                </div>
                
                <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
