'use client';

import React, { useState } from 'react';
import { X, Plus, Star, Target } from 'lucide-react';
import { ZikrTask } from '@/hooks/useTasbihStore';

interface CustomZikrModalProps {
  onClose: () => void;
  onAdd: (task: Omit<ZikrTask, 'id' | 'createdAt' | 'currentCount' | 'isCompleted' | 'completedDates'>) => void;
  isDark?: boolean;
}

export default function CustomZikrModal({ onClose, onAdd, isDark = false }: CustomZikrModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    arabicText: '',
    transliteration: '',
    meaning: '',
    targetCount: 33,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    label: isDark ? "text-gray-300" : "text-gray-700",
  };

  const predefinedZikr = [
    {
      title: 'Seeking Forgiveness',
      arabicText: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
      transliteration: 'Astaghfirullah al-azeem',
      meaning: 'I seek forgiveness from Allah, the Magnificent',
      targetCount: 100,
    },
    {
      title: 'Sending Blessings',
      arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      transliteration: 'Allahumma salli ala Muhammad',
      meaning: 'O Allah, send blessings upon Muhammad',
      targetCount: 100,
    },
    {
      title: 'Remembering Allah',
      arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'La ilaha illa Allah wahdahu la sharika lah',
      meaning: 'There is no god but Allah alone, with no partner',
      targetCount: 100,
    },
    {
      title: 'Praising Allah',
      arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: 'Subhan Allah wa bihamdihi',
      meaning: 'Glory be to Allah and praise be to Him',
      targetCount: 100,
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.arabicText.trim()) {
      newErrors.arabicText = 'Arabic text is required';
    }

    if (!formData.transliteration.trim()) {
      newErrors.transliteration = 'Transliteration is required';
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = 'Meaning is required';
    }

    if (formData.targetCount < 1 || formData.targetCount > 10000) {
      newErrors.targetCount = 'Target count must be between 1 and 10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        ...formData,
        isCustom: true,
      });
      onClose();
    }
  };

  const handlePredefinedSelect = (zikr: typeof predefinedZikr[0]) => {
    setFormData(zikr);
    setErrors({});
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
              Add Custom Zikr
            </h2>
            <p className={`${themeClasses.subtitle}`}>
              Create a personalized Zikr task
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Predefined Options */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <h3 className={`font-semibold ${themeClasses.text} mb-4`}>
            Quick Select (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predefinedZikr.map((zikr, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedSelect(zikr)}
                className={`p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${themeClasses.button}`}
              >
                <div className={`font-medium ${themeClasses.text} mb-1`}>
                  {zikr.title}
                </div>
                <div className={`text-sm ${themeClasses.subtitle} mb-1`} dir="rtl">
                  {zikr.arabicText}
                </div>
                <div className={`text-xs ${themeClasses.subtitle}`}>
                  Target: {zikr.targetCount}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Morning Dhikr, Evening Tasbih"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Arabic Text */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Arabic Text *
            </label>
            <textarea
              value={formData.arabicText}
              onChange={(e) => setFormData({ ...formData, arabicText: e.target.value })}
              placeholder="Enter the Arabic Zikr text"
              dir="rtl"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                errors.arabicText ? 'border-red-500' : ''
              }`}
            />
            {errors.arabicText && (
              <p className="text-red-500 text-sm mt-1">{errors.arabicText}</p>
            )}
          </div>

          {/* Transliteration */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Transliteration *
            </label>
            <input
              type="text"
              value={formData.transliteration}
              onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
              placeholder="e.g., SubhanAllah, Alhamdulillah"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                errors.transliteration ? 'border-red-500' : ''
              }`}
            />
            {errors.transliteration && (
              <p className="text-red-500 text-sm mt-1">{errors.transliteration}</p>
            )}
          </div>

          {/* Meaning */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              English Meaning *
            </label>
            <input
              type="text"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="e.g., Glory be to Allah, Praise be to Allah"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                errors.meaning ? 'border-red-500' : ''
              }`}
            />
            {errors.meaning && (
              <p className="text-red-500 text-sm mt-1">{errors.meaning}</p>
            )}
          </div>

          {/* Target Count */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Target Count *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                max="10000"
                value={formData.targetCount}
                onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 1 })}
                className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                  errors.targetCount ? 'border-red-500' : ''
                }`}
              />
              
              {/* Quick Target Buttons */}
              <div className="flex space-x-2">
                {[33, 99, 100].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetCount: count })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      formData.targetCount === count ? themeClasses.primaryButton : themeClasses.button
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            {errors.targetCount && (
              <p className="text-red-500 text-sm mt-1">{errors.targetCount}</p>
            )}
          </div>

          {/* Preview */}
          {formData.arabicText && formData.transliteration && formData.meaning && (
            <div className={`p-4 rounded-xl border ${themeClasses.input} bg-opacity-50`}>
              <h4 className={`font-medium ${themeClasses.text} mb-2`}>Preview:</h4>
              <div className="text-center">
                <div className={`text-xl font-bold ${themeClasses.text} mb-1`} dir="rtl">
                  {formData.arabicText}
                </div>
                <div className={`text-sm ${themeClasses.subtitle} mb-1`}>
                  {formData.transliteration}
                </div>
                <div className={`text-xs ${themeClasses.subtitle}`}>
                  {formData.meaning}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Zikr Task</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
