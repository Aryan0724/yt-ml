import { SpecViewer } from "@/components/spec/spec-viewer"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SpecPage({ params }: PageProps) {
  const { id } = await params

  return <SpecViewer specId={id} />
}
