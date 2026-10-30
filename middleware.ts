import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const token = request.cookies.get("preyt_token")?.value
  const ytChannel = request.cookies.get("preyt_yt_channel")?.value

  const isAuthRoute = pathname === "/login" || pathname === "/signup"
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isOnboardingRoute = pathname.startsWith("/onboarding")

  // If user explicitly navigated with ?logged_out=1 or ?force=1, wipe residual cookies and NEVER redirect away from /login
  if (isAuthRoute && (searchParams.has("logged_out") || searchParams.has("force"))) {
    const response = NextResponse.next()
    const cookieNames = [
      "preyt_token",
      "preyt_yt_channel",
      "preyt_user_id",
      "preyt_session_data",
      "preyt_active_channel"
    ]
    cookieNames.forEach((name) => {
      response.cookies.set(name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        sameSite: "lax"
      })
    })
    return response
  }

  // 1. If user is authenticated and visits /login or /signup, redirect forward to dashboard/onboarding
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
