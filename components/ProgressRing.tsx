'use client';

import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  isDark?: boolean;
  children?: React.ReactNode;
}

export default function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 8,
  isDark = false,
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? "#10b981" : "#059669"} />
            <stop offset="50%" stopColor={isDark ? "#34d399" : "#10b981"} />
            <stop offset="100%" stopColor={isDark ? "#6ee7b7" : "#34d399"} />
          </linearGradient>
          
          <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? "#374151" : "#e5e7eb"} />
            <stop offset="100%" stopColor={isDark ? "#4b5563" : "#d1d5db"} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="url(#backgroundGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />

        {/* Progress Circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          filter="url(#glow)"
          style={{
            filter: progress > 0 ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : 'none'
          }}
        />

        {/* Decorative Dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const dotX = centerX + (radius + strokeWidth / 2 + 8) * Math.cos(angle);
          const dotY = centerY + (radius + strokeWidth / 2 + 8) * Math.sin(angle);
          
          return (
            <circle
              key={i}
              cx={dotX}
              cy={dotY}
              r={2}
              fill={isDark ? "#10b981" : "#059669"}
              opacity={0.4}
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          );
        })}

        {/* Center Glow */}
        {progress > 90 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth}
            fill="url(#progressGradient)"
            opacity={0.1}
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Progress Percentage */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isDark 
            ? 'bg-gray-800/80 text-emerald-400 border border-gray-600' 
            : 'bg-white/90 text-emerald-600 border border-gray-300'
        } backdrop-blur-sm`}>
          {progress.toFixed(0)}%
        </div>
      </div>

      {/* Milestone Markers */}
      {[25, 50, 75, 100].map((milestone) => {
        const angle = (milestone / 100) * 360 - 90; // -90 to start from top
        const markerRadius = radius + strokeWidth / 2 + 15;
        const markerX = centerX + markerRadius * Math.cos(angle * Math.PI / 180);
        const markerY = centerY + markerRadius * Math.sin(angle * Math.PI / 180);
        
        return (
          <div
            key={milestone}
            className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              progress >= milestone
                ? isDark 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-emerald-500 text-white shadow-lg'
                : isDark
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-500'
            }`}
            style={{
              left: markerX - 12,
              top: markerY - 12,
              transform: progress >= milestone ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {milestone === 100 ? '🎉' : milestone}
          </div>
        );
      })}
    </div>
  );
}
