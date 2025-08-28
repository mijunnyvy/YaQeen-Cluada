'use client';

import React from 'react';
import { Sun, Moon, CheckCircle, Circle } from 'lucide-react';
import AdkarItem from './AdkarItem';
import { useAdkarStore, AdkarPreferences } from '../hooks/useAdkarStore';

interface AdkarListProps {
  category: 'morning' | 'evening';
  preferences: AdkarPreferences;
  isDark?: boolean;
}

export default function AdkarList({
  category,
  preferences,
  isDark = false
}: AdkarListProps) {
  const { 
    getAdkarByCategory, 
    getAdkarProgress,
    getTodayStatus 
  } = useAdkarStore();

  const adkarList = getAdkarByCategory(category);
  const todayStatus = getTodayStatus();
  const isCompleted = category === 'morning' ? todayStatus.morning : todayStatus.evening;

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    morning: isDark ? "bg-amber-900/20 border-amber-600/30" : "bg-amber-50/80 border-amber-300/30",
    evening: isDark ? "bg-indigo-900/20 border-indigo-600/30" : "bg-indigo-50/80 border-indigo-300/30",
    completed: isDark ? "bg-green-900/20 border-green-600/30" : "bg-green-50/80 border-green-300/30",
  };

  const categoryTheme = category === 'morning' ? themeClasses.morning : themeClasses.evening;
  const categoryIcon = category === 'morning' ? Sun : Moon;
  const CategoryIcon = categoryIcon;

  const completedCount = adkarList.filter(adkar => {
    const progress = getAdkarProgress(adkar.id);
    return progress?.completed || false;
  }).length;

  return (
    <div>
      {/* Header */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl mb-6 ${
        isCompleted ? themeClasses.completed : categoryTheme
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CategoryIcon className={`w-8 h-8 ${
              category === 'morning' 
                ? (isDark ? 'text-amber-400' : 'text-amber-600')
                : (isDark ? 'text-indigo-400' : 'text-indigo-600')
            }`} />
            <div>
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
                {category === 'morning' ? 'Morning Adkar' : 'Evening Adkar'}
              </h2>
              <p className={`${themeClasses.subtitle}`}>
                {category === 'morning' 
                  ? 'Start your day with remembrance of Allah'
                  : 'End your day with gratitude and protection'
                }
              </p>
            </div>
          </div>

          <div className="text-center">
            {isCompleted ? (
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  Completed! ✨
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Circle className={`w-12 h-12 ${themeClasses.subtitle}`} />
                <span className={`text-sm ${themeClasses.subtitle}`}>
                  {completedCount}/{adkarList.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : category === 'morning'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${(completedCount / adkarList.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-sm">
          <span className={themeClasses.subtitle}>
            Progress: {completedCount} of {adkarList.length} completed
          </span>
          <span className={`font-medium ${
            isCompleted ? 'text-green-500' : themeClasses.accent
          }`}>
            {Math.round((completedCount / adkarList.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Adkar Items */}
      <div className="space-y-4">
        {adkarList.map((adkar, index) => {
          const progress = getAdkarProgress(adkar.id);
          
          return (
            <AdkarItem
              key={adkar.id}
              adkar={adkar}
              progress={progress}
              preferences={preferences}
              isDark={isDark}
              index={index + 1}
            />
          );
        })}
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-xl text-center ${themeClasses.completed}`}>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
            {category === 'morning' ? 'Morning Adkar Completed!' : 'Evening Adkar Completed!'}
          </h3>
          <p className={`${themeClasses.subtitle} mb-4`}>
            May Allah accept your remembrance and grant you His blessings.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className={`px-4 py-2 rounded-full ${
              category === 'morning' ? themeClasses.morning : themeClasses.evening
            }`}>
              ✅ {category === 'morning' ? 'Morning' : 'Evening'} Complete
            </span>
            <span className={themeClasses.subtitle}>
              Completed at {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      {!isCompleted && completedCount > 0 && (
        <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-xl text-center ${categoryTheme}`}>
          <div className="text-4xl mb-3">💪</div>
          <h3 className={`text-lg font-bold ${themeClasses.text} mb-2`}>
            Keep Going!
          </h3>
          <p className={`${themeClasses.subtitle}`}>
            You're doing great! Only {adkarList.length - completedCount} more to complete your {category} Adkar.
          </p>
        </div>
      )}

      {/* Getting Started Message */}
      {completedCount === 0 && (
        <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-xl text-center ${categoryTheme}`}>
          <div className="text-4xl mb-3">🌟</div>
          <h3 className={`text-lg font-bold ${themeClasses.text} mb-2`}>
            Begin Your {category === 'morning' ? 'Morning' : 'Evening'} Adkar
          </h3>
          <p className={`${themeClasses.subtitle} mb-4`}>
            Start with the first Adkar above. Each remembrance brings you closer to Allah's blessings.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              📖 {adkarList.length} Adkar to complete
            </span>
            <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              ⏱️ ~5-10 minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
