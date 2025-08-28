'use client';

import React, { useState, useEffect } from 'react';
import { X, Navigation, MapPin, Route, ExternalLink } from 'lucide-react';
import { UserLocation } from '../hooks/useMosqueStore';

interface DirectionCompassProps {
  userLocation: UserLocation;
  targetLocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  onClose: () => void;
  isDark?: boolean;
}

export default function DirectionCompass({
  userLocation,
  targetLocation,
  onClose,
  isDark = false
}: DirectionCompassProps) {
  const [deviceOrientation, setDeviceOrientation] = useState(0);
  const [compassSupported, setCompassSupported] = useState(false);

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
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  // Calculate bearing from user to target
  const calculateBearing = () => {
    const lat1 = userLocation.latitude * Math.PI / 180;
    const lat2 = targetLocation.latitude * Math.PI / 180;
    const deltaLon = (targetLocation.longitude - userLocation.longitude) * Math.PI / 180;

    const x = Math.sin(deltaLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  // Calculate distance
  const calculateDistance = () => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (targetLocation.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (targetLocation.longitude - userLocation.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(targetLocation.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const bearing = calculateBearing();
  const distance = calculateDistance();
  const adjustedBearing = bearing - deviceOrientation;

  // Get cardinal direction
  const getCardinalDirection = (bearing: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  };

  // Request device orientation permission and start listening
  useEffect(() => {
    const requestOrientationPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            setCompassSupported(true);
          }
        } catch (error) {
          console.log('Device orientation not supported');
        }
      } else if ('DeviceOrientationEvent' in window) {
        setCompassSupported(true);
      }
    };

    requestOrientationPermission();
  }, []);

  // Listen for device orientation changes
  useEffect(() => {
    if (!compassSupported) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceOrientation(event.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [compassSupported]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-md rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div>
            <h2 className={`text-xl font-bold ${themeClasses.text}`}>
              Direction Compass
            </h2>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              Navigate to {targetLocation.name}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compass */}
        <div className="p-8">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Compass Background */}
            <div className={`absolute inset-0 rounded-full border-4 ${
              isDark ? 'border-gray-600 bg-gray-800/60' : 'border-gray-300 bg-gray-50/80'
            }`}>
              {/* Cardinal Points */}
              <div className="absolute inset-0">
                {['N', 'E', 'S', 'W'].map((direction, index) => (
                  <div
                    key={direction}
                    className={`absolute text-lg font-bold ${themeClasses.text}`}
                    style={{
                      top: index === 0 ? '8px' : index === 2 ? 'auto' : '50%',
                      bottom: index === 2 ? '8px' : 'auto',
                      left: index === 3 ? '8px' : index === 1 ? 'auto' : '50%',
                      right: index === 1 ? '8px' : 'auto',
                      transform: (index === 0 || index === 2) ? 'translateX(-50%)' : 
                                (index === 1 || index === 3) ? 'translateY(-50%)' : 'none'
                    }}
                  >
                    {direction}
                  </div>
                ))}
              </div>

              {/* Degree Markings */}
              <div className="absolute inset-0">
                {Array.from({ length: 36 }, (_, i) => i * 10).map((degree) => (
                  <div
                    key={degree}
                    className={`absolute w-0.5 ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`}
                    style={{
                      height: degree % 30 === 0 ? '16px' : '8px',
                      top: '4px',
                      left: '50%',
                      transformOrigin: '50% 124px',
                      transform: `translateX(-50%) rotate(${degree}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Direction Arrow */}
              <div
                className="absolute inset-0 transition-transform duration-500 ease-out"
                style={{
                  transform: `rotate(${adjustedBearing}deg)`
                }}
              >
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-0 h-0 border-l-4 border-r-4 border-b-8 ${
                    isDark ? 'border-l-transparent border-r-transparent border-b-emerald-400' 
                           : 'border-l-transparent border-r-transparent border-b-emerald-600'
                  }`} />
                  <div className={`w-1 h-16 ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} mx-auto`} />
                </div>
              </div>

              {/* Center Dot */}
              <div className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                isDark ? 'bg-emerald-400' : 'bg-emerald-600'
              }`} />

              {/* Mosque Icon */}
              <div
                className="absolute transition-transform duration-500 ease-out"
                style={{
                  top: '20px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${adjustedBearing}deg)`
                }}
              >
                <div className="text-2xl">🕌</div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full ${
              isDark ? 'shadow-lg shadow-emerald-500/20' : 'shadow-lg shadow-emerald-500/30'
            }`} />
          </div>

          {/* Direction Info */}
          <div className="text-center space-y-4">
            <div>
              <div className={`text-3xl font-bold ${themeClasses.accent} mb-1`}>
                {bearing.toFixed(0)}°
              </div>
              <div className={`text-lg font-medium ${themeClasses.text}`}>
                {getCardinalDirection(bearing)}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/60' : 'bg-gray-50/80'}`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className={`w-4 h-4 ${themeClasses.accent}`} />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  Distance: {distance.toFixed(2)} km
                </span>
              </div>
              
              <div className={`text-xs ${themeClasses.subtitle}`}>
                {compassSupported 
                  ? 'Hold your device flat and point in the direction of the arrow'
                  : 'Device compass not available - showing static direction'
                }
              </div>
            </div>

            {!compassSupported && (
              <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-900/20' : 'bg-amber-50'} border border-amber-500/20`}>
                <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  For best results, enable location services and device orientation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${targetLocation.latitude},${targetLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <Route className="w-4 h-4" />
              <span>Navigate</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${targetLocation.latitude},${targetLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Map</span>
            </a>
          </div>
        </div>

        {/* Compass Animation Styles */}
        <style jsx>{`
          @keyframes compassPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
          
          .compass-pulse {
            animation: compassPulse 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
