import { Suspense } from "react"
import HomepageVariant1 from "../components/homepage-variant-1"
import LandingPageVariantTracker from "../components/landing-page-variant-tracker"

export default function VariantAPage() {
  return (
    <>
      <LandingPageVariantTracker />
      <Suspense fallback={<div>Loading...</div>}>
        <HomepageVariant1 />
      </Suspense>
    </>
  )
}
