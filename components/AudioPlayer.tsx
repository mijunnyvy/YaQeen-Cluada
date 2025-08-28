'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Settings,
  Lightbulb,
  Quote,
  Star
} from 'lucide-react';
import { Story, ReadingProgress, UserPreferences } from '../hooks/useStoriesStore';

interface AudioPlayerProps {
  story: Story;
  progress: ReadingProgress | undefined;
  onProgressUpdate: (storyId: string, progress: number, position: number) => void;
  preferences: UserPreferences;
  onPreferencesUpdate: (preferences: Partial<UserPreferences>) => void;
  showSettings: boolean;
  onSettingsToggle: (show: boolean) => void;
  isDark?: boolean;
}

export default function AudioPlayer({
  story,
  progress,
  onProgressUpdate,
  preferences,
  onPreferencesUpdate,
  showSettings,
  onSettingsToggle,
  isDark = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [highlightedParagraph, setHighlightedParagraph] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"
      : "bg-gradient-to-br from-purple-50 via-white to-indigo-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-purple-600 text-white"
      : "bg-purple-500 text-white",
    playButton: isDark
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-purple-500 hover:bg-purple-600 text-white",
    accent: isDark ? "text-purple-400" : "text-purple-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    highlight: isDark ? "bg-purple-900/40 border-purple-600/50" : "bg-purple-50/80 border-purple-300/50",
  };

  // Initialize audio
  useEffect(() => {
    if (audioRef.current && story.audioUrl) {
      audioRef.current.src = story.audioUrl;
      audioRef.current.volume = volume;
    }
  }, [story.audioUrl, volume]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Update progress
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      onProgressUpdate(story.id, progressPercent, audio.currentTime);
      
      // Update highlighted paragraph based on time
      const paragraphs = story.content.split('\n\n');
      const timePerParagraph = audio.duration / paragraphs.length;
      const currentParagraph = Math.floor(audio.currentTime / timePerParagraph);
      setHighlightedParagraph(currentParagraph);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onProgressUpdate(story.id, 100, audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [story.id, story.content, onProgressUpdate]);

  // Restore playback position
  useEffect(() => {
    if (audioRef.current && progress?.lastPosition) {
      audioRef.current.currentTime = progress.lastPosition;
    }
  }, [progress?.lastPosition]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
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

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const paragraphs = story.content.split('\n\n');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <audio ref={audioRef} preload="metadata" />

      {/* Audio Player Controls */}
      <div className={`mb-6 p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        {/* Story Info */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{story.thumbnail}</div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
            {story.title}
          </h2>
          {story.titleArabic && (
            <p className={`text-xl ${themeClasses.gold} font-arabic`}>
              {story.titleArabic}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${themeClasses.subtitle}`}>
              {formatTime(currentTime)}
            </span>
            <span className={`text-sm ${themeClasses.subtitle}`}>
              {formatTime(duration)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={restart}
            className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={skipBackward}
            className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
            title="Skip back 10s"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            className={`p-4 rounded-full transition-all duration-300 hover:scale-110 ${themeClasses.playButton}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={skipForward}
            className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
            title="Skip forward 10s"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all duration-300 ${themeClasses.button}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-3">
          <VolumeX className={`w-4 h-4 ${themeClasses.subtitle}`} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <Volume2 className={`w-4 h-4 ${themeClasses.subtitle}`} />
        </div>

        {/* Playback Speed */}
        {showSettings && (
          <div className="mt-6 pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${themeClasses.subtitle}`}>Playback Speed:</span>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.playbackRate = speed;
                    }
                    onPreferencesUpdate({ playbackSpeed: speed });
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    preferences.playbackSpeed === speed ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transcript Toggle */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}
        >
          {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
        </button>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card} max-h-96 overflow-y-auto`}>
          <h3 className={`text-lg font-bold ${themeClasses.text} mb-4`}>
            Story Transcript
          </h3>
          
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-justify leading-relaxed transition-all duration-300 p-3 rounded-lg ${
                  index === highlightedParagraph 
                    ? `${themeClasses.highlight} border` 
                    : themeClasses.text
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Story Moral */}
      <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-xl ${isDark ? 'bg-emerald-900/20 border-emerald-600/30' : 'bg-emerald-50/80 border-emerald-300/30'}`}>
        <h3 className={`font-bold ${themeClasses.text} mb-3 flex items-center space-x-2`}>
          <Lightbulb className="w-5 h-5" />
          <span>Moral & Lesson</span>
        </h3>
        <p className={`${themeClasses.text} mb-3 leading-relaxed`}>
          {story.moral}
        </p>
        {story.moralArabic && (
          <p className={`${themeClasses.gold} text-right font-arabic text-lg`}>
            {story.moralArabic}
          </p>
        )}
      </div>

      {/* Related Verses */}
      {story.relatedVerses && story.relatedVerses.length > 0 && (
        <div className={`mt-6 p-6 rounded-2xl border backdrop-blur-xl ${isDark ? 'bg-blue-900/20 border-blue-600/30' : 'bg-blue-50/80 border-blue-300/30'}`}>
          <h3 className={`font-bold ${themeClasses.text} mb-3 flex items-center space-x-2`}>
            <Quote className="w-5 h-5" />
            <span>Related Quranic Verses</span>
          </h3>
          <div className="space-y-2">
            {story.relatedVerses.map((verse, index) => (
              <div key={index} className={`text-sm ${themeClasses.subtitle}`}>
                📖 {verse}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {currentTime >= duration * 0.95 && duration > 0 && (
        <div className={`mt-6 p-6 rounded-2xl border text-center ${isDark ? 'bg-green-900/20 border-green-600/30' : 'bg-green-50/80 border-green-300/30'}`}>
          <Star className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'} mx-auto mb-2`} />
          <h3 className={`font-bold ${themeClasses.text} mb-2`}>
            Story Completed! 🎉
          </h3>
          <p className={`${themeClasses.subtitle}`}>
            You've finished listening to this beautiful Islamic story. May its lessons inspire you!
          </p>
        </div>
      )}
    </div>
  );
}
