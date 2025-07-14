export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <header className="bg-black border-b border-gray-800 py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center max-w-6xl">
          <div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-3/4 h-12 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-700 rounded mx-auto mb-8 animate-pulse"></div>
        </div>
      </section>

      {/* Reviews Grid Skeleton */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
                <div className="aspect-video bg-gray-700 animate-pulse"></div>
                <div className="p-6">
                  <div className="w-3/4 h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-5/6 h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
