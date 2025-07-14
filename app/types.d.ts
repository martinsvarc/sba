// Add YouTube iframe API types
interface YT {
  Player: any
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

interface Window {
  Calendly?: any
  calendlyPrefill?: {
    name?: string
    email?: string
    [key: string]: string | undefined
  }
  YT?: YT
  onYouTubeIframeAPIReady?: () => void
}
