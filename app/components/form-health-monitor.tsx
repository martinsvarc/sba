"use client"

import { useEffect } from "react"

export function FormHealthMonitor() {
  useEffect(() => {
    // Monitor for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global JavaScript error detected:", event.error)

      // Log error details for debugging
      const errorDetails = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      console.log("Error details:", errorDetails)

      // You could send this to an error tracking service
      // sendErrorToTrackingService(errorDetails)
    }

    // Monitor for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      const errorDetails = {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      console.log("Promise rejection details:", errorDetails)
    }

    // Monitor localStorage health
    const checkLocalStorageHealth = () => {
      try {
        const testKey = "__localStorage_test__"
        localStorage.setItem(testKey, "test")
        localStorage.removeItem(testKey)
        return true
      } catch (error) {
        console.warn("localStorage is not available:", error)
        return false
      }
    }

    // Check localStorage on mount
    const isLocalStorageHealthy = checkLocalStorageHealth()
    if (!isLocalStorageHealthy) {
      console.warn("localStorage is not functioning properly")
    }

    // Add event listeners
    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null // This component doesn't render anything
}
