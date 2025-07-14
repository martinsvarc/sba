"use client"

import { useEffect } from "react"

export default function HotjarScript() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Hotjar Tracking Code
      ;((h: any, o: any, t: any, j: any, a?: any, r?: any) => {
        h.hj =
          h.hj ||
          (() => {
            ;(h.hj.q = h.hj.q || []).push(arguments)
          })
        h._hjSettings = { hjid: 6423264, hjsv: 6 }
        a = o.getElementsByTagName("head")[0]
        r = o.createElement("script")
        r.async = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=")
    }
  }, []) // Empty dependency array ensures this runs once after initial render

  // Return null as this component doesn't render anything visible
  return null
}
