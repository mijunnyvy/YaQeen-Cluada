'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Story {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  category: 'prophets' | 'sahaba' | 'history' | 'lessons' | 'quran';
  ageGroup: 'children' | 'youth' | 'adult' | 'all';
  theme: string[];
  content: string;
  contentArabic?: string;
  moral: string;
  moralArabic?: string;
  thumbnail: string;
  estimatedReadTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  relatedVerses?: string[];
  audioUrl?: string;
  author?: string;
  dateAdded: string;
  featured: boolean;
  tags: string[];
}

export interface ReadingProgress {
  storyId: string;
  progress: number; // percentage (0-100)
  lastPosition: number; // character position
  lastReadAt: string;
  completed: boolean;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'amiri' | 'noto-kufi' | 'inter' | 'arabic-ui';
  language: 'english' | 'arabic' | 'both';
  autoPlay: boolean;
  playbackSpeed: number;
  theme: 'light' | 'dark' | 'sepia';
}

export interface StoriesState {
  stories: Story[];
  bookmarks: string[];
  favorites: string[];
  readingProgress: ReadingProgress[];
  preferences: UserPreferences;
  searchQuery: string;
  selectedCategory: string;
  selectedAgeGroup: string;
  selectedTheme: string;
  currentStory: Story | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  fontSize: 'medium',
  fontFamily: 'amiri',
  language: 'english',
  autoPlay: false,
  playbackSpeed: 1.0,
  theme: 'light',
};

