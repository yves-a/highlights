/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { neon } from '@neondatabase/serverless'

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

  const getVideoIds = async () => {
    try {
      const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL || '')
      // Make a list of videoIds from the column highlight_link in the games table
      const videoIds = await sql`SELECT highlight_link FROM games`
      const ids = videoIds
        .map((videoId) => videoId.highlight_link?.split('=')[1])
        .filter(Boolean)
      return ids
    } catch (error) {
      console.error('Error fetching video IDs:', error)
      // Return some fallback video IDs in case of error
      return ['QYlGT4ssDT0', 'Dtj0qxN01Kw', 'O6NrmCLOJfM']
    }
  }
  const playNextVideo = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoIds.length)
  }, [videoIds.length])

  useEffect(() => {
    const fetchVideoIds = async () => {
      setIsLoading(true)
      const ids = await getVideoIds()
      setVideoIds(ids)
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
