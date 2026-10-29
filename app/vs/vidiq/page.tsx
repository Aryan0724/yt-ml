import type { Metadata } from "next"
import Link from "next/link"
import { Check, X, ArrowRight, ShieldCheck, Sparkles, Eye, BarChart3, HelpCircle } from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema, FaqSchema, SoftwareAppSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "PreYT vs vidIQ: Pre-Upload Packaging vs Post-Upload Tag Optimization (2026 Comparison)",
  description: "An objective comparison of PreYT and vidIQ. Discover why modern YouTube recommendation algorithms prioritize visual glanceability and packaging over keyword meta tags.",
  alternates: {
    canonical: "/vs/vidiq",
  },
  openGraph: {
    title: "PreYT vs vidIQ: Pre-Upload Packaging vs Post-Upload Tag Optimization",
    description: "An architectural breakdown between pre-publish visual intelligence and legacy post-upload keyword analytics.",
    url: "https://preyt.integralgroups.in/vs/vidiq",
    siteName: "PreYT",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreYT vs vidIQ: Pre-Upload Packaging vs Post-Upload Tag Optimization",
    description: "An architectural breakdown between pre-publish visual intelligence and legacy post-upload keyword analytics.",
  }
}

const VIDIQ_FAQS = [
  {
    question: "Do YouTube tags still matter for video reach in 2026?",
    answer: "According to YouTube's official documentation, video tags play a minimal role in video discovery (<2% algorithmic weighting). They exist primarily to help surface videos when users frequently misspell keywords. Modern reach is overwhelmingly driven by Home and Suggested impressions, which rely on thumbnail glanceability, click-through rate (CTR), and average percentage viewed (APV)."
  },
  {
    question: "How does PreYT differ fundamentally from vidIQ?",
    answer: "vidIQ focuses on search-engine optimization (SEO), keyword competition scores, and post-publish telemetry. PreYT operates upstream before publishing: it utilizes OpenCV computer vision, perceptual hash saturation shields, and archetype-calibrated CTR forecasting to ensure your thumbnail and title hook win the initial impression impression batch."
  },
  {
    question: "Can I use PreYT and vidIQ together?",
    answer: "Yes. Many high-velocity production studios use vidIQ or TubeBuddy for channel audit management and historical search analytics, while using PreYT exclusively during the pre-production and packaging phase to stress-test thumbnails, safe-area overlaps, and title curiosity gaps before publishing."
  },
  {
    question: "Does PreYT require linking my YouTube channel credentials?",
    answer: "No. You can test and score thumbnails, titles, and simulated feed placements without connecting your channel credentials. We analyze packaging drafts using publicly observable algorithmic distribution models and computer vision heuristics."
  }
]

