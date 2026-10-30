/**
 * lib/onboarding/store.ts
 * 
 * Manages creator onboarding state, connected channels, and personalization preferences.
 */

export interface OnboardingState {
  userId: string
  authenticationCompleted: boolean
  youtubeConnected: boolean
  channelSelected: boolean
  personalizationCompleted: boolean
  completedAt?: string | null
  connectedChannel?: {
    id: string
    title: string
    handle: string
    avatarUrl: string
    subscriberCount: number
    videoCount: number
    totalViews: number
  } | null
  preferences?: {
    creatorCategory?: string
    primaryGoal?: string
    publishingFrequency?: string
  } | null
}

const globalForOnboarding = globalThis as unknown as {
  preytOnboardingMap?: Map<string, OnboardingState>
}

const onboardingMap = globalForOnboarding.preytOnboardingMap || new Map<string, OnboardingState>()

if (process.env.NODE_ENV !== "production") {
  globalForOnboarding.preytOnboardingMap = onboardingMap
}

export function getOnboardingState(userId: string): OnboardingState {
  if (!onboardingMap.has(userId)) {
    onboardingMap.set(userId, {
      userId,
      authenticationCompleted: true,
      youtubeConnected: false,
      channelSelected: false,
      personalizationCompleted: false,
      completedAt: null,
      connectedChannel: null,
      preferences: null
    })
  }
  return onboardingMap.get(userId)!
}

export function updateOnboardingState(
  userId: string,
  updates: Partial<OnboardingState>
): OnboardingState {
  const current = getOnboardingState(userId)
  const updated = {
    ...current,
    ...updates
  }
  onboardingMap.set(userId, updated)
  return updated
}
