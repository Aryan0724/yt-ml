"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, Save, Trash2, ShieldCheck, UserCircle, Mail, AlertCircle, KeyRound } from "lucide-react"

interface CMSUser {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
}

export default function AdminCMSUsersPage() {
  const [users, setUsers] = useState<CMSUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // New User Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newFullName, setNewFullName] = useState("")
  const [newRole, setNewRole] = useState("Writer")
  
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/cms-users")
      const data = await res.json()
      if (data.status === "success") {
        setUsers(data.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    
    try {
      const res = await fetch("/api/admin/cms-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, full_name: newFullName, role: newRole })
      })
      const data = await res.json()
      if (data.status === "success") {
        setUsers([data.data, ...users])
        setShowAddForm(false)
        setNewEmail("")
        setNewFullName("")
        setNewRole("Writer")
      } else {
        setError(data.message || "Failed to add operator")
      }
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Failed to add operator")
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke CMS access for this operator?")) return
    
    try {
      const res = await fetch(`/api/admin/cms-users?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.status === "success") {
        setUsers(users.filter(u => u.id !== id))
      } else {
        alert(data.message || "Failed to revoke access")
      }
    } catch (e: any) {
      console.error(e)
      alert("Failed to revoke access")
    }
  }

  if (loading) return <div className="p-8 text-zinc-500 font-mono text-xs">Loading CMS Operators...</div>

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            <KeyRound className="w-3.5 h-3.5" /> CMS Access Control
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            CMS Managers
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Manage the editorial team and their authorization to access the preYT Content Management System.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Grant Access
        </button>
      </header>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddUser} className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Provision New CMS Operator
              </h3>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input
                    required
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="E.g. Jane Doe"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="editor@example.com"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Privilege Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                  >
                    <option className="bg-[#030303]">Super Admin</option>
                    <option className="bg-[#030303]">Editor</option>
                    <option className="bg-[#030303]">Writer</option>
                    <option className="bg-[#030303]">SEO Manager</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Add Operator
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4 relative group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{user.full_name}</h3>
                  <div className="text-[10px] text-zinc-500 font-mono">{user.email}</div>
                </div>
              </div>
              <button 
                onClick={() => handleRevoke(user.id)}
                title="Revoke Access"
                className="p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                user.role === "Super Admin" 
                  ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                  : user.role === "Editor"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : user.role === "SEO Manager"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
              }`}>
                {user.role}
              </span>
              <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                user.status === "active" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}>
                {user.status}
              </span>
            </div>
            
            <div className="text-[9px] text-zinc-600 font-mono pt-4 border-t border-white/5">
              Added: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
        
        {users.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2rem]">
            <Users className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-zinc-400">No CMS Operators Found</div>
            <div className="text-xs text-zinc-600 mt-1">Click 'Grant Access' to invite your first operator.</div>
          </div>
        )}
      </div>
    </div>
  )
}
