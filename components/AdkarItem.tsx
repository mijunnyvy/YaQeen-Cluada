'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  CheckCircle, 
  Circle, 
  Volume2, 
  VolumeX, 
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { AdkarItem as AdkarItemType, AdkarProgress, AdkarPreferences, useAdkarStore } from '../hooks/useAdkarStore';

interface AdkarItemProps {
  adkar: AdkarItemType;
  progress: AdkarProgress | null;
  preferences: AdkarPreferences;
  isDark?: boolean;
  index: number;
}

export default function AdkarItem({
  adkar,
  progress,
  preferences,
  isDark = false,
  index
}: AdkarItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { updateAdkarCount } = useAdkarStore();

  const currentCount = progress?.currentCount || 0;
  const isCompleted = progress?.completed || false;
  const remainingCount = Math.max(0, adkar.repetitions - currentCount);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    incrementButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    decrementButton: isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
    resetButton: isDark
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : "bg-orange-500 hover:bg-orange-600 text-white",
    completed: isDark ? "bg-green-900/20 border-green-600/30" : "bg-green-50/80 border-green-300/30",
    arabic: isDark ? "text-amber-300" : "text-amber-700",
    counter: isDark ? "bg-gray-700/80" : "bg-gray-100/80",
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  const handleIncrement = () => {
    if (currentCount < adkar.repetitions) {
      setIsAnimating(true);
      updateAdkarCount(adkar.id, true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      updateAdkarCount(adkar.id, false);
    }
  };

  const handleReset = () => {
    // Reset to 0 by calling decrement multiple times
    for (let i = 0; i < currentCount; i++) {
      updateAdkarCount(adkar.id, false);
    }
  };

  const playAudio = () => {
    if (adkar.audioUrl && preferences.playAudio) {
      const audio = new Audio(adkar.audioUrl);
      audio.play().catch(console.error);
    }
  };

  return (
    <div className={`rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
      isCompleted ? themeClasses.completed : themeClasses.card
    } ${isAnimating ? 'scale-105' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isCompleted ? 'bg-green-500 text-white' : themeClasses.counter
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : index}
            </div>
            <div>
              <h3 className={`font-bold ${themeClasses.text}`}>
                Adkar #{index}
              </h3>
              <p className={`text-sm ${themeClasses.subtitle}`}>
                Repeat {adkar.repetitions} time{adkar.repetitions > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {adkar.audioUrl && (
              <button
                onClick={playAudio}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                title="Play Audio"
              >
                {preferences.playAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              title="Show Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic Text */}
        {(preferences.language === 'arabic' || preferences.language === 'both') && (
          <div className={`mb-4 p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <p className={`${themeClasses.arabic} ${fontSizeClasses[preferences.fontSize]} font-arabic text-right leading-relaxed`}>
              {adkar.arabicText}
            </p>
          </div>
        )}

        {/* Transliteration */}
        {preferences.showTransliteration && (preferences.language === 'english' || preferences.language === 'both') && (
          <div className="mb-4">
            <p className={`${themeClasses.text} ${fontSizeClasses[preferences.fontSize]} italic leading-relaxed`}>
              {adkar.transliteration}
            </p>
          </div>
        )}

        {/* Translation */}
        {preferences.showTranslation && (preferences.language === 'english' || preferences.language === 'both') && (
          <div className="mb-6">
            <p className={`${themeClasses.subtitle} ${fontSizeClasses[preferences.fontSize]} leading-relaxed`}>
              {adkar.translation}
            </p>
          </div>
        )}

        {/* Counter Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Decrement Button */}
            <button
              onClick={handleDecrement}
              disabled={currentCount === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentCount > 0 ? themeClasses.decrementButton : themeClasses.button
              }`}
            >
              <Minus className="w-5 h-5" />
            </button>

            {/* Counter Display */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${isCompleted ? 'text-green-500' : themeClasses.text}`}>
                {currentCount}
              </div>
              <div className={`text-sm ${themeClasses.subtitle}`}>
                of {adkar.repetitions}
              </div>
            </div>

            {/* Increment Button */}
            <button
              onClick={handleIncrement}
              disabled={currentCount >= adkar.repetitions}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentCount < adkar.repetitions ? themeClasses.incrementButton : themeClasses.button
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Status and Reset */}
          <div className="flex items-center space-x-3">
            {currentCount > 0 && (
              <button
                onClick={handleReset}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${themeClasses.resetButton}`}
                title="Reset Counter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <div className="text-center">
              {isCompleted ? (
                <div className="flex items-center space-x-1 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Circle className={`w-5 h-5 ${themeClasses.subtitle}`} />
                  <span className={`text-sm ${themeClasses.subtitle}`}>
                    {remainingCount} left
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden mb-4`}>
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${(currentCount / adkar.repetitions) * 100}%` }}
          />
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-gray-700/40 border-gray-600/50' : 'bg-gray-50/80 border-gray-200/50'}`}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center justify-between w-full mb-3 ${themeClasses.text}`}
            >
              <span className="font-medium">Additional Information</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className={`font-medium ${themeClasses.text}`}>Source: </span>
                <span className={themeClasses.subtitle}>{adkar.source}</span>
              </div>
              
              {adkar.benefits && (
                <div>
                  <span className={`font-medium ${themeClasses.text}`}>Benefits: </span>
                  <span className={themeClasses.subtitle}>{adkar.benefits}</span>
                </div>
              )}
              
              <div>
                <span className={`font-medium ${themeClasses.text}`}>Category: </span>
                <span className={`px-2 py-1 rounded ${
                  adkar.category === 'morning' 
                    ? (isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700')
                    : (isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700')
                }`}>
                  {adkar.category === 'morning' ? '🌅 Morning' : '🌙 Evening'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {isCompleted && (
          <div className={`mt-4 p-4 rounded-xl text-center ${isDark ? 'bg-green-900/20' : 'bg-green-50/80'}`}>
            <div className="text-2xl mb-2">✨</div>
            <p className={`text-sm font-medium text-green-600 dark:text-green-400`}>
              Adkar completed! May Allah accept your remembrance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
