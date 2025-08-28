'use client';

import React from 'react';
import DateCell from './DateCell';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface IslamicCalendarProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function IslamicCalendar({
  currentDate,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: IslamicCalendarProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    headerCell: isDark ? "text-gray-400" : "text-gray-500",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  // Simple Hijri date conversion
  const gregorianToHijri = (gregorianDate: Date) => {
    const HIJRI_EPOCH = new Date('622-07-16');
    const HIJRI_YEAR_LENGTH = 354.367;
    
    const daysDiff = Math.floor((gregorianDate.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / HIJRI_YEAR_LENGTH) + 1;
    const dayOfYear = daysDiff % HIJRI_YEAR_LENGTH;
    const hijriMonth = Math.floor(dayOfYear / 29.5) + 1;
    const hijriDay = Math.floor(dayOfYear % 29.5) + 1;
    
    return {
      year: hijriYear,
      month: Math.min(hijriMonth, 12),
      day: Math.min(hijriDay, 30)
    };
  };

  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
    'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  // Get current Hijri month info
  const currentHijriDate = gregorianToHijri(currentDate);
  const currentHijriMonth = hijriMonths[currentHijriDate.month - 1] || hijriMonths[0];

  // Generate calendar days based on Hijri month
  const generateHijriCalendarDays = () => {
    const days = [];
    const hijriDate = gregorianToHijri(currentDate);
    
    // Start from the first day of the current Hijri month
    // This is an approximation - in a real app you'd use a proper Hijri calendar library
    const startOfMonth = new Date(currentDate);
    startOfMonth.setDate(1);
    
    // Adjust to approximate Hijri month start
    const daysToAdjust = hijriDate.day - currentDate.getDate();
    startOfMonth.setDate(startOfMonth.getDate() - daysToAdjust);
    
    // Generate 30 days (typical Hijri month length)
    for (let i = 0; i < 30; i++) {
      const day = new Date(startOfMonth);
      day.setDate(startOfMonth.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateHijriCalendarDays();

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
    return date.getDay() === 5; // Friday
  };

  const isSpecialIslamicDay = (date: Date) => {
    const events = getEventsForDate(date);
    return events.some(event => event.type === 'holiday' || event.type === 'special');
  };

  return (
    <div className="p-4">
      {/* Hijri Month Header */}
      <div className="mb-4 text-center">
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-1`}>
          {currentHijriMonth} {currentHijriDate.year} AH
        </h3>
        <p className={`text-sm ${themeClasses.gold}`}>
          Islamic Calendar
        </p>
      </div>

      {/* Day Headers (Arabic/English) */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[
          { ar: 'الأحد', en: 'Sun' },
          { ar: 'الإثنين', en: 'Mon' },
          { ar: 'الثلاثاء', en: 'Tue' },
          { ar: 'الأربعاء', en: 'Wed' },
          { ar: 'الخميس', en: 'Thu' },
          { ar: 'الجمعة', en: 'Fri' },
          { ar: 'السبت', en: 'Sat' }
        ].map((day, index) => (
          <div
            key={index}
            className={`p-2 text-center text-sm font-medium ${themeClasses.headerCell} ${
              index === 5 ? themeClasses.accent : '' // Highlight Friday
            }`}
          >
            <div className="text-xs">{day.ar}</div>
            <div>{day.en}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isJummahDay = isJummah(date);
          const isSpecialDay = isSpecialIslamicDay(date);
          const hijriDayNumber = gregorianToHijri(date).day;

          return (
            <DateCell
              key={index}
              date={date}
              gregorianDate={date.getDate()}
              hijriDate={hijriDayNumber}
              tasks={dayTasks}
              islamicEvents={dayEvents}
              isCurrentMonth={true}
              isToday={isTodayDate}
              isWeekend={isJummahDay}
              isJummah={isJummahDay}
              isSpecialDay={isSpecialDay}
              onClick={() => onDateClick(date)}
              calendarType="hijri"
              isDark={isDark}
            />
          );
        })}
      </div>

      {/* Islamic Month Info */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="space-y-2">
          {/* Month Significance */}
          <div className={`text-sm ${themeClasses.text}`}>
            <strong>About {currentHijriMonth}:</strong>
          </div>
          
          <div className={`text-xs ${themeClasses.subtitle}`}>
            {getMonthSignificance(currentHijriMonth)}
          </div>

          {/* Month Statistics */}
          <div className="flex items-center justify-between text-sm">
            <div className={`${themeClasses.subtitle}`}>
              {tasks.filter(task => {
                const taskDate = new Date(task.date);
                const taskHijri = gregorianToHijri(taskDate);
                return taskHijri.month === currentHijriDate.month && 
                       taskHijri.year === currentHijriDate.year;
              }).length} tasks this month
            </div>
            
            <div className={`${themeClasses.accent}`}>
              {islamicEvents.filter(event => {
                const eventDate = new Date(event.date);
                const eventHijri = gregorianToHijri(eventDate);
                return eventHijri.month === currentHijriDate.month && 
                       eventHijri.year === currentHijriDate.year;
              }).length} Islamic events
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMonthSignificance(monthName: string): string {
  const significance: Record<string, string> = {
    'Muharram': 'The first month of the Islamic year, one of the four sacred months.',
    'Safar': 'The second month, historically known as the month of departure.',
    'Rabi\' al-awwal': 'The third month, birth month of Prophet Muhammad (PBUH).',
    'Rabi\' al-thani': 'The fourth month, also known as Rabi\' al-akhir.',
    'Jumada al-awwal': 'The fifth month, one of the months of dryness.',
    'Jumada al-thani': 'The sixth month, also known as Jumada al-akhirah.',
    'Rajab': 'The seventh month, one of the four sacred months.',
    'Sha\'ban': 'The eighth month, the month before Ramadan.',
    'Ramadan': 'The ninth month, the holy month of fasting.',
    'Shawwal': 'The tenth month, contains Eid al-Fitr celebration.',
    'Dhu al-Qi\'dah': 'The eleventh month, one of the four sacred months.',
    'Dhu al-Hijjah': 'The twelfth month, the month of Hajj pilgrimage.'
  };
  
  return significance[monthName] || 'A blessed month in the Islamic calendar.';
}
