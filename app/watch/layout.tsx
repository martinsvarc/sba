import type React from "react"
export default function WatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Initialize _wq globally */}
      <script dangerouslySetInnerHTML={{ __html: `window._wq = window._wq || [];` }} />
      {children}
    </>
  )
}
