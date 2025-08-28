'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';
import TaskInput from './TaskInput';
import { Task, IslamicEvent } from '../hooks/useCalendarStore';

interface DateDetailModalProps {
  date: Date;
  tasks: Task[];
  islamicEvents: IslamicEvent[];
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  isDark?: boolean;
}

export default function DateDetailModal({
  date,
  tasks,
  islamicEvents,
  onClose,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isDark = false
}: DateDetailModalProps) {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    dangerButton: isDark
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
    success: isDark ? "text-green-400" : "text-green-600",
    warning: isDark ? "text-orange-400" : "text-orange-500",
    error: isDark ? "text-red-400" : "text-red-500",
  };

  // Calculate Hijri date
  const getHijriDate = () => {
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

  const hijriDate = getHijriDate();
  const isToday = date.toDateString() === new Date().toDateString();
  const isJummah = date.getDay() === 5;

  const handleTaskToggle = (task: Task) => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskInput(true);
  };

  const handleTaskSave = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      onAddTask(taskData);
    }
    setShowTaskInput(false);
  };

  const handleTaskCancel = () => {
    setEditingTask(null);
    setShowTaskInput(false);
  };

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-1`}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h2>
            <div className="flex items-center space-x-4">
              <p className={`${themeClasses.gold}`}>
                {hijriDate.day} {hijriDate.month} {hijriDate.year} AH
              </p>
              {isToday && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${themeClasses.primaryButton}`}>
                  Today
                </span>
              )}
              {isJummah && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${themeClasses.accent} bg-emerald-500/10`}>
                  🕌 Jummah
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Islamic Events */}
        {islamicEvents.length > 0 && (
          <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
            <h3 className={`font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
              <Star className={`w-5 h-5 ${themeClasses.gold}`} />
              <span>Islamic Events</span>
            </h3>
            
            <div className="space-y-3">
              {islamicEvents.map((event) => (
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
          </div>
        )}

        {/* Tasks Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${themeClasses.text} flex items-center space-x-2`}>
              <Calendar className={`w-5 h-5 ${themeClasses.accent}`} />
              <span>Tasks ({tasks.length})</span>
            </h3>
            
            <button
              onClick={() => setShowTaskInput(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Task List */}
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className={`p-4 rounded-xl border transition-all duration-300 ${
                  task.completed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : themeClasses.card
                }`}>
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleTaskToggle(task)}
                      className={`mt-1 transition-all duration-300 ${
                        task.completed ? themeClasses.success : themeClasses.subtitle
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getPriorityIcon(task.priority)}
                        <h4 className={`font-semibold ${
                          task.completed 
                            ? `${themeClasses.success} line-through` 
                            : themeClasses.text
                        }`}>
                          {task.title}
                        </h4>
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm ${
                          task.completed 
                            ? `${themeClasses.success} line-through opacity-75` 
                            : themeClasses.subtitle
                        } mb-2`}>
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
                        {task.completedAt && (
                          <span className={`text-xs ${themeClasses.success}`}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleTaskEdit(task)}
                        className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.dangerButton}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${themeClasses.card} rounded-xl border`}>
              <Calendar className={`w-12 h-12 ${themeClasses.subtitle} mx-auto mb-3`} />
              <p className={`${themeClasses.subtitle} mb-4`}>
                No tasks for this day
              </p>
              <button
                onClick={() => setShowTaskInput(true)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.primaryButton}`}
              >
                Add your first task
              </button>
            </div>
          )}
        </div>

        {/* Task Input Modal */}
        {showTaskInput && (
          <TaskInput
            date={date}
            task={editingTask}
            onSave={handleTaskSave}
            onCancel={handleTaskCancel}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}
