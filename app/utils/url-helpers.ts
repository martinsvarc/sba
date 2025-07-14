/**
 * Helper functions for URL handling
 */

// Get the base URL of the application
export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")
}

// Create an absolute URL from a relative path
export function absoluteUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

// Get query parameters from URL
export function getQueryParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams()
  }
  return new URLSearchParams(window.location.search)
}

// Add query parameters to a URL
export function addQueryParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url.startsWith("http") ? url : absoluteUrl(url))
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value)
  })
  return urlObj.toString()
}
