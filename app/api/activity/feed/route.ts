import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

// High-fidelity fallback creator activities to ensure the dashboard feels alive
const SIMULATED_FEED_POOL = [
  { country: "US", city: "Austin", niche: "Gaming", action_type: "analyzed_thumbnails" },
  { country: "IN", city: "Mumbai", niche: "Entertainment", action_type: "optimized_clarity" },
  { country: "JP", city: "Tokyo", niche: "Anime", action_type: "compared_titles" },
  { country: "BR", city: "São Paulo", niche: "Tech", action_type: "generate_strategy" },
  { country: "GB", city: "London", niche: "Education", action_type: "analyzed_thumbnails" },
  { country: "CA", city: "Toronto", niche: "Finance", action_type: "compared_titles" },
  { country: "DE", city: "Berlin", niche: "Tech", action_type: "optimized_clarity" },
  { country: "AU", city: "Sydney", niche: "Vlogs", action_type: "generate_strategy" },
  { country: "FR", city: "Paris", niche: "Fashion", action_type: "analyzed_thumbnails" },
  { country: "ES", city: "Madrid", niche: "Comedy", action_type: "compared_titles" },
  { country: "KR", city: "Seoul", niche: "Gaming", action_type: "optimized_clarity" },
  { country: "SG", city: "Singapore", niche: "Finance", action_type: "generate_strategy" }
]

const NICHE_MOCK_CREATORS: Record<string, string[]> = {
  Gaming: ["@ApexLegend", "@NinjaPro", "@SpeedRunner", "@GamingNexus", "@ConsoleKing"],
  Tech: ["@CodePulse", "@LinusReview", "@TechCalibrate", "@SiliconDev", "@WebScale"],
  Entertainment: ["@ComedyCentral", "@BusterLaughs", "@ViralFuse", "@DailyDose", "@ShowStopper"],
  Anime: ["@OtakuRealm", "@AnimeSama", "@MangaPulse", "@SenpaiSpins", "@ChibiCritique"],
  Education: ["@SciShowcase", "@KurzInsight", "@VeritasThink", "@NumberBrain", "@HistoryHub"],
  Vlogs: ["@CaseyGrid", "@NomadLife", "@VlogVault", "@WanderLust", "@UrbanCam"],
  Finance: ["@WallStCapital", "@CryptoCaliber", "@BrokerPulse", "@EarnEquity", "@BudgetBoss"]
}

function getInitialSimulatedActivities(count = 8) {
  const activities = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const item = SIMULATED_FEED_POOL[i % SIMULATED_FEED_POOL.length]
    // Stagger timestamps backwards (e.g. 2m ago, 5m ago, etc.)
    const delayMinutes = (i + 1) * 3 + Math.floor(Math.random() * 3)
    const mockList = NICHE_MOCK_CREATORS[item.niche] || ["@AnonymizedCreator"]
    const channel = mockList[i % mockList.length]
    
    activities.push({
      id: `sim_${i}_${now}`,
      country: item.country,
      city: item.city,
      niche: item.niche,
      action_type: item.action_type,
      timestamp: new Date(now - delayMinutes * 60 * 1000).toISOString(),
      consent_public_showcase: false,
      allow_live_feed: true,
      channel: channel
    })
  }
  return activities
}

