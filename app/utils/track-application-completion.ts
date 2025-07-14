/**
 * Utility to track application completion with user details
 */

// Same webhook URL as the page exit tracker
const WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook/3bd7b5d3-75fe-4c0b-8d9a-09c03d2d4d3e"

interface ApplicationCompletionData {
  visitorId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  completedAt: string
  currentPath: string
}

// Replace the entire function with this updated version:
export const trackApplicationCompletion = async (userData: {
  firstName: string
  lastName: string
  email: string
  phone: string
}) => {
  try {
    // Get visitor ID from localStorage or global variable
    let visitorId = ""
    if (typeof window !== "undefined") {
      visitorId = localStorage.getItem("sba_visitor_id") || (window as any).sbaVisitorId || ""

      if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
        localStorage.setItem("sba_visitor_id", visitorId)
      }
    }

    // Get stored UTM params
    let utmParams = {}
    try {
      const storedUtmString = localStorage.getItem("sba_utm_params")
      if (storedUtmString) {
        utmParams = JSON.parse(storedUtmString)
      }
    } catch (e) {
      console.error("Error parsing stored UTM params", e)
    }

    const data: Record<string, any> = {
      visitorId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      phone: userData.phone,
      completedAt: new Date().toISOString(),
      currentPath: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
      currentUrl: typeof window !== "undefined" ? window.location.href : "",
      eventType: "application_completed",
      ...utmParams,
    }

    console.log("📤 Sending application completion data:", data)

    // Send data to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("✅ Application completion tracked:", response.status)
    return true
  } catch (error) {
    console.error("❌ Error tracking application completion:", error)
    return false
  }
}
