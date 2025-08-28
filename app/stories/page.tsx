'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Heart,
  Bookmark,
  Play,
  Sun,
  Moon,
  Calendar,
  MapPin,
  Target,
  Compass,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import StoriesList from '../../components/StoriesList';
import StoriesSearchBar from '../../components/StoriesSearchBar';
import FilterPanel from '../../components/FilterPanel';
import { useStoriesStore } from '../../hooks/useStoriesStore';

export default function StoriesPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    filteredStories,
    featuredStories,
    searchQuery,
    selectedCategory,
    selectedAgeGroup,
    selectedTheme,
    setSearchQuery,
    setFilters,
    clearFilters,
    loading,
    error,
  } = useStoriesStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('stories-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('stories-theme', newTheme ? 'dark' : 'light');
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"
      : "bg-gradient-to-br from-purple-50 via-white to-indigo-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-purple-600 text-white"
      : "bg-purple-500 text-white",
    accent: isDark ? "text-purple-400" : "text-purple-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    hero: isDark ? "bg-gray-800/40" : "bg-white/60",
  };

  const categories = [
    { id: 'prophets', name: 'Prophets', icon: '👑', count: filteredStories.filter(s => s.category === 'prophets').length },
    { id: 'sahaba', name: 'Sahaba', icon: '🤝', count: filteredStories.filter(s => s.category === 'sahaba').length },
    { id: 'history', name: 'History', icon: '🏛️', count: filteredStories.filter(s => s.category === 'history').length },
    { id: 'lessons', name: 'Lessons', icon: '💡', count: filteredStories.filter(s => s.category === 'lessons').length },
    { id: 'quran', name: 'Quran', icon: '📖', count: filteredStories.filter(s => s.category === 'quran').length },
  ];

  const ageGroups = [
    { id: 'children', name: 'Children', icon: '👶' },
    { id: 'youth', name: 'Youth', icon: '👦' },
    { id: 'adult', name: 'Adult', icon: '👨' },
    { id: 'all', name: 'All Ages', icon: '👨‍👩‍👧‍👦' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
        
        {/* Floating Story Icons */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-2xl ${isDark ? 'text-purple-400/20' : 'text-purple-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['📚', '🕌', '👑', '🤝', '💡', '🌟', '📖', '🏛️', '🌙', '⭐', '🤲', '📿'][i]}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <div className="text-2xl">📚</div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Islamic Stories
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Inspiring tales from Islamic history and tradition
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
                <Sparkles className={`w-8 h-8 ${themeClasses.accent}`} />
                <h2 className={`text-4xl font-bold ${themeClasses.text}`}>
                  Discover Islamic Stories
                </h2>
                <Sparkles className={`w-8 h-8 ${themeClasses.accent}`} />
              </div>
              <p className={`text-xl ${themeClasses.subtitle} max-w-3xl mx-auto`}>
                Explore inspiring tales of prophets, companions, and Islamic history. 
                Learn valuable lessons through beautiful storytelling.
              </p>
            </div>

            {/* Featured Story of the Day */}
            {featuredStories.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4 text-center`}>
                  ✨ Featured Story Today
                </h3>
                <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl">{featuredStories[0].thumbnail}</div>
                    <div className="flex-1">
                      <h4 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                        {featuredStories[0].title}
                      </h4>
                      <p className={`${themeClasses.subtitle} mb-4`}>
                        {featuredStories[0].description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className={`w-4 h-4 ${themeClasses.accent}`} />
                          <span className={themeClasses.subtitle}>
                            {featuredStories[0].estimatedReadTime} min read
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className={`w-4 h-4 ${themeClasses.accent}`} />
                          <span className={themeClasses.subtitle}>
                            {featuredStories[0].ageGroup}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/stories/${featuredStories[0].id}`}>
                      <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.activeButton}`}>
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Read Story</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                  {filteredStories.length}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Total Stories</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.gold}`}>
                  {categories.length}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Categories</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                  {featuredStories.length}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Featured</div>
              </div>
              
              <div className={`${themeClasses.card} backdrop-blur-xl border rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-bold ${themeClasses.gold}`}>
                  {Math.round(filteredStories.reduce((acc, story) => acc + story.estimatedReadTime, 0) / filteredStories.length) || 0}
                </div>
                <div className={`text-sm ${themeClasses.subtitle}`}>Avg. Read Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <StoriesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDark={isDark}
          />
          
          {showFilters && (
            <div className="mt-4">
              <FilterPanel
                categories={categories}
                ageGroups={ageGroups}
                selectedCategory={selectedCategory}
                selectedAgeGroup={selectedAgeGroup}
                selectedTheme={selectedTheme}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
                isDark={isDark}
              />
            </div>
          )}
        </div>
      </section>

      {/* Stories List */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <StoriesList
            stories={filteredStories}
            loading={loading}
            error={error}
            isDark={isDark}
          />
        </div>
      </main>
    </div>
  );
}
