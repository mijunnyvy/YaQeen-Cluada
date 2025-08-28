'use client';

import React from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

interface TafsirToggleProps {
  showTafsir: boolean;
  setShowTafsir: (show: boolean) => void;
  isDark?: boolean;
}

export default function TafsirToggle({ showTafsir, setShowTafsir, isDark = false }: TafsirToggleProps) {
  const themeClasses = {
    container: isDark
      ? "bg-gray-800/60 border-gray-700/50 text-white"
      : "bg-white/90 border-gray-200/50 text-gray-900",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    text: isDark ? "text-gray-300" : "text-gray-600",
    title: isDark ? "text-white" : "text-gray-900",
    infoBox: isDark ? "bg-blue-900/30 border-blue-700/50" : "bg-blue-50/80 border-blue-200/50",
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5" />
        <h3 className={`font-semibold ${themeClasses.title}`}>Tafsir Settings</h3>
      </div>

      <div className="space-y-4">
        {/* Global Tafsir Toggle */}
        <button
          onClick={() => setShowTafsir(!showTafsir)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
            showTafsir ? themeClasses.activeButton : themeClasses.button
          }`}
        >
          <div className="flex items-center space-x-3">
            {showTafsir ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span className="font-medium">
              {showTafsir ? "Hide All Tafsir" : "Show All Tafsir"}
            </span>
          </div>
          <div className={`text-sm ${showTafsir ? 'text-white/80' : themeClasses.text}`}>
            {showTafsir ? "إخفاء جميع التفاسير" : "عرض جميع التفاسير"}
          </div>
        </button>

        {/* Status Indicator */}
        <div className={`p-3 rounded-xl border ${themeClasses.infoBox}`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${showTafsir ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${themeClasses.title}`}>
              Global Tafsir: {showTafsir ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className={`text-xs ${themeClasses.text}`}>
            {showTafsir
              ? "Tafsir commentary will be shown for all verses automatically"
              : "Tafsir commentary is hidden for all verses"
            }
          </p>
        </div>

        {/* Information */}
        <div className={`text-sm ${themeClasses.text} leading-relaxed`}>
          <p className="mb-2">
            <strong>Tafsir</strong> provides detailed commentary and explanation of Quranic verses.
          </p>
          <p>
            When enabled globally, all verses will automatically display their Tafsir commentary
            without needing to toggle each verse individually.
          </p>
        </div>
      </div>
    </div>
  );
}
