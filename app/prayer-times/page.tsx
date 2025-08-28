'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Settings, 
  Sun, 
  Moon, 
  Calendar,
  BookOpen,
  Target,
  Compass,
  RefreshCw,
  Bell,
  Clock,
  Navigation,
  Share2,
  Book,
  Heart,
  Star
} from 'lucide-react';
import Link from 'next/link';
import PrayerTimesContainer from '../../components/PrayerTimesContainer';
import NextPrayerHighlight from '../../components/NextPrayerHighlight';
import LocationSearch from '../../components/LocationSearch';
import SettingsPanel from '../../components/SettingsPanel';
import { usePrayerTimesStore } from '../../hooks/usePrayerTimesStore';

export default function PrayerTimesPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    currentLocation,
    prayerTimes,
    currentPrayer,
    nextPrayer,
    timeToNextPrayer,
    settings,
    loading,
    error,
    getCurrentLocation,
    setLocation,
    fetchPrayerTimes,
    updateSettings,
  } = usePrayerTimesStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('prayer-times-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  // Auto-detect location on first load
  useEffect(() => {
    if (mounted && !currentLocation && !loading) {
      handleAutoDetectLocation();
    }
  }, [mounted, currentLocation, loading]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('prayer-times-theme', newTheme ? 'dark' : 'light');
  };

  const handleAutoDetectLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        await setLocation(location);
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const handleRefreshPrayerTimes = async () => {
    if (currentLocation) {
      await fetchPrayerTimes(currentLocation);
    }
  };

  const handleSharePrayerTimes = async () => {
    if (!currentLocation || prayerTimes.length === 0) return;

    const todayPrayers = prayerTimes[0];
    const shareText = `Prayer Times for ${currentLocation.city}, ${currentLocation.country}\n\n` +
      `📅 ${new Date().toLocaleDateString()}\n` +
      `🌅 Fajr: ${todayPrayers.prayers.find(p => p.name === 'Fajr')?.time}\n` +
      `☀️ Dhuhr: ${todayPrayers.prayers.find(p => p.name === 'Dhuhr')?.time}\n` +
      `🌤️ Asr: ${todayPrayers.prayers.find(p => p.name === 'Asr')?.time}\n` +
      `🌅 Maghrib: ${todayPrayers.prayers.find(p => p.name === 'Maghrib')?.time}\n` +
      `🌙 Isha: ${todayPrayers.prayers.find(p => p.name === 'Isha')?.time}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Prayer Times',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // You could show a toast notification here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-amber-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-amber-50",
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
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        {/* Floating Prayer Icons */}
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
            {['🕌', '🌙', '☀️', '🌅', '🌤️', '⭐', '🤲', '📿'][i]}
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
                Prayer Times
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Islamic prayer schedule'}
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
              onClick={() => setShowLocationSearch(true)}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Change Location"
            >
              <Navigation className="w-5 h-5" />
            </button>

            <button
              onClick={handleRefreshPrayerTimes}
              disabled={loading}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh Prayer Times"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSharePrayerTimes}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Share Prayer Times"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
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

      {/* Next Prayer Highlight */}
      {nextPrayer && (
        <div className="relative z-10 px-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <NextPrayerHighlight
              nextPrayer={nextPrayer}
              timeToNext={timeToNextPrayer}
              currentPrayer={currentPrayer}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
                Unable to Load Prayer Times
              </h3>
              <p className={`${themeClasses.subtitle} mb-4`}>
                {error}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleAutoDetectLocation}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}
                >
                  Try Auto-Detect Location
                </button>
                <button
                  onClick={() => setShowLocationSearch(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
                >
                  Search Location
                </button>
              </div>
            </div>
          ) : !currentLocation ? (
            <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
              <div className="text-6xl mb-4">🕌</div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                Welcome to Prayer Times
              </h3>
              <p className={`${themeClasses.subtitle} mb-6`}>
                To get accurate prayer times, we need to know your location.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleAutoDetectLocation}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton} ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Detecting...</span>
                    </div>
                  ) : (
                    'Auto-Detect Location'
                  )}
                </button>
                <button
                  onClick={() => setShowLocationSearch(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
                >
                  Search Location
                </button>
              </div>
            </div>
          ) : (
            <PrayerTimesContainer
              prayerTimes={prayerTimes}
              currentPrayer={currentPrayer}
              nextPrayer={nextPrayer}
              loading={loading}
              isDark={isDark}
            />
          )}
        </div>
      </main>

      {/* Location Search Modal */}
      {showLocationSearch && (
        <LocationSearch
          onLocationSelect={setLocation}
          onClose={() => setShowLocationSearch(false)}
          isDark={isDark}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
