"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"
import Head from "next/head"

export default function WeAppreciateYouPage() {
  const [copied, setCopied] = useState(false)
  const shareLink = "go.solarbossautomations.com"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && typeof fbq !== 'undefined') {
                const email = localStorage.getItem('email') || '';
                const eventId = \`grav-unqualified-\${email}-\${Date.now()}\`;
                fbq('trackCustom', 'UnqualifiedLead', {}, { eventID: eventId });
              }
            `,
          }}
        />
      </Head>

      <div className="min-h-screen bg-custom-black text-custom-white texture-overlay">
        {/* Header */}
        <header className="bg-black border-b border-custom-bronze/20 py-2 px-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
              alt="Renewable Energy Boss Logo"
              className="h-auto w-auto max-w-[100px] sm:max-w-[120px]"
            />
          </div>
        </header>

        <main className="w-full max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8">
          <div className="bg-[#0A0A0A] rounded-lg sm:rounded-xl shadow-xl overflow-hidden border border-[#7A5C2E]/30 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#C7A052] mb-3 sm:mb-4">
                We Appreciate Your Interest
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                Thank you for taking the time to complete our questionnaire. Based on your responses, we believe our
                program might not be the best fit for you at this time.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="bg-[#111] p-4 sm:p-6 rounded-lg border border-[#333]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#C7A052] mb-3 sm:mb-4">Free Resources For You</h2>
                <p className="mb-4">
                  We'd like to offer you access to our free educational content that can help you learn more about the
                  renewable energy industry and business opportunities.
                </p>
                <Link
                  href="https://www.youtube.com/@TheSolarBoss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#C7A052] hover:text-[#D4AF61] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Our YouTube Channel
                </Link>
              </div>

              <div className="bg-[#111] p-4 sm:p-6 rounded-lg border border-[#333]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#C7A052] mb-3 sm:mb-4">Share With Friends</h2>
                <p className="mb-4">
                  Do you know someone who might be a better fit for our program? Share this link with them:
                </p>
                <div className="flex items-center space-x-2 bg-[#0A0A0A] p-2 sm:p-3 rounded border border-[#333] mb-3 sm:mb-4">
                  <span className="text-white/90 flex-grow text-sm sm:text-base overflow-x-auto whitespace-nowrap">
                    {shareLink}
                  </span>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border border-[#7A5C2E] text-[#C7A052] hover:bg-[#7A5C2E]/10 whitespace-nowrap flex-shrink-0"
                  >
                    {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 mb-4 text-sm sm:text-base">
                  If your circumstances change in the future, we'd be happy to reconsider your application.
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
