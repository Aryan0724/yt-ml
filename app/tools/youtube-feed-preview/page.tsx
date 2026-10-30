import type { Metadata } from "next"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"
import { PublicFeedPreviewer } from "@/components/tools/public-feed-previewer"

export const metadata: Metadata = {
  title: "Free YouTube Thumbnail Previewer & Mobile Feed Tester",
  description: "Test your YouTube thumbnail and title draft in a simulated live feed before publishing. Check mobile cutoffs, dark mode contrast, and timestamp safe areas.",
  alternates: {
    canonical: "https://preyt.integralgroups.in/tools/youtube-feed-preview",
  },
  openGraph: {
    title: "Free YouTube Thumbnail Previewer & Mobile Feed Tester",
    description: "Simulate your thumbnail and title on YouTube mobile and desktop feeds before filming or publishing.",
    url: "https://preyt.integralgroups.in/tools/youtube-feed-preview",
    siteName: "PreYT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Thumbnail Previewer & Mobile Feed Tester",
    description: "Simulate your thumbnail and title on YouTube mobile and desktop feeds before filming or publishing.",
  }
}

const FEED_PREVIEW_FAQS = [
  {
    question: "Where does YouTube truncate video titles on mobile?",
    answer: "On iOS and Android smartphones, the YouTube feed typically truncates titles at 50 to 55 characters (depending on character width and screen DPI). Your primary curiosity hook, stakes, or key subject must appear in the first 45 characters to avoid being hidden behind an ellipsis (...)."
  },
  {
    question: "What is the YouTube thumbnail timestamp danger zone?",
    answer: "YouTube overlays a solid black duration badge (e.g., '12:45') in the bottom-right corner of every thumbnail. This badge covers approximately 15% of the bottom-right canvas area on mobile screens. Never place faces, punchline text, key subject items, or logos in this quadrant."
  },
  {
    question: "Why should I test my thumbnail in both dark and light modes?",
    answer: "Over 68% of mobile YouTube viewers utilize Dark Mode. Thumbnails with dark perimeter backgrounds without rim lighting or edge contrast blend seamlessly into the YouTube dark UI, losing the edge-separation required to draw the eye during high-velocity feed scrolling."
  },
  {
    question: "What is the 'Squint Test' for YouTube thumbnails?",
    answer: "The squint test is a visual processing heuristic: when reduced to 120 pixels wide (the size of a smartphone thumbnail) or viewed with squinted eyes, does the primary subject and emotional tension immediately register within 150 milliseconds? If details blend together, the composition is too cluttered."
  }
]

export default function YouTubeFeedPreviewPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900">
      <SoftwareAppSchema
        name="PreYT YouTube Thumbnail Previewer"
        description="Free browser-based YouTube feed simulator for creators to evaluate thumbnail contrast, safe area timestamp coverage, and title truncation."
        applicationCategory="DesignApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/features" },
          { name: "YouTube Thumbnail Previewer", url: "/tools/youtube-feed-preview" }
        ]}
      />
      <FaqSchema items={FEED_PREVIEW_FAQS} />
      <Navbar variant="light" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
            <span>[ FREE CREATOR UTILITY // ZERO SIGNUP ]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            YouTube Thumbnail Previewer <br />
            <span className="text-red-600">&amp; Mobile Feed Simulator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Test glanceability, safe-area duration overlaps, and title truncation cutoffs on simulated mobile and desktop feeds before you publish.
          </p>
        </div>

        {/* Interactive Simulator Component */}
        <PublicFeedPreviewer />

        {/* Educational Authority Deep Dive */}
        <section className="mt-24 pt-16 border-t border-neutral-200 grid md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ 01 / MOBILE_FIRST ]</div>
            <h2 className="text-lg font-bold text-neutral-950">The 54-Character Ellipsis Rule</h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              72% of YouTube consumption occurs on mobile devices. Titles exceeding 54 characters get abruptly cut off with an ellipsis. If your curiosity gap isn't established in the first 6 words, viewers scroll past.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ 02 / SAFE_AREAS ]</div>
            <h2 className="text-lg font-bold text-neutral-950">The Bottom-Right Danger Zone</h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              YouTube's native video duration timestamp permanently overlays the lower-right 15% of your canvas. Crucial facial expressions or key text placed in this quadrant become illegible blobs.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ 03 / LUMINANCE ]</div>
            <h2 className="text-lg font-bold text-neutral-950">Dark UI Edge Separation</h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              In dark mode, dark thumbnails bleed into the feed background. Apply 15–20% rim lighting or saturated edge borders around your central subject to enforce instant foreground isolation.
            </p>
          </div>
        </section>

        {/* FAQ Accordion Section for Rich Snippets */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">[ Packaging Architecture Insights ]</p>
            </div>

            <div className="space-y-6">
              {FEED_PREVIEW_FAQS.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <h3 className="text-sm font-bold text-neutral-950">{faq.question}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
