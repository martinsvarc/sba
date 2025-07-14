import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to the exact root path
  if (request.nextUrl.pathname === "/") {
    // Use a random number to determine which variant to show (50/50 split)
    const variant = Math.random() < 0.5 ? "a" : "1"

    // Create the redirect URL and preserve search parameters (UTMs)
    const redirectUrl = new URL(`/${variant}`, request.url)
    redirectUrl.search = request.nextUrl.search // Preserve all query parameters including UTMs

    // Set a cookie to remember which variant the user saw
    const response = NextResponse.redirect(redirectUrl, {
      status: 302, // Temporary redirect
    })

    // Store the variant in a cookie
    response.cookies.set("ab-variant", variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return response
  }

  return NextResponse.next()
}

// Only run middleware on the home route
export const config = {
  matcher: "/",
}
