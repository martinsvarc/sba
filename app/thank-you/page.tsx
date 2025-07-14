"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { Play, X, Calendar, AlertTriangle, ChevronRight, Youtube } from "lucide-react"
import Image from "next/image"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const firstName = searchParams.get("firstName") || "Valued Customer"
  const lastName = searchParams.get("lastName") || ""
  const email = searchParams.get("email") || "user@example.com"
  const phone = searchParams.get("phone") || ""

  const [isLoaded, setIsLoaded] = useState(false)
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [videoStarted, setVideoStarted] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [introVideoPlaying, setIntroVideoPlaying] = useState(false)

  // Google Drive video ID
  const googleDriveVideoId = "19LWsIgMqM-0KBurTFcBRx3xBt8N0gDEi"

  // Intro video ID (YouTube)
  const introVideoId = "4kf9i-eXLiY" // Using the first video ID as a placeholder - replace with actual intro video ID

  // Video placeholders - replace with your actual videos
  const videos = [
    {
      id: 1,
      title: "The Solar Boom Is Here",
      description: "Uncover the hidden potential of the booming solar industry",
      thumbnail: "https://img.youtube.com/vi/4kf9i-eXLiY/maxresdefault.jpg",
      videoId: "4kf9i-eXLiY",
      isYouTube: true,
    },
    {
      id: 2,
      title: "Math Breakdown",
      description: "Math Breakdown of A Million Dollar Remote Solar Business",
      thumbnail: "https://img.youtube.com/vi/V0NSkJv4bb0/maxresdefault.jpg",
      videoId: "V0NSkJv4bb0",
      isYouTube: true,
    },
    {
      id: 3,
      title: "AI in action",
      description: "AI Setter turns a Cold Lead into an Appointment",
      thumbnail: "https://img.youtube.com/vi/V8X84pG-tlM/maxresdefault.jpg",
      videoId: "V8X84pG-tlM",
      isYouTube: true,
    },
    {
      id: 4,
      title: "LIVE Solar Deal Closed Over the Phone",
      description: "Breakdown of A LIVE Solar Deal Closed Over the Phone",
      thumbnail: "https://img.youtube.com/vi/vN9pcLyYYOw/maxresdefault.jpg",
      videoId: "vN9pcLyYYOw",
      isYouTube: true,
    },
  ]

  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [searchParams])

  // Handle video playback
  const handlePlayVideo = (videoId: number) => {
    setActiveVideo(videoId)
    setVideoStarted(true)

    // Only set isPlaying for non-YouTube videos
    const selectedVideo = videos.find((v) => v.id === videoId)
    if (selectedVideo && !selectedVideo.isYouTube) {
      setIsPlaying(true)
    }
  }

  // Handle intro video playback
  const toggleIntroVideo = () => {
    setIntroVideoPlaying(!introVideoPlaying)
  }

  // Handle video close
  const handleCloseVideo = () => {
    setActiveVideo(null)
    setVideoStarted(false)
    setVideoEnded(false)
    setCurrentTime(0)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Handle intro video close
  const handleCloseIntroVideo = () => {
    setIntroVideoPlaying(false)
  }

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration
      setCurrentTime(current)
      setProgress((current / duration) * 100)

      // Check if video ended
      if (current >= duration) {
        setVideoEnded(true)
        setIsPlaying(false)
      }
    }
  }

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle skip video
  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration - 1
    }
  }

  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Function to get YouTube thumbnail for a video
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-[#C7A052]/20 py-3 px-4 sm:px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-center">
          {/* Centered Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dmbzcxhjn/image/upload/Screenshot_2025-05-22_032040_k0neyx.png"
              alt="Solar Boss Logo"
              width={120}
              height={39}
              className="h-auto w-auto max-w-[120px]"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
        {/* Success Message */}
        <div className={`mb-10 text-center ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
          <div className="inline-block p-2 px-4 bg-[#C7A052]/20 rounded-full mb-4 border border-[#C7A052]/30">
            <span className="text-[#C7A052] font-medium">Your call is confirmed!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-[#C7A052]">Thank You</span> For Booking Your Call
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Please follow these important steps before our call to ensure you get the most value from our time together.
          </p>
        </div>

        {/* NEW: What's Next Video Card */}
        <div
          className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg mb-10 ${
            isLoaded ? "animate-slide-up" : "opacity-0"
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">What's going to be next now?</h2>
            <div className="aspect-video relative rounded-lg overflow-hidden border border-[#C7A052]/30">
              {!introVideoPlaying ? (
                <div className="relative w-full h-full">
                  <img
                    src={getYouTubeThumbnail(introVideoId) || "/placeholder.svg"}
                    alt="What's Next Video Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-all duration-300"
                    onClick={toggleIntroVideo}
                  >
                    <div className="h-20 w-20 rounded-full bg-[#C7A052] flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                      <Play className="h-10 w-10 text-black ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${introVideoId}?autoplay=1`}
                    title="What's Next Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button
                    className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
                    onClick={handleCloseIntroVideo}
                    aria-label="Close video"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Steps Container - Now in a vertical layout */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Step 1 */}
          <div
            className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C7A052]/20 flex items-center justify-center mr-3 text-[#C7A052] font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold">Accept Calendar Invite</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Check your email for the calendar invitation and make sure to accept it. Click "I know the sender" if
                prompted.
              </p>
              <div className="bg-black/50 p-4 rounded-lg border border-[#C7A052]/10 flex items-center">
                <Calendar className="h-6 w-6 text-[#C7A052] mr-3 flex-shrink-0" />
                <span className="text-sm">The invite contains all the details you need to join our call.</span>
              </div>
            </div>
            <div className="aspect-[16/9] sm:aspect-[21/9] relative">
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-zinc-900">
                <img
                  src="https://res.cloudinary.com/dmbzcxhjn/image/upload/N%C3%A1vrh_bez_n%C3%A1zvu_12_ehgqna.png"
                  alt="Calendar Screenshot"
                  className="max-w-full max-h-full object-contain shadow-lg rounded-lg border border-[#C7A052]/20"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C7A052]/20 flex items-center justify-center mr-3 text-[#C7A052] font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold">Cancellation Policy</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Please read our cancellation and no-show policy carefully. We take our scheduled calls seriously.
              </p>
              <div className="bg-black/50 p-4 rounded-lg border border-[#C7A052]/10">
                <div className="flex items-start mb-3">
                  <AlertTriangle className="h-5 w-5 text-[#C7A052] mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <span className="font-bold">Important:</span> If you need to reschedule, please do so more than 24
                    hours in advance.
                  </p>
                </div>
                <p className="text-sm text-gray-300">
                  We will charge a $197 fee to get back on our calendar if you miss the scheduled call without notice.
                  We've reserved this time specifically for you.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 - Videos to Watch */}
          <div
            className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C7A052]/20 flex items-center justify-center mr-3 text-[#C7A052] font-bold">
                  3
                </div>
                <h2 className="text-xl font-bold">Watch These Videos Before Our Call</h2>
              </div>
              <p className="text-gray-300 mb-6">
                To make the most of our time together, please watch these important videos that will prepare you for our
                discussion.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="group">
                    <div
                      className="relative aspect-video cursor-pointer rounded-lg overflow-hidden border border-[#C7A052]/30 mb-3"
                      onClick={() => handlePlayVideo(video.id)}
                    >
                      <img
                        src={
                          video.isYouTube ? getYouTubeThumbnail(video.videoId) : video.thumbnail || "/placeholder.svg"
                        }
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
                        <div className="h-16 w-16 rounded-full bg-[#C7A052] flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 text-black ml-1" />
                        </div>
                      </div>
                      {video.id === 1 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">THE SOLAR BOOM</span>
                        </div>
                      )}
                      {video.id === 2 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">MATH BREAKDOWN</span>
                        </div>
                      )}
                      {video.id === 3 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">AI IN ACTION</span>
                        </div>
                      )}
                      {video.id === 4 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">LIVE SOLAR DEAL</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                    <p className="text-gray-400 text-sm">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Channel Section */}
        <div
          className={`bg-zinc-900 border border-[#C7A052]/20 rounded-xl overflow-hidden shadow-lg mb-12 ${
            isLoaded ? "animate-slide-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.35s" }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Watch More Content About Remote Solar Sales and Lead Generation
            </h2>
            <div className="flex flex-col items-center">
              <a
                href="https://www.youtube.com/@TheSolarBoss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#C7A052] hover:bg-[#C7A052]/90 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 mb-4"
              >
                <Youtube className="h-6 w-6" />
                <span>Visit Our YouTube Channel</span>
              </a>
              <p className="text-gray-300 text-center max-w-2xl">
                Discover more valuable content about solar sales, lead generation strategies, and industry insights on
                our YouTube channel. Subscribe to stay updated with the latest videos and tips.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div
          className={`text-center mb-12 ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-xl font-medium mb-4">I'm looking forward to speaking with you soon!</p>
          <div className="inline-flex items-center text-[#C7A052] font-bold">
            <span>See you on our call</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {activeVideo !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl animate-scale-in">
            <button
              className="absolute -top-12 right-0 text-white hover:text-[#C7A052] transition-colors flex items-center"
              onClick={handleCloseVideo}
            >
              <span className="mr-2">Close</span>
              <X className="h-5 w-5" />
            </button>

            <div className="w-full rounded-lg overflow-hidden border border-[#C7A052]/20 bg-zinc-900">
              {/* Video Player */}
              <div className="aspect-video relative">
                {activeVideo !== null && videos.find((v) => v.id === activeVideo)?.isYouTube ? (
                  <div className="relative w-full h-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videos.find((v) => v.id === activeVideo)?.videoId}?autoplay=1`}
                      title={videos.find((v) => v.id === activeVideo)?.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button
                      className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
                      onClick={handleCloseVideo}
                      aria-label="Close video"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain bg-black"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setVideoEnded(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls={false}
                    playsInline
                  >
                    {/* Direct embed from Google Drive */}
                    <source
                      src={`https://drive.google.com/uc?export=download&id=${activeVideo !== null ? videos.find((v) => v.id === activeVideo)?.videoId : googleDriveVideoId}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* Play/Pause Overlay - Only show for non-YouTube videos */}
                {!isPlaying &&
                  !videoEnded &&
                  activeVideo !== null &&
                  !videos.find((v) => v.id === activeVideo)?.isYouTube && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                      onClick={togglePlayPause}
                    >
                      <div className="h-20 w-20 rounded-full bg-[#C7A052] flex items-center justify-center">
                        <Play className="h-10 w-10 text-black ml-1" />
                      </div>
                    </div>
                  )}

                {/* Video Ended Overlay - Only show for non-YouTube videos */}
                {videoEnded && activeVideo !== null && !videos.find((v) => v.id === activeVideo)?.isYouTube && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center">
                      <div className="text-5xl font-black text-white mb-6">
                        {videos.find((v) => v.id === activeVideo)?.title}
                      </div>
                      <button
                        className="px-6 py-3 bg-[#C7A052] text-black font-bold rounded-lg hover:bg-[#C7A052]/90 transition-colors"
                        onClick={handleCloseVideo}
                      >
                        Close Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-[#C7A052]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-[#C7A052] font-bold text-lg">SOLAR BOSS</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2025 Solar Boss Voice. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
