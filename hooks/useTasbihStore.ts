'use client';

import { useState, useEffect } from 'react';

export interface ZikrTask {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  completedDates: string[];
  createdAt: string;
  isCustom: boolean;
}

export interface TasbihSettings {
  soundFeedback: boolean;
  hapticFeedback: boolean;
  fontSize: 'small' | 'medium' | 'large';
  beadStyle: 'classic' | 'modern' | 'minimal';
  autoReset: boolean;
  dailyReminder: boolean;
  reminderTime: string;
}

export interface TasbihState {
  currentCount: number;
  targetCount: number;
  mode: 'target' | 'infinite';
  currentZikr: string;
  tasks: ZikrTask[];
  settings: TasbihSettings;
  history: Array<{
    date: string;
    totalCount: number;
    completedTasks: number;
  }>;
}

const defaultTasks: ZikrTask[] = [
  {
    id: '1',
    title: 'Morning Tasbih',
    arabicText: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    targetCount: 33,
    currentCount: 0,
    isCompleted: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '2',
    title: 'Praise Allah',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah',
    targetCount: 33,
    currentCount: 0,
    isCompleted: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '3',
    title: 'Allah is Greatest',
    arabicText: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is Greatest',
    targetCount: 34,
    currentCount: 0,
    isCompleted: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '4',
    title: 'Evening Dhikr',
    arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illa Allah',
    meaning: 'There is no god but Allah',
    targetCount: 100,
    currentCount: 0,
    isCompleted: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '5',
    title: 'Seeking Forgiveness',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    targetCount: 70,
    currentCount: 0,
    isCompleted: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
];

const defaultSettings: TasbihSettings = {
  soundFeedback: false,
  hapticFeedback: true,
  fontSize: 'medium',
  beadStyle: 'classic',
  autoReset: false,
  dailyReminder: false,
  reminderTime: '09:00',
};

const STORAGE_KEY = 'tasbih-data';

export function useTasbihStore() {
  const [state, setState] = useState<TasbihState>({
    currentCount: 0,
    targetCount: 33,
    mode: 'target',
    currentZikr: 'سُبْحَانَ اللَّهِ',
    tasks: defaultTasks,
    settings: defaultSettings,
    history: [],
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          ...parsedData,
          // Ensure we have default tasks if none exist
          tasks: parsedData.tasks?.length > 0 ? parsedData.tasks : defaultTasks,
        }));
      }
    } catch (error) {
      console.error('Error loading tasbih data:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving tasbih data:', error);
    }
  }, [state]);

  const incrementCount = () => {
    setState(prev => ({
      ...prev,
      currentCount: prev.currentCount + 1,
    }));
  };

  const resetCount = () => {
    setState(prev => ({
      ...prev,
      currentCount: 0,
    }));
  };

  const setTargetCount = (target: number) => {
    setState(prev => ({
      ...prev,
      targetCount: target,
    }));
  };

  const setMode = (mode: 'target' | 'infinite') => {
    setState(prev => ({
      ...prev,
      mode,
    }));
  };

  const setCurrentZikr = (zikr: string) => {
    setState(prev => ({
      ...prev,
      currentZikr: zikr,
    }));
  };

  const addTask = (task: Omit<ZikrTask, 'id' | 'createdAt' | 'currentCount' | 'isCompleted' | 'completedDates'>) => {
    const newTask: ZikrTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentCount: 0,
      isCompleted: false,
      completedDates: [],
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const updateTask = (taskId: string, updates: Partial<ZikrTask>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  };

  const incrementTaskCount = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          const newCount = task.currentCount + 1;
          const isCompleted = newCount >= task.targetCount;
          const today = new Date().toDateString();
          
          return {
            ...task,
            currentCount: newCount,
            isCompleted,
            completedDates: isCompleted && !task.completedDates.includes(today)
              ? [...task.completedDates, today]
              : task.completedDates,
          };
        }
        return task;
      }),
    }));
  };

  const completeTask = (taskId: string) => {
    const today = new Date().toDateString();
    
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            currentCount: task.targetCount,
            isCompleted: true,
            completedDates: task.completedDates.includes(today)
              ? task.completedDates
              : [...task.completedDates, today],
          };
        }
        return task;
      }),
    }));
  };

  const resetDailyTasks = () => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => ({
        ...task,
        currentCount: 0,
        isCompleted: false,
      })),
    }));
  };

  const updateSettings = (newSettings: Partial<TasbihSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const getStreak = (): number => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasCompletedTasksOnDate = state.tasks.some(task =>
        task.completedDates.includes(dateString)
      );
      
      if (hasCompletedTasksOnDate) {
        streak++;
      } else if (i > 0) {
        // If we're not checking today and no tasks were completed, break the streak
        break;
      }
    }
    
    return streak;
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const completedToday = state.tasks.filter(task =>
      task.completedDates.includes(today)
    ).length;
    
    const totalTasks = state.tasks.length;
    const totalCountToday = state.tasks.reduce((sum, task) => {
      return task.completedDates.includes(today) ? sum + task.targetCount : sum;
    }, 0);
    
    return {
      completedTasks: completedToday,
      totalTasks,
      totalCount: totalCountToday,
      completionRate: totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0,
    };
  };

  return {
    // State
    currentCount: state.currentCount,
    targetCount: state.targetCount,
    mode: state.mode,
    currentZikr: state.currentZikr,
    tasks: state.tasks,
    settings: state.settings,
    history: state.history,
    
    // Actions
    incrementCount,
    resetCount,
    setTargetCount,
    setMode,
    setCurrentZikr,
    addTask,
    updateTask,
    incrementTaskCount,
    completeTask,
    resetDailyTasks,
    updateSettings,
    
    // Computed
    getStreak,
    getTodayStats,
  };
}
