"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronRight, Play, Clock } from "lucide-react"
import Image from "next/image"
import Script from "next/script"

export default function WatchPage() {
  const searchParams = useSearchParams()
  const firstName = searchParams.get("firstName") || "Valued Customer"
  const lastName = searchParams.get("lastName") || ""
  const email = searchParams.get("email") || "user@example.com"
  const phone = searchParams.get("phone") || ""

  const [isLoaded, setIsLoaded] = useState(false)

  // Chapter data with timestamps in seconds
  const chapters = [
    { time: 0, title: "Solar Income Without Experience", duration: "0:00" },
    { time: 55, title: "Real Success Stories", duration: "0:55" },
    { time: 155, title: "Why Solar is Exploding", duration: "2:35" },
    { time: 257, title: "How Our Partners Launch", duration: "4:17" },
    { time: 419, title: "The 3 Pillars We Handle", duration: "6:59" },
    { time: 554, title: "Our Guarantee", duration: "9:14" },
    { time: 604, title: "What Happens After You Apply", duration: "10:04" },
  ]

  useEffect(() => {
    // Track Lead event on page load
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead")
    }

    // Set loaded state after a small delay to trigger animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)

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
          })
        })
      },
    })
  }

  return (
    <>
      <Script
        src="https://fast.wistia.net/assets/external/E-v1.js"
        strategy="afterInteractive"
        onLoad={handleWistiaReady}
      />

      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-[#C7A052]/20 py-3 px-4 sm:px-6 sticky top-0 z-50">
          <div className="container mx-auto flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
                alt="Solar Boss Logo"
                width={120}
                height={39}
                className="h-auto w-auto max-w-[120px]"
                priority
              />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
          {/* Welcome Message */}
          <div className={`mb-8 text-center ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Welcome <span className="text-[#C7A052]">{firstName}</span>!
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Watch this exclusive presentation to discover how you can launch your own remote solar business.
            </p>
          </div>

          {/* Video Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div
                className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg ${
                  isLoaded ? "animate-slide-up" : "opacity-0"
                }`}
              >
                <div className="aspect-video">
                  {/* Using the exact Wistia embed code */}
                  <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                    <div
                      className="wistia_responsive_wrapper"
                      style={{ height: "100%", left: "0", position: "absolute", top: "0", width: "100%" }}
                    >
                      <div
                        className="wistia_embed wistia_async_dvb8kegpur"
                        id="wistia_dvb8kegpur"
                        style={{ height: "100%", width: "100%" }}
                      >
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="lg:col-span-1">
              <div
                className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg h-fit ${
                  isLoaded ? "animate-slide-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-[#C7A052]" />
                    Video Chapters
                  </h3>
                  <div className="space-y-3">
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        data-timestamp={chapter.time}
                        className="w-full text-left p-3 rounded-lg bg-black/50 hover:bg-[#C7A052]/10 border border-transparent hover:border-[#C7A052]/30 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-[#C7A052] text-sm font-medium mb-1">From {chapter.duration}</div>
                            <div className="text-white text-sm leading-tight group-hover:text-[#C7A052] transition-colors">
                              {chapter.title}
                            </div>
                          </div>
                          <Play className="h-4 w-4 text-[#C7A052] ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className={`text-center ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-zinc-900 border border-[#C7A052]/20 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                After watching the presentation, take the next step and book your strategy call to discuss how we can
                build your solar business.
              </p>
              <Link
                href="/book-call"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C7A052] hover:bg-[#C7A052]/90 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Your Strategy Call
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-[#C7A052]/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-[#C7A052] font-bold text-lg">SOLAR BOSS</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">© 2025 Solar Boss Voice. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    _wq: any[]
    fbq: any
  }
}
