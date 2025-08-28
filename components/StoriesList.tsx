'use client';

import React from 'react';
import { BookOpen, Clock, Users, Star, Heart, Bookmark } from 'lucide-react';
import StoryCard from './StoryCard';
import { Story } from '../hooks/useStoriesStore';

interface StoriesListProps {
  stories: Story[];
  loading: boolean;
  error: string | null;
  isDark?: boolean;
}

export default function StoriesList({
  stories,
  loading,
  error,
  isDark = false
}: StoriesListProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    accent: isDark ? "text-purple-400" : "text-purple-600",
  };

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className={`${themeClasses.subtitle}`}>Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
          Unable to Load Stories
        </h3>
        <p className={`${themeClasses.subtitle}`}>
          {error}
        </p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.card} text-center`}>
        <div className="text-6xl mb-4">📚</div>
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
          No Stories Found
        </h3>
        <p className={`${themeClasses.subtitle} mb-4`}>
          Try adjusting your search or filter criteria to find more stories.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <BookOpen className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={themeClasses.subtitle}>Browse all categories</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={themeClasses.subtitle}>Check featured stories</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-1`}>
            Stories Collection
          </h2>
          <p className={`${themeClasses.subtitle}`}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${themeClasses.subtitle}`}>Sort by:</span>
          <select className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
            isDark
              ? "bg-gray-700/80 border-gray-600/50 text-white"
              : "bg-white/90 border-gray-300/50 text-gray-900"
          }`}>
            <option value="featured">Featured First</option>
            <option value="newest">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="readTime">Read Time</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Load More Button (for future pagination) */}
      {stories.length >= 12 && (
        <div className="text-center mt-8">
          <button className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
            isDark
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}>
            Load More Stories
          </button>
        </div>
      )}

      {/* Stories Statistics */}
      <div className={`mt-12 p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <h3 className={`text-lg font-bold ${themeClasses.text} mb-4`}>
          Collection Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>
              {stories.filter(s => s.category === 'prophets').length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Prophet Stories</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>
              {stories.filter(s => s.category === 'sahaba').length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Sahaba Stories</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>
              {stories.filter(s => s.category === 'history').length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Historical</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>
              {stories.filter(s => s.category === 'lessons').length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Life Lessons</div>
          </div>
        </div>
      </div>
    </div>
  );
}
