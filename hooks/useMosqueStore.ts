'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Mosque {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance?: number;
  type?: string;
  phone?: string;
  website?: string;
  prayerTimes?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  amenities?: string[];
  image?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface MosqueFilters {
  radius: number; // in km
  type: string;
  amenities: string[];
  openNow: boolean;
}

export interface MosqueState {
  userLocation: UserLocation | null;
  mosques: Mosque[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: MosqueFilters;
  favorites: Mosque[];
  lastSearchLocation: UserLocation | null;
}

const defaultFilters: MosqueFilters = {
  radius: 10,
  type: 'all',
  amenities: [],
  openNow: false,
};

const STORAGE_KEY = 'mosque-finder-data';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Mock mosque data - in a real app, this would come from an API
const generateMockMosques = (userLat: number, userLon: number): Mosque[] => {
  const mosqueNames = [
    'Masjid Al-Noor', 'Islamic Center', 'Masjid Al-Huda', 'Central Mosque',
    'Masjid Al-Furqan', 'Community Islamic Center', 'Masjid Al-Taqwa', 'Grand Mosque',
    'Masjid Al-Rahman', 'Islamic Society', 'Masjid Al-Barakah', 'Jami Mosque',
    'Masjid Al-Hidayah', 'Islamic Cultural Center', 'Masjid Al-Iman'
  ];

  const mosqueTypes = ['local', 'main', 'jami', 'community'];
  const amenities = ['parking', 'wheelchair_access', 'library', 'school', 'halal_food', 'wudu_facilities'];

  return mosqueNames.map((name, index) => {
    // Generate random coordinates within a reasonable radius
    const latOffset = (Math.random() - 0.5) * 0.2; // ~11km radius
    const lonOffset = (Math.random() - 0.5) * 0.2;
    const lat = userLat + latOffset;
    const lon = userLon + lonOffset;
    const distance = calculateDistance(userLat, userLon, lat, lon);

    return {
      id: `mosque-${index}`,
      name,
      address: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Park Rd', 'Center Blvd', 'Islamic Way'][Math.floor(Math.random() * 5)]}`,
      lat,
      lon,
      distance,
      type: mosqueTypes[Math.floor(Math.random() * mosqueTypes.length)],
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      amenities: amenities.slice(0, Math.floor(Math.random() * 4) + 2),
      prayerTimes: {
        fajr: '05:30',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:20',
        isha: '19:45'
      }
    };
  }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export function useMosqueStore() {
  const [state, setState] = useState<MosqueState>({
    userLocation: null,
    mosques: [],
    loading: false,
    error: null,
    searchQuery: '',
    filters: defaultFilters,
    favorites: [],
    lastSearchLocation: null,
  });

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          favorites: data.favorites || [],
        }));
      }
    } catch (error) {
      console.error('Error loading mosque data:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      const dataToSave = {
        favorites: state.favorites,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving mosque data:', error);
    }
  }, [state.favorites]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setState(prev => ({
          ...prev,
          userLocation,
          loading: false,
        }));

        // Auto-search for nearby mosques
        getNearbyMosques(userLocation);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const getNearbyMosques = useCallback((location: UserLocation) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // In a real app, this would be an API call
      const mockMosques = generateMockMosques(location.latitude, location.longitude);
      
      setState(prev => ({
        ...prev,
        mosques: mockMosques,
        lastSearchLocation: location,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch nearby mosques',
        loading: false,
      }));
    }
  }, []);

  const searchMosques = useCallback(async (query: string) => {
    if (!query.trim()) {
      if (state.userLocation) {
        getNearbyMosques(state.userLocation);
      }
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // In a real app, this would search via API
      // For now, filter existing mosques or generate new ones
      let searchResults: Mosque[] = [];

      if (state.mosques.length > 0) {
        // Filter existing mosques
        searchResults = state.mosques.filter(mosque =>
          mosque.name.toLowerCase().includes(query.toLowerCase()) ||
          mosque.address.toLowerCase().includes(query.toLowerCase())
        );
      } else if (state.userLocation) {
        // Generate new mosques and filter
        const allMosques = generateMockMosques(state.userLocation.latitude, state.userLocation.longitude);
        searchResults = allMosques.filter(mosque =>
          mosque.name.toLowerCase().includes(query.toLowerCase()) ||
          mosque.address.toLowerCase().includes(query.toLowerCase())
        );
      }

      setState(prev => ({
        ...prev,
        mosques: searchResults,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Search failed',
        loading: false,
      }));
    }
  }, [state.mosques, state.userLocation, getNearbyMosques]);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<MosqueFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));

    // Apply filters to current mosques
    setState(prev => {
      let filteredMosques = [...prev.mosques];

      // Filter by radius
      if (newFilters.radius !== undefined && prev.userLocation) {
        filteredMosques = filteredMosques.filter(mosque => 
          (mosque.distance || 0) <= newFilters.radius!
        );
      }

      // Filter by type
      if (newFilters.type && newFilters.type !== 'all') {
        filteredMosques = filteredMosques.filter(mosque => 
          mosque.type === newFilters.type
        );
      }

      return {
        ...prev,
        mosques: filteredMosques,
      };
    });
  }, []);

  const addToFavorites = useCallback((mosque: Mosque) => {
    setState(prev => ({
      ...prev,
      favorites: [...prev.favorites.filter(f => f.id !== mosque.id), mosque],
    }));
  }, []);

  const removeFromFavorites = useCallback((mosqueId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f.id !== mosqueId),
    }));
  }, []);

  const getPrayerTimes = useCallback(async (mosque: Mosque) => {
    // In a real app, this would call a prayer times API like Aladhan
    // For now, return mock data
    return {
      fajr: '05:30',
      dhuhr: '12:15',
      asr: '15:45',
      maghrib: '18:20',
      isha: '19:45',
    };
  }, []);

  return {
    // State
    userLocation: state.userLocation,
    mosques: state.mosques,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    filters: state.filters,
    favorites: state.favorites,

    // Actions
    getCurrentLocation,
    getNearbyMosques,
    searchMosques,
    setSearchQuery,
    updateFilters,
    addToFavorites,
    removeFromFavorites,
    getPrayerTimes,
  };
}
