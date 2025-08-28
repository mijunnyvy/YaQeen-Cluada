'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
  arabicName: string;
  icon: string;
  description: string;
}

export interface DayPrayerTimes {
  date: string;
  hijriDate: string;
  prayers: PrayerTime[];
  sunrise: string;
  sunset: string;
  qibla: number;
}

export interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PrayerSettings {
  method: number; // Calculation method (1-15)
  school: number; // Fiqh school (0: Shafi, 1: Hanafi)
  timeFormat: '12h' | '24h';
  notifications: boolean;
  soundEnabled: boolean;
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface PrayerTimesState {
  currentLocation: Location | null;
  prayerTimes: DayPrayerTimes[];
  currentPrayer: string | null;
  nextPrayer: string | null;
  timeToNextPrayer: number;
  settings: PrayerSettings;
  loading: boolean;
  error: string | null;
}

const DEFAULT_SETTINGS: PrayerSettings = {
  method: 2, // ISNA
  school: 0, // Shafi
  timeFormat: '12h',
  notifications: false,
  soundEnabled: false,
  adjustments: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
};

const CALCULATION_METHODS = {
  1: 'University of Islamic Sciences, Karachi',
  2: 'Islamic Society of North America (ISNA)',
  3: 'Muslim World League (MWL)',
  4: 'Umm al-Qura, Makkah',
  5: 'Egyptian General Authority of Survey',
  8: 'Institute of Geophysics, University of Tehran',
  9: 'Gulf Region',
  10: 'Kuwait',
  11: 'Qatar',
  12: 'Majlis Ugama Islam Singapura',
  13: 'Union Organization islamic de France',
  14: 'Diyanet İşleri Başkanlığı, Turkey',
  15: 'Spiritual Administration of Muslims of Russia',
};

const PRAYER_NAMES = {
  fajr: { arabic: 'الفجر', icon: '🌅', description: 'Dawn Prayer' },
  dhuhr: { arabic: 'الظهر', icon: '☀️', description: 'Noon Prayer' },
  asr: { arabic: 'العصر', icon: '🌤️', description: 'Afternoon Prayer' },
  maghrib: { arabic: 'المغرب', icon: '🌅', description: 'Sunset Prayer' },
  isha: { arabic: 'العشاء', icon: '🌙', description: 'Night Prayer' },
};

const STORAGE_KEY = 'prayer-times-data';

export function usePrayerTimesStore() {
  const [state, setState] = useState<PrayerTimesState>({
    currentLocation: null,
    prayerTimes: [],
    currentPrayer: null,
    nextPrayer: null,
    timeToNextPrayer: 0,
    settings: DEFAULT_SETTINGS,
    loading: false,
    error: null,
  });

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          currentLocation: parsedData.currentLocation || null,
          settings: { ...DEFAULT_SETTINGS, ...parsedData.settings },
        }));
      }
    } catch (error) {
      console.error('Error loading prayer times data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        currentLocation: state.currentLocation,
        settings: state.settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving prayer times data:', error);
    }
  }, [state.currentLocation, state.settings]);

  // Get user's current location
  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocoding to get city name
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
            
            resolve(location);
          } catch (error) {
            console.error('Error getting location details:', error);
            resolve(null);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  // Fetch prayer times from Aladhan API
  const fetchPrayerTimes = useCallback(async (location: Location, days: number = 7) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const prayerTimesData: DayPrayerTimes[] = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const dateString = date.toISOString().split('T')[0];
        const [year, month, day] = dateString.split('-');
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=${state.settings.method}&school=${state.settings.school}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }
        
        const data = await response.json();
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;
        
        // Convert prayer times to our format
        const prayers: PrayerTime[] = [
          {
            name: 'Fajr',
            time: formatTime(timings.Fajr, state.settings.timeFormat),
            timestamp: getTimestamp(timings.Fajr, dateString),
            arabicName: PRAYER_NAMES.fajr.arabic,
            icon: PRAYER_NAMES.fajr.icon,
            description: PRAYER_NAMES.fajr.description,
          },
          {
            name: 'Dhuhr',
            time: formatTime(timings.Dhuhr, state.settings.timeFormat),
            timestamp: getTimestamp(timings.Dhuhr, dateString),
            arabicName: PRAYER_NAMES.dhuhr.arabic,
            icon: PRAYER_NAMES.dhuhr.icon,
            description: PRAYER_NAMES.dhuhr.description,
          },
          {
            name: 'Asr',
            time: formatTime(timings.Asr, state.settings.timeFormat),
            timestamp: getTimestamp(timings.Asr, dateString),
            arabicName: PRAYER_NAMES.asr.arabic,
            icon: PRAYER_NAMES.asr.icon,
            description: PRAYER_NAMES.asr.description,
          },
          {
            name: 'Maghrib',
            time: formatTime(timings.Maghrib, state.settings.timeFormat),
            timestamp: getTimestamp(timings.Maghrib, dateString),
            arabicName: PRAYER_NAMES.maghrib.arabic,
            icon: PRAYER_NAMES.maghrib.icon,
            description: PRAYER_NAMES.maghrib.description,
          },
          {
            name: 'Isha',
            time: formatTime(timings.Isha, state.settings.timeFormat),
            timestamp: getTimestamp(timings.Isha, dateString),
            arabicName: PRAYER_NAMES.isha.arabic,
            icon: PRAYER_NAMES.isha.icon,
            description: PRAYER_NAMES.isha.description,
          },
        ];

        prayerTimesData.push({
          date: dateString,
          hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`,
          prayers,
          sunrise: formatTime(timings.Sunrise, state.settings.timeFormat),
          sunset: formatTime(timings.Sunset, state.settings.timeFormat),
          qibla: data.data.meta.qibla || 0,
        });
      }

      setState(prev => ({
        ...prev,
        prayerTimes: prayerTimesData,
        loading: false,
      }));

      return prayerTimesData;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch prayer times. Please try again.',
      }));
      return [];
    }
  }, [state.settings.method, state.settings.school, state.settings.timeFormat]);

  // Helper function to format time
  const formatTime = (time: string, format: '12h' | '24h'): string => {
    const [hours, minutes] = time.split(':').map(Number);
    
    if (format === '24h') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to get timestamp
  const getTimestamp = (time: string, date: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj.getTime();
  };

  // Update current and next prayer
  const updateCurrentPrayer = useCallback(() => {
    if (state.prayerTimes.length === 0) return;

    const now = Date.now();
    const todayPrayers = state.prayerTimes[0]?.prayers || [];
    
    let currentPrayer = null;
    let nextPrayer = null;
    let timeToNext = 0;

    // Find current and next prayer
    for (let i = 0; i < todayPrayers.length; i++) {
      const prayer = todayPrayers[i];
      
      if (now < prayer.timestamp) {
        nextPrayer = prayer.name;
        timeToNext = prayer.timestamp - now;
        break;
      } else if (i === todayPrayers.length - 1 || now < todayPrayers[i + 1].timestamp) {
        currentPrayer = prayer.name;
        if (i < todayPrayers.length - 1) {
          nextPrayer = todayPrayers[i + 1].name;
          timeToNext = todayPrayers[i + 1].timestamp - now;
        } else {
          // Next prayer is Fajr of tomorrow
          const tomorrowPrayers = state.prayerTimes[1]?.prayers || [];
          if (tomorrowPrayers.length > 0) {
            nextPrayer = tomorrowPrayers[0].name;
            timeToNext = tomorrowPrayers[0].timestamp - now;
          }
        }
        break;
      }
    }

    setState(prev => ({
      ...prev,
      currentPrayer,
      nextPrayer,
      timeToNextPrayer: timeToNext,
    }));
  }, [state.prayerTimes]);

  // Update prayer status every minute
  useEffect(() => {
    updateCurrentPrayer();
    const interval = setInterval(updateCurrentPrayer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateCurrentPrayer]);

  // Set location and fetch prayer times
  const setLocation = useCallback(async (location: Location) => {
    setState(prev => ({ ...prev, currentLocation: location }));
    await fetchPrayerTimes(location);
  }, [fetchPrayerTimes]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<PrayerSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  // Search for location by city name
  const searchLocation = useCallback(async (cityName: string): Promise<Location[]> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=demo` // You'd need a real API key
      );
      
      if (!response.ok) {
        // Fallback to a simple geocoding service
        const fallbackResponse = await fetch(
          `https://api.bigdatacloud.net/data/city?name=${encodeURIComponent(cityName)}`
        );
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          return [{
            city: data.name || cityName,
            country: data.country || 'Unknown',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }];
        }
        
        throw new Error('Location not found');
      }
      
      const data = await response.json();
      return data.map((item: any) => ({
        city: item.name,
        country: item.country,
        latitude: item.lat,
        longitude: item.lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }));
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    getCurrentLocation,
    setLocation,
    fetchPrayerTimes,
    updateSettings,
    searchLocation,
    
    // Constants
    CALCULATION_METHODS,
    PRAYER_NAMES,
  };
}
