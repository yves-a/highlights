'use client'
import NBAScoreboard from './requests'
import HighlightPlayer from './HighlightPlayer'
import { Search, Menu, X, Bell, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [news, setNews] = useState([])
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  useEffect(() => {
    async function fetchNews() {
      const response = await fetch('/api/fetchNews')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const fetchedData = await response.json()
      console.log(fetchedData.formattedData)
      setNews(fetchedData.formattedData)
    }
    fetchNews()
  }, [])
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header/Navigation */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="font-bold text-2xl">NBA Tracker</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-blue-200 font-medium">
                Home
              </a>
              <a href="#" className="hover:text-blue-200 font-medium">
                Games
              </a>
              <a href="#" className="hover:text-blue-200 font-medium">
                Teams
              </a>
              <a href="#" className="hover:text-blue-200 font-medium">
                Players
              </a>
              <a href="#" className="hover:text-blue-200 font-medium">
                News
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-blue-800 text-white placeholder-blue-300 rounded-full py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute right-3 top-1.5 h-4 w-4 text-blue-300" />
              </div>
              <button className="p-1 rounded-full hover:bg-blue-600">
                <Bell size={20} />
              </button>
              <button className="p-1 rounded-full hover:bg-blue-600">
                <User size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1 rounded-md hover:bg-blue-600"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-blue-900 bg-opacity-95 md:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-200"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col items-center space-y-6 mt-16 text-white text-xl">
            <a href="#" className="hover:text-blue-200 font-medium">
              Home
            </a>
            <a href="#" className="hover:text-blue-200 font-medium">
              Games
            </a>
            <a href="#" className="hover:text-blue-200 font-medium">
              Teams
            </a>
            <a href="#" className="hover:text-blue-200 font-medium">
              Players
            </a>
            <a href="#" className="hover:text-blue-200 font-medium">
              News
            </a>
            <div className="relative mt-4 w-4/5">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-blue-800 text-white placeholder-blue-300 rounded-full py-2 px-4 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-300" />
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg text-white p-6 mb-8">
            <h1 className="text-3xl font-bold mb-2">NBA Live Tracker</h1>
            <p className="text-blue-100 mb-4">
              Stay updated with live scores and highlights from around the
              league
            </p>

            {/* Button */}
            <button className="inline-block bg-white text-blue-700 font-bold py-2 px-6 rounded-full shadow hover:bg-blue-100 transition">
              Watch Live
            </button>
          </div>

          {/* Scores Section - Now using the integrated NBAScoreboard component */}
          <section className="mb-8">
            <NBAScoreboard />
          </section>

          {/* Highlights Section - Now using the HighlightPlayer component */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Highlights
              </h2>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                More highlights
              </a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              {/* HighlightPlayer component integrated here */}
              <HighlightPlayer />
            </div>
          </section>

          {/* Content Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.length &&
                news.map(
                  (item: {
                    title: string
                    description: string
                    time: string
                    link: string
                    image: string
                  }) => (
                    <div
                      key={item.title}
                      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative h-40">
                        <Image
                          src={item.image}
                          alt={item.title}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm flex-grow">
                          {item.description}
                        </p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {item.time}
                          </span>
                          <a
                            href={item.link}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Read more
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NBA Tracker</h3>
              <p className="text-gray-400 text-sm">
                Your ultimate source for live NBA scores, highlights, and news.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Games
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Teams
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Players
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Teams</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Eastern Conference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Western Conference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Team Stats
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Standings
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  Subscribe to our newsletter
                </p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none w-full"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} NBA Tracker. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default Home
