'use client';

import { useState, useEffect, useCallback } from 'react';

export interface BeautifulName {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  meaning: string;
  explanation: string;
  category: 'mercy' | 'power' | 'knowledge' | 'creation' | 'guidance' | 'protection' | 'forgiveness' | 'sustenance' | 'justice' | 'beauty';
  audioUrl?: string;
}

export interface LearningProgress {
  nameId: number;
  memorized: boolean;
  attempts: number;
  correctAnswers: number;
  lastStudied: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  category?: string;
}

export interface UserPreferences {
  language: 'arabic' | 'english' | 'both';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  showTransliteration: boolean;
  showMeaning: boolean;
  showExplanation: boolean;
  autoPlayAudio: boolean;
  quizDifficulty: 'easy' | 'medium' | 'hard';
  studyReminders: boolean;
}

export interface NamesState {
  names: BeautifulName[];
  favorites: number[];
  learningProgress: LearningProgress[];
  quizResults: QuizResult[];
  preferences: UserPreferences;
  searchQuery: string;
  selectedCategory: string;
  currentMode: 'grid' | 'flashcard' | 'quiz';
  dailyName: BeautifulName | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'both',
  fontSize: 'medium',
  showTransliteration: true,
  showMeaning: true,
  showExplanation: false,
  autoPlayAudio: false,
  quizDifficulty: 'medium',
  studyReminders: false,
};

