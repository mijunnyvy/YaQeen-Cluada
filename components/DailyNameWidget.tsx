'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ArrowRight, 
  Volume2, 
  Heart, 
  Brain, 
  BookOpen,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useNamesStore } from '../hooks/useNamesStore';

interface DailyNameWidgetProps {
  isDark?: boolean;
}

export default function DailyNameWidget({ isDark = false }: DailyNameWidgetProps) {
  const [mounted, setMounted] = useState(false);
  
  const {
    dailyName,
    memorizedCount,
    favoriteNames,
    averageScore,
    isFavorited,
    toggleFavorite,
  } = useNamesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    arabic: isDark ? "text-amber-300" : "text-amber-700",
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

  const playAudio = () => {
    if (dailyName?.audioUrl) {
      const audio = new Audio(dailyName.audioUrl);
      audio.play().catch(console.error);
    } else if (dailyName && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(dailyName.transliteration);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleFavorite = () => {
    if (dailyName) {
      toggleFavorite(dailyName.id);
    }
  };

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeClasses.card}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🕌</div>
          <div>
            <h3 className={`text-lg font-bold ${themeClasses.text}`}>
              Beautiful Names of Allah
            </h3>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              Daily Name & Learning Progress
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-1">
          <Star className={`w-4 h-4 ${themeClasses.gold}`} />
          <span className={`text-lg font-bold ${themeClasses.text}`}>
            {memorizedCount}
          </span>
        </div>
      </div>

      {/* Daily Name */}
      {dailyName ? (
        <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-sm font-medium ${themeClasses.accent}`}>
              Name of the Day
            </span>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl ${themeClasses.arabic} font-arabic font-bold mb-2`}>
              {dailyName.arabic}
            </div>
            
            <div className={`text-lg font-bold ${themeClasses.text} mb-1`}>
              {dailyName.transliteration}
            </div>
            
            <div className={`text-sm ${themeClasses.accent} mb-2`}>
              {dailyName.english}
            </div>
            
            <p className={`text-xs ${themeClasses.subtitle} leading-relaxed`}>
              {dailyName.meaning.length > 80 
                ? dailyName.meaning.substring(0, 80) + '...'
                : dailyName.meaning
              }
            </p>
          </div>

          {/* Daily Name Actions */}
          <div className="flex items-center justify-center space-x-2 mt-3">
            <button
              onClick={playAudio}
              className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-600/60 hover:bg-gray-500/60' : 'bg-gray-200/60 hover:bg-gray-300/60'}`}
              title="Play Pronunciation"
            >
              <Volume2 className="w-3 h-3" />
            </button>
            
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isFavorited(dailyName.id) 
                  ? 'text-red-500 bg-red-500/10' 
                  : isDark ? 'bg-gray-600/60 hover:bg-gray-500/60' : 'bg-gray-200/60 hover:bg-gray-300/60'
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-3 h-3 ${isFavorited(dailyName.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-xl mb-4 text-center ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="text-2xl mb-2">🌟</div>
          <div className={`text-sm ${themeClasses.text}`}>
            Discover Allah's Beautiful Names
          </div>
        </div>
      )}

      {/* Learning Progress */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.accent}`}>
            99
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>Total Names</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.gold}`}>
            {memorizedCount}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>Memorized</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.accent}`}>
            {favoriteNames.length}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>Favorites</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs ${themeClasses.subtitle}`}>
            Learning Progress
          </span>
          <span className={`text-xs ${themeClasses.subtitle}`}>
            {Math.round((memorizedCount / 99) * 100)}%
          </span>
        </div>
        <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${(memorizedCount / 99) * 100}%` }}
          />
        </div>
      </div>

      {/* Learning Features */}
      <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50/80'}`}>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <BookOpen className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Browse</div>
          </div>
          <div>
            <Brain className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Flashcards</div>
          </div>
          <div>
            <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Quiz</div>
          </div>
        </div>
      </div>

      {/* Quiz Score */}
      {averageScore > 0 && (
        <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-green-900/20' : 'bg-green-50/80'}`}>
          <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {Math.round(averageScore)}%
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>
            Average Quiz Score
          </div>
        </div>
      )}

      {/* Action Button */}
      <Link href="/names">
        <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.button}`}>
          <div className="flex items-center justify-center space-x-2">
            {memorizedCount > 0 ? (
              <>
                <Brain className="w-4 h-4" />
                <span>Continue Learning</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                <span>Start Learning Names</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </Link>

      {/* Quick Tip */}
      <div className="mt-3 text-center">
        <p className={`text-xs ${themeClasses.subtitle}`}>
          {memorizedCount === 0 
            ? "Begin your journey of learning Allah's beautiful attributes"
            : memorizedCount < 33
              ? "Great progress! Keep learning more names"
              : memorizedCount < 66
                ? "Excellent! You're halfway through all 99 names"
                : memorizedCount < 99
                  ? "Amazing! You're almost done with all names"
                  : "Masha'Allah! You've learned all 99 beautiful names!"
          }
        </p>
      </div>
    </div>
  );
}
