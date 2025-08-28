'use client';

import React, { useState } from 'react';
import { X, TrendingUp, Calendar, Award, Target, BarChart3, PieChart } from 'lucide-react';
import { ZikrTask } from '@/hooks/useTasbihStore';

interface StatsModalProps {
  onClose: () => void;
  tasks: ZikrTask[];
  streak: number;
  isDark?: boolean;
}

export default function StatsModal({ onClose, tasks, streak, isDark = false }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'calendar'>('overview');

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
    activeTab: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    card: isDark ? "bg-gray-700/60 border-gray-600/50" : "bg-gray-50/80 border-gray-200/50",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    gold: isDark ? "text-amber-400" : "text-amber-600",
  };

  // Calculate statistics
  const today = new Date().toDateString();
  const completedToday = tasks.filter(task => task.completedDates.includes(today));
  const totalCompletions = tasks.reduce((sum, task) => sum + task.completedDates.length, 0);
  const averageDaily = totalCompletions / Math.max(streak || 1, 1);
  
  // Get last 30 days data
  const getLast30DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      
      const completedTasks = tasks.filter(task => 
        task.completedDates.includes(dateString)
      ).length;
      
      data.push({
        date: dateString,
        day: date.getDate(),
        completedTasks,
        totalTasks: tasks.length
      });
    }
    
    return data;
  };

  const last30Days = getLast30DaysData();
  const maxCompletions = Math.max(...last30Days.map(d => d.completedTasks), 1);

  // Task performance
  const taskPerformance = tasks.map(task => ({
    ...task,
    completionRate: task.completedDates.length / Math.max(streak || 1, 1) * 100,
    totalCompletions: task.completedDates.length
  })).sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div>
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
              Statistics & Analytics
            </h2>
            <p className={`${themeClasses.subtitle}`}>
              Track your spiritual progress
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'tasks', label: 'Task Performance', icon: Target },
            { id: 'calendar', label: 'Calendar View', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? themeClasses.activeTab : themeClasses.button
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className={`text-2xl font-bold ${themeClasses.accent}`}>
                    {streak}
                  </div>
                  <div className={`text-sm ${themeClasses.subtitle}`}>
                    Day Streak
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className={`text-2xl font-bold ${themeClasses.gold}`}>
                    {completedToday.length}
                  </div>
                  <div className={`text-sm ${themeClasses.subtitle}`}>
                    Today's Tasks
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {totalCompletions}
                  </div>
                  <div className={`text-sm ${themeClasses.subtitle}`}>
                    Total Completions
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {averageDaily.toFixed(1)}
                  </div>
                  <div className={`text-sm ${themeClasses.subtitle}`}>
                    Avg. Daily
                  </div>
                </div>
              </div>

              {/* 30-Day Chart */}
              <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
                <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                  Last 30 Days Activity
                </h3>
                
                <div className="flex items-end space-x-1 h-32">
                  {last30Days.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          day.completedTasks > 0
                            ? 'bg-emerald-500'
                            : isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                        style={{
                          height: `${(day.completedTasks / maxCompletions) * 100}%`,
                          minHeight: day.completedTasks > 0 ? '4px' : '2px'
                        }}
                        title={`${day.completedTasks} tasks completed`}
                      />
                      <div className={`text-xs ${themeClasses.subtitle} mt-1`}>
                        {day.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
                <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                  Achievements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { milestone: 3, icon: '🌱', title: 'First Steps', achieved: streak >= 3 },
                    { milestone: 7, icon: '🔥', title: 'Week Warrior', achieved: streak >= 7 },
                    { milestone: 30, icon: '💎', title: 'Monthly Master', achieved: streak >= 30 },
                    { milestone: 100, icon: '👑', title: 'Century Champion', achieved: streak >= 100 },
                  ].map((achievement) => (
                    <div
                      key={achievement.milestone}
                      className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                        achievement.achieved
                          ? 'bg-emerald-500/20 border-emerald-500/50'
                          : themeClasses.card
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <div className={`font-medium ${themeClasses.text} mb-1`}>
                        {achievement.title}
                      </div>
                      <div className={`text-xs ${themeClasses.subtitle}`}>
                        {achievement.milestone} days
                      </div>
                      {achievement.achieved && (
                        <div className="text-xs text-emerald-500 font-medium mt-1">
                          ✓ Achieved
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                Task Performance Ranking
              </h3>
              
              {taskPerformance.map((task, index) => (
                <div key={task.id} className={`p-4 rounded-xl border ${themeClasses.card}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-amber-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        themeClasses.button
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-medium ${themeClasses.text}`}>
                          {task.title}
                        </div>
                        <div className={`text-sm ${themeClasses.subtitle}`}>
                          {task.transliteration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-bold ${themeClasses.accent}`}>
                        {task.completionRate.toFixed(1)}%
                      </div>
                      <div className={`text-sm ${themeClasses.subtitle}`}>
                        {task.totalCompletions} completions
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(task.completionRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <h3 className={`font-bold ${themeClasses.text} mb-4`}>
                30-Day Calendar View
              </h3>
              
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className={`text-center text-sm font-medium ${themeClasses.subtitle} p-2`}>
                    {day}
                  </div>
                ))}
                
                {last30Days.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-2 rounded-lg border text-center transition-all duration-300 ${
                      day.completedTasks === day.totalTasks && day.totalTasks > 0
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : day.completedTasks > 0
                        ? 'bg-emerald-500/50 border-emerald-400/50'
                        : themeClasses.card
                    }`}
                  >
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="text-xs">
                      {day.completedTasks}/{day.totalTasks}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className={themeClasses.subtitle}>All tasks completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-500/50 rounded"></div>
                  <span className={themeClasses.subtitle}>Partial completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <span className={themeClasses.subtitle}>No tasks completed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
