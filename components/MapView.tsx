'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Mosque } from '../hooks/useMosqueStore';

interface MapViewProps {
  userLocation: { latitude: number; longitude: number } | null;
  mosques: Mosque[];
  onMosqueSelect: (mosque: Mosque) => void;
  selectedMosque?: Mosque | null;
  isDark?: boolean;
}

export default function MapView({ 
  userLocation, 
  mosques, 
  onMosqueSelect, 
  selectedMosque,
  isDark = false 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      if (typeof window === 'undefined') return;

      try {
        const L = (await import('leaflet')).default;

        // Fix for default markers in webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
          });

          // Add tile layer
          const tileLayer = isDark
            ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
              })
            : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 20
              });

          tileLayer.addTo(mapInstanceRef.current);

          // Set default view
          if (userLocation) {
            mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 13);
          } else {
            mapInstanceRef.current.setView([40.7128, -74.0060], 10); // Default to NYC
          }

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDark]);

  // Update user location marker
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const loadUserMarker = async () => {
      const L = (await import('leaflet')).default;

      if (userLocation) {
        // Create custom user location icon
        const userIcon = L.divIcon({
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: #3b82f6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: -5px;
                left: -5px;
                width: 30px;
                height: 30px;
                background: rgba(59, 130, 246, 0.2);
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            </div>
          `,
          className: 'user-location-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('Your Location')
          .openPopup();

        mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 13);
      }
    };

    loadUserMarker();
  }, [userLocation, mapLoaded]);

  // Update mosque markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const loadMosqueMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add mosque markers
      mosques.forEach((mosque, index) => {
        const isSelected = selectedMosque?.id === mosque.id;
        const isClosest = index === 0; // First mosque is closest

        // Create custom mosque icon
        const mosqueIcon = L.divIcon({
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: ${isSelected ? '40px' : '32px'};
                height: ${isSelected ? '40px' : '32px'};
                background: ${isSelected ? '#10b981' : isClosest ? '#f59e0b' : '#6b7280'};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${isSelected ? '18px' : '14px'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                cursor: pointer;
              ">
                🕌
              </div>
              ${isSelected ? `
                <div style="
                  position: absolute;
                  top: -8px;
                  left: -8px;
                  width: 56px;
                  height: 56px;
                  border: 2px solid #10b981;
                  border-radius: 50%;
                  animation: pulse 2s infinite;
                "></div>
              ` : ''}
              ${isClosest && !isSelected ? `
                <div style="
                  position: absolute;
                  top: -25px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: #f59e0b;
                  color: white;
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: bold;
                  white-space: nowrap;
                ">
                  CLOSEST
                </div>
              ` : ''}
            </div>
          `,
          className: 'mosque-marker',
          iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
          iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16]
        });

        const marker = L.marker([mosque.lat, mosque.lon], { icon: mosqueIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">
                ${mosque.name}
              </h3>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                ${mosque.address}
              </p>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #10b981; font-weight: bold;">
                  📍 ${mosque.distance?.toFixed(2)} km away
                </span>
              </div>
              <button 
                onclick="window.selectMosque('${mosque.id}')"
                style="
                  width: 100%;
                  padding: 8px;
                  background: #10b981;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-weight: bold;
                  cursor: pointer;
                "
              >
                View Details
              </button>
            </div>
          `)
          .on('click', () => {
            onMosqueSelect(mosque);
          });

        markersRef.current.push(marker);
      });

      // Fit map to show all markers
      if (mosques.length > 0 && userLocation) {
        const group = L.featureGroup([
          ...markersRef.current,
          L.marker([userLocation.latitude, userLocation.longitude])
        ]);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    };

    loadMosqueMarkers();

    // Add global function for popup buttons
    (window as any).selectMosque = (mosqueId: string) => {
      const mosque = mosques.find(m => m.id === mosqueId);
      if (mosque) {
        onMosqueSelect(mosque);
      }
    };

    return () => {
      delete (window as any).selectMosque;
    };
  }, [mosques, selectedMosque, mapLoaded, onMosqueSelect, userLocation]);

  return (
    <div className="relative w-full h-96">
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        {userLocation && (
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 15);
              }
            }}
            className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50 text-white hover:bg-gray-700/80' 
                : 'bg-white/90 border-gray-200/50 text-gray-900 hover:bg-white'
            }`}
            title="Center on my location"
          >
            <Navigation className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Map Legend */}
      <div className={`absolute bottom-4 left-4 z-[1000] p-4 rounded-xl backdrop-blur-xl border ${
        isDark 
          ? 'bg-gray-800/80 border-gray-700/50 text-white' 
          : 'bg-white/90 border-gray-200/50 text-gray-900'
      }`}>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-xs">
              🕌
            </div>
            <span>Closest Mosque</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center text-xs">
              🕌
            </div>
            <span>Other Mosques</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading map...
            </p>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
