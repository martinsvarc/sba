import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="premium-gradient py-6 md:py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black">Privacy Policy</h1>
            <p className="text-black/80 mt-2">Last Updated: April 3, 2025</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="premium-card rounded-xl p-6 md:p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl md:text-2xl font-bold premium-text mb-4">Introduction</h2>
            <p>
              Solar Boss Automations ("we," "our," or "us") respects your privacy and is committed to protecting it
              through our compliance with this policy. This Privacy Policy describes the types of information we may
              collect from you or that you may provide when you visit our website and our practices for collecting,
              using, maintaining, protecting, and disclosing that information.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Information We Collect</h2>
            <p>We collect several types of information from and about users of our website, including information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                By which you may be personally identified, such as name, email address, telephone number, or any other
                identifier by which you may be contacted online or offline ("personal information");
              </li>
              <li>
                That is about you but individually does not identify you, such as your internet connection, the
                equipment you use to access our website, and usage details;
              </li>
              <li>About your internet connection, the equipment you use to access our website, and usage details.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">How We Collect Your Information</h2>
            <p>We collect this information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Directly from you when you provide it to us, such as when you fill out forms on our website;</li>
              <li>
                Automatically as you navigate through the site, which may include usage details, IP addresses, and
                information collected through cookies and other tracking technologies;
              </li>
              <li>From third parties, for example, our business partners.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We use information that we collect about you or that you provide to us, including any personal
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To present our website and its contents to you;</li>
              <li>To provide you with information, products, or services that you request from us;</li>
              <li>To fulfill any other purpose for which you provide it;</li>
              <li>To provide you with notices about your account;</li>
              <li>
                To carry out our obligations and enforce our rights arising from any contracts entered into between you
                and us;
              </li>
              <li>
                To notify you about changes to our website or any products or services we offer or provide through it;
              </li>
              <li>In any other way we may describe when you provide the information;</li>
              <li>For any other purpose with your consent.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Disclosure of Your Information</h2>
            <p>
              We may disclose aggregated information about our users, and information that does not identify any
              individual, without restriction. We may disclose personal information that we collect or you provide as
              described in this privacy policy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To our subsidiaries and affiliates;</li>
              <li>To contractors, service providers, and other third parties we use to support our business;</li>
              <li>
                To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization,
                dissolution, or other sale or transfer of some or all of our assets;
              </li>
              <li>To fulfill the purpose for which you provide it;</li>
              <li>For any other purpose disclosed by us when you provide the information;</li>
              <li>With your consent.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from
              unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our
              secure servers behind firewalls.
            </p>
            <p className="mt-4">
              Unfortunately, the transmission of information via the internet is not completely secure. Although we do
              our best to protect your personal information, we cannot guarantee the security of your personal
              information transmitted to our website. Any transmission of personal information is at your own risk.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Changes to Our Privacy Policy</h2>
            <p>
              It is our policy to post any changes we make to our privacy policy on this page. If we make material
              changes to how we treat our users' personal information, we will notify you through a notice on the
              website home page. The date the privacy policy was last revised is identified at the top of the page.
            </p>

            <h2 className="text-xl md:text-2xl font-bold premium-text mt-8 mb-4">Contact Information</h2>
            <p>
              To ask questions or comment about this privacy policy and our privacy practices, contact us at:{" "}
              <span className="premium-text font-semibold">privacy@solarbossautomations.com</span>
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
