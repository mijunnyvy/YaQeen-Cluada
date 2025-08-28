'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  Circle, 
  AlertCircle,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface DayViewProps {
  currentDate: Date;
  calendarMode: 'dual' | 'gregorian' | 'hijri';
  onDateClick: (date: Date) => void;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  isDark?: boolean;
}

export default function DayView({
  currentDate,
  calendarMode,
  onDateClick,
  tasks,
  islamicEvents,
  isDark = false
}: DayViewProps) {
  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    success: isDark ? "text-green-400" : "text-green-600",
    warning: isDark ? "text-orange-400" : "text-orange-500",
    error: isDark ? "text-red-400" : "text-red-500",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  const dayTasks = tasks.filter(task => task.date === currentDate.toISOString().split('T')[0]);
  const dayEvents = islamicEvents.filter(event => event.date === currentDate.toISOString().split('T')[0]);
  const completedTasks = dayTasks.filter(task => task.completed);
  const pendingTasks = dayTasks.filter(task => !task.completed);

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const isJummah = currentDate.getDay() === 5;

  // Calculate Hijri date
  const getHijriDate = () => {
    const HIJRI_EPOCH = new Date('622-07-16');
    const daysDiff = Math.floor((currentDate.getTime() - HIJRI_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
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

  const hijriDate = getHijriDate();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'holiday': return '🎉';
      case 'month_start': return '🌙';
      case 'special': return '✨';
      default: return '📅';
    }
  };

  return (
    <div className="p-6">
      {/* Day Header */}
      <div className="mb-8 text-center">
        <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </h2>
        
        <div className="flex items-center justify-center space-x-6 mb-4">
          {(calendarMode === 'dual' || calendarMode === 'hijri') && (
            <div className={`flex items-center space-x-2 ${themeClasses.gold}`}>
              <span>🌙</span>
              <span className="font-medium">
                {hijriDate.day} {hijriDate.month} {hijriDate.year} AH
              </span>
            </div>
          )}
          
          {isToday && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${themeClasses.primaryButton}`}>
              Today
            </span>
          )}
          
          {isJummah && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${themeClasses.accent} bg-emerald-500/10`}>
              🕌 Jummah
            </span>
          )}
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className={`p-3 rounded-xl ${themeClasses.card}`}>
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {dayTasks.length}
            </div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              Total Tasks
            </div>
          </div>
          
          <div className={`p-3 rounded-xl ${themeClasses.card}`}>
            <div className={`text-lg font-bold ${themeClasses.success}`}>
              {completedTasks.length}
            </div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              Completed
            </div>
          </div>
          
          <div className={`p-3 rounded-xl ${themeClasses.card}`}>
            <div className={`text-lg font-bold ${themeClasses.gold}`}>
              {dayEvents.length}
            </div>
            <div className={`text-xs ${themeClasses.subtitle}`}>
              Events
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Islamic Events */}
        <div>
          <h3 className={`font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
            <Star className={`w-5 h-5 ${themeClasses.gold}`} />
            <span>Islamic Events</span>
          </h3>
          
          {dayEvents.length > 0 ? (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div key={event.id} className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.text} mb-1`}>
                        {event.title}
                      </h4>
                      <p className={`text-sm ${themeClasses.subtitle} mb-2`}>
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.type === 'holiday' 
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                            : event.type === 'month_start'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          {event.type.replace('_', ' ')}
                        </span>
                        <span className={`text-xs ${themeClasses.subtitle}`}>
                          {event.hijriDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${themeClasses.card} rounded-xl border`}>
              <Star className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
              <p className={`${themeClasses.subtitle}`}>
                No Islamic events today
              </p>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${themeClasses.text} flex items-center space-x-2`}>
              <Calendar className={`w-5 h-5 ${themeClasses.accent}`} />
              <span>Tasks</span>
            </h3>
            
            <button
              onClick={() => onDateClick(currentDate)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {dayTasks.length > 0 ? (
            <div className="space-y-3">
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${themeClasses.subtitle} mb-2`}>
                    Pending ({pendingTasks.length})
                  </h4>
                  {pendingTasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-xl border ${themeClasses.card} mb-2`}>
                      <div className="flex items-start space-x-3">
                        <Circle className={`w-5 h-5 mt-1 ${themeClasses.subtitle}`} />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPriorityIcon(task.priority)}
                            <h4 className={`font-semibold ${themeClasses.text}`}>
                              {task.title}
                            </h4>
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm ${themeClasses.subtitle} mb-2`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <span 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: task.color }}
                            />
                            <span className={`text-xs ${themeClasses.subtitle}`}>
                              {task.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium ${themeClasses.subtitle} mb-2`}>
                    Completed ({completedTasks.length})
                  </h4>
                  {completedTasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-xl border bg-green-500/10 border-green-500/20 mb-2`}>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className={`w-5 h-5 mt-1 ${themeClasses.success}`} />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPriorityIcon(task.priority)}
                            <h4 className={`font-semibold ${themeClasses.success} line-through`}>
                              {task.title}
                            </h4>
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm ${themeClasses.success} line-through opacity-75 mb-2`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <span 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: task.color }}
                            />
                            <span className={`text-xs ${themeClasses.success}`}>
                              ✓ Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-8 ${themeClasses.card} rounded-xl border`}>
              <Calendar className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
              <p className={`${themeClasses.subtitle} mb-4`}>
                No tasks for today
              </p>
              <button
                onClick={() => onDateClick(currentDate)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.primaryButton}`}
              >
                Add your first task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      {dayTasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className={`p-6 rounded-xl ${themeClasses.card}`}>
            <h4 className={`font-bold ${themeClasses.text} mb-4`}>
              Daily Progress
            </h4>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${themeClasses.subtitle}`}>
                    Completion Rate
                  </span>
                  <span className={`text-sm font-medium ${themeClasses.text}`}>
                    {Math.round((completedTasks.length / dayTasks.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(completedTasks.length / dayTasks.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {dayTasks.filter(t => t.priority === 'high').length}
                </div>
                <div className={`text-xs ${themeClasses.error}`}>
                  High Priority
                </div>
              </div>
              
              <div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {dayTasks.filter(t => t.priority === 'medium').length}
                </div>
                <div className={`text-xs ${themeClasses.warning}`}>
                  Medium Priority
                </div>
              </div>
              
              <div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {dayTasks.filter(t => t.priority === 'low').length}
                </div>
                <div className={`text-xs ${themeClasses.subtitle}`}>
                  Low Priority
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
