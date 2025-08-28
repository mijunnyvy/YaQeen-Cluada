'use client';

import React from "react";
import { Type, Minus, Plus } from "lucide-react";

export interface FontSettingsProps {
  font: {
    style: string;
    size: string;
  };
  setFont: React.Dispatch<React.SetStateAction<{ style: string; size: string }>>;
  isDark?: boolean;
}

const FontSettings: React.FC<FontSettingsProps> = ({ font, setFont, isDark = false }) => {
  const fontSizes = [
    { label: 'S', value: '16', description: 'Small' },
    { label: 'M', value: '20', description: 'Medium' },
    { label: 'L', value: '24', description: 'Large' },
    { label: 'XL', value: '28', description: 'Extra Large' },
  ];

  const fontStyles = [
    { label: 'Amiri Quran', value: 'amiri', description: 'Traditional Arabic font' },
    { label: 'Default', value: 'default', description: 'System default font' },
  ];

  const themeClasses = {
    container: isDark
      ? "bg-gray-800/60 border-gray-700/50 text-white"
      : "bg-white/90 border-gray-200/50 text-gray-900",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white border-gray-600/50"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 border-gray-300/50",
    activeButton: isDark
      ? "bg-emerald-600 text-white border-emerald-500"
      : "bg-emerald-500 text-white border-emerald-400",
    text: isDark ? "text-gray-300" : "text-gray-600",
    label: isDark ? "text-white" : "text-gray-900",
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Type className="w-5 h-5" />
        <h3 className={`font-semibold ${themeClasses.label}`}>Font Settings</h3>
      </div>

      {/* Font Style Selection */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-3 ${themeClasses.label}`}>
          Font Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {fontStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setFont((prev) => ({ ...prev, style: style.value }))}
              className={`p-3 rounded-xl border transition-all duration-300 text-left ${
                font.style === style.value
                  ? themeClasses.activeButton
                  : themeClasses.button
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className={`text-xs ${themeClasses.text}`}>{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Selection */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-3 ${themeClasses.label}`}>
          Font Size
        </label>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setFont((prev) => ({ ...prev, size: size.value }))}
              className={`p-3 rounded-xl border transition-all duration-300 text-center ${
                font.size === size.value
                  ? themeClasses.activeButton
                  : themeClasses.button
              }`}
            >
              <div className="font-bold text-lg">{size.label}</div>
              <div className={`text-xs ${themeClasses.text}`}>{size.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size Adjustment */}
      <div className="flex items-center justify-between">
        <span className={`text-sm ${themeClasses.text}`}>Custom Size:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const currentSize = parseInt(font.size);
              if (currentSize > 12) {
                setFont((prev) => ({ ...prev, size: (currentSize - 2).toString() }));
              }
            }}
            className={`p-2 rounded-lg border transition-all duration-300 ${themeClasses.button}`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className={`min-w-[3rem] text-center font-medium ${themeClasses.label}`}>
            {font.size}px
          </span>
          <button
            onClick={() => {
              const currentSize = parseInt(font.size);
              if (currentSize < 40) {
                setFont((prev) => ({ ...prev, size: (currentSize + 2).toString() }));
              }
            }}
            className={`p-2 rounded-lg border transition-all duration-300 ${themeClasses.button}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Text */}
      <div className="mt-4 p-3 rounded-xl bg-gray-100/50 dark:bg-gray-700/50">
        <div className={`text-center ${themeClasses.text} text-xs mb-2`}>Preview:</div>
        <div
          className={`text-center ${themeClasses.label}`}
          style={{
            fontFamily: font.style === 'amiri' ? 'Amiri Quran, serif' : 'inherit',
            fontSize: `${font.size}px`,
            lineHeight: '1.6'
          }}
        >
          {font.style === 'amiri' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
