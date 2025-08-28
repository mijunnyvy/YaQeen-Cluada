"use client"

import React, { useState, useEffect } from "react"
import {
  MessageCircle,
  Compass,
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Users,
  Search,
  Settings,
  Sun,
  Moon,
  ArrowRight,
  Play,
  Bookmark,
  Star,
  Navigation,
  Volume2,
} from "lucide-react"
import PrayerTimesSummary from "../../components/PrayerTimesSummary"

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

// Islamic Tool interface
interface IslamicTool {
  id: string
  name: string
  nameArabic: string
  description: string
  descriptionArabic: string
  icon: React.ElementType
  color: string
  isAvailable: boolean
  isNew?: boolean
  badge?: string
}



const YaQeenHomepage = () => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Floating balls state
  const [balls, setBalls] = useState<FloatingBall[]>([])



  // Daily Hadith/Wisdom
  const dailyWisdom = {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are but by intention and every man shall have only that which he intended",
    source: "Sahih al-Bukhari",
    narrator: "عمر بن الخطاب رضي الله عنه / Umar ibn al-Khattab (RA)"
  }

  // Islamic Tools data
  const islamicTools: IslamicTool[] = [
    {
      id: "quran",
      name: "Holy Quran",
      nameArabic: "القرآن الكريم",
      description: "Read, listen and study the Holy Quran",
      descriptionArabic: "اقرأ واستمع وادرس القرآن الكريم",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      isAvailable: true,
      badge: "Essential",
    },
    {
      id: "qibla",
      name: "Qibla Finder",
      nameArabic: "محدد القبلة",
      description: "Find the direction of Kaaba",
      descriptionArabic: "اعثر على اتجاه الكعبة المشرفة",
      icon: Navigation,
      color: "from-green-500 to-emerald-500",
      isAvailable: true,
    },
    {
      id: "tasbih",
      name: "Digital Tasbih",
      nameArabic: "التسبيح الرقمي",
      description: "Count your dhikr and remembrance",
      descriptionArabic: "عدّ أذكارك وتسابيحك",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      isAvailable: true,
    },
    {
      id: "adkar",
      name: "Daily Adkar",
      nameArabic: "الأذكار اليومية",
      description: "Morning, evening and daily supplications",
      descriptionArabic: "أذكار الصباح والمساء والأذكار اليومية",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-500",
      isAvailable: true,
    },
    {
      id: "stories",
      name: "Islamic Stories",
      nameArabic: "القصص الإسلامية",
      description: "Stories of Prophets and companions",
      descriptionArabic: "قصص الأنبياء والصحابة",
      icon: BookOpen,
      color: "from-purple-500 to-violet-500",
      isAvailable: true,
      isNew: true,
    },
    {
      id: "mosque",
      name: "Mosque Finder",
      nameArabic: "محدد المساجد",
      description: "Find nearby mosques and Islamic centers",
      descriptionArabic: "اعثر على المساجد والمراكز الإسلامية القريبة",
      icon: MapPin,
      color: "from-teal-500 to-cyan-500",
      isAvailable: true,
    },
    {
      id: "ai-chat",
      name: "Islamic AI Assistant",
      nameArabic: "المساعد الذكي الإسلامي",
      description: "Ask questions about Islam",
      descriptionArabic: "اسأل عن الإسلام والعلوم الشرعية",
      icon: MessageCircle,
      color: "from-amber-500 to-orange-500",
      isAvailable: true,
      badge: "AI Powered",
    },
    {
      id: "calendar",
      name: "Islamic Calendar",
      nameArabic: "التقويم الإسلامي",
      description: "Hijri calendar and Islamic events",
      descriptionArabic: "التقويم الهجري والمناسبات الإسلامية",
      icon: Calendar,
      color: "from-slate-600 to-gray-700",
      isAvailable: true,
    },
    {
      id: "names",
      name: "99 Names of Allah",
      nameArabic: "أسماء الله الحسنى",
      description: "Beautiful names and attributes of Allah",
      descriptionArabic: "أسماء الله الحسنى وصفاته العلى",
      icon: Star,
      color: "from-yellow-500 to-amber-500",
      isAvailable: true,
    },
    {
      id: "duaa",
      name: "Duaa Collection",
      nameArabic: "مجموعة الأدعية",
      description: "Comprehensive collection of Islamic prayers",
      descriptionArabic: "مجموعة شاملة من الأدعية الإسلامية",
      icon: Volume2,
      color: "from-indigo-500 to-blue-500",
      isAvailable: true,
    },
    {
      id: "hajj",
      name: "Hajj Guide",
      nameArabic: "دليل الحج",
      description: "Complete guide for Hajj and Umrah",
      descriptionArabic: "دليل شامل للحج والعمرة",
      icon: Users,
      color: "from-green-600 to-teal-600",
      isAvailable: true,
    },
    {
      id: "islamic-quiz",
      name: "Islamic Knowledge Quiz",
      nameArabic: "اختبار المعرفة الإسلامية",
      description: "Test your Islamic knowledge",
      descriptionArabic: "اختبر معرفتك الإسلامية",
      icon: Search,
      color: "from-red-500 to-rose-500",
      isAvailable: true,
      isNew: true,
    },
  ]

  // Initialize floating balls
  useEffect(() => {
    const initialBalls: FloatingBall[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.4 + 0.1,
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

  const handleToolClick = (tool: IslamicTool) => {
    if (!tool.isAvailable) return
    console.log(`Opening ${tool.name} tool...`)
    // Navigate to specific tool page
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    cardHover: isDark ? "hover:bg-gray-800/80 hover:border-gray-600/50" : "hover:bg-white/95 hover:border-gray-300/50",
    prayerCard: isDark ? "bg-emerald-800/50 border-emerald-700/50" : "bg-emerald-50/80 border-emerald-200/50",
    wisdomCard: isDark ? "bg-amber-900/30 border-amber-800/50" : "bg-amber-50/80 border-amber-200/50",
    toggle: isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-200 border-gray-300 text-gray-900",
    grid: isDark ? "opacity-10" : "opacity-5",
    ball: isDark ? "bg-emerald-500" : "bg-emerald-400",
    button: isDark
      ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25"
      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30",
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getHijriDate = () => {
    // Mock Hijri date - in a real app, you'd use a proper Hijri calendar library
    return "15 جمادى الآخرة 1446"
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
        {/* Logo */}
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
            <p className={`text-sm ${themeClasses.subtitle}`}>يقين - منصة إسلامية شاملة</p>
          </div>
        </div>

        {/* Current Time & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {formatTime(currentTime)}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>
              {getHijriDate()}
            </div>
          </div>
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
        {/* Welcome Section with Prayer Times & Daily Wisdom */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${themeClasses.text} transition-colors duration-700`}>
              السلام عليكم ورحمة الله وبركاته
            </h2>
            <h3 className={`text-2xl md:text-3xl font-semibold mb-4 ${themeClasses.text}`}>
              Assalamu Alaikum wa Rahmatullahi wa Barakatuh
            </h3>
            <p className={`text-lg ${themeClasses.subtitle} transition-colors duration-700 max-w-2xl mx-auto`}>
              Your comprehensive Islamic companion for spiritual growth and daily guidance
            </p>
          </div>

          {/* Prayer Times & Daily Wisdom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Prayer Times Card */}
            <PrayerTimesSummary isDark={isDark} />

            {/* Daily Wisdom Card */}
            <div className={`${themeClasses.wisdomCard} backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${themeClasses.text}`}>الحكمة اليومية</h4>
                  <p className={`text-sm ${themeClasses.subtitle}`}>Daily Wisdom</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className={`text-lg font-bold ${themeClasses.text} leading-relaxed mb-3`} style={{fontFamily: 'serif'}}>
                    {dailyWisdom.arabic}
                  </p>
                  <p className={`text-base ${themeClasses.subtitle} italic mb-4`}>
                    "{dailyWisdom.english}"
                  </p>
                </div>
                
                <div className="text-center pt-4 border-t border-gray-500/20">
                  <p className={`text-sm font-medium ${themeClasses.accent}`}>
                    {dailyWisdom.source}
                  </p>
                  <p className={`text-xs ${themeClasses.subtitle} mt-1`}>
                    {dailyWisdom.narrator}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors duration-300">
                    <Bookmark className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors duration-300">
                    <Volume2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Islamic Tools Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-1`}>الأدوات الإسلامية</h3>
              <p className={`text-lg font-semibold ${themeClasses.text}`}>Islamic Tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {islamicTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={`relative group ${themeClasses.card} ${themeClasses.cardHover} backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    tool.isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-1">
                    {tool.isNew && (
                      <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                        جديد
                      </span>
                    )}
                    {tool.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Tool Icon */}
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${tool.color} mb-4 transition-transform duration-300 ${
                      hoveredTool === tool.id ? "scale-110 rotate-3" : ""
                    }`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Tool Info */}
                  <div className="space-y-3">
                    <div>
                      <h4 className={`text-lg font-bold ${themeClasses.text} mb-1`} style={{fontFamily: 'serif'}}>
                        {tool.nameArabic}
                      </h4>
                      <h5 className={`text-base font-semibold ${themeClasses.text} mb-2`}>
                        {tool.name}
                      </h5>
                    </div>
                    <div>
                      <p className={`${themeClasses.subtitle} text-sm mb-1 leading-relaxed`} style={{fontFamily: 'serif'}}>
                        {tool.descriptionArabic}
                      </p>
                      <p className={`${themeClasses.subtitle} text-sm`}>
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  {tool.isAvailable && (
                    <div
                      className={`flex items-center justify-between mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span className={`text-sm font-medium ${themeClasses.accent}`}>ابدأ / Start</span>
                      <ArrowRight
                        className={`w-4 h-4 ${themeClasses.accent} transition-transform duration-300 ${
                          hoveredTool === tool.id ? "-translate-x-1" : ""
                        }`}
                      />
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Islamic Quote Footer */}
        <div className="max-w-4xl mx-auto text-center mt-12">
          <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300`}>
            <p className={`text-2xl font-bold ${themeClasses.accent} mb-3`} style={{fontFamily: 'serif'}}>
              "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
            </p>
            <p className={`text-lg ${themeClasses.subtitle} italic mb-4`}>
              "And whoever fears Allah - He will make for him a way out"
            </p>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              Quran 65:2
            </p>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-64 ${isDark ? "bg-emerald-500" : "bg-emerald-400"} rounded-full opacity-10 blur-3xl animate-pulse`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${isDark ? "bg-teal-500" : "bg-teal-400"} rounded-full opacity-5 blur-3xl animate-pulse`} />
    </div>
  )
}

export default YaQeenHomepage