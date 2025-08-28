'use client';

import React, { useState, useEffect } from 'react';
// Mosque Finder - Main page component for finding nearby mosques
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation,
  Heart,
  Phone,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  BookOpen,
  Target,
  Compass,
  List,
  Map as MapIcon,
  Star,
  Route,
  Calendar,
  Book
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MosqueList from '../../components/MosqueList';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import MosqueDetails from '../../components/MosqueDetails';
import DirectionCompass from '../../components/DirectionCompass';
import { useMosqueStore, type Mosque } from '../../hooks/useMosqueStore';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('../../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  )
});

export default function MosqueFinderPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCompass, setShowCompass] = useState(false);

  const {
    userLocation,
    mosques,
    loading,
    error,
    searchQuery,
    filters,
    favorites,
    getCurrentLocation,
    searchMosques,
    setSearchQuery,
    updateFilters,
    addToFavorites,
    removeFromFavorites,
    getNearbyMosques
  } = useMosqueStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('mosque-finder-theme');
    setIsDark(savedTheme === 'dark');
    
    // Get user location on mount
    getCurrentLocation();
  }, [getCurrentLocation]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('mosque-finder-theme', newTheme ? 'dark' : 'light');
  };

  const handleMosqueSelect = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    setShowDetails(true);
  };

  const handleDirections = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    setShowCompass(true);
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
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        {/* Floating Mosque Icons */}
        {[...Array(6)].map((_, i) => (
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
            🕌
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
                Mosque Finder
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Find nearby mosques and prayer times
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
              href="/names"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="99 Beautiful Names"
            >
              <Star className="w-5 h-5" />
            </Link>

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

      {/* Search and Filters */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={searchMosques}
                isDark={isDark}
                loading={loading}
              />
            </div>
            <div>
              <Filters
                filters={filters}
                onChange={updateFilters}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 p-2 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-xl">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'map' ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="font-medium">Map View</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                <List className="w-4 h-4" />
                <span className="font-medium">List View</span>
              </button>
            </div>

            {/* Results Count */}
            <div className={`text-sm ${themeClasses.subtitle}`}>
              {mosques.length} mosques found
              {userLocation && (
                <span className="ml-2">
                  📍 {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className={`mb-6 p-4 rounded-2xl border ${themeClasses.card} backdrop-blur-xl`}>
              <div className="flex items-center space-x-2 text-red-500">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {viewMode === 'map' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${themeClasses.card}`}>
                  <MapView
                    userLocation={userLocation}
                    mosques={mosques}
                    onMosqueSelect={handleMosqueSelect}
                    selectedMosque={selectedMosque}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {selectedMosque && (
                  <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
                    <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                      Selected Mosque
                    </h3>
                    <div className="space-y-3">
                      <h4 className={`font-semibold ${themeClasses.text}`}>
                        {selectedMosque.name}
                      </h4>
                      <p className={`text-sm ${themeClasses.subtitle}`}>
                        {selectedMosque.address}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Navigation className={`w-4 h-4 ${themeClasses.accent}`} />
                        <span className={`text-sm ${themeClasses.text}`}>
                          {selectedMosque.distance?.toFixed(2)} km away
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDirections(selectedMosque)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-300 ${themeClasses.activeButton}`}
                        >
                          <Route className="w-4 h-4 inline mr-1" />
                          Directions
                        </button>
                        <button
                          onClick={() => setShowDetails(true)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-300 ${themeClasses.button}`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
                  <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={themeClasses.subtitle}>Total Mosques</span>
                      <span className={`font-semibold ${themeClasses.text}`}>
                        {mosques.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.subtitle}>Favorites</span>
                      <span className={`font-semibold ${themeClasses.gold}`}>
                        {favorites.length}
                      </span>
                    </div>
                    {mosques.length > 0 && (
                      <div className="flex justify-between">
                        <span className={themeClasses.subtitle}>Closest</span>
                        <span className={`font-semibold ${themeClasses.accent}`}>
                          {Math.min(...mosques.map((m: Mosque) => m.distance || 0)).toFixed(2)} km
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <MosqueList
              mosques={mosques}
              userLocation={userLocation}
              onMosqueSelect={handleMosqueSelect}
              onDirections={handleDirections}
              favorites={favorites}
              onToggleFavorite={(mosque: Mosque) => {
                if (favorites.some((f: Mosque) => f.id === mosque.id)) {
                  removeFromFavorites(mosque.id);
                } else {
                  addToFavorites(mosque);
                }
              }}
              isDark={isDark}
              loading={loading}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {showDetails && selectedMosque && (
        <MosqueDetails
          mosque={selectedMosque}
          userLocation={userLocation}
          onClose={() => setShowDetails(false)}
          onToggleFavorite={(mosque: Mosque) => {
            if (favorites.some((f: Mosque) => f.id === mosque.id)) {
              removeFromFavorites(mosque.id);
            } else {
              addToFavorites(mosque);
            }
          }}
          isFavorite={favorites.some((f: Mosque) => f.id === selectedMosque.id)}
          isDark={isDark}
        />
      )}

      {showCompass && selectedMosque && userLocation && (
        <DirectionCompass
          userLocation={userLocation}
          targetLocation={{
            latitude: selectedMosque.lat,
            longitude: selectedMosque.lon,
            name: selectedMosque.name
          }}
          onClose={() => setShowCompass(false)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
