'use client';

import React from 'react';
import DateCell from './DateCell';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface DualCalendarProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function DualCalendar({
  currentDate,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: DualCalendarProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    headerCell: isDark ? "text-gray-400" : "text-gray-500",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the week for the first day of the month
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  // Generate 42 days (6 weeks) for the calendar grid
  const calendarDays = [];
  const currentDateForLoop = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentDateForLoop));
    currentDateForLoop.setDate(currentDateForLoop.getDate() + 1);
  }

  const dayNames = [
    { en: 'Sun', ar: 'الأحد' },
    { en: 'Mon', ar: 'الإثنين' },
    { en: 'Tue', ar: 'الثلاثاء' },
    { en: 'Wed', ar: 'الأربعاء' },
    { en: 'Thu', ar: 'الخميس' },
    { en: 'Fri', ar: 'الجمعة' },
    { en: 'Sat', ar: 'السبت' }
  ];

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateString);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return islamicEvents.filter(event => event.date === dateString);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isJummah = (date: Date) => {
    return date.getDay() === 5; // Friday
  };

  // Calculate Hijri date
  const getHijriDate = (date: Date) => {
    const HIJRI_EPOCH = new Date('622-07-16');
    const daysDiff = Math.floor((date.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
    const hijriDay = Math.floor((daysDiff % 354.367) % 29.5) + 1;
    return Math.min(hijriDay, 30);
  };

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="mb-6 text-center">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Dual Calendar View
        </h3>
        <div className="flex items-center justify-center space-x-6">
          <div className={`flex items-center space-x-2 ${themeClasses.accent}`}>
            <span>🗓️</span>
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className={`flex items-center space-x-2 ${themeClasses.gold}`}>
            <span>🌙</span>
            <span className="text-sm font-medium">
              Islamic Calendar
            </span>
          </div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className={`p-3 text-center text-sm font-medium ${
              index === 5 ? themeClasses.accent : themeClasses.headerCell
            }`}
          >
            <div className="text-xs opacity-75">{day.ar}</div>
            <div>{day.en}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          const isWeekendDay = isWeekend(date);
          const isJummahDay = isJummah(date);
          const hijriDate = getHijriDate(date);

          return (
            <DateCell
              key={index}
              date={date}
              gregorianDate={date.getDate()}
              hijriDate={hijriDate}
              tasks={dayTasks}
              islamicEvents={dayEvents}
              isCurrentMonth={isCurrentMonthDay}
              isToday={isTodayDate}
              isWeekend={isWeekendDay}
              isJummah={isJummahDay}
              onClick={() => onDateClick(date)}
              calendarType="dual"
              isDark={isDark}
            />
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
            <span className={themeClasses.subtitle}>Today</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}></div>
            <span className={themeClasses.subtitle}>Islamic Events</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
            <span className={themeClasses.subtitle}>Tasks</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg">🕌</span>
            <span className={themeClasses.subtitle}>Jummah</span>
          </div>
        </div>
      </div>

      {/* Month Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between text-sm">
          <div className={`${themeClasses.subtitle}`}>
            <strong>This Month:</strong> {tasks.filter(task => {
              const taskDate = new Date(task.date);
              return taskDate.getMonth() === currentDate.getMonth() && 
                     taskDate.getFullYear() === currentDate.getFullYear();
            }).length} tasks, {islamicEvents.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getMonth() === currentDate.getMonth() && 
                     eventDate.getFullYear() === currentDate.getFullYear();
            }).length} Islamic events
          </div>
          
          <div className={`${themeClasses.accent}`}>
            Click any date to view details
          </div>
        </div>
      </div>
    </div>
  );
}
