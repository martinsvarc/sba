/**
 * Utility to automatically gather user information from various sources
 */

interface UserData {
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  phone?: string
  source?: string
}

/**
 * Attempts to gather user information from various browser sources
 */
export const autoFillUserData = async (): Promise<UserData> => {
  const userData: UserData = {}

  // 1. Check URL parameters first (highest priority)
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.get("firstName")) {
      userData.firstName = urlParams.get("firstName") || ""
      userData.source = "url_params"
    }
    if (urlParams.get("lastName")) {
      userData.lastName = urlParams.get("lastName") || ""
      userData.source = "url_params"
    }
    if (urlParams.get("fullName")) {
      userData.fullName = urlParams.get("fullName") || ""
      userData.source = "url_params"
    }
    if (urlParams.get("email")) {
      userData.email = urlParams.get("email") || ""
      userData.source = "url_params"
    }
    if (urlParams.get("phone")) {
      userData.phone = urlParams.get("phone") || ""
      userData.source = "url_params"
    }
  }

  // 2. Check localStorage for previously stored data
  if (!userData.email || !userData.firstName) {
    try {
      const storedUserData = localStorage.getItem("sba_user_data")
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData)
        if (!userData.firstName && parsed.firstName) {
          userData.firstName = parsed.firstName
          userData.source = userData.source || "localStorage"
        }
        if (!userData.lastName && parsed.lastName) {
          userData.lastName = parsed.lastName
          userData.source = userData.source || "localStorage"
        }
        if (!userData.email && parsed.email) {
          userData.email = parsed.email
          userData.source = userData.source || "localStorage"
        }
        if (!userData.phone && parsed.phone) {
          userData.phone = parsed.phone
          userData.source = userData.source || "localStorage"
        }
      }
    } catch (error) {
      console.warn("Error reading stored user data:", error)
    }
  }

  // 3. Check for data from previous form submissions on this domain
  if (!userData.email || !userData.firstName) {
    try {
      const initialFormData = localStorage.getItem("initialFormData")
      if (initialFormData) {
        const parsed = JSON.parse(initialFormData)
        if (!userData.fullName && parsed.fullName) {
          userData.fullName = parsed.fullName
          userData.source = userData.source || "previous_form"
        }
        if (!userData.email && parsed.email) {
          userData.email = parsed.email
          userData.source = userData.source || "previous_form"
        }
        if (!userData.phone && parsed.phone) {
          userData.phone = parsed.phone
          userData.source = userData.source || "previous_form"
        }
      }
    } catch (error) {
      console.warn("Error reading initial form data:", error)
    }
  }

  // 4. Try to extract name from email if we have email but no name
  if (userData.email && !userData.firstName && !userData.fullName) {
    try {
      const emailUsername = userData.email.split("@")[0]
      // Common patterns: firstname.lastname, firstname_lastname, firstnamelastname
      if (emailUsername.includes(".")) {
        const parts = emailUsername.split(".")
        userData.firstName = capitalizeFirst(parts[0])
        userData.lastName = capitalizeFirst(parts[1])
        userData.source = userData.source || "email_inference"
      } else if (emailUsername.includes("_")) {
        const parts = emailUsername.split("_")
        userData.firstName = capitalizeFirst(parts[0])
        userData.lastName = capitalizeFirst(parts[1])
        userData.source = userData.source || "email_inference"
      }
    } catch (error) {
      console.warn("Error inferring name from email:", error)
    }
  }

  // 5. Split fullName into firstName and lastName if needed
  if (userData.fullName && (!userData.firstName || !userData.lastName)) {
    try {
      const nameParts = userData.fullName.trim().split(" ")
      if (nameParts.length >= 2) {
        if (!userData.firstName) userData.firstName = nameParts[0]
        if (!userData.lastName) userData.lastName = nameParts.slice(1).join(" ")
      } else if (nameParts.length === 1) {
        if (!userData.firstName) userData.firstName = nameParts[0]
      }
    } catch (error) {
      console.warn("Error splitting full name:", error)
    }
  }

  console.log("Auto-filled user data:", userData)
  return userData
}

/**
 * Stores user data for future use
 */
export const storeUserData = (userData: UserData) => {
  try {
    const dataToStore = {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      fullName: userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      email: userData.email || "",
      phone: userData.phone || "",
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem("sba_user_data", JSON.stringify(dataToStore))
    console.log("User data stored for future use")
  } catch (error) {
    console.warn("Error storing user data:", error)
  }
}

/**
 * Capitalizes the first letter of a string
 */
const capitalizeFirst = (str: string): string => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
