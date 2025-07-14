"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UTMTracker } from "../utils/utm-tracking"
import { useUTMTracking } from "../hooks/use-utm-tracking"

export default function UTMTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { utmParams, getUTMString, appendUTMToUrl } = useUTMTracking()
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    // Run tests on page load
    runTests()
  }, [])

  const runTests = () => {
    const results = []

    // Test 1: URL Parameter Extraction
    const urlParams = UTMTracker.extractFromURL(searchParams)
    results.push({
      test: "URL Parameter Extraction",
      passed: Object.keys(urlParams).length > 0,
      data: urlParams,
    })

    // Test 2: localStorage Storage/Retrieval
    const testParams = UTMTracker.getTestParams()
    UTMTracker.store(testParams)
    const retrieved = UTMTracker.retrieve()
    results.push({
      test: "localStorage Storage/Retrieval",
      passed: JSON.stringify(testParams) === JSON.stringify(retrieved),
      data: { stored: testParams, retrieved },
    })

    // Test 3: URL Search String Generation
    const searchString = UTMTracker.toSearchString(testParams)
    results.push({
      test: "URL Search String Generation",
      passed: searchString.includes("utm_source=pepa"),
      data: searchString,
    })

    // Test 4: URL Appending
    const testUrl = "/test-page"
    const appendedUrl = UTMTracker.appendToURL(testUrl, testParams)
    results.push({
      test: "URL Appending",
      passed: appendedUrl.includes("utm_source=pepa"),
      data: appendedUrl,
    })

    // Test 5: Hook Functionality
    results.push({
      test: "Hook Functionality",
      passed: typeof getUTMString === "function" && typeof appendUTMToUrl === "function",
      data: { utmParams, getUTMString: getUTMString(), appendUTMToUrl: appendUTMToUrl("/test") },
    })

    setTestResults(results)
  }

  const testWebhookSubmission = async () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
      ...utmParams,
      source: "utm_test_page",
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
      alert(`Webhook test: ${result.success ? "SUCCESS" : "FAILED"}\n\nResponse: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      alert(`Webhook test FAILED: ${error}`)
    }
  }

  const navigateWithUTM = () => {
    const testParams = UTMTracker.getTestParams()
    const url = UTMTracker.appendToURL("/", testParams)
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">UTM Tracking Test Suite</h1>

        {/* Current UTM Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Current UTM Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Active UTM Parameters:</h3>
              <pre className="bg-gray-700 p-3 rounded text-sm">{JSON.stringify(utmParams, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">UTM Search String:</h3>
              <pre className="bg-gray-700 p-3 rounded text-sm">{getUTMString() || "None"}</pre>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.passed ? "bg-green-900 border border-green-600" : "bg-red-900 border border-red-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${result.passed ? "bg-green-600" : "bg-red-600"}`}>
                    {result.passed ? "PASS" : "FAIL"}
                  </span>
                </div>
                <pre className="text-xs bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={runTests} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Re-run Tests
            </button>
            <button onClick={testWebhookSubmission} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Test Webhook Submission
            </button>
            <button onClick={navigateWithUTM} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Navigate to Home with Test UTM
            </button>
            <button
              onClick={() => router.push("/?utm_source=pepa&utm_campaign=summer&utm_medium=social&utm_content=ad1")}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
            >
              Test with Provided UTM Parameters
            </button>
          </div>
        </div>

        {/* Sample URLs */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Sample URLs for Testing</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Provided UTM Parameters:</strong>
              <br />
              <code className="bg-gray-700 p-1 rounded">
                /?utm_source=pepa&utm_campaign=summer&utm_medium=social&utm_content=ad1
              </code>
            </div>
            <div>
              <strong>Test UTM Parameters:</strong>
              <br />
              <code className="bg-gray-700 p-1 rounded">
                /?utm_source=test&utm_campaign=development&utm_medium=email&utm_content=test_ad&utm_term=test_term
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
