import Link from "next/link"
import { ArrowRight, CheckCircle2, TrendingUp, Users, Search, Target } from "lucide-react"

export function EvidenceSection() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="max-w-lg">
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4">
              Data-Backed Intelligence
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              We don't guess.<br />We measure everything.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              PreYT uses multiple data sources, proprietary models and real creator performance signals to surface high-opportunity topics and packaging insights.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Real-time trend tracking",
                "Opportunity scoring model",
                "Evidence behind every insight"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/about/data" className="text-sm font-semibold flex items-center group">
              Learn more about our data 
              <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            
            {/* Opportunity Card */}
            <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">AI Agents</h3>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded tracking-wider uppercase">Rising</span>
              </div>
              <div className="text-[11px] text-muted-foreground mb-1">Opportunity Score</div>
              <div className="text-4xl font-bold mb-4">82</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                High demand. Low saturation.<br />Great time to create.
              </p>
              <button className="w-full py-2 bg-zinc-50 border border-border rounded-lg text-xs font-semibold hover:bg-zinc-100 transition-colors">
                Explore topic
              </button>
              
              <div className="mt-6 pt-6 border-t border-dashed">
                <div className="font-semibold text-xs mb-2">Why it's rising</div>
                <p className="text-[10px] text-muted-foreground mb-4">Search activity is accelerating with consistent growth across topics and queries.</p>
                <Link href="#" className="text-[10px] font-semibold flex items-center">
                  View evidence <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            {/* Metrics Card */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-border/50 flex flex-col justify-between sm:-mt-12 sm:mb-12 relative z-0">
              <div>
                <h3 className="font-semibold text-sm mb-8">Creators trust PreYT</h3>
                
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">10,000+</div>
                    <div className="text-[10px] text-muted-foreground">Creators</div>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">50M+</div>
                    <div className="text-[10px] text-muted-foreground">Topics analyzed</div>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">1M+</div>
                    <div className="text-[10px] text-muted-foreground">Analyses completed</div>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">98%</div>
                    <div className="text-[10px] text-muted-foreground">Would recommend</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-zinc-50 rounded-3xl -z-10 scale-105 transform translate-y-4" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          </div>

        </div>
      </div>
    </section>
  )
}
