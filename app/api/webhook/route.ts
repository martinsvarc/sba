import { NextResponse } from "next/server"

// Define the correct webhook URL
const CORRECT_WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook-test/4f843117-88a0-42d1-9016-d35be4727716"

export async function POST(request: Request) {
  console.log("=== WEBHOOK API ROUTE CALLED ===")

  try {
    // Parse the incoming request body
    const data = await request.json()
    console.log("Received webhook data:", data)

    // Log UTM parameters specifically
    console.log("UTM parameters in webhook:", {
      utm_source: data.utm_source,
      utm_campaign: data.utm_campaign,
      utm_medium: data.utm_medium,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
    })

    console.log("Using webhook URL:", CORRECT_WEBHOOK_URL)

    // Forward the data to n8n
    const response = await fetch(CORRECT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "NextJS-API-Route",
        "X-Source": "webhook-api-route",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    })

    const responseText = await response.text()

    console.log("n8n webhook response status:", response.status)
    console.log("n8n webhook response:", responseText)

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      status: response.status,
      response: responseText,
      webhookUrl: CORRECT_WEBHOOK_URL, // Include the URL in the response for debugging
    })
  } catch (error) {
    console.error("Error processing webhook:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process webhook",
        error: error instanceof Error ? error.message : String(error),
        webhookUrl: CORRECT_WEBHOOK_URL, // Include the URL in the response for debugging
      },
      { status: 500 },
    )
  }
}
