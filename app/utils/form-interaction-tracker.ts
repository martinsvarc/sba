/**
 * Form Interaction Tracker
 * Sends non-blocking webhook requests to track user interactions with the form
 * This runs in parallel with existing tracking and does not interfere with it
 */

// Webhook endpoint
const FORM_INTERACTION_WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook/70fbe010-61ea-47a9-a7be-260eb8465c66"

// Question mapping for better analytics
const QUESTION_ID_MAP: Record<number, string> = {
  1: "identity_filter",
  2: "goal_clarity",
  3: "emotional_driver",
  4: "capital_available",
  5: "method_of_funding",
  6: "where_you_need_help",
  7: "when_ready",
  8: "commitment_filter",
  9: "full_name",
  10: "email",
  11: "phone",
}

// Store timing information
let questionStartTime = Date.now()
let formStartTime = 0
let landingPageStartTime = typeof window !== "undefined" ? Date.now() : 0

// Get visitor ID from localStorage or global variable (reusing existing ID)
const getVisitorId = (): string => {
  if (typeof window === "undefined") return ""

  let visitorId = localStorage.getItem("sba_visitor_id") || (window as any).sbaVisitorId || ""

  if (!visitorId) {
    // If no ID exists, we'll use the same format as the exit tracker for consistency
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    try {
      localStorage.setItem("sba_visitor_id", visitorId)
      ;(window as any).sbaVisitorId = visitorId
    } catch (e) {
      console.warn("Unable to store visitor ID", e)
    }
  }

  return visitorId
}

// Detect device and OS
const getDeviceInfo = () => {
  if (typeof window === "undefined") {
    return { device: "unknown", os: "unknown" }
  }

  const userAgent = navigator.userAgent || ""

  // Detect device type
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)
  const device = isMobile ? "mobile" : "desktop"

  // Detect OS
  let os = "unknown"
  if (/Windows/i.test(userAgent)) os = "Windows"
  else if (/Android/i.test(userAgent)) os = "Android"
  else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS"
  else if (/Mac/i.test(userAgent)) os = "macOS"
  else if (/Linux/i.test(userAgent)) os = "Linux"

  return { device, os }
}

// Reset question timer
export const resetQuestionTimer = () => {
  questionStartTime = Date.now()
}

// Start tracking form interactions
export const startFormTracking = () => {
  formStartTime = Date.now()
  resetQuestionTimer()
}

// Track Apply Now button click
export const trackApplyNowClick = () => {
  const timeOnLandingPage = Math.round((Date.now() - landingPageStartTime) / 1000)

  sendFormInteractionWebhook({
    event: "Clicked Apply Now",
    time_to_apply_click: timeOnLandingPage,
    page: "landing_page",
    button_location: "main_cta",
  })

  // Start form tracking
  startFormTracking()
}

// Track Continue button click or next question action
export const trackContinueClick = (currentStep: number, answer: string | string[] | null = null) => {
  const timeOnQuestion = Math.round((Date.now() - questionStartTime) / 1000)
  const questionId = QUESTION_ID_MAP[currentStep] || `question_${currentStep}`

  sendFormInteractionWebhook({
    event: "Clicked Continue",
    question_id: questionId,
    answer: Array.isArray(answer) ? answer.join(", ") : answer || "",
    time_on_question: timeOnQuestion,
  })

  // Reset question timer for next question
  resetQuestionTimer()
}

// Track form submission
export const trackFormSubmission = (formData: any) => {
  const formCompletionTime = Math.round((Date.now() - formStartTime) / 1000)
  const timeOnQuestion = Math.round((Date.now() - questionStartTime) / 1000)

  sendFormInteractionWebhook({
    event: "Submitted Form",
    question_id: "final_submission",
    time_on_question: timeOnQuestion,
    form_completion_time: formCompletionTime,
    form_data: {
      name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
      email: formData.email || "",
      phone: formData.phone || "",
    },
  })
}

