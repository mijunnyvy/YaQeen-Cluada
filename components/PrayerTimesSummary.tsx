'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, MapPin, Bell, Star, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePrayerTimesStore } from '../hooks/usePrayerTimesStore';

interface PrayerTimesSummaryProps {
  isDark?: boolean;
}

export default function PrayerTimesSummary({ isDark = false }: PrayerTimesSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState('');

  const {
    currentLocation,
    prayerTimes,
    currentPrayer,
    nextPrayer,
    timeToNextPrayer,
    loading,
    error,
    getCurrentLocation,
    setLocation,
  } = usePrayerTimesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect location on first load
  useEffect(() => {
    if (mounted && !currentLocation && !loading) {
      handleAutoDetectLocation();
    }
  }, [mounted, currentLocation, loading]);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeToNextPrayer > 0) {
        const hours = Math.floor(timeToNextPrayer / (1000 * 60 * 60));
        const minutes = Math.floor((timeToNextPrayer % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeToNextPrayer % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setCountdown(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setCountdown(`${minutes}m ${seconds}s`);
        } else {
          setCountdown(`${seconds}s`);
        }
      } else {
        setCountdown('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeToNextPrayer]);

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

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    currentPrayer: isDark ? "bg-green-900/40 border-green-600/50" : "bg-green-50/80 border-green-300/50",
    nextPrayer: isDark ? "bg-emerald-900/40 border-emerald-600/50" : "bg-emerald-50/80 border-emerald-300/50",
    button: isDark
      ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25"
      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30",
  };

  const getPrayerIcon = (prayerName: string) => {
    const icons: Record<string, string> = {
      'Fajr': '🌅',
      'Dhuhr': '☀️',
      'Asr': '🌤️',
      'Maghrib': '🌅',
      'Isha': '🌙',
    };
    return icons[prayerName] || '🕌';
  };

  const getPrayerArabic = (prayerName: string) => {
    const arabic: Record<string, string> = {
      'Fajr': 'الفجر',
      'Dhuhr': 'الظهر',
      'Asr': 'العصر',
      'Maghrib': 'المغرب',
      'Isha': 'العشاء',
    };
    return arabic[prayerName] || '';
  };

  if (!mounted) {
    return (
      <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !currentLocation) {
    return (
      <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className={`text-lg font-bold ${themeClasses.text}`}>أوقات الصلاة</h4>
            <p className={`text-sm ${themeClasses.subtitle}`}>Prayer Times</p>
          </div>
        </div>

        <div className="text-center py-4">
          <MapPin className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
          <p className={`${themeClasses.subtitle} mb-4`}>
            {error || 'Location needed for prayer times'}
          </p>
          <button
            onClick={handleAutoDetectLocation}
            disabled={loading}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${themeClasses.button}`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Detecting...</span>
              </div>
            ) : (
              'Detect Location'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (loading || prayerTimes.length === 0) {
    return (
      <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className={`text-lg font-bold ${themeClasses.text}`}>أوقات الصلاة</h4>
            <p className={`text-sm ${themeClasses.subtitle}`}>Prayer Times</p>
          </div>
        </div>

        <div className="text-center py-4">
          <RefreshCw className={`w-8 h-8 ${themeClasses.accent} mx-auto mb-3 animate-spin`} />
          <p className={`${themeClasses.subtitle}`}>Loading prayer times...</p>
        </div>
      </div>
    );
  }

  const todayPrayers = prayerTimes[0];
  const currentPrayerData = currentPrayer ? todayPrayers?.prayers.find(p => p.name === currentPrayer) : null;
  const nextPrayerData = nextPrayer ? todayPrayers?.prayers.find(p => p.name === nextPrayer) : null;

  return (
    <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className={`text-lg font-bold ${themeClasses.text}`}>أوقات الصلاة</h4>
            <p className={`text-sm ${themeClasses.subtitle}`}>Prayer Times</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-xs ${themeClasses.subtitle}`}>
            {currentLocation.city}, {currentLocation.country}
          </p>
          <p className={`text-xs ${themeClasses.gold}`}>
            {todayPrayers?.hijriDate} AH
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Current Prayer */}
        {currentPrayerData && (
          <div className={`${themeClasses.currentPrayer} border rounded-xl p-4 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getPrayerIcon(currentPrayerData.name)}</div>
                <div>
                  <p className={`text-lg font-bold ${themeClasses.text}`}>
                    {getPrayerArabic(currentPrayerData.name)} - {currentPrayerData.name}
                  </p>
                  <p className={`text-sm ${themeClasses.subtitle}`}>الصلاة الحالية / Current Prayer</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${themeClasses.accent}`}>{currentPrayerData.time}</p>
                <div className="flex items-center justify-end space-x-1">
                  <Star className="w-3 h-3 text-green-500 animate-pulse" />
                  <span className={`text-xs ${themeClasses.subtitle}`}>Now</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Prayer */}
        {nextPrayerData && (
          <div className={`${themeClasses.nextPrayer} border rounded-xl p-4 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 animate-pulse" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getPrayerIcon(nextPrayerData.name)}</div>
                <div>
                  <p className={`text-lg font-semibold ${themeClasses.text}`}>
                    {getPrayerArabic(nextPrayerData.name)} - {nextPrayerData.name}
                  </p>
                  <p className={`text-sm ${themeClasses.subtitle}`}>الصلاة التالية / Next Prayer</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${themeClasses.accent}`}>{nextPrayerData.time}</p>
                <div className="flex items-center justify-end space-x-1">
                  <Bell className="w-3 h-3 text-emerald-500 animate-bounce" />
                  <span className={`text-xs ${themeClasses.subtitle}`}>
                    {countdown ? `in ${countdown}` : 'Soon'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Prayers Quick View */}
        {!currentPrayerData && !nextPrayerData && todayPrayers && (
          <div className="grid grid-cols-5 gap-2">
            {todayPrayers.prayers.map((prayer, index) => (
              <div key={index} className="text-center p-2 rounded-lg bg-gray-500/10">
                <div className="text-lg mb-1">{getPrayerIcon(prayer.name)}</div>
                <div className={`text-xs font-medium ${themeClasses.text}`}>{prayer.name}</div>
                <div className={`text-xs ${themeClasses.subtitle}`}>{prayer.time}</div>
              </div>
            ))}
          </div>
        )}

        <Link href="/prayer-times">
          <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.button}`}>
            <span className="flex items-center justify-center space-x-2">
              <span>عرض جميع الأوقات / View All Times</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
