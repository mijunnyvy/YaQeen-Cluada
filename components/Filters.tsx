'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, MapPin, Clock, Car, Accessibility } from 'lucide-react';
import { MosqueFilters } from '../hooks/useMosqueStore';

interface FiltersProps {
  filters: MosqueFilters;
  onChange: (filters: Partial<MosqueFilters>) => void;
  isDark?: boolean;
}

export default function Filters({ filters, onChange, isDark = false }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    slider: isDark
      ? "bg-gray-700"
      : "bg-gray-200",
    sliderThumb: isDark
      ? "bg-emerald-500"
      : "bg-emerald-600",
  };

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: '🕌' },
    { value: 'local', label: 'Local Mosque', icon: '🏘️' },
    { value: 'main', label: 'Main Mosque', icon: '🏛️' },
    { value: 'jami', label: 'Jami Mosque', icon: '🕌' },
    { value: 'community', label: 'Community Center', icon: '🏢' },
  ];

  const amenityOptions = [
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'wheelchair_access', label: 'Wheelchair Access', icon: Accessibility },
    { value: 'library', label: 'Library', icon: '📚' },
    { value: 'school', label: 'Islamic School', icon: '🎓' },
    { value: 'halal_food', label: 'Halal Food', icon: '🍽️' },
    { value: 'wudu_facilities', label: 'Wudu Facilities', icon: '🚿' },
  ];

  const handleRadiusChange = (radius: number) => {
    onChange({ radius });
  };

  const handleTypeChange = (type: string) => {
    onChange({ type });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ amenities: newAmenities });
  };

  const clearFilters = () => {
    onChange({
      radius: 10,
      type: 'all',
      amenities: [],
      openNow: false,
    });
  };

  const activeFiltersCount = [
    filters.radius !== 10 ? 1 : 0,
    filters.type !== 'all' ? 1 : 0,
    filters.amenities.length,
    filters.openNow ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between transition-all duration-300 ${
          isExpanded ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        } rounded-2xl`}
      >
        <div className="flex items-center space-x-3">
          <Filter className={`w-5 h-5 ${themeClasses.text}`} />
          <span className={`font-medium ${themeClasses.text}`}>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${themeClasses.activeButton}`}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${themeClasses.text}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${themeClasses.text}`} />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Distance Radius */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-3`}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Distance Radius
            </label>
            <div className="grid grid-cols-3 gap-2">
              {radiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRadiusChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filters.radius === option.value
                      ? themeClasses.activeButton
                      : themeClasses.button
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Custom Radius Slider */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${themeClasses.subtitle}`}>Custom</span>
                <span className={`text-xs font-medium ${themeClasses.text}`}>
                  {filters.radius} km
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.radius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${themeClasses.slider}`}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${filters.radius}%, ${isDark ? '#374151' : '#e5e7eb'} ${filters.radius}%, ${isDark ? '#374151' : '#e5e7eb'} 100%)`
                }}
              />
            </div>
          </div>

          {/* Mosque Type */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-3`}>
              Mosque Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filters.type === option.value
                      ? themeClasses.activeButton
                      : themeClasses.button
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-3`}>
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map((option) => {
                const isSelected = filters.amenities.includes(option.value);
                const IconComponent = typeof option.icon === 'string' ? null : option.icon;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAmenityToggle(option.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isSelected
                        ? themeClasses.activeButton
                        : themeClasses.button
                    }`}
                  >
                    {IconComponent ? (
                      <IconComponent className="w-4 h-4" />
                    ) : (
                      <span>{option.icon}</span>
                    )}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div>
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${themeClasses.text}`} />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  Open Now
                </span>
              </div>
              <button
                onClick={() => onChange({ openNow: !filters.openNow })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  filters.openNow ? 'bg-emerald-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    filters.openNow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-3 border-t border-gray-200/20 dark:border-gray-700/20">
            <button
              onClick={clearFilters}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              Clear All
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${themeClasses.activeButton}`}
            >
              Apply Filters
            </button>
          </div>

          {/* Filter Summary */}
          {activeFiltersCount > 0 && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'} border border-emerald-500/20`}>
              <div className={`text-xs ${themeClasses.subtitle} mb-1`}>Active Filters:</div>
              <div className="flex flex-wrap gap-1">
                {filters.radius !== 10 && (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-xs">
                    {filters.radius}km radius
                  </span>
                )}
                {filters.type !== 'all' && (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-xs">
                    {typeOptions.find(t => t.value === filters.type)?.label}
                  </span>
                )}
                {filters.amenities.map(amenity => (
                  <span key={amenity} className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-xs">
                    {amenityOptions.find(a => a.value === amenity)?.label}
                  </span>
                ))}
                {filters.openNow && (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-xs">
                    Open now
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
