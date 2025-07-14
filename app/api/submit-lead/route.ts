import { NextResponse } from "next/server"

// Define the correct webhook URL
const CORRECT_WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook-test/4f843117-88a0-42d1-9016-d35be4727716"

// This is the old webhook URL that's causing the error
const OLD_WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook/b8862371-7217-4f8c-ab21-b06e9f098dcb"

export async function POST(request: Request) {
  console.log("=== SUBMIT LEAD API ROUTE CALLED ===")
  console.log("Request headers:", {
    contentType: request.headers.get("Content-Type"),
    userAgent: request.headers.get("User-Agent"),
    source: request.headers.get("X-Source"),
  })

  try {
    // Parse the incoming request body
    const formData = await request.json()
    console.log("Received form data:", formData)

    console.log("UTM parameters received:", {
      utm_source: formData.utm_source,
      utm_campaign: formData.utm_campaign,
      utm_medium: formData.utm_medium,
      utm_content: formData.utm_content,
      utm_term: formData.utm_term,
    })

    // Prepare the data for n8n in the exact format required
    const webhookData = {
      name: formData.firstName || formData.name || "Unknown",
      email: formData.email || "unknown@example.com",
      phone: formData.phone || "Unknown",
      businessType: formData.businessType || null,
      currentRevenue: formData.currentRevenue || null,
      targetRevenue: formData.targetRevenue || null,
      challenges: formData.challenges || null,
      timeline: formData.timeline || null,
      timestamp: formData.timestamp || new Date().toISOString(),
      source: formData.source || "website_form",
      // Add UTM parameters
      utm_source: formData.utm_source || null,
      utm_campaign: formData.utm_campaign || null,
      utm_medium: formData.utm_medium || null,
      utm_content: formData.utm_content || null,
      utm_term: formData.utm_term || null,
      // Add variant information
      ab_variant: formData.ab_variant || null,
    }

    console.log("Prepared webhook data:", webhookData)
    console.log("Using webhook URL:", CORRECT_WEBHOOK_URL)
    console.log("NOT using old webhook URL:", OLD_WEBHOOK_URL)

    // Make the request to n8n from the server side with the CORRECT URL
    const response = await fetch(CORRECT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "NextJS-API-Route",
        "X-Source": "submit-lead-api-route",
      },
      body: JSON.stringify(webhookData),
      cache: "no-store",
    })

    // Get the response as text
    const responseText = await response.text()

    console.log("n8n webhook response status:", response.status)
    console.log("n8n webhook response:", responseText)

    // Return success response
    return NextResponse.json({
      success: true,
      status: response.status,
      message: "Data sent to webhook successfully",
      webhookResponse: responseText,
      webhookUrl: CORRECT_WEBHOOK_URL, // Include the URL in the response for debugging
    })
  } catch (error) {
    console.error("Error in submit-lead API route:", error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send data to webhook",
        error: error instanceof Error ? error.message : String(error),
        webhookUrl: CORRECT_WEBHOOK_URL, // Include the URL in the response for debugging
      },
      { status: 500 },
    )
  }
}
