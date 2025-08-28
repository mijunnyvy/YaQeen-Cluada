'use client';

import React from 'react';
import { Flame, Award, Calendar, TrendingUp, Star } from 'lucide-react';
import { StreakData } from '../hooks/useAdkarStore';

interface StreakCounterProps {
  streakData: StreakData;
  isDark?: boolean;
}

export default function StreakCounter({
  streakData,
  isDark = false
}: StreakCounterProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    flame: isDark ? "text-orange-400" : "text-orange-500",
    award: isDark ? "text-yellow-400" : "text-yellow-500",
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'Master', icon: '👑', color: 'text-purple-500' };
    if (streak >= 21) return { level: 'Expert', icon: '🏆', color: 'text-yellow-500' };
    if (streak >= 14) return { level: 'Advanced', icon: '🥇', color: 'text-blue-500' };
    if (streak >= 7) return { level: 'Intermediate', icon: '🥈', color: 'text-green-500' };
    if (streak >= 3) return { level: 'Beginner', icon: '🥉', color: 'text-orange-500' };
    return { level: 'Starter', icon: '🌱', color: 'text-gray-500' };
  };

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start your Adkar journey today!";
    if (streak === 1) return "Great start! Keep the momentum going.";
    if (streak < 7) return "Building a beautiful habit!";
    if (streak < 14) return "One week strong! Amazing consistency.";
    if (streak < 21) return "Two weeks of devotion! Incredible!";
    if (streak < 30) return "Three weeks of remembrance! Outstanding!";
    return "A month of consistent Adkar! Truly inspiring!";
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const motivationalMessage = getMotivationalMessage(streakData.currentStreak);

  return (
    <div className="space-y-4">
      {/* Current Streak */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Flame className={`w-6 h-6 ${themeClasses.flame}`} />
          <span className={`text-3xl font-bold ${themeClasses.text}`}>
            {streakData.currentStreak}
          </span>
        </div>
        <p className={`text-sm ${themeClasses.subtitle}`}>
          Day{streakData.currentStreak !== 1 ? 's' : ''} in a row
        </p>
      </div>

      {/* Streak Level */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-2xl">{streakLevel.icon}</span>
          <span className={`font-bold ${streakLevel.color}`}>
            {streakLevel.level}
          </span>
        </div>
        <p className={`text-xs ${themeClasses.subtitle}`}>
          {motivationalMessage}
        </p>
      </div>

      {/* Progress to Next Level */}
      {streakData.currentStreak < 30 && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={themeClasses.subtitle}>Next level</span>
            <span className={themeClasses.subtitle}>
              {streakData.currentStreak < 3 ? 3 - streakData.currentStreak : 
               streakData.currentStreak < 7 ? 7 - streakData.currentStreak :
               streakData.currentStreak < 14 ? 14 - streakData.currentStreak :
               streakData.currentStreak < 21 ? 21 - streakData.currentStreak :
               30 - streakData.currentStreak} days to go
            </span>
          </div>
          <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ 
                width: `${
                  streakData.currentStreak < 3 ? (streakData.currentStreak / 3) * 100 :
                  streakData.currentStreak < 7 ? ((streakData.currentStreak - 3) / 4) * 100 :
                  streakData.currentStreak < 14 ? ((streakData.currentStreak - 7) / 7) * 100 :
                  streakData.currentStreak < 21 ? ((streakData.currentStreak - 14) / 7) * 100 :
                  ((streakData.currentStreak - 21) / 9) * 100
                }%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Award className={`w-4 h-4 ${themeClasses.award}`} />
            <span className={`text-lg font-bold ${themeClasses.text}`}>
              {streakData.longestStreak}
            </span>
          </div>
          <p className={`text-xs ${themeClasses.subtitle}`}>
            Best streak
          </p>
        </div>

        <div>
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-lg font-bold ${themeClasses.text}`}>
              {streakData.totalDaysCompleted}
            </span>
          </div>
          <p className={`text-xs ${themeClasses.subtitle}`}>
            Total days
          </p>
        </div>
      </div>

      {/* Achievements */}
      {streakData.currentStreak > 0 && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Star className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-sm font-medium ${themeClasses.text}`}>
              Achievements
            </span>
          </div>
          
          <div className="space-y-1 text-xs">
            {streakData.currentStreak >= 1 && (
              <div className="flex items-center space-x-2">
                <span>🌱</span>
                <span className={themeClasses.subtitle}>First day of Adkar</span>
              </div>
            )}
            {streakData.currentStreak >= 3 && (
              <div className="flex items-center space-x-2">
                <span>🥉</span>
                <span className={themeClasses.subtitle}>3-day consistency</span>
              </div>
            )}
            {streakData.currentStreak >= 7 && (
              <div className="flex items-center space-x-2">
                <span>🥈</span>
                <span className={themeClasses.subtitle}>One week strong</span>
              </div>
            )}
            {streakData.currentStreak >= 14 && (
              <div className="flex items-center space-x-2">
                <span>🥇</span>
                <span className={themeClasses.subtitle}>Two weeks devoted</span>
              </div>
            )}
            {streakData.currentStreak >= 21 && (
              <div className="flex items-center space-x-2">
                <span>🏆</span>
                <span className={themeClasses.subtitle}>Three weeks committed</span>
              </div>
            )}
            {streakData.currentStreak >= 30 && (
              <div className="flex items-center space-x-2">
                <span>👑</span>
                <span className={themeClasses.subtitle}>One month master</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Encouragement */}
      {streakData.currentStreak === 0 && (
        <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50/80'}`}>
          <div className="text-2xl mb-2">🌟</div>
          <p className={`text-sm font-medium ${themeClasses.text}`}>
            Start Your Journey
          </p>
          <p className={`text-xs ${themeClasses.subtitle}`}>
            Complete both morning and evening Adkar to begin your streak!
          </p>
        </div>
      )}
    </div>
  );
}
