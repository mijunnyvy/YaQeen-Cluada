'use client';

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, BookOpen, Eye, EyeOff } from "lucide-react";
import { Verse } from "@/lib/quranApi";

interface VerseItemProps {
  verse: Verse;
  font: {
    style: string;
    size: string;
  };
  showTafsir: boolean;
  isDark?: boolean;
  onBookmark?: (verseNumber: number) => void;
  isBookmarked?: boolean;
  globalTafsirEnabled?: boolean;
}

export default function VerseItem({
  verse,
  font,
  showTafsir,
  isDark = false,
  onBookmark,
  isBookmarked = false,
  globalTafsirEnabled = false
}: VerseItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLocalTafsir, setShowLocalTafsir] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const themeClasses = {
    container: isDark
      ? "bg-gray-800/60 border-gray-700/50"
      : "bg-white/90 border-gray-200/50",
    arabicText: isDark ? "text-white" : "text-gray-900",
    translationText: isDark ? "text-gray-300" : "text-gray-700",
    tafsirBg: isDark ? "bg-emerald-900/30" : "bg-gray-100/30",
    tafsirText: isDark ? "text-gray-300" : "text-gray-700",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    playButton: isDark
      ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
      : "bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30",
    verseNumber: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  const handlePlayAudio = async () => {
    if (!verse.audioUrl) return;

    try {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(verse.audioUrl);
        audioRef.current = audio;

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          console.error('Error playing audio');
        };

        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const displayTafsir = globalTafsirEnabled ? showTafsir : (showTafsir || showLocalTafsir);

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${themeClasses.container}`}>
      {/* Verse Number Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${themeClasses.verseNumber} bg-emerald-500/10`}>
          <span className="ml-1">آية</span>
          <span className="mx-1">•</span>
          <span>{verse.number}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Tafsir Toggle - Only show if global Tafsir is not enabled */}
          {verse.tafsir && !globalTafsirEnabled && (
            <button
              onClick={() => setShowLocalTafsir(!showLocalTafsir)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                displayTafsir ? themeClasses.playButton : themeClasses.button
              }`}
              title={displayTafsir ? "Hide Tafsir" : "Show Tafsir"}
            >
              {displayTafsir ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Audio Play Button */}
          {verse.audioUrl && (
            <button
              onClick={handlePlayAudio}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.playButton}`}
              title={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Bookmark Button */}
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse.number)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isBookmarked ? themeClasses.playButton : themeClasses.button
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-4">
        <p
          className={`leading-loose text-right ${themeClasses.arabicText}`}
          style={{
            fontFamily: font.style === "amiri" ? "Amiri Quran, serif" : "inherit",
            fontSize: `${font.size}px`,
            lineHeight: '2'
          }}
          dir="rtl"
        >
          {verse.text}
        </p>
      </div>

      {/* Translation */}
      {verse.translation && (
        <div className="mb-4">
          <div className={`text-sm font-medium mb-2 ${themeClasses.translationText} opacity-75`}>
            Translation:
          </div>
          <p className={`leading-relaxed ${themeClasses.translationText}`} style={{ fontSize: '14px' }}>
            {verse.translation}
          </p>
        </div>
      )}

      {/* Tafsir */}
      {displayTafsir && verse.tafsir && (
        <div className={`mt-4 p-4 rounded-xl ${themeClasses.tafsirBg}`}>
          <div className="flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className={`text-sm font-medium ${themeClasses.tafsirText}`}>
              Tafsir (Commentary):
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${themeClasses.tafsirText}`}>
            {verse.tafsir}
          </p>
        </div>
      )}

      {/* Audio Element (hidden) */}
      {verse.audioUrl && (
        <audio
          ref={audioRef}
          preload="none"
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