// All 99 Beautiful Names of Allah
const BEAUTIFUL_NAMES: BeautifulName[] = [
  {
    id: 1,
    arabic: 'الرَّحْمَٰنُ',
    transliteration: 'Ar-Rahman',
    english: 'The Most Merciful',
    meaning: 'The One who has plenty of mercy for the believers and the blasphemers in this world and especially for the believers in the hereafter.',
    explanation: 'This name encompasses Allah\'s vast mercy that extends to all of creation. It is derived from the root word "rahma" meaning mercy.',
    category: 'mercy'
  },
  {
    id: 2,
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Raheem',
    english: 'The Most Compassionate',
    meaning: 'The One who has plenty of mercy for the believers.',
    explanation: 'While Ar-Rahman refers to Allah\'s general mercy, Ar-Raheem refers to His specific mercy for the believers.',
    category: 'mercy'
  },
  {
    id: 3,
    arabic: 'الْمَلِكُ',
    transliteration: 'Al-Malik',
    english: 'The King',
    meaning: 'The One with the complete dominion, the One whose dominion is clear from imperfection.',
    explanation: 'Allah is the absolute sovereign and ruler of all existence, with complete authority over everything.',
    category: 'power'
  },
  {
    id: 4,
    arabic: 'الْقُدُّوسُ',
    transliteration: 'Al-Quddus',
    english: 'The Most Holy',
    meaning: 'The One who is pure from any imperfection and clear from children and adversaries.',
    explanation: 'Allah is absolutely pure and free from all defects, imperfections, and anything that diminishes His perfection.',
    category: 'beauty'
  },
  {
    id: 5,
    arabic: 'السَّلَامُ',
    transliteration: 'As-Salaam',
    english: 'The Source of Peace',
    meaning: 'The One who is free from every imperfection.',
    explanation: 'Allah is the source of all peace and security, free from all defects and the giver of peace to His creation.',
    category: 'protection'
  },
  {
    id: 6,
    arabic: 'الْمُؤْمِنُ',
    transliteration: 'Al-Mu\'min',
    english: 'The Giver of Security',
    meaning: 'The One who witnessed for Himself that no one is God but Him, and witnessed for His believers that they are truthful in their belief that no one is God but Him.',
    explanation: 'Allah provides security and faith to His believers and confirms the truth of His message.',
    category: 'protection'
  },
  {
    id: 7,
    arabic: 'الْمُهَيْمِنُ',
    transliteration: 'Al-Muhaymin',
    english: 'The Guardian',
    meaning: 'The One who witnesses the saying and deeds of His creatures.',
    explanation: 'Allah is the supreme guardian who watches over and protects all of creation with His knowledge and care.',
    category: 'protection'
  },
  {
    id: 8,
    arabic: 'الْعَزِيزُ',
    transliteration: 'Al-Aziz',
    english: 'The Mighty',
    meaning: 'The Strong, The Defeater who is not defeated.',
    explanation: 'Allah possesses absolute strength and power that cannot be overcome or defeated by anyone or anything.',
    category: 'power'
  },
  {
    id: 9,
    arabic: 'الْجَبَّارُ',
    transliteration: 'Al-Jabbar',
    english: 'The Compeller',
    meaning: 'The One that nothing happens in His dominion except that which He willed.',
    explanation: 'Allah has absolute authority and power to enforce His will throughout all of creation.',
    category: 'power'
  },
  {
    id: 10,
    arabic: 'الْمُتَكَبِّرُ',
    transliteration: 'Al-Mutakabbir',
    english: 'The Supreme',
    meaning: 'The One who rejects the attributes of the creatures and is distinguished from them.',
    explanation: 'Allah is supremely great and exalted above all creation, possessing qualities that belong to Him alone.',
    category: 'power'
  },
  {
    id: 11,
    arabic: 'الْخَالِقُ',
    transliteration: 'Al-Khaliq',
    english: 'The Creator',
    meaning: 'The One who brings everything from non-existence to existence.',
    explanation: 'Allah is the ultimate creator who brought all of existence into being from nothing.',
    category: 'creation'
  },
  {
    id: 12,
    arabic: 'الْبَارِئُ',
    transliteration: 'Al-Bari',
    english: 'The Originator',
    meaning: 'The One who created the creation and formed it without any preceding example.',
    explanation: 'Allah creates without following any pattern or model, originating everything uniquely.',
    category: 'creation'
  },
  {
    id: 13,
    arabic: 'الْمُصَوِّرُ',
    transliteration: 'Al-Musawwir',
    english: 'The Fashioner',
    meaning: 'The One who forms His creatures in different pictures.',
    explanation: 'Allah shapes and forms all creation according to His wisdom, giving each thing its unique form.',
    category: 'creation'
  },
  {
    id: 14,
    arabic: 'الْغَفَّارُ',
    transliteration: 'Al-Ghaffar',
    english: 'The Repeatedly Forgiving',
    meaning: 'The One who forgives the sins of His slaves time and time again.',
    explanation: 'Allah continuously forgives those who seek His forgiveness with sincere repentance.',
    category: 'forgiveness'
  },
  {
    id: 15,
    arabic: 'الْقَهَّارُ',
    transliteration: 'Al-Qahhar',
    english: 'The Dominant',
    meaning: 'The One who has the perfect Power and is not unable over anything.',
    explanation: 'Allah has absolute dominance and control over all of creation, with nothing able to resist His will.',
    category: 'power'
  },
  {
    id: 16,
    arabic: 'الْوَهَّابُ',
    transliteration: 'Al-Wahhab',
    english: 'The Bestower',
    meaning: 'The One who is Generous in giving plenty without any return.',
    explanation: 'Allah gives abundantly to His creation without expecting anything in return, out of His pure generosity.',
    category: 'sustenance'
  },
  {
    id: 17,
    arabic: 'الرَّزَّاقُ',
    transliteration: 'Ar-Razzaq',
    english: 'The Provider',
    meaning: 'The One who provides everything that the creatures need.',
    explanation: 'Allah provides sustenance and everything needed for survival to all of His creation.',
    category: 'sustenance'
  },
  {
    id: 18,
    arabic: 'الْفَتَّاحُ',
    transliteration: 'Al-Fattah',
    english: 'The Opener',
    meaning: 'The One who opens for His slaves the closed worldly and religious matters.',
    explanation: 'Allah opens doors of opportunity, knowledge, and guidance for His servants.',
    category: 'guidance'
  },
  {
    id: 19,
    arabic: 'الْعَلِيمُ',
    transliteration: 'Al-Aleem',
    english: 'The All-Knowing',
    meaning: 'The One who knows everything.',
    explanation: 'Allah possesses complete and perfect knowledge of all things, past, present, and future.',
    category: 'knowledge'
  },
  {
    id: 20,
    arabic: 'الْقَابِضُ',
    transliteration: 'Al-Qabid',
    english: 'The Constrictor',
    meaning: 'The One who constricts the sustenance by His wisdom.',
    explanation: 'Allah controls and restricts provisions according to His divine wisdom and plan.',
    category: 'sustenance'
  },
  {
    id: 21,
    arabic: 'الْبَاسِطُ',
    transliteration: 'Al-Basit',
    english: 'The Expander',
    meaning: 'The One who expands and widens.',
    explanation: 'Allah expands sustenance, mercy, and blessings according to His wisdom.',
    category: 'sustenance'
  },
  {
    id: 22,
    arabic: 'الْخَافِضُ',
    transliteration: 'Al-Khafid',
    english: 'The Abaser',
    meaning: 'The One who lowers whoever He willed by His destruction.',
    explanation: 'Allah humbles and lowers those who deserve it according to His perfect justice.',
    category: 'justice'
  },
  {
    id: 23,
    arabic: 'الرَّافِعُ',
    transliteration: 'Ar-Rafi',
    english: 'The Exalter',
    meaning: 'The One who raises whoever He willed by His endowment.',
    explanation: 'Allah elevates and honors those whom He chooses according to His wisdom.',
    category: 'justice'
  },
  {
    id: 24,
    arabic: 'الْمُعِزُّ',
    transliteration: 'Al-Mu\'izz',
    english: 'The Honorer',
    meaning: 'The One who gives power and honor to whoever He willed.',
    explanation: 'Allah grants honor, dignity, and strength to whomever He chooses.',
    category: 'power'
  },
  {
    id: 25,
    arabic: 'الْمُذِلُّ',
    transliteration: 'Al-Mudhill',
    english: 'The Humiliator',
    meaning: 'The One who humiliates whoever He willed.',
    explanation: 'Allah humiliates and disgraces those who oppose Him and transgress His limits.',
    category: 'justice'
  },
  {
    id: 26,
    arabic: 'السَّمِيعُ',
    transliteration: 'As-Samee',
    english: 'The All-Hearing',
    meaning: 'The One who hears all things that are heard by His eternal hearing without an ear, instrument or organ.',
    explanation: 'Allah hears everything - every sound, word, and even the thoughts in hearts.',
    category: 'knowledge'
  },
  {
    id: 27,
    arabic: 'الْبَصِيرُ',
    transliteration: 'Al-Baseer',
    english: 'The All-Seeing',
    meaning: 'The One who sees all things that are seen by His eternal seeing without a pupil or any other instrument.',
    explanation: 'Allah sees everything - visible and hidden, in darkness and light, without any limitation.',
    category: 'knowledge'
  },
  {
    id: 28,
    arabic: 'الْحَكَمُ',
    transliteration: 'Al-Hakam',
    english: 'The Judge',
    meaning: 'The One who is the supreme arbitrating judge.',
    explanation: 'Allah is the ultimate judge who decides all matters with perfect justice and wisdom.',
    category: 'justice'
  },
  {
    id: 29,
    arabic: 'الْعَدْلُ',
    transliteration: 'Al-Adl',
    english: 'The Just',
    meaning: 'The One who is entitled to do what He does.',
    explanation: 'Allah is perfectly just in all His actions and decisions, never committing any injustice.',
    category: 'justice'
  },
  {
    id: 30,
    arabic: 'اللَّطِيفُ',
    transliteration: 'Al-Lateef',
    english: 'The Gentle',
    meaning: 'The One who is kind to His slaves and endows upon them.',
    explanation: 'Allah is gentle and kind in His dealings with creation, providing for them in subtle ways.',
    category: 'mercy'
  },
  {
    id: 31,
    arabic: 'الْخَبِيرُ',
    transliteration: 'Al-Khabeer',
    english: 'The All-Aware',
    meaning: 'The One who knows the truth of things.',
    explanation: 'Allah is completely aware of all hidden matters and the inner reality of everything.',
    category: 'knowledge'
  },
  {
    id: 32,
    arabic: 'الْحَلِيمُ',
    transliteration: 'Al-Haleem',
    english: 'The Forbearing',
    meaning: 'The One who delays the punishment for those who deserve it and then He might forgive them.',
    explanation: 'Allah is patient and forbearing, not hastening to punish but giving time for repentance.',
    category: 'mercy'
  },
  {
    id: 33,
    arabic: 'الْعَظِيمُ',
    transliteration: 'Al-Azeem',
    english: 'The Magnificent',
    meaning: 'The One deserving the attributes of Exaltment, Glory, Extolment, and Purity from all imperfection.',
    explanation: 'Allah is magnificent in His essence, attributes, and actions, beyond all comparison.',
    category: 'beauty'
  },
  {
    id: 34,
    arabic: 'الْغَفُورُ',
    transliteration: 'Al-Ghafoor',
    english: 'The Forgiving',
    meaning: 'The One who forgives the sins of His slaves.',
    explanation: 'Allah forgives sins and covers the faults of those who seek His forgiveness.',
    category: 'forgiveness'
  },
  {
    id: 35,
    arabic: 'الشَّكُورُ',
    transliteration: 'Ash-Shakoor',
    english: 'The Appreciative',
    meaning: 'The One who gives a lot of reward for a little obedience.',
    explanation: 'Allah appreciates and rewards even small acts of obedience with great rewards.',
    category: 'mercy'
  },
  {
    id: 36,
    arabic: 'الْعَلِيُّ',
    transliteration: 'Al-Ali',
    english: 'The Most High',
    meaning: 'The One who is clear from the attributes of the creatures.',
    explanation: 'Allah is exalted above all creation in His essence, attributes, and actions.',
    category: 'power'
  },
  {
    id: 37,
    arabic: 'الْكَبِيرُ',
    transliteration: 'Al-Kabeer',
    english: 'The Most Great',
    meaning: 'The One who is greater than everything in status.',
    explanation: 'Allah is the greatest in every aspect, surpassing all in majesty and grandeur.',
    category: 'power'
  },
  {
    id: 38,
    arabic: 'الْحَفِيظُ',
    transliteration: 'Al-Hafeedh',
    english: 'The Preserver',
    meaning: 'The One who protects whatever and whoever He willed to protect.',
    explanation: 'Allah preserves and protects His creation, maintaining the order of the universe.',
    category: 'protection'
  },
  {
    id: 39,
    arabic: 'الْمُقِيتُ',
    transliteration: 'Al-Muqeet',
    english: 'The Nourisher',
    meaning: 'The One who has the Power.',
    explanation: 'Allah provides nourishment and sustenance to all living beings.',
    category: 'sustenance'
  },
  {
    id: 40,
    arabic: 'الْحَسِيبُ',
    transliteration: 'Al-Haseeb',
    english: 'The Reckoner',
    meaning: 'The One who gives the satisfaction.',
    explanation: 'Allah is sufficient for those who rely on Him and will call everyone to account.',
    category: 'justice'
  },
  {
    id: 41,
    arabic: 'الْجَلِيلُ',
    transliteration: 'Al-Jaleel',
    english: 'The Majestic',
    meaning: 'The One who is attributed with greatness of Power and Glory of status.',
    explanation: 'Allah possesses absolute majesty and glory that inspires awe and reverence.',
    category: 'beauty'
  },
  {
    id: 42,
    arabic: 'الْكَرِيمُ',
    transliteration: 'Al-Kareem',
    english: 'The Generous',
    meaning: 'The One who is clear from abjectness.',
    explanation: 'Allah is infinitely generous, giving abundantly without being asked.',
    category: 'mercy'
  },
  {
    id: 43,
    arabic: 'الرَّقِيبُ',
    transliteration: 'Ar-Raqeeb',
    english: 'The Watchful',
    meaning: 'The One who watches the inside and outside of all creatures.',
    explanation: 'Allah constantly watches over all creation with complete awareness.',
    category: 'knowledge'
  },
  {
    id: 44,
    arabic: 'الْمُجِيبُ',
    transliteration: 'Al-Mujeeb',
    english: 'The Responsive',
    meaning: 'The One who answers the one in need if he asks Him and rescues the yearner if he calls upon Him.',
    explanation: 'Allah responds to the prayers and supplications of those who call upon Him.',
    category: 'mercy'
  },
  {
    id: 45,
    arabic: 'الْوَاسِعُ',
    transliteration: 'Al-Wasi',
    english: 'The All-Encompassing',
    meaning: 'The One who embraces everything and is not limited by place.',
    explanation: 'Allah\'s knowledge, mercy, and power encompass everything without limitation.',
    category: 'knowledge'
  },
  {
    id: 46,
    arabic: 'الْحَكِيمُ',
    transliteration: 'Al-Hakeem',
    english: 'The Wise',
    meaning: 'The One who is correct in His doings.',
    explanation: 'Allah acts with perfect wisdom in all His decisions and actions.',
    category: 'knowledge'
  },
  {
    id: 47,
    arabic: 'الْوَدُودُ',
    transliteration: 'Al-Wadood',
    english: 'The Loving',
    meaning: 'The One who loves His believing slaves and His believing slaves love Him.',
    explanation: 'Allah loves His righteous servants and they love Him in return.',
    category: 'mercy'
  },
  {
    id: 48,
    arabic: 'الْمَجِيدُ',
    transliteration: 'Al-Majeed',
    english: 'The Glorious',
    meaning: 'The One who is with perfect Power, High Status, Compassion, Generosity and Kindness.',
    explanation: 'Allah possesses perfect glory combining power, status, and kindness.',
    category: 'beauty'
  },
  {
    id: 49,
    arabic: 'الْبَاعِثُ',
    transliteration: 'Al-Ba\'ith',
    english: 'The Resurrector',
    meaning: 'The One who resurrects His slaves after death for reward and/or punishment.',
    explanation: 'Allah will resurrect all people on the Day of Judgment for accountability.',
    category: 'power'
  },
  {
    id: 50,
    arabic: 'الشَّهِيدُ',
    transliteration: 'Ash-Shaheed',
    english: 'The Witness',
    meaning: 'The One who nothing is absent from Him.',
    explanation: 'Allah witnesses everything and nothing is hidden from His sight.',
    category: 'knowledge'
  },
  // Names 51-99
  {
    id: 51,
    arabic: 'الْحَقُّ',
    transliteration: 'Al-Haqq',
    english: 'The Truth',
    meaning: 'The One who truly exists.',
    explanation: 'Allah is the ultimate truth and reality, the source of all truth.',
    category: 'knowledge'
  },
  {
    id: 52,
    arabic: 'الْوَكِيلُ',
    transliteration: 'Al-Wakeel',
    english: 'The Trustee',
    meaning: 'The One who gives the satisfaction and is relied upon.',
    explanation: 'Allah is the ultimate trustee who can be completely relied upon.',
    category: 'protection'
  },
  {
    id: 53,
    arabic: 'الْقَوِيُّ',
    transliteration: 'Al-Qawiyy',
    english: 'The Most Strong',
    meaning: 'The One with the complete Power.',
    explanation: 'Allah possesses absolute and perfect strength.',
    category: 'power'
  },
  {
    id: 54,
    arabic: 'الْمَتِينُ',
    transliteration: 'Al-Mateen',
    english: 'The Firm',
    meaning: 'The One with extreme Power which is un-interrupted and He does not get tired.',
    explanation: 'Allah\'s power is firm, constant, and never diminishes.',
    category: 'power'
  },
  {
    id: 55,
    arabic: 'الْوَلِيُّ',
    transliteration: 'Al-Waliyy',
    english: 'The Protecting Friend',
    meaning: 'The One who supports and protects.',
    explanation: 'Allah is the guardian and protector of the believers.',
    category: 'protection'
  },
  {
    id: 56,
    arabic: 'الْحَمِيدُ',
    transliteration: 'Al-Hameed',
    english: 'The Praiseworthy',
    meaning: 'The One who is praised and is worthy of praise.',
    explanation: 'Allah deserves all praise for His perfect attributes and actions.',
    category: 'beauty'
  },
  {
    id: 57,
    arabic: 'الْمُحْصِي',
    transliteration: 'Al-Muhsee',
    english: 'The Counter',
    meaning: 'The One who the count of things are known to Him.',
    explanation: 'Allah knows the exact count and measure of everything.',
    category: 'knowledge'
  },
  {
    id: 58,
    arabic: 'الْمُبْدِئُ',
    transliteration: 'Al-Mubdi',
    english: 'The Originator',
    meaning: 'The One who started the human being.',
    explanation: 'Allah originates and begins all creation.',
    category: 'creation'
  },
  {
    id: 59,
    arabic: 'الْمُعِيدُ',
    transliteration: 'Al-Mu\'eed',
    english: 'The Restorer',
    meaning: 'The One who brings back the creatures after death.',
    explanation: 'Allah will restore and recreate all beings for the afterlife.',
    category: 'creation'
  },
  {
    id: 60,
    arabic: 'الْمُحْيِي',
    transliteration: 'Al-Muhyee',
    english: 'The Giver of Life',
    meaning: 'The One who took out a living human from semen that does not have a soul.',
    explanation: 'Allah gives life to all living beings.',
    category: 'creation'
  },
  {
    id: 61,
    arabic: 'الْمُمِيتُ',
    transliteration: 'Al-Mumeet',
    english: 'The Taker of Life',
    meaning: 'The One who renders the living dead.',
    explanation: 'Allah determines when life ends for all creatures.',
    category: 'power'
  },
  {
    id: 62,
    arabic: 'الْحَيُّ',
    transliteration: 'Al-Hayy',
    english: 'The Ever Living',
    meaning: 'The One attributed with a life that is unlike our life and is not that of a combination of soul, flesh or blood.',
    explanation: 'Allah is eternally alive with perfect life.',
    category: 'power'
  },
  {
    id: 63,
    arabic: 'الْقَيُّومُ',
    transliteration: 'Al-Qayyoom',
    english: 'The Self-Existing',
    meaning: 'The One who remains and does not end.',
    explanation: 'Allah is self-sustaining and sustains all existence.',
    category: 'power'
  },
  {
    id: 64,
    arabic: 'الْوَاجِدُ',
    transliteration: 'Al-Wajid',
    english: 'The Finder',
    meaning: 'The Rich who is never poor.',
    explanation: 'Allah finds and possesses everything, lacking nothing.',
    category: 'power'
  },
  {
    id: 65,
    arabic: 'الْمَاجِدُ',
    transliteration: 'Al-Majid',
    english: 'The Noble',
    meaning: 'The One who is Glorious.',
    explanation: 'Allah possesses perfect nobility and glory.',
    category: 'beauty'
  },
  {
    id: 66,
    arabic: 'الْوَاحِدُ',
    transliteration: 'Al-Wahid',
    english: 'The One',
    meaning: 'The One without a partner.',
    explanation: 'Allah is absolutely one and unique, without any partners.',
    category: 'power'
  },
  {
    id: 67,
    arabic: 'الْأَحَد',
    transliteration: 'Al-Ahad',
    english: 'The Unique',
    meaning: 'The One who is unique in His essence and attributes.',
    explanation: 'Allah is uniquely one, indivisible and incomparable.',
    category: 'power'
  },
  {
    id: 68,
    arabic: 'الصَّمَدُ',
    transliteration: 'As-Samad',
    english: 'The Eternal',
    meaning: 'The Master who is relied upon in matters and reverted to in ones needs.',
    explanation: 'Allah is eternal and self-sufficient, upon whom all depend.',
    category: 'power'
  },
  {
    id: 69,
    arabic: 'الْقَادِرُ',
    transliteration: 'Al-Qadir',
    english: 'The All Powerful',
    meaning: 'The One attributed with Power.',
    explanation: 'Allah has complete power over all things.',
    category: 'power'
  },
  {
    id: 70,
    arabic: 'الْمُقْتَدِرُ',
    transliteration: 'Al-Muqtadir',
    english: 'The Creator of All Power',
    meaning: 'The One who has the power to turn the entities.',
    explanation: 'Allah creates and controls all forms of power.',
    category: 'power'
  },
  {
    id: 71,
    arabic: 'الْمُقَدِّمُ',
    transliteration: 'Al-Muqaddim',
    english: 'The Expediter',
    meaning: 'The One who puts things in their right place.',
    explanation: 'Allah advances and promotes according to His wisdom.',
    category: 'guidance'
  },
  {
    id: 72,
    arabic: 'الْمُؤَخِّرُ',
    transliteration: 'Al-Mu\'akhkhir',
    english: 'The Delayer',
    meaning: 'The One who delays things to their right time.',
    explanation: 'Allah delays things according to His perfect timing.',
    category: 'guidance'
  },
  {
    id: 73,
    arabic: 'الْأَوَّلُ',
    transliteration: 'Al-Awwal',
    english: 'The First',
    meaning: 'The One whose Existence is without a beginning.',
    explanation: 'Allah existed before everything and has no beginning.',
    category: 'power'
  },
  {
    id: 74,
    arabic: 'الْآخِرُ',
    transliteration: 'Al-Akhir',
    english: 'The Last',
    meaning: 'The One whose Existence is without an end.',
    explanation: 'Allah will exist after everything and has no end.',
    category: 'power'
  },
  {
    id: 75,
    arabic: 'الظَّاهِرُ',
    transliteration: 'Az-Zahir',
    english: 'The Manifest',
    meaning: 'The One that nothing is above Him and He is the Highest.',
    explanation: 'Allah is manifest through His signs and creation.',
    category: 'knowledge'
  },
  {
    id: 76,
    arabic: 'الْبَاطِنُ',
    transliteration: 'Al-Batin',
    english: 'The Hidden',
    meaning: 'The One that nothing is underneath Him and He is the Lowest.',
    explanation: 'Allah is hidden from direct perception but closer than everything.',
    category: 'knowledge'
  },
  {
    id: 77,
    arabic: 'الْوَالِي',
    transliteration: 'Al-Walee',
    english: 'The Governor',
    meaning: 'The One who owns things and manages them.',
    explanation: 'Allah governs and manages all affairs of creation.',
    category: 'power'
  },
  {
    id: 78,
    arabic: 'الْمُتَعَالِي',
    transliteration: 'Al-Muta\'ali',
    english: 'The Supreme',
    meaning: 'The One who is clear from the attributes of the creation.',
    explanation: 'Allah is supremely exalted above all creation.',
    category: 'power'
  },
  {
    id: 79,
    arabic: 'الْبَرُّ',
    transliteration: 'Al-Barr',
    english: 'The Beneficent',
    meaning: 'The One who is kind to His creatures, who covered them with His sustenance and specified whoever He willed among them by His support, protection, and special mercy.',
    explanation: 'Allah is kind and beneficent to all His creation.',
    category: 'mercy'
  },
  {
    id: 80,
    arabic: 'التَّوَّابُ',
    transliteration: 'At-Tawwab',
    english: 'The Acceptor of Repentance',
    meaning: 'The One who grants repentance to whoever He willed among His creatures and accepts his repentance.',
    explanation: 'Allah accepts the repentance of those who turn to Him sincerely.',
    category: 'forgiveness'
  },
  {
    id: 81,
    arabic: 'الْمُنْتَقِمُ',
    transliteration: 'Al-Muntaqim',
    english: 'The Avenger',
    meaning: 'The One who victoriously prevails over His enemies and punishes them for their sins.',
    explanation: 'Allah takes just revenge against those who transgress His limits.',
    category: 'justice'
  },
  {
    id: 82,
    arabic: 'الْعَفُوُّ',
    transliteration: 'Al-Afuww',
    english: 'The Pardoner',
    meaning: 'The One who erases the sins by His grace.',
    explanation: 'Allah pardons and erases sins completely.',
    category: 'forgiveness'
  },
  {
    id: 83,
    arabic: 'الرَّؤُوفُ',
    transliteration: 'Ar-Ra\'oof',
    english: 'The Compassionate',
    meaning: 'The One with extreme Mercy.',
    explanation: 'Allah has intense compassion and mercy for His creation.',
    category: 'mercy'
  },
  {
    id: 84,
    arabic: 'مَالِكُ الْمُلْكِ',
    transliteration: 'Malik-ul-Mulk',
    english: 'Owner of All',
    meaning: 'The One who controls the Dominion and gives dominion to whoever He willed.',
    explanation: 'Allah owns and controls all dominion and sovereignty.',
    category: 'power'
  },
  {
    id: 85,
    arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: 'Dhul-Jalali-wal-Ikram',
    english: 'Lord of Glory and Honor',
    meaning: 'The One who deserves to be Exalted and not denied.',
    explanation: 'Allah possesses perfect majesty and honor.',
    category: 'beauty'
  },
  {
    id: 86,
    arabic: 'الْمُقْسِطُ',
    transliteration: 'Al-Muqsit',
    english: 'The Equitable One',
    meaning: 'The One who is Just in His judgment.',
    explanation: 'Allah is perfectly just and fair in all His dealings.',
    category: 'justice'
  },
  {
    id: 87,
    arabic: 'الْجَامِعُ',
    transliteration: 'Al-Jami',
    english: 'The Gatherer',
    meaning: 'The One who gathers the creatures on a day that there is no doubt about, that is the Day of Judgment.',
    explanation: 'Allah will gather all creation for the Day of Judgment.',
    category: 'power'
  },
  {
    id: 88,
    arabic: 'الْغَنِيُّ',
    transliteration: 'Al-Ghaniyy',
    english: 'The Rich One',
    meaning: 'The One who does not need the creation.',
    explanation: 'Allah is completely self-sufficient and needs nothing.',
    category: 'power'
  },
  {
    id: 89,
    arabic: 'الْمُغْنِي',
    transliteration: 'Al-Mughni',
    english: 'The Enricher',
    meaning: 'The One who satisfies the necessities of the creatures.',
    explanation: 'Allah enriches and fulfills the needs of His creation.',
    category: 'sustenance'
  },
  {
    id: 90,
    arabic: 'الْمَانِعُ',
    transliteration: 'Al-Mani',
    english: 'The Preventer of Harm',
    meaning: 'The One who prevents harm according to wisdom.',
    explanation: 'Allah prevents what He wills according to His wisdom.',
    category: 'protection'
  },
  {
    id: 91,
    arabic: 'الضَّارُّ',
    transliteration: 'Ad-Darr',
    english: 'The Creator of The Harmful',
    meaning: 'The One who makes harm reach to whoever He willed.',
    explanation: 'Allah creates both benefit and harm according to His wisdom.',
    category: 'power'
  },
  {
    id: 92,
    arabic: 'النَّافِعُ',
    transliteration: 'An-Nafi',
    english: 'The Creator of Good',
    meaning: 'The One who gives benefits to whoever He willed.',
    explanation: 'Allah creates and provides all benefits and good things.',
    category: 'sustenance'
  },
  {
    id: 93,
    arabic: 'النُّورُ',
    transliteration: 'An-Noor',
    english: 'The Light',
    meaning: 'The One who guides.',
    explanation: 'Allah is the light that illuminates and guides creation.',
    category: 'guidance'
  },
  {
    id: 94,
    arabic: 'الْهَادِي',
    transliteration: 'Al-Hadi',
    english: 'The Guide',
    meaning: 'The One whom with His Guidance His believers were guided, and with His Guidance the living beings are guided to what is beneficial for them and protected from what is harmful to them.',
    explanation: 'Allah guides those who seek guidance to the right path.',
    category: 'guidance'
  },
  {
    id: 95,
    arabic: 'الْبَدِيعُ',
    transliteration: 'Al-Badee',
    english: 'The Originator',
    meaning: 'The One who created the creation and formed it without any preceding example.',
    explanation: 'Allah creates in unique and unprecedented ways.',
    category: 'creation'
  },
  {
    id: 96,
    arabic: 'الْبَاقِي',
    transliteration: 'Al-Baqi',
    english: 'The Everlasting One',
    meaning: 'The One that the state of non-existence is impossible for Him.',
    explanation: 'Allah is eternal and will never cease to exist.',
    category: 'power'
  },
  {
    id: 97,
    arabic: 'الْوَارِثُ',
    transliteration: 'Al-Warith',
    english: 'The Inheritor of All',
    meaning: 'The One whose Existence remains.',
    explanation: 'Allah inherits all things when everything else perishes.',
    category: 'power'
  },
  {
    id: 98,
    arabic: 'الرَّشِيدُ',
    transliteration: 'Ar-Rasheed',
    english: 'The Righteous Teacher',
    meaning: 'The One who guides.',
    explanation: 'Allah guides to righteousness and right conduct.',
    category: 'guidance'
  },
  {
    id: 99,
    arabic: 'الصَّبُورُ',
    transliteration: 'As-Saboor',
    english: 'The Patient One',
    meaning: 'The One who does not quickly punish the sinners.',
    explanation: 'Allah is patient and does not hasten to punish, giving time for repentance.',
    category: 'mercy'
  }
];

