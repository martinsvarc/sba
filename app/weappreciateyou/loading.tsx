import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-custom-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#C7A052] mx-auto mb-4" />
        <h2 className="text-xl text-white font-medium">Loading...</h2>
      </div>
    </div>
  )
}
