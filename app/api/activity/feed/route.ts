import { NextResponse } from "next/server"
import { getLocalApplicants, addOrUpdateLocalApplicant } from "@/lib/local-db"

export const runtime = "nodejs"

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
    const localApplicants = getLocalApplicants()
    const showcaseApplicants = localApplicants.filter(a => a.consent_public_showcase)

    const liveItems = showcaseApplicants.map((item: any, idx: number) => {
      let channel = "@AnonymizedCreator"
      if (item.youtube_channel) {
        channel = item.youtube_channel.startsWith("@") ? item.youtube_channel : "@" + item.youtube_channel
      }
      return {
        id: item.id || `live_${idx}`,
        country: item.country || "US",
        city: "Global",
        niche: item.niche || "Creator",
        action_type: "analyzed_package",
        timestamp: item.applied_at || new Date().toISOString(),
        consent_public_showcase: true,
        allow_live_feed: true,
        channel
      }
    })

    const simulated = getInitialSimulatedActivities(Math.max(0, 10 - liveItems.length))
    const combined = [...liveItems, ...simulated].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      success: true,
      activities: combined
    })
  } catch (err: any) {
    console.error("GET Activity Feed API Error:", err)
    return NextResponse.json({
      success: true,
      activities: getInitialSimulatedActivities(8)
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      fullName,
      email,
      channelLink,
      niche = "Tech",
      country = "US",
      city = "Unknown",
      consentShowcase = true,
      allowLiveFeed = true
    } = body

    if (!email || !channelLink) {
      return NextResponse.json({ error: "Missing required channel information." }, { status: 400 })
    }

    const betaToken = "bw_" + Math.random().toString(36).substring(2, 10)
    const localUser = addOrUpdateLocalApplicant({
      full_name: fullName || "Creator",
      email: email.toLowerCase(),
      youtube_channel: channelLink,
      niche,
      country,
      upload_frequency: "Weekly",
      reason_for_joining: "Showcase application onboarding signup",
      status: "pending",
      consent_public_showcase: !!consentShowcase,
      beta_access_token: betaToken,
      notes: "Registered via Showcase Apply form."
    })

    const activityData = {
      user_id: localUser.id,
      channel_id: channelLink.replace("https://youtube.com/", "").replace("@", ""),
      country,
      city,
      niche,
      action_type: "applied_for_showcase",
      timestamp: new Date().toISOString(),
      consent_public_showcase: !!consentShowcase,
      allow_live_feed: !!allowLiveFeed
    }

    return NextResponse.json({
      success: true,
      savedDb: true,
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
