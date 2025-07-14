import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Reviews | Solar Boss Voice",
  description:
    "Real reviews from solar professionals who transformed their business with Solar Boss Voice AI automation. See how our partners increased leads by 340% in 60 days.",
  keywords: "solar reviews, customer reviews, solar automation reviews, solar lead generation reviews",
  openGraph: {
    title: "Customer Reviews | Solar Boss Voice",
    description:
      "Real reviews from solar professionals who transformed their business with Solar Boss Voice AI automation.",
    type: "website",
  },
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
