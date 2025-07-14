"use client"

// app/components/simple-lead-form-v2.tsx
import type React from "react"
import { useState, useEffect } from "react"

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  ab_variant?: string
}

const SimpleLeadFormV2 = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Form submitted successfully!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        alert("Form submission failed.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form.")
    }
  }

  useEffect(() => {
    // Example useEffect hook (can be removed or modified)
    console.log("Component mounted")
    return () => {
      console.log("Component unmounted")
    }
  }, [])

  // Add this near the top of the component, after other useEffect hooks
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default SimpleLeadFormV2
