'use client';

import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Volume2, 
  Heart, 
  Check, 
  X,
  SkipForward,
  SkipBack,
  Play,
  Pause
} from 'lucide-react';
import { BeautifulName, UserPreferences, useNamesStore } from '../hooks/useNamesStore';

interface FlashcardViewProps {
  names: BeautifulName[];
  preferences: UserPreferences;
  isDark?: boolean;
}

export default function FlashcardView({
  names,
  preferences,
  isDark = false
}: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledNames, setShuffledNames] = useState<BeautifulName[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const { 
    toggleFavorite, 
    updateLearningProgress, 
    isFavorited, 
    isMemorized 
  } = useNamesStore();

  const currentName = shuffledNames[currentIndex];

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
    flashcard: isDark ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-white to-gray-50",
  };

  // Initialize shuffled names
  useEffect(() => {
    setShuffledNames([...names]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [names]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && shuffledNames.length > 0) {
      const interval = setInterval(() => {
        if (isFlipped) {
          handleNext();
        } else {
          setIsFlipped(true);
        }
      }, 3000);
      setAutoPlayInterval(interval);
      return () => clearInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  }, [isAutoPlay, isFlipped, currentIndex, shuffledNames.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shuffledNames.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + shuffledNames.length) % shuffledNames.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setShuffledNames(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    if (currentName) {
      updateLearningProgress(currentName.id, true, true);
      handleNext();
    }
  };

  const handleUnknown = () => {
    if (currentName) {
      updateLearningProgress(currentName.id, false, false);
      handleNext();
    }
  };

  const playAudio = () => {
    if (currentName?.audioUrl) {
      const audio = new Audio(currentName.audioUrl);
      audio.play().catch(console.error);
    } else if (currentName && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentName.transliteration);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  if (!currentName) {
    return (
      <div className={`text-center p-12 ${themeClasses.card} rounded-2xl backdrop-blur-xl border`}>
        <div className="text-6xl mb-4">📚</div>
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          No Names Available
        </h3>
        <p className={themeClasses.subtitle}>
          Please adjust your filters to see flashcards.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`text-lg font-bold ${themeClasses.text}`}>
              {currentIndex + 1} of {shuffledNames.length}
            </span>
            
            <div className={`w-full max-w-xs h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / shuffledNames.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShuffle}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Shuffle Cards"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={toggleAutoPlay}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isAutoPlay ? themeClasses.activeButton : themeClasses.button
              }`}
              title={isAutoPlay ? 'Stop Auto-play' : 'Start Auto-play'}
            >
              {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={playAudio}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Play Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleFavorite(currentName.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isFavorited(currentName.id) 
                  ? 'text-red-500 bg-red-500/10' 
                  : themeClasses.button
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorited(currentName.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-6">
        <div 
          className={`relative w-full h-96 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of Card */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl border backdrop-blur-xl ${themeClasses.flashcard} ${themeClasses.card.split(' ')[1]} backface-hidden flex flex-col items-center justify-center p-8`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <div className={`text-6xl ${themeClasses.arabic} font-arabic font-bold mb-4`}>
                {currentName.arabic}
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                {currentName.transliteration}
              </div>
              <div className="text-sm text-gray-500 mt-8">
                Click to reveal meaning
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl border backdrop-blur-xl ${themeClasses.flashcard} ${themeClasses.card.split(' ')[1]} backface-hidden flex flex-col items-center justify-center p-8 rotate-y-180`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold ${themeClasses.accent} mb-4`}>
                {currentName.english}
              </div>
              <div className={`text-lg ${themeClasses.text} mb-4 leading-relaxed`}>
                {currentName.meaning}
              </div>
              <div className={`text-sm ${themeClasses.subtitle} leading-relaxed`}>
                {currentName.explanation}
              </div>
              <div className="text-sm text-gray-500 mt-8">
                Click to flip back
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Learning Buttons */}
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
            title="Previous Card"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
            title="Next Card"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Learning Buttons */}
        {isFlipped && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUnknown}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-red-500 hover:bg-red-600 text-white"
            >
              <X className="w-5 h-5" />
              <span>Need Practice</span>
            </button>

            <button
              onClick={handleKnown}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-green-500 hover:bg-green-600 text-white"
            >
              <Check className="w-5 h-5" />
              <span>I Know This</span>
            </button>
          </div>
        )}

        {/* Flip Button */}
        {!isFlipped && (
          <button
            onClick={handleFlip}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reveal Meaning</span>
          </button>
        )}
      </div>

      {/* Study Progress */}
      <div className={`mt-6 p-4 rounded-xl ${themeClasses.card} backdrop-blur-xl border`}>
        <div className="flex items-center justify-between text-sm">
          <span className={themeClasses.subtitle}>
            Study Progress: {shuffledNames.filter(name => isMemorized(name.id)).length} of {shuffledNames.length} memorized
          </span>
          <span className={themeClasses.subtitle}>
            {isAutoPlay ? 'Auto-play: ON' : 'Manual mode'}
          </span>
        </div>
      </div>
    </div>
  );
}
