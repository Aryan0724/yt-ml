import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { PreviewStack } from "@/components/landing/preview-stack"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="landing-page-container">
      {/* Exact Terms.so Non-Linear 32-Stop Gradient infused with pure YouTube Red */}
      <div className="hero-background-gradient">
        {/* Electric YouTube Red Radial Aura directly behind the headline */}
        <div className="hero-radial-glow" />
      </div>

      <div className="landing relative z-10">
        <Navbar />
        <main className="w-full">
          <Hero />
          <PreviewStack />
        </main>
        <Footer />
      </div>
    </div>
  )
}

