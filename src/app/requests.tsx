/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

// Scoreboard component - integrated directly into the page
const NBAScoreboard = () => {
  const [data, setData] = useState<any[]>([]) // Add type annotation to the data state
  const [error, setError] = useState<Error | null>(null as Error | null) // Add type annotation to the error state
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleFetchData = async (isInitialLoad = false) => {
    try {
      if (!isInitialLoad) {
        setRefreshing(true)
      }
      const response = await fetch('/api/fetchData')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const fetchedData = await response.json()
      setData(fetchedData)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handlePushData = async () => {
    // try {
    //   await exportDataToDB()
    //   // Optional: Show success message using a more subtle approach
    //   const successElement = document.getElementById('success-message')
    //   if (successElement) {
    //     successElement.classList.remove('hidden')
    //     setTimeout(() => {
    //       successElement.classList.add('hidden')
    //     }, 3000)
    //   }
    // } catch (error) {
    //   setError(error as Error)
    // }
    // const response = await fetch('/api/routineFetch')
  }

  // Auto-fetch data when component mounts
  useEffect(() => {
    handleFetchData(true)

    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      handleFetchData()
    }, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Today&apos;s Games</h2>
        <div className="flex items-center space-x-2">
          {refreshing && (
            <span className="text-gray-500 text-sm">Refreshing...</span>
          )}
          <button
            onClick={handlePushData}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
          >
            Push to DB
          </button>
        </div>
      </div>

      <div
        id="success-message"
        className="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm"
      >
        Successfully pushed data to database
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No games available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((event, index) => (
              <div
                key={index}
                className="border rounded-md hover:shadow-md transition p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={event.home_logo}
                      alt={`${event.home_team} logo`}
                      width={30}
                      height={30}
                    />
                    <span className="font-medium">{event.home_team}</span>
                  </div>
                  <span className="font-bold text-lg">{event.home_score}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={event.away_logo}
                      alt={`${event.away_team} logo`}
                      width={30}
                      height={30}
                    />
                    <span className="font-medium">{event.away_team}</span>
                  </div>
                  <span className="font-bold text-lg">{event.away_score}</span>
                </div>

                <a
                  href={event.highlight_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded inline-block w-full text-center transition"
                >
                  Watch Highlights
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default NBAScoreboard
