'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  User,
  Sparkles
} from 'lucide-react';
import { ChatMessage, ChatPreferences, useChatStore } from '../hooks/useChatStore';

interface MessageBubbleProps {
  message: ChatMessage;
  isDark?: boolean;
  preferences: ChatPreferences;
}

export default function MessageBubble({ 
  message, 
  isDark = false, 
  preferences 
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { toggleBookmark, isMessageBookmarked } = useChatStore();
  const isBookmarked = isMessageBookmarked(message.id);

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    userBubble: isDark 
      ? "bg-emerald-600 text-white" 
      : "bg-emerald-500 text-white",
    aiBubble: isDark 
      ? "bg-gray-700/80 border-gray-600/50 text-white" 
      : "bg-white/90 border-gray-200/50 text-gray-900",
    button: isDark
      ? "bg-gray-600/60 hover:bg-gray-500/80 text-gray-300 hover:text-white"
      : "bg-gray-100/60 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    source: isDark 
      ? "bg-gray-600/40 border-gray-500/50" 
      : "bg-gray-50/80 border-gray-200/50",
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.lang = preferences.language === 'arabic' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.8;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Islamic AI Assistant Response',
          text: message.content,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    // Simple markdown-like formatting
    let content = message.content;
    
    // Bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks
    content = content.replace(/\n/g, '<br />');

    return (
      <div 
        className={`${fontSizeClasses[preferences.fontSize]} leading-relaxed`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  const renderSources = () => {
    if (!message.sources || message.sources.length === 0 || !preferences.showSources) {
      return null;
    }

    return (
      <div className={`mt-3 p-3 rounded-lg border ${themeClasses.source}`}>
        <div className="flex items-center space-x-2 mb-2">
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm font-medium">Sources:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {message.sources.map((source, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded text-xs ${themeClasses.button}`}
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Avatar and Name */}
        <div className={`flex items-center space-x-2 mb-2 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          {message.role === 'assistant' && (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${themeClasses.text}`}>
                Islamic AI Assistant
              </span>
            </>
          )}
          
          {message.role === 'user' && (
            <>
              <span className={`text-sm font-medium ${themeClasses.text}`}>
                You
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
          message.role === 'user' 
            ? themeClasses.userBubble 
            : themeClasses.aiBubble
        } ${message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
          {renderContent()}
          {renderSources()}
        </div>

        {/* Message Actions */}
        <div className={`flex items-center space-x-2 mt-2 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span className={`text-xs ${themeClasses.subtitle}`}>
            {formatTimestamp(message.timestamp)}
          </span>

          {message.role === 'assistant' && (
            <div className="flex items-center space-x-1">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </button>

              {/* Voice Button */}
              {preferences.enableVoice && (
                <button
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isPlaying ? themeClasses.accent : themeClasses.button
                  }`}
                  title="Read aloud"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              )}

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(message.id)}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isBookmarked 
                    ? 'text-yellow-500 bg-yellow-500/10' 
                    : themeClasses.button
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark message'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-3 h-3" />
                ) : (
                  <Bookmark className="w-3 h-3" />
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`p-1.5 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                title="Share message"
              >
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Copy Feedback */}
        {copied && (
          <div className={`text-xs ${themeClasses.accent} mt-1 ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}>
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
