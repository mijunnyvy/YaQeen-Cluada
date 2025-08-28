'use client';

import { useState, useEffect, useCallback } from 'react';
import { AI_CONFIG } from '../config/ai-config';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: string[];
  mode?: ChatMode;
  isBookmarked?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export type ChatMode = 'general' | 'guidance' | 'quran' | 'fiqh' | 'adkar' | 'stories';

export interface ChatPreferences {
  language: 'english' | 'arabic' | 'both';
  fontSize: 'small' | 'medium' | 'large';
  enableVoice: boolean;
  enableNotifications: boolean;
  autoScroll: boolean;
  showSources: boolean;
  madhhab: 'hanafi' | 'maliki' | 'shafii' | 'hanbali' | 'general';
}

export interface ChatState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  currentMode: ChatMode;
  preferences: ChatPreferences;
  isLoading: boolean;
  error: string | null;
  bookmarkedMessages: ChatMessage[];
  dailyTip: string | null;
}

const DEFAULT_PREFERENCES: ChatPreferences = {
  language: 'english',
  fontSize: 'medium',
  enableVoice: false,
  enableNotifications: false,
  autoScroll: true,
  showSources: true,
  madhhab: 'general',
};

const CHAT_MODES = {
  general: {
    name: 'General Islamic Knowledge',
    description: 'Ask any Islamic question - Quran, Hadith, Fiqh, History',
    icon: '🕌',
    prompt: 'I am an Islamic AI assistant. I can help you with questions about Islam, Quran, Hadith, Fiqh, Islamic history, and more. How can I assist you today?'
  },
  guidance: {
    name: 'Daily Guidance',
    description: 'Motivational reminders and spiritual guidance',
    icon: '🌟',
    prompt: 'I am here to provide you with Islamic guidance and motivation. Share what\'s on your mind and I\'ll offer spiritual advice based on Quran and Sunnah.'
  },
  quran: {
    name: 'Quran & Tafsir',
    description: 'Quranic verses explanation and interpretation',
    icon: '📖',
    prompt: 'I specialize in explaining Quranic verses and their meanings. You can ask about specific verses, themes, or request tafsir explanations.'
  },
  fiqh: {
    name: 'Fiqh & Rulings',
    description: 'Islamic jurisprudence and practical rulings',
    icon: '⚖️',
    prompt: 'I can help with Islamic jurisprudence questions and practical rulings. Please specify your madhhab preference if you have one.'
  },
  adkar: {
    name: 'Adkar & Duas',
    description: 'Supplications and remembrance of Allah',
    icon: '🤲',
    prompt: 'I can help you with Islamic supplications (duas) and remembrance (adkar) for various occasions and needs.'
  },
  stories: {
    name: 'Islamic Stories',
    description: 'Stories from Quran, Hadith, and Islamic history',
    icon: '📚',
    prompt: 'I can share Islamic stories from the Quran, Hadith, and Islamic history. What kind of story would you like to hear?'
  }
};

