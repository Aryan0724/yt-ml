import Link from "next/link"
import { Radar, Lightbulb, ActivitySquare, FlaskConical, Tv, History } from "lucide-react"

export function PlatformOverview() {
  const capabilities = [
    {
      title: "Creator Radar",
      description: "Discover what's moving. Track real-time trends across YouTube and the internet.",
      icon: <Radar className="w-6 h-6 text-primary" />,
      link: "/dashboard/radar",
      linkText: "Explore Radar",
    },
    {
      title: "Ideas",
      description: "Turn opportunities into video ideas with proven potential and high demand.",
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
      link: "/dashboard/ideas",
      linkText: "Find Ideas",
    },
    {
      title: "Analyze",
      description: "Evaluate your title, thumbnail, and topic with AI before you publish.",
      icon: <ActivitySquare className="w-6 h-6 text-purple-500" />,
      link: "/dashboard/analyze",
      linkText: "Analyze Now",
    },
    {
      title: "Lab",
      description: "A/B test thumbnail and packaging variants to find the strongest angle.",
      icon: <FlaskConical className="w-6 h-6 text-orange-500" />,
      link: "/dashboard/lab",
      linkText: "Go to Lab",
    },
    {
      title: "Channel",
      description: "Understand your audience and what works for your specific niche.",
      icon: <Tv className="w-6 h-6 text-blue-500" />,
      link: "/dashboard/channel",
      linkText: "Connect Channel",
    },
    {
      title: "History",
      description: "Track your analyses and learn what improves performance over time.",
      icon: <History className="w-6 h-6 text-zinc-500" />,
      link: "/dashboard/history",
      linkText: "View History",
    },
  ]

  return (
    <section className="w-full py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase mb-4 block">The PreYT Platform</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Everything you need to make better decisions.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex flex-col p-8 rounded-3xl border bg-card hover:shadow-sm transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                {cap.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{cap.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                {cap.description}
              </p>
              <Link href={cap.link} className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {cap.linkText} <span className="ml-1 text-primary">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
