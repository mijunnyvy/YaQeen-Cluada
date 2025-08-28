'use client';

import React from 'react';
import { Calendar, Award, TrendingUp, Flame } from 'lucide-react';

interface StreakTrackerProps {
  streak: number;
  isDark?: boolean;
}

export default function StreakTracker({ streak, isDark = false }: StreakTrackerProps) {
  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    flame: isDark ? "text-orange-400" : "text-orange-500",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  const getStreakLevel = () => {
    if (streak >= 100) return { level: 'Legendary', color: 'text-purple-500', icon: '👑' };
    if (streak >= 50) return { level: 'Master', color: 'text-amber-500', icon: '🏆' };
    if (streak >= 30) return { level: 'Expert', color: 'text-blue-500', icon: '💎' };
    if (streak >= 14) return { level: 'Advanced', color: 'text-green-500', icon: '⭐' };
    if (streak >= 7) return { level: 'Committed', color: 'text-emerald-500', icon: '🌟' };
    if (streak >= 3) return { level: 'Building', color: 'text-yellow-500', icon: '🔥' };
    return { level: 'Starting', color: 'text-gray-500', icon: '🌱' };
  };

  const streakLevel = getStreakLevel();

  const getMotivationalMessage = () => {
    if (streak === 0) return "Start your spiritual journey today!";
    if (streak === 1) return "Great start! Keep the momentum going.";
    if (streak < 7) return "Building a strong foundation!";
    if (streak < 14) return "You're developing a great habit!";
    if (streak < 30) return "Impressive dedication!";
    if (streak < 50) return "You're truly committed to your spiritual growth!";
    if (streak < 100) return "Master level dedication! Amazing!";
    return "Legendary spiritual warrior! Subhan Allah!";
  };

  // Generate calendar view for last 7 days
  const getLastSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const isActive = i < streak;
      const isToday = i === 0;
      
      days.push({
        date,
        isActive,
        isToday,
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    
    return days;
  };

  const lastSevenDays = getLastSevenDays();

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Flame className={`w-6 h-6 ${streak > 0 ? themeClasses.flame : themeClasses.subtitle}`} />
        <h3 className={`font-bold ${themeClasses.text}`}>Streak Tracker</h3>
      </div>

      {/* Main Streak Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className={`text-5xl font-bold ${themeClasses.accent} mb-2`}>
            {streak}
          </div>
          
          {/* Streak Animation */}
          {streak > 0 && (
            <div className="absolute -top-2 -right-2">
              <div className={`text-2xl animate-bounce`}>
                {streakLevel.icon}
              </div>
            </div>
          )}
        </div>
        
        <div className={`text-lg font-medium ${themeClasses.text} mb-1`}>
          {streak === 1 ? 'Day' : 'Days'} Streak
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${streakLevel.color} bg-current bg-opacity-10`}>
          <span className="mr-1">{streakLevel.icon}</span>
          {streakLevel.level}
        </div>
      </div>

      {/* Motivational Message */}
      <div className={`text-center mb-6 p-4 rounded-xl ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50/80'} border border-emerald-500/20`}>
        <p className={`text-sm ${themeClasses.text} font-medium`}>
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Last 7 Days Calendar */}
      <div className="mb-6">
        <h4 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
          Last 7 Days
        </h4>
        
        <div className="grid grid-cols-7 gap-1">
          {lastSevenDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`text-xs ${themeClasses.subtitle} mb-1`}>
                {day.dayName}
              </div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  day.isActive
                    ? day.isToday
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent'
                      : 'bg-emerald-500/80 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Milestones */}
      <div>
        <h4 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
          Next Milestone
        </h4>
        
        <div className="space-y-2">
          {[3, 7, 14, 30, 50, 100].map((milestone) => {
            if (streak >= milestone) return null;
            
            const progress = (streak / milestone) * 100;
            const remaining = milestone - streak;
            
            return (
              <div key={milestone} className="first:block hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${themeClasses.text}`}>
                    {milestone} Days
                  </span>
                  <span className={`text-xs ${themeClasses.subtitle}`}>
                    {remaining} more
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isDark 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {streak >= 100 && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20">
              <div className="text-2xl mb-2">🎉</div>
              <p className={`text-sm ${themeClasses.text} font-medium`}>
                You've reached the highest milestone!
              </p>
              <p className={`text-xs ${themeClasses.subtitle}`}>
                Keep up the amazing work!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Streak Benefits */}
      <div className="mt-6 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between text-xs">
          <div className="text-center">
            <div className={`font-bold ${themeClasses.accent}`}>
              {Math.floor(streak / 7)}
            </div>
            <div className={themeClasses.subtitle}>Weeks</div>
          </div>
          
          <div className="text-center">
            <div className={`font-bold ${themeClasses.gold}`}>
              {streak * 5}
            </div>
            <div className={themeClasses.subtitle}>Points</div>
          </div>
          
          <div className="text-center">
            <div className={`font-bold ${themeClasses.flame}`}>
              {streak > 0 ? '🔥' : '💤'}
            </div>
            <div className={themeClasses.subtitle}>Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}