// Comprehensive Islamic knowledge database for AI responses
const ISLAMIC_RESPONSES = {
  greetings: [
    "Assalamu Alaikum! Welcome to your Islamic AI assistant. How can I help you with your Islamic questions today?",
    "Peace be upon you! I'm here to assist you with Islamic knowledge. What would you like to learn about?",
    "Assalamu Alaikum wa Rahmatullahi wa Barakatuh! How may I assist you in your Islamic journey today?"
  ],
  general: {
    "what is islam": "Islam is a monotheistic religion that teaches that Muhammad ﷺ is a messenger of God. The word Islam means 'submission to the will of God'. Muslims believe that God is one (Tawhid) and that Muhammad ﷺ is His final messenger.\n\n**Source:** Quran 3:19 - 'Indeed, the religion in the sight of Allah is Islam.'",
    "five pillars": "The Five Pillars of Islam are:\n\n1. **Shahada** - Declaration of faith: 'There is no god but Allah, and Muhammad is His messenger'\n2. **Salah** - Five daily prayers\n3. **Zakat** - Obligatory charity (2.5% of wealth annually)\n4. **Sawm** - Fasting during Ramadan\n5. **Hajj** - Pilgrimage to Mecca (once in lifetime if able)\n\n**Source:** Hadith - Bukhari and Muslim",
    "prayer times": "Muslims pray five times daily:\n\n1. **Fajr** - Dawn prayer (before sunrise)\n2. **Dhuhr** - Midday prayer (after sun passes zenith)\n3. **Asr** - Afternoon prayer (late afternoon)\n4. **Maghrib** - Sunset prayer (just after sunset)\n5. **Isha** - Night prayer (after twilight)\n\n**Source:** Quran 17:78",
    "prophet muhammad": "Prophet Muhammad ﷺ (570-632 CE) is the final messenger of Allah. He was born in Mecca, received the first revelation at age 40, and spent 23 years spreading Islam. He is known for his honesty, compassion, and perfect character.\n\n**Source:** Quran 33:40 - 'Muhammad is the Messenger of Allah and the last of the prophets.'",
    "quran": "The Quran is the holy book of Islam, revealed to Prophet Muhammad ﷺ over 23 years. It contains 114 chapters (surahs) and is believed to be the direct word of Allah. Muslims believe it is preserved in its original form.\n\n**Source:** Quran 15:9 - 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.'",
    "tawhid": "Tawhid is the fundamental concept of monotheism in Islam - the belief in the absolute oneness and uniqueness of Allah. It means Allah has no partners, equals, or associates in His divinity.\n\n**Source:** Quran 112:1-4 - 'Say: He is Allah, the One! Allah, the Eternal, Absolute; He begets not, nor is He begotten; And there is none like unto Him.'"
  },
  duas: {
    "morning dua": "**Morning Dua:**\n\nأَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ\n\n*Asbahna wa asbahal-mulku lillahi rabbil-alameen*\n\n'We have reached the morning and at this very time unto Allah, Lord of the worlds, belongs all sovereignty.'\n\n**Source:** Abu Dawud",
    "evening dua": "**Evening Dua:**\n\nأَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ\n\n*Amsayna wa amsal-mulku lillahi rabbil-alameen*\n\n'We have reached the evening and at this very time unto Allah, Lord of the worlds, belongs all sovereignty.'\n\n**Source:** Abu Dawud",
    "before eating": "**Before Eating:**\n\nبِسْمِ اللَّهِ\n\n*Bismillah*\n\n'In the name of Allah'\n\n**Source:** Bukhari and Muslim",
    "after eating": "**After Eating:**\n\nالْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ\n\n*Alhamdulillahil-ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minnee wa la quwwah*\n\n'Praise be to Allah who has fed me this and provided it for me without any might or power from me.'\n\n**Source:** Abu Dawud and Tirmidhi"
  },
  quran_verses: {
    "ayat al-kursi": "**Ayat al-Kursi (Quran 2:255):**\n\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\n\n'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.'\n\nThis verse speaks of Allah's absolute sovereignty, knowledge, and power over all creation.\n\n**Source:** Quran 2:255",
    "surah al-fatiha": "**Surah Al-Fatiha (The Opening):**\n\nThis is the first chapter of the Quran and is recited in every unit of prayer. It contains praise of Allah, seeking guidance, and asking for the straight path.\n\nKey themes: Praise of Allah, seeking guidance, avoiding misguidance.\n\n**Source:** Quran 1:1-7",
    "surah al-ikhlas": "**Surah Al-Ikhlas (The Sincerity):**\n\nقُلْ هُوَ اللَّهُ أَحَدٌ\n\n'Say: He is Allah, the One!'\n\nThis chapter defines the absolute monotheism of Islam and is said to be equivalent to one-third of the Quran.\n\n**Source:** Quran 112:1-4"
  },
  fiqh: {
    "wudu steps": "**Steps of Wudu (Ablution):**\n\n1. Intention (Niyyah)\n2. Say 'Bismillah'\n3. Wash hands three times\n4. Rinse mouth three times\n5. Rinse nose three times\n6. Wash face three times\n7. Wash arms to elbows three times\n8. Wipe head once\n9. Wash feet to ankles three times\n\n**Source:** Quran 5:6",
    "prayer conditions": "**Conditions for Valid Prayer:**\n\n1. **Purity** - Wudu and clean clothes/place\n2. **Time** - Praying within the prescribed time\n3. **Qibla** - Facing the direction of Mecca\n4. **Covering** - Proper dress code (Awrah)\n5. **Intention** - Clear intention for the specific prayer\n\n**Source:** Various Hadith collections",
    "zakat calculation": "**Zakat Calculation:**\n\n- **Rate:** 2.5% of wealth held for one lunar year\n- **Nisab:** Minimum threshold (equivalent to 85g gold)\n- **Eligible wealth:** Cash, gold, silver, business inventory\n- **Recipients:** Poor, needy, collectors, new Muslims, slaves, debtors, in Allah's path, travelers\n\n**Source:** Quran 9:60"
  },
  stories: {
    "prophet yusuf": "**Story of Prophet Yusuf (Joseph):**\n\nProphet Yusuf's story teaches patience, forgiveness, and trust in Allah. Despite being thrown in a well by his brothers, sold into slavery, and imprisoned, he remained faithful and eventually became a minister in Egypt.\n\nKey lessons: Patience in trials, forgiveness, divine wisdom in hardships.\n\n**Source:** Quran, Surah Yusuf (Chapter 12)",
    "people of the cave": "**People of the Cave (Ashab al-Kahf):**\n\nYoung believers who fled persecution and slept in a cave for centuries by Allah's protection. Their story teaches faith, divine protection, and the power of sincere belief.\n\nKey lessons: Standing firm in faith, Allah's protection, resurrection.\n\n**Source:** Quran 18:9-26"
  },
  guidance: {
    "patience": "**On Patience (Sabr):**\n\nPatience is highly valued in Islam. Allah says: 'And give good tidings to the patient, Who, when disaster strikes them, say, \"Indeed we belong to Allah, and indeed to Him we will return.\"'\n\nPatience includes: Patience in worship, patience in avoiding sins, patience in trials.\n\n**Source:** Quran 2:155-157",
    "gratitude": "**On Gratitude (Shukr):**\n\n'If you are grateful, I will certainly give you more.' Gratitude is both a heart condition and action. It includes recognizing Allah's blessings, feeling thankful, and expressing thanks through worship and good deeds.\n\n**Source:** Quran 14:7",
    "seeking forgiveness": "**Seeking Forgiveness (Istighfar):**\n\nاللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ\n\n'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant.'\n\nRegular istighfar brings peace, forgiveness, and Allah's mercy.\n\n**Source:** Bukhari"
  }
};