export async function GET(req: Request) {
  try {
    // 1. Fetch from Supabase activity_feed
    const { data: dbData, error: dbError } = await supabaseServer
      .from("activity_feed")
      .select("*")
      .eq("allow_live_feed", true)
      .order("timestamp", { ascending: false })
      .limit(20)

    if (dbError) {
      console.warn("Could not query activity_feed table (Supabase offline/not migrated):", dbError.message)
    }

    // 2. If database returns data, return it with privacy masks
    if (dbData && dbData.length > 0) {
      const sanitized = dbData.map((item, idx) => {
        let channel = "@AnonymizedCreator"
        if (item.consent_public_showcase && item.channel_id) {
          channel = item.channel_id.startsWith("@") ? item.channel_id : "@" + item.channel_id
        } else {
          // Mask with a fake handle matching their niche
          const mockList = NICHE_MOCK_CREATORS[item.niche] || ["@AnonymizedCreator"]
          const mockSeed = (item.id || String(idx)).charCodeAt(0) || 0
          channel = mockList[mockSeed % mockList.length]
        }
        return {
          id: item.id,
          country: item.country,
          city: item.city,
          niche: item.niche,
          action_type: item.action_type,
          timestamp: item.timestamp,
          consent_public_showcase: item.consent_public_showcase,
          allow_live_feed: item.allow_live_feed,
          channel: channel
        }
      })
      return NextResponse.json({ success: true, activities: sanitized, source: "database" })
    }

    const fallback = getInitialSimulatedActivities(8)
    return NextResponse.json({ success: true, activities: fallback, source: "simulation" })
  } catch (err: any) {
    console.error("GET Activity Feed API Error:", err)
    const fallback = getInitialSimulatedActivities(8)
    return NextResponse.json({ success: true, activities: fallback, source: "error_fallback" })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, channelLink, niche, country, city, consentShowcase, allowLiveFeed } = body

    if (!email || !channelLink || !niche || !country || !city) {
      return NextResponse.json({ error: "Missing required showcase application fields." }, { status: 400 })
    }

    // 1. Resolve waitlist user or create a new pending applicant
    let userId: string | null = null
    let localUser = getLocalApplicants().find((a) => a.email.toLowerCase() === email.toLowerCase())

    if (!localUser) {
      // Create new pending waitlist applicant on-the-fly
      const betaToken = "ap_" + Math.random().toString(36).substring(2, 15)
      const newUser = addOrUpdateLocalApplicant({
        full_name: email.split("@")[0],
        email: email.toLowerCase(),
        youtube_channel: channelLink,
        niche: niche,
        subscriber_count: 0,
        upload_frequency: "Weekly",
        reason_for_joining: "Showcase application onboarding signup",
        status: "pending",
        beta_access_token: betaToken,
        notes: "Registered via Showcase Apply form."
      })
      localUser = newUser
    }

    userId = localUser.id

    // Check if we can sync to Supabase waitlist_users
    try {
      const { data: dbUser } = await supabaseServer
        .from("waitlist_users")
        .select("id")
        .eq("email", email.toLowerCase())
        .single()

      if (dbUser) {
        userId = dbUser.id
      } else {
        // Create in Supabase waitlist_users
        const { data: insertedDbUser } = await supabaseServer
          .from("waitlist_users")
          .insert([
            {
              id: localUser.id,
              full_name: localUser.full_name,
              email: localUser.email,
              youtube_channel: localUser.youtube_channel,
              niche: localUser.niche,
              subscriber_count: 0,
              upload_frequency: "Weekly",
              reason_for_joining: "Showcase application onboarding signup",
              status: "pending",
              beta_access_token: localUser.beta_access_token,
              applied_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (insertedDbUser) userId = insertedDbUser.id
      }
    } catch (err: any) {
      console.warn("Could not sync waitlist_users for showcase request in Supabase:", err.message)
    }

    // 2. Insert record into activity_feed
    const activityData = {
      user_id: userId,
      channel_id: channelLink.replace("https://youtube.com/", "").replace("@", ""),
      country,
      city,
      niche,
      action_type: "applied_for_showcase",
      timestamp: new Date().toISOString(),
      consent_public_showcase: !!consentShowcase,
      allow_live_feed: !!allowLiveFeed
    }

    let savedDb = false
    try {
      const { error: insertError } = await supabaseServer
        .from("activity_feed")
        .insert([activityData])

      if (!insertError) savedDb = true
    } catch (err: any) {
      console.warn("Could not write activity_feed record to Supabase:", err.message)
    }

    // Return success. If DB is offline, local storage fallback registers success
    return NextResponse.json({
      success: true,
      savedDb,
      activity: {
        id: "loc_" + Math.random().toString(36).substring(2, 12),
        ...activityData
      }
    })
  } catch (err: any) {
    console.error("POST Activity Feed API Error:", err)
    return NextResponse.json({ error: err.message || "Showcase application failed." }, { status: 500 })
  }
}