// Sample stories data
const SAMPLE_STORIES: Story[] = [
  {
    id: '1',
    title: 'Prophet Ibrahim and the Fire',
    titleArabic: 'النبي إبراهيم والنار',
    description: 'The story of Prophet Ibrahim\'s unwavering faith when thrown into the fire by King Nimrod.',
    category: 'prophets',
    ageGroup: 'all',
    theme: ['faith', 'courage', 'monotheism'],
    content: `Prophet Ibrahim (Abraham), peace be upon him, lived in a time when people worshipped idols made of stone and wood. His father, Azar, was a skilled craftsman who made these idols for the people to worship.

From a young age, Ibrahim questioned this practice. He would look at the stars, the moon, and the sun, wondering if they could be gods. But as each celestial body set, he realized they could not be divine, for God does not change or disappear.

One day, when the people had gone to a festival, Ibrahim entered the temple where the idols were kept. He took an axe and destroyed all the idols except the largest one. He placed the axe in the hands of the remaining idol.

When the people returned and saw the destruction, they were furious. "Who has done this to our gods?" they demanded.

Some said, "We heard a young man called Ibrahim speaking against them."

They brought Ibrahim before them and asked, "Did you do this to our gods, O Ibrahim?"

Ibrahim replied cleverly, "Rather, this large one among them did it. So ask them, if they can speak!"

The people realized their folly - if the idols could not speak or defend themselves, how could they be gods worthy of worship?

King Nimrod, the tyrant ruler, was enraged by Ibrahim's defiance. He ordered that a great fire be built and that Ibrahim be thrown into it.

As Ibrahim was about to be cast into the flames, the angel Jibril (Gabriel) came to him and asked, "O Ibrahim, do you need anything?"

Ibrahim replied, "From you, nothing. But from Allah, yes - He knows my condition."

Allah commanded the fire: "O fire, be coolness and safety for Ibrahim!"

The fire obeyed its Creator. Though the flames burned fiercely around him, Ibrahim felt only coolness and peace. He emerged from the fire unharmed, not even the smell of smoke upon his clothes.

This miracle amazed the people and proved that Allah alone is worthy of worship. Ibrahim's faith and trust in Allah had saved him, and his message of monotheism spread far and wide.`,
    moral: 'True faith in Allah provides protection and strength in the face of any trial. When we trust in Allah completely, He will never abandon us.',
    moralArabic: 'الإيمان الحقيقي بالله يوفر الحماية والقوة في مواجهة أي محنة. عندما نثق بالله تماماً، فإنه لن يتخلى عنا أبداً.',
    thumbnail: '🔥',
    estimatedReadTime: 8,
    difficulty: 'medium',
    relatedVerses: ['Quran 21:68-70', 'Quran 37:97-98'],
    author: 'Islamic Stories Collection',
    dateAdded: '2024-01-01',
    featured: true,
    tags: ['prophet', 'ibrahim', 'fire', 'faith', 'monotheism', 'miracle']
  },
  {
    id: '2',
    title: 'Abu Bakr: The Truthful Friend',
    titleArabic: 'أبو بكر الصديق',
    description: 'The story of Abu Bakr\'s unwavering loyalty and how he earned the title "As-Siddiq" (The Truthful).',
    category: 'sahaba',
    ageGroup: 'youth',
    theme: ['friendship', 'loyalty', 'truth'],
    content: `Abu Bakr ibn Abi Quhafa was known throughout Makkah as an honest and trustworthy merchant. He was a close friend of Muhammad (peace be upon him) even before Islam came to them.

When the Prophet Muhammad received his first revelation and began calling people to Islam, many rejected his message. Some mocked him, others opposed him violently. But when Abu Bakr heard about the revelation, his response was immediate and unwavering.

"If Muhammad says it, then it is true," Abu Bakr declared without hesitation.

This immediate acceptance of the Prophet's message, without asking for proof or signs, earned Abu Bakr the title "As-Siddiq" - The Truthful One.

Abu Bakr's faith was tested many times. When the Prophet told the people about his miraculous night journey (Isra and Mi'raj) from Makkah to Jerusalem and then to the heavens, many people found it hard to believe. Some even left Islam because of this.

The disbelievers came to Abu Bakr, thinking they could shake his faith. "Your friend claims he traveled to Jerusalem and back in one night, and even ascended to the heavens! Do you believe this?"

Abu Bakr replied firmly, "If he said it, then yes, I believe it. I believe him in matters far greater than this - I believe in the revelation that comes to him from heaven every day."

Abu Bakr's wealth was also a testament to his faith. He spent almost everything he owned in the path of Allah. He bought and freed many slaves who had accepted Islam and were being tortured by their masters. He supported the Muslim community financially and never hesitated to give when asked.

When the Muslims were preparing for the expedition to Tabuk, the Prophet asked for donations. Abu Bakr brought everything he owned.

The Prophet asked him, "O Abu Bakr, what have you left for your family?"

Abu Bakr replied, "I have left Allah and His Messenger for them."

This complete trust and sacrifice made Abu Bakr the closest companion to the Prophet. When the Prophet passed away, it was Abu Bakr who became the first Caliph, leading the Muslim community with the same wisdom and dedication he had shown as a friend.`,
    moral: 'True friendship means supporting each other in truth and righteousness. A real friend believes in you and stands by you through all difficulties.',
    moralArabic: 'الصداقة الحقيقية تعني دعم بعضنا البعض في الحق والصلاح. الصديق الحقيقي يؤمن بك ويقف معك في جميع الصعوبات.',
    thumbnail: '🤝',
    estimatedReadTime: 6,
    difficulty: 'medium',
    relatedVerses: ['Quran 9:40'],
    author: 'Islamic Stories Collection',
    dateAdded: '2024-01-02',
    featured: false,
    tags: ['abu-bakr', 'sahaba', 'friendship', 'loyalty', 'truth', 'sacrifice']
  },
  {
    id: '3',
    title: 'The Ant and Prophet Sulaiman',
    titleArabic: 'النملة والنبي سليمان',
    description: 'How a small ant taught us about wisdom, humility, and the importance of every creature in Allah\'s creation.',
    category: 'prophets',
    ageGroup: 'children',
    theme: ['wisdom', 'humility', 'nature'],
    content: `Prophet Sulaiman (Solomon), peace be upon him, was blessed by Allah with many gifts. He could understand the language of animals and birds, command the wind, and had power over the jinn. He was also given a great kingdom and immense wisdom.

One day, Prophet Sulaiman was traveling with his mighty army, which included humans, jinn, and birds. As they marched through a valley, they came upon a colony of ants.

A small ant, seeing the approaching army, called out to her fellow ants: "O ants! Enter your homes, lest Sulaiman and his army crush you while they do not realize it!"

Prophet Sulaiman, who could understand her words, smiled at what the ant had said. He was amazed by the wisdom and care this tiny creature showed for her community.

Instead of being offended that the ant thought he might harm them carelessly, Prophet Sulaiman was humble and grateful. He stopped his entire army and prayed to Allah:

"My Lord, inspire me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve. And admit me by Your mercy into the ranks of Your righteous servants."

The ant's words reminded Prophet Sulaiman that no matter how powerful he was, he should always be mindful of Allah's smaller creatures. Every being, no matter how tiny, has value in Allah's creation.

From that day forward, Prophet Sulaiman always remembered the lesson of the ant. He made sure that his army was careful not to harm any of Allah's creatures unnecessarily. He understood that true power comes with the responsibility to protect and care for all of creation.

The story spread throughout his kingdom, and people learned that wisdom can come from the most unexpected sources. Even the smallest ant had something important to teach the greatest king.`,
    moral: 'Wisdom and important lessons can come from anyone, even the smallest creatures. We should always be humble and listen to the world around us.',
    moralArabic: 'الحكمة والدروس المهمة يمكن أن تأتي من أي شخص، حتى من أصغر المخلوقات. يجب أن نكون متواضعين دائماً ونستمع للعالم من حولنا.',
    thumbnail: '🐜',
    estimatedReadTime: 4,
    difficulty: 'easy',
    relatedVerses: ['Quran 27:18-19'],
    author: 'Islamic Stories Collection',
    dateAdded: '2024-01-03',
    featured: true,
    tags: ['sulaiman', 'ant', 'wisdom', 'humility', 'nature', 'animals']
  },
  {
    id: '4',
    title: 'The Conquest of Makkah',
    titleArabic: 'فتح مكة',
    description: 'The peaceful conquest of Makkah and the Prophet\'s mercy towards his former enemies.',
    category: 'history',
    ageGroup: 'adult',
    theme: ['forgiveness', 'victory', 'mercy'],
    content: `In the eighth year after the Hijra, the Treaty of Hudaybiyyah was broken when the Banu Bakr tribe, allied with the Quraysh, attacked the Banu Khuza'ah, who were allied with the Muslims.

The Prophet Muhammad (peace be upon him) decided it was time to march on Makkah. He gathered an army of 10,000 Muslims - the largest force ever assembled in Arabia at that time.

As they approached Makkah, the Prophet ordered his army to light fires on the hills surrounding the city. The sight of thousands of fires in the darkness struck fear into the hearts of the Makkans, who realized they could not resist such a force.

Abu Sufyan, one of the leaders of Makkah and a former enemy of Islam, came out to negotiate. When he saw the size of the Muslim army and the discipline of the soldiers, he was amazed.

The Prophet received Abu Sufyan with kindness and invited him to accept Islam. Abu Sufyan, seeing the truth and the power of the Muslim community, declared his faith in Allah and His Messenger.

The Prophet then made a remarkable announcement that would be remembered throughout history: "Whoever enters the house of Abu Sufyan is safe. Whoever closes his door and stays inside is safe. Whoever enters the Sacred Mosque is safe."

This was an unprecedented act of mercy. In those times, conquering armies would typically plunder the defeated city and take revenge on their enemies. But the Prophet chose the path of forgiveness and peace.

As the Muslim army entered Makkah, there was no bloodshed, no looting, no revenge. The Prophet went directly to the Ka'bah and, with his own hands, destroyed the 360 idols that surrounded it, reciting: "Truth has come and falsehood has vanished. Indeed, falsehood is bound to vanish."

The people of Makkah, who had persecuted the Muslims for years, expected harsh punishment. Instead, the Prophet gathered them and asked: "What do you think I will do with you?"

They replied: "Good, for you are a noble brother and the son of a noble brother."

The Prophet then declared: "Go, for you are free!"

This act of forgiveness was so powerful that many Makkans immediately accepted Islam. The city that had been the center of opposition to Islam became its heart.`,
    moral: 'True victory is achieved through mercy and forgiveness, not revenge. When we forgive those who have wronged us, we win their hearts and create lasting peace.',
    moralArabic: 'النصر الحقيقي يتحقق من خلال الرحمة والمغفرة، وليس الانتقام. عندما نسامح من أساء إلينا، نكسب قلوبهم ونخلق سلاماً دائماً.',
    thumbnail: '🕋',
    estimatedReadTime: 7,
    difficulty: 'medium',
    relatedVerses: ['Quran 110:1-3'],
    author: 'Islamic Stories Collection',
    dateAdded: '2024-01-04',
    featured: false,
    tags: ['makkah', 'conquest', 'forgiveness', 'mercy', 'victory', 'prophet']
  },
  {
    id: '5',
    title: 'The Boy and the King',
    titleArabic: 'الغلام والملك',
    description: 'A young boy\'s unwavering faith leads an entire kingdom to Islam, showing that age is no barrier to strong belief.',
    category: 'lessons',
    ageGroup: 'youth',
    theme: ['faith', 'courage', 'youth'],
    content: `Long ago, there lived a tyrannical king who claimed to be a god and forced his people to worship him. In his kingdom, there was a young boy who had learned about the true God from a righteous monk.

The boy's faith grew stronger each day. He would pray to Allah in secret and learned that only Allah deserved worship, not the king or any created being.

One day, the boy was traveling when he came across a huge beast blocking the road, preventing people from passing. The people were afraid and didn't know what to do.

The boy stepped forward and prayed: "O Allah, if the way of the monk is more beloved to You than the way of the magician, then kill this beast so that people may pass."

By Allah's will, the beast died instantly, and the road was cleared. The people were amazed, and word of this miracle reached the king.

The king summoned the boy and demanded to know how he had killed the beast. The boy, with courage beyond his years, told the king about his faith in Allah, the One True God.

The king was furious. "You have a god other than me?" he roared.

"Yes," the boy replied calmly. "My Lord and your Lord is Allah."

The king ordered his soldiers to torture the boy until he renounced his faith, but the boy remained steadfast. No amount of pain could shake his belief in Allah.

Finally, the king decided to make a public example of the boy. He ordered that the boy be brought to the top of a mountain and thrown off, hoping to show the people what happened to those who defied him.

But the boy prayed to Allah, and by Allah's will, the mountain shook, and all the king's soldiers fell to their deaths, while the boy remained safe.

The king tried again, this time ordering the boy to be drowned in the sea. Again, the boy prayed, and the boat capsized, drowning all the king's men while the boy swam safely to shore.

Finally, the boy, knowing that Allah had a greater plan, told the king: "You will not be able to kill me until you do what I tell you. Gather all the people in one place, then take an arrow from my quiver and say: 'In the name of Allah, the Lord of the boy,' then shoot me. Only then will you be able to kill me."

The king, desperate to end this challenge to his authority, did exactly as the boy instructed. When he shot the arrow while saying "In the name of Allah, the Lord of the boy," the boy died.

But the boy's death was not in vain. When the people saw that the king had to invoke Allah's name to kill the boy, they realized the truth. They understood that Allah was indeed the true God, and the king was just a man.

The entire crowd declared: "We believe in the Lord of the boy! We believe in Allah!"

The boy's sacrifice had led an entire kingdom to faith. His courage and unwavering belief had accomplished what no army could - the conversion of thousands of hearts to the truth.`,
    moral: 'Age is no barrier to strong faith. Even young people can have unwavering belief and can inspire others through their courage and dedication to truth.',
    moralArabic: 'العمر ليس عائقاً أمام الإيمان القوي. حتى الشباب يمكن أن يكون لديهم إيمان راسخ ويمكنهم إلهام الآخرين من خلال شجاعتهم وتفانيهم للحق.',
    thumbnail: '👦',
    estimatedReadTime: 6,
    difficulty: 'medium',
    relatedVerses: ['Quran 85:4-8'],
    author: 'Islamic Stories Collection',
    dateAdded: '2024-01-05',
    featured: true,
    tags: ['boy', 'king', 'faith', 'courage', 'youth', 'sacrifice', 'belief']
  }
];

