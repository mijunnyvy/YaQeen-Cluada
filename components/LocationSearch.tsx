'use client';

import React, { useState } from 'react';
import { X, Search, MapPin, Navigation, Loader2, Globe } from 'lucide-react';
import { Location } from '../hooks/usePrayerTimesStore';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  onClose: () => void;
  isDark?: boolean;
}

export default function LocationSearch({
  onLocationSelect,
  onClose,
  isDark = false
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  // Popular cities for quick selection
  const popularCities: Location[] = [
    { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
    { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.4539, longitude: 39.6040, timezone: 'Asia/Riyadh' },
    { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
    { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
    { city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
    { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
    { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
    { city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      // Simple search using a free geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/city?name=${encodeURIComponent(searchQuery)}&limit=5`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      // If single result
      if (data.name) {
        setSearchResults([{
          city: data.name,
          country: data.country || 'Unknown',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }]);
      } else {
        // Fallback: create a mock result based on search query
        setSearchResults([{
          city: searchQuery,
          country: 'Unknown',
          latitude: 0,
          longitude: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Unable to search locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    onClose();
  };

  const handleAutoDetect = async () => {
    setLoading(true);
    setError('');

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocoding
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            const location: Location = {
              city: data.city || data.locality || 'Unknown City',
              country: data.countryName || 'Unknown Country',
              latitude,
              longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            
            handleLocationSelect(location);
          } catch (error) {
            setError('Unable to get location details');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to access your location');
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } catch (error) {
      setError('Geolocation is not available');
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${themeClasses.card}`}>
              <MapPin className={`w-5 h-5 ${themeClasses.accent}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>
                Select Location
              </h2>
              <p className={`text-sm ${themeClasses.subtitle}`}>
                Choose your city for accurate prayer times
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auto-detect Location */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <button
            onClick={handleAutoDetect}
            disabled={loading}
            className={`w-full p-4 rounded-xl transition-all duration-300 ${themeClasses.primaryButton} ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              <span className="font-medium">
                {loading ? 'Detecting Location...' : 'Auto-Detect My Location'}
              </span>
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.subtitle}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for a city..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input}`}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                loading || !searchQuery.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              } ${themeClasses.primaryButton}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
            <h3 className={`font-medium ${themeClasses.text} mb-3`}>Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${themeClasses.card} hover:scale-105`}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className={`w-4 h-4 ${themeClasses.accent}`} />
                    <div>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {location.city}
                      </div>
                      <div className={`text-sm ${themeClasses.subtitle}`}>
                        {location.country}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Cities */}
        <div className="p-6">
          <h3 className={`font-medium ${themeClasses.text} mb-4 flex items-center space-x-2`}>
            <Globe className={`w-4 h-4 ${themeClasses.accent}`} />
            <span>Popular Cities</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularCities.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className={`p-3 rounded-xl text-left transition-all duration-300 ${themeClasses.card} hover:scale-105`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">
                    {location.city === 'Makkah' ? '🕋' : 
                     location.city === 'Madinah' ? '🕌' : 
                     '🌍'}
                  </div>
                  <div>
                    <div className={`font-medium ${themeClasses.text}`}>
                      {location.city}
                    </div>
                    <div className={`text-sm ${themeClasses.subtitle}`}>
                      {location.country}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
