import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("preyt_token")?.value
  const ytChannel = request.cookies.get("preyt_yt_channel")?.value

  const isAuthRoute = pathname === "/login" || pathname === "/signup"
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isOnboardingRoute = pathname.startsWith("/onboarding")

  // 1. If user is authenticated and visits /login or /signup, redirect forward
  if (isAuthRoute && token) {
    if (ytChannel) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // 2. If user is NOT authenticated and visits protected dashboard or onboarding routes
  if ((isDashboardRoute || isOnboardingRoute) && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/onboarding/:path*"
  ]
}
