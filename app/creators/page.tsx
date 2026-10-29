import type { Metadata } from "next"
import { ComingSoonLight } from "@/components/landing/coming-soon-light"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "PreYT for Independent Creators — Pre-Publish Packaging Intelligence",
  description: "Built for YouTubers with 10K to 250K subscribers. Eliminate the guesswork from thumbnail design, titles, and niche packaging before recording.",
  alternates: {
    canonical: "/creators",
  },
  openGraph: {
    title: "PreYT for Independent Creators",
    description: "Audit thumbnails, predict CTR, and eliminate blindspots before you film.",
    url: "https://preyt.integralgroups.in/creators",
    siteName: "PreYT",
  }
}

export default function CreatorsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Creators", url: "/creators" }
        ]}
      />
      <ComingSoonLight title="For Independent Creators" />
    </>
  )
}
