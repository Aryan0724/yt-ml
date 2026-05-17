import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

/**
 * GET: Retrieves all authorized CMS operator accounts
 */
export async function GET() {
  try {
    const { data: users, error } = await supabaseServer
      .from("cms_users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: "success", data: users })
  } catch (err: any) {
    console.error("Error fetching CMS operators list:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to retrieve operators." },
      { status: 500 }
    )
  }
}

/**
 * POST: Approves and registers a new email for CMS Access
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { email, full_name, role } = payload

    if (!email || !full_name) {
      return NextResponse.json(
        { status: "error", message: "Operator email and full name are required." },
        { status: 400 }
      )
    }

    const userData = {
      email: email.trim().toLowerCase(),
      full_name,
      role: role || "Writer",
      status: "active",
      created_at: new Date().toISOString()
    }

    const { data: newUser, error } = await supabaseServer
      .from("cms_users")
      .insert([userData])
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { status: "error", message: "This email has already been registered and granted CMS access." },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({
      status: "success",
      message: "CMS Operator registered successfully.",
      data: newUser
    })

  } catch (err: any) {
    console.error("Error creating CMS operator record:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to add CMS operator." },
      { status: 500 }
    )
  }
}
