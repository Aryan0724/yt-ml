import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    // 1. Fetch all applicants to compute server-side stats (fast for beta sizes)
    const { data: users, error: userError } = await supabaseServer
      .from("waitlist_users")
      .select("status, niche, subscriber_count, total_logins, total_analyses")

    if (userError) throw userError

    const totalApplications = users?.length || 0
    let approvedCreators = 0
    let pendingApplications = 0
    let activeUsers = 0
    let totalAnalyses = 0
    let totalSubsCombined = 0

    const nicheBreakdown: Record<string, number> = {}

    users?.forEach((u) => {
      totalSubsCombined += u.subscriber_count || 0
      totalAnalyses += u.total_analyses || 0

      if (u.status === "approved") approvedCreators++
      if (u.status === "pending") pendingApplications++
      if (u.total_logins > 0) activeUsers++

      // Count niche distribution
      nicheBreakdown[u.niche] = (nicheBreakdown[u.niche] || 0) + 1
    })

    const avgSubscribers = totalApplications > 0 ? Math.round(totalSubsCombined / totalApplications) : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalApplications,
        approvedCreators,
        pendingApplications,
        activeUsers,
        totalAnalyses,
        avgSubscribers,
      },
      niches: Object.entries(nicheBreakdown).map(([name, count]) => ({ name, count })),
    })
  } catch (err: any) {
    console.error("Admin Analytics API Error:", err)
    return NextResponse.json({ error: err.message || "Failed to compile system analytics." }, { status: 500 })
  }
}
