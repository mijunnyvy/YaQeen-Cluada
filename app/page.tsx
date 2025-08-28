"use client"

import { useState, useEffect } from "react"
import { ArrowRight, BookOpen, Compass, Target, MapPin, Calendar, Clock, Book, Heart, Star, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import PrayerTimesSummary from "../components/PrayerTimesSummary"
import DailyAdkarWidget from "../components/DailyAdkarWidget"
import DailyNameWidget from "../components/DailyNameWidget"
import ChatWidget from "../components/ChatWidget"

// Define the type for our floating balls
type FloatingBall = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

const YaQeenIslamicWebsite = () => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)

  const typewriterTexts = [
    "The Holy Quran",
    "Prophetic Traditions",
    "Supplication and Remembrance",
    "Islamic Sciences",
    "Guidance and Light",
    "Tranquility and Faith"
  ]

  // Floating balls state with proper typing
  const [balls, setBalls] = useState<FloatingBall[]>([])

  // Initialize floating balls
  useEffect(() => {
    const initialBalls: FloatingBall[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.6 + 0.2,
    }))
    setBalls(initialBalls)
  }, [])

  // Animate floating balls
  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => ({
          ...ball,
          x: (ball.x + ball.vx + 100) % 100,
          y: (ball.y + ball.vy + 100) % 100,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = typewriterTexts[currentTextIndex]

    if (isTyping) {
      if (currentText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        }, 150)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 75)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length)
          setIsTyping(true)
        }, 500)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentText, isTyping, currentTextIndex])

  // Cursor blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = async () => {
    setIsNavigating(true)
    // Add a small delay for the animation effect
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Navigate to auth page
    window.location.href = '/auth'
    setIsNavigating(false)
  }



  const themeClasses = mounted
    ? {
        background:
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
            : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
        text: theme === "dark" ? "text-white" : "text-gray-900",
        subtitle: theme === "dark" ? "text-gray-300" : "text-gray-600",
        accent: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
        button:
          theme === "dark"
            ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25"
            : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30",
        toggle:
          theme === "dark"
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-gray-200 border-gray-300 text-gray-900",
        grid: theme === "dark" ? "opacity-10" : "opacity-5",
        ball: theme === "dark" ? "bg-emerald-500" : "bg-emerald-400",
      }
    : {
        // Default to light theme classes for initial server render
        background: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
        text: "text-gray-900",
        subtitle: "text-gray-600",
        accent: "text-emerald-600",
        button:
          "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30",
        toggle: "bg-gray-200 border-gray-300 text-gray-900",
        grid: "opacity-5",
        ball: "bg-emerald-400",
      }

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 ease-in-out ${themeClasses.background}`}
    >
      {/* Animated Grid Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${themeClasses.grid}`}
        style={{
          backgroundImage: `
            linear-gradient(
              ${mounted && theme === "dark" ? "#10b981" : "#34d399"} 1px, transparent 1px
            ),
            linear-gradient(
              90deg, ${mounted && theme === "dark" ? "#10b981" : "#34d399"} 1px, transparent 1px
            )
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Balls */}
      {balls.map((ball) => (
        <div
          key={ball.id}
          className={`absolute rounded-full ${themeClasses.ball} transition-colors duration-700 animate-pulse`}
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            opacity: ball.opacity,
            filter: "blur(0.5px)",
            boxShadow:
              mounted && theme === "dark"
                ? "0 0 20px rgba(16, 185, 129, 0.3)"
                : "0 0 20px rgba(52, 211, 153, 0.3)",
          }}
        />
      ))}

      {/* Islamic Symbol in Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <div className={`text-3xl ${themeClasses.accent} transition-colors duration-700 font-bold`}>
          ☪
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1
            className={`text-6xl md:text-8xl font-bold mb-6 ${themeClasses.text} transition-colors duration-700 tracking-tight`}
          >
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              YaQ
            </span>
            <span className={themeClasses.text}>een</span>
          </h1>

          {/* Subtitle */}
          <div className="mb-4">
            <span className={`text-2xl font-bold ${themeClasses.accent}`}>
              Certainty
            </span>
          </div>

          {/* Animated Text with Typewriter */}
          <div className="mb-8 h-8">
            <span className={`text-xl font-medium ${themeClasses.subtitle} mr-2`}>Explore</span>
            <span className={`text-xl font-bold ${themeClasses.accent}`}>
              {currentText}
              <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}>|</span>
            </span>
          </div>

          {/* Description */}
          <p
            className={`text-lg md:text-xl mb-12 ${themeClasses.subtitle} transition-colors duration-700 max-w-3xl mx-auto leading-relaxed`}
          >
            A comprehensive Islamic platform that combines religious sciences with modern technology to bring Islamic knowledge closer and facilitate access to it
          </p>

          {/* CTA Button */}
          <div className="space-y-6">
            <button
              onClick={handleGetStarted}
              disabled={isNavigating}
              className={`group relative px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${themeClasses.button} focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                isNavigating ? "scale-95 opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{isNavigating ? "Loading..." : "Get Started"}</span>
                <ArrowRight
                  className={`w-5 h-5 transition-all duration-300 ${
                    isNavigating ? "translate-x-2 opacity-50" : "group-hover:translate-x-1"
                  }`}
                  style={{ transform: isNavigating ? 'translateX(8px)' : undefined }}
                />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />

              {/* Loading spinner overlay */}
              {isNavigating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-4 justify-center items-center">
              <Link
                href="/quran"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Holy Quran</span>
              </Link>

              <Link
                href="/qibla"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                <span>Qibla Compass</span>
              </Link>

              <Link
                href="/tasbih"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Digital Tasbih</span>
              </Link>

              <Link
                href="/mosque-finder"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Mosque Finder</span>
              </Link>

              <Link
                href="/calendar"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Islamic Calendar</span>
              </Link>

              <Link
                href="/prayer-times"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Clock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Prayer Times</span>
              </Link>

              <Link
                href="/stories"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Book className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Islamic Stories</span>
              </Link>

              <Link
                href="/adkar"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Daily Adkar</span>
              </Link>

              <Link
                href="/names"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <Star className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>99 Names</span>
              </Link>

              <Link
                href="/chat"
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  mounted && theme === "dark"
                    ? "bg-gray-800/60 hover:bg-gray-700/80 text-white border border-gray-700"
                    : "bg-white/80 hover:bg-white text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>AI Assistant</span>
              </Link>
            </div>
          </div>

          {/* Islamic Widgets */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                Your Islamic Dashboard
              </h2>
              <p className={`${themeClasses.subtitle}`}>
                Stay connected with your daily Islamic practices
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <PrayerTimesSummary isDark={mounted && theme === "dark"} />
              <DailyAdkarWidget isDark={mounted && theme === "dark"} />
              <DailyNameWidget isDark={mounted && theme === "dark"} />
              <ChatWidget isDark={mounted && theme === "dark"} />
            </div>
          </div>

          {/* Islamic Quote */}
          <div className="mt-16 pt-8 border-t border-gray-500/20">
            <div className="text-center">
              <p className={`text-sm ${themeClasses.subtitle} opacity-75`}>
                "And say: My Lord, increase me in knowledge" - Quran 20:114
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effects */}
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-64 ${mounted && theme === "dark" ? "bg-emerald-500" : "bg-emerald-400"} rounded-full opacity-10 blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${mounted && theme === "dark" ? "bg-teal-500" : "bg-teal-400"} rounded-full opacity-5 blur-3xl animate-pulse`}
        />
    </div>
  )
}

export default YaQeenIslamicWebsite