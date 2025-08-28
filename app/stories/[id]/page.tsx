'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Settings, 
  Heart, 
  Bookmark, 
  Share2,
  Clock,
  Users,
  Tag,
  Star,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import StoryReader from '../../../components/StoryReader';
import AudioPlayer from '../../../components/AudioPlayer';
import { useStoriesStore } from '../../../hooks/useStoriesStore';

export default function StoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const storyId = params.id as string;
  const mode = searchParams.get('mode') || 'read';

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    getStoryById,
    isBookmarked,
    isFavorited,
    toggleBookmark,
    toggleFavorite,
    getReadingProgress,
    updateReadingProgress,
    preferences,
    updatePreferences,
    setCurrentStory,
  } = useStoriesStore();

  const story = getStoryById(storyId);
  const progress = getReadingProgress(storyId);

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('stories-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (story) {
      setCurrentStory(story);
    }
  }, [story, setCurrentStory]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('stories-theme', newTheme ? 'dark' : 'light');
  };

  const handleShare = async () => {
    if (!story) return;

    const shareData = {
      title: story.title,
      text: story.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

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
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center p-6`}>
        <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-8 text-center max-w-md`}>
          <div className="text-6xl mb-4">📚</div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
            Story Not Found
          </h2>
          <p className={`${themeClasses.subtitle} mb-6`}>
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/stories">
            <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}>
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Stories</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'prophets': '👑',
      'sahaba': '🤝',
      'history': '🏛️',
      'lessons': '💡',
      'quran': '📖',
    };
    return icons[category] || '📚';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/stories">
              <button className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            
            <div>
              <h1 className={`text-2xl font-bold ${themeClasses.text} line-clamp-1`}>
                {story.title}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getCategoryIcon(story.category)}</span>
                  <span className={`text-sm ${themeClasses.subtitle} capitalize`}>
                    {story.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className={`w-4 h-4 ${themeClasses.accent}`} />
                  <span className={`text-sm ${themeClasses.subtitle}`}>
                    {story.estimatedReadTime} min read
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Users className={`w-4 h-4 ${themeClasses.accent}`} />
                  <span className={`text-sm ${themeClasses.subtitle}`}>
                    {story.ageGroup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-gray-200/50 dark:bg-gray-800/50">
              <Link href={`/stories/${storyId}?mode=read`}>
                <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  mode === 'read' ? themeClasses.activeButton : themeClasses.button
                }`}>
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Read</span>
                </button>
              </Link>
              
              {story.audioUrl && (
                <Link href={`/stories/${storyId}?mode=listen`}>
                  <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    mode === 'listen' ? themeClasses.activeButton : themeClasses.button
                  }`}>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Listen</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => toggleBookmark(storyId)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isBookmarked(storyId) 
                  ? 'bg-amber-500/20 text-amber-500' 
                  : themeClasses.button
              }`}
              title={isBookmarked(storyId) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked(storyId) ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => toggleFavorite(storyId)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isFavorited(storyId) 
                  ? 'bg-red-500/20 text-red-500' 
                  : themeClasses.button
              }`}
              title={isFavorited(storyId) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorited(storyId) ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Share story"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                showSettings ? themeClasses.activeButton : themeClasses.button
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {mode === 'listen' && story.audioUrl ? (
          <AudioPlayer
            story={story}
            progress={progress}
            onProgressUpdate={updateReadingProgress}
            preferences={preferences}
            onPreferencesUpdate={updatePreferences}
            showSettings={showSettings}
            onSettingsToggle={setShowSettings}
            isDark={isDark}
          />
        ) : (
          <StoryReader
            story={story}
            progress={progress}
            onProgressUpdate={updateReadingProgress}
            preferences={preferences}
            onPreferencesUpdate={updatePreferences}
            showSettings={showSettings}
            onSettingsToggle={setShowSettings}
            isDark={isDark}
          />
        )}
      </main>
    </div>
  );
}
