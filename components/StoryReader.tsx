'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, 
  Minus, 
  Plus, 
  BookOpen, 
  Lightbulb, 
  Quote, 
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette
} from 'lucide-react';
import { Story, ReadingProgress, UserPreferences } from '../hooks/useStoriesStore';

interface StoryReaderProps {
  story: Story;
  progress: ReadingProgress | undefined;
  onProgressUpdate: (storyId: string, progress: number, position: number) => void;
  preferences: UserPreferences;
  onPreferencesUpdate: (preferences: Partial<UserPreferences>) => void;
  showSettings: boolean;
  onSettingsToggle: (show: boolean) => void;
  isDark?: boolean;
}

export default function StoryReader({
  story,
  progress,
  onProgressUpdate,
  preferences,
  onPreferencesUpdate,
  showSettings,
  onSettingsToggle,
  isDark = false
}: StoryReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMoral, setShowMoral] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
    accent: isDark ? "text-purple-400" : "text-purple-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    moral: isDark ? "bg-emerald-900/20 border-emerald-600/30" : "bg-emerald-50/80 border-emerald-300/30",
  };

  // Font size classes
  const fontSizeClasses = {
    small: 'text-sm leading-relaxed',
    medium: 'text-base leading-relaxed',
    large: 'text-lg leading-relaxed',
    xlarge: 'text-xl leading-relaxed',
  };

  // Font family classes
  const fontFamilyClasses = {
    amiri: 'font-amiri',
    'noto-kufi': 'font-noto-kufi',
    inter: 'font-inter',
    'arabic-ui': 'font-arabic-ui',
  };

  // Theme classes for reading
  const readingThemeClasses = {
    light: isDark ? "bg-gray-800/60 text-white" : "bg-white/90 text-gray-900",
    dark: "bg-gray-900/90 text-gray-100",
    sepia: "bg-amber-50/90 text-amber-900",
  };

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        setScrollProgress(progress);
        
        // Update reading progress
        if (progress > (progress?.progress || 0)) {
          onProgressUpdate(story.id, progress, scrollTop);
        }
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [story.id, onProgressUpdate, progress?.progress]);

  // Restore scroll position
  useEffect(() => {
    if (contentRef.current && progress?.lastPosition) {
      contentRef.current.scrollTop = progress.lastPosition;
    }
  }, [progress?.lastPosition]);

  const handleFontSizeChange = (size: UserPreferences['fontSize']) => {
    onPreferencesUpdate({ fontSize: size });
  };

  const handleFontFamilyChange = (family: UserPreferences['fontFamily']) => {
    onPreferencesUpdate({ fontFamily: family });
  };

  const handleThemeChange = (theme: UserPreferences['theme']) => {
    onPreferencesUpdate({ theme });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Settings Panel */}
      {showSettings && (
        <div className={`mb-6 p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
          <h3 className={`text-lg font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
            <Type className="w-5 h-5" />
            <span>Reading Settings</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Font Size */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Font Size
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFontSizeChange('small')}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    preferences.fontSize === 'small' ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`text-sm ${themeClasses.subtitle} min-w-[60px] text-center`}>
                  {preferences.fontSize.toUpperCase()}
                </span>
                <button
                  onClick={() => handleFontSizeChange('xlarge')}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    preferences.fontSize === 'xlarge' ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Font Family
              </label>
              <select
                value={preferences.fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value as UserPreferences['fontFamily'])}
                className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                  isDark
                    ? "bg-gray-700/80 border-gray-600/50 text-white"
                    : "bg-white/90 border-gray-300/50 text-gray-900"
                }`}
              >
                <option value="amiri">Amiri (Arabic)</option>
                <option value="noto-kufi">Noto Kufi Arabic</option>
                <option value="inter">Inter</option>
                <option value="arabic-ui">Arabic UI</option>
              </select>
            </div>

            {/* Reading Theme */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Reading Theme
              </label>
              <div className="flex space-x-2">
                {(['light', 'dark', 'sepia'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 capitalize ${
                      preferences.theme === theme ? themeClasses.activeButton : themeClasses.button
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`mb-6 p-4 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${themeClasses.text}`}>
            Reading Progress
          </span>
          <span className={`text-sm ${themeClasses.subtitle}`}>
            {Math.round(scrollProgress)}%
          </span>
        </div>
        <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Story Content */}
      <div 
        ref={contentRef}
        className={`rounded-2xl border backdrop-blur-xl overflow-y-auto max-h-[70vh] ${
          readingThemeClasses[preferences.theme]
        } ${themeClasses.card.split(' ')[1]}`}
      >
        <div className="p-8">
          {/* Story Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{story.thumbnail}</div>
            <h1 className={`text-3xl font-bold mb-2 ${fontFamilyClasses[preferences.fontFamily]}`}>
              {story.title}
            </h1>
            {story.titleArabic && (
              <h2 className={`text-2xl ${themeClasses.gold} mb-4 font-arabic`}>
                {story.titleArabic}
              </h2>
            )}
            <div className="flex items-center justify-center space-x-4 text-sm opacity-75">
              <span>📖 {story.category}</span>
              <span>⏱️ {story.estimatedReadTime} min</span>
              <span>👥 {story.ageGroup}</span>
            </div>
          </div>

          {/* Story Content */}
          <div 
            className={`prose prose-lg max-w-none ${fontSizeClasses[preferences.fontSize]} ${fontFamilyClasses[preferences.fontFamily]}`}
            style={{ 
              color: preferences.theme === 'sepia' ? '#92400e' : 
                     preferences.theme === 'dark' ? '#f3f4f6' : 
                     isDark ? '#ffffff' : '#111827'
            }}
          >
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related Verses */}
          {story.relatedVerses && story.relatedVerses.length > 0 && (
            <div className={`mt-8 p-6 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-600/30' : 'bg-blue-50/80 border-blue-300/30'}`}>
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

          {/* Moral/Lesson */}
          <div className="mt-8">
            <button
              onClick={() => setShowMoral(!showMoral)}
              className={`w-full p-4 rounded-xl border transition-all duration-300 ${themeClasses.moral}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className={`w-5 h-5 ${themeClasses.accent}`} />
                  <span className={`font-bold ${themeClasses.text}`}>
                    Moral & Lesson
                  </span>
                </div>
                {showMoral ? (
                  <ChevronUp className={`w-5 h-5 ${themeClasses.accent}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${themeClasses.accent}`} />
                )}
              </div>
            </button>

            {showMoral && (
              <div className={`mt-4 p-6 rounded-xl border ${themeClasses.moral}`}>
                <div className={`${fontSizeClasses[preferences.fontSize]} ${fontFamilyClasses[preferences.fontFamily]}`}>
                  <p className="mb-4 text-justify leading-relaxed">
                    {story.moral}
                  </p>
                  {story.moralArabic && (
                    <p className={`${themeClasses.gold} text-right font-arabic text-lg`}>
                      {story.moralArabic}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Story Tags */}
          {story.tags.length > 0 && (
            <div className="mt-8">
              <h4 className={`font-medium ${themeClasses.text} mb-3`}>Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-lg text-sm ${isDark ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {scrollProgress >= 95 && (
            <div className={`mt-8 p-6 rounded-xl border text-center ${isDark ? 'bg-green-900/20 border-green-600/30' : 'bg-green-50/80 border-green-300/30'}`}>
              <Star className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'} mx-auto mb-2`} />
              <h3 className={`font-bold ${themeClasses.text} mb-2`}>
                Story Completed! 🎉
              </h3>
              <p className={`${themeClasses.subtitle}`}>
                You've finished reading this beautiful Islamic story. May its lessons inspire you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
