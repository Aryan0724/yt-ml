import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Star, PlayCircle, Eye, AlignLeft } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <div className="flex flex-col items-start space-y-8 max-w-xl z-10">
            <div className="inline-flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Creator Intelligence Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-[72px] font-bold tracking-tight text-foreground leading-[1.05]">
              Know what to<br />create next<span className="text-primary">.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              PreYT turns real-time trends and data into opportunities so you can create videos people actually want to watch.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
              <Button size="lg" asChild className="w-full sm:w-auto rounded-full px-8 h-12 text-sm shadow-sm bg-foreground text-background hover:bg-foreground/90">
                <Link href="/dashboard/radar">
                  Explore what's trending <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto rounded-full px-8 h-12 text-sm bg-background border-border text-foreground hover:bg-muted/50">
                <Link href="/dashboard/analyze">
                  Analyze a package <Sparkles className="ml-2 h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Creator" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-[#F59E0B]">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground mt-0.5">Loved by 10,000+ creators</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Mock */}
          <div className="relative z-10 w-[140%] max-w-[850px] bg-background border border-border/50 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex overflow-hidden">
            
            {/* Sidebar Mock */}
            <div className="w-16 border-r border-border/50 flex flex-col items-center py-6 gap-6 bg-zinc-50/30">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <HomeIcon />
              </div>
              <RadarIcon />
              <IdeaIcon />
              <LabIcon />
              <ChannelIcon />
              <HistoryIcon />
              <div className="flex-1" />
              <SettingsIcon />
            </div>

            {/* Content Mock */}
            <div className="flex-1 p-8 bg-background">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Good morning, Aryan 👋</h2>
                  <p className="text-sm text-muted-foreground">Here's your creator intelligence for today.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium">
                  <span>🇮🇳</span> India
                </div>
              </div>

              {/* What's happening now */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">What's happening now</h3>
                  <span className="text-xs text-primary font-medium cursor-pointer">View Radar →</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { title: "AI Agents", tag: "BREAKING", tagColor: "bg-red-50 text-red-600 border-red-100", score: 82, trend: "+42%", color: "text-primary" },
                    { title: "iPhone 16 Leaks", tag: "RISING", tagColor: "bg-primary/10 text-primary border-primary/20", score: 76, trend: "+31%", color: "text-primary" },
                    { title: "Cricket World Cup 2024", tag: "HOT", tagColor: "bg-orange-50 text-orange-600 border-orange-100", score: 71, trend: "↑ 18%", color: "text-primary" },
                    { title: "YouTube Automation", tag: "RISING", tagColor: "bg-primary/10 text-primary border-primary/20", score: 68, trend: "↑ 26%", color: "text-primary" },
                  ].map((card, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-white">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border mb-3 ${card.tagColor}`}>{card.tag}</span>
                      <h4 className="font-semibold text-[13px] leading-snug mb-4">{card.title}</h4>
                      <div className="text-[10px] text-muted-foreground mb-1">Opportunity</div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-semibold leading-none">{card.score}</span>
                        <span className={`text-[10px] font-medium leading-none mb-0.5 ${card.color}`}>{card.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom 2 cols */}
              <div className="grid grid-cols-2 gap-8">
                {/* Top Opportunities */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm">Top opportunities for you</h3>
                    <span className="text-xs text-primary font-medium cursor-pointer">View all →</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "I Let an AI Agent Run My Business for 7 Days", tags: "AI Agents · How-to / Experiment", score: 84 },
                      { title: "10 AI Tools That Replace Expensive Software", tags: "AI Tools · Listicle", score: 82 },
                      { title: "iPhone 16 - Top 10 Hidden Features", tags: "iPhone 16 · Review", score: 78 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-zinc-50 transition-colors">
                        <div>
                          <div className="font-medium text-sm mb-1">{item.title}</div>
                          <div className="text-[11px] text-muted-foreground">{item.tags}</div>
                        </div>
                        <div className="text-primary font-bold text-lg">{item.score}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Analyses */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm">Recent analyses</h3>
                    <span className="text-xs text-primary font-medium cursor-pointer">View all →</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "AI Agent Built My Business", date: "May 16, 2024", score: 82, img: "1" },
                      { title: "iPhone 16 Long Term Review", date: "May 15, 2024", score: 74, img: "2" },
                      { title: "I Built a Gaming Setup", date: "May 14, 2024", score: 68, img: "3" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-zinc-200 border overflow-hidden">
                            <img src={`https://picsum.photos/seed/${item.img}/100/60`} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <div className="font-medium text-[13px] mb-0.5">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground">{item.date}</div>
                          </div>
                        </div>
                        <div className="text-primary font-bold text-lg">{item.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

function HomeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function RadarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="M12 12v-3a3 3 0 0 1 3-3"/></svg> }
function IdeaIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> }
function LabIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg> }
function ChannelIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg> }
function HistoryIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg> }
function SettingsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-foreground"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> }
