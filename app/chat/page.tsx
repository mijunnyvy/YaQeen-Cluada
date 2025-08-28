'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Menu,
  Sparkles,
  BookOpen,
  Compass,
  Target,
  Clock,
  Heart,
  Star,
  Mic,
  MicOff,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import ChatWindow from '../../components/ChatWindow';
import ChatSidebar from '../../components/ChatSidebar';
import ModeSelector from '../../components/ModeSelector';
import { useChatStore } from '../../hooks/useChatStore';

export default function ChatPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    currentConversation,
    currentMode,
    chatModes,
    preferences,
    dailyTip,
    createConversation,
    setChatMode,
    updatePreferences,
  } = useChatStore();

  // Handle new chat creation
  const handleNewChat = () => {
    createConversation(currentMode);
    setShowSidebar(false); // Close sidebar on mobile after creating new chat
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('chat-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('chat-theme', newTheme ? 'dark' : 'light');
  };

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    sidebar: isDark ? "bg-gray-900/95 border-gray-700/50" : "bg-white/98 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    overlay: "bg-black/50",
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
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500/10 rounded-full blur-lg"></div>
        
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-2xl ${isDark ? 'text-emerald-400/20' : 'text-emerald-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['🕌', '🌙', '⭐', '🤲', '📿', '🌟', '✨', '💫'][i]}
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${themeClasses.overlay}`}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar - Now toggleable on desktop too */}
      <div className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-all duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } ${themeClasses.sidebar} backdrop-blur-xl border-r shadow-xl`}>
        <ChatSidebar
          isDark={isDark}
          onClose={() => setShowSidebar(false)}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Content - Dynamic margin based on sidebar state */}
      <div className={`flex flex-col h-screen transition-all duration-300 ease-in-out ${
        showSidebar ? 'ml-80' : 'ml-0'
      }`}>
        {/* Compact Header - Only show when there's a conversation */}
        {currentConversation ? (
          <header className="relative z-10 p-3 border-b backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
                  title={showSidebar ? 'Close Sidebar' : 'Open Sidebar'}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className={`p-2 rounded-xl ${themeClasses.card} backdrop-blur-xl border`}>
                  <div className="text-lg">✨</div>
                </div>

                <div className="flex-1">
                  <h1 className={`text-lg font-bold ${themeClasses.text}`}>
                    Islamic AI Assistant
                  </h1>

                  {/* Quick Mode Switcher */}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg">{chatModes[currentMode].icon}</span>
                    <select
                      value={currentMode}
                      onChange={(e) => setChatMode(e.target.value as any)}
                      className={`text-xs bg-transparent border-none outline-none cursor-pointer ${themeClasses.subtitle}`}
                    >
                      {Object.entries(chatModes).map(([key, mode]) => (
                        <option key={key} value={key} className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                          {mode.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updatePreferences({ enableVoice: !preferences.enableVoice })}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    preferences.enableVoice ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  {preferences.enableVoice ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    showSettings ? themeClasses.activeButton : themeClasses.button
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </header>
        ) : (
          /* Hero Header - Only show when no conversation */
          <header className="relative z-10 overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>

            {/* Floating Islamic Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-white/10 animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    fontSize: `${1.5 + Math.random()}rem`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  {['🕌', '🌙', '⭐', '🤲', '📿', '✨'][i]}
                </div>
              ))}
            </div>

            <div className="relative p-4 md:p-6">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {/* Sidebar Toggle */}
                  <button
                    onClick={toggleSidebar}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:scale-105"
                    title={showSidebar ? 'Close Sidebar' : 'Open Sidebar'}
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  {/* Quick Navigation - Desktop Only */}
                  <div className="hidden lg:flex items-center space-x-2">
                    <Link href="/quran" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300">
                      <BookOpen className="w-4 h-4" />
                    </Link>
                    <Link href="/qibla" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300">
                      <Compass className="w-4 h-4" />
                    </Link>
                    <Link href="/prayer-times" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300">
                      <Clock className="w-4 h-4" />
                    </Link>
                    <Link href="/names" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300">
                      <Star className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updatePreferences({ enableVoice: !preferences.enableVoice })}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      preferences.enableVoice
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                    }`}
                  >
                    {preferences.enableVoice ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      showSettings
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Hero Content */}
              <div className="text-center mb-6">
                {/* Main Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                  <div className="text-3xl md:text-4xl">✨</div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  Islamic AI Assistant
                </h1>

                {/* Subtitle */}
                <p className="text-white/90 text-sm md:text-lg font-medium mb-1">
                  Powered by Advanced AI • Authentic Islamic Knowledge
                </p>

                {/* Current Mode */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-lg">{chatModes[currentMode].icon}</span>
                  <span className="text-white font-medium text-sm">
                    {chatModes[currentMode].name}
                  </span>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="max-w-4xl mx-auto">
                <ModeSelector
                  currentMode={currentMode}
                  onModeChange={setChatMode}
                  isDark={true} // Always use dark theme for hero header
                />
              </div>
            </div>
          </header>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className={`p-4 md:p-6 border-b backdrop-blur-xl ${themeClasses.card.split(' ')[0]}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${themeClasses.activeButton}`}>
                <Settings className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold ${themeClasses.text}`}>Chat Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value as any })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? "bg-gray-700/80 border-gray-600/50 text-white" : "bg-white/90 border-gray-300/50 text-gray-900"
                  }`}
                >
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Font Size</label>
                <select
                  value={preferences.fontSize}
                  onChange={(e) => updatePreferences({ fontSize: e.target.value as any })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? "bg-gray-700/80 border-gray-600/50 text-white" : "bg-white/90 border-gray-300/50 text-gray-900"
                  }`}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Madhhab</label>
                <select
                  value={preferences.madhhab}
                  onChange={(e) => updatePreferences({ madhhab: e.target.value as any })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? "bg-gray-700/80 border-gray-600/50 text-white" : "bg-white/90 border-gray-300/50 text-gray-900"
                  }`}
                >
                  <option value="general">General</option>
                  <option value="hanafi">Hanafi</option>
                  <option value="maliki">Maliki</option>
                  <option value="shafii">Shafi'i</option>
                  <option value="hanbali">Hanbali</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.showSources}
                  onChange={(e) => updatePreferences({ showSources: e.target.checked })}
                  className="rounded"
                />
                <span className={`text-sm ${themeClasses.text}`}>Show Sources</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.autoScroll}
                  onChange={(e) => updatePreferences({ autoScroll: e.target.checked })}
                  className="rounded"
                />
                <span className={`text-sm ${themeClasses.text}`}>Auto Scroll</span>
              </label>
            </div>
          </div>
        )}

        {/* Daily Tip */}
        {dailyTip && !currentConversation && (
          <div className={`p-4 md:p-6 border-b backdrop-blur-xl ${themeClasses.card.split(' ')[0]}`}>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50/80 border border-emerald-200/50'}`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${themeClasses.activeButton}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Daily Islamic Wisdom</h4>
                  <p className={`text-sm ${themeClasses.subtitle} leading-relaxed`}>{dailyTip}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow isDark={isDark} preferences={preferences} />
        </div>

        {/* Floating New Chat Button - Only show when sidebar is closed and there's a conversation */}
        {!showSidebar && currentConversation && (
          <button
            onClick={handleNewChat}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-30 group"
            title="New Chat"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>
    </div>
  );
}
