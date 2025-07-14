export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-16 px-4 border-t border-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        {/* Copyright */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm">© 2025 Solar Boss Automations. All rights reserved.</p>
        </div>

        {/* Disclaimer Content */}
        <div className="text-sm leading-relaxed space-y-6 text-gray-400">
          <p className="max-w-4xl mx-auto">
            This website is operated and maintained by Solar Boss Automations. Use of this website is governed by our
            Terms of Service and Privacy Policy.
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF61]/30 to-transparent mx-auto"></div>

          <p className="max-w-4xl mx-auto">
            Solar Boss Automations provides specialized services and training in marketing. We do not offer a business
            opportunity, "get rich quick" program, or money-making system. Our goal is to equip individuals with
            practical education and training to make informed business decisions, but we do not guarantee success from
            our programs. We make no claims regarding earnings, effort, or the likelihood of financial gain from our
            training. All content on this site is intellectual property protected by copyright, and duplication,
            reproduction, or distribution is strictly prohibited.
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF61]/30 to-transparent mx-auto"></div>

          <p className="max-w-4xl mx-auto">
            Engaging in any business activity involves risk, and it is possible to lose some or all of your investment.
            Our training and services are general and may not be suited for every individual or business situation. We
            make no guarantees regarding the outcomes or predictability of any business endeavor.
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF61]/30 to-transparent mx-auto"></div>

          <p className="max-w-4xl mx-auto">
            Statements, testimonials, and depictions on this website reflect the experiences or opinions of individuals
            who have used our services. Results vary and are not typical, as they depend on factors such as individual
            effort, time, skill, and other unknown elements. We do not track earnings or financial performance but
            assess completed projects and client satisfaction through voluntary feedback. While many clients report
            positive results after applying our training, this does not guarantee financial success.
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF61]/30 to-transparent mx-auto"></div>

          <p className="max-w-4xl mx-auto">
            Solar Boss Automations may reference or link to third-party content and services not affiliated with us. We
            are not responsible for such content and do not endorse or approve it. We may also collaborate with or refer
            you to third-party businesses, some of which may share common interests or ownership with Solar Boss
            Automations.
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF61]/30 to-transparent mx-auto mt-8"></div>

          {/* Legal Links */}
          <div className="mt-8 pt-4">
            <div className="flex justify-center items-center space-x-8 text-sm">
              <a
                href="/privacy-policy"
                className="text-[#D4AF61] hover:text-[#E7C078] transition-colors duration-300 underline underline-offset-4"
              >
                Privacy Policy
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="/terms-of-service"
                className="text-[#D4AF61] hover:text-[#E7C078] transition-colors duration-300 underline underline-offset-4"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
