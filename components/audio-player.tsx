'use client';

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Download,
  Settings,
  BookOpen
} from "lucide-react";
import { SurahData } from "@/lib/quranApi";
import LyricsDisplay from "./LyricsDisplay";

export interface AudioPlayerProps {
  surah: SurahData;
  isDark?: boolean;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  autoPlayNext?: boolean;
  showLyrics?: boolean;
  font?: {
    style: string;
    size: string;
  };
  showTafsir?: boolean;
}

type RepeatMode = 'none' | 'one' | 'all';

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surah,
  isDark = false,
  onNextSurah,
  onPrevSurah,
  autoPlayNext = false,
  showLyrics = true,
  font = { style: "amiri", size: "20" },
  showTafsir = false
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [isShuffled, setIsShuffled] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showLyricsView, setShowLyricsView] = useState(showLyrics);

  const themeClasses = {
    container: isDark
      ? "bg-gray-800/60 border-gray-700/50 text-white"
      : "bg-white/90 border-gray-200/50 text-gray-900",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    playButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    activeButton: isDark
      ? "bg-emerald-600/20 text-emerald-400"
      : "bg-emerald-500/20 text-emerald-600",
    text: isDark ? "text-gray-300" : "text-gray-600",
    title: isDark ? "text-white" : "text-gray-900",
    progress: isDark ? "bg-gray-700" : "bg-gray-200",
    progressFill: "bg-emerald-500",
  };

  const currentVerse = surah.verses[currentVerseIndex];

  // Load audio when verse changes
  useEffect(() => {
    if (currentVerse?.audioUrl && audioRef.current) {
      audioRef.current.src = currentVerse.audioUrl;
      audioRef.current.load();
    }
  }, [currentVerse]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [currentVerseIndex]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);

    if (repeatMode === 'one') {
      // Repeat current verse
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (currentVerseIndex < surah.verses.length - 1) {
      // Play next verse
      setCurrentVerseIndex(prev => prev + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } else if (repeatMode === 'all') {
      // Repeat from beginning
      setCurrentVerseIndex(0);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } else if (autoPlayNext && onNextSurah) {
      // Auto play next surah
      onNextSurah();
    }
  }, [repeatMode, currentVerseIndex, surah.verses.length, autoPlayNext, onNextSurah]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentVerse?.audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const playVerse = (index: number) => {
    setCurrentVerseIndex(index);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const nextVerse = () => {
    if (currentVerseIndex < surah.verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    } else if (onNextSurah) {
      onNextSurah();
    }
  };

  const prevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    } else if (onPrevSurah) {
      onPrevSurah();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'none': return 'one';
        case 'one': return 'all';
        case 'all': return 'none';
        default: return 'none';
      }
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${themeClasses.title}`}>
            {surah.surahNameEnglish || surah.surahName}
          </h3>
          <p className={`text-sm ${themeClasses.text}`}>
            Verse {currentVerseIndex + 1} of {surah.verses.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLyricsView(!showLyricsView)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              showLyricsView ? themeClasses.activeButton : themeClasses.button
            }`}
            title={showLyricsView ? "Hide Lyrics" : "Show Lyrics"}
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`mb-6 p-4 rounded-xl border ${themeClasses.container}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Playback Speed
              </label>
              <select
                value={playbackRate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value);
                  setPlaybackRate(rate);
                  if (audioRef.current) {
                    audioRef.current.playbackRate = rate;
                  }
                }}
                className={`w-full p-2 rounded-lg border ${themeClasses.button}`}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.text}`}>
                Auto-play Next
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoPlayNext}
                  onChange={() => {}}
                  className="rounded"
                />
                <span className={`text-sm ${themeClasses.text}`}>
                  {autoPlayNext ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className={themeClasses.text}>{formatTime(currentTime)}</span>
          <span className={themeClasses.text}>{formatTime(duration)}</span>
        </div>
        <div className={`w-full h-2 rounded-full ${themeClasses.progress}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${themeClasses.progressFill}`}
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="w-full h-2 opacity-0 absolute cursor-pointer"
          style={{ marginTop: '-8px' }}
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={prevVerse}
          className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={togglePlay}
          className={`p-4 rounded-full transition-all duration-300 ${themeClasses.playButton}`}
          disabled={!currentVerse?.audioUrl}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>

        <button
          onClick={nextVerse}
          className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={cycleRepeatMode}
            className={`p-2 rounded-lg transition-all duration-300 ${
              repeatMode !== 'none' ? themeClasses.activeButton : themeClasses.button
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isShuffled ? themeClasses.activeButton : themeClasses.button
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>

      {/* Lyrics Display or Verse List */}
      <div className="mt-6">
        {showLyricsView ? (
          <LyricsDisplay
            surah={surah}
            currentVerseIndex={currentVerseIndex}
            font={font}
            isDark={isDark}
            showTranslation={true}
            showTafsir={showTafsir}
          />
        ) : (
          <div className="max-h-40 overflow-y-auto">
            <h4 className={`text-sm font-medium mb-3 ${themeClasses.text}`}>Verses:</h4>
            <div className="space-y-1">
              {surah.verses.map((verse, index) => (
                <button
                  key={verse.number}
                  onClick={() => playVerse(index)}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-300 ${
                    index === currentVerseIndex
                      ? themeClasses.activeButton
                      : themeClasses.button
                  }`}
                >
                  <span className="text-sm">
                    Verse {verse.number}
                    {verse.translation && (
                      <span className={`block text-xs ${themeClasses.text} truncate`}>
                        {verse.translation.substring(0, 50)}...
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.playbackRate = playbackRate;
          }
        }}
      />
    </div>
  );
};

export default AudioPlayer;
