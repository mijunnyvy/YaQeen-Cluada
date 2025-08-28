'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Star,
  BookOpen,
  Brain,
  Check
} from 'lucide-react';
import { BeautifulName, UserPreferences, useNamesStore } from '../hooks/useNamesStore';

interface NameCardProps {
  name: BeautifulName;
  preferences: UserPreferences;
  isDark?: boolean;
}

export default function NameCard({
  name,
  preferences,
  isDark = false
}: NameCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { 
    toggleFavorite, 
    updateLearningProgress, 
    isFavorited, 
    isMemorized,
    getLearningProgress 
  } = useNamesStore();

  const isFav = isFavorited(name.id);
  const isMemorizedName = isMemorized(name.id);
  const progress = getLearningProgress(name.id);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white",
    arabic: isDark ? "text-amber-300" : "text-amber-700",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    memorized: isDark ? "bg-green-900/20 border-green-600/30" : "bg-green-50/80 border-green-300/30",
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  const arabicFontSizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
  };

  const handleFavorite = () => {
    setIsAnimating(true);
    toggleFavorite(name.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleMemorize = () => {
    updateLearningProgress(name.id, !isMemorizedName, true);
  };

  const playAudio = () => {
    if (name.audioUrl) {
      const audio = new Audio(name.audioUrl);
      audio.play().catch(console.error);
    } else {
      // Fallback: use speech synthesis for pronunciation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(name.transliteration);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'mercy': '💙',
      'power': '⚡',
      'knowledge': '🧠',
      'creation': '🌱',
      'guidance': '🌟',
      'protection': '🛡️',
      'forgiveness': '🤲',
      'sustenance': '🍃',
      'justice': '⚖️',
      'beauty': '✨',
    };
    return icons[category] || '🕌';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'mercy': isDark ? 'bg-blue-800/40 text-blue-300' : 'bg-blue-100 text-blue-700',
      'power': isDark ? 'bg-yellow-800/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
      'knowledge': isDark ? 'bg-purple-800/40 text-purple-300' : 'bg-purple-100 text-purple-700',
      'creation': isDark ? 'bg-green-800/40 text-green-300' : 'bg-green-100 text-green-700',
      'guidance': isDark ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-100 text-amber-700',
      'protection': isDark ? 'bg-indigo-800/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
      'forgiveness': isDark ? 'bg-emerald-800/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      'sustenance': isDark ? 'bg-teal-800/40 text-teal-300' : 'bg-teal-100 text-teal-700',
      'justice': isDark ? 'bg-red-800/40 text-red-300' : 'bg-red-100 text-red-700',
      'beauty': isDark ? 'bg-pink-800/40 text-pink-300' : 'bg-pink-100 text-pink-700',
    };
    return colors[category] || (isDark ? 'bg-gray-800/40 text-gray-300' : 'bg-gray-100 text-gray-700');
  };

  return (
    <div className={`group relative rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-xl ${
      isMemorizedName ? themeClasses.memorized : themeClasses.card
    } ${isAnimating ? 'scale-110' : ''}`}>
      {/* Number Badge */}
      <div className="absolute -top-2 -left-2 z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isMemorizedName ? 'bg-green-500 text-white' : themeClasses.activeButton
        }`}>
          {name.id}
        </div>
      </div>

      {/* Memorized Badge */}
      {isMemorizedName && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(name.category)}`}>
              {getCategoryIcon(name.category)} {name.category}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={playAudio}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              title="Play Pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isFav 
                  ? 'text-red-500 bg-red-500/10' 
                  : themeClasses.button
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              title="Show Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic Name */}
        {(preferences.language === 'arabic' || preferences.language === 'both') && (
          <div className="text-center mb-4">
            <div className={`${themeClasses.arabic} ${arabicFontSizeClasses[preferences.fontSize]} font-arabic font-bold leading-relaxed`}>
              {name.arabic}
            </div>
          </div>
        )}

        {/* Transliteration */}
        {preferences.showTransliteration && (preferences.language === 'english' || preferences.language === 'both') && (
          <div className="text-center mb-3">
            <h3 className={`${fontSizeClasses[preferences.fontSize]} font-bold ${themeClasses.text}`}>
              {name.transliteration}
            </h3>
          </div>
        )}

        {/* English Name */}
        {(preferences.language === 'english' || preferences.language === 'both') && (
          <div className="text-center mb-4">
            <p className={`${fontSizeClasses[preferences.fontSize]} ${themeClasses.accent} font-medium`}>
              {name.english}
            </p>
          </div>
        )}

        {/* Meaning */}
        {preferences.showMeaning && (
          <div className="mb-4">
            <p className={`${fontSizeClasses[preferences.fontSize]} ${themeClasses.subtitle} text-center leading-relaxed`}>
              {name.meaning}
            </p>
          </div>
        )}

        {/* Learning Progress */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={themeClasses.subtitle}>
                Study Progress
              </span>
              <span className={themeClasses.subtitle}>
                {progress.attempts} attempts
              </span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress.attempts > 0 ? (progress.correctAnswers / progress.attempts) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Details Section */}
        {showDetails && preferences.showExplanation && (
          <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-gray-700/40 border-gray-600/50' : 'bg-gray-50/80 border-gray-200/50'}`}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center justify-between w-full mb-3 ${themeClasses.text}`}
            >
              <span className="font-medium">Detailed Explanation</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <p className={`text-sm ${themeClasses.subtitle} leading-relaxed`}>
              {name.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleMemorize}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
              isMemorizedName 
                ? 'bg-green-500 text-white' 
                : themeClasses.activeButton
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isMemorizedName ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Memorized</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Mark as Learned</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Memorization Celebration */}
        {isMemorizedName && (
          <div className={`mt-4 p-3 rounded-xl text-center ${isDark ? 'bg-green-900/20' : 'bg-green-50/80'}`}>
            <div className="text-lg mb-1">🎉</div>
            <p className={`text-xs font-medium text-green-600 dark:text-green-400`}>
              Alhamdulillah! You've memorized this beautiful name.
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
}
