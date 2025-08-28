'use client';

import React, { useState } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

interface NamesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark?: boolean;
}

export default function NamesSearchBar({
  searchQuery,
  onSearchChange,
  isDark = false
}: NamesSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const themeClasses = {
    container: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    input: isDark
      ? "bg-transparent text-white placeholder-gray-400"
      : "bg-transparent text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
  };

  const popularSearches = [
    'Rahman',
    'Rahim',
    'Malik',
    'Quddus',
    'Salaam',
    'Aziz',
    'Hakeem',
    'Ghafoor',
    'Wadood',
    'Saboor'
  ];

  const handleClear = () => {
    onSearchChange('');
  };

  const handlePopularSearch = (term: string) => {
    onSearchChange(term);
  };

  return (
    <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container} p-6`}>
      {/* Search Input */}
      <div className="relative mb-4">
        <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 ${
          isFocused 
            ? isDark ? 'border-blue-500 bg-gray-700/40' : 'border-blue-500 bg-blue-50/50'
            : isDark ? 'border-gray-600/50 bg-gray-700/20' : 'border-gray-300/50 bg-gray-50/50'
        }`}>
          <Search className={`w-5 h-5 ${isFocused ? themeClasses.accent : themeClasses.subtitle}`} />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by Arabic name, transliteration, or meaning..."
            className={`flex-1 outline-none ${themeClasses.input}`}
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className={`p-1 rounded-full transition-all duration-300 ${themeClasses.button}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {isFocused && !searchQuery && (
          <div className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-xl border backdrop-blur-xl z-10 ${themeClasses.container}`}>
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className={`w-4 h-4 ${themeClasses.accent}`} />
                <span className={`text-sm font-medium ${themeClasses.accent}`}>
                  Popular Names
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(term)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${themeClasses.button}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200/20 dark:border-gray-700/20 pt-3">
              <div className="flex items-center space-x-2">
                <Sparkles className={`w-4 h-4 ${themeClasses.accent}`} />
                <span className={`text-xs ${themeClasses.subtitle}`}>
                  Search by Arabic text, English transliteration, or meaning
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-sm ${themeClasses.subtitle}`}>
              Searching for: <strong>"{searchQuery}"</strong>
            </span>
          </div>
          
          <button
            onClick={handleClear}
            className={`text-sm px-3 py-1 rounded-lg transition-all duration-300 ${themeClasses.button}`}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