export default function VidIQComparisonPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-red-100 selection:text-red-900 pt-16">
      <SoftwareAppSchema
        name="PreYT Packaging Intelligence"
        description="Pre-upload visual prediction and outlier detection engine for YouTube creators."
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Comparisons", url: "/vs/vidiq" },
          { name: "PreYT vs vidIQ", url: "/vs/vidiq" }
        ]}
      />
      <FaqSchema items={VIDIQ_FAQS} />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-wider">
            <span>[ ARCHITECTURAL COMPARISON // 2026 EDITION ]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            PreYT vs vidIQ: <br />
            <span className="text-red-600">The Pre-Upload Paradigm Shift</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            An objective breakdown comparing legacy metadata keyword tracking with upstream visual glanceability, format-native computer vision, and outlier packaging intelligence.
          </p>
        </div>

        {/* Executive Summary Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">[ LEGACY MODEL ]</div>
            <h2 className="text-xl font-bold text-neutral-950">vidIQ: Search-Era Optimization</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Designed during the 2014–2020 era when search volume and meta tags drove discovery. Best suited for evergreen search tutorials, bulk channel metadata editing, and competitor channel tracking.
            </p>
            <div className="pt-2 text-xs font-semibold text-neutral-700">Primary Focus: Keyword volume &amp; post-upload stats.</div>
          </div>

          <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
            <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">[ MODERN RECOMMENDATION ]</div>
            <h2 className="text-xl font-bold text-neutral-950">PreYT: Pre-Upload Visual Forensics</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Engineered for the modern Browse &amp; Suggested feed ecosystem ($85\%+$ of YouTube views). Evaluates thumbnail luminance, safe area duration overlaps, perceptual hash saturation, and title curiosity gaps before a single view is wasted.
            </p>
            <div className="pt-2 text-xs font-semibold text-red-700">Primary Focus: Visual glanceability &amp; CTR prediction.</div>
          </div>
        </section>

        {/* Head-to-Head Comparison Matrix */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-neutral-950">Head-to-Head Feature Matrix</h2>
            <p className="text-xs text-neutral-500 font-mono">[ DIRECT CAPABILITY AUDIT ]</p>
          </div>

          <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200">
                    <th className="p-4 font-bold text-neutral-900 w-1/3">Evaluation Metric</th>
                    <th className="p-4 font-bold text-red-600 w-1/3">PreYT Intelligence</th>
                    <th className="p-4 font-bold text-neutral-700 w-1/3">vidIQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Primary Algorithmic Target</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      Home &amp; Suggested Browse Feeds (80%+ view source)
                    </td>
                    <td className="p-4 text-neutral-600">YouTube Search Bar &amp; Keyword queries</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Pre-Upload Simulation</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      Live Mobile/Desktop feed with timestamp safe zones &amp; 54-char truncation
                    </td>
                    <td className="p-4 text-neutral-600">Basic side-by-side static thumbnail view</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Computer Vision Analysis</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      Format-native OpenCV (Face crops, color temp, edge complexity, luminance)
                    </td>
                    <td className="p-4 text-neutral-600">Generic rule checklist (e.g. &quot;Add cards&quot;, &quot;Add tags&quot;)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Originality &amp; Saturation Defense</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      64-bit DCT Perceptual Hashing (Flags visual cliché duplication)
                    </td>
                    <td className="p-4 text-neutral-600">None (Focuses on identifying high-volume search tags)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Niche Archetype Calibration</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      Dedicated logic for Faceless, Cooking, Gaming, Tech, and Anime
                    </td>
                    <td className="p-4 text-neutral-600">Uniform SEO score applied across all genres</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Channel Authentication Required</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      No OAuth required for draft testing (Zero permission friction)
                    </td>
                    <td className="p-4 text-neutral-600">Requires full read/write YouTube account access</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-neutral-900">Public Feed Preview Utility</td>
                    <td className="p-4 text-neutral-700 font-semibold bg-red-50/30">
                      100% Free browser-based simulator
                    </td>
                    <td className="p-4 text-neutral-600">Requires browser extension install</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* When to Choose Which Tool */}
        <section className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4 p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
            <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
              When to Choose vidIQ
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <span>You create evergreen "How-To" search tutorials where search traffic accounts for 60%+ of total views.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <span>You manage a back-catalog of 200+ videos needing bulk description, end-screen, and tag updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <span>You want daily automated competitor subscriber tracking and milestone notifications.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 p-6 rounded-2xl border border-red-200 bg-red-50/30">
            <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              When to Choose PreYT
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Your growth depends on Home and Suggested feed recommendations (Video Essays, Gaming, Documentary, Vlog, Tech).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>You want to test thumbnail glanceability and title truncation before filming or spending \$1,000+ on production.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>You need objective computer vision feedback on focal contrast and visual saturation risk.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Free Tool Cross-Promotion Banner */}
        <section className="p-8 rounded-2xl bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[ NO SIGNUP REQUIRED ]</div>
            <h2 className="text-xl font-bold">Test Your Thumbnail in the Mobile Feed Simulator</h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Preview your thumbnail and title against real YouTube mobile dimensions, check the 54-character truncation cutoff, and verify the timestamp safe zone.
            </p>
          </div>
          <Link
            href="/tools/youtube-feed-preview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Launch Free Tool <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ Accordion Section for SEO Rich Snippets */}
        <section className="pt-8 border-t border-neutral-200">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-neutral-950">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-500 font-mono">[ ARCHITECTURAL PERSPECTIVE ]</p>
            </div>

            <div className="space-y-4">
              {VIDIQ_FAQS.map((faq, i) => (
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
