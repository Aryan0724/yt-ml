"use client"

import { Zap, BarChart3, Layout, History, LogOut, User, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const items = [
    { id: "analyze", icon: BarChart3, label: "Single Analysis", href: "/dashboard" },
    { id: "compare", icon: Layout, label: "Comparison Mode", href: "/dashboard/compare" },
    { id: "history", icon: History, label: "History", href: "/dashboard/history" },
  ]

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col p-6 glass bg-black/40 h-screen sticky top-0">
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <Zap className="w-6 h-6 transition-transform group-hover:rotate-12 text-white" />
        <span className="font-display font-bold tracking-tight text-lg">AlgoPilot</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname === item.href 
              ? "bg-white/10 text-white" 
              : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-500 hover:text-white transition-all">
          <User className="w-4 h-4" />
          Beta Profile
        </button>
        <Link 
          href="/"
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-500 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Exit Beta
        </Link>
      </div>
    </aside>
  )
}
