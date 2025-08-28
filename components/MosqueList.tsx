'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Heart,
  Phone,
  Clock,
  ExternalLink,
  Star,
  Route,
  Info,
  Car,
  Accessibility,
  BookOpen
} from 'lucide-react';
import { Mosque, UserLocation } from '../hooks/useMosqueStore';

interface MosqueListProps {
  mosques: Mosque[];
  userLocation: UserLocation | null;
  onMosqueSelect: (mosque: Mosque) => void;
  onDirections: (mosque: Mosque) => void;
  favorites: Mosque[];
  onToggleFavorite: (mosque: Mosque) => void;
  isDark?: boolean;
  loading?: boolean;
}

export default function MosqueList({
  mosques,
  userLocation,
  onMosqueSelect,
  onDirections,
  favorites,
  onToggleFavorite,
  isDark = false,
  loading = false
}: MosqueListProps) {
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'rating'>('distance');

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    favorite: "text-red-500",
  };

  const sortedMosques = [...mosques].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        // Mock rating sort - in real app would use actual ratings
        return Math.random() - 0.5;
      default:
        return 0;
    }
  });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'parking': return <Car className="w-3 h-3" />;
      case 'wheelchair_access': return <Accessibility className="w-3 h-3" />;
      case 'library': return <BookOpen className="w-3 h-3" />;
      case 'school': return '🎓';
      case 'halal_food': return '🍽️';
      case 'wudu_facilities': return '🚿';
      default: return '✓';
    }
  };

  const formatAmenityName = (amenity: string) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
              <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
              <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort Options */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${themeClasses.text}`}>
            Nearby Mosques ({mosques.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${themeClasses.subtitle}`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-1 rounded-lg border transition-all duration-300 ${themeClasses.container} ${themeClasses.text}`}
            >
              <option value="distance">Distance</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {userLocation && (
          <div className={`text-sm ${themeClasses.subtitle}`}>
            📍 Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </div>
        )}
      </div>

      {/* Mosque Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMosques.map((mosque, index) => {
          const isFavorite = favorites.some(f => f.id === mosque.id);
          const isClosest = index === 0 && sortBy === 'distance';

          return (
            <div
              key={mosque.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                themeClasses.container
              } ${isClosest ? 'ring-2 ring-amber-500/50' : ''} relative overflow-hidden`}
            >
              {/* Closest Badge */}
              {isClosest && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                  CLOSEST
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`font-bold ${themeClasses.text} mb-1 pr-8`}>
                    {mosque.name}
                  </h3>
                  <p className={`text-sm ${themeClasses.subtitle} mb-2`}>
                    {mosque.address}
                  </p>
                  
                  {/* Type Badge */}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    mosque.type === 'main' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    mosque.type === 'jami' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                    'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {mosque.type?.charAt(0).toUpperCase() + mosque.type?.slice(1)}
                  </span>
                </div>

                <button
                  onClick={() => onToggleFavorite(mosque)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'text-red-500 bg-red-500/10' 
                      : isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Distance and Contact */}
              <div className="space-y-3 mb-4">
                {mosque.distance && (
                  <div className="flex items-center space-x-2">
                    <Navigation className={`w-4 h-4 ${themeClasses.accent}`} />
                    <span className={`text-sm font-medium ${themeClasses.text}`}>
                      {mosque.distance.toFixed(2)} km away
                    </span>
                  </div>
                )}

                {mosque.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-4 h-4 ${themeClasses.subtitle}`} />
                    <span className={`text-sm ${themeClasses.subtitle}`}>
                      {mosque.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Prayer Times */}
              {mosque.prayerTimes && (
                <div className={`mb-4 p-3 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className={`w-4 h-4 ${themeClasses.accent}`} />
                    <span className={`text-sm font-medium ${themeClasses.text}`}>
                      Today's Prayer Times
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-xs">
                    {Object.entries(mosque.prayerTimes).map(([prayer, time]) => (
                      <div key={prayer} className="text-center">
                        <div className={`font-medium ${themeClasses.text} capitalize`}>
                          {prayer}
                        </div>
                        <div className={themeClasses.subtitle}>
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {mosque.amenities && mosque.amenities.length > 0 && (
                <div className="mb-4">
                  <div className={`text-xs font-medium ${themeClasses.text} mb-2`}>
                    Amenities:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mosque.amenities.slice(0, 4).map((amenity) => (
                      <div
                        key={amenity}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          isDark ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                        title={formatAmenityName(amenity)}
                      >
                        {getAmenityIcon(amenity)}
                        <span className="hidden sm:inline">
                          {formatAmenityName(amenity)}
                        </span>
                      </div>
                    ))}
                    {mosque.amenities.length > 4 && (
                      <div className={`px-2 py-1 rounded text-xs ${themeClasses.subtitle}`}>
                        +{mosque.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onDirections(mosque)}
                  className={`flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
                >
                  <Route className="w-4 h-4" />
                  <span>Directions</span>
                </button>
                
                <button
                  onClick={() => onMosqueSelect(mosque)}
                  className={`flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${themeClasses.button}`}
                >
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </button>
              </div>

              {/* External Maps Link */}
              <div className="mt-3 pt-3 border-t border-gray-200/20 dark:border-gray-700/20">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-1 text-xs ${themeClasses.accent} hover:underline`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {mosques.length === 0 && !loading && (
        <div className={`p-12 rounded-2xl border backdrop-blur-xl text-center ${themeClasses.container}`}>
          <div className="text-6xl mb-4">🕌</div>
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
            No Mosques Found
          </h3>
          <p className={`${themeClasses.subtitle} mb-6`}>
            Try adjusting your search criteria or expanding your search radius
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}>
              Expand Search Radius
            </button>
            <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
