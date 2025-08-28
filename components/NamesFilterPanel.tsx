'use client';

import React from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface NamesFilterPanelProps {
  categories: Category[];
  selectedCategory: string;
  onFilterChange: (category: string) => void;
  onClearFilters: () => void;
  isDark?: boolean;
}

export default function NamesFilterPanel({
  categories,
  selectedCategory,
  onFilterChange,
  onClearFilters,
  isDark = false
}: NamesFilterPanelProps) {
  const themeClasses = {
    container: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    clearButton: isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
  };

  const hasActiveFilters = selectedCategory;

  return (
    <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`text-lg font-bold ${themeClasses.text}`}>
            Filter by Category
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${themeClasses.clearButton}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(selectedCategory === category.id ? '' : category.id)}
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id ? themeClasses.activeButton : themeClasses.button
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium text-center leading-tight">
              {category.name}
            </span>
            <span className="text-xs opacity-75 mt-1">
              ({category.count})
            </span>
          </button>
        ))}
      </div>

      {/* Active Filter Display */}
      {hasActiveFilters && (
        <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-600/30' : 'bg-blue-50/80 border-blue-300/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${themeClasses.text}`}>Active Filter:</span>
              <div className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-500 text-white text-sm">
                <span>
                  {categories.find(c => c.id === selectedCategory)?.icon} {' '}
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
                <button
                  onClick={() => onFilterChange('')}
                  className="hover:bg-blue-600 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <span className={`text-sm ${themeClasses.subtitle}`}>
              {categories.find(c => c.id === selectedCategory)?.count} names
            </span>
          </div>
        </div>
      )}

      {/* Filter Tips */}
      <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
        <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
          Category Descriptions:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className={themeClasses.subtitle}>
            <strong>Mercy:</strong> Names expressing Allah's compassion and kindness
          </div>
          <div className={themeClasses.subtitle}>
            <strong>Power:</strong> Names showing Allah's absolute strength and authority
          </div>
          <div className={themeClasses.subtitle}>
            <strong>Knowledge:</strong> Names related to Allah's infinite wisdom and awareness
          </div>
          <div className={themeClasses.subtitle}>
            <strong>Creation:</strong> Names about Allah's role as creator and sustainer
          </div>
          <div className={themeClasses.subtitle}>
            <strong>Guidance:</strong> Names related to Allah's guidance and light
          </div>
          <div className={themeClasses.subtitle}>
            <strong>Protection:</strong> Names expressing Allah's protection and security
          </div>
        </div>
      </div>
    </div>
  );
}
