"use client"

import { useUTMTracking } from "../hooks/use-utm-tracking"
import { useEffect, useState } from "react"

export default function UTMTestComponent() {
  const { utmParams, getUTMString, appendUTMToUrl } = useUTMTracking()
  const [storedParams, setStoredParams] = useState<any>(null)

  useEffect(() => {
    // Load stored UTM parameters from localStorage
    try {
      const stored = localStorage.getItem("utmParams")
      if (stored) {
        setStoredParams(JSON.parse(stored))
      }
    } catch (error) {
      console.warn("Error loading stored UTM params:", error)
    }
  }, [])

  const testWebhook = async () => {
    console.log("Testing webhook with UTM parameters...")

    const testData = {
      name: "UTM Test User",
      email: "test@example.com",
      phone: "+1234567890",
      source: "utm_test",
      ...utmParams,
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const result = await response.json()
      console.log("Test webhook response:", result)
      alert(`Webhook test ${result.success ? "successful" : "failed"}`)
    } catch (error) {
      console.error("Webhook test error:", error)
      alert("Webhook test failed")
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg border border-gray-600 max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">UTM Tracking Debug</h3>

      <div className="text-xs space-y-1 mb-3">
        <div>
          <strong>Current URL UTM:</strong>
        </div>
        {Object.keys(utmParams).length > 0 ? (
          Object.entries(utmParams).map(([key, value]) => (
            <div key={key}>
              • {key}: {value}
            </div>
          ))
        ) : (
          <div>No UTM parameters found</div>
        )}
      </div>

      <div className="text-xs space-y-1 mb-3">
        <div>
          <strong>Stored UTM:</strong>
        </div>
        {storedParams ? (
          Object.entries(storedParams).map(([key, value]) => (
            <div key={key}>
              • {key}: {value}
            </div>
          ))
        ) : (
          <div>No stored UTM parameters</div>
        )}
      </div>

      <div className="text-xs mb-3">
        <strong>UTM String:</strong> {getUTMString() || "None"}
      </div>

      <div className="text-xs mb-3">
        <strong>Test URL:</strong>
        <br />
        {appendUTMToUrl("/test-page")}
      </div>

      <button onClick={testWebhook} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded">
        Test Webhook
      </button>
    </div>
  )
}
