"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import { useUTMTracking } from "../hooks/use-utm-tracking"

// Format phone number for Calendly (digits only, always starting with 1)
const formatPhoneForCalendly = (phoneNumber: string) => {
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, "")

  // Ensure the number starts with 1 (US country code)
  if (!digits.startsWith("1")) {
    digits = "1" + digits
  }

  console.log("Original phone:", phoneNumber)
  console.log("Formatted phone for Calendly:", digits)

  return digits
}

// Add this debug function right after formatPhoneForCalendly
const buildCalendlyUrl = (firstName: string, lastName: string, email: string, phone: string, utmParams: any) => {
  const formattedPhone = formatPhoneForCalendly(phone)

  // Build base URL with existing parameters
  let url = `https://calendly.com/sbateam/solar-boss-empire-strategy-call?primary_color=8c7905&name=${encodeURIComponent(`${firstName} ${lastName}`.trim())}&email=${encodeURIComponent(email)}&a2=${encodeURIComponent(formattedPhone)}`

  // Add UTM parameters if they exist
  if (utmParams.utm_source) {
    url += `&utm_source=${encodeURIComponent(utmParams.utm_source)}`
  }
  if (utmParams.utm_campaign) {
    url += `&utm_campaign=${encodeURIComponent(utmParams.utm_campaign)}`
  }
  if (utmParams.utm_medium) {
    url += `&utm_medium=${encodeURIComponent(utmParams.utm_medium)}`
  }
  if (utmParams.utm_content) {
    url += `&utm_content=${encodeURIComponent(utmParams.utm_content)}`
  }
  if (utmParams.utm_term) {
    url += `&utm_term=${encodeURIComponent(utmParams.utm_term)}`
  }

  console.log("Final Calendly URL with UTMs:", url)
  return url
}