const STORAGE_KEY = 'islamic-chat-data';

export function useChatStore() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversationId: null,
    currentMode: 'general',
    preferences: DEFAULT_PREFERENCES,
    isLoading: false,
    error: null,
    bookmarkedMessages: [],
    dailyTip: null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          conversations: parsedData.conversations || [],
          bookmarkedMessages: parsedData.bookmarkedMessages || [],
          preferences: { ...DEFAULT_PREFERENCES, ...parsedData.preferences },
        }));
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    try {
      const dataToSave = {
        conversations: state.conversations,
        bookmarkedMessages: state.bookmarkedMessages,
        preferences: state.preferences,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  }, [state.conversations, state.bookmarkedMessages, state.preferences]);

  // Set daily tip
  useEffect(() => {
    const tips = [
      "Remember Allah often. The Prophet ﷺ said: 'The example of the one who remembers his Lord and the one who does not is like that of the living and the dead.' - Bukhari",
      "Start your day with Bismillah. Everything that begins with the name of Allah is blessed.",
      "Seek knowledge from the cradle to the grave. The Prophet ﷺ said: 'Seek knowledge, for seeking knowledge is worship.' - Tabarani",
      "Be kind to your parents. Paradise lies at the feet of your mother. - Ahmad",
      "Give charity, even if it's just a smile. The Prophet ﷺ said: 'Your smile for your brother is charity.' - Tirmidhi"
    ];
    
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % tips.length;
    setState(prev => ({ ...prev, dailyTip: tips[tipIndex] }));
  }, []);

  // Create new conversation
  const createConversation = useCallback((mode: ChatMode = 'general') => {
    const newConversation: ChatConversation = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Ensure unique ID
      title: 'New Chat',
      messages: [],
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
      currentConversationId: newConversation.id,
      currentMode: mode,
      error: null, // Clear any existing errors
    }));

    return newConversation.id;
  }, []);

  // Send message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create conversation if none exists
      let conversationId = state.currentConversationId;
      if (!conversationId) {
        conversationId = createConversation(state.currentMode);
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        role: 'user',
        timestamp: new Date().toISOString(),
        mode: state.currentMode,
      };

      // Update conversation with user message first
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                title: conv.messages.length === 0 ? generateChatTitle(content) : conv.title,
                updatedAt: new Date().toISOString(),
              }
            : conv
        ),
      }));

      // Get AI response from free API (with proper await handling)
      const aiResponse = await getAIResponse(content, state.currentMode);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sources: aiResponse.sources,
        mode: state.currentMode,
      };

      // Update conversation with AI response
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                updatedAt: new Date().toISOString(),
              }
            : conv
        ),
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send message. Please try again.',
      }));
    }
  }, [state.currentConversationId, state.currentMode, createConversation]);

  // Generate chat title from first message
  const generateChatTitle = (content: string) => {
    const words = content.trim().split(' ');
    if (words.length <= 4) {
      return content;
    }
    return words.slice(0, 4).join(' ') + '...';
  };

  // Get AI response from APIs (Gemini primary)
  const getAIResponse = async (message: string, mode: ChatMode) => {
    try {
      // Try APIs in order of preference

      // 1. Try Google Gemini API (Primary - Excellent for Islamic content)
      if (AI_CONFIG.GEMINI_API_KEY) {
        try {
          const geminiResponse = await fetch(`${AI_CONFIG.ENDPOINTS.GEMINI}?key=${AI_CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `${getSystemPrompt(mode)}\n\nUser: ${message}\n\nAssistant:`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1000,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            }),
          });

          if (geminiResponse.ok) {
            const data = await geminiResponse.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              return {
                content: content.trim(),
                sources: getSourcesForMode(mode)
              };
            }
          }
        } catch (geminiError) {
          console.log('Gemini API error, trying fallback...', geminiError);
        }
      }

      // 2. Try Groq API (Backup)
      if (AI_CONFIG.GROQ_API_KEY) {
        try {
          const groqResponse = await fetch(AI_CONFIG.ENDPOINTS.GROQ, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AI_CONFIG.GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: AI_CONFIG.MODELS.GROQ,
              messages: [
                {
                  role: 'system',
                  content: getSystemPrompt(mode)
                },
                {
                  role: 'user',
                  content: message
                }
              ],
              max_tokens: 1000,
              temperature: 0.7
            }),
          });

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            return {
              content: data.choices[0]?.message?.content || generateIslamicResponse(message.toLowerCase(), mode).content,
              sources: getSourcesForMode(mode)
            };
          }
        } catch (groqError) {
          console.log('Groq API not available, trying next fallback...');
        }
      }

      // 3. Try Hugging Face Inference API (Final backup)
      if (AI_CONFIG.HUGGING_FACE_TOKEN) {
        try {
          const hfResponse = await fetch(AI_CONFIG.ENDPOINTS.HUGGING_FACE, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AI_CONFIG.HUGGING_FACE_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: formatIslamicPrompt(message, mode),
              parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false
              }
            }),
          });

          if (hfResponse.ok) {
            const data = await hfResponse.json();
            return {
              content: data[0]?.generated_text || generateIslamicResponse(message.toLowerCase(), mode).content,
              sources: getSourcesForMode(mode)
            };
          }
        } catch (hfError) {
          console.log('Hugging Face API not available, using local responses...');
        }
      }

    } catch (error) {
      console.error('All APIs failed:', error);
    }

    // Fallback to enhanced local Islamic responses
    return await generateEnhancedIslamicResponse(message.toLowerCase(), mode);
  };

  // Get system prompt for different modes
  const getSystemPrompt = (mode: ChatMode) => {
    const prompts = {
      general: "You are an Islamic AI assistant with deep knowledge of Quran, Hadith, and Islamic teachings. Provide authentic, well-sourced answers about Islam. Always cite sources when possible.",
      guidance: "You are an Islamic spiritual guide. Provide compassionate, wise guidance based on Quran and Sunnah. Help users with their spiritual journey and life challenges from an Islamic perspective.",
      quran: "You are a Quran and Tafsir expert. Explain Quranic verses with proper context, interpretation, and scholarly commentary. Always provide verse references.",
      fiqh: "You are an Islamic jurisprudence expert. Provide clear, practical rulings based on authentic Islamic sources. Mention different scholarly opinions when relevant.",
      adkar: "You are an expert in Islamic supplications and remembrance. Provide authentic duas and adkar with Arabic text, transliteration, and meanings.",
      stories: "You are a storyteller of Islamic history and narratives. Share authentic stories from Quran, Hadith, and Islamic history with proper context and lessons."
    };
    return prompts[mode] || prompts.general;
  };

  // Format prompt for Islamic context
  const formatIslamicPrompt = (message: string, mode: ChatMode) => {
    const modePrompts = {
      general: `As an Islamic AI assistant, answer this question about Islam with authentic sources from Quran and Hadith: ${message}`,
      guidance: `Provide Islamic spiritual guidance and motivation for: ${message}`,
      quran: `Explain this Quranic topic with proper tafsir and context: ${message}`,
      fiqh: `Answer this Islamic jurisprudence question with proper rulings: ${message}`,
      adkar: `Provide Islamic supplications and remembrance for: ${message}`,
      stories: `Share an Islamic story or historical account about: ${message}`
    };
    return modePrompts[mode] || modePrompts.general;
  };

  // Get sources based on mode
  const getSourcesForMode = (mode: ChatMode) => {
    const sources = {
      general: ['Quran', 'Hadith'],
      guidance: ['Quran', 'Hadith', 'Islamic Scholars'],
      quran: ['Quran', 'Tafsir Ibn Kathir', 'Tafsir al-Jalalayn'],
      fiqh: ['Quran', 'Hadith', 'Fiqh Manuals'],
      adkar: ['Quran', 'Sahih Bukhari', 'Sahih Muslim'],
      stories: ['Quran', 'Hadith', 'Islamic History']
    };
    return sources[mode] || sources.general;
  };

  // Enhanced Islamic AI response generation
  const generateIslamicResponse = (query: string, mode: ChatMode) => {
    const lowerQuery = query.toLowerCase();

    // Greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('assalam') || lowerQuery.includes('peace')) {
      return {
        content: ISLAMIC_RESPONSES.greetings[Math.floor(Math.random() * ISLAMIC_RESPONSES.greetings.length)],
        sources: []
      };
    }

    // Mode-specific intelligent responses
    switch (mode) {
      case 'adkar':
        return handleAdkarQueries(lowerQuery);
      case 'quran':
        return handleQuranQueries(lowerQuery);
      case 'fiqh':
        return handleFiqhQueries(lowerQuery);
      case 'stories':
        return handleStoriesQueries(lowerQuery);
      case 'guidance':
        return handleGuidanceQueries(lowerQuery);
      default:
        return handleGeneralQueries(lowerQuery);
    }
  };

  // Helper functions for different modes
  const handleAdkarQueries = (query: string) => {
    if (query.includes('morning')) {
      return { content: ISLAMIC_RESPONSES.duas["morning dua"], sources: ['Abu Dawud'] };
    }
    if (query.includes('evening')) {
      return { content: ISLAMIC_RESPONSES.duas["evening dua"], sources: ['Abu Dawud'] };
    }
    if (query.includes('eating') || query.includes('food')) {
      return { content: ISLAMIC_RESPONSES.duas["before eating"], sources: ['Bukhari', 'Muslim'] };
    }
    if (query.includes('after eating') || query.includes('finished eating')) {
      return { content: ISLAMIC_RESPONSES.duas["after eating"], sources: ['Abu Dawud', 'Tirmidhi'] };
    }
    return {
      content: "I can help you with various Islamic supplications (duas) and remembrance (adkar). You can ask about:\n\n• Morning and evening adkar\n• Duas before and after eating\n• Prayers for travel, sleep, and daily activities\n• Istighfar (seeking forgiveness)\n• Dhikr for different occasions\n\nWhat specific dua or adkar would you like to learn?",
      sources: []
    };
  };

  const handleQuranQueries = (query: string) => {
    if (query.includes('ayat al-kursi') || query.includes('kursi')) {
      return { content: ISLAMIC_RESPONSES.quran_verses["ayat al-kursi"], sources: ['Quran 2:255'] };
    }
    if (query.includes('fatiha') || query.includes('opening')) {
      return { content: ISLAMIC_RESPONSES.quran_verses["surah al-fatiha"], sources: ['Quran 1:1-7'] };
    }
    if (query.includes('ikhlas') || query.includes('sincerity')) {
      return { content: ISLAMIC_RESPONSES.quran_verses["surah al-ikhlas"], sources: ['Quran 112:1-4'] };
    }
    return {
      content: "I can help explain Quranic verses and their meanings. You can ask about:\n\n• Specific verses or chapters (surahs)\n• Tafsir (interpretation) of verses\n• Themes in the Quran\n• Stories mentioned in the Quran\n• Guidance from specific verses\n\nWhich verse or chapter would you like to learn about?",
      sources: []
    };
  };

  const handleFiqhQueries = (query: string) => {
    if (query.includes('wudu') || query.includes('ablution')) {
      return { content: ISLAMIC_RESPONSES.fiqh["wudu steps"], sources: ['Quran 5:6'] };
    }
    if (query.includes('prayer') && (query.includes('condition') || query.includes('requirement'))) {
      return { content: ISLAMIC_RESPONSES.fiqh["prayer conditions"], sources: ['Various Hadith'] };
    }
    if (query.includes('zakat')) {
      return { content: ISLAMIC_RESPONSES.fiqh["zakat calculation"], sources: ['Quran 9:60'] };
    }
    return {
      content: "I can help with Islamic jurisprudence (Fiqh) questions. You can ask about:\n\n• Prayer requirements and procedures\n• Purification (Wudu and Ghusl)\n• Zakat calculation and distribution\n• Fasting rules and exceptions\n• Hajj and Umrah procedures\n• Marriage and family law\n• Business and financial transactions\n\nWhat specific Fiqh question do you have?",
      sources: []
    };
  };

  const handleStoriesQueries = (query: string) => {
    if (query.includes('yusuf') || query.includes('joseph')) {
      return { content: ISLAMIC_RESPONSES.stories["prophet yusuf"], sources: ['Quran, Surah Yusuf'] };
    }
    if (query.includes('cave') || query.includes('ashab al-kahf')) {
      return { content: ISLAMIC_RESPONSES.stories["people of the cave"], sources: ['Quran 18:9-26'] };
    }
    return {
      content: "I can share Islamic stories from the Quran and authentic sources. You can ask about:\n\n• Stories of the Prophets\n• Companions of Prophet Muhammad ﷺ\n• Stories from the Quran\n• Historical Islamic events\n• Moral lessons from Islamic narratives\n\nWhich story would you like to hear?",
      sources: []
    };
  };

  const handleGuidanceQueries = (query: string) => {
    if (query.includes('patience') || query.includes('sabr')) {
      return { content: ISLAMIC_RESPONSES.guidance["patience"], sources: ['Quran 2:155-157'] };
    }
    if (query.includes('grateful') || query.includes('gratitude') || query.includes('shukr')) {
      return { content: ISLAMIC_RESPONSES.guidance["gratitude"], sources: ['Quran 14:7'] };
    }
    if (query.includes('forgiveness') || query.includes('istighfar')) {
      return { content: ISLAMIC_RESPONSES.guidance["seeking forgiveness"], sources: ['Bukhari'] };
    }
    return {
      content: "I'm here to provide Islamic guidance and spiritual advice. You can ask about:\n\n• Dealing with difficulties and trials\n• Building stronger faith (Iman)\n• Developing good character (Akhlaq)\n• Seeking Allah's forgiveness\n• Finding peace and contentment\n• Islamic perspective on life challenges\n\nWhat guidance are you seeking today?",
      sources: []
    };
  };

  const handleGeneralQueries = (query: string) => {
    // Check all categories for matches
    for (const [key, response] of Object.entries(ISLAMIC_RESPONSES.general)) {
      if (query.includes(key.replace(/\s+/g, ' '))) {
        return { content: response, sources: ['Quran', 'Hadith'] };
      }
    }

    // Default helpful response
    const modeInfo = CHAT_MODES[mode];
    return {
      content: `I understand you're asking about "${query}". As an Islamic AI assistant, I'm here to help with authentic Islamic knowledge.\n\n**I can assist you with:**\n\n🕌 **General Islam:** Basic beliefs, pillars, practices\n📖 **Quran & Tafsir:** Verse explanations and meanings\n⚖️ **Fiqh:** Islamic law and practical rulings\n🤲 **Duas & Adkar:** Supplications and remembrance\n📚 **Islamic Stories:** Prophets, companions, history\n🌟 **Spiritual Guidance:** Faith, character, life advice\n\n**Please rephrase your question or ask about any of these topics. I'm here to help with authentic Islamic knowledge based on Quran and Sunnah.**`,
      sources: []
    };
  };

  // Enhanced Islamic response with better matching
  const generateEnhancedIslamicResponse = (query: string, mode: ChatMode) => {
    // Add delay to simulate API thinking time
    return new Promise<{content: string, sources: string[]}>((resolve) => {
      setTimeout(() => {
        resolve(generateIslamicResponse(query, mode));
      }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
    });
  };

  // Switch conversation
  const switchConversation = useCallback((conversationId: string) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (conversation) {
      setState(prev => ({
        ...prev,
        currentConversationId: conversationId,
        currentMode: conversation.mode,
      }));
    }
  }, [state.conversations]);

  // Delete conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.filter(c => c.id !== conversationId),
      currentConversationId: prev.currentConversationId === conversationId ? null : prev.currentConversationId,
    }));
  }, []);

  // Set chat mode
  const setChatMode = useCallback((mode: ChatMode) => {
    setState(prev => ({ ...prev, currentMode: mode }));
  }, []);

  // Toggle bookmark message
  const toggleBookmark = useCallback((messageId: string) => {
    const conversation = state.conversations.find(c => c.id === state.currentConversationId);
    if (!conversation) return;

    const message = conversation.messages.find(m => m.id === messageId);
    if (!message) return;

    setState(prev => ({
      ...prev,
      bookmarkedMessages: prev.bookmarkedMessages.some(m => m.id === messageId)
        ? prev.bookmarkedMessages.filter(m => m.id !== messageId)
        : [...prev.bookmarkedMessages, { ...message, isBookmarked: true }],
    }));
  }, [state.conversations, state.currentConversationId]);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<ChatPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences },
    }));
  }, []);

  // Get current conversation
  const getCurrentConversation = useCallback(() => {
    return state.conversations.find(c => c.id === state.currentConversationId) || null;
  }, [state.conversations, state.currentConversationId]);

  return {
    // State
    ...state,
    
    // Computed
    currentConversation: getCurrentConversation(),
    chatModes: CHAT_MODES,
    
    // Actions
    createConversation,
    sendMessage,
    switchConversation,
    deleteConversation,
    setChatMode,
    toggleBookmark,
    updatePreferences,
    
    // Helper functions
    isMessageBookmarked: (messageId: string) => state.bookmarkedMessages.some(m => m.id === messageId),
    getConversationById: (id: string) => state.conversations.find(c => c.id === id),
    getRecentConversations: (limit: number = 10) => state.conversations.slice(0, limit),
  };
}
