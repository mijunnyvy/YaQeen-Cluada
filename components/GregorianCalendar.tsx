'use client';

import React from 'react';
import DateCell from './DateCell';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface GregorianCalendarProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function GregorianCalendar({
  currentDate,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: GregorianCalendarProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    headerCell: isDark ? "text-gray-400" : "text-gray-500",
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  return (
    <div className="p-4">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className={`p-3 text-center text-sm font-medium ${themeClasses.headerCell}`}
          >
            {day}
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

          return (
            <DateCell
              key={index}
              date={date}
              gregorianDate={date.getDate()}
              hijriDate={null} // Will be calculated in DateCell
              tasks={dayTasks}
              islamicEvents={dayEvents}
              isCurrentMonth={isCurrentMonthDay}
              isToday={isTodayDate}
              isWeekend={isWeekendDay}
              onClick={() => onDateClick(date)}
              calendarType="gregorian"
              isDark={isDark}
            />
          );
        })}
      </div>

      {/* Month Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between text-sm">
          <div className={`${themeClasses.subtitle}`}>
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`${themeClasses.subtitle}`}>
              {tasks.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              }).length} tasks this month
            </div>
            
            <div className={`${themeClasses.subtitle}`}>
              {islamicEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear();
              }).length} Islamic events
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
