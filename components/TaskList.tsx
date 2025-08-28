'use client';

import React from 'react';
import { Plus, CheckCircle, Circle, Target, Calendar } from 'lucide-react';
import TaskItem from './TaskItem';
import { ZikrTask } from '@/hooks/useTasbihStore';

interface TaskListProps {
  tasks: ZikrTask[];
  onCompleteTask: (taskId: string) => void;
  onAddTask: () => void;
  isDark?: boolean;
}

export default function TaskList({ tasks, onCompleteTask, onAddTask, isDark = false }: TaskListProps) {
  const today = new Date().toDateString();
  const completedToday = tasks.filter(task => task.completedDates.includes(today));
  const pendingTasks = tasks.filter(task => !task.completedDates.includes(today));

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50" 
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    addButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    success: isDark ? "text-green-400" : "text-green-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.container}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              Daily Zikr Tasks
            </h2>
            <p className={`${themeClasses.subtitle}`}>
              Complete your daily spiritual goals
            </p>
          </div>
          
          <button
            onClick={onAddTask}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.addButton}`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Task</span>
          </button>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>
              {completedToday.length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.text}`}>
              {pendingTasks.length}
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>
              Pending
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${themeClasses.success}`}>
              {tasks.length > 0 ? Math.round((completedToday.length / tasks.length) * 100) : 0}%
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>
              Progress
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
              }`}
              style={{ 
                width: `${tasks.length > 0 ? (completedToday.length / tasks.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Circle className={`w-5 h-5 ${themeClasses.accent}`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
              Pending Tasks ({pendingTasks.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => onCompleteTask(task.id)}
                isDark={isDark}
                isCompleted={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedToday.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className={`w-5 h-5 ${themeClasses.success}`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
              Completed Today ({completedToday.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedToday.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => {}} // Already completed
                isDark={isDark}
                isCompleted={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className={`p-12 rounded-2xl border backdrop-blur-xl text-center ${themeClasses.container}`}>
          <div className={`w-16 h-16 rounded-full ${themeClasses.accent} bg-current opacity-20 mx-auto mb-4 flex items-center justify-center`}>
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>
            No Tasks Yet
          </h3>
          <p className={`${themeClasses.subtitle} mb-6`}>
            Create your first Zikr task to start tracking your spiritual progress
          </p>
          <button
            onClick={onAddTask}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${themeClasses.addButton}`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Your First Task</span>
          </button>
        </div>
      )}

      {/* Daily Completion Celebration */}
      {tasks.length > 0 && completedToday.length === tasks.length && (
        <div className={`p-6 rounded-2xl border backdrop-blur-xl text-center ${themeClasses.container} relative overflow-hidden`}>
          <div className="relative z-10">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className={`text-xl font-bold ${themeClasses.success} mb-2`}>
              All Tasks Completed!
            </h3>
            <p className={`${themeClasses.subtitle}`}>
              Congratulations on completing all your daily Zikr tasks
            </p>
          </div>
          
          {/* Celebration Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 animate-pulse" />
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 ${isDark ? 'bg-amber-400' : 'bg-amber-500'} rounded-full animate-ping`}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
