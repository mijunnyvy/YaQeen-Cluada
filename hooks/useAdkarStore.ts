'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AdkarItem {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  repetitions: number;
  category: 'morning' | 'evening';
  source: string;
  benefits?: string;
  audioUrl?: string;
}

export interface AdkarProgress {
  adkarId: string;
  currentCount: number;
  completed: boolean;
  completedAt?: string;
}

export interface DailyProgress {
  date: string;
  morningAdkar: AdkarProgress[];
  eveningAdkar: AdkarProgress[];
  morningCompleted: boolean;
  eveningCompleted: boolean;
  completedAt?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  totalDaysCompleted: number;
}

export interface AdkarPreferences {
  language: 'arabic' | 'english' | 'both';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  showTransliteration: boolean;
  showTranslation: boolean;
  enableNotifications: boolean;
  morningReminderTime: string;
  eveningReminderTime: string;
  autoAdvance: boolean;
  playAudio: boolean;
}

export interface AdkarState {
  adkarList: AdkarItem[];
  dailyProgress: DailyProgress[];
  currentDayProgress: DailyProgress | null;
  streakData: StreakData;
  preferences: AdkarPreferences;
  featuredAdkar: AdkarItem | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PREFERENCES: AdkarPreferences = {
  language: 'both',
  fontSize: 'medium',
  showTransliteration: true,
  showTranslation: true,
  enableNotifications: false,
  morningReminderTime: '06:00',
  eveningReminderTime: '18:00',
  autoAdvance: false,
  playAudio: false,
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: '',
  totalDaysCompleted: 0,
};

// Sample Adkar data
const MORNING_ADKAR: AdkarItem[] = [
  {
    id: 'morning-1',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illa Allah wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay\'in qadeer',
    translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
    repetitions: 1,
    category: 'morning',
    source: 'Abu Dawud',
    benefits: 'Protection and blessing for the day'
  },
  {
    id: 'morning-2',
    arabicText: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushoor',
    translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    repetitions: 1,
    category: 'morning',
    source: 'Tirmidhi',
    benefits: 'Acknowledgment of Allah\'s sovereignty over life and death'
  },
  {
    id: 'morning-3',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'A\'udhu billahi minash-shaytanir-rajeem. Allahu la ilaha illa huwal-hayyul-qayyoom, la ta\'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih, ya\'lamu ma bayna aydeehim wa ma khalfahum, wa la yuheetoona bi-shay\'in min \'ilmihi illa bima sha\'a, wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'ooduhu hifdhuhuma, wa huwal-\'aliyyul-\'adheem',
    translation: 'I seek refuge in Allah from Satan, the accursed one. Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    repetitions: 1,
    category: 'morning',
    source: 'Quran 2:255 (Ayat al-Kursi)',
    benefits: 'Ultimate protection from all harm'
  },
  {
    id: 'morning-4',
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-samee\'ul-\'aleem',
    translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.',
    repetitions: 3,
    category: 'morning',
    source: 'Abu Dawud, Tirmidhi',
    benefits: 'Protection from all harm throughout the day'
  },
  {
    id: 'morning-5',
    arabicText: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ رَسُولًا',
    transliteration: 'Radeetu billahi rabban, wa bil-islami deenan, wa bi Muhammadin salla Allahu \'alayhi wa sallama rasoolan',
    translation: 'I am pleased with Allah as a Lord, and Islam as a religion, and Muhammad (peace be upon him) as a Messenger.',
    repetitions: 3,
    category: 'morning',
    source: 'Abu Dawud',
    benefits: 'Allah\'s pleasure and intercession of the Prophet'
  }
];

const EVENING_ADKAR: AdkarItem[] = [
  {
    id: 'evening-1',
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illa Allah wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay\'in qadeer',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
    repetitions: 1,
    category: 'evening',
    source: 'Abu Dawud',
    benefits: 'Protection and blessing for the night'
  },
  {
    id: 'evening-2',
    arabicText: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: 'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa ilaykal-maseer',
    translation: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.',
    repetitions: 1,
    category: 'evening',
    source: 'Tirmidhi',
    benefits: 'Acknowledgment of Allah\'s sovereignty over life and death'
  },
  {
    id: 'evening-3',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'A\'udhu billahi minash-shaytanir-rajeem. Allahu la ilaha illa huwal-hayyul-qayyoom...',
    translation: 'I seek refuge in Allah from Satan, the accursed one. Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
    repetitions: 1,
    category: 'evening',
    source: 'Quran 2:255 (Ayat al-Kursi)',
    benefits: 'Ultimate protection from all harm'
  },
  {
    id: 'evening-4',
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-samee\'ul-\'aleem',
    translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.',
    repetitions: 3,
    category: 'evening',
    source: 'Abu Dawud, Tirmidhi',
    benefits: 'Protection from all harm throughout the night'
  },
  {
    id: 'evening-5',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana \'abduk, wa ana ala \'ahdika wa wa\'dika mas-tata\'t, a\'udhu bika min sharri ma sana\'t, aboo\'u laka bi-ni\'matika \'alayy, wa aboo\'u laka bi-dhanbi faghfir li fa-innahu la yaghfirudh-dhunooba illa ant',
    translation: 'O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of which I committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.',
    repetitions: 1,
    category: 'evening',
    source: 'Bukhari',
    benefits: 'Forgiveness of sins and Allah\'s mercy'
  }
];

const ALL_ADKAR = [...MORNING_ADKAR, ...EVENING_ADKAR];

const STORAGE_KEY = 'daily-adkar-data';

export function useAdkarStore() {
  const [state, setState] = useState<AdkarState>({
    adkarList: ALL_ADKAR,
    dailyProgress: [],
    currentDayProgress: null,
    streakData: DEFAULT_STREAK,
    preferences: DEFAULT_PREFERENCES,
    featuredAdkar: null,
    loading: false,
    error: null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          dailyProgress: parsedData.dailyProgress || [],
          streakData: { ...DEFAULT_STREAK, ...parsedData.streakData },
          preferences: { ...DEFAULT_PREFERENCES, ...parsedData.preferences },
        }));
      }
    } catch (error) {
      console.error('Error loading Adkar data:', error);
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    try {
      const dataToSave = {
        dailyProgress: state.dailyProgress,
        streakData: state.streakData,
        preferences: state.preferences,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving Adkar data:', error);
    }
  }, [state.dailyProgress, state.streakData, state.preferences]);

  // Initialize current day progress
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let todayProgress = state.dailyProgress.find(p => p.date === today);
    
    if (!todayProgress) {
      todayProgress = {
        date: today,
        morningAdkar: MORNING_ADKAR.map(adkar => ({
          adkarId: adkar.id,
          currentCount: 0,
          completed: false,
        })),
        eveningAdkar: EVENING_ADKAR.map(adkar => ({
          adkarId: adkar.id,
          currentCount: 0,
          completed: false,
        })),
        morningCompleted: false,
        eveningCompleted: false,
      };
      
      setState(prev => ({
        ...prev,
        dailyProgress: [...prev.dailyProgress, todayProgress],
        currentDayProgress: todayProgress,
      }));
    } else {
      setState(prev => ({ ...prev, currentDayProgress: todayProgress }));
    }
  }, [state.dailyProgress]);

  // Set featured Adkar
  useEffect(() => {
    if (ALL_ADKAR.length > 0) {
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      const featuredIndex = dayOfYear % ALL_ADKAR.length;
      setState(prev => ({ ...prev, featuredAdkar: ALL_ADKAR[featuredIndex] }));
    }
  }, []);

  // Get current time period (morning/evening)
  const getCurrentTimePeriod = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 15 && hour < 20) return 'evening';
    return 'other';
  }, []);

  // Update Adkar count
  const updateAdkarCount = useCallback((adkarId: string, increment: boolean) => {
    setState(prev => {
      if (!prev.currentDayProgress) return prev;

      const adkar = ALL_ADKAR.find(a => a.id === adkarId);
      if (!adkar) return prev;

      const isMorning = adkar.category === 'morning';
      const adkarList = isMorning ? prev.currentDayProgress.morningAdkar : prev.currentDayProgress.eveningAdkar;
      
      const updatedAdkarList = adkarList.map(item => {
        if (item.adkarId === adkarId) {
          const newCount = increment 
            ? Math.min(item.currentCount + 1, adkar.repetitions)
            : Math.max(item.currentCount - 1, 0);
          
          return {
            ...item,
            currentCount: newCount,
            completed: newCount >= adkar.repetitions,
            completedAt: newCount >= adkar.repetitions ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      const allCompleted = updatedAdkarList.every(item => item.completed);
      
      const updatedProgress = {
        ...prev.currentDayProgress,
        [isMorning ? 'morningAdkar' : 'eveningAdkar']: updatedAdkarList,
        [isMorning ? 'morningCompleted' : 'eveningCompleted']: allCompleted,
        completedAt: allCompleted ? new Date().toISOString() : prev.currentDayProgress.completedAt,
      };

      const updatedDailyProgress = prev.dailyProgress.map(day => 
        day.date === updatedProgress.date ? updatedProgress : day
      );

      return {
        ...prev,
        dailyProgress: updatedDailyProgress,
        currentDayProgress: updatedProgress,
      };
    });
  }, []);

  // Update streak data
  const updateStreakData = useCallback(() => {
    if (!state.currentDayProgress) return;

    const { morningCompleted, eveningCompleted } = state.currentDayProgress;
    const bothCompleted = morningCompleted && eveningCompleted;
    
    if (bothCompleted) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      setState(prev => {
        const newStreakData = { ...prev.streakData };
        
        if (newStreakData.lastCompletedDate === yesterday) {
          newStreakData.currentStreak += 1;
        } else if (newStreakData.lastCompletedDate !== today) {
          newStreakData.currentStreak = 1;
        }
        
        newStreakData.longestStreak = Math.max(newStreakData.longestStreak, newStreakData.currentStreak);
        newStreakData.lastCompletedDate = today;
        newStreakData.totalDaysCompleted += 1;
        
        return { ...prev, streakData: newStreakData };
      });
    }
  }, [state.currentDayProgress]);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<AdkarPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences },
    }));
  }, []);

  // Get progress percentage
  const getProgressPercentage = useCallback((category: 'morning' | 'evening') => {
    if (!state.currentDayProgress) return 0;
    
    const adkarList = category === 'morning' 
      ? state.currentDayProgress.morningAdkar 
      : state.currentDayProgress.eveningAdkar;
    
    const totalAdkar = adkarList.length;
    const completedAdkar = adkarList.filter(item => item.completed).length;
    
    return totalAdkar > 0 ? (completedAdkar / totalAdkar) * 100 : 0;
  }, [state.currentDayProgress]);

  // Get Adkar by category
  const getAdkarByCategory = useCallback((category: 'morning' | 'evening') => {
    return ALL_ADKAR.filter(adkar => adkar.category === category);
  }, []);

  // Get Adkar progress
  const getAdkarProgress = useCallback((adkarId: string) => {
    if (!state.currentDayProgress) return null;
    
    const allProgress = [...state.currentDayProgress.morningAdkar, ...state.currentDayProgress.eveningAdkar];
    return allProgress.find(progress => progress.adkarId === adkarId) || null;
  }, [state.currentDayProgress]);

  return {
    // State
    ...state,
    
    // Computed
    morningProgress: getProgressPercentage('morning'),
    eveningProgress: getProgressPercentage('evening'),
    currentTimePeriod: getCurrentTimePeriod(),
    
    // Actions
    updateAdkarCount,
    updateStreakData,
    updatePreferences,
    getAdkarByCategory,
    getAdkarProgress,
    
    // Helper functions
    isAdkarCompleted: (adkarId: string) => {
      const progress = getAdkarProgress(adkarId);
      return progress?.completed || false;
    },
    
    getAdkarCount: (adkarId: string) => {
      const progress = getAdkarProgress(adkarId);
      return progress?.currentCount || 0;
    },
    
    getTodayStatus: () => {
      if (!state.currentDayProgress) return { morning: false, evening: false };
      return {
        morning: state.currentDayProgress.morningCompleted,
        evening: state.currentDayProgress.eveningCompleted,
      };
    },
  };
}
