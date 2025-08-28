'use client';

import React from 'react';
import { Navigation } from 'lucide-react';

interface CompassNeedleProps {
  bearing: number;
  deviceOrientation?: number;
  isDark?: boolean;
}

export default function CompassNeedle({ 
  bearing, 
  deviceOrientation = 0, 
  isDark = false 
}: CompassNeedleProps) {
  const needleRotation = bearing - deviceOrientation;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Main Qibla Needle */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
        style={{ transform: `translate(-50%, -50%) rotate(${needleRotation}deg)` }}
      >
        {/* Needle Shadow */}
        <div className="absolute inset-0 transform translate-x-0.5 translate-y-0.5 opacity-30">
          <div className={`w-1 h-32 ${isDark ? 'bg-black' : 'bg-gray-800'} rounded-full mx-auto`} 
               style={{ transformOrigin: 'center bottom' }} />
        </div>

        {/* Main Needle Body */}
        <div className="relative">
          {/* Qibla Direction (Top Half) */}
          <div 
            className="w-2 h-32 mx-auto rounded-t-full relative overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(to top, #10b981, #34d399, #6ee7b7)'
                : 'linear-gradient(to top, #059669, #10b981, #34d399)',
              transformOrigin: 'center bottom',
              boxShadow: isDark
                ? '0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)'
                : '0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Glowing Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-full" />
            
            {/* Needle Tip */}
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 ${
              isDark ? 'border-l-transparent border-r-transparent border-b-emerald-300' : 'border-l-transparent border-r-transparent border-b-emerald-600'
            }`} />
          </div>

          {/* Opposite Direction (Bottom Half) */}
          <div 
            className="w-1.5 h-16 mx-auto rounded-b-full"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, #6b7280, #9ca3af)'
                : 'linear-gradient(to bottom, #4b5563, #6b7280)',
              transformOrigin: 'center top'
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Center Ring */}
          <div className={`w-6 h-6 rounded-full border-2 ${
            isDark ? 'border-emerald-400 bg-gray-800' : 'border-emerald-600 bg-white'
          } shadow-lg`} />
          
          {/* Inner Dot */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
            isDark ? 'bg-emerald-400' : 'bg-emerald-600'
          }`} />
        </div>
      </div>

      {/* Qibla Direction Indicator */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
        style={{ transform: `translate(-50%, -50%) rotate(${needleRotation}deg) translateY(-110px)` }}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isDark ? 'bg-emerald-400 text-gray-900' : 'bg-emerald-600 text-white'
        } shadow-lg animate-pulse`}>
          <Navigation className="w-4 h-4" />
        </div>
      </div>

      {/* Bearing Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className={`px-4 py-2 rounded-full ${
          isDark ? 'bg-gray-800/80 text-emerald-400 border border-gray-600' : 'bg-white/90 text-emerald-600 border border-gray-300'
        } backdrop-blur-sm shadow-lg`}>
          <div className="text-center">
            <div className="text-xs font-medium opacity-75">Qibla</div>
            <div className="text-lg font-bold">{bearing.toFixed(1)}°</div>
          </div>
        </div>
      </div>

      {/* Animated Glow Ring */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
        style={{ transform: `translate(-50%, -50%) rotate(${needleRotation}deg)` }}
      >
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
          isDark ? 'bg-emerald-400/30' : 'bg-emerald-500/30'
        } animate-ping`} style={{ animationDuration: '2s' }} />
      </div>

      {/* Direction Arc */}
      <div className="absolute inset-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#10b981" : "#059669"} stopOpacity="0.6" />
              <stop offset="50%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isDark ? "#6ee7b7" : "#34d399"} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            className="animate-spin"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }}
          />
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-emerald-400/60' : 'bg-emerald-500/60'
          } animate-pulse`}
          style={{
            top: `${30 + Math.sin(i * 60 * Math.PI / 180) * 20}%`,
            left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 20}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
}
