'use client';

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Clock,
  Home
} from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day';
  calendarMode: 'dual' | 'gregorian' | 'hijri';
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  onCalendarModeChange: (mode: 'dual' | 'gregorian' | 'hijri') => void;
  isDark?: boolean;
}

export default function CalendarHeader({
  currentDate,
  viewMode,
  calendarMode,
  onDateChange,
  onViewModeChange,
  onCalendarModeChange,
  isDark = false
}: CalendarHeaderProps) {
  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    onDateChange(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
    }
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatCurrentPeriod = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };

    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    return currentDate.toLocaleDateString('en-US', options);
  };

  // Simple Hijri date conversion for display
  const getHijriDate = () => {
    const HIJRI_EPOCH = new Date('622-07-16');
    const daysDiff = Math.floor((currentDate.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.367) + 1;
    const hijriMonths = ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    const hijriMonth = Math.floor((daysDiff % 354.367) / 29.5);
    
    return `${hijriMonths[Math.min(hijriMonth, 11)]} ${hijriYear} AH`;
  };

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
      {/* Main Navigation */}
      <div className="flex items-center justify-between mb-6">
        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleNavigation('prev')}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-[300px]">
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-1`}>
              {formatCurrentPeriod()}
            </h2>
            {(calendarMode === 'dual' || calendarMode === 'hijri') && (
              <p className={`text-sm ${themeClasses.gold}`}>
                {getHijriDate()}
              </p>
            )}
          </div>

          <button
            onClick={() => handleNavigation('next')}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={goToToday}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}
        >
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Today</span>
          </div>
        </button>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        {/* View Mode Toggle */}
        <div className="flex space-x-2 p-2 rounded-xl bg-gray-200/50 dark:bg-gray-800/50">
          {[
            { mode: 'month', label: 'Month', icon: Grid3X3 },
            { mode: 'week', label: 'Week', icon: List },
            { mode: 'day', label: 'Day', icon: Clock }
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === mode ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Calendar Mode Toggle */}
        <div className="flex space-x-2 p-2 rounded-xl bg-gray-200/50 dark:bg-gray-800/50">
          {[
            { mode: 'dual', label: 'Dual', icon: '📅' },
            { mode: 'gregorian', label: 'Gregorian', icon: '🗓️' },
            { mode: 'hijri', label: 'Hijri', icon: '🌙' }
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => onCalendarModeChange(mode as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                calendarMode === mode ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1 ${themeClasses.subtitle}`}>
              <CalendarIcon className="w-4 h-4" />
              <span>
                {viewMode === 'month' ? '42 days' : 
                 viewMode === 'week' ? '7 days' : 
                 '1 day'} view
              </span>
            </div>
            
            <div className={`flex items-center space-x-1 ${themeClasses.accent}`}>
              <span>•</span>
              <span>Islamic events highlighted</span>
            </div>
          </div>

          <div className={`text-xs ${themeClasses.subtitle}`}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
