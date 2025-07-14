"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface ForcedVideoPlayerProps {
  videoId: string
  onVideoComplete: () => void
  autoStart?: boolean
}

export default function ForcedVideoPlayer({ videoId, onVideoComplete, autoStart = false }: ForcedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoStart)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)

  // Load YouTube API
  useEffect(() => {
    // Load the YouTube API script
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    }

    return () => {
      window.onYouTubeIframeAPIReady = null
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId])

  const onPlayerReady = (event: any) => {
    setIsLoaded(true)
    setDuration(event.target.getDuration())
    if (autoStart) {
      event.target.playVideo()
    }
  }

  const onPlayerStateChange = (event: any) => {
    // Update playing state
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING)

    // Check if video ended
    if (event.data === window.YT.PlayerState.ENDED) {
      onVideoComplete()
    }

    // Start progress tracking when playing
    if (event.data === window.YT.PlayerState.PLAYING) {
      startProgressTracking()
    } else {
      stopProgressTracking()
    }
  }

  // Track video progress
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const startProgressTracking = () => {
    if (progressInterval.current) return

    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        setCurrentTime(currentTime)
        setProgress((currentTime / duration) * 100)
      }
    }, 1000)
  }

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  // Player controls
  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const toggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* YouTube iframe */}
      <div className="absolute inset-0">
        <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-3">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </div>
  )
}
