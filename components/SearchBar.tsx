'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  isDark?: boolean;
  loading?: boolean;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  isDark = false, 
  loading = false 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    placeholder: isDark ? "placeholder-gray-400" : "placeholder-gray-500",
    suggestion: isDark
      ? "hover:bg-gray-700/80 text-gray-300"
      : "hover:bg-gray-50 text-gray-700",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  // Mock suggestions - in a real app, these would come from an API
  const mockSuggestions = [
    'Masjid Al-Noor',
    'Islamic Center',
    'Central Mosque',
    'Masjid Al-Huda',
    'Community Islamic Center',
    'Grand Mosque',
    'Masjid Al-Rahman',
    'Islamic Cultural Center',
    'New York',
    'Brooklyn',
    'Manhattan',
    'Queens',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Philadelphia'
  ];

  useEffect(() => {
    if (value.length > 1) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          themeClasses.container
        } ${isFocused ? 'ring-2 ring-emerald-500/50 border-emerald-500/50' : ''}`}>
          
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            ) : (
              <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search mosques by name or city..."
            className={`w-full pl-12 pr-20 py-4 bg-transparent border-none outline-none ${themeClasses.text} ${themeClasses.placeholder}`}
            disabled={loading}
          />

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute right-16 p-1 rounded-full transition-all duration-300 ${
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className={`absolute right-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              themeClasses.button
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border backdrop-blur-xl z-50 ${
          themeClasses.container
        } shadow-xl`}>
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left transition-all duration-200 ${themeClasses.suggestion} flex items-center space-x-3`}
              >
                {suggestion.includes('Masjid') || suggestion.includes('Islamic') || suggestion.includes('Mosque') ? (
                  <div className="text-lg">🕌</div>
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-500" />
                )}
                <span className="font-medium">{suggestion}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-3`}>
            <div className="flex items-center justify-between text-sm">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Quick tips:
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recent searches
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Examples */}
      {!value && !isFocused && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['Nearby mosques', 'Islamic Center', 'Masjid Al-Noor', 'Brooklyn'].map((example) => (
            <button
              key={example}
              onClick={() => {
                onChange(example);
                onSearch(example);
              }}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700/60 hover:bg-gray-600/80 text-gray-300 border border-gray-600/50' 
                  : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 border border-gray-200/50'
              }`}
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {/* Search Stats */}
      {value && !loading && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Press Enter to search</span>
            <span>•</span>
            <span>ESC to cancel</span>
          </div>
        </div>
      )}
    </div>
  );
}
