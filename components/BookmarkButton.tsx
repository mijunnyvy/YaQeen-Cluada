'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Star, Clock, MapPin } from 'lucide-react';

interface BookmarkData {
  id: string;
  surahNumber: number;
  verseNumber: number;
  timestamp: number;
  note?: string;
  type: 'bookmark' | 'lastRead' | 'favorite';
}

interface BookmarkButtonProps {
  surahNumber: number;
  verseNumber: number;
  isDark?: boolean;
  type?: 'bookmark' | 'lastRead' | 'favorite';
  showLabel?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  surahNumber,
  verseNumber,
  isDark = false,
  type = 'bookmark',
  showLabel = false,
  onBookmarkChange
}: BookmarkButtonProps) {
  const [isMarked, setIsMarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

  const themeClasses = {
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    favoriteButton: isDark
      ? "bg-yellow-600 text-white"
      : "bg-yellow-500 text-white",
    lastReadButton: isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white",
    text: isDark ? "text-gray-300" : "text-gray-600",
  };

  useEffect(() => {
    loadBookmarks();
  }, [surahNumber, verseNumber, type]);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem("quranBookmarks");
      const bookmarksList: BookmarkData[] = saved ? JSON.parse(saved) : [];
      setBookmarks(bookmarksList);

      const existingBookmark = bookmarksList.find(
        b => b.surahNumber === surahNumber &&
             b.verseNumber === verseNumber &&
             b.type === type
      );
      setIsMarked(!!existingBookmark);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
      setIsMarked(false);
    }
  };

  const saveBookmarks = (newBookmarks: BookmarkData[]) => {
    try {
      localStorage.setItem("quranBookmarks", JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const handleToggleBookmark = () => {
    const bookmarkId = `${type}-${surahNumber}-${verseNumber}`;

    if (isMarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter(
        b => !(b.surahNumber === surahNumber &&
               b.verseNumber === verseNumber &&
               b.type === type)
      );
      saveBookmarks(updatedBookmarks);
      setIsMarked(false);
      onBookmarkChange?.(false);
    } else {
      // Add bookmark
      const newBookmark: BookmarkData = {
        id: bookmarkId,
        surahNumber,
        verseNumber,
        timestamp: Date.now(),
        type
      };

      // For lastRead, remove any existing lastRead bookmark
      let updatedBookmarks = bookmarks;
      if (type === 'lastRead') {
        updatedBookmarks = bookmarks.filter(b => b.type !== 'lastRead');
      }

      updatedBookmarks.push(newBookmark);
      saveBookmarks(updatedBookmarks);
      setIsMarked(true);
      onBookmarkChange?.(true);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'favorite':
        return <Star className="w-5 h-5" fill={isMarked ? "currentColor" : "none"} />;
      case 'lastRead':
        return <Clock className="w-5 h-5" />;
      default:
        return isMarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />;
    }
  };

  const getButtonClass = () => {
    if (!isMarked) return themeClasses.button;

    switch (type) {
      case 'favorite':
        return themeClasses.favoriteButton;
      case 'lastRead':
        return themeClasses.lastReadButton;
      default:
        return themeClasses.activeButton;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'favorite':
        return isMarked ? 'Remove from Favorites' : 'Add to Favorites';
      case 'lastRead':
        return isMarked ? 'Clear Last Read' : 'Mark as Last Read';
      default:
        return isMarked ? 'Remove Bookmark' : 'Add Bookmark';
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      className={`p-2 rounded-lg transition-all duration-300 ${getButtonClass()}`}
      title={getLabel()}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showLabel && (
          <span className="text-sm font-medium">
            {type === 'favorite' ? 'Favorite' :
             type === 'lastRead' ? 'Last Read' :
             'Bookmark'}
          </span>
        )}
      </div>
    </button>
  );
}

// Hook for managing bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem("quranBookmarks");
      const bookmarksList: BookmarkData[] = saved ? JSON.parse(saved) : [];
      setBookmarks(bookmarksList);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    }
  };

  const getBookmarksByType = (type: 'bookmark' | 'lastRead' | 'favorite') => {
    return bookmarks.filter(b => b.type === type);
  };

  const getLastRead = () => {
    const lastReadBookmarks = getBookmarksByType('lastRead');
    return lastReadBookmarks.length > 0 ? lastReadBookmarks[0] : null;
  };

  const clearAllBookmarks = () => {
    localStorage.removeItem("quranBookmarks");
    setBookmarks([]);
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quran-bookmarks.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBookmarks = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBookmarks = JSON.parse(e.target?.result as string);
        localStorage.setItem("quranBookmarks", JSON.stringify(importedBookmarks));
        loadBookmarks();
      } catch (error) {
        console.error('Error importing bookmarks:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    bookmarks,
    getBookmarksByType,
    getLastRead,
    clearAllBookmarks,
    exportBookmarks,
    importBookmarks,
    refreshBookmarks: loadBookmarks
  };
}
