export interface IdeaOutput {
  idea_id: string
  topic: string
  angle: string
  title_concept: string
  format: string
  audience: string
  hook: string
  why_now: string
  evidence: string
  difficulty: string
}

export interface IdeaGenerationResponse {
  topic: string
  classification: string
  captured_at: string
  ideas: IdeaOutput[]
}

export async function generateIdeas(topicSlug: string, region: string = "IN"): Promise<IdeaGenerationResponse> {
  const res = await fetch("/api/creator/ideas/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic_slug: topicSlug, region })
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to generate ideas")
  }
  
  return res.json()
}