export default function BookCallPage() {
  const searchParams = useSearchParams()
  const firstName = searchParams.get("firstName") || "there"
  const email = searchParams.get("email") || "user@example.com"
  const phone = searchParams.get("phone") || "+1 (555) 123-4567"
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialFormData, setInitialFormData] = useState<any>(null)
  const lastName = searchParams.get("lastName") || ""

  // Smart funnel state
  const [currentStep, setCurrentStep] = useState(0)
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false)

  // Add UTM tracking
  const { utmParams } = useUTMTracking()

  // Steps for the funnel
  const steps = [
    { name: "Welcome", description: "Introduction" },
    { name: "Benefits", description: "What to expect" },
    { name: "Schedule", description: "Pick a time" },
  ]

  // Load questionnaire data from localStorage
  const [questionnaireData, setQuestionnaireData] = useState({
    businessType: "",
    currentRevenue: "",
    targetRevenue: "",
    challenges: "",
    timeline: "",
  })

  // Send data to webhook when "Book Your Slot" button is clicked
  const sendDataToWebhook = async () => {
    if (isBookingSubmitted || isSubmitting) return // Prevent duplicate submissions

    setIsSubmitting(true)

    try {
      // Combine all data
      const completeData = {
        // Use data from localStorage if available, otherwise use URL params
        firstName: initialFormData?.firstName || firstName,
        email: initialFormData?.email || email,
        phone: initialFormData?.phone || phone,

        // Questionnaire data
        ...questionnaireData,

        // UTM parameters from hook and fallback to localStorage
        utm_source: utmParams.utm_source || initialFormData?.utmSource || "",
        utm_campaign: utmParams.utm_campaign || initialFormData?.utmCampaign || "",
        utm_medium: utmParams.utm_medium || initialFormData?.utmMedium || "",
        utm_content: utmParams.utm_content || initialFormData?.utmContent || "",
        utm_term: utmParams.utm_term || "",

        timestamp: new Date().toISOString(),
        source: "website_form",
      }

      console.log("Sending complete data to webhook:", completeData)

      // Send to our API route
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      const result = await response.json()
      console.log("Webhook response:", result)

      setIsBookingSubmitted(true)
      setIsSubmitting(false)

      // Show success message
      alert("Your information has been submitted successfully! Our team will be in touch soon.")

      return result.success
    } catch (error) {
      console.error("Error sending data to webhook:", error)
      setIsSubmitting(false)
      alert("There was an error submitting your information. Please try again.")
      return false
    }
  }

  // Load saved data from URL params and localStorage
  useEffect(() => {
    try {
      // First try to get data from URL parameters
      const urlFirstName = searchParams.get("firstName")
      const urlLastName = searchParams.get("lastName")
      const urlEmail = searchParams.get("email")
      const urlPhone = searchParams.get("phone")

      // If we have URL parameters, use them
      if (urlFirstName || urlEmail || urlPhone) {
        setInitialFormData({
          firstName: urlFirstName || firstName,
          lastName: urlLastName || lastName,
          email: urlEmail || email,
          phone: urlPhone || phone,
          utmSource: "",
          utmCampaign: "",
          utmMedium: "",
          utmContent: "",
        })
      }
      // Otherwise try to load from localStorage
      else {
        const savedInitialData = localStorage.getItem("initialFormData")
        if (savedInitialData) {
          setInitialFormData(JSON.parse(savedInitialData))
        }
      }

      // Load questionnaire data
      const savedQuestionnaireData = localStorage.getItem("questionnaireData")
      if (savedQuestionnaireData) {
        setQuestionnaireData(JSON.parse(savedQuestionnaireData))
      }
    } catch (e) {
      console.warn("Could not load saved data:", e)
    }

    // Load Calendly script
    const calendlyScript = document.createElement("script")
    calendlyScript.type = "text/javascript"
    calendlyScript.src = "https://assets.calendly.com/assets/external/widget.js"
    calendlyScript.async = true
    calendlyScript.onload = () => {
      setIsCalendlyLoaded(true)
    }
    document.body.appendChild(calendlyScript)

    return () => {
      if (document.body.contains(calendlyScript)) {
        document.body.removeChild(calendlyScript)
      }
    }
  }, [])

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      <Head>
        <title>Book Your Strategy Call - Solar Boss Automations</title>
        <meta
          name="description"
          content="Schedule your free 30-minute strategy call with Solar Boss Automations. Get personalized recommendations for launching your remote solar business."
        />
        <meta name="robots" content="noindex, follow" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.fbq) {
                const name = localStorage.getItem('name') || '';
                const email = localStorage.getItem('email') || '';
                const phone = localStorage.getItem('phone') || '';
                const eventId = 'grav-complete-' + email + '-' + Date.now();

                // Fire Pixel
                fbq('track', 'CompleteRegistration', {}, { eventID: eventId });

                const utmString = new URLSearchParams({
                  utm_source: utmParams.utm_source || '',
                  utm_campaign: utmParams.utm_campaign || '',
                  utm_medium: utmParams.utm_medium || '',
                  utm_content: utmParams.utm_content || ''
                }).toString();

                // Send event_id and basic contact to the same webhook
                fetch("https://n8n.automatedsolarbiz.com/webhook/7e1f524f-48ae-4823-bf05-ba6f4ac58026", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    event_id: eventId,
                    source: "book-call-page",
                    utm_source: utmParams.utm_source || null,
                    utm_campaign: utmParams.utm_campaign || null,
                    utm_medium: utmParams.utm_medium || null,
                    utm_content: utmParams.utm_content || null
                  })
                }).catch(function(error) {
                  console.warn('Webhook error:', error);
                });
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Book Your Strategy Call",
              description: "Schedule your free 30-minute strategy call with Solar Boss Automations.",
              url: "https://solarbossautomations.com/book-call",
              isPartOf: {
                "@type": "WebSite",
                name: "Solar Boss Automations",
                url: "https://solarbossautomations.com",
              },
              mainEntity: {
                "@type": "Service",
                name: "Free Strategy Call",
                description: "30-minute consultation for remote solar business setup",
                provider: {
                  "@type": "Organization",
                  name: "Solar Boss Automations",
                },
              },
            }),
          }}
        />
      </Head>
      <div className="flex flex-col min-h-screen bg-custom-black text-custom-white texture-overlay">
        {/* Modern header */}
        <header className="bg-black border-b border-custom-bronze/20 py-3 px-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
              alt="Solar Boss Automations Logo"
              width={120}
              height={39}
              className="h-auto w-auto max-w-[120px]"
              unoptimized
              priority
            />
          </div>
        </header>

        {/* Main Content - Calendly */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative overflow-hidden max-w-7xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">
              <span className="premium-text">SCHEDULE YOUR CALL</span>
            </h1>
            <p className="text-custom-white/70 max-w-md mx-auto text-sm">Select a date and time that works for you</p>
          </div>

          <div className="bg-[#0A0A0A] rounded-xl border border-[#7A5C2E]/30 p-2 sm:p-3 max-w-6xl mx-auto">
            <div className="premium-gradient py-1 px-3 text-custom-black rounded-lg mb-2">
              <h2 className="text-base font-bold text-center">Select a Date & Time</h2>
            </div>

            {!isCalendlyLoaded && (
              <div className="flex flex-col items-center justify-center h-[700px]">
                <div className="w-10 h-10 border-2 border-custom-bronze border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-custom-white/70">Loading calendar...</p>
              </div>
            )}

            <div
              className={`w-full overflow-hidden bg-[#0A0A0A] h-[700px] rounded-lg ${!isCalendlyLoaded ? "hidden" : ""}`}
            >
              <div
                className="calendly-inline-widget"
                data-url={buildCalendlyUrl(firstName, lastName, email, phone, utmParams)}
                style={{
                  minWidth: "320px",
                  height: "100%",
                  minHeight: "700px",
                  background: "#0A0A0A",
                  border: "none",
                  padding: "0",
                }}
              ></div>
            </div>
          </div>
        </main>

        {/* Modern Footer */}
        <footer className="py-3 text-center text-custom-white/60">
          <div className="container mx-auto px-4">
            <div className="premium-text font-bold text-base mb-1">SOLAR BOSS</div>
            <p className="text-xs">© 2025 Solar Boss Voice. All rights reserved.</p>
            <div className="flex justify-center space-x-3 mt-1">
              <Link
                href="/privacy-policy"
                className="text-xs text-custom-bronze hover:text-custom-gold transition-colors"
              >
                Privacy
              </Link>
              <span className="text-custom-bronze/30">|</span>
              <Link
                href="/terms-of-service"
                className="text-xs text-custom-bronze hover:text-custom-gold transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
