'use client';

import React from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Bookmark, 
  Play, 
  BookOpen,
  Tag,
  ArrowRight,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import BookmarkButton from './BookmarkButton';
import { Story, useStoriesStore } from '../hooks/useStoriesStore';

interface StoryCardProps {
  story: Story;
  isDark?: boolean;
}

export default function StoryCard({ story, isDark = false }: StoryCardProps) {
  const { 
    isBookmarked, 
    isFavorited, 
    toggleFavorite, 
    getReadingProgress 
  } = useStoriesStore();

  const progress = getReadingProgress(story.id);
  const isBookmarkedStory = isBookmarked(story.id);
  const isFavoritedStory = isFavorited(story.id);

  const themeClasses = {
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-purple-400" : "text-purple-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    button: isDark
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-purple-500 hover:bg-purple-600 text-white",
    secondaryButton: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
  };

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'prophets': isDark ? 'bg-yellow-800/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
      'sahaba': isDark ? 'bg-blue-800/40 text-blue-300' : 'bg-blue-100 text-blue-700',
      'history': isDark ? 'bg-green-800/40 text-green-300' : 'bg-green-100 text-green-700',
      'lessons': isDark ? 'bg-purple-800/40 text-purple-300' : 'bg-purple-100 text-purple-700',
      'quran': isDark ? 'bg-emerald-800/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    };
    return colors[category] || (isDark ? 'bg-gray-800/40 text-gray-300' : 'bg-gray-100 text-gray-700');
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': isDark ? 'text-green-400' : 'text-green-600',
      'medium': isDark ? 'text-yellow-400' : 'text-yellow-600',
      'hard': isDark ? 'text-red-400' : 'text-red-600',
    };
    return colors[difficulty] || themeClasses.subtitle;
  };

  return (
    <div className={`group relative rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-xl ${themeClasses.card}`}>
      {/* Featured Badge */}
      {story.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${themeClasses.button} shadow-lg`}>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Featured</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {progress && progress.progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{story.thumbnail}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(story.category)}`}>
                  {getCategoryIcon(story.category)} {story.category}
                </span>
                {story.audioUrl && (
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-800/40' : 'bg-purple-100'}`}>
                    <Volume2 className={`w-3 h-3 ${themeClasses.accent}`} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <BookmarkButton
              storyId={story.id}
              isBookmarked={isBookmarkedStory}
              isDark={isDark}
            />
            
            <button
              onClick={() => toggleFavorite(story.id)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isFavoritedStory 
                  ? 'text-red-500 bg-red-500/10' 
                  : themeClasses.secondaryButton
              }`}
              title={isFavoritedStory ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavoritedStory ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors duration-300`}>
            {story.title}
          </h3>
          {story.titleArabic && (
            <p className={`text-lg ${themeClasses.gold} mb-2 font-arabic`}>
              {story.titleArabic}
            </p>
          )}
          <p className={`${themeClasses.subtitle} text-sm line-clamp-3`}>
            {story.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${themeClasses.accent}`} />
              <span className={themeClasses.subtitle}>{story.estimatedReadTime} min</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className={`w-4 h-4 ${themeClasses.accent}`} />
              <span className={themeClasses.subtitle}>{story.ageGroup}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(story.difficulty)}`} />
            <span className={`text-xs ${getDifficultyColor(story.difficulty)} capitalize`}>
              {story.difficulty}
            </span>
          </div>
        </div>

        {/* Tags */}
        {story.theme.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {story.theme.slice(0, 3).map((theme, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                #{theme}
              </span>
            ))}
            {story.theme.length > 3 && (
              <span className={`px-2 py-1 rounded text-xs ${themeClasses.subtitle}`}>
                +{story.theme.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Reading Progress */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={themeClasses.subtitle}>
                {progress.completed ? 'Completed' : 'In Progress'}
              </span>
              <span className={themeClasses.subtitle}>
                {Math.round(progress.progress)}%
              </span>
            </div>
            <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link href={`/stories/${story.id}`} className="flex-1">
            <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.button}`}>
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{progress?.progress ? 'Continue' : 'Read'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </Link>

          {story.audioUrl && (
            <Link href={`/stories/${story.id}?mode=listen`}>
              <button className={`px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${themeClasses.secondaryButton}`}>
                <Play className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
}
