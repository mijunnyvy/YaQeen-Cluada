'use client';

import React, { useState } from 'react';
import { Calendar, List, Grid3X3, Sun, Sunrise } from 'lucide-react';
import PrayerTimeCard from './PrayerTimeCard';
import PrayerTimesTable from './PrayerTimesTable';
import { DayPrayerTimes } from '../hooks/usePrayerTimesStore';

interface PrayerTimesContainerProps {
  prayerTimes: DayPrayerTimes[];
  currentPrayer: string | null;
  nextPrayer: string | null;
  loading: boolean;
  isDark?: boolean;
}

export default function PrayerTimesContainer({
  prayerTimes,
  currentPrayer,
  nextPrayer,
  loading,
  isDark = false
}: PrayerTimesContainerProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDay, setSelectedDay] = useState(0);

  const themeClasses = {
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className={`${themeClasses.subtitle}`}>Loading prayer times...</p>
      </div>
    );
  }

  if (prayerTimes.length === 0) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
        <div className="text-4xl mb-4">🕌</div>
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
          No Prayer Times Available
        </h3>
        <p className={`${themeClasses.subtitle}`}>
          Please check your location and try again.
        </p>
      </div>
    );
  }

  const todayPrayers = prayerTimes[selectedDay] || prayerTimes[0];

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className={`p-4 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <div className="flex items-center justify-between">
          {/* Day Selector */}
          <div className="flex space-x-2 overflow-x-auto">
            {prayerTimes.slice(0, 7).map((day, index) => {
              const date = new Date(day.date);
              const isToday = index === 0;
              const isSelected = selectedDay === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[80px] ${
                    isSelected ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  <span className="text-xs font-medium mb-1">
                    {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold">
                    {date.getDate()}
                  </span>
                  <span className="text-xs opacity-75">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-2 p-2 rounded-xl bg-gray-200/50 dark:bg-gray-800/50">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'cards' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">Cards</span>
            </button>
            
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'table' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <List className="w-4 h-4" />
              <span className="font-medium">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Day Info */}
      <div className={`p-4 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text} mb-1`}>
              {selectedDay === 0 ? 'Today' : new Date(todayPrayers.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className={`${themeClasses.gold} text-sm`}>
              {todayPrayers.hijriDate} AH
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Sunrise className={`w-4 h-4 ${themeClasses.accent}`} />
              <span className={themeClasses.subtitle}>Sunrise: {todayPrayers.sunrise}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sun className={`w-4 h-4 ${themeClasses.gold}`} />
              <span className={themeClasses.subtitle}>Sunset: {todayPrayers.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Times Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {todayPrayers.prayers.map((prayer, index) => (
            <PrayerTimeCard
              key={index}
              prayer={prayer}
              isCurrent={currentPrayer === prayer.name}
              isNext={nextPrayer === prayer.name}
              isDark={isDark}
            />
          ))}
        </div>
      ) : (
        <PrayerTimesTable
          prayerTimes={prayerTimes.slice(0, 7)}
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
          isDark={isDark}
        />
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prayer Tips */}
        <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
          <h4 className={`font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
            <span>🤲</span>
            <span>Prayer Reminders</span>
          </h4>
          
          <div className="space-y-3">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-800/20' : 'bg-emerald-50/80'}`}>
              <p className={`text-sm ${themeClasses.accent} font-medium mb-1`}>
                Before Prayer
              </p>
              <p className={`text-xs ${themeClasses.subtitle}`}>
                Perform Wudu (ablution) and face the Qibla direction
              </p>
            </div>
            
            <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-800/20' : 'bg-amber-50/80'}`}>
              <p className={`text-sm ${themeClasses.gold} font-medium mb-1`}>
                During Prayer
              </p>
              <p className={`text-xs ${themeClasses.subtitle}`}>
                Focus on your connection with Allah and recite with presence
              </p>
            </div>
            
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-800/20' : 'bg-blue-50/80'}`}>
              <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'} font-medium mb-1`}>
                After Prayer
              </p>
              <p className={`text-xs ${themeClasses.subtitle}`}>
                Make Dhikr and Dua to continue remembering Allah
              </p>
            </div>
          </div>
        </div>

        {/* Qibla Direction */}
        <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
          <h4 className={`font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
            <span>🧭</span>
            <span>Qibla Direction</span>
          </h4>
          
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 ${isDark ? 'border-emerald-400' : 'border-emerald-500'} flex items-center justify-center relative`}>
              <div 
                className={`w-1 h-8 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full`}
                style={{ 
                  transform: `rotate(${todayPrayers.qibla || 0}deg)`,
                  transformOrigin: 'center bottom'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🕋</span>
              </div>
            </div>
            
            <p className={`text-lg font-bold ${themeClasses.accent} mb-1`}>
              {Math.round(todayPrayers.qibla || 0)}°
            </p>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              Direction to Makkah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
