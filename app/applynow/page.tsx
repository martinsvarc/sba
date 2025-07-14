"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Head from "next/head"
import { useUTMTracking } from "../hooks/use-utm-tracking"
import { FormHealthMonitor } from "../components/form-health-monitor"
import { trackApplicationCompletion } from "../utils/track-application-completion"
import ApplicationExitTracker from "../components/application-exit-tracker"
import { autoFillUserData, storeUserData } from "../utils/auto-fill-user-data"
import { ChevronRight } from "lucide-react"
import MetaPixelApplyNow from "../components/meta-pixel-applynow"

// Import the tracking functions at the top of the file, after the other imports
import {
  trackContinueClick,
  trackFormSubmission,
  resetQuestionTimer,
  startFormTracking,
} from "../utils/form-interaction-tracker"

// Define the correct webhook URL as a constant to ensure consistency
const WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook-test/4f843117-88a0-42d1-9016-d35be4727716"
const QUESTIONS_WEBHOOK_URL = "https://n8n.automatedsolarbiz.com/webhook/questionssba"

// Phone number formatting function
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  // Format the phone number as (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

// Function to get the original landing page variant from multiple sources
const getOriginalLandingPageVariant = () => {
  if (typeof window === "undefined") return { variant: "unknown", path: "/" }

  // 1. First check localStorage for stored variant
  try {
    const storedVariant = localStorage.getItem("sba_landing_variant")
    const storedPath = localStorage.getItem("sba_landing_path")
    if (storedVariant && storedPath) {
      console.log("🔍 Found stored landing variant:", { variant: storedVariant, path: storedPath })
      return { variant: storedVariant, path: storedPath }
    }
  } catch (e) {
    console.warn("Error reading stored variant:", e)
  }

  // 2. Check referrer URL for the original landing page
  try {
    const referrer = document.referrer
    if (referrer) {
      const referrerUrl = new URL(referrer)
      const referrerPath = referrerUrl.pathname

      console.log("🔍 Checking referrer:", referrer, "Path:", referrerPath)

      if (referrerPath === "/a") {
        const variant = "variant_a"
        localStorage.setItem("sba_landing_variant", variant)
        localStorage.setItem("sba_landing_path", "/a")
        console.log("✅ Detected variant from referrer: /a")
        return { variant, path: "/a" }
      } else if (referrerPath === "/1") {
        const variant = "variant_1"
        localStorage.setItem("sba_landing_variant", variant)
        localStorage.setItem("sba_landing_path", "/1")
        console.log("✅ Detected variant from referrer: /1")
        return { variant, path: "/1" }
      } else if (referrerPath === "/" || referrerPath === "/watch") {
        const variant = "root_redirect"
        localStorage.setItem("sba_landing_variant", variant)
        localStorage.setItem("sba_landing_path", "/")
        console.log("✅ Detected variant from referrer: root")
        return { variant, path: "/" }
      }
    }
  } catch (e) {
    console.warn("Error parsing referrer:", e)
  }

  // 3. Check URL parameters for variant
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const urlVariant = urlParams.get("variant") || urlParams.get("v")
    if (urlVariant) {
      let variant = "unknown"
      let path = "/"

      if (urlVariant === "a") {
        variant = "variant_a"
        path = "/a"
      } else if (urlVariant === "1") {
        variant = "variant_1"
        path = "/1"
      } else if (urlVariant === "root") {
        variant = "root_redirect"
        path = "/"
      }

      if (variant !== "unknown") {
        localStorage.setItem("sba_landing_variant", variant)
        localStorage.setItem("sba_landing_path", path)
        console.log("✅ Detected variant from URL params:", { variant, path })
        return { variant, path }
      }
    }
  } catch (e) {
    console.warn("Error parsing URL params:", e)
  }

  // 4. Check cookies (set by middleware)
  try {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith("ab_variant=")) {
        const cookieVariant = cookie.substring("ab_variant=".length)
        let variant = "unknown"
        let path = "/"

        if (cookieVariant === "a") {
          variant = "variant_a"
          path = "/a"
        } else if (cookieVariant === "1") {
          variant = "variant_1"
          path = "/1"
        } else if (cookieVariant === "root") {
          variant = "root_redirect"
          path = "/"
        }

        if (variant !== "unknown") {
          localStorage.setItem("sba_landing_variant", variant)
          localStorage.setItem("sba_landing_path", path)
          console.log("✅ Detected variant from cookie:", { variant, path })
          return { variant, path }
        }
      }
    }
  } catch (e) {
    console.warn("Error reading cookies:", e)
  }

  // 5. Check session storage as backup
  try {
    const sessionVariant = sessionStorage.getItem("sba_landing_variant")
    const sessionPath = sessionStorage.getItem("sba_landing_path")
    if (sessionVariant && sessionPath) {
      // Also store in localStorage for persistence
      localStorage.setItem("sba_landing_variant", sessionVariant)
      localStorage.setItem("sba_landing_path", sessionPath)
      console.log("✅ Found variant in session storage:", { variant: sessionVariant, path: sessionPath })
      return { variant: sessionVariant, path: sessionPath }
    }
  } catch (e) {
    console.warn("Error reading session storage:", e)
  }

  // 6. Default fallback
  console.log("⚠️ No variant detected, using default")
  return { variant: "unknown", path: "/" }
}

