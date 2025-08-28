'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Heart, 
  Phone, 
  Clock, 
  ExternalLink,
  Share2,
  Route,
  Car,
  Accessibility,
  BookOpen,
  Globe,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { Mosque, UserLocation } from '../hooks/useMosqueStore';

interface MosqueDetailsProps {
  mosque: Mosque;
  userLocation: UserLocation | null;
  onClose: () => void;
  onToggleFavorite: (mosque: Mosque) => void;
  isFavorite: boolean;
  isDark?: boolean;
}

export default function MosqueDetails({
  mosque,
  userLocation,
  onClose,
  onToggleFavorite,
  isFavorite,
  isDark = false
}: MosqueDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'prayers' | 'amenities'>('info');

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    activeTab: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  const handleShare = async () => {
    const shareData = {
      title: mosque.name,
      text: `Check out ${mosque.name} - ${mosque.address}`,
      url: `https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lon}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${mosque.name} - ${mosque.address}\n${shareData.url}`);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'parking': return <Car className="w-4 h-4" />;
      case 'wheelchair_access': return <Accessibility className="w-4 h-4" />;
      case 'library': return <BookOpen className="w-4 h-4" />;
      case 'school': return '🎓';
      case 'halal_food': return '🍽️';
      case 'wudu_facilities': return '🚿';
      default: return '✓';
    }
  };

  const formatAmenityName = (amenity: string) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Mock additional data - in real app would come from API
  const additionalInfo = {
    capacity: Math.floor(Math.random() * 500) + 100,
    established: Math.floor(Math.random() * 50) + 1970,
    imam: 'Sheikh Abdullah Rahman',
    languages: ['Arabic', 'English', 'Urdu'],
    services: ['Friday Prayers', 'Daily Prayers', 'Islamic Classes', 'Community Events'],
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    reviews: Math.floor(Math.random() * 200) + 50
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-3xl">🕌</div>
                <div>
                  <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
                    {mosque.name}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      mosque.type === 'main' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                      mosque.type === 'jami' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}>
                      {mosque.type?.charAt(0).toUpperCase() + mosque.type?.slice(1)} Mosque
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className={`w-4 h-4 ${themeClasses.gold} fill-current`} />
                      <span className={`text-sm font-medium ${themeClasses.text}`}>
                        {additionalInfo.rating}
                      </span>
                      <span className={`text-sm ${themeClasses.subtitle}`}>
                        ({additionalInfo.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className={`${themeClasses.subtitle} mb-3`}>
                {mosque.address}
              </p>

              {mosque.distance && (
                <div className="flex items-center space-x-2">
                  <Navigation className={`w-4 h-4 ${themeClasses.accent}`} />
                  <span className={`text-sm font-medium ${themeClasses.text}`}>
                    {mosque.distance.toFixed(2)} km from your location
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(mosque)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isFavorite 
                    ? 'text-red-500 bg-red-500/10' 
                    : themeClasses.button
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          {[
            { id: 'info', label: 'Information', icon: MapPin },
            { id: 'prayers', label: 'Prayer Times', icon: Clock },
            { id: 'amenities', label: 'Amenities', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? themeClasses.activeTab : themeClasses.button
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <h3 className={`font-bold ${themeClasses.text} mb-3`}>Contact Information</h3>
                  <div className="space-y-2">
                    {mosque.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className={`w-4 h-4 ${themeClasses.accent}`} />
                        <a href={`tel:${mosque.phone}`} className={`${themeClasses.text} hover:underline`}>
                          {mosque.phone}
                        </a>
                      </div>
                    )}
                    {mosque.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className={`w-4 h-4 ${themeClasses.accent}`} />
                        <a href={mosque.website} target="_blank" rel="noopener noreferrer" className={`${themeClasses.text} hover:underline`}>
                          Visit Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className={`w-4 h-4 ${themeClasses.accent}`} />
                      <span className={`${themeClasses.text}`}>
                        {mosque.lat.toFixed(6)}, {mosque.lon.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <h3 className={`font-bold ${themeClasses.text} mb-3`}>Mosque Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={themeClasses.subtitle}>Capacity:</span>
                      <span className={themeClasses.text}>{additionalInfo.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.subtitle}>Established:</span>
                      <span className={themeClasses.text}>{additionalInfo.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.subtitle}>Imam:</span>
                      <span className={themeClasses.text}>{additionalInfo.imam}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                <h3 className={`font-bold ${themeClasses.text} mb-3`}>Services & Programs</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {additionalInfo.services.map((service, index) => (
                    <div key={index} className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-600/40' : 'bg-gray-100'}`}>
                      <span className={`text-sm ${themeClasses.text}`}>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                <h3 className={`font-bold ${themeClasses.text} mb-3`}>Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {additionalInfo.languages.map((language, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-sm ${themeClasses.primaryButton}`}>
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prayers' && (
            <div className="space-y-6">
              {mosque.prayerTimes ? (
                <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
                  <h3 className={`font-bold ${themeClasses.text} mb-4 text-center`}>Today's Prayer Times</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(mosque.prayerTimes).map(([prayer, time]) => (
                      <div key={prayer} className={`text-center p-4 rounded-xl ${isDark ? 'bg-gray-600/40' : 'bg-white'}`}>
                        <div className={`text-lg font-bold ${themeClasses.text} capitalize mb-1`}>
                          {prayer}
                        </div>
                        <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-xl border ${themeClasses.card} text-center`}>
                  <Clock className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
                  <p className={themeClasses.subtitle}>Prayer times not available</p>
                </div>
              )}

              {/* Prayer Schedule Info */}
              <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                <h3 className={`font-bold ${themeClasses.text} mb-3`}>Prayer Schedule Information</h3>
                <div className="space-y-2 text-sm">
                  <p className={themeClasses.subtitle}>
                    • Jumu'ah (Friday) prayers start at 1:00 PM
                  </p>
                  <p className={themeClasses.subtitle}>
                    • Tarawih prayers during Ramadan at 8:30 PM
                  </p>
                  <p className={themeClasses.subtitle}>
                    • Eid prayers announced separately
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-6">
              {mosque.amenities && mosque.amenities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mosque.amenities.map((amenity, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-4 rounded-xl border ${themeClasses.card}`}>
                      <div className={`p-2 rounded-lg ${themeClasses.primaryButton}`}>
                        {getAmenityIcon(amenity)}
                      </div>
                      <div>
                        <h4 className={`font-medium ${themeClasses.text}`}>
                          {formatAmenityName(amenity)}
                        </h4>
                        <p className={`text-sm ${themeClasses.subtitle}`}>
                          Available for all visitors
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 rounded-xl border ${themeClasses.card} text-center`}>
                  <Users className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
                  <p className={themeClasses.subtitle}>Amenity information not available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <Route className="w-5 h-5" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${mosque.phone}`}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              <Phone className="w-5 h-5" />
              <span>Call Mosque</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              <ExternalLink className="w-5 h-5" />
              <span>View on Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
