"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Volume2,
  Play,
  Pause,
  Download,
  Bookmark,
  Sun,
  Moon,
  ArrowLeft,
  Filter,
  Heart,
  Share,
  Eye,
  Headphones,
  Book,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Compass,
  Target,
  MapPin,
  Calendar,
  Clock,
  Book,
  Heart,
  Star,
  MessageCircle
} from "lucide-react"
import { getAllSurahsInfo, getSurahLengthCategory, type SurahInfo } from "@/lib/quranApi"

// Define the type for floating balls
type FloatingBall = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

// Use the Surah info from the API
const surahs: SurahInfo[] = getAllSurahsInfo()

const YaQeenQuranPage = () => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMode, setSelectedMode] = useState<'read' | 'listen' | 'study'>('read')
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all')
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<Set<number>>(new Set([1, 2, 18, 36, 55, 67]))

  useEffect(() => {
    setMounted(true)
    // Load theme preference
    const savedTheme = localStorage.getItem('theme')
    setIsDark(savedTheme === 'dark')
  }, [])

  // Floating balls state
  const [balls, setBalls] = useState<FloatingBall[]>([])

  // Initialize floating balls
  useEffect(() => {
    const initialBalls: FloatingBall[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 6 + 3,
      opacity: Math.random() * 0.3 + 0.1,
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

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const toggleBookmark = (surahNumber: number) => {
    setBookmarkedSurahs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(surahNumber)) {
        newSet.delete(surahNumber)
      } else {
        newSet.add(surahNumber)
      }
      return newSet
    })
  }

  const handleSurahClick = (surah: SurahInfo) => {
    console.log(`Opening Surah ${surah.number}: ${surah.nameEnglish} in ${selectedMode} mode`)
    // Navigation will be handled by Link component
  }

  // Filter surahs based on search, type, and length
  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch =
      surah.nameArabic.includes(searchQuery) ||
      surah.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nameTransliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery) ||
      surah.meaning.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || surah.revelationType === filterType

    const matchesLength = lengthFilter === 'all' || getSurahLengthCategory(surah.verses) === lengthFilter

    return matchesSearch && matchesType && matchesLength
  })

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    cardHover: isDark ? "hover:bg-gray-800/80 hover:border-gray-600/50" : "hover:bg-white/95 hover:border-gray-300/50",
    searchBar: isDark ? "bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/90 border-gray-200/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white"
      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white",
    modeButton: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeMode: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    toggle: isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-200 border-gray-300 text-gray-900",
    grid: isDark ? "opacity-10" : "opacity-5",
    ball: isDark ? "bg-emerald-500" : "bg-emerald-400",
  }

  const getModeIcon = (mode: 'read' | 'listen' | 'study') => {
    switch (mode) {
      case 'read': return <Eye className="w-4 h-4" />
      case 'listen': return <Headphones className="w-4 h-4" />
      case 'study': return <Book className="w-4 h-4" />
    }
  }

  const getModeText = (mode: 'read' | 'listen' | 'study') => {
    switch (mode) {
      case 'read': return { ar: 'قراءة', en: 'Read' }
      case 'listen': return { ar: 'استماع', en: 'Listen' }
      case 'study': return { ar: 'دراسة', en: 'Study' }
    }
  }

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-all duration-700 ease-in-out ${themeClasses.background}`}>
      {/* Animated Grid Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${themeClasses.grid}`}
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? "#10b981" : "#34d399"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "#10b981" : "#34d399"} 1px, transparent 1px)
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
            boxShadow: isDark ? "0 0 20px rgba(16, 185, 129, 0.3)" : "0 0 20px rgba(52, 211, 153, 0.3)",
          }}
        />
      ))}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        {/* Back Button & Logo */}
        <div className="flex items-center space-x-4">
          <button className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${themeClasses.accent} transition-colors duration-700 font-bold`}>
              ☪
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Ya
                </span>
                <span className={themeClasses.text}>Qeen</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation & Theme Toggle */}
        <div className="flex items-center space-x-3">
          {/* Qibla Compass Link */}
          <Link
            href="/qibla"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Qibla Compass"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </Link>

          {/* Digital Tasbih Link */}
          <Link
            href="/tasbih"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Digital Tasbih"
          >
            <Target className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Mosque Finder Link */}
          <Link
            href="/mosque-finder"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Mosque Finder"
          >
            <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Islamic Calendar Link */}
          <Link
            href="/calendar"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Islamic Calendar"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Prayer Times Link */}
          <Link
            href="/prayer-times"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Prayer Times"
          >
            <Clock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Islamic Stories Link */}
          <Link
            href="/stories"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Islamic Stories"
          >
            <Book className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Daily Adkar Link */}
          <Link
            href="/adkar"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Daily Adkar"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* 99 Names Link */}
          <Link
            href="/names"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="99 Beautiful Names"
          >
            <Star className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* AI Chat Link */}
          <Link
            href="/chat"
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2 group`}
            aria-label="Islamic AI Assistant"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.toggle} border-2`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-3 ${themeClasses.text} transition-colors duration-700`} style={{fontFamily: 'serif'}}>
              القرآن الكريم
            </h2>
            <h3 className={`text-3xl md:text-4xl font-semibold mb-4 ${themeClasses.text}`}>
              Holy Quran
            </h3>
            <p className={`text-lg ${themeClasses.subtitle} mb-2 transition-colors duration-700`} style={{fontFamily: 'serif'}}>
              اقرأ واستمع وادرس القرآن الكريم
            </p>
            <p className={`text-lg ${themeClasses.subtitle} transition-colors duration-700`}>
              Read, listen and study the Holy Quran
            </p>
          </div>

          {/* Search Bar & Mode Selection */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-2xl">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.subtitle}`} />
                <input
                  type="text"
                  placeholder="Search by surah name, number, or Arabic... ابحث بالاسم أو الرقم"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.searchBar}`}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.card} ${themeClasses.cardHover}`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 mb-6 transition-all duration-300`}>
                <div className="space-y-4">
                  {/* Revelation Type Filter */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className={`text-sm font-medium ${themeClasses.text}`}>Revelation Type:</span>
                    {(['all', 'Meccan', 'Medinan'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          filterType === type
                            ? themeClasses.activeMode
                            : themeClasses.modeButton
                        }`}
                      >
                        {type === 'all' ? 'All Surahs' : type}
                      </button>
                    ))}
                  </div>

                  {/* Length Filter */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className={`text-sm font-medium ${themeClasses.text}`}>Surah Length:</span>
                    {(['all', 'short', 'medium', 'long'] as const).map((length) => (
                      <button
                        key={length}
                        onClick={() => setLengthFilter(length)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          lengthFilter === length
                            ? themeClasses.activeMode
                            : themeClasses.modeButton
                        }`}
                      >
                        {length === 'all' ? 'All Lengths' :
                         length === 'short' ? 'Short (≤20)' :
                         length === 'medium' ? 'Medium (21-100)' :
                         'Long (>100)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode Selection */}
            <div className="flex flex-wrap gap-4 justify-center">
              {(['read', 'listen', 'study'] as const).map((mode) => {
                const modeText = getModeText(mode)
                return (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
                      selectedMode === mode
                        ? themeClasses.activeMode
                        : `${themeClasses.modeButton} ${themeClasses.cardHover}`
                    }`}
                  >
                    {getModeIcon(mode)}
                    <div className="text-left">
                      <p className="font-bold text-sm">{modeText.ar}</p>
                      <p className="text-sm">{modeText.en}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 text-center`}>
              <div className={`text-3xl font-bold ${themeClasses.accent} mb-2`}>114</div>
              <p className={`${themeClasses.text} font-semibold`}>Total Surahs</p>
              <p className={`text-sm ${themeClasses.subtitle}`}>إجمالي السور</p>
            </div>
            <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 text-center`}>
              <div className={`text-3xl font-bold ${themeClasses.accent} mb-2`}>{filteredSurahs.length}</div>
              <p className={`${themeClasses.text} font-semibold`}>Showing</p>
              <p className={`text-sm ${themeClasses.subtitle}`}>معروض</p>
            </div>
            <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 text-center`}>
              <div className={`text-3xl font-bold ${themeClasses.accent} mb-2`}>{bookmarkedSurahs.size}</div>
              <p className={`${themeClasses.text} font-semibold`}>Bookmarked</p>
              <p className={`text-sm ${themeClasses.subtitle}`}>المحفوظات</p>
            </div>
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                className={`relative group ${themeClasses.card} ${themeClasses.cardHover} backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer block`}
              >
                {/* Surah Number Badge */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {surah.number}
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(surah.number)
                  }}
                  className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
                    bookmarkedSurahs.has(surah.number)
                      ? 'text-yellow-500 bg-yellow-500/20'
                      : `${themeClasses.subtitle} hover:text-yellow-500 hover:bg-yellow-500/20`
                  }`}
                >
                  {bookmarkedSurahs.has(surah.number) ? (
                    <Star className="w-5 h-5 fill-current" />
                  ) : (
                    <Star className="w-5 h-5" />
                  )}
                </button>

                {/* Revelation Type Badge */}
                <div className={`absolute top-4 right-16 px-2 py-1 rounded-full text-xs font-medium ${
                  surah.revelationType === 'Meccan'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {surah.revelationType}
                </div>

                {/* Length Category Badge */}
                <div className={`absolute top-12 right-16 px-2 py-1 rounded-full text-xs font-medium ${
                  getSurahLengthCategory(surah.verses) === 'short'
                    ? 'bg-green-500/20 text-green-400'
                    : getSurahLengthCategory(surah.verses) === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {getSurahLengthCategory(surah.verses)}
                </div>

                {/* Surah Content */}
                <div className="mt-8">
                  {/* Arabic Name */}
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2 text-center`} style={{fontFamily: 'serif'}}>
                    {surah.nameArabic}
                  </h3>

                  {/* English Name */}
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-1 text-center`}>
                    {surah.nameEnglish}
                  </h4>

                  {/* Transliteration */}
                  <p className={`text-sm ${themeClasses.subtitle} mb-3 text-center italic`}>
                    {surah.nameTransliteration}
                  </p>

                  {/* Meaning */}
                  <p className={`text-sm ${themeClasses.subtitle} mb-4 text-center`}>
                    "{surah.meaning}"
                  </p>

                  {/* Verses Count */}
                  <div className={`flex items-center justify-center space-x-2 mb-4 ${themeClasses.accent}`}>
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {surah.verses} {surah.verses === 1 ? 'Verse' : 'Verses'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                      selectedMode === 'read' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : `${themeClasses.modeButton} text-xs`
                    }`}>
                      <Eye className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs">Read</span>
                    </button>
                    <button className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                      selectedMode === 'listen' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : `${themeClasses.modeButton} text-xs`
                    }`}>
                      <Headphones className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs">Listen</span>
                    </button>
                    <button className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                      selectedMode === 'study' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : `${themeClasses.modeButton} text-xs`
                    }`}>
                      <Book className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs">Study</span>
                    </button>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`flex items-center justify-center mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <ArrowRight className={`w-4 h-4 ${themeClasses.accent} transition-transform duration-300 group-hover:translate-x-1`} />
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          {/* No Results Message */}
          {filteredSurahs.length === 0 && (
            <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-12 text-center`}>
              <Search className={`w-16 h-16 ${themeClasses.subtitle} mx-auto mb-4 opacity-50`} />
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>No surahs found</h3>
              <p className={`${themeClasses.subtitle} mb-4`}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setFilterType('all')
                  setLengthFilter('all')
                }}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-64 ${isDark ? "bg-emerald-500" : "bg-emerald-400"} rounded-full opacity-10 blur-3xl animate-pulse`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${isDark ? "bg-teal-500" : "bg-teal-400"} rounded-full opacity-5 blur-3xl animate-pulse`} />
    </div>
  )
}

export default YaQeenQuranPage