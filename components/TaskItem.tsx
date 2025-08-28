'use client';

import React, { useState } from 'react';
import { CheckCircle, Circle, Target, Calendar, Star, Clock } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { ZikrTask } from '@/hooks/useTasbihStore';

interface TaskItemProps {
  task: ZikrTask;
  onComplete: () => void;
  isDark?: boolean;
  isCompleted?: boolean;
}

export default function TaskItem({ task, onComplete, isDark = false, isCompleted = false }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const progress = (task.currentCount / task.targetCount) * 100;
  const today = new Date().toDateString();
  const completedToday = task.completedDates.includes(today);
  
  // Calculate streak for this specific task
  const getTaskStreak = () => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (task.completedDates.includes(dateString)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    completedContainer: isDark
      ? "bg-emerald-900/30 border-emerald-700/50"
      : "bg-emerald-50/80 border-emerald-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    completedButton: isDark
      ? "bg-green-600 text-white"
      : "bg-green-500 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    success: isDark ? "text-green-400" : "text-green-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  const streak = getTaskStreak();

  return (
    <div
      className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 transform hover:scale-105 ${
        completedToday ? themeClasses.completedContainer : themeClasses.container
      } ${isHovered ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-bold ${themeClasses.text} mb-1`}>
            {task.title}
          </h3>
          {task.isCustom && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${themeClasses.gold} bg-amber-500/10`}>
              <Star className="w-3 h-3 mr-1" />
              Custom
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {streak > 0 && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${themeClasses.accent} bg-emerald-500/10`}>
              <Calendar className="w-3 h-3" />
              <span>{streak}d</span>
            </div>
          )}
          
          {completedToday ? (
            <CheckCircle className={`w-6 h-6 ${themeClasses.success}`} />
          ) : (
            <Circle className={`w-6 h-6 ${themeClasses.subtitle}`} />
          )}
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-4 text-center">
        <div className={`text-xl font-bold mb-2 ${themeClasses.text}`} dir="rtl">
          {task.arabicText}
        </div>
        <div className={`text-sm ${themeClasses.subtitle} mb-1`}>
          {task.transliteration}
        </div>
        <div className={`text-xs ${themeClasses.subtitle}`}>
          {task.meaning}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-4">
        <ProgressRing
          progress={progress}
          size={120}
          strokeWidth={6}
          isDark={isDark}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.accent}`}>
              {task.currentCount}
            </div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              of {task.targetCount}
            </div>
          </div>
        </ProgressRing>
      </div>

      {/* Progress Details */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${themeClasses.subtitle}`}>Progress</span>
          <span className={`text-sm font-medium ${themeClasses.text}`}>
            {progress.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              completedToday
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : isDark 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-xl ${themeClasses.container} border text-center`}>
          <div className={`text-sm font-bold ${themeClasses.accent}`}>
            {task.targetCount}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>
            Target
          </div>
        </div>
        
        <div className={`p-3 rounded-xl ${themeClasses.container} border text-center`}>
          <div className={`text-sm font-bold ${themeClasses.gold}`}>
            {task.completedDates.length}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>
            Days
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!completedToday && (
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
            progress >= 100
              ? themeClasses.completedButton
              : themeClasses.button
          } ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {progress >= 100 ? (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Mark Complete</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Continue ({task.targetCount - task.currentCount} left)</span>
            </div>
          )}
        </button>
      )}

      {/* Completion Badge */}
      {completedToday && (
        <div className={`w-full py-3 rounded-xl font-medium text-center ${themeClasses.completedButton}`}>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Completed Today!</span>
          </div>
        </div>
      )}

      {/* Completion Animation */}
      {completedToday && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl animate-pulse" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${themeClasses.success} bg-current rounded-full animate-ping`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
