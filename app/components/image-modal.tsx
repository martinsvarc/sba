"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  altText: string
}

// Update the ImageModal component to match our futuristic black and gold design
export default function ImageModal({ isOpen, onClose, imageUrl, altText }: ImageModalProps) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="relative w-[95vw] h-[90vh] max-w-[1200px] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 z-10 bg-black/80 text-gold-400 rounded-full p-2 hover:bg-black hover:text-gold-300 transition-colors border border-gold-500/30"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="w-full h-full overflow-auto p-1 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-600/30 to-gold-400/30 rounded-lg blur-sm"></div>
          {/* Use a regular img tag for better control in the modal */}
          <img src={imageUrl || "/placeholder.svg"} alt={altText} className="w-full h-auto min-w-full relative" />
        </div>
      </div>
    </div>
  )
}
