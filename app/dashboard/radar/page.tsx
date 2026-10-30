import { Metadata } from "next"
import { RadarFeed } from "@/components/creator-radar/radar-feed"

export const metadata: Metadata = {
  title: "Creator Radar | PreYT Creator Intelligence",
  description: "Live search topic momentum, creator demand, and opportunity scores across global markets.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RadarPage() {
  return (
    <div className="p-4 sm:p-8">
      <RadarFeed />
    </div>
  )
}
