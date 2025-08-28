'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Infinity, 
  RotateCcw, 
  Settings, 
  Plus, 
  Minus,
  Play,
  Pause
} from 'lucide-react';
import ProgressRing from './ProgressRing';
import BeadAnimation from './BeadAnimation';

interface TasbihCounterProps {
  count: number;
  target: number;
  mode: 'target' | 'infinite';
  zikr: string;
  onIncrement: () => void;
  onReset: () => void;
  onModeChange: (mode: 'target' | 'infinite') => void;
  onTargetChange: (target: number) => void;
  onZikrChange: (zikr: string) => void;
  isDark?: boolean;
}

const commonZikr = [
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah' },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah' },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is Greatest' },
  { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illa Allah', meaning: 'There is no god but Allah' },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
];

export default function TasbihCounter({
  count,
  target,
  mode,
  zikr,
  onIncrement,
  onReset,
  onModeChange,
  onTargetChange,
  onZikrChange,
  isDark = false
}: TasbihCounterProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showZikrSelector, setShowZikrSelector] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentZikrInfo = commonZikr.find(z => z.arabic === zikr) || commonZikr[0];
  const progress = mode === 'target' ? Math.min((count / target) * 100, 100) : 0;

  useEffect(() => {
    if (mode === 'target' && count >= target && !isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else if (count < target) {
      setIsCompleted(false);
    }
  }, [count, target, mode, isCompleted]);

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    incrementButton: isDark
      ? "bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
      : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  return (
    <div className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
            Digital Tasbih
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onModeChange(mode === 'target' ? 'infinite' : 'target')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                mode === 'target' ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              {mode === 'target' ? <Target className="w-4 h-4" /> : <Infinity className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {mode === 'target' ? 'Target Mode' : 'Infinite Mode'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowZikrSelector(!showZikrSelector)}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
            title="Select Zikr"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={onReset}
            className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
            title="Reset Counter"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Zikr Selector */}
      {showZikrSelector && (
        <div className={`mb-8 p-6 rounded-2xl border ${themeClasses.container}`}>
          <h3 className={`font-bold ${themeClasses.text} mb-4`}>Select Zikr</h3>
          <div className="grid grid-cols-1 gap-3">
            {commonZikr.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onZikrChange(item.arabic);
                  setShowZikrSelector(false);
                }}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  item.arabic === zikr ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                <div className={`text-lg font-bold mb-1 ${item.arabic === zikr ? 'text-white' : themeClasses.text}`} dir="rtl">
                  {item.arabic}
                </div>
                <div className={`text-sm ${item.arabic === zikr ? 'text-white/80' : themeClasses.subtitle}`}>
                  {item.transliteration} - {item.meaning}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Settings */}
      {mode === 'target' && (
        <div className={`mb-8 p-6 rounded-2xl border ${themeClasses.container}`}>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${themeClasses.text}`}>Target Count</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTargetChange(Math.max(1, target - 1))}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className={`text-xl font-bold ${themeClasses.accent} min-w-[3rem] text-center`}>
                {target}
              </span>
              <button
                onClick={() => onTargetChange(target + 1)}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Quick Target Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[33, 99, 100, 500, 1000].map((quickTarget) => (
              <button
                key={quickTarget}
                onClick={() => onTargetChange(quickTarget)}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                  target === quickTarget ? themeClasses.activeButton : themeClasses.button
                }`}
              >
                {quickTarget}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Counter Display */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center">
          {mode === 'target' ? (
            <ProgressRing
              progress={progress}
              size={280}
              strokeWidth={8}
              isDark={isDark}
            >
              <div className="text-center">
                <div className={`text-6xl font-bold ${themeClasses.accent} mb-2`}>
                  {count}
                </div>
                <div className={`text-lg ${themeClasses.subtitle}`}>
                  of {target}
                </div>
                {isCompleted && (
                  <div className={`text-sm font-medium ${themeClasses.gold} mt-2`}>
                    ✨ Completed!
                  </div>
                )}
              </div>
            </ProgressRing>
          ) : (
            <div className="text-center">
              <div className={`text-8xl font-bold ${themeClasses.accent} mb-4`}>
                {count}
              </div>
              <div className={`text-lg ${themeClasses.subtitle}`}>
                Infinite Mode
              </div>
            </div>
          )}
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-full animate-pulse" />
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 ${themeClasses.gold} bg-current rounded-full animate-ping`}
                style={{
                  top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`,
                  left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Zikr Display */}
      <div className={`mb-8 p-6 rounded-2xl border text-center ${themeClasses.container}`}>
        <div className={`text-2xl font-bold mb-2 ${themeClasses.text}`} dir="rtl">
          {currentZikrInfo.arabic}
        </div>
        <div className={`text-lg ${themeClasses.subtitle} mb-1`}>
          {currentZikrInfo.transliteration}
        </div>
        <div className={`text-sm ${themeClasses.subtitle}`}>
          {currentZikrInfo.meaning}
        </div>
      </div>

      {/* Bead Animation */}
      <div className="mb-8">
        <BeadAnimation
          count={count}
          target={mode === 'target' ? target : 100}
          isDark={isDark}
        />
      </div>

      {/* Increment Button */}
      <div className="text-center">
        <button
          onClick={onIncrement}
          className={`w-32 h-32 rounded-full font-bold text-2xl transition-all duration-200 transform active:scale-95 hover:scale-105 shadow-2xl ${themeClasses.incrementButton}`}
          style={{
            boxShadow: isDark
              ? '0 20px 40px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
              : '0 20px 40px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1">📿</span>
            <span className="text-sm">TAP</span>
          </div>
        </button>
      </div>
    </div>
  );
}
