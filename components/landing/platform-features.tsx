import Link from "next/link"
import { Radar, Lightbulb, ActivitySquare, FlaskConical, Tv, History, ArrowRight } from "lucide-react"

export function PlatformFeatures() {
  const features = [
    {
      icon: <Radar className="w-6 h-6 text-green-500" />,
      title: "Radar",
      description: "Track real-time trends across YouTube and the internet.",
      linkText: "Explore Radar",
      href: "/dashboard/radar",
      iconBg: "bg-green-50"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-red-400" />,
      title: "Ideas",
      description: "Turn trends into video ideas with proven potential.",
      linkText: "Find Ideas",
      href: "/dashboard/ideas",
      iconBg: "bg-red-50"
    },
    {
      icon: <ActivitySquare className="w-6 h-6 text-purple-500" />,
      title: "Analyze",
      description: "Evaluate your title, thumbnail and topic with AI.",
      linkText: "Analyze Now",
      href: "/dashboard/analyze",
      iconBg: "bg-purple-50"
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-orange-400" />,
      title: "Lab",
      description: "A/B test thumbnails and packaging before you publish.",
      linkText: "Go to Lab",
      href: "/dashboard/lab",
      iconBg: "bg-orange-50"
    },
    {
      icon: <Tv className="w-6 h-6 text-blue-500" />,
      title: "Channel",
      description: "Understand your audience and what works for you.",
      linkText: "Connect Channel",
      href: "/dashboard/channel",
      iconBg: "bg-blue-50"
    },
    {
      icon: <History className="w-6 h-6 text-zinc-500" />,
      title: "History",
      description: "Track your analyses and learn what improves performance.",
      linkText: "View History",
      href: "/dashboard/history",
      iconBg: "bg-zinc-100"
    }
  ]

  return (
    <section className="w-full py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
            The PreYT Platform
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Everything you need to create better videos, consistently.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                {feature.description}
              </p>
              <Link href={feature.href} className="text-sm font-semibold flex items-center group">
                {feature.linkText} 
                <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
