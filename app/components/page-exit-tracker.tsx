"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageExitData {
  visitorId: string
  entryTime: string
  exitTime: string
  timeSpentMs: number
  activeTimeMs: number
  exitPath: string | null
  exitUrl: string
  referrer: string | null
  currentPath: string
  currentUrl: string
  userAgent: string
}

export default function PageExitTracker() {
  const [entryTime] = useState(new Date())
  const pathname = usePathname()
  const webhookUrl = "https://n8n.automatedsolarbiz.com/webhook/3bd7b5d3-75fe-4c0b-8d9a-09c03d2d4d3e"

  // Only run on the main landing page (which is /watch or /)
  const isMainLandingPage = pathname === "/watch" || pathname === "/"

  useEffect(() => {
    // Get current pathname
    const currentPath = window.location.pathname

    // STRICT CHECK - Only run on main landing page
    if (currentPath !== "/watch" && currentPath !== "/") {
      console.log("🚫 Page exit tracker COMPLETELY DISABLED - Current path:", currentPath)
      return () => {} // Return empty cleanup function and do nothing
    }

    // Double check with pathname hook as well
    if (pathname !== "/watch" && pathname !== "/") {
      console.log("🚫 Page exit tracker COMPLETELY DISABLED - Pathname hook:", pathname)
      return () => {} // Return empty cleanup function and do nothing
    }

    console.log("✅ Page exit tracker enabled ONLY for main landing page:", currentPath)

    // Generate or retrieve persistent visitor ID
    let visitorId = localStorage.getItem("sba_visitor_id")
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("sba_visitor_id", visitorId)
    }

    // Make visitor ID available globally for other components
    window.sbaVisitorId = visitorId
    console.log("🆔 Visitor ID:", visitorId)

    // Time tracking variables
    let activeTimeMs = 0
    let lastActiveTime = new Date()
    let isActive = true
    let hasBeenSent = false // Prevent duplicate sends
    let lastSentTime = 0 // Throttle sends

    // Detect device type with more reliable detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isAndroid = /Android/.test(navigator.userAgent)
    const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(navigator.userAgent)
    const isDesktop = !isMobile

    console.log("📱 Device detection:", {
      isIOS,
      isAndroid,
      isMobile,
      isDesktop,
      userAgent: navigator.userAgent,
    })

    // Function to update active time
    const updateActiveTime = () => {
      if (isActive) {
        const now = new Date()
        const timeSinceLastUpdate = now.getTime() - lastActiveTime.getTime()
        activeTimeMs += timeSinceLastUpdate
        lastActiveTime = now
        console.log(`⏱️ Active time updated: +${timeSinceLastUpdate}ms = ${activeTimeMs}ms total`)
      }
    }

    // Extract and store UTM parameters - improved version
    const extractUtmParams = (): Record<string, string> => {
      const params: Record<string, string> = {}

      // Get UTMs from URL
      const queryParams = new URLSearchParams(window.location.search)
      queryParams.forEach((value, key) => {
        if (key.toLowerCase().startsWith("utm_") && value) {
          params[key.toLowerCase()] = value
          console.log(`📊 Found UTM in URL: ${key}=${value}`)
        }
      })

      // If no UTMs in URL, try to get from localStorage
      if (Object.keys(params).length === 0) {
        try {
          const storedUtmString = localStorage.getItem("sba_utm_params")
          if (storedUtmString) {
            const storedParams = JSON.parse(storedUtmString)
            Object.keys(storedParams).forEach((key) => {
              if (key.toLowerCase().startsWith("utm_") && storedParams[key]) {
                params[key.toLowerCase()] = storedParams[key]
                console.log(`📊 Using stored UTM: ${key}=${storedParams[key]}`)
              }
            })
          }
        } catch (e) {
          console.error("Error parsing stored UTM params", e)
        }
      }

      // Store UTMs in localStorage for future use
      if (Object.keys(params).length > 0) {
        localStorage.setItem("sba_utm_params", JSON.stringify(params))
        console.log("📝 Stored UTM params:", params)
      } else {
        console.log("⚠️ No UTM parameters found")
      }

      return params
    }

    // Extract UTMs on page load
    const utmParams = extractUtmParams()

    // Function to determine if a path/URL is to the application
    const isApplicationPath = (path: string | null): boolean => {
      if (!path) return false

      // Check for /applynow in the path
      if (path.includes("/applynow")) return true

      if (path === "button_click") {
        // Check if any apply now buttons exist and are visible
        const applyButtons = document.querySelectorAll('a[href*="/applynow"], button')
        for (const button of applyButtons) {
          const buttonText = button.textContent?.toLowerCase() || ""
          if (
            buttonText.includes("apply") ||
            (button instanceof HTMLAnchorElement && button.href.includes("/applynow"))
          ) {
            console.log("🎯 Found Apply Now button:", button)
            return true
          }
        }
      }

      return false
    }

    // Store data in localStorage for later sending
    const storeExitData = (data: any) => {
      try {
        // Store the current exit data
        localStorage.setItem(
          "sba_exit_data",
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        )
        console.log("💾 Stored exit data in localStorage for later sending")
        return true
      } catch (e) {
        console.error("❌ Failed to store exit data:", e)
        return false
      }
    }

    // Enhanced webhook sending function with retry logic
    const sendWebhookWithRetry = async (data: any, maxRetries = 3): Promise<boolean> => {
      // Always store data first (for iOS especially)
      storeExitData(data)

      // On iOS, we'll rely on the next page load to send the data
      if (isIOS) {
        console.log("🍎 iOS detected - storing data for next page load")
        return true
      }

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📤 Webhook attempt ${attempt}/${maxRetries}:`, data)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            signal: controller.signal,
            keepalive: true,
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            console.log(`✅ Webhook success on attempt ${attempt}:`, response.status, response.statusText)
            const responseText = await response.text()
            console.log("📝 Webhook response body:", responseText)
            return true
          } else {
            console.warn(`⚠️ Webhook failed on attempt ${attempt}:`, response.status, response.statusText)
            if (attempt === maxRetries) {
              console.error("❌ All webhook attempts failed")
              return false
            }
          }
        } catch (error) {
          console.warn(`⚠️ Webhook error on attempt ${attempt}:`, error)

          if (attempt === maxRetries) {
            console.error("❌ All webhook attempts failed with error:", error)
            return false
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s...
          console.log(`⏳ Waiting ${delay}ms before retry...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      return false
    }

    // Check for stored data from previous session and send it
    const checkAndSendStoredData = async () => {
      try {
        const storedDataString = localStorage.getItem("sba_exit_data")
        if (storedDataString) {
          const storedData = JSON.parse(storedDataString)
          console.log("🔄 Found stored exit data from previous session:", storedData)

          // Only send if it's recent (within last 10 minutes)
          const dataAge = Date.now() - storedData.timestamp
          if (dataAge < 10 * 60 * 1000) {
            console.log("📤 Sending stored exit data from previous session")

            try {
              const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...storedData.data,
                  sentFromNextSession: true,
                  dataAgeMs: dataAge,
                }),
              })

              if (response.ok) {
                console.log("✅ Successfully sent stored exit data")
                localStorage.removeItem("sba_exit_data")
              } else {
                console.warn("⚠️ Failed to send stored exit data:", response.status)
              }
            } catch (e) {
              console.error("❌ Error sending stored exit data:", e)
            }
          } else {
            console.log("⏰ Stored exit data too old, discarding")
            localStorage.removeItem("sba_exit_data")
          }
        }
      } catch (e) {
        console.error("❌ Error processing stored exit data:", e)
        localStorage.removeItem("sba_exit_data")
      }
    }

    // Check for stored data on page load
    checkAndSendStoredData()

    const sendExitData = async (nextPath: string | null = null, exitType = "unknown") => {
      // Throttle sends (no more than once every 2 seconds)
      const now = Date.now()
      if (now - lastSentTime < 2000) {
        console.log("🚫 Throttling webhook send - too soon since last send")
        return
      }
      lastSentTime = now

      // For desktop, allow multiple sends for different exit types
      if (hasBeenSent && !isIOS && exitType !== "before_unload" && exitType !== "visibility") {
        console.log("🚫 Exit data already sent, skipping duplicate for:", exitType)
        return
      }

      // Update active time before sending
      updateActiveTime()

      // TRIPLE CHECK - Make sure we're still on the landing page before sending
      const currentPagePath = window.location.pathname
      if (
        currentPagePath !== "/watch" &&
        currentPagePath !== "/" &&
        currentPagePath !== "/a" &&
        currentPagePath !== "/1"
      ) {
        console.log("🚫 BLOCKED webhook send - not on landing page:", currentPagePath)
        return
      }

      const exitTime = new Date()
      const totalTimeMs = exitTime.getTime() - entryTime.getTime()

      // Get the actual visited path (including A/B test variants)
      const actualVisitedPath = window.location.pathname
      const isVariantA = actualVisitedPath === "/a"
      const isVariant1 = actualVisitedPath === "/1"
      const isRootRedirect = actualVisitedPath === "/"

      // Determine the landing page variant
      const getLandingPageVariant = (): string => {
        if (isVariantA) return "variant_a"
        if (isVariant1) return "variant_1"
        if (isRootRedirect) return "root_redirect"
        return "unknown"
      }

      const landingPageVariant = getLandingPageVariant()

      console.log("🔍 Exit event triggered:", {
        nextPath,
        totalTimeMs,
        activeTimeMs,
        exitType,
        visitedPath: actualVisitedPath,
        landingPageVariant: landingPageVariant,
      })

      // Only track if they spent at least 1 second on the page
      if (activeTimeMs < 1000 && !isIOS) {
        // Skip this check on iOS
        console.log("⏰ Exit ignored - less than 1 second active time")
        return
      }

      // Mark as sent to prevent duplicates
      hasBeenSent = true

      // Determine if they're continuing to the application
      const continued = isApplicationPath(nextPath) ? "yes" : "no"

      // Get exit reason
      const getExitReason = (path: string | null, type: string): string => {
        if (!path) return "browser_exit"
        if (path === "tab_hidden" || type === "visibility") return "tab_switch"
        if (isApplicationPath(path)) return "clicked_apply_now"
        if (path.startsWith("http")) return "external_link"
        return "internal_navigation"
      }

      // Add time formatting function
      const formatTime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        if (minutes > 0) {
          return `${minutes}m ${remainingSeconds}s`
        }
        return `${remainingSeconds}s`
      }

      // Get UTM parameters again to ensure we have the latest
      const currentUtmParams = extractUtmParams()

      const exitReason = getExitReason(nextPath, exitType)

      const data = {
        // Core tracking data
        visitorId,
        eventType: "landing_page_exit",

        // Time tracking - now with both total and active time
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        timeSpentMs: totalTimeMs,
        timeSpentSeconds: Math.round(totalTimeMs / 1000),
        timeSpentFormatted: formatTime(totalTimeMs),
        activeTimeMs: activeTimeMs,
        activeTimeSeconds: Math.round(activeTimeMs / 1000),
        activeTimeFormatted: formatTime(activeTimeMs),
        activeTimePercentage: Math.round((activeTimeMs / totalTimeMs) * 100),

        // Exit details
        exitReason: exitReason,
        continued: continued,
        exitPath: nextPath,
        exitUrl: nextPath || "browser_exit",
        exitType: exitType,

        // Page context - UPDATED to show actual visited path
        visitedPath: actualVisitedPath,
        landingPageVariant: landingPageVariant,
        currentPath: actualVisitedPath, // Keep for backward compatibility
        currentUrl: window.location.href,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,

        // A/B Test specific data
        ab_test_variant: isVariantA ? "a" : isVariant1 ? "1" : "root",
        ab_test_path: actualVisitedPath,
        is_variant_a: isVariantA,
        is_variant_1: isVariant1,
        is_root_redirect: isRootRedirect,

        // Device info
        isIOS: isIOS,
        isAndroid: isAndroid,
        isMobile: isMobile,
        deviceType: isIOS ? "ios" : isAndroid ? "android" : isMobile ? "mobile" : "desktop",

        // UTM parameters - explicitly include each one
        utm_source: currentUtmParams.utm_source || "",
        utm_medium: currentUtmParams.utm_medium || "",
        utm_campaign: currentUtmParams.utm_campaign || "",
        utm_content: currentUtmParams.utm_content || "",
        utm_term: currentUtmParams.utm_term || "",

        // Also include the full UTM object for completeness
        utm_params: currentUtmParams,
      }

      // For iOS, use beacon API as a backup
      if (isIOS) {
        try {
          console.log("🍎 iOS - Using navigator.sendBeacon as backup")
          const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
          const beaconSuccess = navigator.sendBeacon(webhookUrl, blob)
          console.log("🍎 iOS - sendBeacon result:", beaconSuccess)
        } catch (e) {
          console.error("🍎 iOS - sendBeacon error:", e)
        }
      }

      // Send with retry logic
      await sendWebhookWithRetry(data)
    }

    const handleIOSClick = (event: MouseEvent | TouchEvent) => {
      console.log("🍎 iOS click/touch detected")

      // Get the target element
      const target = event.target as HTMLElement
      const link = target.closest("a, button")

      if (!link) return

      console.log("🍎 iOS clickable element:", link.tagName, link.textContent)

      let destination = null
      let isApplyButton = false

      if (link.tagName === "A") {
        const href = (link as HTMLAnchorElement).href
        console.log("🍎 iOS link href:", href)

        if (href && href !== window.location.href) {
          destination = href

          if (href.includes("/applynow")) {
            console.log("🍎 iOS Apply Now link detected!")
            destination = "/applynow"
            isApplyButton = true

            // For iOS, we need to store the data immediately
            sendExitData(destination, "ios_click")

            // Don't prevent default - let navigation happen
            return
          }
        }
      } else if (link.tagName === "BUTTON") {
        const buttonText = link.textContent?.toLowerCase() || ""
        console.log("🍎 iOS button text:", buttonText)

        if (
          buttonText.includes("apply now") ||
          buttonText.includes("apply") ||
          buttonText.includes("get started") ||
          buttonText.includes("start application") ||
          link.getAttribute("data-action") === "apply" ||
          link.className.includes("apply")
        ) {
          console.log("🍎 iOS Apply Now button detected!")
          destination = "/applynow"
          isApplyButton = true

          // For iOS, we need to store the data immediately
          sendExitData(destination, "ios_click")

          // Don't prevent default - let navigation happen
          return
        }
      }

      if (destination) {
        console.log("🍎 iOS sending exit data for:", destination)
        sendExitData(destination, "ios_click")
      }
    }

    // Mobile-optimized click tracking
    const handleTouchStart = (event: TouchEvent) => {
      console.log("📱 Touch start detected")
      // Store the touch target for later comparison
      ;(window as any).lastTouchTarget = event.target
    }

    const handleTouchEnd = (event: TouchEvent) => {
      console.log("📱 Touch end detected")

      // Special handling for iOS
      if (isIOS) {
        handleIOSClick(event)
        return
      }

      // Check if this was a tap (not a scroll)
      const target = (window as any).lastTouchTarget || event.target
      const element = target as HTMLElement
      const link = element.closest("a, button")

      if (link) {
        console.log("📱 Touch on clickable element:", link.tagName, link.textContent)
        handleElementClick(link)
      }
    }

    // Desktop click tracking
    const handleClick = (event: MouseEvent) => {
      console.log("🖱️ Click detected")

      // Special handling for iOS
      if (isIOS) {
        handleIOSClick(event)
        return
      }

      const target = event.target as HTMLElement
      const link = target.closest("a, button")

      if (link) {
        console.log("🔗 Found clickable element:", link.tagName, link.textContent)
        handleElementClick(link)
      }
    }

    // Unified element click handler
    const handleElementClick = (link: Element) => {
      let destination = null
      let isApplyButton = false

      if (link.tagName === "A") {
        const href = (link as HTMLAnchorElement).href
        console.log("🔗 Link href:", href)

        if (href && href !== window.location.href) {
          destination = href

          // Special handling for Apply Now links
          if (href.includes("/applynow")) {
            console.log("🎯 Apply Now link detected!")
            destination = "/applynow"
            isApplyButton = true
          }
        }
      } else if (link.tagName === "BUTTON") {
        // For buttons, check if it's an Apply Now button
        const buttonText = link.textContent?.toLowerCase() || ""
        console.log("🔘 Button text:", buttonText)

        // Check for various Apply Now button variations
        if (
          buttonText.includes("apply now") ||
          buttonText.includes("apply") ||
          buttonText.includes("get started") ||
          buttonText.includes("start application") ||
          link.getAttribute("data-action") === "apply" ||
          link.className.includes("apply")
        ) {
          console.log("🎯 Apply Now button detected!")
          destination = "/applynow"
          isApplyButton = true
        } else {
          destination = "button_click"
        }
      }

      if (destination) {
        console.log("📤 Sending exit data for destination:", destination)

        // For Apply Now buttons, send immediately without delay
        if (isApplyButton) {
          sendExitData(destination, "button_click")
        } else {
          // Small delay for other clicks
          setTimeout(() => sendExitData(destination, "button_click"), 50)
        }
      }
    }

    // iOS-specific page lifecycle events
    const handleIOSPageHide = () => {
      console.log("🍎 iOS page hide event")
      sendExitData("ios_page_hide", "ios_lifecycle")
    }

    // Mobile-specific page lifecycle events
    const handlePageHide = () => {
      console.log("📱 Page hide event")
      if (isIOS) {
        handleIOSPageHide()
      } else {
        sendExitData("page_hide", "page_lifecycle")
      }
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log("📱 Page show from cache")
        // Reset tracking state
        hasBeenSent = false
        lastActiveTime = new Date()
        isActive = true
      }
    }

    const handleBeforeUnload = () => {
      console.log("🚪 Before unload event")

      // Force hasBeenSent to false for beforeunload to ensure it always sends
      hasBeenSent = false

      // For desktop, use a synchronous approach to ensure data is sent
      if (isDesktop) {
        updateActiveTime()
        const exitTime = new Date()
        const totalTimeMs = exitTime.getTime() - entryTime.getTime()

        // Store exit data synchronously for desktop
        storeExitData({
          visitorId,
          eventType: "landing_page_exit",
          exitReason: "browser_exit",
          entryTime: entryTime.toISOString(),
          exitTime: exitTime.toISOString(),
          timeSpentMs: totalTimeMs,
          activeTimeMs: activeTimeMs,
          currentPath: window.location.pathname,
          exitType: "before_unload",
          continued: "no",
          isDesktop: true,
        })

        // Try to send synchronously for desktop
        try {
          const blob = new Blob(
            [
              JSON.stringify({
                visitorId,
                eventType: "landing_page_exit",
                exitReason: "browser_exit",
                entryTime: entryTime.toISOString(),
                exitTime: exitTime.toISOString(),
                timeSpentMs: totalTimeMs,
                activeTimeMs: activeTimeMs,
                currentPath: window.location.pathname,
                exitType: "before_unload",
                continued: "no",
                isDesktop: true,
              }),
            ],
            { type: "application/json" },
          )

          navigator.sendBeacon(webhookUrl, blob)
          console.log("🖥️ Desktop - Used sendBeacon for beforeunload")
        } catch (e) {
          console.error("🖥️ Desktop - sendBeacon error:", e)
        }
      }

      // Also try the normal async approach
      sendExitData("browser_exit", "before_unload")
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Update active time before marking as inactive
        updateActiveTime()
        isActive = false
        console.log("👁️ Tab hidden - pausing active time tracking")

        // Send data for both mobile and desktop when tab is hidden
        sendExitData("tab_hidden", "visibility")
      } else {
        // Tab is visible again - reset the last active time
        lastActiveTime = new Date()
        isActive = true
        hasBeenSent = false // Allow new tracking session
        console.log("👁️ Tab visible - resuming active time tracking")

        // Check for stored data when tab becomes visible again
        checkAndSendStoredData()
      }
    }

    // Track focus/blur events for additional accuracy (mainly for desktop)
    const handleFocus = () => {
      if (!isActive && !isMobile) {
        lastActiveTime = new Date()
        isActive = true
        hasBeenSent = false
        console.log("🔍 Window focused - resuming active time tracking")
      }
    }

    const handleBlur = () => {
      if (isActive && !isMobile) {
        updateActiveTime()
        isActive = false
        console.log("🔍 Window blurred - pausing active time tracking")
      }
    }

    // Add event listeners - use both touch and click for all devices for maximum compatibility
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })
    document.addEventListener("click", handleClick)

    // Page lifecycle events
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("pageshow", handlePageShow)
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Focus events (mainly for desktop)
    if (!isMobile) {
      window.addEventListener("focus", handleFocus)
      window.addEventListener("blur", handleBlur)
    }

    // Also track programmatic navigation (in case button uses JavaScript)
    let lastPath = window.location.pathname
    const checkForNavigation = () => {
      const currentPath = window.location.pathname
      if (currentPath !== lastPath) {
        console.log("🧭 Navigation detected:", lastPath, "→", currentPath)

        if (currentPath.includes("/applynow")) {
          console.log("🎯 Navigated to application!")
          sendExitData("/applynow", "navigation")
        }

        lastPath = currentPath
      }
    }

    // Check for navigation every 100ms
    const navigationInterval = setInterval(checkForNavigation, 100)

    // Update active time periodically while active
    const activeTimeInterval = setInterval(() => {
      if (isActive) {
        updateActiveTime()
      }
    }, 5000) // Update every 5 seconds

    // For desktop, periodically check if we need to send data
    let desktopCheckInterval: NodeJS.Timeout | null = null
    if (isDesktop) {
      desktopCheckInterval = setInterval(() => {
        if (isActive && activeTimeMs > 10000 && !hasBeenSent) {
          console.log("🖥️ Desktop - Periodic check, storing current state")
          const currentTime = new Date()
          const totalTimeMs = currentTime.getTime() - entryTime.getTime()

          // Store current state without sending
          storeExitData({
            visitorId,
            eventType: "landing_page_state",
            entryTime: entryTime.toISOString(),
            currentTime: currentTime.toISOString(),
            timeSpentMs: totalTimeMs,
            activeTimeMs: activeTimeMs,
            isDesktop: true,
            currentPath: window.location.pathname,
            currentUrl: window.location.href,
          })
        }
      }, 15000) // Every 15 seconds
    }

    // For iOS, periodically store the current state
    let iosStateInterval: NodeJS.Timeout | null = null
    if (isIOS) {
      iosStateInterval = setInterval(() => {
        if (isActive && activeTimeMs > 5000) {
          console.log("🍎 iOS - Storing current state")
          const exitTime = new Date()
          const totalTimeMs = exitTime.getTime() - entryTime.getTime()

          // Store current state without sending
          storeExitData({
            visitorId,
            eventType: "landing_page_state",
            entryTime: entryTime.toISOString(),
            currentTime: exitTime.toISOString(),
            timeSpentMs: totalTimeMs,
            activeTimeMs: activeTimeMs,
            isIOS: true,
            currentPath: window.location.pathname,
            currentUrl: window.location.href,
          })
        }
      }, 10000) // Every 10 seconds
    }

    // Add to cleanup
    const originalCleanup = () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("click", handleClick)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("pageshow", handlePageShow)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (!isMobile) {
        window.removeEventListener("focus", handleFocus)
        window.removeEventListener("blur", handleBlur)
      }

      clearInterval(navigationInterval)
      clearInterval(activeTimeInterval)

      if (iosStateInterval) {
        clearInterval(iosStateInterval)
      }

      if (desktopCheckInterval) {
        clearInterval(desktopCheckInterval)
      }
    }

    return originalCleanup
  }, [entryTime, pathname])

  // This component doesn't render anything
  return null
}
