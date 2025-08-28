'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Palette, AlertCircle, Clock, Circle } from 'lucide-react';
import { Task } from '../hooks/useCalendarStore';

interface TaskInputProps {
  date: Date;
  task?: Task | null;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isDark?: boolean;
}

export default function TaskInput({
  date,
  task,
  onSave,
  onCancel,
  isDark = false
}: TaskInputProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    color: '#10b981',
    completed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        color: task.color,
        completed: task.completed,
      });
    }
  }, [task]);

  const themeClasses = {
    overlay: "bg-black/50 backdrop-blur-sm",
    modal: isDark 
      ? "bg-gray-800/95 border-gray-700/50" 
      : "bg-white/95 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    primaryButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    label: isDark ? "text-gray-300" : "text-gray-700",
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', icon: Circle, color: 'text-gray-400' },
    { value: 'medium', label: 'Medium Priority', icon: Clock, color: 'text-orange-500' },
    { value: 'high', label: 'High Priority', icon: AlertCircle, color: 'text-red-500' },
  ];

  const colorOptions = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        date: date.toISOString().split('T')[0],
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`fixed inset-0 z-60 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`w-full max-w-md rounded-2xl border backdrop-blur-xl ${themeClasses.modal}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <h3 className={`text-xl font-bold ${themeClasses.text}`}>
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          
          <button
            onClick={onCancel}
            className={`p-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title..."
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input} ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-2`}>
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add task description..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.input}`}
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-3`}>
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('priority', option.value)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-xl border transition-all duration-300 ${
                      formData.priority === option.value
                        ? themeClasses.primaryButton
                        : themeClasses.button
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${
                      formData.priority === option.value ? 'text-white' : option.color
                    }`} />
                    <span className="text-xs font-medium">
                      {option.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.label} mb-3`}>
              <Palette className="w-4 h-4 inline mr-1" />
              Task Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    formData.color === color 
                      ? 'border-white shadow-lg scale-110' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Completion Status (for editing) */}
          {task && (
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.completed}
                  onChange={(e) => handleInputChange('completed', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  Mark as completed
                </span>
              </label>
            </div>
          )}

          {/* Date Info */}
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-sm ${themeClasses.subtitle}`}>
              <strong>Date:</strong> {date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.primaryButton}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{task ? 'Update' : 'Save'} Task</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
