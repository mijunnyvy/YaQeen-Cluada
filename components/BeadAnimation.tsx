'use client';

import React, { useEffect, useState } from 'react';

interface BeadAnimationProps {
  count: number;
  target: number;
  isDark?: boolean;
}

export default function BeadAnimation({ count, target, isDark = false }: BeadAnimationProps) {
  const [animatingBead, setAnimatingBead] = useState<number | null>(null);
  
  // Number of beads to display (max 33 for traditional tasbih)
  const maxBeads = Math.min(target, 33);
  const beadsPerRow = 11; // Traditional tasbih layout
  
  useEffect(() => {
    if (count > 0) {
      const beadIndex = ((count - 1) % maxBeads);
      setAnimatingBead(beadIndex);
      
      const timer = setTimeout(() => {
        setAnimatingBead(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [count, maxBeads]);

  const getBeadColor = (index: number) => {
    const completedBeads = count % maxBeads;
    const isActive = index < completedBeads;
    const isAnimating = animatingBead === index;
    
    if (isAnimating) {
      return isDark 
        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50' 
        : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/50';
    }
    
    if (isActive) {
      return isDark 
        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' 
        : 'bg-gradient-to-br from-emerald-600 to-emerald-800';
    }
    
    return isDark 
      ? 'bg-gradient-to-br from-gray-600 to-gray-800' 
      : 'bg-gradient-to-br from-gray-300 to-gray-500';
  };

  const getBeadSize = (index: number) => {
    const isAnimating = animatingBead === index;
    return isAnimating ? 'w-4 h-4' : 'w-3 h-3';
  };

  const renderBeadString = () => {
    const beads = [];
    
    // Create beads in traditional tasbih pattern
    for (let i = 0; i < maxBeads; i++) {
      const isSpecialBead = i === 10 || i === 21 || i === 32; // Larger beads at intervals
      
      beads.push(
        <div
          key={i}
          className={`
            ${getBeadSize(i)} 
            ${getBeadColor(i)} 
            rounded-full 
            transition-all 
            duration-300 
            transform
            ${animatingBead === i ? 'scale-125 animate-pulse' : 'scale-100'}
            ${isSpecialBead ? 'ring-2 ring-amber-400/50' : ''}
          `}
          style={{
            animationDelay: animatingBead === i ? '0ms' : `${i * 50}ms`,
          }}
        />
      );
    }
    
    return beads;
  };

  const renderCircularBeads = () => {
    const beads = [];
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    for (let i = 0; i < maxBeads; i++) {
      const angle = (i / maxBeads) * 2 * Math.PI - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const isSpecialBead = i === 0 || i === Math.floor(maxBeads / 3) || i === Math.floor(2 * maxBeads / 3);
      
      beads.push(
        <div
          key={i}
          className={`
            absolute
            ${getBeadSize(i)} 
            ${getBeadColor(i)} 
            rounded-full 
            transition-all 
            duration-300 
            transform
            ${animatingBead === i ? 'scale-150 animate-pulse' : 'scale-100'}
            ${isSpecialBead ? 'ring-2 ring-amber-400/50' : ''}
          `}
          style={{
            left: x - 6,
            top: y - 6,
            animationDelay: animatingBead === i ? '0ms' : `${i * 30}ms`,
          }}
        />
      );
    }
    
    return beads;
  };

  const completionPercentage = (count % maxBeads) / maxBeads * 100;

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl ${
      isDark ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Prayer Beads
        </h3>
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {count % maxBeads} / {maxBeads}
        </div>
      </div>

      {/* Circular Bead Layout */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Connection String */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={isDark ? "#374151" : "#d1d5db"}
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          
          {/* Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={isDark ? "#10b981" : "#059669"}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - completionPercentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-500"
            transform="rotate(-90 100 100)"
            opacity="0.6"
          />
        </svg>
        
        {renderCircularBeads()}
        
        {/* Center Counter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {count % maxBeads}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              of {maxBeads}
            </div>
          </div>
        </div>
      </div>

      {/* Linear Bead Layout (Alternative) */}
      <div className="hidden">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {renderBeadString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
          }`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Cycle Counter */}
      <div className="text-center">
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Cycles Completed: <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {Math.floor(count / maxBeads)}
          </span>
        </div>
      </div>

      {/* Completion Animation */}
      {count > 0 && count % maxBeads === 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-2xl animate-pulse" />
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${isDark ? 'bg-amber-400' : 'bg-amber-500'} rounded-full animate-ping`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
