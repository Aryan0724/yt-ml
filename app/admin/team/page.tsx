"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Save, Trash2, ShieldCheck, UserCircle, Image as ImageIcon } from "lucide-react"


interface TeamMember {
  id: string
  name: string
  role: string
  vision: string
  imageUrl: string
  isActive: boolean
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team")
      const data = await res.json()
      if (data.success) {
        setTeam(data.team)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (member: TeamMember) => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member)
      })
      const data = await res.json()
      if (data.success) {
        setTeam(team.map(m => m.id === member.id ? data.member : m))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = () => {
    const newMember: TeamMember = {
      id: "founder_" + Math.random().toString(36).substring(2, 9),
      name: "",
      role: "",
      vision: "",
      imageUrl: "",
      isActive: true
    }
    setTeam([...team, newMember])
  }

  const handleDelete = async (id: string) => {
    // We update isActive to false to "delete" them for now
    const member = team.find(m => m.id === id)
    if (member) {
      handleSave({ ...member, isActive: false })
    }
    setTeam(team.filter(m => m.id !== id))
  }

  if (loading) return <div className="p-8 text-zinc-500 font-mono text-xs">Loading Team Records...</div>

  return (
    <div className="lg:pl-64 min-h-screen">
      <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <UserCircle className="w-3.5 h-3.5" /> Team Roster
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Founders Desk
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Manage the executive team profiles displayed on the landing page.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {team.filter(m => m.isActive !== false).map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-6 relative group"
            >
              <button 
                onClick={() => handleDelete(member.id)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = team.map(m => m.id === member.id ? { ...m, name: e.target.value } : m)
                      setTeam(newTeam)
                    }}
                    placeholder="E.g. Aryan Tiwari"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Role / Title</label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => {
                      const newTeam = team.map(m => m.id === member.id ? { ...m, role: e.target.value } : m)
                      setTeam(newTeam)
                    }}
                    placeholder="E.g. Founder & CEO"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Portrait Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="url"
                      value={member.imageUrl}
                      onChange={(e) => {
                        const newTeam = team.map(m => m.id === member.id ? { ...m, imageUrl: e.target.value } : m)
                        setTeam(newTeam)
                      }}
                      placeholder="https://..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Vision / Quote</label>
                  <textarea
                    rows={4}
                    value={member.vision}
                    onChange={(e) => {
                      const newTeam = team.map(m => m.id === member.id ? { ...m, vision: e.target.value } : m)
                      setTeam(newTeam)
                    }}
                    placeholder="Our vision is..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white resize-none"
                  />
                </div>

                <button
                  onClick={() => handleSave(team.find(m => m.id === member.id)!)}
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </motion.div>
          ))}
          
          {team.filter(m => m.isActive !== false).length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2rem]">
              <UserCircle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <div className="text-sm font-semibold text-zinc-400">No Founders Added</div>
              <div className="text-xs text-zinc-600 mt-1">Click the button above to add a team member.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
