import type { Metadata } from "next"
import { SpecViewer } from "@/components/spec/spec-viewer"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const cleanTitle = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return {
    title: `${cleanTitle} — Packaging Audit Spec | PreYT`,
    description: `Collaborative pre-upload packaging audit and review spec for ${cleanTitle}. Evaluate thumbnail contrast, hook angles, and mobile safe areas.`,
    alternates: {
      canonical: `/spec/${id}`,
    },
    openGraph: {
      title: `${cleanTitle} — Packaging Audit Spec`,
      description: `Collaborative pre-upload packaging audit for ${cleanTitle}.`,
      url: `https://preyt.integralgroups.in/spec/${id}`,
      siteName: "PreYT",
    }
  }
}

export default async function SpecPage({ params }: PageProps) {
  const { id } = await params

  return <SpecViewer specId={id} />
}
