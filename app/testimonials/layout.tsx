import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Success Stories | Solar Boss Voice",
  description:
    "Real testimonials from solar professionals who transformed their business with Solar Boss Voice AI automation. See how our partners increased leads by 340% in 60 days.",
  keywords:
    "solar testimonials, customer success stories, solar automation results, solar lead generation testimonials",
  openGraph: {
    title: "Customer Success Stories | Solar Boss Voice",
    description:
      "Real testimonials from solar professionals who transformed their business with Solar Boss Voice AI automation.",
    type: "website",
  },
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
