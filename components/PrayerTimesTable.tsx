'use client';

import React from 'react';
import { Star, Bell, CheckCircle, Calendar } from 'lucide-react';
import { DayPrayerTimes } from '../hooks/usePrayerTimesStore';

interface PrayerTimesTableProps {
  prayerTimes: DayPrayerTimes[];
  currentPrayer: string | null;
  nextPrayer: string | null;
  isDark?: boolean;
}

export default function PrayerTimesTable({
  prayerTimes,
  currentPrayer,
  nextPrayer,
  isDark = false
}: PrayerTimesTableProps) {
  const themeClasses = {
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    success: isDark ? "text-green-400" : "text-green-600",
    headerBg: isDark ? "bg-gray-700/60" : "bg-gray-50/80",
    rowHover: isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-50/60",
    currentRow: isDark ? "bg-green-900/30" : "bg-green-50/60",
    nextRow: isDark ? "bg-emerald-900/30" : "bg-emerald-50/60",
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

  const isPrayerCurrent = (prayerName: string, dayIndex: number) => {
    return dayIndex === 0 && currentPrayer === prayerName;
  };

  const isPrayerNext = (prayerName: string, dayIndex: number) => {
    return dayIndex === 0 && nextPrayer === prayerName;
  };

  const isPrayerPast = (timestamp: number) => {
    return Date.now() > timestamp;
  };

  const getRowClasses = (prayerName: string, dayIndex: number) => {
    if (isPrayerCurrent(prayerName, dayIndex)) {
      return `${themeClasses.currentRow} border-l-4 border-green-500`;
    } else if (isPrayerNext(prayerName, dayIndex)) {
      return `${themeClasses.nextRow} border-l-4 border-emerald-500`;
    } else {
      return themeClasses.rowHover;
    }
  };

  const getStatusIcon = (prayerName: string, dayIndex: number, timestamp: number) => {
    if (isPrayerCurrent(prayerName, dayIndex)) {
      return <Star className={`w-4 h-4 ${themeClasses.success} animate-pulse`} />;
    } else if (isPrayerNext(prayerName, dayIndex)) {
      return <Bell className={`w-4 h-4 ${themeClasses.accent} animate-bounce`} />;
    } else if (dayIndex === 0 && isPrayerPast(timestamp)) {
      return <CheckCircle className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />;
    }
    return null;
  };

  return (
    <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.card} overflow-hidden`}>
      {/* Table Header */}
      <div className={`p-4 ${themeClasses.headerBg} border-b border-gray-200/20 dark:border-gray-700/20`}>
        <div className="flex items-center space-x-2">
          <Calendar className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`text-lg font-bold ${themeClasses.text}`}>
            7-Day Prayer Schedule
          </h3>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${themeClasses.headerBg} border-b border-gray-200/20 dark:border-gray-700/20`}>
              <th className={`px-4 py-3 text-left text-sm font-medium ${themeClasses.subtitle}`}>
                Date
              </th>
              <th className={`px-4 py-3 text-center text-sm font-medium ${themeClasses.subtitle}`}>
                Fajr
              </th>
              <th className={`px-4 py-3 text-center text-sm font-medium ${themeClasses.subtitle}`}>
                Dhuhr
              </th>
              <th className={`px-4 py-3 text-center text-sm font-medium ${themeClasses.subtitle}`}>
                Asr
              </th>
              <th className={`px-4 py-3 text-center text-sm font-medium ${themeClasses.subtitle}`}>
                Maghrib
              </th>
              <th className={`px-4 py-3 text-center text-sm font-medium ${themeClasses.subtitle}`}>
                Isha
              </th>
            </tr>
          </thead>
          <tbody>
            {prayerTimes.map((day, dayIndex) => {
              const date = new Date(day.date);
              const isToday = dayIndex === 0;
              
              return (
                <tr 
                  key={dayIndex}
                  className={`border-b border-gray-200/10 dark:border-gray-700/10 transition-all duration-300 ${
                    isToday ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  {/* Date Column */}
                  <td className="px-4 py-4">
                    <div>
                      <div className={`font-medium ${themeClasses.text} flex items-center space-x-2`}>
                        {isToday && <span className="text-lg">📍</span>}
                        <span>
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                      <div className={`text-sm ${themeClasses.subtitle}`}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className={`text-xs ${themeClasses.gold}`}>
                        {day.hijriDate}
                      </div>
                    </div>
                  </td>

                  {/* Prayer Time Columns */}
                  {day.prayers.map((prayer, prayerIndex) => (
                    <td 
                      key={prayerIndex}
                      className={`px-4 py-4 text-center transition-all duration-300 ${getRowClasses(prayer.name, dayIndex)}`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getPrayerIcon(prayer.name)}</span>
                          {getStatusIcon(prayer.name, dayIndex, prayer.timestamp)}
                        </div>
                        
                        <div className={`font-mono font-medium ${
                          isPrayerCurrent(prayer.name, dayIndex) ? themeClasses.success :
                          isPrayerNext(prayer.name, dayIndex) ? themeClasses.accent :
                          themeClasses.text
                        }`}>
                          {prayer.time}
                        </div>
                        
                        {(isPrayerCurrent(prayer.name, dayIndex) || isPrayerNext(prayer.name, dayIndex)) && (
                          <div className={`text-xs font-medium ${
                            isPrayerCurrent(prayer.name, dayIndex) ? themeClasses.success : themeClasses.accent
                          }`}>
                            {isPrayerCurrent(prayer.name, dayIndex) ? 'Current' : 'Next'}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className={`p-4 ${themeClasses.headerBg} border-t border-gray-200/20 dark:border-gray-700/20`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className={`w-3 h-3 ${themeClasses.success}`} />
              <span className={themeClasses.subtitle}>Current Prayer</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bell className={`w-3 h-3 ${themeClasses.accent}`} />
              <span className={themeClasses.subtitle}>Next Prayer</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={themeClasses.subtitle}>Completed</span>
            </div>
          </div>
          
          <div className={`text-xs ${themeClasses.subtitle}`}>
            Times shown in local timezone
          </div>
        </div>
      </div>
    </div>
  );
}
