"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function LandingPageVariantTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only run on landing pages
    if (pathname !== "/" && pathname !== "/a" && pathname !== "/1" && pathname !== "/watch") {
      return
    }

    try {
      // Determine the variant based on the current path
      let variant = "unknown"
      let path = "/"

      if (pathname === "/a") {
        variant = "variant_a"
        path = "/a"
      } else if (pathname === "/1") {
        variant = "variant_1"
        path = "/1"
      } else if (pathname === "/" || pathname === "/watch") {
        variant = "root_redirect"
        path = "/"
      }

      // Store the variant information in localStorage and sessionStorage
      localStorage.setItem("sba_landing_variant", variant)
      localStorage.setItem("sba_landing_path", path)
      sessionStorage.setItem("sba_landing_variant", variant)
      sessionStorage.setItem("sba_landing_path", path)

      console.log("🎯 Landing page variant stored:", { variant, path, pathname })

      // Also set a cookie for middleware compatibility
      document.cookie = `landing_variant=${variant}; path=/; max-age=86400` // 24 hours
      document.cookie = `landing_path=${path}; path=/; max-age=86400` // 24 hours
    } catch (error) {
      console.warn("Error storing landing page variant:", error)
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
