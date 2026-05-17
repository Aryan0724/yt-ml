import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

/**
 * GET: Retrieves all backlink registries
 */
export async function GET() {
  try {
    const { data: backlinks, error } = await supabaseServer
      .from("cms_backlinks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: "success", data: backlinks })
  } catch (err: any) {
    console.error("Error fetching backlinks:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to retrieve backlinks." },
      { status: 500 }
    )
  }
}

/**
 * POST: Registers a new outreach backlink
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { source_url, target_page, anchor_text, backlink_type, status, notes } = payload

    if (!source_url || !target_page || !anchor_text) {
      return NextResponse.json(
        { status: "error", message: "Source URL, target page, and anchor text are required." },
        { status: 400 }
      )
    }

    const backlinkData = {
      source_url,
      target_page,
      anchor_text,
      backlink_type: backlink_type || "dofollow",
      status: status || "Active",
      notes: notes || "",
      created_at: new Date().toISOString()
    }

    const { data: newLink, error } = await supabaseServer
      .from("cms_backlinks")
      .insert([backlinkData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      status: "success", 
      message: "Backlink recorded successfully.", 
      data: newLink 
    })
  } catch (err: any) {
    console.error("Error saving backlink record:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to save backlink." },
      { status: 500 }
    )
  }
}
