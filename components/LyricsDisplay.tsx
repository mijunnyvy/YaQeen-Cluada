'use client';

import React, { useEffect, useRef } from 'react';
import { SurahData, Verse } from '@/lib/quranApi';

interface LyricsDisplayProps {
  surah: SurahData;
  currentVerseIndex: number;
  font: {
    style: string;
    size: string;
  };
  isDark?: boolean;
  showTranslation?: boolean;
  showTafsir?: boolean;
}

export default function LyricsDisplay({
  surah,
  currentVerseIndex,
  font,
  isDark = false,
  showTranslation = true,
  showTafsir = false
}: LyricsDisplayProps) {
  const currentVerseRef = useRef<HTMLDivElement>(null);

  const themeClasses = {
    container: isDark 
      ? "bg-gray-900/80 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    currentVerse: isDark
      ? "bg-emerald-600/20 border-emerald-500/50 text-white"
      : "bg-emerald-500/20 border-emerald-500/50 text-gray-900",
    upcomingVerse: isDark
      ? "text-gray-400 border-gray-700/30"
      : "text-gray-600 border-gray-300/30",
    passedVerse: isDark
      ? "text-gray-500 border-gray-700/20"
      : "text-gray-500 border-gray-300/20",
    arabicText: isDark ? "text-white" : "text-gray-900",
    translationText: isDark ? "text-gray-300" : "text-gray-700",
    tafsirText: isDark ? "text-gray-400" : "text-gray-600",
    verseNumber: isDark ? "text-emerald-400" : "text-emerald-600",
    title: isDark ? "text-white" : "text-gray-900",
  };

  // Auto-scroll to current verse
  useEffect(() => {
    if (currentVerseRef.current) {
      currentVerseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentVerseIndex]);

  const getVerseStyle = (index: number) => {
    if (index === currentVerseIndex) {
      return `${themeClasses.currentVerse} scale-105 shadow-lg`;
    } else if (index < currentVerseIndex) {
      return themeClasses.passedVerse;
    } else {
      return themeClasses.upcomingVerse;
    }
  };

  const getVerseOpacity = (index: number) => {
    if (index === currentVerseIndex) {
      return 'opacity-100';
    } else if (Math.abs(index - currentVerseIndex) <= 2) {
      return 'opacity-80';
    } else if (Math.abs(index - currentVerseIndex) <= 4) {
      return 'opacity-60';
    } else {
      return 'opacity-40';
    }
  };

  return (
    <div className={`h-96 overflow-y-auto rounded-2xl border backdrop-blur-xl p-6 lyrics-container ${themeClasses.container}`}>
      {/* Header */}
      <div className="text-center mb-6 sticky top-0 bg-inherit backdrop-blur-xl pb-4">
        <h3 className={`text-lg font-bold ${themeClasses.title} mb-1`}>
          {surah.surahNameEnglish || surah.surahName}
        </h3>
        <p className={`text-sm ${themeClasses.upcomingVerse}`}>
          Verse {currentVerseIndex + 1} of {surah.verses.length}
        </p>
      </div>

      {/* Verses */}
      <div className="space-y-6">
        {surah.verses.map((verse, index) => (
          <div
            key={verse.number}
            ref={index === currentVerseIndex ? currentVerseRef : null}
            className={`p-4 rounded-xl border lyrics-verse ${
              index === currentVerseIndex ? 'lyrics-current' : ''
            } ${getVerseStyle(index)} ${getVerseOpacity(index)}`}
          >
            {/* Verse Number */}
            <div className="flex items-center justify-center mb-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                index === currentVerseIndex 
                  ? 'bg-emerald-500/30 text-emerald-300' 
                  : 'bg-gray-500/20 text-gray-500'
              }`}>
                <span className="ml-1">آية</span>
                <span className="mx-1">•</span>
                <span>{verse.number}</span>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="mb-4">
              <p
                className={`leading-loose text-center lyrics-text ${
                  index === currentVerseIndex ? themeClasses.arabicText : 'text-gray-500'
                }`}
                style={{
                  fontFamily: font.style === "amiri" ? "Amiri Quran, serif" : "inherit",
                  fontSize: index === currentVerseIndex ? `${parseInt(font.size) + 4}px` : `${font.size}px`,
                  lineHeight: '2'
                }}
                dir="rtl"
              >
                {verse.text}
              </p>
            </div>

            {/* Translation */}
            {showTranslation && verse.translation && (
              <div className="mb-3">
                <p className={`text-center leading-relaxed lyrics-text ${
                  index === currentVerseIndex ? themeClasses.translationText : 'text-gray-500'
                }`}
                style={{
                  fontSize: index === currentVerseIndex ? '16px' : '14px'
                }}>
                  {verse.translation}
                </p>
              </div>
            )}

            {/* Tafsir */}
            {showTafsir && verse.tafsir && (
              <div className={`mt-3 p-3 rounded-lg ${
                index === currentVerseIndex 
                  ? 'bg-blue-500/10 border border-blue-500/20' 
                  : 'bg-gray-500/10 border border-gray-500/20'
              } transition-all duration-500`}>
                <p className={`text-sm leading-relaxed lyrics-text ${
                  index === currentVerseIndex ? themeClasses.tafsirText : 'text-gray-500'
                }`}>
                  <span className="font-medium">Tafsir: </span>
                  {verse.tafsir}
                </p>
              </div>
            )}

            {/* Current Playing Indicator */}
            {index === currentVerseIndex && (
              <div className="flex items-center justify-center mt-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
