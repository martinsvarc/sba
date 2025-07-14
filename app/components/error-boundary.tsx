"use client"

import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ error, errorInfo })

    // Log error to monitoring service (if you have one)
    // logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>

              <p className="text-white/80 mb-6 leading-relaxed">
                We encountered a technical issue, but don't worry - we're here to help you continue your application.
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.resetError}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Try Again
                </button>

                <button
                  onClick={() => {
                    try {
                      localStorage.clear()
                    } catch (e) {
                      console.error("Failed to clear localStorage:", e)
                    }
                    window.location.href = "/"
                  }}
                  className="w-full px-6 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-lg font-semibold transition-all duration-300"
                >
                  Start Fresh
                </button>
              </div>

              <p className="text-white/50 text-sm mt-4">If this issue persists, please contact our support team.</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
