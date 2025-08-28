'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD format
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  color: string;
  createdAt: string;
  completedAt?: string;
}

export interface IslamicEvent {
  id: string;
  date: string; // YYYY-MM-DD format
  hijriDate: string;
  title: string;
  description: string;
  type: 'holiday' | 'observance' | 'month_start' | 'special';
  isRecurring: boolean;
}

export interface CalendarState {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day';
  calendarMode: 'dual' | 'gregorian' | 'hijri';
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  selectedDate: Date | null;
}

// Hijri date conversion utilities
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
  'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Simple Hijri date conversion (approximation)
const gregorianToHijri = (gregorianDate: Date) => {
  const HIJRI_EPOCH = new Date('622-07-16'); // Approximate start of Hijri calendar
  const HIJRI_YEAR_LENGTH = 354.367; // Average Hijri year length in days
  
  const daysDiff = Math.floor((gregorianDate.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
  const hijriYear = Math.floor(daysDiff / HIJRI_YEAR_LENGTH) + 1;
  const dayOfYear = daysDiff % HIJRI_YEAR_LENGTH;
  const hijriMonth = Math.floor(dayOfYear / 29.5) + 1;
  const hijriDay = Math.floor(dayOfYear % 29.5) + 1;
  
  return {
    year: hijriYear,
    month: Math.min(hijriMonth, 12),
    day: Math.min(hijriDay, 30),
    monthName: HIJRI_MONTHS[Math.min(hijriMonth - 1, 11)]
  };
};

// Default Islamic events
const defaultIslamicEvents: IslamicEvent[] = [
  {
    id: '1',
    date: '2024-01-01',
    hijriDate: '1445-06-19',
    title: 'Islamic New Year',
    description: 'Beginning of the Islamic year 1445',
    type: 'holiday',
    isRecurring: true
  },
  {
    id: '2',
    date: '2024-03-11',
    hijriDate: '1445-09-01',
    title: 'Ramadan Begins',
    description: 'Start of the holy month of Ramadan',
    type: 'month_start',
    isRecurring: true
  },
  {
    id: '3',
    date: '2024-04-10',
    hijriDate: '1445-10-01',
    title: 'Eid al-Fitr',
    description: 'Festival of Breaking the Fast',
    type: 'holiday',
    isRecurring: true
  },
  {
    id: '4',
    date: '2024-06-17',
    hijriDate: '1445-12-10',
    title: 'Eid al-Adha',
    description: 'Festival of Sacrifice',
    type: 'holiday',
    isRecurring: true
  },
  {
    id: '5',
    date: '2024-06-07',
    hijriDate: '1445-12-01',
    title: 'Hajj Season Begins',
    description: 'Beginning of Dhu al-Hijjah - Hajj month',
    type: 'month_start',
    isRecurring: true
  }
];

const STORAGE_KEY = 'islamic-calendar-data';

export function useCalendarStore() {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    viewMode: 'month',
    calendarMode: 'dual',
    tasks: [],
    islamicEvents: defaultIslamicEvents,
    selectedDate: null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          tasks: parsedData.tasks || [],
          islamicEvents: parsedData.islamicEvents || defaultIslamicEvents,
          currentDate: parsedData.currentDate ? new Date(parsedData.currentDate) : new Date(),
          viewMode: parsedData.viewMode || 'month',
          calendarMode: parsedData.calendarMode || 'dual',
        }));
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        tasks: state.tasks,
        islamicEvents: state.islamicEvents,
        currentDate: state.currentDate.toISOString(),
        viewMode: state.viewMode,
        calendarMode: state.calendarMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving calendar data:', error);
    }
  }, [state]);

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  }, []);

  const setViewMode = useCallback((mode: 'month' | 'week' | 'day') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setCalendarMode = useCallback((mode: 'dual' | 'gregorian' | 'hijri') => {
    setState(prev => ({ ...prev, calendarMode: mode }));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates };
          if (updates.completed !== undefined && updates.completed !== task.completed) {
            updatedTask.completedAt = updates.completed ? new Date().toISOString() : undefined;
          }
          return updatedTask;
        }
        return task;
      }),
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
  }, []);

  const getTasksForDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return state.tasks.filter(task => task.date === dateString);
  }, [state.tasks]);

  const getIslamicEventsForDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return state.islamicEvents.filter(event => event.date === dateString);
  }, [state.islamicEvents]);

  const getHijriDate = useCallback((date: Date) => {
    return gregorianToHijri(date);
  }, []);

  const getMonthName = useCallback((date: Date, isHijri: boolean = false) => {
    if (isHijri) {
      const hijriDate = gregorianToHijri(date);
      return hijriDate.monthName;
    }
    return GREGORIAN_MONTHS[date.getMonth()];
  }, []);

  const getTaskStreak = useCallback(() => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const dayTasks = state.tasks.filter(task => task.date === dateString);
      const hasCompletedTasks = dayTasks.some(task => task.completed);
      
      if (hasCompletedTasks) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [state.tasks]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = state.tasks.filter(task => task.date === today);
    const completedTasks = todayTasks.filter(task => task.completed);
    
    return {
      total: todayTasks.length,
      completed: completedTasks.length,
      pending: todayTasks.length - completedTasks.length,
      completionRate: todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0,
    };
  }, [state.tasks]);

  return {
    // State
    currentDate: state.currentDate,
    viewMode: state.viewMode,
    calendarMode: state.calendarMode,
    tasks: state.tasks,
    islamicEvents: state.islamicEvents,
    selectedDate: state.selectedDate,

    // Actions
    setCurrentDate,
    setViewMode,
    setCalendarMode,
    addTask,
    updateTask,
    deleteTask,

    // Computed
    getTasksForDate,
    getIslamicEventsForDate,
    getHijriDate,
    getMonthName,
    getTaskStreak,
    getTodayStats,

    // Constants
    HIJRI_MONTHS,
    GREGORIAN_MONTHS,
  };
}
