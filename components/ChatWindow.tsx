'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, BookOpen, Brain, Heart, Gavel, Scroll } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useChatStore, ChatPreferences } from '../hooks/useChatStore';

interface ChatWindowProps {
  isDark?: boolean;
  preferences: ChatPreferences;
}

export default function ChatWindow({ isDark = false, preferences }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentConversation,
    currentMode,
    chatModes,
    isLoading,
    error,
    sendMessage,
    createConversation,
  } = useChatStore();

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    suggestion: isDark
      ? "bg-gray-700/60 hover:bg-gray-600/80 border-gray-600/50"
      : "bg-gray-50/80 hover:bg-gray-100/80 border-gray-200/50",
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (preferences.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages, preferences.autoScroll]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversation?.id]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

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

  const getModeSuggestions = () => {
    const suggestions = {
      general: [
        "What are the Five Pillars of Islam?",
        "Tell me about the Prophet Muhammad ﷺ",
        "What is the meaning of Tawhid?",
        "How do I perform Wudu?"
      ],
      guidance: [
        "I'm feeling stressed, can you give me Islamic guidance?",
        "How can I become closer to Allah?",
        "What does Islam say about patience?",
        "I need motivation for daily prayers"
      ],
      quran: [
        "Explain Surah Al-Fatiha",
        "What is the meaning of Ayat al-Kursi?",
        "Tell me about Surah Al-Ikhlas",
        "Explain the first verses of Surah Al-Baqarah"
      ],
      fiqh: [
        "What are the conditions for valid prayer?",
        "How do I calculate Zakat?",
        "What breaks the fast during Ramadan?",
        "What are the rules for Friday prayer?"
      ],
      adkar: [
        "Teach me morning duas",
        "What should I say before eating?",
        "Show me evening remembrance",
        "What are the best duas for forgiveness?"
      ],
      stories: [
        "Tell me about Prophet Yusuf's story",
        "What happened to the People of the Cave?",
        "Tell me about the Night Journey",
        "Share a story about the Companions"
      ]
    };
    return suggestions[currentMode] || suggestions.general;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Screen */}
      {!currentConversation && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="text-center max-w-4xl w-full">
            {/* Welcome message for when hero header is shown */}
            <div className={`p-6 rounded-2xl ${themeClasses.card} backdrop-blur-xl border mb-6`}>
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-3`}>
                Welcome to Islamic AI Assistant
              </h3>
              <p className={`${themeClasses.subtitle} leading-relaxed`}>
                Choose your preferred mode above and start asking questions about Islam.
                I'm here to help with authentic knowledge from Quran and Sunnah.
              </p>
            </div>

            {/* Quick Start Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {getModeSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`p-3 md:p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105 ${themeClasses.suggestion}`}
                >
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="text-base md:text-lg flex-shrink-0">{getModeIcon(currentMode)}</div>
                    <span className={`text-xs md:text-sm ${themeClasses.text} leading-relaxed`}>
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-xl ${themeClasses.card} backdrop-blur-xl border`}>
              <p className={`text-sm ${themeClasses.subtitle} leading-relaxed`}>
                <strong>Note:</strong> This AI assistant provides information based on Islamic knowledge from the Quran, 
                authentic Hadith, and scholarly consensus. For complex religious matters, please consult qualified Islamic scholars.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {currentConversation && (
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {currentConversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isDark={isDark}
              preferences={preferences}
            />
          ))}
          
          {/* Typing indicator */}
          {isLoading && (
            <TypingIndicator isDark={isDark} />
          )}
          
          {/* Error message */}
          {error && (
            <div className="flex justify-center">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className={`p-3 md:p-4 border-t backdrop-blur-xl ${themeClasses.card.split(' ')[0]}`}>
        <div className="flex items-end space-x-2 md:space-x-3">
          <div className="flex-1">
            <div className={`flex items-end rounded-xl md:rounded-2xl border transition-all duration-300 ${themeClasses.input.split(' ').slice(1).join(' ')}`}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${chatModes[currentMode].name.toLowerCase()}...`}
                className={`flex-1 p-3 md:p-4 bg-transparent outline-none resize-none ${themeClasses.input.split(' ')[2]} ${themeClasses.input.split(' ')[3]} text-sm md:text-base`}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button}`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-2 md:mt-3">
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${themeClasses.subtitle}`}>
              Mode: {chatModes[currentMode].name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs ${themeClasses.subtitle} hidden md:inline`}>
              Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
