'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Star, 
  Clock, 
  Target, 
  Award, 
  Settings, 
  BookOpen,
  Compass,
  MapPin,
  Calendar,
  Book,
  Flame,
  CheckCircle,
  Circle,
  TrendingUp,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';
import AdkarList from '../../components/AdkarList';
import ProgressTracker from '../../components/ProgressTracker';
import StreakCounter from '../../components/StreakCounter';
import { useAdkarStore } from '../../hooks/useAdkarStore';

export default function AdkarPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  const {
    currentTimePeriod,
    morningProgress,
    eveningProgress,
    streakData,
    featuredAdkar,
    preferences,
    updatePreferences,
    getTodayStatus,
    loading,
    error,
  } = useAdkarStore();

  const todayStatus = getTodayStatus();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('adkar-theme');
    setIsDark(savedTheme === 'dark');
    
    // Set active tab based on current time
    if (currentTimePeriod === 'morning') {
      setActiveTab('morning');
    } else if (currentTimePeriod === 'evening') {
      setActiveTab('evening');
    }
  }, [currentTimePeriod]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('adkar-theme', newTheme ? 'dark' : 'light');
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    morningButton: isDark
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : "bg-amber-500 hover:bg-amber-600 text-white",
    eveningButton: isDark
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : "bg-indigo-500 hover:bg-indigo-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    hero: isDark ? "bg-gray-800/40" : "bg-white/60",
    morning: isDark ? "bg-amber-900/20 border-amber-600/30" : "bg-amber-50/80 border-amber-300/30",
    evening: isDark ? "bg-indigo-900/20 border-indigo-600/30" : "bg-indigo-50/80 border-indigo-300/30",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: '🌅', period: 'morning' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: '☀️', period: 'afternoon' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: '🌆', period: 'evening' };
    return { text: 'Good Night', icon: '🌙', period: 'night' };
  };

  const greeting = getCurrentTimeGreeting();

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        {/* Floating Islamic Patterns */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-2xl ${isDark ? 'text-emerald-400/20' : 'text-emerald-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🕌', '🌙', '⭐', '🤲', '📿', '🌟', '✨', '💫'][i]}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <div className="text-2xl">🤲</div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Daily Adkar
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                {greeting.text} {greeting.icon} - Remember Allah with beautiful supplications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/quran"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Holy Quran"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            <Link
              href="/qibla"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Qibla Compass"
            >
              <Compass className="w-5 h-5" />
            </Link>

            <Link
              href="/tasbih"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Digital Tasbih"
            >
              <Target className="w-5 h-5" />
            </Link>

            <Link
              href="/mosque-finder"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Mosque Finder"
            >
              <MapPin className="w-5 h-5" />
            </Link>

            <Link
              href="/calendar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Calendar"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <Link
              href="/prayer-times"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Prayer Times"
            >
              <Clock className="w-5 h-5" />
            </Link>

            <Link
              href="/stories"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Stories"
            >
              <Book className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                showSettings ? themeClasses.activeButton : themeClasses.button
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Status */}
      <section className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className={`${themeClasses.hero} backdrop-blur-xl border rounded-3xl p-8 ${themeClasses.card.split(' ')[1]}`}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className={`w-8 h-8 ${themeClasses.accent}`} />
                <h2 className={`text-4xl font-bold ${themeClasses.text}`}>
                  Today's Adkar Progress
                </h2>
                <Star className={`w-8 h-8 ${themeClasses.accent}`} />
              </div>
              <p className={`text-xl ${themeClasses.subtitle} max-w-3xl mx-auto`}>
                Start your day with morning Adkar and end with evening remembrance of Allah
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Morning Progress */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.morning}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sun className={`w-6 h-6 ${themeClasses.gold}`} />
                    <h3 className={`text-lg font-bold ${themeClasses.text}`}>Morning Adkar</h3>
                  </div>
                  {todayStatus.morning ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className={`w-6 h-6 ${themeClasses.subtitle}`} />
                  )}
                </div>
                <ProgressTracker 
                  progress={morningProgress} 
                  category="morning"
                  isDark={isDark}
                />
              </div>

              {/* Evening Progress */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.evening}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Moon className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <h3 className={`text-lg font-bold ${themeClasses.text}`}>Evening Adkar</h3>
                  </div>
                  {todayStatus.evening ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className={`w-6 h-6 ${themeClasses.subtitle}`} />
                  )}
                </div>
                <ProgressTracker 
                  progress={eveningProgress} 
                  category="evening"
                  isDark={isDark}
                />
              </div>

              {/* Streak Counter */}
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Flame className={`w-6 h-6 ${themeClasses.accent}`} />
                  <h3 className={`text-lg font-bold ${themeClasses.text}`}>Streak</h3>
                </div>
                <StreakCounter 
                  streakData={streakData}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Featured Adkar of the Day */}
            {featuredAdkar && (
              <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 text-center`}>
                  ✨ Featured Adkar of the Day
                </h3>
                <div className="text-center">
                  <div className={`text-2xl ${themeClasses.gold} mb-3 font-arabic leading-relaxed`}>
                    {featuredAdkar.arabicText.length > 100 
                      ? featuredAdkar.arabicText.substring(0, 100) + '...'
                      : featuredAdkar.arabicText
                    }
                  </div>
                  <p className={`${themeClasses.subtitle} mb-2`}>
                    {featuredAdkar.translation.length > 150 
                      ? featuredAdkar.translation.substring(0, 150) + '...'
                      : featuredAdkar.translation
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      featuredAdkar.category === 'morning' ? themeClasses.morning : themeClasses.evening
                    }`}>
                      {featuredAdkar.category === 'morning' ? '🌅 Morning' : '🌙 Evening'}
                    </span>
                    <span className={themeClasses.subtitle}>
                      Repeat {featuredAdkar.repetitions}x
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Adkar Tabs */}
      <section className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('morning')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'morning' ? themeClasses.morningButton : themeClasses.button
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Morning Adkar</span>
              {todayStatus.morning && <CheckCircle className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('evening')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'evening' ? themeClasses.eveningButton : themeClasses.button
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Evening Adkar</span>
              {todayStatus.evening && <CheckCircle className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      {showSettings && (
        <section className="relative z-10 px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
              <h3 className={`text-lg font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
                <Settings className="w-5 h-5" />
                <span>Adkar Settings</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language Settings */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Display Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => updatePreferences({ language: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700/80 border-gray-600/50 text-white"
                        : "bg-white/90 border-gray-300/50 text-gray-900"
                    }`}
                  >
                    <option value="arabic">Arabic Only</option>
                    <option value="english">English Only</option>
                    <option value="both">Both Languages</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Font Size
                  </label>
                  <select
                    value={preferences.fontSize}
                    onChange={(e) => updatePreferences({ fontSize: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700/80 border-gray-600/50 text-white"
                        : "bg-white/90 border-gray-300/50 text-gray-900"
                    }`}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${themeClasses.text}`}>
                    Enable Notifications
                  </label>
                  <button
                    onClick={() => updatePreferences({ enableNotifications: !preferences.enableNotifications })}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      preferences.enableNotifications ? themeClasses.activeButton : themeClasses.button
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Audio */}
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${themeClasses.text}`}>
                    Play Audio
                  </label>
                  <button
                    onClick={() => updatePreferences({ playAudio: !preferences.playAudio })}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      preferences.playAudio ? themeClasses.activeButton : themeClasses.button
                    }`}
                  >
                    {preferences.playAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Adkar List */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <AdkarList
            category={activeTab}
            preferences={preferences}
            isDark={isDark}
          />
        </div>
      </main>
    </div>
  );
}
