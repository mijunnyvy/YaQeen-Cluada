"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Bookmark } from "lucide-react";

interface Verse {
  number: number;
  text: string;
  audioUrl?: string;
}

const surahData = {
  number: 1,
  nameArabic: "الفاتحة",
  nameEnglish: "Al-Fatiha",
  verses: [
    { number: 1, text: "بسم الله الرحمن الرحيم", audioUrl: "https://server.com/audio/1.mp3" },
    { number: 2, text: "الحمد لله رب العالمين", audioUrl: "https://server.com/audio/2.mp3" },
    { number: 3, text: "الرحمن الرحيم", audioUrl: "https://server.com/audio/3.mp3" },
    { number: 4, text: "مالك يوم الدين", audioUrl: "https://server.com/audio/4.mp3" },
    { number: 5, text: "إياك نعبد وإياك نستعين", audioUrl: "https://server.com/audio/5.mp3" },
    { number: 6, text: "اهدنا الصراط المستقيم", audioUrl: "https://server.com/audio/6.mp3" },
    { number: 7, text: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين", audioUrl: "https://server.com/audio/7.mp3" },
  ],
};

const SurahPage = () => {
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (verse: Verse) => {
    if (!verse.audioUrl) return;

    if (playingVerse === verse.number) {
      audioRef.current?.pause();
      setPlayingVerse(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = verse.audioUrl;
        audioRef.current.play();
        setPlayingVerse(verse.number);
      }
    }
  };

  // Stop audio when unmount
  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-slate-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-4xl font-bold mb-4">{surahData.nameArabic}</h1>
      <h2 className="text-2xl font-semibold mb-6">{surahData.nameEnglish}</h2>

      <div className="space-y-4">
        {surahData.verses.map((verse) => (
          <div
            key={verse.number}
            className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow flex justify-between items-center"
          >
            <p className="text-lg">{verse.text}</p>
            {verse.audioUrl && (
              <button
                onClick={() => togglePlay(verse)}
                className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                {playingVerse === verse.number ? <Pause /> : <Play />}
              </button>
            )}
          </div>
        ))}
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingVerse(null)} />
    </div>
  );
};

export default SurahPage;
