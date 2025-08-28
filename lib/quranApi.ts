// lib/quranApi.ts
export interface Verse {
  number: number;
  text: string;         // عربي
  translation?: string;  // انجليزي
  audioUrl?: string;     // صوت الآية
  tafsir?: string;       // تفسير
  numberInQuran?: number; // رقم الآية في القرآن كاملاً
}

export interface SurahInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  verses: number;
  revelationType: 'Meccan' | 'Medinan';
  meaning: string;
  englishName: string;
  revelationPlace: string;
}

export interface SurahData {
  surahNumber: number;
  surahName: string;
  surahNameEnglish?: string;
  surahNameTransliteration?: string;
  revelationType?: 'Meccan' | 'Medinan';
  totalVerses?: number;
  verses: Verse[];
}

const QURAN_API_BASE_URL = "http://api.alquran.cloud/v1";

// Complete list of all 114 Surahs with metadata
export const SURAHS_INFO: SurahInfo[] = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatiha", nameTransliteration: "The Opening", verses: 7, revelationType: "Meccan", meaning: "The Opening", englishName: "The Opening", revelationPlace: "Mecca" },
  { number: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", nameTransliteration: "The Cow", verses: 286, revelationType: "Medinan", meaning: "The Cow", englishName: "The Cow", revelationPlace: "Medina" },
  { number: 3, nameArabic: "آل عمران", nameEnglish: "Aal-E-Imran", nameTransliteration: "The Family of Imran", verses: 200, revelationType: "Medinan", meaning: "The Family of Imran", englishName: "The Family of Imran", revelationPlace: "Medina" },
  { number: 4, nameArabic: "النساء", nameEnglish: "An-Nisa", nameTransliteration: "The Women", verses: 176, revelationType: "Medinan", meaning: "The Women", englishName: "The Women", revelationPlace: "Medina" },
  { number: 5, nameArabic: "المائدة", nameEnglish: "Al-Maidah", nameTransliteration: "The Table Spread", verses: 120, revelationType: "Medinan", meaning: "The Table Spread", englishName: "The Table", revelationPlace: "Medina" },
  { number: 6, nameArabic: "الأنعام", nameEnglish: "Al-An'am", nameTransliteration: "The Cattle", verses: 165, revelationType: "Meccan", meaning: "The Cattle", englishName: "The Cattle", revelationPlace: "Mecca" },
  { number: 7, nameArabic: "الأعراف", nameEnglish: "Al-A'raf", nameTransliteration: "The Heights", verses: 206, revelationType: "Meccan", meaning: "The Heights", englishName: "The Heights", revelationPlace: "Mecca" },
  { number: 8, nameArabic: "الأنفال", nameEnglish: "Al-Anfal", nameTransliteration: "The Spoils of War", verses: 75, revelationType: "Medinan", meaning: "The Spoils of War", englishName: "The Spoils of War", revelationPlace: "Medina" },
  { number: 9, nameArabic: "التوبة", nameEnglish: "At-Tawbah", nameTransliteration: "The Repentance", verses: 129, revelationType: "Medinan", meaning: "The Repentance", englishName: "The Repentance", revelationPlace: "Medina" },
  { number: 10, nameArabic: "يونس", nameEnglish: "Yunus", nameTransliteration: "Jonah", verses: 109, revelationType: "Meccan", meaning: "Jonah", englishName: "Jonah", revelationPlace: "Mecca" },
  { number: 11, nameArabic: "هود", nameEnglish: "Hud", nameTransliteration: "Hud", verses: 123, revelationType: "Meccan", meaning: "Hud", englishName: "Hud", revelationPlace: "Mecca" },
  { number: 12, nameArabic: "يوسف", nameEnglish: "Yusuf", nameTransliteration: "Joseph", verses: 111, revelationType: "Meccan", meaning: "Joseph", englishName: "Joseph", revelationPlace: "Mecca" },
  { number: 13, nameArabic: "الرعد", nameEnglish: "Ar-Ra'd", nameTransliteration: "The Thunder", verses: 43, revelationType: "Medinan", meaning: "The Thunder", englishName: "The Thunder", revelationPlace: "Medina" },
  { number: 14, nameArabic: "إبراهيم", nameEnglish: "Ibrahim", nameTransliteration: "Abraham", verses: 52, revelationType: "Meccan", meaning: "Abraham", englishName: "Abraham", revelationPlace: "Mecca" },
  { number: 15, nameArabic: "الحجر", nameEnglish: "Al-Hijr", nameTransliteration: "The Rocky Tract", verses: 99, revelationType: "Meccan", meaning: "The Rocky Tract", englishName: "The Rock", revelationPlace: "Mecca" },
  { number: 16, nameArabic: "النحل", nameEnglish: "An-Nahl", nameTransliteration: "The Bee", verses: 128, revelationType: "Meccan", meaning: "The Bee", englishName: "The Bee", revelationPlace: "Mecca" },
  { number: 17, nameArabic: "الإسراء", nameEnglish: "Al-Isra", nameTransliteration: "The Night Journey", verses: 111, revelationType: "Meccan", meaning: "The Night Journey", englishName: "The Night Journey", revelationPlace: "Mecca" },
  { number: 18, nameArabic: "الكهف", nameEnglish: "Al-Kahf", nameTransliteration: "The Cave", verses: 110, revelationType: "Meccan", meaning: "The Cave", englishName: "The Cave", revelationPlace: "Mecca" },
  { number: 19, nameArabic: "مريم", nameEnglish: "Maryam", nameTransliteration: "Mary", verses: 98, revelationType: "Meccan", meaning: "Mary", englishName: "Mary", revelationPlace: "Mecca" },
  { number: 20, nameArabic: "طه", nameEnglish: "Taha", nameTransliteration: "Ta-Ha", verses: 135, revelationType: "Meccan", meaning: "Ta-Ha", englishName: "Ta-Ha", revelationPlace: "Mecca" },
  { number: 21, nameArabic: "الأنبياء", nameEnglish: "Al-Anbiya", nameTransliteration: "The Prophets", verses: 112, revelationType: "Meccan", meaning: "The Prophets", englishName: "The Prophets", revelationPlace: "Mecca" },
  { number: 22, nameArabic: "الحج", nameEnglish: "Al-Hajj", nameTransliteration: "The Pilgrimage", verses: 78, revelationType: "Medinan", meaning: "The Pilgrimage", englishName: "The Pilgrimage", revelationPlace: "Medina" },
  { number: 23, nameArabic: "المؤمنون", nameEnglish: "Al-Mu'minun", nameTransliteration: "The Believers", verses: 118, revelationType: "Meccan", meaning: "The Believers", englishName: "The Believers", revelationPlace: "Mecca" },
  { number: 24, nameArabic: "النور", nameEnglish: "An-Nur", nameTransliteration: "The Light", verses: 64, revelationType: "Medinan", meaning: "The Light", englishName: "The Light", revelationPlace: "Medina" },
  { number: 25, nameArabic: "الفرقان", nameEnglish: "Al-Furqan", nameTransliteration: "The Criterion", verses: 77, revelationType: "Meccan", meaning: "The Criterion", englishName: "The Criterion", revelationPlace: "Mecca" },
  { number: 26, nameArabic: "الشعراء", nameEnglish: "Ash-Shu'ara", nameTransliteration: "The Poets", verses: 227, revelationType: "Meccan", meaning: "The Poets", englishName: "The Poets", revelationPlace: "Mecca" },
  { number: 27, nameArabic: "النمل", nameEnglish: "An-Naml", nameTransliteration: "The Ant", verses: 93, revelationType: "Meccan", meaning: "The Ant", englishName: "The Ant", revelationPlace: "Mecca" },
  { number: 28, nameArabic: "القصص", nameEnglish: "Al-Qasas", nameTransliteration: "The Stories", verses: 88, revelationType: "Meccan", meaning: "The Stories", englishName: "The Stories", revelationPlace: "Mecca" },
  { number: 29, nameArabic: "العنكبوت", nameEnglish: "Al-Ankabut", nameTransliteration: "The Spider", verses: 69, revelationType: "Meccan", meaning: "The Spider", englishName: "The Spider", revelationPlace: "Mecca" },
  { number: 30, nameArabic: "الروم", nameEnglish: "Ar-Rum", nameTransliteration: "The Byzantines", verses: 60, revelationType: "Meccan", meaning: "The Byzantines", englishName: "The Romans", revelationPlace: "Mecca" },
  { number: 31, nameArabic: "لقمان", nameEnglish: "Luqman", nameTransliteration: "Luqman", verses: 34, revelationType: "Meccan", meaning: "Luqman", englishName: "Luqman", revelationPlace: "Mecca" },
  { number: 32, nameArabic: "السجدة", nameEnglish: "As-Sajdah", nameTransliteration: "The Prostration", verses: 30, revelationType: "Meccan", meaning: "The Prostration", englishName: "The Prostration", revelationPlace: "Mecca" },
  { number: 33, nameArabic: "الأحزاب", nameEnglish: "Al-Ahzab", nameTransliteration: "The Clans", verses: 73, revelationType: "Medinan", meaning: "The Clans", englishName: "The Clans", revelationPlace: "Medina" },
  { number: 34, nameArabic: "سبأ", nameEnglish: "Saba", nameTransliteration: "Sheba", verses: 54, revelationType: "Meccan", meaning: "Sheba", englishName: "Sheba", revelationPlace: "Mecca" },
  { number: 35, nameArabic: "فاطر", nameEnglish: "Fatir", nameTransliteration: "Originator", verses: 45, revelationType: "Meccan", meaning: "Originator", englishName: "The Originator", revelationPlace: "Mecca" },
  { number: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", nameTransliteration: "Ya Sin", verses: 83, revelationType: "Meccan", meaning: "Ya Sin", englishName: "Ya Sin", revelationPlace: "Mecca" },
  { number: 37, nameArabic: "الصافات", nameEnglish: "As-Saffat", nameTransliteration: "Those Who Set The Ranks", verses: 182, revelationType: "Meccan", meaning: "Those Who Set The Ranks", englishName: "Those Ranged in Ranks", revelationPlace: "Mecca" },
  { number: 38, nameArabic: "ص", nameEnglish: "Sad", nameTransliteration: "The Letter Sad", verses: 88, revelationType: "Meccan", meaning: "The Letter Sad", englishName: "Sad", revelationPlace: "Mecca" },
  { number: 39, nameArabic: "الزمر", nameEnglish: "Az-Zumar", nameTransliteration: "The Troops", verses: 75, revelationType: "Meccan", meaning: "The Troops", englishName: "The Groups", revelationPlace: "Mecca" },
  { number: 40, nameArabic: "غافر", nameEnglish: "Ghafir", nameTransliteration: "The Forgiver", verses: 85, revelationType: "Meccan", meaning: "The Forgiver", englishName: "The Forgiver", revelationPlace: "Mecca" },
  { number: 41, nameArabic: "فصلت", nameEnglish: "Fussilat", nameTransliteration: "Explained In Detail", verses: 54, revelationType: "Meccan", meaning: "Explained In Detail", englishName: "Explained in Detail", revelationPlace: "Mecca" },
  { number: 42, nameArabic: "الشورى", nameEnglish: "Ash-Shuraa", nameTransliteration: "The Consultation", verses: 53, revelationType: "Meccan", meaning: "The Consultation", englishName: "The Consultation", revelationPlace: "Mecca" },
  { number: 43, nameArabic: "الزخرف", nameEnglish: "Az-Zukhruf", nameTransliteration: "The Ornaments Of Gold", verses: 89, revelationType: "Meccan", meaning: "The Ornaments Of Gold", englishName: "The Gold Adornments", revelationPlace: "Mecca" },
  { number: 44, nameArabic: "الدخان", nameEnglish: "Ad-Dukhan", nameTransliteration: "The Smoke", verses: 59, revelationType: "Meccan", meaning: "The Smoke", englishName: "The Smoke", revelationPlace: "Mecca" },
  { number: 45, nameArabic: "الجاثية", nameEnglish: "Al-Jathiyah", nameTransliteration: "The Crouching", verses: 37, revelationType: "Meccan", meaning: "The Crouching", englishName: "The Kneeling", revelationPlace: "Mecca" },
  { number: 46, nameArabic: "الأحقاف", nameEnglish: "Al-Ahqaf", nameTransliteration: "The Wind-Curved Sandhills", verses: 35, revelationType: "Meccan", meaning: "The Wind-Curved Sandhills", englishName: "The Curved Sandhills", revelationPlace: "Mecca" },
  { number: 47, nameArabic: "محمد", nameEnglish: "Muhammad", nameTransliteration: "Muhammad", verses: 38, revelationType: "Medinan", meaning: "Muhammad", englishName: "Muhammad", revelationPlace: "Medina" },
  { number: 48, nameArabic: "الفتح", nameEnglish: "Al-Fath", nameTransliteration: "The Victory", verses: 29, revelationType: "Medinan", meaning: "The Victory", englishName: "The Victory", revelationPlace: "Medina" },
  { number: 49, nameArabic: "الحجرات", nameEnglish: "Al-Hujurat", nameTransliteration: "The Rooms", verses: 18, revelationType: "Medinan", meaning: "The Rooms", englishName: "The Private Apartments", revelationPlace: "Medina" },
  { number: 50, nameArabic: "ق", nameEnglish: "Qaf", nameTransliteration: "The Letter Qaf", verses: 45, revelationType: "Meccan", meaning: "The Letter Qaf", englishName: "Qaf", revelationPlace: "Mecca" },
  { number: 51, nameArabic: "الذاريات", nameEnglish: "Adh-Dhariyat", nameTransliteration: "The Winnowing Winds", verses: 60, revelationType: "Meccan", meaning: "The Winnowing Winds", englishName: "The Wind That Scatter", revelationPlace: "Mecca" },
  { number: 52, nameArabic: "الطور", nameEnglish: "At-Tur", nameTransliteration: "The Mount", verses: 49, revelationType: "Meccan", meaning: "The Mount", englishName: "The Mount", revelationPlace: "Mecca" },
  { number: 53, nameArabic: "النجم", nameEnglish: "An-Najm", nameTransliteration: "The Star", verses: 62, revelationType: "Meccan", meaning: "The Star", englishName: "The Star", revelationPlace: "Mecca" },
  { number: 54, nameArabic: "القمر", nameEnglish: "Al-Qamar", nameTransliteration: "The Moon", verses: 55, revelationType: "Meccan", meaning: "The Moon", englishName: "The Moon", revelationPlace: "Mecca" },
  { number: 55, nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", nameTransliteration: "The Beneficent", verses: 78, revelationType: "Medinan", meaning: "The Beneficent", englishName: "The Most Merciful", revelationPlace: "Medina" },
  { number: 56, nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", nameTransliteration: "The Inevitable", verses: 96, revelationType: "Meccan", meaning: "The Inevitable", englishName: "The Event", revelationPlace: "Mecca" },
  { number: 57, nameArabic: "الحديد", nameEnglish: "Al-Hadid", nameTransliteration: "The Iron", verses: 29, revelationType: "Medinan", meaning: "The Iron", englishName: "The Iron", revelationPlace: "Medina" },
  { number: 58, nameArabic: "المجادلة", nameEnglish: "Al-Mujadila", nameTransliteration: "The Pleading Woman", verses: 22, revelationType: "Medinan", meaning: "The Pleading Woman", englishName: "The Pleading Woman", revelationPlace: "Medina" },
  { number: 59, nameArabic: "الحشر", nameEnglish: "Al-Hashr", nameTransliteration: "The Exile", verses: 24, revelationType: "Medinan", meaning: "The Exile", englishName: "The Gathering", revelationPlace: "Medina" },
  { number: 60, nameArabic: "الممتحنة", nameEnglish: "Al-Mumtahanah", nameTransliteration: "She That Is To Be Examined", verses: 13, revelationType: "Medinan", meaning: "She That Is To Be Examined", englishName: "The Examined One", revelationPlace: "Medina" },
  { number: 61, nameArabic: "الصف", nameEnglish: "As-Saff", nameTransliteration: "The Ranks", verses: 14, revelationType: "Medinan", meaning: "The Ranks", englishName: "The Battle Array", revelationPlace: "Medina" },
  { number: 62, nameArabic: "الجمعة", nameEnglish: "Al-Jumu'ah", nameTransliteration: "The Congregation", verses: 11, revelationType: "Medinan", meaning: "The Congregation", englishName: "Friday", revelationPlace: "Medina" },
  { number: 63, nameArabic: "المنافقون", nameEnglish: "Al-Munafiqun", nameTransliteration: "The Hypocrites", verses: 11, revelationType: "Medinan", meaning: "The Hypocrites", englishName: "The Hypocrites", revelationPlace: "Medina" },
  { number: 64, nameArabic: "التغابن", nameEnglish: "At-Taghabun", nameTransliteration: "The Mutual Disillusion", verses: 18, revelationType: "Medinan", meaning: "The Mutual Disillusion", englishName: "The Mutual Disillusion", revelationPlace: "Medina" },
  { number: 65, nameArabic: "الطلاق", nameEnglish: "At-Talaq", nameTransliteration: "The Divorce", verses: 12, revelationType: "Medinan", meaning: "The Divorce", englishName: "The Divorce", revelationPlace: "Medina" },
  { number: 66, nameArabic: "التحريم", nameEnglish: "At-Tahrim", nameTransliteration: "The Prohibition", verses: 12, revelationType: "Medinan", meaning: "The Prohibition", englishName: "The Prohibition", revelationPlace: "Medina" },
  { number: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", nameTransliteration: "The Sovereignty", verses: 30, revelationType: "Meccan", meaning: "The Sovereignty", englishName: "The Kingdom", revelationPlace: "Mecca" },
  { number: 68, nameArabic: "القلم", nameEnglish: "Al-Qalam", nameTransliteration: "The Pen", verses: 52, revelationType: "Meccan", meaning: "The Pen", englishName: "The Pen", revelationPlace: "Mecca" },
  { number: 69, nameArabic: "الحاقة", nameEnglish: "Al-Haqqah", nameTransliteration: "The Reality", verses: 52, revelationType: "Meccan", meaning: "The Reality", englishName: "The Reality", revelationPlace: "Mecca" },
  { number: 70, nameArabic: "المعارج", nameEnglish: "Al-Ma'arij", nameTransliteration: "The Ascending Stairways", verses: 44, revelationType: "Meccan", meaning: "The Ascending Stairways", englishName: "The Ways of Ascent", revelationPlace: "Mecca" },
  { number: 71, nameArabic: "نوح", nameEnglish: "Nuh", nameTransliteration: "Noah", verses: 28, revelationType: "Meccan", meaning: "Noah", englishName: "Noah", revelationPlace: "Mecca" },
  { number: 72, nameArabic: "الجن", nameEnglish: "Al-Jinn", nameTransliteration: "The Jinn", verses: 28, revelationType: "Meccan", meaning: "The Jinn", englishName: "The Jinn", revelationPlace: "Mecca" },
  { number: 73, nameArabic: "المزمل", nameEnglish: "Al-Muzzammil", nameTransliteration: "The Enshrouded One", verses: 20, revelationType: "Meccan", meaning: "The Enshrouded One", englishName: "The Enshrouded One", revelationPlace: "Mecca" },
  { number: 74, nameArabic: "المدثر", nameEnglish: "Al-Muddaththir", nameTransliteration: "The Cloaked One", verses: 56, revelationType: "Meccan", meaning: "The Cloaked One", englishName: "The Cloaked One", revelationPlace: "Mecca" },
  { number: 75, nameArabic: "القيامة", nameEnglish: "Al-Qiyamah", nameTransliteration: "The Resurrection", verses: 40, revelationType: "Meccan", meaning: "The Resurrection", englishName: "The Resurrection", revelationPlace: "Mecca" },
  { number: 76, nameArabic: "الإنسان", nameEnglish: "Al-Insan", nameTransliteration: "The Man", verses: 31, revelationType: "Medinan", meaning: "The Man", englishName: "Man", revelationPlace: "Medina" },
  { number: 77, nameArabic: "المرسلات", nameEnglish: "Al-Mursalat", nameTransliteration: "The Emissaries", verses: 50, revelationType: "Meccan", meaning: "The Emissaries", englishName: "Those Sent Forth", revelationPlace: "Mecca" },
  { number: 78, nameArabic: "النبأ", nameEnglish: "An-Naba", nameTransliteration: "The Announcement", verses: 40, revelationType: "Meccan", meaning: "The Announcement", englishName: "The Great News", revelationPlace: "Mecca" },
  { number: 79, nameArabic: "النازعات", nameEnglish: "An-Nazi'at", nameTransliteration: "Those Who Drag Forth", verses: 46, revelationType: "Meccan", meaning: "Those Who Drag Forth", englishName: "Those Who Pull Out", revelationPlace: "Mecca" },
  { number: 80, nameArabic: "عبس", nameEnglish: "Abasa", nameTransliteration: "He Frowned", verses: 42, revelationType: "Meccan", meaning: "He Frowned", englishName: "He Frowned", revelationPlace: "Mecca" },
  { number: 81, nameArabic: "التكوير", nameEnglish: "At-Takwir", nameTransliteration: "The Overthrowing", verses: 29, revelationType: "Meccan", meaning: "The Overthrowing", englishName: "The Folding Up", revelationPlace: "Mecca" },
  { number: 82, nameArabic: "الانفطار", nameEnglish: "Al-Infitar", nameTransliteration: "The Cleaving", verses: 19, revelationType: "Meccan", meaning: "The Cleaving", englishName: "The Cleaving", revelationPlace: "Mecca" },
  { number: 83, nameArabic: "المطففين", nameEnglish: "Al-Mutaffifin", nameTransliteration: "The Defrauding", verses: 36, revelationType: "Meccan", meaning: "The Defrauding", englishName: "Those Who Deal in Fraud", revelationPlace: "Mecca" },
  { number: 84, nameArabic: "الانشقاق", nameEnglish: "Al-Inshiqaq", nameTransliteration: "The Sundering", verses: 25, revelationType: "Meccan", meaning: "The Sundering", englishName: "The Splitting Asunder", revelationPlace: "Mecca" },
  { number: 85, nameArabic: "البروج", nameEnglish: "Al-Buruj", nameTransliteration: "The Mansions Of The Stars", verses: 22, revelationType: "Meccan", meaning: "The Mansions Of The Stars", englishName: "The Big Stars", revelationPlace: "Mecca" },
  { number: 86, nameArabic: "الطارق", nameEnglish: "At-Tariq", nameTransliteration: "The Morning Star", verses: 17, revelationType: "Meccan", meaning: "The Morning Star", englishName: "The Night-Comer", revelationPlace: "Mecca" },
  { number: 87, nameArabic: "الأعلى", nameEnglish: "Al-A'la", nameTransliteration: "The Most High", verses: 19, revelationType: "Meccan", meaning: "The Most High", englishName: "The Most High", revelationPlace: "Mecca" },
  { number: 88, nameArabic: "الغاشية", nameEnglish: "Al-Ghashiyah", nameTransliteration: "The Overwhelming", verses: 26, revelationType: "Meccan", meaning: "The Overwhelming", englishName: "The Overwhelming", revelationPlace: "Mecca" },
  { number: 89, nameArabic: "الفجر", nameEnglish: "Al-Fajr", nameTransliteration: "The Dawn", verses: 30, revelationType: "Meccan", meaning: "The Dawn", englishName: "The Dawn", revelationPlace: "Mecca" },
  { number: 90, nameArabic: "البلد", nameEnglish: "Al-Balad", nameTransliteration: "The City", verses: 20, revelationType: "Meccan", meaning: "The City", englishName: "The City", revelationPlace: "Mecca" },
  { number: 91, nameArabic: "الشمس", nameEnglish: "Ash-Shams", nameTransliteration: "The Sun", verses: 15, revelationType: "Meccan", meaning: "The Sun", englishName: "The Sun", revelationPlace: "Mecca" },
  { number: 92, nameArabic: "الليل", nameEnglish: "Al-Layl", nameTransliteration: "The Night", verses: 21, revelationType: "Meccan", meaning: "The Night", englishName: "The Night", revelationPlace: "Mecca" },
  { number: 93, nameArabic: "الضحى", nameEnglish: "Ad-Duhaa", nameTransliteration: "The Morning Hours", verses: 11, revelationType: "Meccan", meaning: "The Morning Hours", englishName: "The Forenoon", revelationPlace: "Mecca" },
  { number: 94, nameArabic: "الشرح", nameEnglish: "Ash-Sharh", nameTransliteration: "The Relief", verses: 8, revelationType: "Meccan", meaning: "The Relief", englishName: "The Opening Up", revelationPlace: "Mecca" },
  { number: 95, nameArabic: "التين", nameEnglish: "At-Tin", nameTransliteration: "The Fig", verses: 8, revelationType: "Meccan", meaning: "The Fig", englishName: "The Fig", revelationPlace: "Mecca" },
  { number: 96, nameArabic: "العلق", nameEnglish: "Al-Alaq", nameTransliteration: "The Clot", verses: 19, revelationType: "Meccan", meaning: "The Clot", englishName: "The Clot", revelationPlace: "Mecca" },
  { number: 97, nameArabic: "القدر", nameEnglish: "Al-Qadr", nameTransliteration: "The Power", verses: 5, revelationType: "Meccan", meaning: "The Power", englishName: "The Night of Decree", revelationPlace: "Mecca" },
  { number: 98, nameArabic: "البينة", nameEnglish: "Al-Bayyinah", nameTransliteration: "The Evidence", verses: 8, revelationType: "Medinan", meaning: "The Evidence", englishName: "The Clear Evidence", revelationPlace: "Medina" },
  { number: 99, nameArabic: "الزلزلة", nameEnglish: "Az-Zalzalah", nameTransliteration: "The Earthquake", verses: 8, revelationType: "Medinan", meaning: "The Earthquake", englishName: "The Earthquake", revelationPlace: "Medina" },
  { number: 100, nameArabic: "العاديات", nameEnglish: "Al-Adiyat", nameTransliteration: "The Courser", verses: 11, revelationType: "Meccan", meaning: "The Courser", englishName: "Those That Run", revelationPlace: "Mecca" },
  { number: 101, nameArabic: "القارعة", nameEnglish: "Al-Qari'ah", nameTransliteration: "The Calamity", verses: 11, revelationType: "Meccan", meaning: "The Calamity", englishName: "The Striking Hour", revelationPlace: "Mecca" },
  { number: 102, nameArabic: "التكاثر", nameEnglish: "At-Takathur", nameTransliteration: "The Rivalry In World Increase", verses: 8, revelationType: "Meccan", meaning: "The Rivalry In World Increase", englishName: "The Piling Up", revelationPlace: "Mecca" },
  { number: 103, nameArabic: "العصر", nameEnglish: "Al-Asr", nameTransliteration: "The Declining Day", verses: 3, revelationType: "Meccan", meaning: "The Declining Day", englishName: "The Time", revelationPlace: "Mecca" },
  { number: 104, nameArabic: "الهمزة", nameEnglish: "Al-Humazah", nameTransliteration: "The Traducer", verses: 9, revelationType: "Meccan", meaning: "The Traducer", englishName: "The Slanderer", revelationPlace: "Mecca" },
  { number: 105, nameArabic: "الفيل", nameEnglish: "Al-Fil", nameTransliteration: "The Elephant", verses: 5, revelationType: "Meccan", meaning: "The Elephant", englishName: "The Elephant", revelationPlace: "Mecca" },
  { number: 106, nameArabic: "قريش", nameEnglish: "Quraysh", nameTransliteration: "Quraysh", verses: 4, revelationType: "Meccan", meaning: "Quraysh", englishName: "Quraysh", revelationPlace: "Mecca" },
  { number: 107, nameArabic: "الماعون", nameEnglish: "Al-Ma'un", nameTransliteration: "The Small Kindnesses", verses: 7, revelationType: "Meccan", meaning: "The Small Kindnesses", englishName: "The Small Kindnesses", revelationPlace: "Mecca" },
  { number: 108, nameArabic: "الكوثر", nameEnglish: "Al-Kawthar", nameTransliteration: "The Abundance", verses: 3, revelationType: "Meccan", meaning: "The Abundance", englishName: "The Abundance", revelationPlace: "Mecca" },
  { number: 109, nameArabic: "الكافرون", nameEnglish: "Al-Kafirun", nameTransliteration: "The Disbelievers", verses: 6, revelationType: "Meccan", meaning: "The Disbelievers", englishName: "The Disbelievers", revelationPlace: "Mecca" },
  { number: 110, nameArabic: "النصر", nameEnglish: "An-Nasr", nameTransliteration: "The Divine Support", verses: 3, revelationType: "Medinan", meaning: "The Divine Support", englishName: "The Help", revelationPlace: "Medina" },
  { number: 111, nameArabic: "المسد", nameEnglish: "Al-Masad", nameTransliteration: "The Palm Fiber", verses: 5, revelationType: "Meccan", meaning: "The Palm Fiber", englishName: "The Palm Fiber", revelationPlace: "Mecca" },
  { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", nameTransliteration: "The Sincerity", verses: 4, revelationType: "Meccan", meaning: "The Sincerity", englishName: "The Purity", revelationPlace: "Mecca" },
  { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq", nameTransliteration: "The Dawn", verses: 5, revelationType: "Meccan", meaning: "The Dawn", englishName: "The Daybreak", revelationPlace: "Mecca" },
  { number: 114, nameArabic: "الناس", nameEnglish: "An-Nas", nameTransliteration: "Mankind", verses: 6, revelationType: "Meccan", meaning: "Mankind", englishName: "Mankind", revelationPlace: "Mecca" }
];

// Helper function to get Surah length category
export function getSurahLengthCategory(verses: number): 'short' | 'medium' | 'long' {
  if (verses <= 20) return 'short';
  if (verses <= 100) return 'medium';
  return 'long';
}

// Function to get all Surahs info
export function getAllSurahsInfo(): SurahInfo[] {
  return SURAHS_INFO;
}

// Function to get specific Surah info
export function getSurahInfo(surahNumber: number): SurahInfo | null {
  return SURAHS_INFO.find(surah => surah.number === surahNumber) || null;
}

// Fetch full Surah
export async function fetchSurah(
  surahNumber: number,
  includeTranslation: boolean = true
): Promise<SurahData | null> {
  try {
    // Get Surah metadata
    const surahInfo = getSurahInfo(surahNumber);
    if (!surahInfo) {
      console.error(`Surah ${surahNumber} not found in metadata`);
      return null;
    }

    // Try multiple approaches to get the data
    let arabicSurah = null;
    let englishTranslationSurah = null;
    let audioSurah = null;
    let tafsirSurah = null;

    // First, try to get Arabic text
    try {
      const arabicResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/quran-uthmani`);
      if (arabicResponse.ok) {
        const arabicData = await arabicResponse.json();
        arabicSurah = arabicData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch Arabic text:", error);
    }

    // Try alternative Arabic edition if first fails
    if (!arabicSurah) {
      try {
        const arabicResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/ar.alafasy`);
        if (arabicResponse.ok) {
          const arabicData = await arabicResponse.json();
          arabicSurah = arabicData.data;
        }
      } catch (error) {
        console.warn("Failed to fetch alternative Arabic text:", error);
      }
    }

    // Get English translation if requested
    if (includeTranslation) {
      try {
        const translationResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/en.sahih`);
        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          englishTranslationSurah = translationData.data;
        }
      } catch (error) {
        console.warn("Failed to fetch English translation:", error);
      }

      // Try alternative translation if first fails
      if (!englishTranslationSurah) {
        try {
          const translationResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/en.pickthall`);
          if (translationResponse.ok) {
            const translationData = await translationResponse.json();
            englishTranslationSurah = translationData.data;
          }
        } catch (error) {
          console.warn("Failed to fetch alternative English translation:", error);
        }
      }
    }

    // Get audio (optional)
    try {
      const audioResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/ar.alafasy`);
      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        audioSurah = audioData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch audio:", error);
    }

    // Get Tafsir (optional)
    try {
      const tafsirResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/en.jalalayn`);
      if (tafsirResponse.ok) {
        const tafsirData = await tafsirResponse.json();
        tafsirSurah = tafsirData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch Tafsir:", error);
    }

    // We need at least Arabic text to proceed
    if (!arabicSurah) {
      console.error("Could not fetch Arabic text for Surah", surahNumber);
      return null;
    }

    const verses: Verse[] = arabicSurah.ayahs.map((ayah: any, index: number) => {
      const englishAyah = englishTranslationSurah?.ayahs?.[index];
      const audioAyah = audioSurah?.ayahs?.[index];
      const tafsirAyah = tafsirSurah?.ayahs?.[index];

      return {
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: englishAyah?.text || undefined,
        audioUrl: audioAyah?.audio || undefined,
        tafsir: tafsirAyah?.text || undefined,
        numberInQuran: ayah.number,
      };
    });

    return {
      surahNumber: arabicSurah.number,
      surahName: surahInfo.nameArabic,
      surahNameEnglish: surahInfo.nameEnglish,
      surahNameTransliteration: surahInfo.nameTransliteration,
      revelationType: surahInfo.revelationType,
      totalVerses: surahInfo.verses,
      verses,
    };

  } catch (error) {
    console.error("Error fetching surah data:", error);
    return null;
  }
}

// Fetch single verse
export async function fetchVerse(
  surahNumber: number,
  verseNumber: number,
  includeTranslation: boolean = true
): Promise<SurahData | null> {
  try {
    // Get Surah metadata
    const surahInfo = getSurahInfo(surahNumber);
    if (!surahInfo) {
      console.error(`Surah ${surahNumber} not found in metadata`);
      return null;
    }

    // Try to get Arabic verse
    let arabicAyah = null;
    try {
      const arabicResponse = await fetch(`${QURAN_API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/quran-uthmani`);
      if (arabicResponse.ok) {
        const arabicData = await arabicResponse.json();
        arabicAyah = arabicData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch Arabic verse:", error);
    }

    if (!arabicAyah) {
      console.error(`Could not fetch Arabic text for verse ${surahNumber}:${verseNumber}`);
      return null;
    }

    // Try to get English translation
    let englishAyah = null;
    if (includeTranslation) {
      try {
        const translationResponse = await fetch(`${QURAN_API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/en.sahih`);
        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          englishAyah = translationData.data;
        }
      } catch (error) {
        console.warn("Failed to fetch English translation for verse:", error);
      }
    }

    // Try to get audio
    let audioAyah = null;
    try {
      const audioResponse = await fetch(`${QURAN_API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/ar.alafasy`);
      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        audioAyah = audioData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch audio for verse:", error);
    }

    // Try to get Tafsir
    let tafsirAyah = null;
    try {
      const tafsirResponse = await fetch(`${QURAN_API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/en.jalalayn`);
      if (tafsirResponse.ok) {
        const tafsirData = await tafsirResponse.json();
        tafsirAyah = tafsirData.data;
      }
    } catch (error) {
      console.warn("Failed to fetch Tafsir for verse:", error);
    }

    const verse: Verse = {
      number: arabicAyah.numberInSurah,
      text: arabicAyah.text,
      translation: englishAyah?.text || undefined,
      audioUrl: audioAyah?.audio || undefined,
      tafsir: tafsirAyah?.text || undefined,
      numberInQuran: arabicAyah.number,
    };

    return {
      surahNumber: arabicAyah.surah.number,
      surahName: surahInfo.nameArabic,
      surahNameEnglish: surahInfo.nameEnglish,
      surahNameTransliteration: surahInfo.nameTransliteration,
      revelationType: surahInfo.revelationType,
      totalVerses: surahInfo.verses,
      verses: [verse],
    };

  } catch (error) {
    console.error("Error fetching verse data:", error);
    return null;
  }
}

// Simplified fallback function for basic Surah data
export async function fetchSurahSimple(surahNumber: number): Promise<SurahData | null> {
  try {
    const surahInfo = getSurahInfo(surahNumber);
    if (!surahInfo) {
      console.error(`Surah ${surahNumber} not found in metadata`);
      return null;
    }

    // Use the simplest API endpoint
    const response = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!data || !data.data) return null;

    const surahData = data.data;
    const verses: Verse[] = surahData.ayahs.map((ayah: any) => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      translation: undefined, // Will be fetched separately if needed
      audioUrl: undefined,    // Will be fetched separately if needed
      tafsir: undefined,      // Will be fetched separately if needed
      numberInQuran: ayah.number,
    }));

    return {
      surahNumber: surahData.number,
      surahName: surahInfo.nameArabic,
      surahNameEnglish: surahInfo.nameEnglish,
      surahNameTransliteration: surahInfo.nameTransliteration,
      revelationType: surahInfo.revelationType,
      totalVerses: surahInfo.verses,
      verses,
    };

  } catch (error) {
    console.error("Error fetching simple surah data:", error);
    return null;
  }
}

