"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface AutoFillInputProps {
  id: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  autoComplete: string
  className?: string
  style?: React.CSSProperties
  onAutoFill?: (value: string) => void
}

export default function AutoFillInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  className,
  style,
  onAutoFill,
}: AutoFillInputProps) {
  const [hasAutoFilled, setHasAutoFilled] = useState(false)

  useEffect(() => {
    // Check if the input was auto-filled by the browser
    const input = document.getElementById(id) as HTMLInputElement
    if (input) {
      // Check for autofill after a short delay
      const checkAutoFill = () => {
        if (input.value && input.value !== value && !hasAutoFilled) {
          setHasAutoFilled(true)
          if (onAutoFill) {
            onAutoFill(input.value)
          }
          // Trigger the onChange event to update the form state
          const event = new Event("input", { bubbles: true })
          input.dispatchEvent(event)
        }
      }

      // Check multiple times as autofill can happen at different moments
      setTimeout(checkAutoFill, 100)
      setTimeout(checkAutoFill, 500)
      setTimeout(checkAutoFill, 1000)

      // Listen for input events that might indicate autofill
      const handleInput = () => {
        if (input.value && !hasAutoFilled) {
          setHasAutoFilled(true)
          if (onAutoFill) {
            onAutoFill(input.value)
          }
        }
      }

      input.addEventListener("input", handleInput)
      input.addEventListener("change", handleInput)

      return () => {
        input.removeEventListener("input", handleInput)
        input.removeEventListener("change", handleInput)
      }
    }
  }, [id, value, hasAutoFilled, onAutoFill])

  return (
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={className}
      style={style}
      // These attributes help browsers understand what data to autofill
      data-lpignore="false"
      data-form-type="other"
    />
  )
}
