'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Globe, Clock } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationIndicatorProps {
  userLocation: Location;
  makkahLocation: Location;
  isDark?: boolean;
}

export default function LocationIndicator({
  userLocation,
  makkahLocation,
  isDark = false
}: LocationIndicatorProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Calculate bearing
  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const dLng = toRadians(lng2 - lng1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const x = Math.sin(dLng) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

    let bearing = toDegrees(Math.atan2(x, y));
    return (bearing + 360) % 360;
  };

  // Calculate distance
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get prayer times for Makkah (simplified)
  const getMakkahTime = () => {
    const now = new Date();
    const makkahTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // UTC+3
    return makkahTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Riyadh'
    });
  };

  const bearing = calculateBearing(
    userLocation.latitude,
    userLocation.longitude,
    makkahLocation.latitude,
    makkahLocation.longitude
  );

  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    makkahLocation.latitude,
    makkahLocation.longitude
  );

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    mapBg: isDark ? "bg-gray-900" : "bg-gray-100",
  };

  return (
    <div className="space-y-6">
      {/* Location Info Card */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`font-bold ${themeClasses.text}`}>Location Details</h3>
        </div>

        <div className="space-y-4">
          {/* Your Location */}
          <div>
            <div className={`text-sm font-medium ${themeClasses.text} mb-1`}>Your Location</div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              {userLocation.latitude.toFixed(6)}°, {userLocation.longitude.toFixed(6)}°
            </div>
          </div>

          {/* Makkah Location */}
          <div>
            <div className={`text-sm font-medium ${themeClasses.text} mb-1`}>Makkah (Kaaba)</div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              {makkahLocation.latitude.toFixed(6)}°, {makkahLocation.longitude.toFixed(6)}°
            </div>
          </div>

          {/* Distance & Bearing */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl ${themeClasses.container} border`}>
              <div className={`text-xs ${themeClasses.subtitle} mb-1`}>Distance</div>
              <div className={`text-lg font-bold ${themeClasses.accent}`}>
                {distance.toFixed(0)} km
              </div>
              <div className={`text-xs ${themeClasses.subtitle}`}>
                {(distance * 0.621371).toFixed(0)} miles
              </div>
            </div>
            <div className={`p-3 rounded-xl ${themeClasses.container} border`}>
              <div className={`text-xs ${themeClasses.subtitle} mb-1`}>Bearing</div>
              <div className={`text-lg font-bold ${themeClasses.gold}`}>
                {bearing.toFixed(1)}°
              </div>
              <div className={`text-xs ${themeClasses.subtitle}`}>
                from North
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map Visualization */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Globe className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`font-bold ${themeClasses.text}`}>Direction Map</h3>
        </div>

        <div className={`relative w-full h-40 rounded-xl ${themeClasses.mapBg} overflow-hidden`}>
          {/* Simplified World Map Background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              {/* Simplified continents */}
              <path
                d="M20,30 Q30,25 40,30 L50,35 Q60,30 70,35 L80,40 Q90,35 100,40 L110,45 Q120,40 130,45 L140,50 Q150,45 160,50 L170,55 Q180,50 190,55"
                stroke={isDark ? "#374151" : "#6b7280"}
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M10,60 Q20,55 30,60 L40,65 Q50,60 60,65 L70,70 Q80,65 90,70 L100,75 Q110,70 120,75"
                stroke={isDark ? "#374151" : "#6b7280"}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* User Location */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((userLocation.longitude + 180) / 360) * 100}%`,
              top: `${((90 - userLocation.latitude) / 180) * 100}%`
            }}
          >
            <div className={`w-3 h-3 rounded-full ${themeClasses.accent} bg-current animate-pulse`} />
            <div className={`text-xs ${themeClasses.text} mt-1 whitespace-nowrap`}>You</div>
          </div>

          {/* Makkah Location */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((makkahLocation.longitude + 180) / 360) * 100}%`,
              top: `${((90 - makkahLocation.latitude) / 180) * 100}%`
            }}
          >
            <div className={`w-3 h-3 rounded-full ${themeClasses.gold} bg-current animate-pulse`} />
            <div className={`text-xs ${themeClasses.text} mt-1 whitespace-nowrap`}>🕋 Makkah</div>
          </div>

          {/* Direction Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${((userLocation.longitude + 180) / 360) * 100}%`}
              y1={`${((90 - userLocation.latitude) / 180) * 100}%`}
              x2={`${((makkahLocation.longitude + 180) / 360) * 100}%`}
              y2={`${((90 - makkahLocation.latitude) / 180) * 100}%`}
              stroke={isDark ? "#10b981" : "#059669"}
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Makkah Time */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className={`w-5 h-5 ${themeClasses.gold}`} />
          <h3 className={`font-bold ${themeClasses.text}`}>Makkah Time</h3>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${themeClasses.gold} mb-1`}>
            {getMakkahTime()}
          </div>
          <div className={`text-sm ${themeClasses.subtitle}`}>
            Saudi Arabia (UTC+3)
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Navigation className={`w-5 h-5 ${themeClasses.accent}`} />
          <h3 className={`font-bold ${themeClasses.text}`}>Quick Stats</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className={themeClasses.subtitle}>Flight Time (approx.)</span>
            <span className={themeClasses.text}>
              {Math.round(distance / 800)} hours
            </span>
          </div>
          <div className="flex justify-between">
            <span className={themeClasses.subtitle}>Time Zone Difference</span>
            <span className={themeClasses.text}>
              {Math.round((userLocation.longitude - makkahLocation.longitude) / 15)} hours
            </span>
          </div>
          <div className="flex justify-between">
            <span className={themeClasses.subtitle}>Great Circle Route</span>
            <span className={themeClasses.text}>
              {bearing > 180 ? 'Southwest' : bearing > 90 ? 'Southeast' : bearing > 0 ? 'Northeast' : 'Northwest'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
