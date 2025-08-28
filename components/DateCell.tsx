'use client';

import React from 'react';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface DateCellProps {
  date: Date;
  gregorianDate: number;
  hijriDate: number | null;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend?: boolean;
  isJummah?: boolean;
  isSpecialDay?: boolean;
  onClick: () => void;
  calendarType: 'gregorian' | 'hijri' | 'dual';
  isDark?: boolean;
}

export default function DateCell({
  date,
  gregorianDate,
  hijriDate,
  tasks,
  islamicEvents,
  isCurrentMonth,
  isToday,
  isWeekend = false,
  isJummah = false,
  isSpecialDay = false,
  onClick,
  calendarType,
  isDark = false
}: DateCellProps) {
  // Calculate Hijri date if not provided
  const getHijriDate = () => {
    if (hijriDate !== null) return hijriDate;
    
    const HIJRI_EPOCH = new Date('622-07-16');
    const daysDiff = Math.floor((date.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
    const hijriDay = Math.floor((daysDiff % 354.367) % 29.5) + 1;
    return Math.min(hijriDay, 30);
  };

  const calculatedHijriDate = getHijriDate();
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const hasHighPriorityTasks = tasks.some(task => task.priority === 'high' && !task.completed);
  const hasIslamicEvents = islamicEvents.length > 0;
  const hasHolidayEvents = islamicEvents.some(event => event.type === 'holiday');

  const themeClasses = {
    base: isDark ? "text-white" : "text-gray-900",
    muted: isDark ? "text-gray-400" : "text-gray-500",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    success: isDark ? "text-green-400" : "text-green-600",
    warning: isDark ? "text-orange-400" : "text-orange-500",
    error: isDark ? "text-red-400" : "text-red-500",
  };

  const getCellClasses = () => {
    let classes = `
      relative p-2 min-h-[80px] border border-gray-200/30 dark:border-gray-700/30 
      cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
      rounded-lg backdrop-blur-sm
    `;

    // Base background
    if (isDark) {
      classes += ' bg-gray-800/40 hover:bg-gray-700/60';
    } else {
      classes += ' bg-white/60 hover:bg-white/80';
    }

    // Today highlight
    if (isToday) {
      classes += isDark 
        ? ' ring-2 ring-emerald-400 bg-emerald-900/30' 
        : ' ring-2 ring-emerald-500 bg-emerald-50/80';
    }

    // Current month opacity
    if (!isCurrentMonth) {
      classes += ' opacity-40';
    }

    // Weekend/Jummah styling
    if (isJummah) {
      classes += isDark 
        ? ' bg-emerald-800/20 border-emerald-600/30' 
        : ' bg-emerald-50/60 border-emerald-300/30';
    } else if (isWeekend) {
      classes += isDark 
        ? ' bg-gray-700/20' 
        : ' bg-gray-100/40';
    }

    // Special Islamic day
    if (isSpecialDay || hasHolidayEvents) {
      classes += isDark 
        ? ' bg-amber-900/20 border-amber-600/30' 
        : ' bg-amber-50/60 border-amber-300/30';
    }

    // High priority tasks
    if (hasHighPriorityTasks) {
      classes += isDark 
        ? ' border-red-500/50' 
        : ' border-red-400/50';
    }

    return classes;
  };

  const getDateDisplayClasses = (type: 'gregorian' | 'hijri') => {
    let classes = 'font-bold text-lg';
    
    if (type === 'gregorian') {
      classes += isToday ? ` ${themeClasses.accent}` : ` ${themeClasses.base}`;
    } else {
      classes += isJummah ? ` ${themeClasses.accent}` : ` ${themeClasses.gold}`;
    }

    if (!isCurrentMonth) {
      classes += ' opacity-50';
    }

    return classes;
  };

  return (
    <div className={getCellClasses()} onClick={onClick}>
      {/* Date Numbers */}
      <div className="flex items-start justify-between mb-2">
        {calendarType === 'dual' ? (
          <div className="flex flex-col">
            <span className={getDateDisplayClasses('gregorian')}>
              {gregorianDate}
            </span>
            <span className={`text-xs ${themeClasses.gold}`}>
              {calculatedHijriDate}
            </span>
          </div>
        ) : calendarType === 'hijri' ? (
          <span className={getDateDisplayClasses('hijri')}>
            {calculatedHijriDate}
          </span>
        ) : (
          <span className={getDateDisplayClasses('gregorian')}>
            {gregorianDate}
          </span>
        )}

        {/* Special Day Indicators */}
        <div className="flex flex-col items-end space-y-1">
          {isJummah && (
            <div className={`text-xs px-1 rounded ${themeClasses.accent}`}>
              🕌
            </div>
          )}
          {hasHolidayEvents && (
            <div className={`text-xs px-1 rounded ${themeClasses.gold}`}>
              ✨
            </div>
          )}
          {isToday && (
            <div className={`text-xs px-1 rounded ${themeClasses.accent}`}>
              📍
            </div>
          )}
        </div>
      </div>

      {/* Task Indicators */}
      {tasks.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {completedTasks.length > 0 && (
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`} 
                 title={`${completedTasks.length} completed tasks`} />
          )}
          {pendingTasks.length > 0 && (
            <div className={`w-2 h-2 rounded-full ${
              hasHighPriorityTasks 
                ? isDark ? 'bg-red-400' : 'bg-red-500'
                : isDark ? 'bg-blue-400' : 'bg-blue-500'
            }`} title={`${pendingTasks.length} pending tasks`} />
          )}
        </div>
      )}

      {/* Islamic Events */}
      {islamicEvents.length > 0 && (
        <div className="space-y-1">
          {islamicEvents.slice(0, 2).map((event, index) => (
            <div
              key={index}
              className={`text-xs px-1 py-0.5 rounded truncate ${
                event.type === 'holiday' 
                  ? isDark ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                  : event.type === 'month_start'
                  ? isDark ? 'bg-emerald-800/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  : isDark ? 'bg-blue-800/40 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}
              title={event.description}
            >
              {event.title}
            </div>
          ))}
          {islamicEvents.length > 2 && (
            <div className={`text-xs ${themeClasses.muted}`}>
              +{islamicEvents.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* Task Preview */}
      {tasks.length > 0 && islamicEvents.length === 0 && (
        <div className="space-y-1">
          {tasks.slice(0, 2).map((task, index) => (
            <div
              key={index}
              className={`text-xs px-1 py-0.5 rounded truncate ${
                task.completed
                  ? isDark ? 'bg-green-800/40 text-green-300 line-through' : 'bg-green-100 text-green-700 line-through'
                  : task.priority === 'high'
                  ? isDark ? 'bg-red-800/40 text-red-300' : 'bg-red-100 text-red-700'
                  : task.priority === 'medium'
                  ? isDark ? 'bg-orange-800/40 text-orange-300' : 'bg-orange-100 text-orange-700'
                  : isDark ? 'bg-gray-700/40 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
              title={task.description || task.title}
            >
              {task.title}
            </div>
          ))}
          {tasks.length > 2 && (
            <div className={`text-xs ${themeClasses.muted}`}>
              +{tasks.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />

      {/* Active Indicator */}
      {(tasks.length > 0 || islamicEvents.length > 0) && (
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          hasIslamicEvents ? themeClasses.gold : themeClasses.accent
        } bg-current opacity-60`} />
      )}
    </div>
  );
}
