/**
 * UTM Tracking Utilities
 * Handles UTM parameter capture, storage, and transmission
 */

export interface UTMData {
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
  utm_content?: string
  utm_term?: string
}

export class UTMTracker {
  private static readonly STORAGE_KEY = "utmParams"

  /**
   * Extract UTM parameters from URL search params
   */
  static extractFromURL(searchParams: URLSearchParams): UTMData {
    return {
      utm_source: searchParams.get("utm_source") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
    }
  }

  /**
   * Store UTM parameters in localStorage
   */
  static store(utmParams: UTMData): void {
    try {
      // Filter out undefined values
      const filtered = Object.fromEntries(Object.entries(utmParams).filter(([_, value]) => value !== undefined))

      if (Object.keys(filtered).length > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
        console.log("UTM parameters stored:", filtered)
      }
    } catch (error) {
      console.warn("Failed to store UTM parameters:", error)
    }
  }

  /**
   * Retrieve UTM parameters from localStorage
   */
  static retrieve(): UTMData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn("Failed to retrieve UTM parameters:", error)
      return {}
    }
  }

  /**
   * Convert UTM parameters to URL search string
   */
  static toSearchString(utmParams: UTMData): string {
    const params = new URLSearchParams()
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    return params.toString()
  }

  /**
   * Append UTM parameters to a URL
   */
  static appendToURL(url: string, utmParams: UTMData): string {
    const searchString = this.toSearchString(utmParams)
    if (!searchString) return url

    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}${searchString}`
  }

  /**
   * Log UTM parameters for debugging
   */
  static debug(utmParams: UTMData, context = ""): void {
    if (process.env.NODE_ENV === "development") {
      console.log(`UTM Debug ${context}:`, utmParams)
    }
  }

  /**
   * Validate UTM parameters
   */
  static validate(utmParams: UTMData): boolean {
    // Check if at least one UTM parameter is present
    return Object.values(utmParams).some((value) => value && value.trim().length > 0)
  }

  /**
   * Get test UTM parameters for development
   */
  static getTestParams(): UTMData {
    return {
      utm_source: "pepa",
      utm_campaign: "summer",
      utm_medium: "social",
      utm_content: "ad1",
      utm_term: "test",
    }
  }
}
