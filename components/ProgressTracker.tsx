'use client';

import React from 'react';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react';

interface ProgressTrackerProps {
  progress: number;
  category: 'morning' | 'evening';
  isDark?: boolean;
}

export default function ProgressTracker({
  progress,
  category,
  isDark = false
}: ProgressTrackerProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    progressBg: isDark ? "bg-gray-700" : "bg-gray-200",
  };

  const isCompleted = progress >= 100;
  const progressColor = isCompleted 
    ? 'from-green-500 to-emerald-500'
    : category === 'morning'
      ? 'from-amber-500 to-orange-500'
      : 'from-indigo-500 to-purple-500';

  const getProgressMessage = () => {
    if (isCompleted) {
      return category === 'morning' ? 'Morning Adkar Complete!' : 'Evening Adkar Complete!';
    }
    
    if (progress === 0) {
      return category === 'morning' ? 'Start your morning Adkar' : 'Begin your evening Adkar';
    }
    
    if (progress < 50) {
      return 'Keep going!';
    }
    
    return 'Almost there!';
  };

  const getProgressIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (progress > 0) {
      return <TrendingUp className={`w-5 h-5 ${
        category === 'morning' 
          ? (isDark ? 'text-amber-400' : 'text-amber-600')
          : (isDark ? 'text-indigo-400' : 'text-indigo-600')
      }`} />;
    }
    
    return <Circle className={`w-5 h-5 ${themeClasses.subtitle}`} />;
  };

  return (
    <div>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getProgressIcon()}
          <span className={`text-sm font-medium ${themeClasses.text}`}>
            {getProgressMessage()}
          </span>
        </div>
        
        <span className={`text-sm font-bold ${
          isCompleted ? 'text-green-500' : themeClasses.text
        }`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-3 ${themeClasses.progressBg} rounded-full overflow-hidden mb-2`}>
        <div
          className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-700 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Details */}
      <div className="flex items-center justify-between text-xs">
        <span className={themeClasses.subtitle}>
          {progress === 0 ? 'Not started' : progress < 100 ? 'In progress' : 'Completed'}
        </span>
        
        {isCompleted && (
          <span className="text-green-500 font-medium">
            ✨ Well done!
          </span>
        )}
      </div>

      {/* Motivational Messages */}
      {!isCompleted && progress > 0 && (
        <div className="mt-2">
          <div className={`text-xs ${themeClasses.subtitle} text-center`}>
            {progress < 25 && "Every step counts in remembering Allah"}
            {progress >= 25 && progress < 50 && "You're building a beautiful habit"}
            {progress >= 50 && progress < 75 && "More than halfway there!"}
            {progress >= 75 && "So close to completion!"}
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <div className="mt-2 text-center">
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
            🎉 May Allah accept your remembrance
          </div>
        </div>
      )}
    </div>
  );
}
