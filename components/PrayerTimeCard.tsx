'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Bell, Star, CheckCircle } from 'lucide-react';
import { PrayerTime } from '../hooks/usePrayerTimesStore';

interface PrayerTimeCardProps {
  prayer: PrayerTime;
  isCurrent: boolean;
  isNext: boolean;
  isDark?: boolean;
}

export default function PrayerTimeCard({
  prayer,
  isCurrent,
  isNext,
  isDark = false
}: PrayerTimeCardProps) {
  const [timeToNext, setTimeToNext] = useState(0);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const timeDiff = prayer.timestamp - now;
      setTimeToNext(timeDiff);
      setIsPast(timeDiff < 0);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [prayer.timestamp]);

  const formatTimeToNext = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Passed';
    
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getCardClasses = () => {
    let baseClasses = `p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-105 relative overflow-hidden`;
    
    if (isCurrent) {
      return `${baseClasses} ${isDark ? 'bg-green-900/40 border-green-600/50 shadow-green-500/20' : 'bg-green-50/80 border-green-300/50 shadow-green-500/20'} shadow-xl`;
    } else if (isNext) {
      return `${baseClasses} ${isDark ? 'bg-emerald-900/40 border-emerald-600/50 shadow-emerald-500/20' : 'bg-emerald-50/80 border-emerald-300/50 shadow-emerald-500/20'} shadow-xl`;
    } else if (isPast) {
      return `${baseClasses} ${isDark ? 'bg-gray-800/40 border-gray-700/50' : 'bg-gray-50/60 border-gray-300/50'} opacity-75`;
    } else {
      return `${baseClasses} ${isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`;
    }
  };

  const getTextClasses = () => {
    if (isCurrent) {
      return {
        primary: isDark ? 'text-green-300' : 'text-green-700',
        secondary: isDark ? 'text-green-400' : 'text-green-600',
        time: isDark ? 'text-white' : 'text-gray-900',
        arabic: isDark ? 'text-green-400' : 'text-green-600',
      };
    } else if (isNext) {
      return {
        primary: isDark ? 'text-emerald-300' : 'text-emerald-700',
        secondary: isDark ? 'text-emerald-400' : 'text-emerald-600',
        time: isDark ? 'text-white' : 'text-gray-900',
        arabic: isDark ? 'text-emerald-400' : 'text-emerald-600',
      };
    } else {
      return {
        primary: isDark ? 'text-white' : 'text-gray-900',
        secondary: isDark ? 'text-gray-300' : 'text-gray-600',
        time: isDark ? 'text-gray-200' : 'text-gray-800',
        arabic: isDark ? 'text-amber-400' : 'text-amber-600',
      };
    }
  };

  const textClasses = getTextClasses();

  return (
    <div className={getCardClasses()}>
      {/* Background Animation for Current/Next Prayer */}
      {(isCurrent || isNext) && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
      )}

      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {isCurrent && (
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${textClasses.secondary} animate-pulse`} />
            <span className={`text-xs font-medium ${textClasses.secondary}`}>Now</span>
          </div>
        )}
        {isNext && !isCurrent && (
          <div className="flex items-center space-x-1">
            <Bell className={`w-4 h-4 ${textClasses.secondary} animate-bounce`} />
            <span className={`text-xs font-medium ${textClasses.secondary}`}>Next</span>
          </div>
        )}
        {isPast && !isCurrent && (
          <CheckCircle className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        )}
      </div>

      {/* Prayer Icon */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-2 animate-pulse">
          {prayer.icon}
        </div>
        <div className={`w-12 h-1 mx-auto rounded-full ${
          isCurrent ? 'bg-green-500' : 
          isNext ? 'bg-emerald-500' : 
          isDark ? 'bg-gray-600' : 'bg-gray-300'
        }`} />
      </div>

      {/* Prayer Name */}
      <div className="text-center mb-4">
        <h3 className={`text-xl font-bold ${textClasses.primary} mb-1`}>
          {prayer.name}
        </h3>
        <p className={`text-lg ${textClasses.arabic} font-arabic`}>
          {prayer.arabicName}
        </p>
        <p className={`text-xs ${textClasses.secondary} mt-1`}>
          {prayer.description}
        </p>
      </div>

      {/* Prayer Time */}
      <div className="text-center mb-4">
        <div className={`text-2xl font-mono font-bold ${textClasses.time} mb-2`}>
          {prayer.time}
        </div>
        
        {/* Time to Next */}
        {!isPast && (
          <div className="flex items-center justify-center space-x-1">
            <Clock className={`w-3 h-3 ${textClasses.secondary}`} />
            <span className={`text-xs ${textClasses.secondary}`}>
              {isNext ? `in ${formatTimeToNext(timeToNext)}` : formatTimeToNext(timeToNext)}
            </span>
          </div>
        )}
        
        {isPast && (
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Prayer time has passed
          </div>
        )}
      </div>

      {/* Progress Indicator for Next Prayer */}
      {isNext && timeToNext > 0 && (
        <div className="mt-4">
          <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-1000"
              style={{ 
                width: `${Math.max(10, Math.min(90, (1 - timeToNext / (6 * 60 * 60 * 1000)) * 100))}%` 
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${textClasses.secondary}`}>Approaching</span>
            <span className={`text-xs ${textClasses.secondary}`}>Time</span>
          </div>
        </div>
      )}

      {/* Glow Effect for Current Prayer */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 pointer-events-none animate-pulse" />
      )}

      {/* Glow Effect for Next Prayer */}
      {isNext && !isCurrent && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
