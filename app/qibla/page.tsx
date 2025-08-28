'use client';

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Share2,
  RefreshCw,
  Sun,
  Moon,
  AlertCircle,
  Compass,
  Star,
  BookOpen,
  ArrowLeft,
  Target,
  MapPin,
  Calendar,
  Clock,
  Book,
  Heart,
  Star
} from 'lucide-react';
import Link from 'next/link';
import QiblaCompass from '@/components/QiblaCompass';
import LocationIndicator from '@/components/LocationIndicator';
import ErrorMessage from '@/components/ErrorMessage';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function QiblaPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0);
  const [isSupported, setIsSupported] = useState(true);

  // Makkah coordinates (Kaaba)
  const MAKKAH_COORDS = {
    latitude: 21.4225,
    longitude: 39.8262
  };

  useEffect(() => {
    // Check for geolocation support
    if (!navigator.geolocation) {
      setIsSupported(false);
      setError('Geolocation is not supported by this browser');
      return;
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('qibla-theme');
    setIsDark(savedTheme === 'dark');

    // Request location on component mount
    getCurrentLocation();

    // Set up device orientation listener for mobile
    if (window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDeviceOrientation(event.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services and refresh.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('qibla-theme', newTheme ? 'dark' : 'light');
  };

  const shareQiblaDirection = async () => {
    if (!userLocation) return;

    const qiblaData = {
      title: 'Qibla Direction',
      text: `My Qibla direction from ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(qiblaData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${qiblaData.text} - ${qiblaData.url}`);
      // You could show a toast notification here
    }
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-amber-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-amber-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-amber-500/5 rounded-full blur-xl"></div>
        
        {/* Floating Stars */}
        {[...Array(12)].map((_, i) => (
          <Star
            key={i}
            className={`absolute w-4 h-4 ${isDark ? 'text-amber-400/30' : 'text-emerald-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <Compass className={`w-8 h-8 ${themeClasses.accent}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Qibla Compass
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Find the direction to Makkah
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/quran"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Holy Quran"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            <Link
              href="/tasbih"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Digital Tasbih"
            >
              <Target className="w-5 h-5" />
            </Link>

            <Link
              href="/mosque-finder"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Mosque Finder"
            >
              <MapPin className="w-5 h-5" />
            </Link>

            <Link
              href="/calendar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Calendar"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <Link
              href="/prayer-times"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Prayer Times"
            >
              <Clock className="w-5 h-5" />
            </Link>

            <Link
              href="/stories"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Stories"
            >
              <Book className="w-5 h-5" />
            </Link>

            <Link
              href="/adkar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Daily Adkar"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/names"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="99 Beautiful Names"
            >
              <Star className="w-5 h-5" />
            </Link>

            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh Location"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {userLocation && (
              <button
                onClick={shareQiblaDirection}
                className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
                title="Share Qibla Direction"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {!isSupported ? (
            <ErrorMessage
              title="Geolocation Not Supported"
              message="Your browser doesn't support geolocation. Please use a modern browser to access the Qibla compass."
              isDark={isDark}
            />
          ) : error ? (
            <ErrorMessage
              title="Location Error"
              message={error}
              onRetry={getCurrentLocation}
              isDark={isDark}
            />
          ) : loading ? (
            <div className="text-center py-20">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${themeClasses.card} backdrop-blur-xl border mb-6`}>
                <Navigation className={`w-8 h-8 ${themeClasses.accent} animate-spin`} />
              </div>
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                Getting Your Location
              </h2>
              <p className={`${themeClasses.subtitle}`}>
                Please allow location access to find your Qibla direction
              </p>
            </div>
          ) : userLocation ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Compass */}
              <div className="lg:col-span-2">
                <QiblaCompass
                  userLocation={userLocation}
                  makkahLocation={MAKKAH_COORDS}
                  deviceOrientation={deviceOrientation}
                  isDark={isDark}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                <LocationIndicator
                  userLocation={userLocation}
                  makkahLocation={MAKKAH_COORDS}
                  isDark={isDark}
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
