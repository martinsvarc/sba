// Simple browser-based country detection without any API calls
// Always defaults to US regardless of detected country
export function getUserCountry(): string {
  // Always return "US" as the default country
  return "US"

  // The detection logic below is kept but not used
  // since we're always returning "US" above
  try {
    // Method 1: Try to get country from browser's language settings (most reliable browser method)
    const language = navigator.language || navigator.languages?.[0] || ""
    if (language && language.includes("-")) {
      const countryCode = language.split("-")[1].toUpperCase()
      // Check if it's a valid 2-letter country code
      if (countryCode && countryCode.length === 2) {
        return countryCode
      }
    }

    // Method 2: Try to get from timezone (less accurate but can provide hints)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Map common timezones to country codes
    if (timezone) {
      // America timezones
      if (timezone.includes("America/")) {
        if (
          timezone.includes("New_York") ||
          timezone.includes("Chicago") ||
          timezone.includes("Denver") ||
          timezone.includes("Los_Angeles") ||
          timezone.includes("Phoenix")
        ) {
          return "US"
        }
        if (timezone.includes("Toronto") || timezone.includes("Vancouver")) {
          return "CA"
        }
        if (timezone.includes("Mexico")) {
          return "MX"
        }
      }

      // Europe timezones
      if (timezone.includes("Europe/")) {
        if (timezone.includes("London")) {
          return "GB"
        }
        if (timezone.includes("Paris") || timezone.includes("Brussels")) {
          return "FR"
        }
        if (timezone.includes("Berlin") || timezone.includes("Frankfurt")) {
          return "DE"
        }
        if (timezone.includes("Madrid")) {
          return "ES"
        }
        if (timezone.includes("Rome")) {
          return "IT"
        }
      }

      // Asia timezones
      if (timezone.includes("Asia/")) {
        if (timezone.includes("Tokyo")) {
          return "JP"
        }
        if (timezone.includes("Shanghai") || timezone.includes("Hong_Kong")) {
          return "CN"
        }
        if (timezone.includes("Kolkata") || timezone.includes("Calcutta")) {
          return "IN"
        }
        if (timezone.includes("Singapore")) {
          return "SG"
        }
      }

      // Australia/Oceania timezones
      if (timezone.includes("Australia/")) {
        return "AU"
      }
      if (timezone.includes("Pacific/Auckland")) {
        return "NZ"
      }
    }
  } catch (error) {
    console.error("Error detecting country:", error)
  }

  // Default fallback
  return "US"
}
