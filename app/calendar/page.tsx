'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  BookOpen, 
  Target, 
  MapPin,
  Clock,
  Plus,
  Filter,
  Grid3X3,
  List,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import CalendarContainer from '../../components/CalendarContainer';
import DateDetailModal from '../../components/DateDetailModal';
import CalendarHeader from '../../components/CalendarHeader';
import { useCalendarStore } from '../../hooks/useCalendarStore';

export default function CalendarPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    currentDate,
    viewMode,
    calendarMode,
    tasks,
    islamicEvents,
    setCurrentDate,
    setViewMode,
    setCalendarMode,
    addTask,
    updateTask,
    deleteTask,
    getTasksForDate,
    getIslamicEventsForDate
  } = useCalendarStore();

  useEffect(() => {
    setMounted(true);
    // Load theme preference
    const savedTheme = localStorage.getItem('calendar-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('calendar-theme', newTheme ? 'dark' : 'light');
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedDate(null);
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
    activeButton: isDark
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
        
        {/* Floating Calendar Icons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-2xl ${isDark ? 'text-emerald-400/20' : 'text-emerald-500/20'} animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            📅
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${themeClasses.card} backdrop-blur-xl border`}>
              <div className="text-2xl">📅</div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Islamic Calendar
              </h1>
              <p className={`${themeClasses.subtitle}`}>
                Hijri & Gregorian dates with Islamic events
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
              href="/qibla"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Qibla Compass"
            >
              <MapPin className="w-5 h-5" />
            </Link>

            <Link
              href="/tasbih"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Digital Tasbih"
            >
              <Target className="w-5 h-5" />
            </Link>

            <Link
              href="/mosque-finder"
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Mosque Finder"
            >
              <MapPin className="w-5 h-5" />
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
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Header Controls */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader
            currentDate={currentDate}
            viewMode={viewMode}
            calendarMode={calendarMode}
            onDateChange={setCurrentDate}
            onViewModeChange={setViewMode}
            onCalendarModeChange={setCalendarMode}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Main Calendar */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <CalendarContainer
            currentDate={currentDate}
            viewMode={viewMode}
            calendarMode={calendarMode}
            onDateClick={handleDateClick}
            tasks={tasks}
            islamicEvents={islamicEvents}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Date Detail Modal */}
      {showDetailModal && selectedDate && (
        <DateDetailModal
          date={selectedDate}
          tasks={getTasksForDate(selectedDate)}
          islamicEvents={getIslamicEventsForDate(selectedDate)}
          onClose={handleCloseModal}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          isDark={isDark}
        />
      )}

      {/* Quick Stats */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`p-4 rounded-2xl border backdrop-blur-xl ${themeClasses.card} shadow-xl`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.accent}`}>
              {tasks.filter(task => !task.completed).length}
            </div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              Pending Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setSelectedDate(new Date());
          setShowDetailModal(true);
        }}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${themeClasses.activeButton}`}
        title="Add Task for Today"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
