'use client';

import React from 'react';

interface CompassDialProps {
  rotation?: number;
  isDark?: boolean;
}

export default function CompassDial({ rotation = 0, isDark = false }: CompassDialProps) {
  const directions = [
    { label: 'N', angle: 0, color: 'text-red-500', isCardinal: true },
    { label: 'NE', angle: 45, color: isDark ? 'text-gray-400' : 'text-gray-600', isCardinal: false },
    { label: 'E', angle: 90, color: isDark ? 'text-gray-300' : 'text-gray-700', isCardinal: true },
    { label: 'SE', angle: 135, color: isDark ? 'text-gray-400' : 'text-gray-600', isCardinal: false },
    { label: 'S', angle: 180, color: isDark ? 'text-gray-300' : 'text-gray-700', isCardinal: true },
    { label: 'SW', angle: 225, color: isDark ? 'text-gray-400' : 'text-gray-600', isCardinal: false },
    { label: 'W', angle: 270, color: isDark ? 'text-gray-300' : 'text-gray-700', isCardinal: true },
    { label: 'NW', angle: 315, color: isDark ? 'text-gray-400' : 'text-gray-600', isCardinal: false },
  ];

  const degreeMarks = Array.from({ length: 72 }, (_, i) => i * 5); // Every 5 degrees

  return (
    <div 
      className="absolute inset-0 transition-transform duration-500 ease-out"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Degree Marks */}
      {degreeMarks.map((degree) => {
        const isMainMark = degree % 30 === 0; // Every 30 degrees
        const isMediumMark = degree % 10 === 0; // Every 10 degrees
        
        return (
          <div
            key={degree}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${degree}deg) translateY(-150px)`,
              transformOrigin: 'center 150px'
            }}
          >
            <div
              className={`${
                isMainMark 
                  ? `w-0.5 h-6 ${isDark ? 'bg-gray-300' : 'bg-gray-700'}` 
                  : isMediumMark 
                  ? `w-0.5 h-4 ${isDark ? 'bg-gray-400' : 'bg-gray-600'}` 
                  : `w-px h-2 ${isDark ? 'bg-gray-500' : 'bg-gray-500'}`
              } mx-auto`}
            />
            
            {/* Degree Numbers */}
            {isMainMark && (
              <div 
                className={`text-xs font-medium mt-1 text-center ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
                style={{ transform: `rotate(-${degree + rotation}deg)` }}
              >
                {degree === 0 ? '360' : degree}
              </div>
            )}
          </div>
        );
      })}

      {/* Cardinal and Intercardinal Directions */}
      {directions.map((direction) => (
        <div
          key={direction.label}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${direction.angle}deg) translateY(-120px)`,
            transformOrigin: 'center 120px'
          }}
        >
          <div
            className={`text-center ${direction.color} font-bold ${
              direction.isCardinal ? 'text-lg' : 'text-sm'
            }`}
            style={{ transform: `rotate(-${direction.angle + rotation}deg)` }}
          >
            {direction.label}
          </div>
        </div>
      ))}

      {/* Decorative Inner Ring */}
      <div className={`absolute inset-8 rounded-full border-2 ${
        isDark ? 'border-gray-600/30' : 'border-gray-400/30'
      }`} />
      
      {/* Decorative Outer Ring */}
      <div className={`absolute inset-2 rounded-full border ${
        isDark ? 'border-gray-600/20' : 'border-gray-400/20'
      }`} />

      {/* Islamic Pattern Decorations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-100px)`,
              transformOrigin: 'center 100px'
            }}
          >
            <div className={`w-1 h-1 rounded-full ${
              isDark ? 'bg-emerald-400/40' : 'bg-emerald-500/40'
            }`} />
          </div>
        ))}
      </div>

      {/* Subtle Gradient Overlay */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.1) 0deg, transparent 45deg, rgba(245, 158, 11, 0.1) 90deg, transparent 135deg, rgba(16, 185, 129, 0.1) 180deg, transparent 225deg, rgba(245, 158, 11, 0.1) 270deg, transparent 315deg, rgba(16, 185, 129, 0.1) 360deg)'
            : 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.05) 0deg, transparent 45deg, rgba(245, 158, 11, 0.05) 90deg, transparent 135deg, rgba(16, 185, 129, 0.05) 180deg, transparent 225deg, rgba(245, 158, 11, 0.05) 270deg, transparent 315deg, rgba(16, 185, 129, 0.05) 360deg)'
        }}
      />
    </div>
  );
}