const STORAGE_KEY = 'islamic-stories-data';

export function useStoriesStore() {
  const [state, setState] = useState<StoriesState>({
    stories: SAMPLE_STORIES,
    bookmarks: [],
    favorites: [],
    readingProgress: [],
    preferences: DEFAULT_PREFERENCES,
    searchQuery: '',
    selectedCategory: '',
    selectedAgeGroup: '',
    selectedTheme: '',
    currentStory: null,
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
          bookmarks: parsedData.bookmarks || [],
          favorites: parsedData.favorites || [],
          readingProgress: parsedData.readingProgress || [],
          preferences: { ...DEFAULT_PREFERENCES, ...parsedData.preferences },
        }));
      }
    } catch (error) {
      console.error('Error loading stories data:', error);
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    try {
      const dataToSave = {
        bookmarks: state.bookmarks,
        favorites: state.favorites,
        readingProgress: state.readingProgress,
        preferences: state.preferences,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving stories data:', error);
    }
  }, [state.bookmarks, state.favorites, state.readingProgress, state.preferences]);

  // Filter stories based on search and filters
  const getFilteredStories = useCallback(() => {
    let filtered = state.stories;

    // Search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query)) ||
        story.theme.some(theme => theme.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(story => story.category === state.selectedCategory);
    }

    // Age group filter
    if (state.selectedAgeGroup) {
      filtered = filtered.filter(story => 
        story.ageGroup === state.selectedAgeGroup || story.ageGroup === 'all'
      );
    }

    // Theme filter
    if (state.selectedTheme) {
      filtered = filtered.filter(story => story.theme.includes(state.selectedTheme));
    }

    return filtered;
  }, [state.stories, state.searchQuery, state.selectedCategory, state.selectedAgeGroup, state.selectedTheme]);

  // Get featured stories
  const getFeaturedStories = useCallback(() => {
    return state.stories.filter(story => story.featured);
  }, [state.stories]);

  // Get story by ID
  const getStoryById = useCallback((id: string) => {
    return state.stories.find(story => story.id === id);
  }, [state.stories]);

  // Get reading progress for a story
  const getReadingProgress = useCallback((storyId: string) => {
    return state.readingProgress.find(progress => progress.storyId === storyId);
  }, [state.readingProgress]);

  // Update search query
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Update filters
  const setFilters = useCallback((filters: {
    category?: string;
    ageGroup?: string;
    theme?: string;
  }) => {
    setState(prev => ({
      ...prev,
      selectedCategory: filters.category || prev.selectedCategory,
      selectedAgeGroup: filters.ageGroup || prev.selectedAgeGroup,
      selectedTheme: filters.theme || prev.selectedTheme,
    }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      selectedCategory: '',
      selectedAgeGroup: '',
      selectedTheme: '',
    }));
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((storyId: string) => {
    setState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(storyId)
        ? prev.bookmarks.filter(id => id !== storyId)
        : [...prev.bookmarks, storyId],
    }));
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((storyId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(storyId)
        ? prev.favorites.filter(id => id !== storyId)
        : [...prev.favorites, storyId],
    }));
  }, []);

  // Update reading progress
  const updateReadingProgress = useCallback((storyId: string, progress: number, position: number) => {
    setState(prev => ({
      ...prev,
      readingProgress: [
        ...prev.readingProgress.filter(p => p.storyId !== storyId),
        {
          storyId,
          progress,
          lastPosition: position,
          lastReadAt: new Date().toISOString(),
          completed: progress >= 100,
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

  // Set current story
  const setCurrentStory = useCallback((story: Story | null) => {
    setState(prev => ({ ...prev, currentStory: story }));
  }, []);

  return {
    // State
    ...state,
    
    // Computed
    filteredStories: getFilteredStories(),
    featuredStories: getFeaturedStories(),
    
    // Actions
    getStoryById,
    getReadingProgress,
    setSearchQuery,
    setFilters,
    clearFilters,
    toggleBookmark,
    toggleFavorite,
    updateReadingProgress,
    updatePreferences,
    setCurrentStory,
    
    // Helper functions
    isBookmarked: (storyId: string) => state.bookmarks.includes(storyId),
    isFavorited: (storyId: string) => state.favorites.includes(storyId),
    getBookmarkedStories: () => state.stories.filter(story => state.bookmarks.includes(story.id)),
    getFavoriteStories: () => state.stories.filter(story => state.favorites.includes(story.id)),
  };
}
