"use client"

import { 
  Home, Radar, Lightbulb, ActivitySquare, FlaskConical, Tv, History, 
  Settings, HelpCircle, ChevronDown, MoreHorizontal 
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthSession } from "@/lib/api/auth"

export function Sidebar({ session }: { session: AuthSession | null }) {
  const pathname = usePathname()

  const mainNav = [
    { id: "home", icon: Home, label: "Home", href: "/dashboard" },
    { id: "radar", icon: Radar, label: "Radar", href: "/dashboard/radar" },
    { id: "ideas", icon: Lightbulb, label: "Ideas", href: "/dashboard/ideas" },
    { id: "analyze", icon: ActivitySquare, label: "Analyze", href: "/dashboard/analyze" },
    { id: "lab", icon: FlaskConical, label: "Lab", href: "/dashboard/lab" },
    { id: "channel", icon: Tv, label: "Channel", href: "/dashboard/channel" },
    { id: "history", icon: History, label: "History", href: "/dashboard/history" },
  ]

  const bottomNav = [
    { id: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { id: "help", icon: HelpCircle, label: "Help & Docs", href: "/help" },
  ]

  return (
    <>
      <aside className="hidden md:flex w-64 border-r border-border flex-col bg-background h-screen sticky top-0 shrink-0 text-left">
        <div className="h-16 flex items-center px-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight">PREYT<span className="text-primary ml-[2px]">↗</span></span>
          </Link>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between p-2 rounded-lg border bg-background cursor-pointer hover:bg-muted/50 transition-colors">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Workspace</p>
              <p className="text-sm font-semibold truncate max-w-[140px]">
                {session?.workspace?.name || "Personal Workspace"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 flex flex-col gap-1 border-t">
          {bottomNav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          
          {/* Plan Usage */}
          <div className="mt-4 px-3 py-4 bg-muted/30 rounded-xl border">
            <p className="text-xs font-medium mb-2">You're on <span className="font-semibold text-foreground">Free Plan</span></p>
            <p className="text-[10px] text-muted-foreground mb-2">1,250 / 3,000 credits used</p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full w-[41%] bg-primary rounded-full" />
            </div>
            <button className="w-full py-1.5 px-3 bg-background border rounded-lg text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              Upgrade Plan
            </button>
          </div>
          
          {/* User Profile */}
          <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold text-xs uppercase">
                {session?.user?.full_name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold truncate">{session?.user?.full_name || "User"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email || "user@example.com"}</p>
              </div>
            </div>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t flex items-center justify-around px-2 py-2 pb-safe">
        {[mainNav[0], mainNav[1], mainNav[2], mainNav[3], { id: "more", icon: MoreHorizontal, label: "More", href: "#" }].map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
