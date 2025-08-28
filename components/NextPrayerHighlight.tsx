'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Bell, Star } from 'lucide-react';

interface NextPrayerHighlightProps {
  nextPrayer: string;
  timeToNext: number;
  currentPrayer: string | null;
  isDark?: boolean;
}

export default function NextPrayerHighlight({
  nextPrayer,
  timeToNext,
  currentPrayer,
  isDark = false
}: NextPrayerHighlightProps) {
  const [countdown, setCountdown] = useState(timeToNext);

  useEffect(() => {
    setCountdown(timeToNext);
  }, [timeToNext]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressPercentage = () => {
    if (timeToNext === 0) return 100;
    const elapsed = timeToNext - countdown;
    return Math.min((elapsed / timeToNext) * 100, 100);
  };

  const getPrayerIcon = (prayer: string) => {
    const icons: Record<string, string> = {
      'Fajr': '🌅',
      'Dhuhr': '☀️',
      'Asr': '🌤️',
      'Maghrib': '🌅',
      'Isha': '🌙',
    };
    return icons[prayer] || '🕌';
  };

  const getPrayerArabic = (prayer: string) => {
    const arabic: Record<string, string> = {
      'Fajr': 'الفجر',
      'Dhuhr': 'الظهر',
      'Asr': 'العصر',
      'Maghrib': 'المغرب',
      'Isha': 'العشاء',
    };
    return arabic[prayer] || '';
  };

  const themeClasses = {
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    success: isDark ? "text-green-400" : "text-green-600",
  };

  return (
    <div className={`p-6 rounded-3xl border backdrop-blur-xl ${themeClasses.card} relative overflow-hidden`}>
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 animate-pulse"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${isDark ? 'bg-emerald-400/30' : 'bg-emerald-500/30'} rounded-full animate-bounce`}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 60}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          {/* Current Prayer Status */}
          {currentPrayer && (
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-green-800/40' : 'bg-green-100'}`}>
                <Star className={`w-5 h-5 ${themeClasses.success}`} />
              </div>
              <div>
                <p className={`text-sm ${themeClasses.subtitle}`}>Current Prayer</p>
                <p className={`font-bold ${themeClasses.success}`}>
                  {getPrayerIcon(currentPrayer)} {currentPrayer}
                </p>
              </div>
            </div>
          )}

          {/* Next Prayer Info */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-800/40' : 'bg-emerald-100'}`}>
              <Bell className={`w-5 h-5 ${themeClasses.accent}`} />
            </div>
            <div className="text-right">
              <p className={`text-sm ${themeClasses.subtitle}`}>Next Prayer</p>
              <p className={`font-bold ${themeClasses.accent}`}>
                {getPrayerIcon(nextPrayer)} {nextPrayer}
              </p>
            </div>
          </div>
        </div>

        {/* Main Countdown Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-6xl animate-pulse">
              {getPrayerIcon(nextPrayer)}
            </div>
            <div>
              <h2 className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
                {nextPrayer}
              </h2>
              <p className={`text-2xl ${themeClasses.gold} font-arabic`}>
                {getPrayerArabic(nextPrayer)}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'} mb-4`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className={`w-6 h-6 ${themeClasses.accent}`} />
              <span className={`text-sm font-medium ${themeClasses.subtitle}`}>
                Time Remaining
              </span>
            </div>
            <div className={`text-3xl font-mono font-bold ${themeClasses.text}`}>
              {formatCountdown(countdown)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className={themeClasses.subtitle}>Started</span>
              <span className={themeClasses.subtitle}>
                {Math.round(getProgressPercentage())}% elapsed
              </span>
              <span className={themeClasses.subtitle}>Next Prayer</span>
            </div>
          </div>
        </div>

        {/* Prayer Reminder */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-900/20 border-amber-600/30' : 'bg-amber-50/80 border-amber-300/30'} text-center`}>
          <p className={`text-sm ${themeClasses.gold} font-medium`}>
            🤲 Prepare for the next prayer • Stay in a state of remembrance
          </p>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />
    </div>
  );
}
