'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  MessageCircle, 
  Trash2, 
  Pin, 
  PinOff, 
  Search, 
  X, 
  Bookmark,
  Clock,
  Filter,
  MoreVertical,
  Archive,
  Download
} from 'lucide-react';
import { useChatStore } from '../hooks/useChatStore';

interface ChatSidebarProps {
  isDark?: boolean;
  onClose?: () => void;
  onNewChat?: () => void;
}

export default function ChatSidebar({ isDark = false, onClose, onNewChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);

  const {
    conversations,
    currentConversationId,
    bookmarkedMessages,
    createConversation,
    switchConversation,
    deleteConversation,
    currentMode,
    chatModes,
  } = useChatStore();

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    input: isDark
      ? "bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    conversationItem: isDark
      ? "hover:bg-gray-700/60 border-gray-700/50"
      : "hover:bg-gray-50/80 border-gray-200/50",
    activeConversation: isDark
      ? "bg-emerald-900/40 border-emerald-600/50"
      : "bg-emerald-50/80 border-emerald-300/50",
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      createConversation(currentMode);
      onClose?.();
    }
  };

  const handleConversationClick = (conversationId: string) => {
    switchConversation(conversationId);
    onClose?.();
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${themeClasses.text}`}>
            Islamic AI Chat
          </h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                showBookmarks ? themeClasses.activeButton : themeClasses.button
              }`}
              title="Bookmarked Messages"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${themeClasses.activeButton}`}
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>

        {/* Search */}
        <div className="mt-4">
          <div className={`flex items-center space-x-2 p-3 rounded-xl border ${themeClasses.input.split(' ').slice(1).join(' ')}`}>
            <Search className="w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className={`flex-1 bg-transparent outline-none ${themeClasses.input.split(' ')[2]} ${themeClasses.input.split(' ')[3]}`}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showBookmarks ? (
          /* Bookmarked Messages */
          <div className="p-4">
            <h3 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
              Bookmarked Messages ({bookmarkedMessages.length})
            </h3>
            
            {bookmarkedMessages.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className={`w-12 h-12 mx-auto mb-3 ${themeClasses.subtitle}`} />
                <p className={`text-sm ${themeClasses.subtitle}`}>
                  No bookmarked messages yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarkedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-xl border transition-all duration-300 ${themeClasses.conversationItem}`}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="text-sm">{getModeIcon(message.mode || 'general')}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${themeClasses.text} line-clamp-3`}>
                          {message.content.length > 100 
                            ? message.content.substring(0, 100) + '...'
                            : message.content
                          }
                        </p>
                        <p className={`text-xs ${themeClasses.subtitle} mt-1`}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Conversations List */
          <div className="p-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className={`w-12 h-12 mx-auto mb-3 ${themeClasses.subtitle}`} />
                <p className={`text-sm ${themeClasses.subtitle} mb-2`}>
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                {!searchQuery && (
                  <p className={`text-xs ${themeClasses.subtitle}`}>
                    Start a new chat to begin
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                      conversation.id === currentConversationId
                        ? themeClasses.activeConversation
                        : themeClasses.conversationItem
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">{getModeIcon(conversation.mode)}</span>
                          <span className={`text-xs px-2 py-1 rounded ${themeClasses.button}`}>
                            {chatModes[conversation.mode]?.name || 'General'}
                          </span>
                        </div>
                        
                        <h4 className={`text-sm font-medium ${themeClasses.text} truncate`}>
                          {conversation.title}
                        </h4>
                        
                        {conversation.messages.length > 0 && (
                          <p className={`text-xs ${themeClasses.subtitle} mt-1 line-clamp-2`}>
                            {conversation.messages[conversation.messages.length - 1].content.substring(0, 60)}
                            {conversation.messages[conversation.messages.length - 1].content.length > 60 && '...'}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${themeClasses.subtitle}`}>
                            {formatDate(conversation.updatedAt)}
                          </span>
                          <span className={`text-xs ${themeClasses.subtitle}`}>
                            {conversation.messages.length} messages
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        className={`p-1 rounded transition-all duration-300 opacity-0 group-hover:opacity-100 ${themeClasses.button}`}
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between text-xs">
          <span className={themeClasses.subtitle}>
            {conversations.length} conversations
          </span>
          <span className={themeClasses.subtitle}>
            {bookmarkedMessages.length} bookmarks
          </span>
        </div>
      </div>
    </div>
  );
}
