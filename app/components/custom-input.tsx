"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  darkMode?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, darkMode = true, ...props }, ref) => {
    // Create a styled input element that maintains black background even with autofill
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden",
            darkMode ? "bg-[#0A0A0A] text-[#E7C078] border-[#E7C078]/30" : "",
            "shiny-input", // Add custom class for the shiny effect
            className,
          )}
          ref={ref}
          style={{
            backgroundColor: darkMode ? "#0A0A0A" : "",
            WebkitBoxShadow: darkMode ? "0 0 0 1000px #0A0A0A inset, 0 0 10px rgba(231, 192, 120, 0.2)" : "",
            WebkitTextFillColor: darkMode ? "#E7C078" : "",
            caretColor: darkMode ? "#E7C078" : "",
            backgroundImage: darkMode ? "linear-gradient(145deg, rgba(231, 192, 120, 0.05), rgba(0, 0, 0, 0), rgba(231, 192, 120, 0.05))" : "",
            boxShadow: darkMode ? "0 0 15px rgba(231, 192, 120, 0.1), inset 0 0 10px rgba(231, 192, 120, 0.05)" : "",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = darkMode ? "0 0 20px rgba(231, 192, 120, 0.2), inset 0 0 15px rgba(231, 192, 120, 0.1)" : "";
            e.currentTarget.style.borderColor = darkMode ? "rgba(231, 192, 120, 0.6)" : "";
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = darkMode ? "0 0 15px rgba(231, 192, 120, 0.1), inset 0 0 10px rgba(231, 192, 120, 0.05)" : "";
            e.currentTarget.style.borderColor = darkMode ? "rgba(231, 192, 120, 0.3)" : "";
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
        {/* This overlay div will be positioned behind the input but above the autofill background */}
        <div
          className="absolute inset-0 -z-10 rounded-md pointer-events-none"
          style={{ backgroundColor: darkMode ? "#0A0A0A" : "" }}
        />
      </div>\
      <style jsx global>{`
        .shiny-input 
          position: relative;

        .shiny-input::before 
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: shimmer 4s infinite;
          pointer-events: none;

        @keyframes shimmer 
          0% {
            transform: translateX(-100%) rotate(30deg);
          100% {
            transform: translateX(300%) rotate(30deg);
          }
}
      `}</style>
    )
  },
)
CustomInput.displayName = "CustomInput"

export { CustomInput }
