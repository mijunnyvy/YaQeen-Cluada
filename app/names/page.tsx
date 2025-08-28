'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  BookOpen, 
  Brain, 
  Star, 
  Heart, 
  Volume2, 
  Settings, 
  Sun, 
  Moon,
  Compass,
  Target,
  MapPin,
  Calendar,
  Clock,
  Book,
  Shuffle,
  Play,
  Award,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import NameCard from '../../components/NameCard';
import NamesSearchBar from '../../components/NamesSearchBar';
import NamesFilterPanel from '../../components/NamesFilterPanel';
import FlashcardView from '../../components/FlashcardView';
import QuizGame from '../../components/QuizGame';
import { useNamesStore } from '../../hooks/useNamesStore';

export default function NamesPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    filteredNames,
    favoriteNames,
    currentMode,
    searchQuery,
    selectedCategory,
    memorizedCount,
    averageScore,
    preferences,
    dailyName,
    setCurrentMode,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
    updatePreferences,
    loading,
    error,
  } = useNamesStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('names-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('names-theme', newTheme ? 'dark' : 'light');
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      : "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    hero: isDark ? "bg-gray-800/40" : "bg-white/60",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categories = [
    { id: 'mercy', name: 'Mercy & Compassion', icon: '💙', count: filteredNames.filter(n => n.category === 'mercy').length },
    { id: 'power', name: 'Power & Might', icon: '⚡', count: filteredNames.filter(n => n.category === 'power').length },
    { id: 'knowledge', name: 'Knowledge & Wisdom', icon: '🧠', count: filteredNames.filter(n => n.category === 'knowledge').length },
    { id: 'creation', name: 'Creation & Life', icon: '🌱', count: filteredNames.filter(n => n.category === 'creation').length },
    { id: 'guidance', name: 'Guidance & Light', icon: '🌟', count: filteredNames.filter(n => n.category === 'guidance').length },
    { id: 'protection', name: 'Protection & Security', icon: '🛡️', count: filteredNames.filter(n => n.category === 'protection').length },
    { id: 'forgiveness', name: 'Forgiveness & Pardon', icon: '🤲', count: filteredNames.filter(n => n.category === 'forgiveness').length },
    { id: 'sustenance', name: 'Sustenance & Provision', icon: '🍃', count: filteredNames.filter(n => n.category === 'sustenance').length },
    { id: 'justice', name: 'Justice & Fairness', icon: '⚖️', count: filteredNames.filter(n => n.category === 'justice').length },
    { id: 'beauty', name: 'Beauty & Glory', icon: '✨', count: filteredNames.filter(n => n.category === 'beauty').length },
  ];

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
        
        {/* Floating Islamic Calligraphy */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-2xl ${isDark ? 'text-blue-400/20' : 'text-blue-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['ﷲ', '🕌', '🌙', '⭐', '🤲', '📿', '🌟', '✨', '💫', '🔯', '☪️', '🕊️', '💎', '🌸', '🦋'][i]}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <div className="text-2xl">🕌</div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                99 Beautiful Names of Allah
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Asma-ul-Husna - Learn, memorize, and reflect upon Allah's beautiful attributes
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

            <Link
              href="/adkar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Daily Adkar"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/chat"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic AI Assistant"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                showFilters ? themeClasses.activeButton : themeClasses.button
              }`}
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>

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

      {/* Hero Section */}
      <section className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className={`${themeClasses.hero} backdrop-blur-xl border rounded-3xl p-8 ${themeClasses.card.split(' ')[1]}`}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className={`w-8 h-8 ${themeClasses.accent}`} />
                <h2 className={`text-4xl font-bold ${themeClasses.text}`}>
                  Learn Allah's Beautiful Names
                </h2>
                <Star className={`w-8 h-8 ${themeClasses.accent}`} />
              </div>
              <p className={`text-xl ${themeClasses.subtitle} max-w-3xl mx-auto`}>
                Discover the 99 Beautiful Names of Allah with their meanings, learn through interactive flashcards, and test your knowledge with quizzes
              </p>
            </div>

            {/* Daily Name Feature */}
            {dailyName && (
              <div className={`p-6 rounded-2xl border backdrop-blur-xl mb-8 ${themeClasses.card}`}>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 text-center`}>
                  ✨ Name of the Day
                </h3>
                <div className="text-center">
                  <div className={`text-4xl ${themeClasses.gold} mb-3 font-arabic`}>
                    {dailyName.arabic}
                  </div>
                  <div className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                    {dailyName.transliteration}
                  </div>
                  <div className={`text-lg ${themeClasses.accent} mb-3`}>
                    {dailyName.english}
                  </div>
                  <p className={`${themeClasses.subtitle} max-w-2xl mx-auto`}>
                    {dailyName.meaning}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                  99
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Beautiful Names</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.gold}`}>
                  {memorizedCount}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Memorized</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                  {favoriteNames.length}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Favorites</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.gold}`}>
                  {Math.round(averageScore) || 0}%
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Quiz Average</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <button
              onClick={() => setCurrentMode('grid')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentMode === 'grid' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
              <span>Browse Names</span>
            </button>

            <button
              onClick={() => setCurrentMode('flashcard')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentMode === 'flashcard' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setCurrentMode('quiz')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentMode === 'quiz' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>Quiz Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      {currentMode === 'grid' && (
        <section className="relative z-10 px-6 mb-8">
          <div className="max-w-7xl mx-auto">
            <NamesSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isDark={isDark}
            />
            
            {showFilters && (
              <div className="mt-4">
                <NamesFilterPanel
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onFilterChange={setSelectedCategory}
                  onClearFilters={clearFilters}
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <section className="relative z-10 px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
              <h3 className={`text-lg font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
                <Settings className="w-5 h-5" />
                <span>Learning Preferences</span>
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

                {/* Audio Settings */}
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${themeClasses.text}`}>
                    Auto-play Audio
                  </label>
                  <button
                    onClick={() => updatePreferences({ autoPlayAudio: !preferences.autoPlayAudio })}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      preferences.autoPlayAudio ? themeClasses.activeButton : themeClasses.button
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quiz Difficulty */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Quiz Difficulty
                  </label>
                  <select
                    value={preferences.quizDifficulty}
                    onChange={(e) => updatePreferences({ quizDifficulty: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700/80 border-gray-600/50 text-white"
                        : "bg-white/90 border-gray-300/50 text-gray-900"
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {currentMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNames.map((name) => (
                <NameCard
                  key={name.id}
                  name={name}
                  preferences={preferences}
                  isDark={isDark}
                />
              ))}
            </div>
          )}

          {currentMode === 'flashcard' && (
            <FlashcardView
              names={filteredNames}
              preferences={preferences}
              isDark={isDark}
            />
          )}

          {currentMode === 'quiz' && (
            <QuizGame
              names={filteredNames}
              preferences={preferences}
              isDark={isDark}
            />
          )}
        </div>
      </main>
    </div>
  );
}
