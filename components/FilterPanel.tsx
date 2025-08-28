'use client';

import React from 'react';
import { Filter, X, Users, Tag, BookOpen, RefreshCw } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface AgeGroup {
  id: string;
  name: string;
  icon: string;
}

interface FilterPanelProps {
  categories: Category[];
  ageGroups: AgeGroup[];
  selectedCategory: string;
  selectedAgeGroup: string;
  selectedTheme: string;
  onFilterChange: (filters: {
    category?: string;
    ageGroup?: string;
    theme?: string;
  }) => void;
  onClearFilters: () => void;
  isDark?: boolean;
}

export default function FilterPanel({
  categories,
  ageGroups,
  selectedCategory,
  selectedAgeGroup,
  selectedTheme,
  onFilterChange,
  onClearFilters,
  isDark = false
}: FilterPanelProps) {
  const themeClasses = {
    container: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-purple-600 text-white"
      : "bg-purple-500 text-white",
    accent: isDark ? "text-purple-400" : "text-purple-600",
    clearButton: isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
  };

  const themes = [
    'faith', 'courage', 'wisdom', 'patience', 'forgiveness', 
    'justice', 'mercy', 'humility', 'gratitude', 'perseverance',
    'friendship', 'loyalty', 'truth', 'sacrifice', 'devotion'
  ];

  const hasActiveFilters = selectedCategory || selectedAgeGroup || selectedTheme;

  return (
    <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`text-lg font-bold ${themeClasses.text}`}>
            Filter Stories
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${themeClasses.clearButton}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className={`w-4 h-4 ${themeClasses.accent}`} />
            <h4 className={`font-medium ${themeClasses.text}`}>Categories</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange({ 
                  category: selectedCategory === category.id ? '' : category.id 
                })}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Age Groups */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Users className={`w-4 h-4 ${themeClasses.accent}`} />
            <h4 className={`font-medium ${themeClasses.text}`}>Age Groups</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ageGroups.map((ageGroup) => (
              <button
                key={ageGroup.id}
                onClick={() => onFilterChange({ 
                  ageGroup: selectedAgeGroup === ageGroup.id ? '' : ageGroup.id 
                })}
                className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedAgeGroup === ageGroup.id ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                <span className="text-lg">{ageGroup.icon}</span>
                <span className="text-sm font-medium">{ageGroup.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Tag className={`w-4 h-4 ${themeClasses.accent}`} />
            <h4 className={`font-medium ${themeClasses.text}`}>Themes</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => onFilterChange({ 
                  theme: selectedTheme === theme ? '' : theme 
                })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 capitalize ${
                  selectedTheme === theme ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                #{theme}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-purple-900/20 border-purple-600/30' : 'bg-purple-50/80 border-purple-300/30'}`}>
            <h5 className={`font-medium ${themeClasses.text} mb-2`}>Active Filters:</h5>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-purple-500 text-white text-xs">
                  <span>Category: {categories.find(c => c.id === selectedCategory)?.name}</span>
                  <button
                    onClick={() => onFilterChange({ category: '' })}
                    className="hover:bg-purple-600 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedAgeGroup && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-purple-500 text-white text-xs">
                  <span>Age: {ageGroups.find(a => a.id === selectedAgeGroup)?.name}</span>
                  <button
                    onClick={() => onFilterChange({ ageGroup: '' })}
                    className="hover:bg-purple-600 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {selectedTheme && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-purple-500 text-white text-xs">
                  <span>Theme: {selectedTheme}</span>
                  <button
                    onClick={() => onFilterChange({ theme: '' })}
                    className="hover:bg-purple-600 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