// Function to enhance Surah data with translation and audio
export async function enhanceSurahData(surahData: SurahData): Promise<SurahData> {
  try {
    const surahNumber = surahData.surahNumber;

    // Try to get translation
    let translationData = null;
    try {
      const translationResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/en.sahih`);
      if (translationResponse.ok) {
        const data = await translationResponse.json();
        translationData = data.data;
      }
    } catch (error) {
      console.warn("Could not fetch translation:", error);
    }

    // Try to get audio
    let audioData = null;
    try {
      const audioResponse = await fetch(`${QURAN_API_BASE_URL}/surah/${surahNumber}/ar.alafasy`);
      if (audioResponse.ok) {
        const data = await audioResponse.json();
        audioData = data.data;
      }
    } catch (error) {
      console.warn("Could not fetch audio:", error);
    }

    // Enhance verses with translation and audio
    const enhancedVerses = surahData.verses.map((verse, index) => ({
      ...verse,
      translation: translationData?.ayahs?.[index]?.text || verse.translation,
      audioUrl: audioData?.ayahs?.[index]?.audio || verse.audioUrl,
    }));

    return {
      ...surahData,
      verses: enhancedVerses,
    };

  } catch (error) {
    console.error("Error enhancing surah data:", error);
    return surahData; // Return original data if enhancement fails
  }
}

// Debug function to test API endpoints
export async function testApiEndpoints(surahNumber: number = 1) {
  console.log(`Testing API endpoints for Surah ${surahNumber}...`);

  const endpoints = [
    `${QURAN_API_BASE_URL}/surah/${surahNumber}`,
    `${QURAN_API_BASE_URL}/surah/${surahNumber}/quran-uthmani`,
    `${QURAN_API_BASE_URL}/surah/${surahNumber}/en.sahih`,
    `${QURAN_API_BASE_URL}/surah/${surahNumber}/ar.alafasy`,
    `${QURAN_API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.sahih`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`Success! Data structure:`, {
          hasData: !!data.data,
          dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
          dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
          firstItemKeys: data.data && typeof data.data === 'object' ?
            (Array.isArray(data.data) ? Object.keys(data.data[0] || {}) : Object.keys(data.data)) : 'N/A'
        });
      } else {
        console.log(`Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    console.log('---');
  }
}
