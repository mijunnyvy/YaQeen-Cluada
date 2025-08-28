'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  isDark?: boolean;
}

export default function TypingIndicator({ isDark = false }: TypingIndicatorProps) {
  const themeClasses = {
    bubble: isDark 
      ? "bg-gray-700/80 border-gray-600/50 text-white" 
      : "bg-white/90 border-gray-200/50 text-gray-900",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%]">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Islamic AI Assistant
          </span>
        </div>

        {/* Typing Bubble */}
        <div className={`p-4 rounded-2xl rounded-bl-md backdrop-blur-xl border ${themeClasses.bubble}`}>
          <div className="flex items-center space-x-2">
            {/* Typing Animation */}
            <div className="flex space-x-1">
              <div 
                className={`w-2 h-2 rounded-full ${themeClasses.accent} animate-bounce`}
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
              ></div>
              <div 
                className={`w-2 h-2 rounded-full ${themeClasses.accent} animate-bounce`}
                style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
              ></div>
              <div 
                className={`w-2 h-2 rounded-full ${themeClasses.accent} animate-bounce`}
                style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
              ></div>
            </div>
            
            {/* Thinking Text */}
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} animate-pulse`}>
              AI is thinking...
            </span>
          </div>

          {/* Islamic Thinking Messages */}
          <div className="mt-2">
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} animate-pulse`}>
              <TypingMessage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for rotating thinking messages
function TypingMessage() {
  const messages = [
    "Searching Islamic knowledge...",
    "Consulting Quran and Hadith...",
    "Preparing authentic response...",
    "Gathering Islamic sources...",
    "Formulating guidance...",
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="transition-opacity duration-500">
      {messages[currentMessage]}
    </span>
  );
}
