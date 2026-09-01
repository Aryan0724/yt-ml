import { ArrowRight, Compass, Lightbulb, Package, Upload, BookOpen } from "lucide-react"

export function ProcessLoop() {
  const steps = [
    {
      icon: <Compass className="w-5 h-5 text-primary" />,
      title: "Discover",
      description: "Find emerging topics and opportunities.",
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      title: "Decide",
      description: "Understand demand and momentum.",
    },
    {
      icon: <Package className="w-5 h-5 text-blue-500" />,
      title: "Package",
      description: "Improve title and thumbnail.",
    },
    {
      icon: <Upload className="w-5 h-5 text-indigo-500" />,
      title: "Publish",
      description: "Ship with evidence-backed confidence.",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      title: "Learn",
      description: "Use your history to improve future decisions.",
    },
  ]

  return (
    <section className="w-full bg-muted/30 border-y py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">How PreYT works</h2>
          <p className="text-muted-foreground text-lg">A systematic approach to creator intelligence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[1px] bg-border" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {/* Mobile connecting arrow */}
              {i < steps.length - 1 && (
                <div className="md:hidden mt-8 text-muted/50">
                  <ArrowRight className="w-6 h-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
