'use client';

import React, { useState, useEffect } from 'react';
import { Navigation2, MapPin } from 'lucide-react';
import CompassDial from './CompassDial';
import CompassNeedle from './CompassNeedle';

interface Location {
  latitude: number;
  longitude: number;
}

interface QiblaCompassProps {
  userLocation: Location;
  makkahLocation: Location;
  deviceOrientation?: number;
  isDark?: boolean;
}

export default function QiblaCompass({
  userLocation,
  makkahLocation,
  deviceOrientation = 0,
  isDark = false
}: QiblaCompassProps) {
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [compassRotation, setCompassRotation] = useState<number>(0);

  // Calculate Qibla bearing using Haversine formula
  const calculateQiblaBearing = (userLat: number, userLng: number, makkahLat: number, makkahLng: number): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const lat1 = toRadians(userLat);
    const lat2 = toRadians(makkahLat);
    const deltaLng = toRadians(makkahLng - userLng);

    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = toDegrees(Math.atan2(x, y));
    return (bearing + 360) % 360; // Normalize to 0-360
  };

  // Calculate distance using Haversine formula
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

  useEffect(() => {
    const bearing = calculateQiblaBearing(
      userLocation.latitude,
      userLocation.longitude,
      makkahLocation.latitude,
      makkahLocation.longitude
    );

    const dist = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      makkahLocation.latitude,
      makkahLocation.longitude
    );

    setQiblaBearing(bearing);
    setDistance(dist);
  }, [userLocation, makkahLocation]);

  useEffect(() => {
    // Adjust compass rotation based on device orientation
    setCompassRotation(-deviceOrientation);
  }, [deviceOrientation]);

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/40 border-gray-700/50" 
      : "bg-white/80 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    compassBg: isDark 
      ? "bg-gradient-to-br from-gray-800 to-gray-900" 
      : "bg-gradient-to-br from-white to-gray-50",
    compassBorder: isDark ? "border-gray-600" : "border-gray-300",
  };

  return (
    <div className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Qibla Direction
        </h2>
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Navigation2 className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={themeClasses.subtitle}>
              {qiblaBearing.toFixed(1)}° from North
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className={`w-4 h-4 ${themeClasses.gold}`} />
            <span className={themeClasses.subtitle}>
              {distance.toFixed(0)} km to Makkah
            </span>
          </div>
        </div>
      </div>

      {/* Compass Container */}
      <div className="relative flex items-center justify-center">
        <div 
          className={`relative w-80 h-80 rounded-full border-4 ${themeClasses.compassBorder} ${themeClasses.compassBg} shadow-2xl`}
          style={{
            background: isDark 
              ? 'radial-gradient(circle at center, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.95) 100%)',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Compass Dial */}
          <CompassDial 
            rotation={compassRotation}
            isDark={isDark}
          />

          {/* Qibla Needle */}
          <CompassNeedle
            bearing={qiblaBearing}
            deviceOrientation={deviceOrientation}
            isDark={isDark}
          />

          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`w-4 h-4 rounded-full ${
              isDark ? 'bg-emerald-400' : 'bg-emerald-600'
            } shadow-lg`}></div>
          </div>

          {/* Makkah Label */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${qiblaBearing - deviceOrientation}deg) translateY(-140px)`
            }}
          >
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDark ? 'bg-amber-400 text-gray-900' : 'bg-amber-500 text-white'
            } shadow-lg whitespace-nowrap`}>
              🕋 Makkah
            </div>
          </div>
        </div>

        {/* Outer Ring Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Glow Effect */}
          <div className={`absolute inset-4 rounded-full ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-500/20 to-amber-500/20' 
              : 'bg-gradient-to-br from-emerald-500/10 to-amber-500/10'
          } blur-xl`}></div>
          
          {/* Outer Decorative Rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full border ${
                isDark ? 'border-emerald-400/20' : 'border-emerald-500/20'
              }`}
              style={{
                width: `${400 + i * 20}px`,
                height: `${400 + i * 20}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `spin ${20 + i * 10}s linear infinite reverse`
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className={`p-3 rounded-xl ${themeClasses.container} border`}>
            <div className={`font-semibold ${themeClasses.text}`}>Your Location</div>
            <div className={themeClasses.subtitle}>
              {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
            </div>
          </div>
          <div className={`p-3 rounded-xl ${themeClasses.container} border`}>
            <div className={`font-semibold ${themeClasses.text}`}>Kaaba Location</div>
            <div className={themeClasses.subtitle}>
              {makkahLocation.latitude.toFixed(4)}°, {makkahLocation.longitude.toFixed(4)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
