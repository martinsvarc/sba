"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  ab_variant?: string
}

const SimpleLeadForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setSubmissionError(null)

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Form submitted successfully!")
        setFormData({ name: "", email: "", phone: "", message: "" }) // Reset form
      } else {
        const errorData = await response.json()
        setSubmissionError(errorData.message || "Failed to submit the form.")
        console.error("Form submission failed:", response.status, errorData)
      }
    } catch (error: any) {
      setSubmissionError("An unexpected error occurred.")
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitted(false)
    }
  }

  useEffect(() => {
    // Get the variant from cookie or localStorage
    const getVariant = () => {
      // Try to get from cookie first
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith("ab_variant=")) {
          return cookie.substring("ab_variant=".length)
        }
      }

      // If not in cookie, try localStorage
      const localVariant = localStorage.getItem("ab_variant")
      if (localVariant) {
        return localVariant
      }

      // If no variant is found, determine it from the URL path
      const path = window.location.pathname
      if (path === "/a" || path === "/1") {
        const variant = path.substring(1)
        // Store it in localStorage for future reference
        localStorage.setItem("ab_variant", variant)
        return variant
      }

      return null
    }

    // Set the variant in the form data
    const variant = getVariant()
    if (variant) {
      setFormData((prev) => ({
        ...prev,
        ab_variant: variant,
      }))
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      {submissionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{submissionError}</span>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Name"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Email"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
          Phone:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Phone"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
          Message:
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Message"
          rows={4}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isSubmitted}
        >
          {isSubmitted ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  )
}

export default SimpleLeadForm
