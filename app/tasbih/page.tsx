'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Sun, 
  Moon, 
  BookOpen, 
  Target, 
  Infinity, 
  RotateCcw,
  Zap,
  Calendar,
  Award,
  TrendingUp,
  Volume2,
  VolumeX,
  Vibrate,
  MapPin,
  Calendar,
  Clock,
  Book,
  Heart,
  Star
} from 'lucide-react';
import Link from 'next/link';
import TasbihCounter from '@/components/TasbihCounter';
import TaskList from '@/components/TaskList';
import CustomZikrModal from '@/components/CustomZikrModal';
import StreakTracker from '@/components/StreakTracker';
import StatsModal from '@/components/StatsModal';
import { useTasbihStore } from '@/hooks/useTasbihStore';

export default function TasbihPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'counter' | 'tasks'>('counter');
  
  const {
    currentCount,
    targetCount,
    mode,
    currentZikr,
    tasks,
    settings,
    incrementCount,
    resetCount,
    setTargetCount,
    setMode,
    setCurrentZikr,
    updateSettings,
    addTask,
    completeTask,
    getStreak
  } = useTasbihStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('tasbih-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('tasbih-theme', newTheme ? 'dark' : 'light');
  };

  const handleIncrement = () => {
    incrementCount();
    
    // Haptic feedback
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Audio feedback
    if (settings.soundFeedback) {
      // Play a subtle click sound
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors
    }
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-amber-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-amber-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeTab: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-amber-500/5 rounded-full blur-xl"></div>
        
        {/* Floating Prayer Beads */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${isDark ? 'bg-emerald-400/20' : 'bg-emerald-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <div className={`w-8 h-8 rounded-full ${themeClasses.accent} bg-current flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">📿</span>
              </div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Digital Tasbih
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Count your Zikr and track your progress
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/quran"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Holy Quran"
            >
              <BookOpen className="w-5 h-5" />
            </Link>

            <Link
              href="/mosque-finder"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Mosque Finder"
            >
              <MapPin className="w-5 h-5" />
            </Link>

            <Link
              href="/calendar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Calendar"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <Link
              href="/prayer-times"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Prayer Times"
            >
              <Clock className="w-5 h-5" />
            </Link>

            <Link
              href="/stories"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Islamic Stories"
            >
              <Book className="w-5 h-5" />
            </Link>

            <Link
              href="/adkar"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Daily Adkar"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/names"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="99 Beautiful Names"
            >
              <Star className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setShowStatsModal(true)}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Statistics"
            >
              <TrendingUp className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2 p-2 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('counter')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'counter' ? themeClasses.activeTab : themeClasses.button
              }`}
            >
              <Target className="w-5 h-5" />
              <span className="font-medium">Counter</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'tasks' ? themeClasses.activeTab : themeClasses.button
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Daily Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'counter' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Counter */}
              <div className="lg:col-span-2">
                <TasbihCounter
                  count={currentCount}
                  target={targetCount}
                  mode={mode}
                  zikr={currentZikr}
                  onIncrement={handleIncrement}
                  onReset={resetCount}
                  onModeChange={setMode}
                  onTargetChange={setTargetCount}
                  onZikrChange={setCurrentZikr}
                  isDark={isDark}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                <StreakTracker
                  streak={getStreak()}
                  isDark={isDark}
                />
                
                {/* Quick Settings */}
                <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
                  <h3 className={`font-bold ${themeClasses.text} mb-4`}>Quick Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${themeClasses.text}`}>Sound Feedback</span>
                      <button
                        onClick={() => updateSettings({ soundFeedback: !settings.soundFeedback })}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          settings.soundFeedback ? themeClasses.activeTab : themeClasses.button
                        }`}
                      >
                        {settings.soundFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${themeClasses.text}`}>Haptic Feedback</span>
                      <button
                        onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          settings.hapticFeedback ? themeClasses.activeTab : themeClasses.button
                        }`}
                      >
                        <Vibrate className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Task List */}
              <div className="lg:col-span-3">
                <TaskList
                  tasks={tasks}
                  onCompleteTask={completeTask}
                  onAddTask={() => setShowCustomModal(true)}
                  isDark={isDark}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                <StreakTracker
                  streak={getStreak()}
                  isDark={isDark}
                />
                
                <button
                  onClick={() => setShowCustomModal(true)}
                  className={`w-full p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeClasses.card} ${themeClasses.button}`}
                >
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Add Custom Zikr</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showCustomModal && (
        <CustomZikrModal
          onClose={() => setShowCustomModal(false)}
          onAdd={addTask}
          isDark={isDark}
        />
      )}

      {showStatsModal && (
        <StatsModal
          onClose={() => setShowStatsModal(false)}
          tasks={tasks}
          streak={getStreak()}
          isDark={isDark}
        />
      )}
    </div>
  );
}
