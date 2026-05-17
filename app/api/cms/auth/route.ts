import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { email, passcode } = await request.json()

    if (!email || !passcode) {
      return NextResponse.json(
        { status: "error", message: "Email and passcode credentials are required." },
        { status: 400 }
      )
    }

    // 1. Verify Passcode
    if (passcode !== "ap_seo_2026") {
      return NextResponse.json(
        { status: "error", message: "Invalid enterprise passcode token." },
        { status: 401 }
      )
    }

    // 2. Query user in cms_users to verify admin approval
    const { data: user, error } = await supabaseServer
      .from("cms_users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single()

    if (error || !user) {
      // Proactively check if this is the master default email to auto-seed to prevent locking them out
      if (email.trim().toLowerCase() === "aryantiwari@integralgroups.in" || email.trim().toLowerCase() === "admin@integralgroups.in") {
        const defaultUser = {
          email: email.trim().toLowerCase(),
          full_name: "Aryantiwari Tiwari",
          role: "Super Admin",
          status: "active"
        }
        
        await supabaseServer.from("cms_users").insert([defaultUser])
        return NextResponse.json({
          status: "success",
          role: "Super Admin",
          full_name: defaultUser.full_name
        })
      }

      return NextResponse.json(
        { 
          status: "error", 
          message: "Access Denied: Your email has not been registered as an authorized CMS operator. Contact the system administrator to grant access." 
        },
        { status: 403 }
      )
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { status: "error", message: "Access Suspended: This CMS operator profile has been deactivated." },
        { status: 403 }
      )
    }

    // 3. Return verified role dynamically
    return NextResponse.json({
      status: "success",
      role: user.role,
      full_name: user.full_name
    })

  } catch (err: any) {
    console.error("CMS Auth Error:", err)
    return NextResponse.json(
      { status: "error", message: "Internal credentials validation error." },
      { status: 500 }
    )
  }
}
