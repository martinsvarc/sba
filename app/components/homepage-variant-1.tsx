"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Head from "next/head"
import Image from "next/image"
import PageExitTracker from "../components/page-exit-tracker"
import Footer from "../components/footer"
import Script from "next/script"
import { useEffect, useState } from "react"
import { trackApplyNowClick } from "../utils/form-interaction-tracker"
import MetaPixelMain from "../components/meta-pixel-main"

// Variant 1 of the HomePage component
export default function HomePageVariant1() {
  // Add this hook at the top of the component after other hooks
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullyMounted, setIsFullyMounted] = useState(false)

  const firstName = searchParams?.get("firstName") || "there"

  // Trigger animations after component mounts
  useEffect(() => {
    // Set initial state to prevent flash
    setIsFullyMounted(true)

    // Small delay to ensure DOM is ready before starting animations
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 150) // Slightly longer delay to ensure everything is ready

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Initialize Wistia queue
    if (typeof window !== "undefined") {
      window._wq = window._wq || []
    }
  }, [])

  const handleWistiaReady = () => {
    window._wq.push({
      id: "dvb8kegpur",
      onReady: (video: any) => {
        console.log("✅ Wistia ready")
        document.querySelectorAll("[data-timestamp]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const seconds = Number.parseInt(btn.getAttribute("data-timestamp") || "0", 10)
            console.log("⏩ Seeking to:", seconds)
            video.time(seconds)

            // Smooth scroll to video
            const videoElement = document.getElementById("wistia_dvb8kegpur")
            if (videoElement) {
              videoElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
          })
        })
      },
    })
  }

  // If not fully mounted, show nothing to prevent flash
  if (!isFullyMounted) {
    return null
  }

  return (
    <>
      <PageExitTracker />
      <MetaPixelMain />
      <Head>
        <title>Solar Boss Automations - Launch Your Remote Solar Business</title>
        <meta
          name="description"
          content="Watch our exclusive video to learn how to launch your first 6-7 figure remote solar business while our team builds everything for you."
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
if (typeof fbq !== 'undefined') {
  fbq('track', 'ViewContent');
}
`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: "Launch Your Remote Solar Business",
              description:
                "Learn how to launch your first 6-7 figure remote solar business while our team builds everything for you.",
              thumbnailUrl: "https://solarbossautomations.com/video-thumbnail.jpg",
              uploadDate: "2025-01-01",
              duration: "PT15M",
              contentUrl: "https://fast.wistia.net/embed/iframe/dvb8kegpur",
              embedUrl: "https://fast.wistia.net/embed/iframe/dvb8kegpur",
            }),
          }}
        />
      </Head>
      <div
        className="min-h-screen bg-black text-white"
        style={{
          opacity: isFullyMounted ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {/* Header with reserved space */}
        <header className="bg-black py-2 md:py-3 px-4 h-[47px] md:h-[51px] flex items-center">
          <div className="container mx-auto">
            <div className="flex justify-center">
              <div
                className={`transition-all duration-500 ease-out mt-0 mb-0 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              >
                <Image
                  src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
                  alt="Solar Boss Automations Logo"
                  width={120}
                  height={39}
                  className="h-auto w-auto max-w-[60px] xs:max-w-[70px] sm:max-w-[100px] object-contain leading-4 leading-7"
                  priority
                  unoptimized
                  style={{
                    maxWidth: "100px",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="w-full py-4 bg-[rgba(10,10,10,1)]">
          {/* Hero Section with reserved space */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-0 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "100ms" }}
              >
                {/* Modified headline for variant 1 */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight px-1 max-w-5xl mx-auto">
                  <span className="block text-center">
                    We'll Launch Your Remote Solar Business <span className="text-[#C7A052]">FOR You</span>
                  </span>
                  <span className="block text-center mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    You Just Oversee It <span className="text-[#C7A052] whitespace-nowrap">(2–3 Hours/Week)</span>
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Subtitle with reserved space */}
          <div className="container mx-auto px-4">
            <div className="min-h-[50px] sm:min-h-[40px] flex items-center justify-center mb-4 px-2">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <p className="text-sm xs:text-base sm:text-lg text-center max-w-4xl mx-auto leading-relaxed px-2">
                  Watch how we build your <span className="text-[#C7A052]">6–7 figure business</span> so you can stay
                  present with the people you love.
                </p>
              </div>
            </div>
          </div>

          {/* Video Player with reserved space */}
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-4">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="rounded-lg overflow-hidden border border-gray-700">
                  <div
                    className="wistia_responsive_padding"
                    style={{
                      padding: "56.25% 0 0 0",
                      position: "relative",
                    }}
                  >
                    <div
                      className="wistia_responsive_wrapper"
                      style={{
                        height: "100%",
                        left: 0,
                        position: "absolute",
                        top: 0,
                        width: "100%",
                      }}
                    >
                      <div
                        className="wistia_embed wistia_async_dvb8kegpur"
                        id="wistia_dvb8kegpur"
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action with reserved space */}
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-4 text-center min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <button
                  onClick={() => {
                    // Track the Apply Now button click
                    trackApplyNowClick()

                    // Get current URL parameters (including UTMs)
                    const currentParams = new URLSearchParams(window.location.search)
                    const applynowUrl = `/applynow?${currentParams.toString()}`

                    console.log("Navigating to applynow with UTMs:", applynowUrl)
                    router.push(applynowUrl)
                  }}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-black text-lg sm:text-2xl md:text-3xl font-bold py-4 sm:py-6 px-3 sm:px-8 rounded-xl hover:from-[#FFD700] hover:via-[#FFA500] hover:to-[#D4AF37] transition-all duration-300 gap-2 sm:gap-4 shadow-2xl hover:shadow-[#FFD700]/50 transform hover:scale-[1.02] border-2 border-[#FFD700]/30"
                  style={{
                    minHeight: "64px",
                  }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="leading-tight">Click Here To Apply Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video Chapters Section */}
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-8 md:mb-12">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "450ms" }}
              >
                {/* Subtle Divider */}
                <div className="flex items-center justify-center mb-6 md:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#C7A052]/30"></div>
                    <span className="text-[#C7A052] text-lg">🎬</span>
                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#C7A052]/30"></div>
                  </div>
                </div>

                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                    Inside This Video: What You'll Learn, Minute by Minute
                  </h3>
                </div>

                <div className="bg-gradient-to-br from-gray-900/30 to-black/30 border border-[#C7A052]/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="space-y-4 md:space-y-5">
                    {/* Chapter 1 */}
                    <button
                      data-timestamp="0"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 0:00
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — How People Are Getting Paid from the Solar Boom (Without Experience)
                        </span>
                      </div>
                    </button>

                    {/* Chapter 2 */}
                    <button
                      data-timestamp="55"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 0:55
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — Stories of People Who Made It Work (Even With Full-Time Jobs)
                        </span>
                      </div>
                    </button>

                    {/* Chapter 3 */}
                    <button
                      data-timestamp="155"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 2:35
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — Why Solar Is Becoming the Most Profitable Shift of This Decade
                        </span>
                      </div>
                    </button>

                    {/* Chapter 4 */}
                    <button
                      data-timestamp="257"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 4:17
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — How Our Partners Launch Their Solar Business Without Guesswork
                        </span>
                      </div>
                    </button>

                    {/* Chapter 5 */}
                    <button
                      data-timestamp="419"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 6:59
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — The 3 Parts We Handle So You Don't Have To
                        </span>
                      </div>
                    </button>

                    {/* Chapter 6 */}
                    <button
                      data-timestamp="554"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 9:14
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — What We Guarantee (And Why We're Willing to Back It Up)
                        </span>
                      </div>
                    </button>

                    {/* Chapter 7 */}
                    <button
                      data-timestamp="604"
                      className="flex items-start gap-3 md:gap-4 group hover:bg-[#C7A052]/10 rounded-lg p-3 transition-all duration-300 w-full text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-[#C7A052] rounded-full mt-2 group-hover:bg-[#F7C744]"></div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#C7A052] text-sm md:text-base group-hover:text-[#F7C744] group-hover:underline">
                          From 10:04
                        </span>
                        <span className="text-white text-sm md:text-base ml-2 group-hover:text-gray-100">
                          — What Happens After You Apply (And How We Select Partners)
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section with reserved space */}
          <div className="container mx-auto px-4">
            <div className="mt-12 md:mt-16 lg:mt-20 mb-12 min-h-[400px] md:min-h-[300px]">
              <div
                className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "500ms" }}
              >
                <div className="text-center mb-8">
                  <p className="text-[#C7A052] text-sm sm:text-base md:text-lg font-medium">
                    TRUSTED BY INDUSTRY LEADERS
                  </p>
                </div>

                {/* Trust Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
                  {/* Jordan Belfort Approved */}
                  <div
                    className={`bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#C7A052]/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-[#C7A052]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#C7A052]/10 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: "600ms", minHeight: "180px" }}
                  >
                    <div className="w-12 h-12 bg-[#C7A052]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-[#C7A052]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Jordan Belfort Approved</h3>
                    <p className="text-gray-400 text-xs mt-2">Endorsed by the Wolf of Wall Street</p>
                  </div>

                  {/* $2M+ Ad Spend Proven */}
                  <div
                    className={`bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#C7A052]/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-[#C7A052]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#C7A052]/10 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: "700ms", minHeight: "180px" }}
                  >
                    <div className="w-12 h-12 bg-[#C7A052]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-[#C7A052]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">$2M+ Ad Spend</h3>
                    <p className="text-gray-400 text-xs mt-2">Battle-tested marketing & sales systems</p>
                  </div>

                  {/* 100+ Remote Solar Businesses Launched */}
                  <div
                    className={`bg-gradient-to-br from-gray-900/50 to-black/50 border border-[#C7A052]/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-[#C7A052]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#C7A052]/10 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: "800ms", minHeight: "180px" }}
                  >
                    <div className="w-12 h-12 bg-[#C7A052]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-[#C7A052]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ width: "24px", height: "24px" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">100+ Remote Solar Businesses Launched</h3>
                    <p className="text-gray-400 text-xs mt-2">Proven track record of success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - now controlled by the same loading state */}
        <div
          className={`transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "900ms" }}
        >
          <Footer />
        </div>

        <Script
          src="https://fast.wistia.net/assets/external/E-v1.js"
          strategy="afterInteractive"
          onLoad={handleWistiaReady}
        />
      </div>
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    _wq: any[]
  }
}
