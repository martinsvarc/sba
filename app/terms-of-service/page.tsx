import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="premium-gradient py-6 md:py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black">Terms of Service</h1>
            <p className="text-black/80 mt-2">Last Updated: April 3, 2025</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="premium-card rounded-xl p-6 md:p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl md:text-2xl font-bold premium-text mb-4">Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you and Solar Boss Automations
              ("we," "us," or "our"), concerning your access to and use of our website and services. You agree that by
              accessing the website and/or services, you have read, understood, and agree to be bound by all of these
              Terms of Service.
            </p>
            <p className="mt-4">
              IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE
              WEBSITE AND SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the website and services are our proprietary property and all source code,
              databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the
              website (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the
              "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark
              laws and various other intellectual property rights.
            </p>
            <p className="mt-4">
              The Content and Marks are provided on the website "AS IS" for your information and personal use only.
              Except as expressly provided in these Terms of Service, no part of the website or services and no Content
              or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed,
              encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial
              purpose whatsoever, without our express prior written permission.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">User Representations</h2>
            <p>By using the website and services, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete;</li>
              <li>
                You will maintain the accuracy of such information and promptly update such registration information as
                necessary;
              </li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service;</li>
              <li>You are not a minor in the jurisdiction in which you reside;</li>
              <li>
                You will not access the website or services through automated or non-human means, whether through a bot,
                script or otherwise;
              </li>
              <li>You will not use the website or services for any illegal or unauthorized purpose;</li>
              <li>Your use of the website or services will not violate any applicable law or regulation.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">User Registration</h2>
            <p>
              You may be required to register with the website and services. You agree to keep your password
              confidential and will be responsible for all use of your account and password. We reserve the right to
              remove, reclaim, or change a username you select if we determine, in our sole discretion, that such
              username is inappropriate, obscene, or otherwise objectionable.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Fees and Payment</h2>
            <p>We accept the following forms of payment:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>Discover</li>
            </ul>
            <p className="mt-4">
              You agree to provide current, complete, and accurate purchase and account information for all purchases
              made via the website or services. You further agree to promptly update account and payment information,
              including email address, payment method, and payment card expiration date, so that we can complete your
              transactions and contact you as needed.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Cancellation</h2>
            <p>
              You can cancel your subscription at any time by logging into your account or contacting us using the
              contact information provided below. Your cancellation will take effect at the end of the current paid
              term.
            </p>
            <p className="mt-4">
              If you are unsatisfied with our services, please email us at support@solarbossautomations.com.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Prohibited Activities</h2>
            <p>
              You may not access or use the website or services for any purpose other than that for which we make the
              website and services available. The website and services may not be used in connection with any commercial
              endeavors except those that are specifically endorsed or approved by us.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Disclaimer</h2>
            <p>
              THE WEBSITE AND SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE
              WEBSITE AND SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
              WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE WEBSITE AND SERVICES AND YOUR USE THEREOF.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Limitation of Liability</h2>
            <p>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY
              DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
              PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR SERVICES,
              EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of
              our respective officers, agents, partners, and employees, from and against any loss, damage, liability,
              claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or
              arising out of your use of the website or services.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Contact Us</h2>
            <p>
              In order to resolve a complaint regarding the website or services or to receive further information
              regarding use of the website or services, please contact us at:{" "}
              <span className="premium-text font-semibold">support@solarbossautomations.com</span>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#7A5C2E]/30">
            <Link href="/" className="premium-text hover:text-[#e7c078] font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="premium-gradient-subtle py-6 md:py-8">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <p className="text-sm md:text-base text-black">Copyright 2025 Solar Boss Automations</p>
          <div className="flex justify-center gap-4 md:gap-6 mt-2">
            <Link
              href="/privacy-policy"
              className="text-black/80 hover:text-black transition-colors text-xs md:text-sm font-medium"
            >
              Privacy Policy
            </Link>
            <span className="text-black/50">|</span>
            <Link
              href="/terms-of-service"
              className="text-black/80 hover:text-black transition-colors text-xs md:text-sm font-medium"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
