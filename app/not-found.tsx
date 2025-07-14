import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-custom-bronze/20 py-3 px-4 sm:px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dmbzcxhjn/image/upload/v1747872288/BDLhPzEOksfdxSL8XGmDLnyxRw_xyj5np.avif"
            alt="Renewable Energy Boss Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 Icon */}
          <div className="mb-8 relative">
            <div className="text-[10rem] font-bold text-custom-bronze opacity-10 leading-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-24 w-24 text-custom-bronze" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-custom-bronze">Page Not Found</h1>
          <p className="text-xl text-zinc-300 mb-8">The page you're looking for doesn't exist or has been moved.</p>

          {/* Return Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-custom-bronze hover:bg-custom-bronze/90 text-black font-semibold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            Return to Homepage
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} Renewable Energy Boss. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