const STORAGE_KEY = 'beautiful-names-data';

export function useNamesStore() {
  const [state, setState] = useState<NamesState>({
    names: BEAUTIFUL_NAMES,
    favorites: [],
    learningProgress: [],
    quizResults: [],
    preferences: DEFAULT_PREFERENCES,
    searchQuery: '',
    selectedCategory: '',
    currentMode: 'grid',
    dailyName: null,
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
          favorites: parsedData.favorites || [],
          learningProgress: parsedData.learningProgress || [],
          quizResults: parsedData.quizResults || [],
          preferences: { ...DEFAULT_PREFERENCES, ...parsedData.preferences },
        }));
      }
    } catch (error) {
      console.error('Error loading Names data:', error);
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    try {
      const dataToSave = {
        favorites: state.favorites,
        learningProgress: state.learningProgress,
        quizResults: state.quizResults,
        preferences: state.preferences,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving Names data:', error);
    }
  }, [state.favorites, state.learningProgress, state.quizResults, state.preferences]);

  // Set daily name
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyIndex = dayOfYear % BEAUTIFUL_NAMES.length;
    setState(prev => ({ ...prev, dailyName: BEAUTIFUL_NAMES[dailyIndex] }));
  }, []);

  // Filter names based on search and category
  const getFilteredNames = useCallback(() => {
    let filtered = state.names;

    // Search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(name =>
        name.arabic.includes(state.searchQuery) ||
        name.transliteration.toLowerCase().includes(query) ||
        name.english.toLowerCase().includes(query) ||
        name.meaning.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(name => name.category === state.selectedCategory);
    }

    return filtered;
  }, [state.names, state.searchQuery, state.selectedCategory]);

  // Toggle favorite
  const toggleFavorite = useCallback((nameId: number) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(nameId)
        ? prev.favorites.filter(id => id !== nameId)
        : [...prev.favorites, nameId],
    }));
  }, []);

  // Update learning progress
  const updateLearningProgress = useCallback((nameId: number, memorized: boolean, correct?: boolean) => {
    setState(prev => ({
      ...prev,
      learningProgress: [
        ...prev.learningProgress.filter(p => p.nameId !== nameId),
        {
          nameId,
          memorized,
          attempts: (prev.learningProgress.find(p => p.nameId === nameId)?.attempts || 0) + 1,
          correctAnswers: (prev.learningProgress.find(p => p.nameId === nameId)?.correctAnswers || 0) + (correct ? 1 : 0),
          lastStudied: new Date().toISOString(),
          difficulty: memorized ? 'easy' : 'medium',
        },
      ],
    }));
  }, []);

  // Add quiz result
  const addQuizResult = useCallback((result: Omit<QuizResult, 'id'>) => {
    setState(prev => ({
      ...prev,
      quizResults: [
        ...prev.quizResults,
        {
          ...result,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences },
    }));
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Set category filter
  const setSelectedCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  // Set current mode
  const setCurrentMode = useCallback((mode: 'grid' | 'flashcard' | 'quiz') => {
    setState(prev => ({ ...prev, currentMode: mode }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      selectedCategory: '',
    }));
  }, []);

  return {
    // State
    ...state,
    
    // Computed
    filteredNames: getFilteredNames(),
    favoriteNames: state.names.filter(name => state.favorites.includes(name.id)),
    memorizedCount: state.learningProgress.filter(p => p.memorized).length,
    totalStudyTime: state.quizResults.reduce((acc, result) => acc + result.timeSpent, 0),
    averageScore: state.quizResults.length > 0 
      ? state.quizResults.reduce((acc, result) => acc + (result.score / result.totalQuestions), 0) / state.quizResults.length * 100
      : 0,
    
    // Actions
    toggleFavorite,
    updateLearningProgress,
    addQuizResult,
    updatePreferences,
    setSearchQuery,
    setSelectedCategory,
    setCurrentMode,
    clearFilters,
    
    // Helper functions
    isFavorited: (nameId: number) => state.favorites.includes(nameId),
    isMemorized: (nameId: number) => state.learningProgress.find(p => p.nameId === nameId)?.memorized || false,
    getLearningProgress: (nameId: number) => state.learningProgress.find(p => p.nameId === nameId),
    getNameById: (id: number) => state.names.find(name => name.id === id),
    getNamesByCategory: (category: string) => state.names.filter(name => name.category === category),
  };
}