// Enhanced webhook sending function with retry logic (copied from exit tracker)
const sendWebhookWithRetry = async (data: any, maxRetries = 3): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Form interaction webhook attempt ${attempt}/${maxRetries}:`, data)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(FORM_INTERACTION_WEBHOOK_URL, {
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
        console.log(`✅ Form interaction webhook success on attempt ${attempt}:`, response.status, response.statusText)
        const responseText = await response.text()
        console.log("📝 Form interaction webhook response body:", responseText)
        return true
      } else {
        console.warn(`⚠️ Form interaction webhook failed on attempt ${attempt}:`, response.status, response.statusText)
        if (attempt === maxRetries) {
          console.error("❌ All form interaction webhook attempts failed")
          return false
        }
      }
    } catch (error) {
      console.warn(`⚠️ Form interaction webhook error on attempt ${attempt}:`, error)

      if (attempt === maxRetries) {
        console.error("❌ All form interaction webhook attempts failed with error:", error)
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

// Send webhook data asynchronously (non-blocking) - using same approach as exit tracker
const sendFormInteractionWebhook = async (data: Record<string, any>) => {
  // Don't run on server
  if (typeof window === "undefined") return

  try {
    const visitorId = getVisitorId()
    const { device, os } = getDeviceInfo()

    // Get stored UTM params
    let utmParams = {}
    try {
      const storedUtmString = localStorage.getItem("sba_utm_params")
      if (storedUtmString) {
        utmParams = JSON.parse(storedUtmString)
      }
    } catch (e) {
      console.warn("Error parsing stored UTM params", e)
    }

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

    // Prepare payload using same structure as exit tracker
    const payload = {
      visitor_id: visitorId,
      eventType: "form_interaction",
      device,
      os,
      timestamp: new Date().toISOString(),
      current_url: window.location.href,

      // Updated path information
      visitedPath: actualVisitedPath,
      landingPageVariant: landingPageVariant,
      currentPath: actualVisitedPath, // Keep for backward compatibility

      // A/B Test specific data
      ab_test_variant: isVariantA ? "a" : isVariant1 ? "1" : "root",
      ab_test_path: actualVisitedPath,
      is_variant_a: isVariantA,
      is_variant_1: isVariant1,
      is_root_redirect: isRootRedirect,

      userAgent: navigator.userAgent,
      referrer: document.referrer || null,

      // UTM parameters - explicitly include each one like exit tracker
      utm_source: utmParams.utm_source || "",
      utm_medium: utmParams.utm_medium || "",
      utm_campaign: utmParams.utm_campaign || "",
      utm_content: utmParams.utm_content || "",
      utm_term: utmParams.utm_term || "",

      // Also include the full UTM object for completeness
      utm_params: utmParams,

      // Event-specific data
      ...data,
    }

    console.log("📤 Sending form interaction webhook:", payload)

    // For iOS, use beacon API as a backup (same as exit tracker)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    if (isIOS) {
      try {
        console.log("🍎 iOS - Using navigator.sendBeacon as backup")
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" })
        const beaconSuccess = navigator.sendBeacon(FORM_INTERACTION_WEBHOOK_URL, blob)
        console.log("🍎 iOS - sendBeacon result:", beaconSuccess)
      } catch (e) {
        console.error("🍎 iOS - sendBeacon error:", e)
      }
    }

    // Send with retry logic (same as exit tracker)
    await sendWebhookWithRetry(payload)
  } catch (error) {
    // Silent fail - this is non-blocking and should never interfere with UX
    console.debug("📤 Form interaction webhook error:", error)
  }
}

// Initialize landing page timer when this module loads
if (typeof window !== "undefined") {
  landingPageStartTime = Date.now()

  // Set up page visibility change handler to reset timers when user returns to page
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // Only reset question timer if user returns to page
      resetQuestionTimer()
    }
  })
}
