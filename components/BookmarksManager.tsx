'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Star, 
  Clock, 
  Trash2, 
  Download, 
  Upload, 
  Search,
  Calendar,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useBookmarks } from './BookmarkButton';
import { getSurahInfo } from '@/lib/quranApi';

interface BookmarksManagerProps {
  isDark?: boolean;
  onClose?: () => void;
}

export default function BookmarksManager({ isDark = false, onClose }: BookmarksManagerProps) {
  const { 
    bookmarks, 
    getBookmarksByType, 
    getLastRead, 
    clearAllBookmarks, 
    exportBookmarks,
    importBookmarks 
  } = useBookmarks();
  
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'favorites' | 'lastRead'>('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');

  const themeClasses = {
    container: isDark 
      ? "bg-gray-800/60 border-gray-700/50 text-white" 
      : "bg-white/90 border-gray-200/50 text-gray-900",
    tab: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeTab: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    dangerButton: isDark
      ? "bg-red-600/80 hover:bg-red-700/80 text-white"
      : "bg-red-500/80 hover:bg-red-600/80 text-white",
    text: isDark ? "text-gray-300" : "text-gray-600",
    title: isDark ? "text-white" : "text-gray-900",
    searchBar: isDark 
      ? "bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400" 
      : "bg-white/90 border-gray-200/50 text-gray-900 placeholder-gray-500",
    card: isDark 
      ? "bg-gray-700/60 border-gray-600/50 hover:bg-gray-700/80" 
      : "bg-white/90 border-gray-200/50 hover:bg-gray-50/90",
  };

  const getFilteredBookmarks = () => {
    const bookmarksList = getBookmarksByType(activeTab === 'lastRead' ? 'lastRead' : activeTab);
    
    if (!searchQuery) return bookmarksList;
    
    return bookmarksList.filter(bookmark => {
      const surahInfo = getSurahInfo(bookmark.surahNumber);
      if (!surahInfo) return false;
      
      return (
        surahInfo.nameArabic.includes(searchQuery) ||
        surahInfo.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surahInfo.nameTransliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.surahNumber.toString().includes(searchQuery)
      );
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importBookmarks(file);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'bookmarks': return <Bookmark className="w-4 h-4" />;
      case 'favorites': return <Star className="w-4 h-4" />;
      case 'lastRead': return <Clock className="w-4 h-4" />;
      default: return <Bookmark className="w-4 h-4" />;
    }
  };

  const filteredBookmarks = getFilteredBookmarks();
  const lastRead = getLastRead();

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${themeClasses.container}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${themeClasses.title}`}>
          Bookmarks Manager
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
          >
            ✕
          </button>
        )}
      </div>

      {/* Last Read Section */}
      {lastRead && (
        <div className={`mb-6 p-4 rounded-xl border ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className={`font-semibold ${themeClasses.title}`}>Continue Reading</h3>
                <p className={`text-sm ${themeClasses.text}`}>
                  Surah {lastRead.surahNumber}, Verse {lastRead.verseNumber}
                </p>
                <p className={`text-xs ${themeClasses.text}`}>
                  {formatDate(lastRead.timestamp)}
                </p>
              </div>
            </div>
            <Link
              href={`/quran/${lastRead.surahNumber}#verse-${lastRead.verseNumber}`}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.text}`} />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 ${themeClasses.searchBar}`}
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {(['bookmarks', 'favorites', 'lastRead'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab ? themeClasses.activeTab : themeClasses.tab
            }`}
          >
            {getTabIcon(tab)}
            <span className="capitalize">
              {tab === 'lastRead' ? 'Last Read' : tab}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeTab === tab ? 'bg-white/20' : 'bg-gray-500/20'
            }`}>
              {getBookmarksByType(tab === 'lastRead' ? 'lastRead' : tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className={`w-12 h-12 mx-auto mb-3 ${themeClasses.text} opacity-50`} />
            <p className={`${themeClasses.text} mb-2`}>
              No {activeTab} found
            </p>
            <p className={`text-sm ${themeClasses.text} opacity-75`}>
              {searchQuery ? 'Try adjusting your search' : `Start adding ${activeTab} as you read`}
            </p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => {
            const surahInfo = getSurahInfo(bookmark.surahNumber);
            if (!surahInfo) return null;

            return (
              <div
                key={bookmark.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${themeClasses.card}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {bookmark.type === 'favorite' && <Star className="w-4 h-4 text-yellow-500" />}
                      {bookmark.type === 'lastRead' && <Clock className="w-4 h-4 text-blue-500" />}
                      {bookmark.type === 'bookmark' && <Bookmark className="w-4 h-4 text-emerald-500" />}
                      
                      <h4 className={`font-semibold ${themeClasses.title}`}>
                        {surahInfo.nameEnglish}
                      </h4>
                      <span className={`text-sm ${themeClasses.text}`}>
                        ({surahInfo.nameArabic})
                      </span>
                    </div>
                    
                    <p className={`text-sm ${themeClasses.text} mb-1`}>
                      Surah {bookmark.surahNumber}, Verse {bookmark.verseNumber}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span className={themeClasses.text}>
                        {formatDate(bookmark.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/quran/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`}
                    className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportBookmarks}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.button}`}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        
        <label className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${themeClasses.button}`}>
          <Upload className="w-4 h-4" />
          <span>Import</span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </label>
        
        <button
          onClick={clearAllBookmarks}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${themeClasses.dangerButton}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
}
