'use client';

import React from 'react';
import IslamicCalendar from './IslamicCalendar';
import GregorianCalendar from './GregorianCalendar';
import DualCalendar from './DualCalendar';
import WeekView from './WeekView';
import DayView from './DayView';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface CalendarContainerProps {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day';
  calendarMode: 'dual' | 'gregorian' | 'hijri';
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function CalendarContainer({
  currentDate,
  viewMode,
  calendarMode,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: CalendarContainerProps) {
  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
  };

  // Render different views based on viewMode
  if (viewMode === 'day') {
    return (
      <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <DayView
          currentDate={currentDate}
          calendarMode={calendarMode}
          onDateClick={onDateClick}
          tasks={tasks}
          islamicEvents={islamicEvents}
          isDark={isDark}
        />
      </div>
    );
  }

  if (viewMode === 'week') {
    return (
      <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <WeekView
          currentDate={currentDate}
          calendarMode={calendarMode}
          onDateClick={onDateClick}
          tasks={tasks}
          islamicEvents={islamicEvents}
          isDark={isDark}
        />
      </div>
    );
  }

  // Month view
  if (calendarMode === 'dual') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
          <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
            <h3 className={`text-lg font-bold ${themeClasses.text} flex items-center space-x-2`}>
              <span>🗓️</span>
              <span>Gregorian Calendar</span>
            </h3>
          </div>
          <GregorianCalendar
            currentDate={currentDate}
            onDateClick={onDateClick}
            tasks={tasks}
            islamicEvents={islamicEvents}
            isDark={isDark}
          />
        </div>

        <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
          <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
            <h3 className={`text-lg font-bold ${themeClasses.text} flex items-center space-x-2`}>
              <span>🌙</span>
              <span>Islamic Calendar</span>
            </h3>
          </div>
          <IslamicCalendar
            currentDate={currentDate}
            onDateClick={onDateClick}
            tasks={tasks}
            islamicEvents={islamicEvents}
            isDark={isDark}
          />
        </div>
      </div>
    );
  }

  if (calendarMode === 'gregorian') {
    return (
      <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
          <h3 className={`text-lg font-bold ${themeClasses.text} flex items-center space-x-2`}>
            <span>🗓️</span>
            <span>Gregorian Calendar</span>
          </h3>
        </div>
        <GregorianCalendar
          currentDate={currentDate}
          onDateClick={onDateClick}
          tasks={tasks}
          islamicEvents={islamicEvents}
          isDark={isDark}
        />
      </div>
    );
  }

  if (calendarMode === 'hijri') {
    return (
      <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
          <h3 className={`text-lg font-bold ${themeClasses.text} flex items-center space-x-2`}>
            <span>🌙</span>
            <span>Islamic Calendar</span>
          </h3>
        </div>
        <IslamicCalendar
          currentDate={currentDate}
          onDateClick={onDateClick}
          tasks={tasks}
          islamicEvents={islamicEvents}
          isDark={isDark}
        />
      </div>
    );
  }

  // Fallback to dual view
  return (
    <div className={`rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
      <DualCalendar
        currentDate={currentDate}
        onDateClick={onDateClick}
        tasks={tasks}
        islamicEvents={islamicEvents}
        isDark={isDark}
      />
    </div>
  );
}
