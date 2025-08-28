'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Brain, 
  Heart,
  Gavel,
  Scroll,
  Star,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '../hooks/useChatStore';

interface ChatWidgetProps {
  isDark?: boolean;
}

export default function ChatWidget({ isDark = false }: ChatWidgetProps) {
  const [mounted, setMounted] = useState(false);
  
  const {
    conversations,
    bookmarkedMessages,
    dailyTip,
    chatModes,
    currentMode,
  } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    modeButton: isDark
      ? "bg-gray-700/60 hover:bg-gray-600/80 border-gray-600/50"
      : "bg-gray-50/80 hover:bg-gray-100/80 border-gray-200/50",
  };

  if (!mounted) {
    return (
      <div className={`p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const recentConversations = conversations.slice(0, 3);

  const getModeIcon = (mode: string) => {
    const icons = {
      general: '🕌',
      guidance: '🌟',
      quran: '📖',
      fiqh: '⚖️',
      adkar: '🤲',
      stories: '📚'
    };
    return icons[mode as keyof typeof icons] || '🕌';
  };

  const getModeColor = (mode: string) => {
    const colors = {
      general: isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      guidance: isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700',
      quran: isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700',
      fiqh: isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700',
      adkar: isDark ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-100 text-teal-700',
      stories: isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
    };
    return colors[mode as keyof typeof colors] || colors.general;
  };

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeClasses.card}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">✨</div>
          <div>
            <h3 className={`text-lg font-bold ${themeClasses.text}`}>
              Islamic AI Assistant
            </h3>
            <p className={`text-sm ${themeClasses.subtitle}`}>
              Ask questions about Islam, get authentic answers
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-1">
          <MessageCircle className={`w-4 h-4 ${themeClasses.accent}`} />
          <span className={`text-lg font-bold ${themeClasses.text}`}>
            {conversations.length}
          </span>
        </div>
      </div>

      {/* Daily Tip */}
      {dailyTip && (
        <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className={`w-4 h-4 ${themeClasses.accent}`} />
            <span className={`text-sm font-medium ${themeClasses.accent}`}>
              Daily Islamic Tip
            </span>
          </div>
          
          <p className={`text-xs ${themeClasses.subtitle} leading-relaxed`}>
            {dailyTip.length > 120 
              ? dailyTip.substring(0, 120) + '...'
              : dailyTip
            }
          </p>
        </div>
      )}

      {/* Chat Modes */}
      <div className="mb-4">
        <h4 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
          Ask About:
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(chatModes).slice(0, 6).map(([key, mode]) => (
            <Link
              key={key}
              href={`/chat?mode=${key}`}
              className={`flex items-center space-x-2 p-2 rounded-lg border transition-all duration-300 hover:scale-105 ${themeClasses.modeButton}`}
            >
              <span className="text-sm">{getModeIcon(key)}</span>
              <span className={`text-xs font-medium ${themeClasses.text} truncate`}>
                {mode.name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Conversations */}
      {recentConversations.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
            Recent Chats
          </h4>
          
          <div className="space-y-2">
            {recentConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/chat?conversation=${conversation.id}`}
                className={`block p-2 rounded-lg transition-all duration-300 hover:scale-105 ${themeClasses.modeButton}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getModeIcon(conversation.mode)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${themeClasses.text} truncate`}>
                      {conversation.title}
                    </p>
                    <p className={`text-xs ${themeClasses.subtitle}`}>
                      {conversation.messages.length} messages
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.accent}`}>
            {conversations.length}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>Conversations</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.accent}`}>
            {bookmarkedMessages.length}
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>Bookmarks</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-bold ${themeClasses.accent}`}>
            6
          </div>
          <div className={`text-xs ${themeClasses.subtitle}`}>AI Modes</div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50/80'}`}>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <BookOpen className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Quran & Tafsir</div>
          </div>
          <div>
            <Brain className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Smart AI</div>
          </div>
          <div>
            <Heart className={`w-4 h-4 mx-auto mb-1 ${themeClasses.accent}`} />
            <div className={`text-xs ${themeClasses.subtitle}`}>Guidance</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link href="/chat">
        <button className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.button}`}>
          <div className="flex items-center justify-center space-x-2">
            {conversations.length > 0 ? (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Continue Chatting</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start AI Chat</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </Link>

      {/* Quick Tip */}
      <div className="mt-3 text-center">
        <p className={`text-xs ${themeClasses.subtitle}`}>
          {conversations.length === 0 
            ? "Ask any Islamic question and get authentic answers from Quran & Sunnah"
            : bookmarkedMessages.length > 0
              ? `You have ${bookmarkedMessages.length} bookmarked answers for future reference`
              : "Continue learning with our AI assistant trained on Islamic knowledge"
          }
        </p>
      </div>
    </div>
  );
}
