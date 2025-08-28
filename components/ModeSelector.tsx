'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ChatMode } from '../hooks/useChatStore';

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  isDark?: boolean;
}

export default function ModeSelector({ 
  currentMode, 
  onModeChange, 
  isDark = false 
}: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    dropdown: isDark
      ? "bg-gray-800/95 border-gray-700/50"
      : "bg-white/95 border-gray-200/50",
    dropdownItem: isDark
      ? "hover:bg-gray-700/60"
      : "hover:bg-gray-50/80",
  };

  const modes = [
    {
      id: 'general' as ChatMode,
      name: 'General Islamic Knowledge',
      description: 'Ask any Islamic question - Quran, Hadith, Fiqh, History',
      icon: '🕌',
      color: 'emerald'
    },
    {
      id: 'guidance' as ChatMode,
      name: 'Daily Guidance',
      description: 'Motivational reminders and spiritual guidance',
      icon: '🌟',
      color: 'amber'
    },
    {
      id: 'quran' as ChatMode,
      name: 'Quran & Tafsir',
      description: 'Quranic verses explanation and interpretation',
      icon: '📖',
      color: 'blue'
    },
    {
      id: 'fiqh' as ChatMode,
      name: 'Fiqh & Rulings',
      description: 'Islamic jurisprudence and practical rulings',
      icon: '⚖️',
      color: 'purple'
    },
    {
      id: 'adkar' as ChatMode,
      name: 'Adkar & Duas',
      description: 'Supplications and remembrance of Allah',
      icon: '🤲',
      color: 'teal'
    },
    {
      id: 'stories' as ChatMode,
      name: 'Islamic Stories',
      description: 'Stories from Quran, Hadith, and Islamic history',
      icon: '📚',
      color: 'indigo'
    }
  ];

  const currentModeData = modes.find(mode => mode.id === currentMode);

  const handleModeSelect = (mode: ChatMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      emerald: isActive 
        ? 'bg-emerald-500 text-white' 
        : isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      amber: isActive 
        ? 'bg-amber-500 text-white' 
        : isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700',
      blue: isActive 
        ? 'bg-blue-500 text-white' 
        : isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700',
      purple: isActive 
        ? 'bg-purple-500 text-white' 
        : isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700',
      teal: isActive 
        ? 'bg-teal-500 text-white' 
        : isDark ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-100 text-teal-700',
      indigo: isActive 
        ? 'bg-indigo-500 text-white' 
        : isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="relative">
      {/* Current Mode Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
            : themeClasses.card
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark
              ? 'bg-white/20 text-white'
              : getColorClasses(currentModeData?.color || 'emerald', true)
          }`}>
            <span className="text-lg">{currentModeData?.icon}</span>
          </div>

          <div className="text-left">
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : themeClasses.text}`}>
              {currentModeData?.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/80' : themeClasses.subtitle} hidden md:block`}>
              {currentModeData?.description}
            </p>
          </div>
        </div>

        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        } ${isDark ? 'text-white/80' : themeClasses.subtitle}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border backdrop-blur-xl shadow-xl ${
            isDark ? 'bg-gray-900/95 border-white/20' : themeClasses.dropdown
          }`}>
            <div className="p-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    mode.id === currentMode 
                      ? getColorClasses(mode.color, true)
                      : themeClasses.dropdownItem
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    mode.id === currentMode 
                      ? 'bg-white/20' 
                      : getColorClasses(mode.color)
                  }`}>
                    <span className="text-lg">{mode.icon}</span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className={`font-medium ${
                      mode.id === currentMode ? 'text-white' : themeClasses.text
                    }`}>
                      {mode.name}
                    </h4>
                    <p className={`text-sm ${
                      mode.id === currentMode 
                        ? 'text-white/80' 
                        : themeClasses.subtitle
                    }`}>
                      {mode.description}
                    </p>
                  </div>

                  {mode.id === currentMode && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>

            {/* Mode Tips */}
            <div className={`p-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
                💡 Mode Tips:
              </h4>
              <div className="space-y-1 text-xs">
                <p className={themeClasses.subtitle}>
                  <strong>General:</strong> Best for broad Islamic questions and learning
                </p>
                <p className={themeClasses.subtitle}>
                  <strong>Guidance:</strong> For spiritual advice and motivation
                </p>
                <p className={themeClasses.subtitle}>
                  <strong>Quran:</strong> For verse explanations and tafsir
                </p>
                <p className={themeClasses.subtitle}>
                  <strong>Fiqh:</strong> For Islamic law and practical rulings
                </p>
                <p className={themeClasses.subtitle}>
                  <strong>Adkar:</strong> For duas and remembrance
                </p>
                <p className={themeClasses.subtitle}>
                  <strong>Stories:</strong> For Islamic narratives and history
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
