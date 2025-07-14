export default function TestimonialsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center max-w-6xl">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <section className="py-16 px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-3/4 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid Skeleton */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="w-3/4 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-2/3 h-6 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
            <div className="w-64 h-12 bg-gray-200 rounded-2xl mx-auto mb-4 animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
