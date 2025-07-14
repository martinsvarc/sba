"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Calendar, Check, Play, ArrowRight, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Update the formData interface to include a new field for selected obstacle
interface FormData {
  firstName: string
  email: string
  phone: string
  userType: string
  demoGoals: string
  currentIncome: string
  revenueGoal: string
  customRevenueGoal: string
  obstacles: string
  selectedObstacle: string
  readyToAct: string
  agreeToTerms: boolean
}

export default function TypeForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [showCustomRevenue, setShowCustomRevenue] = useState(false)
  const [showCustomObstacle, setShowCustomObstacle] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    phone: "",
    userType: "",
    demoGoals: "",
    currentIncome: "",
    revenueGoal: "",
    customRevenueGoal: "",
    obstacles: "",
    selectedObstacle: "",
    readyToAct: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState<string | null>(null)

  // Total number of steps (questions + contact form + success screen)
  const totalSteps = 8

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Special handling for revenue goal
    if (field === "revenueGoal" && value === "Other") {
      setShowCustomRevenue(true)
    } else if (field === "revenueGoal" && value !== "Other") {
      setShowCustomRevenue(false)
    }

    // Special handling for obstacles
    if (field === "selectedObstacle" && value === "Other") {
      setShowCustomObstacle(true)
    } else if (field === "selectedObstacle" && value !== "Other") {
      setShowCustomObstacle(false)
    }
  }

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    switch (currentStep) {
      case 0: // Contact Information
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required"
        }
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email"
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required"
        }
        break
      case 1: // User Type
        if (!formData.userType) {
          newErrors.userType = "Please select an option"
        }
        break
      case 2: // Demo Goals
        if (!formData.demoGoals.trim()) {
          newErrors.demoGoals = "Please tell us your goals"
        }
        break
      case 3: // Current Income
        if (!formData.currentIncome) {
          newErrors.currentIncome = "Please select an option"
        }
        break
      case 4: // Revenue Goal
        if (!formData.revenueGoal) {
          newErrors.revenueGoal = "Please select an option"
        }
        if (formData.revenueGoal === "Other" && !formData.customRevenueGoal.trim()) {
          newErrors.customRevenueGoal = "Please specify your revenue goal"
        }
        break
      case 5: // Obstacles
        if (!formData.selectedObstacle) {
          newErrors.selectedObstacle = "Please select an option"
        }
        if (formData.selectedObstacle === "Other" && !formData.obstacles.trim()) {
          newErrors.obstacles = "Please share your challenges"
        }
        break
      case 6: // Ready to Act
        if (!formData.readyToAct) {
          newErrors.readyToAct = "Please select an option"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setDirection("forward")
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        setIsTransitioning(false)
      }, 400)
    } else {
      // Add a subtle shake animation to the form when there are errors
      if (formRef.current) {
        formRef.current.classList.add("animate-shake")
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.classList.remove("animate-shake")
          }
        }, 500)
      }
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection("backward")
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1)
        setIsTransitioning(false)
      }, 400)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Track the lead event with Facebook Pixel
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Lead", {
            content_name: "Solar Lead Form",
            content_category: "Solar",
            value: 1.0,
            currency: "USD",
          })
        }

        // Create URL parameters
        const params = new URLSearchParams()
        if (formData.firstName) params.append("firstName", formData.firstName)
        if (formData.email) params.append("email", formData.email)

        // Redirect to video page instead of showing success screen
        router.push(`/watch-video?${params.toString()}`)
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "There was an error submitting your information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Calculate progress percentage
  const progressPercentage = Math.min((currentStep / (totalSteps - 1)) * 100, 100)

  // Transition classes
  const getTransitionClasses = () => {
    if (isTransitioning) {
      return direction === "forward"
        ? "transform-gpu translate-x-full opacity-0 rotateY-90"
        : "transform-gpu -translate-x-full opacity-0 rotateY-minus-90"
    }
    return "transform-gpu translate-x-0 opacity-100 rotateY-0 transition-all duration-700 ease-in-out"
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-amber-300 min-h-[500px] transition-all duration-700 ease-in-out transform-gpu perspective-[1200px]">
      {/* Advanced decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-300/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/4 right-0 w-1 h-16 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0 rounded-full"></div>
      <div className="absolute bottom-1/4 left-0 w-1 h-16 bg-gradient-to-b from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-gradient-radial from-amber-300/5 to-transparent rounded-full transform-gpu rotate-12 translate-z-12 animate-float-slow"></div>
      <div
        className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-radial from-yellow-300/5 to-transparent rounded-full transform-gpu -rotate-12 translate-z-8 animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-8 h-8 bg-gradient-radial from-amber-400/5 to-transparent rounded-full transform-gpu rotate-45 translate-z-16 animate-float-slow"
        style={{ animationDelay: "0.7s" }}
      ></div>
      <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-gradient-radial from-amber-200/5 to-transparent rounded-full"></div>
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-radial from-yellow-200/5 to-transparent rounded-full"></div>

      {/* Futuristic particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400/40 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 left-2/3 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1 h-1 bg-amber-300/40 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/2 w-1 h-1 bg-yellow-300/40 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/3 w-1 h-1 bg-amber-200/40 rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Ultra-modern 3D progress bar */}
      <div className="h-3 bg-amber-100 w-full overflow-hidden relative">
        <div
          className="h-full bg-amber-500 transition-all duration-700 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer"></div>
        </div>
      </div>

      {/* Futuristic step indicator */}
      <div className="py-4 px-6 text-sm text-amber-800 font-medium flex justify-between items-center border-b-2 border-amber-300 bg-amber-50">
        <span className="tracking-wide font-medium">
          {currentStep < 7 ? `Question ${currentStep + 1} of 7` : "Final Step"}
        </span>
        <div className="flex space-x-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`relative transition-all duration-500 ${i === currentStep ? "scale-125" : ""}`}>
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 border ${
                  i === currentStep
                    ? "bg-amber-500 border-amber-600"
                    : i < currentStep
                      ? "bg-amber-400 border-amber-500"
                      : "bg-white border-amber-300"
                }`}
              ></div>
              {i === currentStep && <div className="absolute inset-0 bg-amber-400/50 rounded-full animate-ping"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content - Ultra-modern with sophisticated transitions */}
      <div className="p-6 md:p-8 flex flex-col transition-all duration-700 ease-in-out">
        <div className={`flex-1 transition-all duration-500 ease-out ${getTransitionClasses()}`}>
          {/* Contact Information - Now first */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Request Demo
                </h3>
                <p className="text-slate-600/90 mt-2 font-light">
                  Fill in your details to see how our AI Call Center works
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* First Name Field - Simplified */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full h-12 px-4 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white text-slate-800 text-base"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* Email Field - Simplified */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full h-12 px-4 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white text-slate-800 text-base"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone Field - Simplified */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full h-12 px-4 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white text-slate-800 text-base"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Terms Checkbox - Simplified */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleChange("agreeToTerms", checked === true)}
                      className="h-5 w-5 mt-1 text-amber-600 rounded-sm border-2 border-amber-400 focus:ring-amber-500"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm font-medium text-slate-700 cursor-pointer">
                      I agree to receive communication from Solar Boss Voice regarding my demo request and related
                      services.
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-sm mt-2">{errors.agreeToTerms}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Question 1: User Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                What best describes you right now?
              </h3>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {["Agency Owner", "Solar Dealer", "Solar Rep"].map((option) => (
                  <div
                    key={option}
                    className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      formData.userType === option
                        ? "bg-amber-100 shadow-md border-2 border-amber-400"
                        : "bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 hover:shadow-md"
                    }`}
                    onClick={() => handleChange("userType", option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          formData.userType === option
                            ? "bg-amber-500 border-2 border-amber-600"
                            : "border-2 border-amber-300 bg-white"
                        }`}
                      >
                        {formData.userType === option && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span
                        className={`ml-3 font-medium transition-all duration-300 ${
                          formData.userType === option ? "text-amber-700" : "text-slate-600/90"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {formData.userType === option && (
                      <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-pulse-slow pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>

              {errors.userType && (
                <p className="text-red-400 text-xs flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.userType}
                </p>
              )}
            </div>
          )}

          {/* Question 2: Demo Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                What are you hoping to get out of this demo?
              </h3>

              <div
                className="relative group"
                onMouseEnter={() => setIsHovered("demoGoals")}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/0 to-yellow-400/0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:from-amber-400/5 group-hover:to-yellow-400/5 transition-all duration-500 pointer-events-none"></div>
                <Textarea
                  value={formData.demoGoals}
                  onChange={(e) => handleChange("demoGoals", e.target.value)}
                  onFocus={() => setIsFocused("demoGoals")}
                  onBlur={() => setIsFocused(null)}
                  placeholder="Tell us your specific goals or challenges..."
                  className="min-h-[150px] border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white resize-none rounded-xl placeholder:text-slate-500 transition-all duration-300 p-4 relative z-10 text-slate-800"
                />
                {errors.demoGoals && (
                  <p className="text-red-400 text-xs mt-2 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.demoGoals}
                  </p>
                )}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500 rounded-b-xl ${
                    isFocused === "demoGoals" ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
              </div>
            </div>
          )}

          {/* Question 3: Current Income */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                What do you currently make per month?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {[
                  "$0 - $5,000",
                  "$5,000 - $10,000",
                  "$10,000 - $20,000",
                  "$20,000 - $50,000",
                  "$50,000 - $100,000",
                  "$100,000+",
                ].map((option) => (
                  <div
                    key={option}
                    className={`relative p-3 rounded-xl cursor-pointer transition-all duration-500 transform-gpu hover:translate-z-6 hover:scale-[1.02] ${
                      formData.currentIncome === option
                        ? "bg-gradient-to-br from-white/40 to-white/10 shadow-[0_10px_30px_rgba(251,191,36,0.12)] border border-white/40 translate-z-4"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 hover:shadow-lg"
                    }`}
                    onClick={() => handleChange("currentIncome", option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.currentIncome === option
                            ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            : "border-2 border-white/40"
                        }`}
                      >
                        {formData.currentIncome === option && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span
                        className={`ml-2 font-medium text-sm transition-all duration-300 ${
                          formData.currentIncome === option ? "text-amber-700" : "text-slate-600/90"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {formData.currentIncome === option && (
                      <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-pulse-slow pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>

              {errors.currentIncome && (
                <p className="text-red-400 text-xs flex items-center mt-2">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.currentIncome}
                </p>
              )}
            </div>
          )}

          {/* Question 4: Revenue Goal */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                What's your monthly revenue goal?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {[
                  "$0 - $5,000",
                  "$5,000 - $10,000",
                  "$10,000 - $20,000",
                  "$20,000 - $50,000",
                  "$50,000 - $100,000",
                  "Other",
                ].map((option) => (
                  <div
                    key={option}
                    className={`relative p-3 rounded-xl cursor-pointer transition-all duration-500 transform-gpu hover:translate-z-6 hover:scale-[1.02] ${
                      formData.revenueGoal === option
                        ? "bg-gradient-to-br from-white/40 to-white/10 shadow-[0_10px_30px_rgba(251,191,36,0.12)] border border-white/40 translate-z-4"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 hover:shadow-lg"
                    }`}
                    onClick={() => handleChange("revenueGoal", option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.revenueGoal === option
                            ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            : "border-2 border-white/40"
                        }`}
                      >
                        {formData.revenueGoal === option && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span
                        className={`ml-2 font-medium text-sm transition-all duration-300 ${
                          formData.revenueGoal === option ? "text-amber-700" : "text-slate-600/90"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {formData.revenueGoal === option && (
                      <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-pulse-slow pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>

              {showCustomRevenue && (
                <div className="mt-4 p-5 rounded-xl bg-white/20 border border-white/30 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
                  <Label
                    htmlFor="customRevenueGoal"
                    className={`text-sm font-medium transition-all duration-300 ${
                      isFocused === "customRevenueGoal" || formData.customRevenueGoal
                        ? "text-amber-500"
                        : "text-slate-500/90"
                    }`}
                  >
                    Please specify your revenue goal
                  </Label>
                  <div
                    className="relative mt-2 group"
                    onMouseEnter={() => setIsHovered("customRevenueGoal")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <Input
                      id="customRevenueGoal"
                      value={formData.customRevenueGoal}
                      onChange={(e) => handleChange("customRevenueGoal", e.target.value)}
                      onFocus={() => setIsFocused("customRevenueGoal")}
                      onBlur={() => setIsFocused(null)}
                      placeholder="Enter your custom revenue goal"
                      className="border-0 border-b border-white/30 rounded-none px-0 py-2 focus:border-amber-400 focus:ring-0 bg-transparent placeholder:text-slate-400/50 transition-all duration-300 group-hover:border-white/50 text-slate-700"
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500 ${
                        isFocused === "customRevenueGoal"
                          ? "w-full opacity-100 transform-gpu translate-z-2"
                          : "w-0 opacity-0"
                      }`}
                    ></div>
                  </div>
                  {errors.customRevenueGoal && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {errors.customRevenueGoal}
                    </p>
                  )}
                </div>
              )}

              {errors.revenueGoal && (
                <p className="text-red-400 text-xs flex items-center mt-2">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.revenueGoal}
                </p>
              )}
            </div>
          )}

          {/* Question 5: Obstacles */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                What do you think has prevented you from reaching that goal?
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {[
                  "Lack of consistent lead generation",
                  "High cost of sales staff",
                  "Difficulty following up with leads",
                  "Inconsistent sales processes",
                  "Limited working hours (not 24/7)",
                  "Other",
                ].map((option) => (
                  <div
                    key={option}
                    className={`relative p-3 rounded-xl cursor-pointer transition-all duration-500 transform-gpu hover:translate-z-6 hover:scale-[1.02] ${
                      formData.selectedObstacle === option
                        ? "bg-gradient-to-br from-white/40 to-white/10 shadow-[0_10px_30px_rgba(251,191,36,0.12)] border border-white/40 translate-z-4"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 hover:shadow-lg"
                    }`}
                    onClick={() => handleChange("selectedObstacle", option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.selectedObstacle === option
                            ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            : "border-2 border-white/40"
                        }`}
                      >
                        {formData.selectedObstacle === option && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span
                        className={`ml-2 font-medium text-sm transition-all duration-300 ${
                          formData.selectedObstacle === option ? "text-amber-700" : "text-slate-600/90"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {formData.selectedObstacle === option && (
                      <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-pulse-slow pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>

              {showCustomObstacle && (
                <div className="mt-4 p-5 rounded-xl bg-white/20 border border-white/30 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
                  <Label
                    htmlFor="obstacles"
                    className={`text-sm font-medium transition-all duration-300 ${
                      isFocused === "obstacles" || formData.obstacles ? "text-amber-500" : "text-slate-500/90"
                    }`}
                  >
                    Please specify your obstacles
                  </Label>
                  <div
                    className="relative mt-2 group"
                    onMouseEnter={() => setIsHovered("obstacles")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <Textarea
                      id="obstacles"
                      value={formData.obstacles}
                      onChange={(e) => handleChange("obstacles", e.target.value)}
                      onFocus={() => setIsFocused("obstacles")}
                      onBlur={() => setIsFocused(null)}
                      placeholder="Please describe what has prevented you from reaching your goals..."
                      className="min-h-[100px] border border-white/30 focus:border-amber-400 focus:ring-0 bg-white/10 resize-none rounded-xl placeholder:text-slate-400/50 transition-all duration-300 p-4 group-hover:border-white/50 text-slate-700"
                    />
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500 rounded-b-xl ${
                        isFocused === "obstacles" ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                  </div>
                  {errors.obstacles && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {errors.obstacles}
                    </p>
                  )}
                </div>
              )}

              {errors.selectedObstacle && (
                <p className="text-red-400 text-xs flex items-center mt-2">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.selectedObstacle}
                </p>
              )}
            </div>
          )}

          {/* Question 6: Ready to Act */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-center">
                If the system works as promised, are you ready to take action?
              </h3>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  "Yes, immediately",
                  "Yes, within 30 days",
                  "Maybe, I need more information",
                  "No, I'm just researching",
                ].map((option) => (
                  <div
                    key={option}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-500 transform-gpu hover:translate-z-6 hover:scale-[1.02] ${
                      formData.readyToAct === option
                        ? "bg-gradient-to-br from-white/40 to-white/10 shadow-[0_10px_30px_rgba(251,191,36,0.12)] border border-white/40 translate-z-4"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 hover:shadow-lg"
                    }`}
                    onClick={() => handleChange("readyToAct", option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.readyToAct === option
                            ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            : "border-2 border-white/40"
                        }`}
                      >
                        {formData.readyToAct === option && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span
                        className={`ml-3 font-medium transition-all duration-300 ${
                          formData.readyToAct === option ? "text-amber-700" : "text-slate-600/90"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                    {formData.readyToAct === option && (
                      <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-pulse-slow pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>

              {errors.readyToAct && (
                <p className="text-red-400 text-xs flex items-center mt-2">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {errors.readyToAct}
                </p>
              )}
            </div>
          )}

          {/* Success/Confirmation Screen */}
          {currentStep === 7 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
              <div className="flex flex-col justify-center items-center md:items-start space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] relative overflow-hidden transform-gpu translate-z-8 hover:translate-z-12 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent animate-pulse"></div>
                  <Calendar className="h-10 w-10 text-amber-500 transform-gpu translate-z-4" />
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                    Congratulations!
                  </h3>
                  <p className="text-xl font-medium text-amber-700 mt-1">Your Demo is Being Scheduled</p>
                  <p className="text-slate-600/90 mt-2 max-w-md">
                    One of our specialists will be in touch with you shortly to confirm your demonstration time.
                  </p>
                </div>

                <div className="mt-4">
                  <a
                    href="https://www.youtube.com/watch?v=jRDADJ287fc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-amber-600 hover:bg-white/30 transition-all duration-300 border border-white/40 shadow-lg group backdrop-blur-sm"
                  >
                    <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Watch our AI in action while you wait</span>
                  </a>
                </div>
              </div>

              <div className="bg-white/20 p-5 rounded-xl border border-white/30 shadow-lg backdrop-blur-md">
                <h4 className="font-semibold text-amber-700 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  What to expect next:
                </h4>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center shadow-md">
                      <Check className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <span className="text-slate-700 ml-3">You'll receive an email confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center shadow-md">
                      <Check className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <span className="text-slate-700 ml-3">Our team will call you to schedule your demo</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center shadow-md">
                      <Check className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <span className="text-slate-700 ml-3">Prepare your questions for the demo session</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Futuristic styling */}
        <div className="mt-4 flex justify-between">
          {currentStep > 0 && currentStep < 7 && (
            <Button
              type="button"
              onClick={handlePrevious}
              variant="outline"
              className="text-amber-500 border-white/30 hover:bg-white/10 hover:text-amber-400 rounded-full px-5 shadow-md transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {currentStep === 0 && (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-amber-400/30 group relative overflow-hidden border-2 border-amber-400"
            >
              Continue to Qualification Questions
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {currentStep > 0 && currentStep < 6 && (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto h-14 px-8 text-lg font-medium rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 transition-all duration-500 shadow-xl hover:shadow-amber-400/50 group relative overflow-hidden transform-gpu hover:translate-z-4 hover:scale-[1.03]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              Continue
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {currentStep === 6 && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto h-12 px-6 text-base font-medium rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 transition-all duration-500 shadow-lg hover:shadow-amber-400/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}

          {currentStep === 7 && (
            <Button
              type="button"
              onClick={() => router.push("/")}
              className="mx-auto h-12 px-8 text-base font-medium rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 transition-all duration-500 shadow-lg hover:shadow-amber-400/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              <Sparkles className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
