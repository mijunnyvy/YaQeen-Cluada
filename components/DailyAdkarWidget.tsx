'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Flame, 
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useAdkarStore } from '../hooks/useAdkarStore';

interface DailyAdkarWidgetProps {
  isDark?: boolean;
}

export default function DailyAdkarWidget({ isDark = false }: DailyAdkarWidgetProps) {
  const [mounted, setMounted] = useState(false);
  
  const {
    currentTimePeriod,
    morningProgress,
    eveningProgress,
    streakData,
    featuredAdkar,
    getTodayStatus,
  } = useAdkarStore();

  const todayStatus = getTodayStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    flame: isDark ? "text-orange-400" : "text-orange-500",
    morning: isDark ? "bg-amber-900/20 text-amber-300" : "bg-amber-100 text-amber-700",
    evening: isDark ? "bg-indigo-900/20 text-indigo-300" : "bg-indigo-100 text-indigo-700",
  };

  if (!mounted) {
    return (
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getCurrentTimeMessage = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', period: 'morning', icon: '🌅' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', period: 'afternoon', icon: '☀️' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', period: 'evening', icon: '🌆' };
    return { text: 'Good Night', period: 'night', icon: '🌙' };
  };

  const timeMessage = getCurrentTimeMessage();
  const bothCompleted = todayStatus.morning && todayStatus.evening;
  const overallProgress = (morningProgress + eveningProgress) / 2;

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeClasses.card}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🤲</div>
          <div>
            <h3 className={`text-lg font-bold ${themeClasses.text}`}>
              Daily Adkar
            </h3>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              {timeMessage.text} {timeMessage.icon}
            </p>
          </div>
        </div>

        {/* Streak Display */}
        <div className="flex items-center space-x-1">
          <Flame className={`w-4 h-4 ${themeClasses.flame}`} />
          <span className={`text-lg font-bold ${themeClasses.text}`}>
            {streakData.currentStreak}
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Morning Status */}
        <div className={`p-3 rounded-xl ${themeClasses.morning}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-medium">Morning</span>
            </div>
            {todayStatus.morning ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 opacity-50" />
            )}
          </div>
          
          <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${morningProgress}%` }}
            />
          </div>
          
          <div className="text-xs mt-1 opacity-75">
            {Math.round(morningProgress)}% complete
          </div>
        </div>

        {/* Evening Status */}
        <div className={`p-3 rounded-xl ${themeClasses.evening}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">Evening</span>
            </div>
            {todayStatus.evening ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 opacity-50" />
            )}
          </div>
          
          <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${eveningProgress}%` }}
            />
          </div>
          
          <div className="text-xs mt-1 opacity-75">
            {Math.round(eveningProgress)}% complete
          </div>
        </div>
      </div>

      {/* Featured Adkar or Status Message */}
      {featuredAdkar ? (
        <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Star className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-sm font-medium ${themeClasses.text}`}>
              Featured Adkar
            </span>
          </div>
          
          <div className={`text-sm ${themeClasses.gold} mb-1 font-arabic`}>
            {featuredAdkar.arabicText.length > 60 
              ? featuredAdkar.arabicText.substring(0, 60) + '...'
              : featuredAdkar.arabicText
            }
          </div>
          
          <div className={`text-xs ${themeClasses.subtitle}`}>
            {featuredAdkar.translation.length > 80 
              ? featuredAdkar.translation.substring(0, 80) + '...'
              : featuredAdkar.translation
            }
          </div>
        </div>
      ) : (
        <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="text-2xl mb-1">
            {bothCompleted ? '🎉' : overallProgress > 0 ? '💪' : '🌟'}
          </div>
          <div className={`text-sm ${themeClasses.text}`}>
            {bothCompleted 
              ? 'All Adkar completed today!'
              : overallProgress > 0 
                ? 'Keep up the great work!'
                : 'Start your Adkar journey'
            }
          </div>
        </div>
      )}

      {/* Current Time Recommendation */}
      <div className={`p-3 rounded-xl mb-4 ${
        currentTimePeriod === 'morning' ? themeClasses.morning :
        currentTimePeriod === 'evening' ? themeClasses.evening :
        isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'
      }`}>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentTimePeriod === 'morning' && !todayStatus.morning && 'Perfect time for Morning Adkar'}
            {currentTimePeriod === 'evening' && !todayStatus.evening && 'Perfect time for Evening Adkar'}
            {currentTimePeriod === 'morning' && todayStatus.morning && 'Morning Adkar completed ✅'}
            {currentTimePeriod === 'evening' && todayStatus.evening && 'Evening Adkar completed ✅'}
            {currentTimePeriod === 'other' && 'Visit anytime to complete your Adkar'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link href="/adkar">
        <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.button}`}>
          <div className="flex items-center justify-center space-x-2">
            {bothCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>View Completed Adkar</span>
              </>
            ) : overallProgress > 0 ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Continue Adkar</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span>Start Daily Adkar</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </Link>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className={themeClasses.subtitle}>
            Overall: {Math.round(overallProgress)}%
          </span>
          <span className={themeClasses.subtitle}>
            Streak: {streakData.currentStreak} days
          </span>
        </div>
        
        {bothCompleted && (
          <span className="text-green-500 font-medium">
            ✨ Perfect day!
          </span>
        )}
      </div>
    </div>
  );
}
