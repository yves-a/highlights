/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// Add appropriate TypeScript declarations
declare global {
  interface Window {
    YT: {
      Player: any
      PlayerState: {
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const HighlightPlayer = () => {
  const playerRef = useRef(null)
  const [player, setPlayer] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoIds, setVideoIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const playNextVideo = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoIds.length)
  }, [videoIds.length])

  useEffect(() => {
    const fetchVideoIds = async () => {
      setIsLoading(true)
      const response = await fetch('/api/fetchVideoIds')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const fetchedData = await response.json()
      setVideoIds(fetchedData)
      setIsLoading(false)
    }
    fetchVideoIds()
  }, [])

  useEffect(() => {
    if (!videoIds.length) return

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    } else {
      initializePlayer()
    }

    window.onYouTubeIframeAPIReady = initializePlayer

    function initializePlayer() {
      if (!playerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '360',
        width: '640',
        videoId: videoIds[0], // Load the first video initially
        events: {
          onReady: (event: { target: React.SetStateAction<null> }) => {
            setPlayer(event.target)
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNextVideo()
            }
          },
        },
      })
    }
  }, [playNextVideo, videoIds])

  useEffect(() => {
    if (player && videoIds.length && currentIndex < videoIds.length) {
      ;(player as any).loadVideoById(videoIds[currentIndex])
      ;(player as any).playVideo() // Ensure the video plays automatically
    }
  }, [currentIndex, player, videoIds])

  const playPrevVideo = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? videoIds.length - 1 : prevIndex - 1
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-black w-full">
        <div ref={playerRef} className="aspect-video w-full"></div>
      </div>

      {videoIds.length > 1 && (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={playPrevVideo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Previous
          </button>
          <button
            onClick={playNextVideo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default HighlightPlayer