export default function ApplyNowPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const initRef = useRef(false)
  const [formData, setFormData] = useState({
    // Basic info
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",

    // Question responses - updated field names
    businessJourney: "",
    interestReasons: [] as string[],
    availableCapital: "",
    mainGoal: "",
    timeCommitment: "",
    readyToMoveForward: "",
    supportNeeded: [] as string[],
    strategyCallCommitment: "",
    otherSupportNeeded: "", // Keep this for "Other" option

    // Hidden tracking fields
    fbc: "",
    fbp: "",
    userAgent: "",
    ip: "",
    ab_variant: "",
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  const [formEntryTime] = useState(new Date())

  // Store the detected landing page variant
  const [landingPageInfo, setLandingPageInfo] = useState({ variant: "unknown", path: "/" })

  // Add UTM tracking
  const { utmParams } = useUTMTracking()

  // Store the initial form data separately to ensure we always have it
  const [initialContactInfo, setInitialContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  // Remove any unwanted embedded scripts or iframes on mount
  useEffect(() => {
    // Remove any third-party scripts that might be causing popups
    const scripts = document.querySelectorAll('script[src*="vusercontent.net"]')
    scripts.forEach((script) => script.remove())

    // Remove any iframes that might be causing popups
    const iframes = document.querySelectorAll('iframe[src*="vusercontent.net"]')
    iframes.forEach((iframe) => iframe.remove())
  }, [])

  // Format currency input
  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Convert to number and format
    if (digits) {
      const number = Number.parseInt(digits, 10)
      return `$${number.toLocaleString()}`
    }
    return ""
  }

  // Remove the useCallback wrapper from saveToLocalStorage and make it a simple function
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("questionnaireData", JSON.stringify(formData))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  // Enhanced initialization with error recovery
  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (initRef.current) return
        initRef.current = true

        // Initialize form tracking
        startFormTracking()

        // Detect the original landing page variant FIRST
        const detectedLandingInfo = getOriginalLandingPageVariant()
        setLandingPageInfo(detectedLandingInfo)
        console.log("🎯 Detected landing page info:", detectedLandingInfo)

        // Add a small delay to ensure DOM is ready
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Validate that we're in a browser environment
        if (typeof window === "undefined") {
          throw new Error("Form must be initialized in browser environment")
        }

        // Get URL parameters safely
        let urlSearchParams: URLSearchParams
        try {
          urlSearchParams = new URLSearchParams(window.location.search)
        } catch (error) {
          console.warn("Failed to parse URL parameters, using empty params:", error)
          urlSearchParams = new URLSearchParams()
        }

        const firstNameParam = urlSearchParams.get("firstName") || ""
        const lastNameParam = urlSearchParams.get("lastName") || ""
        const fullNameParam = urlSearchParams.get("fullName") || ""
        const emailParam = urlSearchParams.get("email") || ""
        const phoneParam = urlSearchParams.get("phone") || ""

        // Safely get data from localStorage
        let storedData = null
        let initialFormData = null

        try {
          const storedDataStr = localStorage.getItem("questionnaireData")
          if (storedDataStr && storedDataStr !== "undefined" && storedDataStr !== "null") {
            storedData = JSON.parse(storedDataStr)
            // Validate stored data structure
            if (typeof storedData !== "object" || storedData === null) {
              console.warn("Invalid stored data format, clearing...")
              localStorage.removeItem("questionnaireData")
              storedData = null
            }
          }
        } catch (error) {
          console.warn("Error parsing stored questionnaire data, clearing:", error)
          try {
            localStorage.removeItem("questionnaireData")
          } catch (clearError) {
            console.error("Failed to clear corrupted localStorage:", clearError)
          }
        }

        try {
          const initialFormDataStr = localStorage.getItem("initialFormData")
          if (initialFormDataStr && initialFormDataStr !== "undefined" && initialFormDataStr !== "null") {
            initialFormData = JSON.parse(initialFormDataStr)
            if (typeof initialFormData !== "object" || initialFormData === null) {
              console.warn("Invalid initial form data format, clearing...")
              localStorage.removeItem("initialFormData")
              initialFormData = null
            } else {
              setInitialContactInfo({
                fullName: initialFormData.fullName || "",
                email: initialFormData.email || "",
                phone: initialFormData.phone || "",
              })
            }
          }
        } catch (error) {
          console.warn("Error parsing initial form data, clearing:", error)
          try {
            localStorage.removeItem("initialFormData")
          } catch (clearError) {
            console.error("Failed to clear corrupted initial form data:", clearError)
          }
        }

        // Safely determine names
        let firstName = firstNameParam || storedData?.firstName || ""
        let lastName = lastNameParam || storedData?.lastName || ""

        // Safe name splitting
        if ((!firstName || !lastName) && initialFormData?.fullName) {
          try {
            const nameParts = String(initialFormData.fullName).trim().split(" ")
            if (nameParts.length >= 2) {
              firstName = firstName || nameParts[0]
              lastName = lastName || nameParts.slice(1).join(" ")
            } else if (nameParts.length === 1) {
              firstName = firstName || nameParts[0]
            }
          } catch (nameError) {
            console.warn("Error processing full name:", nameError)
          }
        }

        // Safely determine email and phone
        const email = emailParam || storedData?.email || initialFormData?.email || ""
        const phone = phoneParam || storedData?.phone || initialFormData?.phone || ""

        // Create safe merged form data with the detected variant
        const mergedFormData = {
          firstName: String(firstName || ""),
          lastName: String(lastName || ""),
          email: String(email || ""),
          phone: String(phone || ""),
          businessJourney: String(storedData?.businessJourney || ""),
          interestReasons: Array.isArray(storedData?.interestReasons) ? storedData.interestReasons : [],
          availableCapital: String(storedData?.availableCapital || ""),
          mainGoal: String(storedData?.mainGoal || ""),
          timeCommitment: String(storedData?.timeCommitment || ""),
          readyToMoveForward: String(storedData?.readyToMoveForward || ""),
          supportNeeded: Array.isArray(storedData?.supportNeeded) ? storedData.supportNeeded : [],
          strategyCallCommitment: String(storedData?.strategyCallCommitment || ""),
          otherSupportNeeded: String(storedData?.otherSupportNeeded || ""),
          confirmEmail: String(storedData?.confirmEmail || ""),
          fbc: String(storedData?.fbc || ""),
          fbp: String(storedData?.fbp || ""),
          userAgent: String(storedData?.userAgent || ""),
          ip: String(storedData?.ip || ""),
          ab_variant: detectedLandingInfo.variant, // Use the detected variant
        }

        // Safely determine current step
        let newStep = 1
        if (storedData) {
          try {
            if (storedData.businessJourney) newStep = 2
            if (
              storedData.interestReasons &&
              Array.isArray(storedData.interestReasons) &&
              storedData.interestReasons.length > 0
            )
              newStep = 3
            if (storedData.availableCapital) newStep = 4
            if (storedData.mainGoal) newStep = 5
            if (storedData.timeCommitment) newStep = 6
            if (storedData.readyToMoveForward) newStep = 7
            if (
              storedData.supportNeeded &&
              Array.isArray(storedData.supportNeeded) &&
              storedData.supportNeeded.length > 0
            )
              newStep = 8
            if (storedData.strategyCallCommitment) newStep = 9
            if (storedData.firstName && storedData.lastName) newStep = 10 // Step 9
            if (storedData.email) newStep = 11 // Step 10
            if (storedData.phone) newStep = 12 // Step 11

            // Validate step is within bounds
            if (newStep < 1 || newStep > 11 || isNaN(newStep)) {
              console.warn("Invalid step calculated, defaulting to 1:", newStep)
              newStep = 1
            }
          } catch (stepError) {
            console.warn("Error calculating step, defaulting to 1:", stepError)
            newStep = 1
          }
        }

        // Set form data and step
        setFormData(mergedFormData)

        // Attempt to auto-fill user data
        try {
          const autoFilledData = await autoFillUserData()

          if (autoFilledData.firstName || autoFilledData.email) {
            console.log("Auto-filled user data found:", autoFilledData)

            // Merge auto-filled data with existing data (don't overwrite if we already have data)
            const enhancedFormData = {
              ...mergedFormData,
              firstName: mergedFormData.firstName || autoFilledData.firstName || "",
              lastName: mergedFormData.lastName || autoFilledData.lastName || "",
              email: mergedFormData.email || autoFilledData.email || "",
              phone: mergedFormData.phone || autoFilledData.phone || "",
            }

            setFormData(enhancedFormData)

            // Store this data for future use
            storeUserData(autoFilledData)
          }
        } catch (error) {
          console.warn("Error auto-filling user data:", error)
        }

        setCurrentStep(newStep)
        setIsInitialized(true)

        setHasError(false)
        setLastError(null)

        console.log("Form initialized successfully:", {
          step: newStep,
          hasStoredData: !!storedData,
          hasInitialData: !!initialFormData,
          email: mergedFormData.email ? "present" : "missing",
          landingVariant: detectedLandingInfo.variant,
          landingPath: detectedLandingInfo.path,
        })
      } catch (error) {
        console.error("Critical error in form initialization:", error)
        setHasError(true)
        setLastError(error instanceof Error ? error.message : "Unknown initialization error")

        // Fallback: Set safe defaults
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          confirmEmail: "",
          phone: "",
          businessJourney: "",
          interestReasons: [],
          availableCapital: "",
          mainGoal: "",
          timeCommitment: "",
          readyToMoveForward: "",
          supportNeeded: [],
          strategyCallCommitment: "",
          otherSupportNeeded: "",
          fbc: "",
          fbp: "",
          userAgent: "",
          ip: "",
          ab_variant: "",
        })
        setCurrentStep(1)
        setIsInitialized(true)

        // Try to clear potentially corrupted localStorage
        try {
          localStorage.removeItem("questionnaireData")
          localStorage.removeItem("initialFormData")
        } catch (clearError) {
          console.error("Failed to clear localStorage after error:", clearError)
        }
      }
    }

    initializeForm()
  }, [])

  // Enhanced tracking data collection
  useEffect(() => {
    if (!isInitialized) return

    const populateTrackingData = async () => {
      try {
        // Set Facebook Click ID (fbc) from fbclid in URL
        const urlParams = new URLSearchParams(window.location.search)
        const fbclid = urlParams.get("fbclid")
        if (fbclid) {
          const fbc = `fb.1.${Date.now()}.${fbclid}`
          setFormData((prev) => ({ ...prev, fbc }))
        }

        // Set Facebook Browser ID (fbp) from _fbp cookie
        const fbpCookie = document.cookie.split("; ").find((row) => row.startsWith("_fbp="))
        if (fbpCookie) {
          const fbp = fbpCookie.split("=")[1]
          setFormData((prev) => ({ ...prev, fbp }))
        }

        // Set user agent
        const userAgent = navigator.userAgent
        setFormData((prev) => ({ ...prev, userAgent }))

        // Fetch public IP
        try {
          const response = await fetch("https://api.ipify.org?format=json")
          const data = await response.json()
          if (data.ip) {
            setFormData((prev) => ({ ...prev, ip: data.ip }))
          }
        } catch (ipError) {
          console.warn("Failed to fetch IP address:", ipError)
        }
      } catch (error) {
        console.warn("Error populating tracking data:", error)
      }
    }

    populateTrackingData()
  }, [isInitialized])

  // Error recovery mechanism
  const handleErrorRecovery = () => {
    try {
      // Clear all localStorage
      localStorage.removeItem("questionnaireData")
      localStorage.removeItem("initialFormData")

      // Reset form state
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        phone: "",
        businessJourney: "",
        interestReasons: [],
        availableCapital: "",
        mainGoal: "",
        timeCommitment: "",
        readyToMoveForward: "",
        supportNeeded: [],
        strategyCallCommitment: "",
        otherSupportNeeded: "",
        fbc: "",
        fbp: "",
        userAgent: "",
        ip: "",
        ab_variant: "",
      })
      setCurrentStep(1)
      setHasError(false)
      setLastError(null)
      setRetryCount((prev) => prev + 1)

      console.log("Form reset successfully")
    } catch (error) {
      console.error("Error during recovery:", error)
      // If recovery fails, redirect to homepage
      window.location.href = "/"
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Special handling for currency formatting
    if (name === "desiredMonthlyRevenue") {
      setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }))
    }
    // Special handling for phone formatting
    else if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Enhanced localStorage saving with error handling
  useEffect(() => {
    if (!isInitialized) return

    const timeoutId = setTimeout(() => {
      try {
        // Validate formData before saving
        if (typeof formData === "object" && formData !== null) {
          const dataToSave = JSON.stringify(formData)
          // Check if JSON is valid and not too large (5MB limit)
          if (dataToSave.length < 5 * 1024 * 1024) {
            localStorage.setItem("questionnaireData", dataToSave)
          } else {
            console.warn("Form data too large to save to localStorage")
          }
        }
      } catch (error) {
        console.warn("Error saving to localStorage:", error)
        // Don't block the user if localStorage fails
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData, isInitialized])

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = (prev[name as keyof typeof prev] as string[]) || []

      // Check if the value is already in the array
      if (currentValues.includes(value)) {
        // If it is, remove it
        return {
          ...prev,
          [name]: currentValues.filter((v) => v !== value),
        }
      } else {
        // If it's not, add it
        return {
          ...prev,
          [name]: [...currentValues, value],
        }
      }
    })
  }

  const handleSingleOptionChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Check if this selection would disqualify the user
    const tempFormData = { ...formData, [name]: value }
    const wouldDisqualify =
      (name === "currentPriority" && value === "Just exploring for now – not ready to commit yet") ||
      (name === "investmentReadiness" && value === "No — I'm not sure I can commit to showing up")

    if (wouldDisqualify) {
      // Send partial data to webhook before redirecting
      setTimeout(async () => {
        try {
          const partialPayload = {
            name: `${tempFormData.firstName} ${tempFormData.lastName}`.trim() || "Unknown",
            email: tempFormData.email || "unknown@example.com",
            phone: tempFormData.phone || "",

            // Include all answered questions so far
            entrepreneurAtHeart: tempFormData.entrepreneurAtHeart,
            goals: tempFormData.goals,
            interestReason: tempFormData.interestReason,
            desiredMonthlyRevenue: tempFormData.desiredMonthlyRevenue,
            biggestNeed: tempFormData.biggestNeed,
            currentMonthlyIncome: tempFormData.currentMonthlyIncome,
            currentPriority: tempFormData.currentPriority,
            investmentReadiness: tempFormData.investmentReadiness,

            // Enhanced path tracking for disqualified users using stored landing page info
            visitedPath: landingPageInfo.path,
            landingPageVariant: landingPageInfo.variant,

            // A/B Test specific data for disqualified users
            ab_test_variant: (() => {
              if (landingPageInfo.path === "/a") return "a"
              if (landingPageInfo.path === "/1") return "1"
              if (landingPageInfo.path === "/") return "root"
              return "unknown"
            })(),
            ab_test_path: landingPageInfo.path,
            is_variant_a: landingPageInfo.path === "/a",
            is_variant_1: landingPageInfo.path === "/1",
            is_root_redirect: landingPageInfo.path === "/",

            // UTM parameters
            utm_source: utmParams.utm_source || null,
            utm_campaign: utmParams.utm_campaign || null,
            utm_medium: utmParams.utm_medium || null,
            utm_content: utmParams.utm_content || null,
            utm_term: utmParams.utm_term || null,

            // Tracking data
            fbc: tempFormData.fbc || null,
            fbp: tempFormData.fbp || null,
            userAgent: tempFormData.userAgent || null,
            ip: tempFormData.ip || null,

            // Updated ab_variant for disqualified users
            ab_variant: landingPageInfo.variant,

            // Qualification status
            qualified: false,
            disqualified: true,
            disqualification_reason: value,
            disqualification_step: currentStep,

            // Metadata
            source: "renewable_energy_questionnaire_disqualified",
            submittedFrom: window.location.href,
            submittedAt: new Date().toISOString(),
            variant_source: "applynow_form",
            variant_timestamp: new Date().toISOString(),
          }

          console.log("Sending disqualified user data to webhook:", partialPayload)

          // Send to webhook
          await fetch(QUESTIONS_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "User-Agent": "NextJS-Questions-Page-Disqualified",
            },
            body: JSON.stringify(partialPayload),
          })

          console.log("Disqualified user data sent successfully")
        } catch (error) {
          console.error("Error sending disqualified user data:", error)
        }

        // Redirect to disqualification page
        router.push("/weappreciateyou")
      }, 100)

      return // Don't auto-continue for disqualifying answers
    }

    // Auto-continue after selection for single-select questions, but not for "Other (specify below)"
    if (currentStep < 10 && value !== "Other (specify below)") {
      // Track the continue click with the current step and selected answer
      trackContinueClick(currentStep, value)

      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        window.scrollTo(0, 0)

        // Reset question timer for the new question
        resetQuestionTimer()
      }, 600)
    }
  }

  // Update the nextStep function to track continue clicks
  const nextStep = () => {
    // Track the continue click with the current step and selected answer
    let answer = null

    // Get the answer based on the current step
    switch (currentStep) {
      case 1: // Business Journey
        answer = formData.businessJourney
        break
      case 2: // Interest Reasons
        answer = formData.interestReasons
        break
      case 3: // Available Capital
        answer = formData.availableCapital
        break
      case 4: // Main Goal
        answer = formData.mainGoal
        break
      case 5: // Time Commitment
        answer = formData.timeCommitment
        break
      case 6: // Ready to Move Forward
        answer = formData.readyToMoveForward
        break
      case 7: // Support Needed
        answer = formData.supportNeeded
        break
      case 8: // Strategy Call Commitment
        answer = formData.strategyCallCommitment
        break
      case 9: // Full Name
        answer = `${formData.firstName} ${formData.lastName}`.trim()
        break
      case 10: // Email
        answer = formData.email
        break
      case 11: // Phone
        answer = formData.phone
        break
    }

    trackContinueClick(currentStep, answer)

    // Original nextStep functionality
    setCurrentStep((prev) => prev + 1)
    window.scrollTo(0, 0)

    // Reset question timer for the new question
    resetQuestionTimer()
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
    window.scrollTo(0, 0)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Business journey
        return !!formData.businessJourney
      case 2: // Interest reasons
        return formData.interestReasons.length > 0
      case 3: // Available capital
        return !!formData.availableCapital
      case 4: // Main goal
        return !!formData.mainGoal
      case 5: // Time commitment
        return !!formData.timeCommitment
      case 6: // Ready to move forward
        return !!formData.readyToMoveForward
      case 7: // Support needed
        if (formData.supportNeeded.includes("Other (specify below)")) {
          return !!(formData.supportNeeded.length > 0 && formData.otherSupportNeeded?.trim())
        }
        return formData.supportNeeded.length > 0
      case 8: // Strategy call commitment
        return !!formData.strategyCallCommitment
      case 9: // Full name
        return !!(formData.firstName.trim() && formData.lastName.trim())
      case 10: // Email
        return !!(formData.email.trim() && isValidEmail(formData.email))
      case 11: // Phone
        return !!formData.phone.trim()
      default:
        return false
    }
  }

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Function to get the most complete contact information from all available sources
  const getContactInfo = () => {
    // Try to get initial form data from localStorage again (in case it was added after component mounted)
    let initialFormData = null
    try {
      const initialFormDataStr = localStorage.getItem("initialFormData")
      if (initialFormDataStr) {
        initialFormData = JSON.parse(initialFormDataStr)
      }
    } catch (error) {
      console.error("Error parsing initial form data:", error)
    }

    // Use data from initialContactInfo state, which was populated from localStorage on mount
    const contactFromState = initialContactInfo

    // Combine all sources, prioritizing the most specific/recent
    return {
      // First name and last name
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",

      // Full name (from multiple possible sources)
      fullName:
        initialFormData?.fullName ||
        contactFromState.fullName ||
        (formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : ""),

      // Email
      email: formData.email || initialFormData?.email || contactFromState.email || "",

      // Phone
      phone: formData.phone || initialFormData?.phone || contactFromState.phone || "",
    }
  }

  const shouldDisqualify = () => {
    // Disqualify if they have less than $20,000 capital
    if (formData.availableCapital === "Less than $10,000" || formData.availableCapital === "$10,000–$20,000") {
      return true
    }

    // Disqualify if they're just exploring and not sure yet
    if (formData.readyToMoveForward === "Just exploring — not sure yet") {
      return true
    }

    // Disqualify if they won't commit to strategy call
    if (
      formData.strategyCallCommitment === "No" ||
      formData.strategyCallCommitment === "Only if I feel like it's a fit after watching the video"
    ) {
      return true
    }

    return false
  }

  // Update the handleSubmit function to track form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Track form submission
    trackFormSubmission(formData)

    try {
      // Rest of the original handleSubmit code...
      // Get user information from formData or URL parameters
      const emailToUse = formData.email || searchParams.get("email") || ""
      // Make phone optional initially
      let phoneToUse = formData.phone || searchParams.get("phone") || ""
      const firstNameToUse = formData.firstName || searchParams.get("firstName") || ""
      const lastNameToUse = formData.lastName || searchParams.get("lastName") || ""

      // If we don't have an email, try to get it from localStorage
      let finalEmail = emailToUse
      if (!finalEmail) {
        try {
          const storedDataStr = localStorage.getItem("questionnaireData")
          if (storedDataStr) {
            const storedData = JSON.parse(storedDataStr)
            if (storedData.email) {
              finalEmail = storedData.email
            }
          }
        } catch (error) {
          console.error("Error checking localStorage for email:", error)
        }
      }

      // If we still don't have an email, use a default one to prevent blocking
      if (!finalEmail) {
        finalEmail = "user@example.com"
      }

      // If we have a valid email but no phone, ask for phone
      // If we don't have a phone number, use a default empty string
      // We won't prompt the user again since they already provided it in the first step
      if (!phoneToUse) {
        console.log("Phone number not found in URL or localStorage, continuing without prompting")
        // Just continue without prompting - the form should have this from the first step
        phoneToUse = ""
      }

      // We have an email, proceed
      await submitFormWithData(firstNameToUse, lastNameToUse, finalEmail, phoneToUse)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Form Submission Error",
        description:
          error instanceof Error ? error.message : "There was an error submitting your information. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Extracted form submission logic to a separate function
  const submitFormWithData = async (firstName: string, lastName: string, email: string, phone: string) => {
    // Make sure we have email
    if (!email || !isValidEmail(email)) {
      throw new Error("A valid email address is required to continue")
    }

    // If we still don't have a phone number at this point, use a default
    // This prevents blocking the form submission
    if (!phone) {
      console.log("No phone number available, using default empty value")
      phone = ""
    }

    // Check if at least one question has been answered
    const hasAnsweredQuestions =
      formData.businessJourney ||
      formData.interestReasons.length > 0 ||
      formData.availableCapital ||
      formData.mainGoal ||
      formData.timeCommitment ||
      formData.readyToMoveForward ||
      formData.supportNeeded.length > 0 ||
      formData.strategyCallCommitment

    if (!hasAnsweredQuestions) {
      throw new Error("Please answer at least one question")
    }

    try {
      // Get the most complete contact information from all sources
      const contactInfo = getContactInfo()

      console.log("=== FORM SUBMISSION STARTED ===")
      console.log("Final contact info being used for submission:", contactInfo)
      console.log("Landing page info:", landingPageInfo)

      // Generate event ID for CAPI tracking
      const eventId = `grav-questionnaire-${email}-${Date.now()}`

      // Prepare the data payload for both submissions using stored landing page info
      const formPayload = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`, // Include both formats for compatibility
        email,
        phone,
        businessJourney: formData.businessJourney,
        interestReasons: formData.interestReasons,
        availableCapital: formData.availableCapital,
        mainGoal: formData.mainGoal,
        timeCommitment: formData.timeCommitment,
        readyToMoveForward: formData.readyToMoveForward,
        supportNeeded: formData.supportNeeded,
        strategyCallCommitment: formData.strategyCallCommitment,
        otherSupportNeeded: formData.otherSupportNeeded,
        source: "renewable_energy_questionnaire",
        timestamp: new Date().toISOString(),
        disqualified: shouldDisqualify(),
        qualified: !shouldDisqualify(),

        // Enhanced path tracking using stored landing page info
        visitedPath: landingPageInfo.path,
        landingPageVariant: landingPageInfo.variant,

        // A/B Test specific data
        ab_test_variant: (() => {
          if (landingPageInfo.path === "/a") return "a"
          if (landingPageInfo.path === "/1") return "1"
          if (landingPageInfo.path === "/") return "root"
          return "unknown"
        })(),
        ab_test_path: landingPageInfo.path,
        is_variant_a: landingPageInfo.path === "/a",
        is_variant_1: landingPageInfo.path === "/1",
        is_root_redirect: landingPageInfo.path === "/",

        // UTM parameters
        utm_source: utmParams.utm_source || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_medium: utmParams.utm_medium || null,
        utm_content: utmParams.utm_content || null,
        utm_term: utmParams.utm_term || null,

        // Add tracking data
        fbc: formData.fbc || null,
        fbp: formData.fbp || null,
        userAgent: formData.userAgent || null,
        ip: formData.ip || null,

        // Updated ab_variant to reflect actual landing page variant
        ab_variant: landingPageInfo.variant,
        variant_source: "applynow_form",
        variant_timestamp: new Date().toISOString(),
      }

      console.log("Form payload:", formPayload)

      // 1. Send data to our API route (original functionality)
      console.log("=== SENDING TO API ROUTE ===")
      let apiSuccess = false
      try {
        const response = await fetch("/api/submit-lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify(formPayload),
          cache: "no-store",
        })

        console.log("API Response status:", response.status)

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`)
        }

        const result = await response.json()
        console.log("API Response:", result)

        if (!result.success) {
          throw new Error(result.message || "Failed to submit form")
        }

        apiSuccess = true
        console.log("✅ API submission successful")
      } catch (apiError) {
        console.error("❌ API submission failed:", apiError)
        // Don't throw here - continue with webhook and redirect
      }

      // 2. Send data to the CAPI webhook URL with enhanced error handling
      console.log("=== SENDING TO CAPI WEBHOOK ===")
      let webhookSuccess = false
      try {
        console.log("Webhook URL:", QUESTIONS_WEBHOOK_URL)

        // Create a webhook payload that includes both the contact info and questionnaire responses
        const webhookPayload = {
          // Contact information from the form
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          event_id: eventId,

          // Questionnaire responses
          businessJourney: formData.businessJourney,
          interestReasons: formData.interestReasons,
          availableCapital: formData.availableCapital,
          mainGoal: formData.mainGoal,
          timeCommitment: formData.timeCommitment,
          readyToMoveForward: formData.readyToMoveForward,
          supportNeeded: formData.supportNeeded,
          strategyCallCommitment: formData.strategyCallCommitment,
          otherSupportNeeded: formData.otherSupportNeeded,

          // Enhanced path tracking for CAPI webhook using stored landing page info
          visitedPath: landingPageInfo.path,
          landingPageVariant: landingPageInfo.variant,

          // A/B Test specific data for CAPI
          ab_test_variant: (() => {
            if (landingPageInfo.path === "/a") return "a"
            if (landingPageInfo.path === "/1") return "1"
            if (landingPageInfo.path === "/") return "root"
            return "unknown"
          })(),
          ab_test_path: landingPageInfo.path,
          is_variant_a: landingPageInfo.path === "/a",
          is_variant_1: landingPageInfo.path === "/1",
          is_root_redirect: landingPageInfo.path === "/",

          // UTM parameters
          utm_source: utmParams.utm_source || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_medium: utmParams.utm_medium || null,
          utm_content: utmParams.utm_content || null,
          utm_term: utmParams.utm_term || null,

          // Enhanced tracking data
          fbc: formData.fbc || null,
          fbp: formData.fbp || null,
          userAgent: formData.userAgent || null,
          ip: formData.ip || null,

          // Metadata with updated ab_variant
          source: "renewable_energy_questionnaire",
          submittedFrom: window.location.href,
          submittedAt: new Date().toISOString(),
          disqualified: shouldDisqualify(),
          qualified: !shouldDisqualify(),

          // Updated ab_variant to reflect actual landing page variant
          ab_variant: landingPageInfo.variant,
          variant_source: "applynow_form",
          variant_timestamp: new Date().toISOString(),
        }

        console.log("CAPI Webhook payload:", webhookPayload)

        const webhookResponse = await fetch(QUESTIONS_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "NextJS-Questions-Page",
          },
          body: JSON.stringify(webhookPayload),
        })

        console.log("CAPI Webhook response status:", webhookResponse.status)
        console.log("CAPI Webhook response headers:", Object.fromEntries(webhookResponse.headers.entries()))

        if (webhookResponse.ok) {
          const responseText = await webhookResponse.text()
          console.log("✅ CAPI Webhook submission successful. Response:", responseText)
          webhookSuccess = true
        } else {
          const errorText = await webhookResponse.text()
          console.error("❌ CAPI Webhook submission failed with status:", webhookResponse.status)
          console.error("CAPI Webhook error response:", errorText)
        }
      } catch (webhookError) {
        console.error("❌ CAPI WEBHOOK ERROR:", webhookError)
        console.error("Error details:", {
          message: webhookError instanceof Error ? webhookError.message : String(webhookError),
          stack: webhookError instanceof Error ? webhookError.stack : undefined,
        })
      }

      // 3. Track the lead event with Facebook Pixel
      console.log("=== FACEBOOK PIXEL TRACKING SKIPPED ===")
      console.log("Only PageView tracking on page load, no Lead events")

      // 4. Clear localStorage since we've processed the data
      console.log("=== CLEARING LOCALSTORAGE ===")
      try {
        localStorage.removeItem("questionnaireData")
        console.log("✅ localStorage cleared")
      } catch (storageError) {
        console.error("❌ Failed to clear localStorage:", storageError)
      }

      // Get the most complete contact information for the redirect
      const contactInfoForRedirect = getContactInfo()
      const redirectFirstName = contactInfoForRedirect.firstName || firstName
      const redirectLastName = contactInfoForRedirect.lastName || lastName
      const redirectEmail = contactInfoForRedirect.email || email
      const redirectPhone = contactInfoForRedirect.phone || phone

      // Track application completion with user details
      await trackApplicationCompletion({
        firstName: redirectFirstName,
        lastName: redirectLastName,
        email: redirectEmail,
        phone: redirectPhone,
      })

      // 5. Always redirect regardless of API/webhook success
      console.log("=== REDIRECTING USER ===")

      console.log("Redirect contact info:", {
        redirectFirstName,
        redirectLastName,
        redirectEmail,
        redirectPhone,
        originalContactInfo: contactInfoForRedirect,
      })

      const isDisqualified = shouldDisqualify()
      console.log("User disqualified:", isDisqualified)

      if (isDisqualified) {
        console.log("Redirecting to weappreciateyou page")
        router.push("/weappreciateyou")
      } else {
        const redirectUrl = `/book-call?firstName=${encodeURIComponent(redirectFirstName)}&lastName=${encodeURIComponent(redirectLastName)}&email=${encodeURIComponent(redirectEmail)}&phone=${encodeURIComponent(redirectPhone)}`
        console.log("Redirecting to book-call page:", redirectUrl)
        router.push(redirectUrl)
      }

      // Log final status
      console.log("=== SUBMISSION SUMMARY ===")
      console.log("API Success:", apiSuccess)
      console.log("Webhook Success:", webhookSuccess)
      console.log("Redirect initiated")
      console.log("Landing page variant used:", landingPageInfo.variant)
    } catch (error) {
      console.error("=== CRITICAL ERROR IN FORM SUBMISSION ===")
      console.error("Critical error during form submission:", error)

      // Even on critical error, try to redirect
      try {
        const isDisqualified = shouldDisqualify()
        const contactInfoForRedirect = getContactInfo()
        const redirectFirstName = contactInfoForRedirect.firstName || firstName
        const redirectLastName = contactInfoForRedirect.lastName || lastName
        const redirectEmail = contactInfoForRedirect.email || email
        const redirectPhone = contactInfoForRedirect.phone || phone

        if (isDisqualified) {
          router.push("/weappreciateyou")
        } else {
          router.push(
            `/book-call?firstName=${encodeURIComponent(redirectFirstName)}&lastName=${encodeURIComponent(redirectLastName)}&email=${encodeURIComponent(redirectEmail)}&phone=${encodeURIComponent(redirectPhone)}`,
          )
        }
      } catch (redirectError) {
        console.error("Failed to redirect after critical error:", redirectError)
      }

      throw new Error("Failed to submit your information. Please try again.")
    }
  }

  // Checkbox/Radio component for consistent styling
  const SelectionBox = ({
    selected,
    onChange,
    children,
    disqualify = false,
  }: {
    selected: boolean
    onChange: () => void
    children: React.ReactNode
    disqualify?: boolean
  }) => {
    const handleClick = () => {
      if (disqualify) {
        // Immediately redirect to disqualification page
        router.push("/weappreciateyou")
      } else {
        onChange()
      }
    }

    return (
      <div
        className={`p-5 sm:p-6 rounded-lg border cursor-pointer transition-all hover:border-[#C7A052]/70 active:scale-[0.99] ${
          selected ? "border-[#C7A052] bg-[#C7A052]/10" : "border-[#333]"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start sm:items-center">
          <div
            className={`min-w-[20px] h-5 w-5 rounded mr-4 flex items-center justify-center ${
              selected ? "bg-[#C7A052] text-black" : "border border-[#555]"
            }`}
          >
            {selected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
          <div className="text-sm sm:text-base">{children}</div>
        </div>
      </div>
    )
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / 10) * 100

  // Generate step indicators for the new design
  const renderStepIndicators = () => {
    const steps = Array.from({ length: 9 }, (_, i) => i + 1)

    return null
  }

  // Add this right after the component starts, before the return statement
  console.log(
    "ApplyNowPage render - currentStep:",
    currentStep,
    "formData:",
    formData,
    "landingPageInfo:",
    landingPageInfo,
  )

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-custom-black text-custom-white texture-overlay flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C7A052] mx-auto mb-4"></div>
          <p className="text-white/80">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-custom-black text-custom-white texture-overlay">
      <Head>{/* Meta Pixel tracking removed - only basic PageView on component load */}</Head>
      <FormHealthMonitor />
      {/* Add the ApplicationExitTracker component */}
      <ApplicationExitTracker currentStep={currentStep} formData={formData} entryTime={formEntryTime} />
      <MetaPixelApplyNow />
      {/* New standardized header */}
      <header className="bg-black border-b border-custom-bronze/20 py-2 md:py-3 px-4 sm:px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
            alt="Solar Boss Logo"
            width={120}
            height={39}
            className="h-auto w-auto max-w-[120px]"
            priority
            unoptimized
          />
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Enhanced error state display */}
        {hasError && (
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-xl p-6 mb-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-red-400 font-bold text-xl">We're fixing a quick issue</h3>
            </div>
            <p className="text-white/90 mb-4 text-lg">
              Don't worry! We've detected and resolved a technical issue. Your progress is safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleErrorRecovery}
                className="px-6 py-3 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg font-semibold transition-all duration-300"
              >
                Continue Safely
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg font-semibold transition-all duration-300"
              >
                Start Over
              </button>
            </div>
            {retryCount > 0 && (
              <p className="text-white/60 text-sm mt-3">Recovery attempt #{retryCount} - Your data is protected</p>
            )}
          </div>
        )}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
              Enter Your Details Below to Book a Free Call
            </h2>
          </div>

          {/* NEW STEP INDICATOR DESIGN */}
          {renderStepIndicators()}
        </div>

        <div className="bg-[#030406] rounded-xl shadow-2xl overflow-hidden border border-[#7A5C2E]/30 mb-8 mx-auto max-w-4xl">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-[rgba(3,4,6,1)]">
            <form onSubmit={handleSubmit}>
              {/* Hidden tracking fields */}
              <input type="hidden" name="fbc" value={formData.fbc} />
              <input type="hidden" name="fbp" value={formData.fbp} />
              <input type="hidden" name="userAgent" value={formData.userAgent} />
              <input type="hidden" name="ip" value={formData.ip} />
              {currentStep === 1 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    Where are you currently in your business journey?
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.businessJourney === "I have a job and want to build something on the side"}
                        onChange={() =>
                          handleSingleOptionChange(
                            "businessJourney",
                            "I have a job and want to build something on the side",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✅</span>I have a job and want to build something on the
                          side
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.businessJourney === "I've tried other online businesses but nothing stuck"}
                        onChange={() =>
                          handleSingleOptionChange(
                            "businessJourney",
                            "I've tried other online businesses but nothing stuck",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          I've tried other online businesses but nothing stuck
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={
                          formData.businessJourney === "I currently run a business but want something more passive"
                        }
                        onChange={() =>
                          handleSingleOptionChange(
                            "businessJourney",
                            "I currently run a business but want something more passive",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✅</span>I currently run a business but want something
                          more passive
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.businessJourney === "I've looked into solar but never took action"}
                        onChange={() =>
                          handleSingleOptionChange("businessJourney", "I've looked into solar but never took action")
                        }
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          I've looked into solar but never took action
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={
                          formData.businessJourney === "I'm actively looking for the right opportunity to invest in"
                        }
                        onChange={() =>
                          handleSingleOptionChange(
                            "businessJourney",
                            "I'm actively looking for the right opportunity to invest in",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          I'm actively looking for the right opportunity to invest in
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    Why are you interested in this solar business opportunity?{" "}
                    <span className="whitespace-nowrap">(Select all that apply)</span>
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.interestReasons.includes("I want to build income outside of a 9–5")}
                        onChange={() =>
                          handleCheckboxChange("interestReasons", "I want to build income outside of a 9–5")
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>I want to build income outside of a{" "}
                          <span className="whitespace-nowrap">9–5</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.interestReasons.includes(
                          "I'm looking for something more stable than crypto/eComm/etc",
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            "interestReasons",
                            "I'm looking for something more stable than crypto/eComm/etc",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>I'm looking for something more stable than{" "}
                          <span className="whitespace-nowrap">crypto/eComm/etc</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.interestReasons.includes(
                          "I want a proven system I don't have to build from scratch",
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            "interestReasons",
                            "I want a proven system I don't have to build from scratch",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>I want a proven system I don't have to build from scratch
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.interestReasons.includes("I want time freedom and location flexibility")}
                        onChange={() =>
                          handleCheckboxChange("interestReasons", "I want time freedom and location flexibility")
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>I want time freedom and location flexibility
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.interestReasons.includes(
                          "I'm interested in the long-term growth of clean energy",
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            "interestReasons",
                            "I'm interested in the long-term growth of clean energy",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">✅</span>I'm interested in the{" "}
                          <span className="whitespace-nowrap">long-term growth</span> of clean energy
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    How much capital do you currently have access to for launching a business like this?
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <SelectionBox
                      selected={formData.availableCapital === "Less than $10,000"}
                      onChange={() => handleSingleOptionChange("availableCapital", "Less than $10,000")}
                    >
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">🔘</span>
                        Less than $10,000
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.availableCapital === "$10,000–$20,000"}
                      onChange={() => handleSingleOptionChange("availableCapital", "$10,000–$20,000")}
                    >
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">🔘</span>
                        $10,000–$20,000
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.availableCapital === "$20,000–$30,000"}
                      onChange={() => handleSingleOptionChange("availableCapital", "$20,000–$30,000")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>
                        $20,000–$30,000
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.availableCapital === "$30,000–$50,000"}
                      onChange={() => handleSingleOptionChange("availableCapital", "$30,000–$50,000")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>
                        $30,000–$50,000
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.availableCapital === "$50,000+"}
                      onChange={() => handleSingleOptionChange("availableCapital", "$50,000+")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>
                        $50,000+
                      </div>
                    </SelectionBox>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    What's your main goal with this opportunity?
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.mainGoal === "Build a second income stream"}
                        onChange={() => handleSingleOptionChange("mainGoal", "Build a second income stream")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Build a{" "}
                          <span className="whitespace-nowrap">second income stream</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.mainGoal === "Transition out of my job"}
                        onChange={() => handleSingleOptionChange("mainGoal", "Transition out of my job")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Transition out of my job
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.mainGoal === "Replace or surpass my current income"}
                        onChange={() => handleSingleOptionChange("mainGoal", "Replace or surpass my current income")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Replace or surpass my{" "}
                          <span className="whitespace-nowrap">current income</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.mainGoal === "Build long-term, hands-free income"}
                        onChange={() => handleSingleOptionChange("mainGoal", "Build long-term, hands-free income")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Build{" "}
                          <span className="whitespace-nowrap">long-term, hands-free income</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.mainGoal === "Not sure yet — just exploring"}
                        onChange={() => handleSingleOptionChange("mainGoal", "Not sure yet — just exploring")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Not sure yet — just exploring
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    Do you have <span className="whitespace-nowrap">2–3 hours per week</span> to oversee your solar
                    business if we handle the rest?
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.timeCommitment === "Yes"}
                        onChange={() => handleSingleOptionChange("timeCommitment", "Yes")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Yes
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.timeCommitment === "No"}
                        onChange={() => handleSingleOptionChange("timeCommitment", "No")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>No
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.timeCommitment === "Depends on what that looks like"}
                        onChange={() => handleSingleOptionChange("timeCommitment", "Depends on what that looks like")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Depends on what that looks like
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 6 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    How soon would you be ready to move forward if everything checks out?
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.readyToMoveForward === "ASAP — I've been looking for something like this"}
                        onChange={() =>
                          handleSingleOptionChange(
                            "readyToMoveForward",
                            "ASAP — I've been looking for something like this",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>ASAP — I've been looking for something like this
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.readyToMoveForward === "Within 1–2 weeks"}
                        onChange={() => handleSingleOptionChange("readyToMoveForward", "Within 1–2 weeks")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Within <span className="whitespace-nowrap">1–2 weeks</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.readyToMoveForward === "Within 30 days"}
                        onChange={() => handleSingleOptionChange("readyToMoveForward", "Within 30 days")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Within <span className="whitespace-nowrap">30 days</span>
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.readyToMoveForward === "Just exploring — not sure yet"}
                        onChange={() => handleSingleOptionChange("readyToMoveForward", "Just exploring — not sure yet")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Just exploring —{" "}
                          <span className="whitespace-nowrap">not sure yet</span>
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 7 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    We handle the heavy lifting... but where would you value additional clarity or support before moving
                    forward? <span className="whitespace-nowrap">(Select all that apply)</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <SelectionBox
                      selected={formData.supportNeeded.includes(
                        "Understanding the business model and earning potential",
                      )}
                      onChange={() =>
                        handleCheckboxChange("supportNeeded", "Understanding the business model and earning potential")
                      }
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>Understanding the{" "}
                        <span className="whitespace-nowrap">business model</span> and{" "}
                        <span className="whitespace-nowrap">earning potential</span>
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.supportNeeded.includes("How we generate and qualify solar leads")}
                      onChange={() => handleCheckboxChange("supportNeeded", "How we generate and qualify solar leads")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>How we generate and qualify{" "}
                        <span className="whitespace-nowrap">solar leads</span>
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.supportNeeded.includes("Legal, compliance, and business structure")}
                      onChange={() =>
                        handleCheckboxChange("supportNeeded", "Legal, compliance, and business structure")
                      }
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>Legal, compliance, and{" "}
                        <span className="whitespace-nowrap">business structure</span>
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.supportNeeded.includes("What the weekly time commitment looks like")}
                      onChange={() =>
                        handleCheckboxChange("supportNeeded", "What the weekly time commitment looks like")
                      }
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>What the{" "}
                        <span className="whitespace-nowrap">weekly time commitment</span> looks like
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.supportNeeded.includes("Long-term scalability and exit potential")}
                      onChange={() => handleCheckboxChange("supportNeeded", "Long-term scalability and exit potential")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>
                        <span className="whitespace-nowrap">Long-term scalability</span> and{" "}
                        <span className="whitespace-nowrap">exit potential</span>
                      </div>
                    </SelectionBox>
                    <SelectionBox
                      selected={formData.supportNeeded.includes("Other (specify below)")}
                      onChange={() => handleCheckboxChange("supportNeeded", "Other (specify below)")}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">🔘</span>Other <span className="whitespace-nowrap">(specify below)</span>
                      </div>
                    </SelectionBox>
                  </div>

                  {formData.supportNeeded.includes("Other (specify below)") && (
                    <div className="mt-4">
                      <textarea
                        name="otherSupportNeeded"
                        value={formData.otherSupportNeeded || ""}
                        onChange={handleChange}
                        placeholder="Please specify what other support you need..."
                        className="w-full h-24 p-4 bg-[#0A0A0A] border border-[#333] focus:border-[#C7A052] focus:ring-[#C7A052] text-[#E7C078] rounded-lg resize-none"
                        style={{
                          WebkitTextFillColor: "#E7C078",
                          backgroundColor: "#0A0A0A !important",
                        }}
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 8 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    If we offer you a <span className="whitespace-nowrap">private strategy call</span>, are you{" "}
                    <span className="whitespace-nowrap">100% committed</span> to showing up on time?
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <SelectionBox
                        selected={formData.strategyCallCommitment === "Yes"}
                        onChange={() => handleSingleOptionChange("strategyCallCommitment", "Yes")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Yes
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={formData.strategyCallCommitment === "No"}
                        onChange={() => handleSingleOptionChange("strategyCallCommitment", "No")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>No
                        </div>
                      </SelectionBox>
                      <SelectionBox
                        selected={
                          formData.strategyCallCommitment === "Only if I feel like it's a fit after watching the video"
                        }
                        onChange={() =>
                          handleSingleOptionChange(
                            "strategyCallCommitment",
                            "Only if I feel like it's a fit after watching the video",
                          )
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-2">🔘</span>Only if I feel like it's a fit after{" "}
                          <span className="whitespace-nowrap">watching the video</span>
                        </div>
                      </SelectionBox>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              {/* Question 9: Full Name */}
              {currentStep === 9 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    What is your <span className="whitespace-nowrap">full name</span>?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                      className="bg-[#0A0A0A] border border-[#333] focus:border-[#C7A052] focus:ring-[#C7A052] text-[#E7C078] h-12 text-base px-4 rounded-lg"
                      style={{
                        WebkitTextFillColor: "#E7C078",
                        backgroundColor: "#0A0A0A !important",
                      }}
                    />

                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                      className="bg-[#0A0A0A] border border-[#333] focus:border-[#C7A052] focus:ring-[#C7A052] text-[#E7C078] h-12 text-base px-4 rounded-lg"
                      style={{
                        WebkitTextFillColor: "#E7C078",
                        backgroundColor: "#0A0A0A !important",
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Question 10: Email */}
              {currentStep === 10 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    What is your <span className="whitespace-nowrap">email address</span>?
                  </h3>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="w-full bg-[#0A0A0A] border border-[#333] focus:border-[#C7A052] focus:ring-[#C7A052] text-[#E7C078] h-12 text-base px-4 rounded-lg"
                    style={{
                      WebkitTextFillColor: "#E7C078",
                      backgroundColor: "#0A0A0A !important",
                    }}
                  />

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Question 11: Phone */}
              {currentStep === 11 && (
                <div className="space-y-5 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#C7A052] mb-4 sm:mb-6 p-3 sm:p-4 border border-[#C7A052]/30 bg-[#C7A052]/10 rounded-lg shadow-inner animate-typewriter">
                    What is your <span className="whitespace-nowrap">phone number</span>?
                  </h3>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                    className="w-full bg-[#0A0A0A] border border-[#333] focus:border-[#C7A052] focus:ring-[#C7A052] text-[#E7C078] h-12 text-base px-4 rounded-lg"
                    style={{
                      WebkitTextFillColor: "#E7C078",
                      backgroundColor: "#0A0A0A !important",
                    }}
                  />

                  <div className="flex justify-between mt-6 sm:mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-base"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !validateCurrentStep()}
                      className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
