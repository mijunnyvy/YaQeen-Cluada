'use client';

import React from 'react';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface WeekViewProps {
  currentDate: Date;
  calendarMode: 'dual' | 'gregorian' | 'hijri';
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function WeekView({
  currentDate,
  calendarMode,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: WeekViewProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  // Get the start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  // Generate 7 days for the week
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateString);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return islamicEvents.filter(event => event.date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isJummah = (date: Date) => {
    return date.getDay() === 5;
  };

  // Calculate Hijri date
  const getHijriDate = (date: Date) => {
    const HIJRI_EPOCH = new Date('622-07-16');
    const daysDiff = Math.floor((date.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.367) + 1;
    const dayOfYear = daysDiff % 354.367;
    const hijriMonth = Math.floor(dayOfYear / 29.5) + 1;
    const hijriDay = Math.floor(dayOfYear % 29.5) + 1;
    
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    return {
      day: Math.min(hijriDay, 30),
      month: hijriMonths[Math.min(hijriMonth - 1, 11)],
      year: hijriYear
    };
  };

  return (
    <div className="p-6">
      {/* Week Header */}
      <div className="mb-6 text-center">
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
          Week View
        </h3>
        <p className={`${themeClasses.subtitle}`}>
          {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
          {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isJummahDay = isJummah(date);
          const hijriDate = getHijriDate(date);
          const completedTasks = dayTasks.filter(task => task.completed);

          return (
            <div
              key={index}
              onClick={() => onDateClick(date)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isTodayDate 
                  ? isDark ? 'bg-emerald-900/30 border-emerald-600/50' : 'bg-emerald-50/80 border-emerald-300/50'
                  : isJummahDay
                  ? isDark ? 'bg-emerald-800/20 border-emerald-600/30' : 'bg-emerald-50/60 border-emerald-300/30'
                  : themeClasses.card
              }`}
            >
              {/* Day Header */}
              <div className="text-center mb-4">
                <div className={`text-sm font-medium ${themeClasses.subtitle} mb-1`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  {isJummahDay && ' 🕌'}
                </div>
                
                {calendarMode === 'dual' ? (
                  <div>
                    <div className={`text-2xl font-bold ${isTodayDate ? themeClasses.accent : themeClasses.text}`}>
                      {date.getDate()}
                    </div>
                    <div className={`text-sm ${themeClasses.gold}`}>
                      {hijriDate.day}
                    </div>
                  </div>
                ) : calendarMode === 'hijri' ? (
                  <div className={`text-2xl font-bold ${isJummahDay ? themeClasses.accent : themeClasses.gold}`}>
                    {hijriDate.day}
                  </div>
                ) : (
                  <div className={`text-2xl font-bold ${isTodayDate ? themeClasses.accent : themeClasses.text}`}>
                    {date.getDate()}
                  </div>
                )}

                {isTodayDate && (
                  <div className={`text-xs font-medium ${themeClasses.accent} mt-1`}>
                    Today
                  </div>
                )}
              </div>

              {/* Islamic Events */}
              {dayEvents.length > 0 && (
                <div className="mb-3 space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs px-2 py-1 rounded truncate ${
                        event.type === 'holiday' 
                          ? isDark ? 'bg-amber-800/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                          : isDark ? 'bg-emerald-800/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      }`}
                      title={event.description}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className={`text-xs ${themeClasses.subtitle}`}>
                      +{dayEvents.length - 2} more events
                    </div>
                  )}
                </div>
              )}

              {/* Tasks */}
              {dayTasks.length > 0 && (
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`text-xs px-2 py-1 rounded truncate flex items-center space-x-1 ${
                        task.completed
                          ? isDark ? 'bg-green-800/40 text-green-300' : 'bg-green-100 text-green-700'
                          : task.priority === 'high'
                          ? isDark ? 'bg-red-800/40 text-red-300' : 'bg-red-100 text-red-700'
                          : isDark ? 'bg-gray-700/40 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                      title={task.description || task.title}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <span className={`truncate ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className={`text-xs ${themeClasses.subtitle}`}>
                      +{dayTasks.length - 3} more tasks
                    </div>
                  )}
                </div>
              )}

              {/* Task Summary */}
              {dayTasks.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200/20 dark:border-gray-700/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className={themeClasses.subtitle}>
                      {completedTasks.length}/{dayTasks.length} done
                    </span>
                    <div className="flex space-x-1">
                      {dayTasks.map((task, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            task.completed 
                              ? isDark ? 'bg-green-400' : 'bg-green-500'
                              : isDark ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {dayTasks.length === 0 && dayEvents.length === 0 && (
                <div className={`text-center py-4 ${themeClasses.subtitle}`}>
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-xs">No events</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Week Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.accent}`}>
              {tasks.filter(task => {
                const taskDate = new Date(task.date);
                return weekDays.some(day => day.toDateString() === taskDate.toDateString());
              }).length}
            </div>
            <div className={themeClasses.subtitle}>Total Tasks</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.gold}`}>
              {tasks.filter(task => {
                const taskDate = new Date(task.date);
                return task.completed && weekDays.some(day => day.toDateString() === taskDate.toDateString());
              }).length}
            </div>
            <div className={themeClasses.subtitle}>Completed</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {islamicEvents.filter(event => {
                const eventDate = new Date(event.date);
                return weekDays.some(day => day.toDateString() === eventDate.toDateString());
              }).length}
            </div>
            <div className={themeClasses.subtitle}>Islamic Events</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${themeClasses.accent}`}>
              {weekDays.filter(day => day.getDay() === 5).length}
            </div>
            <div className={themeClasses.subtitle}>Jummah Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
