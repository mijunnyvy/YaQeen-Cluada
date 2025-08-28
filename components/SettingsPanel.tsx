'use client';

import React, { useState } from 'react';
import { X, Settings, Clock, Bell, Volume2, VolumeX, Save } from 'lucide-react';
import { PrayerSettings } from '../hooks/usePrayerTimesStore';

interface SettingsPanelProps {
  settings: PrayerSettings;
  onSettingsUpdate: (settings: Partial<PrayerSettings>) => void;
  onClose: () => void;
  isDark?: boolean;
}

export default function SettingsPanel({
  settings,
  onSettingsUpdate,
  onClose,
  isDark = false
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<PrayerSettings>(settings);

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white"
      : "bg-white/90 border-gray-300/50 text-gray-900",
  };

  const calculationMethods = [
    { value: 1, label: 'University of Islamic Sciences, Karachi' },
    { value: 2, label: 'Islamic Society of North America (ISNA)' },
    { value: 3, label: 'Muslim World League (MWL)' },
    { value: 4, label: 'Umm al-Qura, Makkah' },
    { value: 5, label: 'Egyptian General Authority of Survey' },
    { value: 8, label: 'Institute of Geophysics, University of Tehran' },
    { value: 9, label: 'Gulf Region' },
    { value: 10, label: 'Kuwait' },
    { value: 11, label: 'Qatar' },
    { value: 12, label: 'Majlis Ugama Islam Singapura' },
    { value: 13, label: 'Union Organization islamic de France' },
    { value: 14, label: 'Diyanet İşleri Başkanlığı, Turkey' },
    { value: 15, label: 'Spiritual Administration of Muslims of Russia' },
  ];

  const handleSave = () => {
    onSettingsUpdate(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const updateLocalSetting = (key: keyof PrayerSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAdjustment = (prayer: keyof PrayerSettings['adjustments'], value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      adjustments: { ...prev.adjustments, [prayer]: value }
    }));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${themeClasses.card}`}>
              <Settings className={`w-5 h-5 ${themeClasses.accent}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>
                Prayer Settings
              </h2>
              <p className={`text-sm ${themeClasses.subtitle}`}>
                Customize your prayer time preferences
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Calculation Method */}
          <div className={`p-4 rounded-xl ${themeClasses.card}`}>
            <h3 className={`font-medium ${themeClasses.text} mb-3`}>
              Calculation Method
            </h3>
            <select
              value={localSettings.method}
              onChange={(e) => updateLocalSetting('method', parseInt(e.target.value))}
              className={`w-full p-3 rounded-xl border transition-all duration-300 ${themeClasses.input}`}
            >
              {calculationMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            <p className={`text-xs ${themeClasses.subtitle} mt-2`}>
              Different organizations use different calculation methods for prayer times
            </p>
          </div>

          {/* Fiqh School */}
          <div className={`p-4 rounded-xl ${themeClasses.card}`}>
            <h3 className={`font-medium ${themeClasses.text} mb-3`}>
              Fiqh School (Asr Calculation)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateLocalSetting('school', 0)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  localSettings.school === 0 ? themeClasses.primaryButton : themeClasses.button
                }`}
              >
                Shafi/Maliki/Hanbali
              </button>
              <button
                onClick={() => updateLocalSetting('school', 1)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  localSettings.school === 1 ? themeClasses.primaryButton : themeClasses.button
                }`}
              >
                Hanafi
              </button>
            </div>
            <p className={`text-xs ${themeClasses.subtitle} mt-2`}>
              Affects the calculation of Asr prayer time
            </p>
          </div>

          {/* Time Format */}
          <div className={`p-4 rounded-xl ${themeClasses.card}`}>
            <h3 className={`font-medium ${themeClasses.text} mb-3 flex items-center space-x-2`}>
              <Clock className="w-4 h-4" />
              <span>Time Format</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateLocalSetting('timeFormat', '12h')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  localSettings.timeFormat === '12h' ? themeClasses.primaryButton : themeClasses.button
                }`}
              >
                12 Hour (AM/PM)
              </button>
              <button
                onClick={() => updateLocalSetting('timeFormat', '24h')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  localSettings.timeFormat === '24h' ? themeClasses.primaryButton : themeClasses.button
                }`}
              >
                24 Hour
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className={`p-4 rounded-xl ${themeClasses.card}`}>
            <h3 className={`font-medium ${themeClasses.text} mb-3 flex items-center space-x-2`}>
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className={`${themeClasses.text}`}>Browser Notifications</span>
                <input
                  type="checkbox"
                  checked={localSettings.notifications}
                  onChange={(e) => updateLocalSetting('notifications', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className={`${themeClasses.text} flex items-center space-x-2`}>
                  {localSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound Alerts</span>
                </span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => updateLocalSetting('soundEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Time Adjustments */}
          <div className={`p-4 rounded-xl ${themeClasses.card}`}>
            <h3 className={`font-medium ${themeClasses.text} mb-3`}>
              Time Adjustments (minutes)
            </h3>
            <p className={`text-xs ${themeClasses.subtitle} mb-4`}>
              Fine-tune prayer times according to your local conditions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(localSettings.adjustments).map(([prayer, value]) => (
                <div key={prayer}>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2 capitalize`}>
                    {prayer}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={value}
                      onChange={(e) => updateAdjustment(prayer as keyof PrayerSettings['adjustments'], parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`text-sm ${themeClasses.subtitle} min-w-[3rem] text-right`}>
                      {value > 0 ? '+' : ''}{value}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200/20 dark:border-gray-700/20">
          <button
            onClick={handleReset}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
          >
            Reset
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
