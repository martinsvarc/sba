"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Heart } from "lucide-react"
import { useUTMTracking } from "../hooks/use-utm-tracking"

interface Testimonial {
  id: string
  name: string
  context: string
  summary: string
  embedHtml: string
  footerType: "deals" | "favorite"
  footerText: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Tamara",
    context: "First-time solar investor",
    summary:
      "I knew nothing about solar, but they guided me with full clarity. They built my entire future income plan.",
    embedHtml: `<div class="relative w-full" style="aspect-ratio: 9/16;"><iframe src="https://player.vimeo.com/video/963681855?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Tamara SBA Review"></iframe></div>`,
    footerType: "favorite",
    footerText: "Transparent ROI projections and reporting",
  },
  {
    id: "2",
    name: "Vanessa",
    context: "Single Mom with a Full-Time Job",
    summary:
      "This model gave me real passive income without sacrificing time with my kids. It truly changed everything.",
    embedHtml: `<div class="relative w-full" style="aspect-ratio: 9/16;"><iframe src="https://player.vimeo.com/video/963677748?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Vanessa SBA Review"></iframe></div>`,
    footerType: "deals",
    footerText: "Closed multiple deals and reinvested profits",
  },
  {
    id: "3",
    name: "Sam",
    context: "Full-Time Worker",
    summary: "Within 30 days of launch, sales started coming in. They held my hand every step of the way.",
    embedHtml: `<div class="relative w-full" style="aspect-ratio: 9/16;"><iframe src="https://player.vimeo.com/video/963658808?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Sam SBA Review"></iframe></div>`,
    footerType: "deals",
    footerText: "First deal closed in the first month",
  },
  {
    id: "4",
    name: "Brooklyn",
    context: "Solar Advocate & Side Hustler",
    summary:
      "I already had solar on my home, but now I'm earning with it. The dashboard and team support are top-tier.",
    embedHtml: `<div class="relative w-full" style="aspect-ratio: 9/16;"><iframe src="https://player.vimeo.com/video/963717971?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Brooklyn SBA Review"></iframe></div>`,
    footerType: "favorite",
    footerText: "Professional service and real-time tracking",
  },
  {
    id: "5",
    name: "Anthony",
    context: "Tried other passive income models",
    summary:
      "I failed with YouTube automation and trucking. But with Solar Boss, I hit 6 profitable deals in 3 months.",
    embedHtml: `<div class="relative w-full" style="aspect-ratio: 9/16;"><iframe src="https://player.vimeo.com/video/963664815?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Anthony SBA Review"></iframe></div>`,
    footerType: "deals",
    footerText: "Closed 6 deals in 90 days",
  },
]

export default function ReviewsPage() {
  const { utmParams, appendUTMToUrl } = useUTMTracking()

  useEffect(() => {
    // Load Vimeo player script
    const script = document.createElement("script")
    script.src = "https://player.vimeo.com/api/player.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-center max-w-6xl">
          <Image
            src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
            alt="Solar Boss Logo"
            width={140}
            height={45}
            className="h-auto w-auto max-w-[140px]"
            unoptimized
            priority
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-4 px-4 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Real Stories. <br className="md:hidden" />
            <span className="premium-text">Real Results.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Hear directly from our partners how the Solar Boss Automation system changed their lives.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="premium-card rounded-3xl hover:premium-glow transition-all duration-300 overflow-hidden group hover:-translate-y-1 max-w-none md:max-w-md mx-auto"
              >
                {/* Video Container */}
                <div
                  className="relative bg-gray-900 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: testimonial.embedHtml }}
                />

                {/* Content */}
                <div className="p-6">
                  {/* Name and Context */}
                  <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{testimonial.context}</p>

                  {/* Summary */}
                  <p className="text-gray-300 leading-relaxed mb-4">"{testimonial.summary}"</p>

                  {/* Footer */}
                  <div className="flex items-center text-sm">
                    {testimonial.footerType === "deals" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-green-400">{testimonial.footerText}</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <span className="text-red-400">Favorite part:</span> {testimonial.footerText}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Card */}
            <div className="premium-card rounded-3xl p-8 flex flex-col justify-center text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to be our <br />
                <span className="premium-text">next success story?</span>
              </h2>
              <p className="text-base text-gray-300 mb-6">
                Join hundreds of solar professionals who have transformed their business with Solar Boss Voice.
              </p>

              <Link
                href={appendUTMToUrl("/book-call")}
                className="inline-flex items-center justify-center px-6 py-3 premium-gradient text-black font-bold text-base rounded-2xl hover:premium-glow transition-all duration-300 shadow-lg hover:-translate-y-1 mb-4"
              >
                Book Your Free Strategy Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <p className="text-xs text-gray-400">
                No commitment required • 30-minute consultation • Personalized demo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-400 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-lg font-bold premium-text mb-2">SOLAR BOSS</div>
          <p className="text-sm">© 2025 Solar Boss Voice. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-3">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
