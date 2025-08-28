"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  BookOpen,
  Headphones,
  Eye,
  Sun,
  Moon,
  Bookmark,
  Star,
  Clock,
  Share2,
  Download
} from "lucide-react";
import { fetchSurah, fetchSurahSimple, enhanceSurahData, getSurahInfo, testApiEndpoints, type SurahData } from "@/lib/quranApi";
import VerseItem from "@/components/VerseItem";
import AudioPlayer from "@/components/audio-player";
import FontSettings from "@/components/FontSettings";
import TafsirToggle from "@/components/TafsirToggle";
import BookmarkButton, { useBookmarks } from "@/components/BookmarkButton";
import BookmarksManager from "@/components/BookmarksManager";

export default function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const unwrapped = use(params);
  const surahParam = unwrapped.surah;
  const surahNumber = Number(surahParam);

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [mode, setMode] = useState<"read" | "listen">("read");
  const [showTafsir, setShowTafsir] = useState(false);
  const [font, setFont] = useState({ style: "amiri", size: "20" });
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getLastRead } = useBookmarks();
  const surahInfo = getSurahInfo(surahNumber);

  useEffect(() => {
    const loadSurah = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug API endpoints in development
        if (process.env.NODE_ENV === 'development') {
          await testApiEndpoints(surahNumber);
        }

        // Try the full API first
        let data = await fetchSurah(surahNumber);

        // If that fails, try the simple fallback
        if (!data) {
          console.log("Trying fallback API for Surah", surahNumber);
          data = await fetchSurahSimple(surahNumber);
        }

        if (data) {
          // Try to enhance with translation and audio if using simple fallback
          if (data.verses.length > 0 && !data.verses[0].translation) {
            console.log("Enhancing Surah data with translation and audio...");
            data = await enhanceSurahData(data);
          }
          setSurahData(data);
        } else {
          setError("Failed to load Surah data from all available sources");
        }
      } catch (err) {
        setError("Error loading Surah");
        console.error("Error loading Surah:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [surahNumber]);

  // Check for theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Surah...</p>
        </div>
      </div>
    );
  }

  if (error || !surahData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Surah not found"}</p>
          <Link
            href="/quran"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Surah List
          </Link>
        </div>
      </div>
    );
  }

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"
      : "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    accent: isDark ? "text-emerald-400" : "text-emerald-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-emerald-600 text-white"
      : "bg-emerald-500 text-white",
    navButton: isDark
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  const handleNextSurah = () => {
    if (surahNumber < 114) {
      window.location.href = `/quran/${surahNumber + 1}`;
    }
  };

  const handlePrevSurah = () => {
    if (surahNumber > 1) {
      window.location.href = `/quran/${surahNumber - 1}`;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses.background}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button and title */}
            <div className="flex items-center space-x-4">
              <Link
                href="/quran"
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div>
                <h1 className={`text-xl font-bold ${themeClasses.text}`}>
                  {surahData.surahNameEnglish || surahData.surahName}
                </h1>
                <p className={`text-sm ${themeClasses.subtitle}`}>
                  Surah {surahData.surahNumber} • {surahData.totalVerses} verses
                </p>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.button}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setMode("read")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                mode === "read" ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Read Mode</span>
            </button>

            <button
              onClick={() => setMode("listen")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                mode === "listen" ? themeClasses.activeButton : themeClasses.button
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Listen Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FontSettings font={font} setFont={setFont} isDark={isDark} />
              <TafsirToggle showTafsir={showTafsir} setShowTafsir={setShowTafsir} isDark={isDark} />
            </div>
          </div>
        )}

        {/* Bookmarks Panel */}
        {showBookmarks && (
          <div className="mb-8">
            <BookmarksManager isDark={isDark} onClose={() => setShowBookmarks(false)} />
          </div>
        )}

        {/* Surah Header */}
        <div className={`mb-8 p-6 rounded-2xl border backdrop-blur-xl ${themeClasses.card}`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`} style={{fontFamily: 'serif'}}>
              {surahInfo?.nameArabic}
            </h2>
            <h3 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>
              {surahData.surahNameEnglish || surahData.surahName}
            </h3>
            <p className={`${themeClasses.subtitle} mb-4`}>
              {surahInfo?.nameTransliteration} • {surahInfo?.meaning}
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span className={`px-3 py-1 rounded-full ${
                surahData.revelationType === 'Meccan'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {surahData.revelationType}
              </span>
              <span className={`px-3 py-1 rounded-full bg-emerald-500/20 ${themeClasses.accent}`}>
                {surahData.totalVerses} verses
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {mode === "read" ? (
          <div className="space-y-6">
            {surahData.verses.map((verse) => (
              <VerseItem
                key={verse.number}
                verse={verse}
                font={font}
                showTafsir={showTafsir}
                isDark={isDark}
                globalTafsirEnabled={true}
              />
            ))}
          </div>
        ) : (
          <AudioPlayer
            surah={surahData}
            isDark={isDark}
            onNextSurah={handleNextSurah}
            onPrevSurah={handlePrevSurah}
            autoPlayNext={true}
            showLyrics={true}
            font={font}
            showTafsir={showTafsir}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200/20 dark:border-gray-700/20">
          {surahNumber > 1 ? (
            <Link
              href={`/quran/${surahNumber - 1}`}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${themeClasses.navButton}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous Surah</span>
            </Link>
          ) : (
            <div></div>
          )}

          <Link
            href="/quran"
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${themeClasses.button}`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            All Surahs
          </Link>

          {surahNumber < 114 ? (
            <Link
              href={`/quran/${surahNumber + 1}`}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${themeClasses.navButton}`}
            >
              <span>Next Surah</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </main>
    </div>
  );
}
