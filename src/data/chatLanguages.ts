export interface ChatLanguage {
  code: string;
  bcp47: string;
  label: string;
  flag: string;
  coreLang: 'en' | 'ru' | 'uz' | 'kaa';
}

export const CHAT_LANGUAGES: ChatLanguage[] = [
  { code: 'en', bcp47: 'en-US', label: 'English', flag: '🇬🇧', coreLang: 'en' },
  { code: 'ru', bcp47: 'ru-RU', label: 'Русский', flag: '🇷🇺', coreLang: 'ru' },
  { code: 'uz', bcp47: 'uz-UZ', label: 'Oʻzbekcha', flag: '🇺🇿', coreLang: 'uz' },
  { code: 'kaa', bcp47: 'uz-UZ', label: 'Qaraqalpaqsha', flag: '🇺🇿', coreLang: 'kaa' },
  { code: 'de', bcp47: 'de-DE', label: 'Deutsch', flag: '🇩🇪', coreLang: 'en' },
  { code: 'fr', bcp47: 'fr-FR', label: 'Français', flag: '🇫🇷', coreLang: 'en' },
  { code: 'es', bcp47: 'es-ES', label: 'Español', flag: '🇪🇸', coreLang: 'en' },
  { code: 'it', bcp47: 'it-IT', label: 'Italiano', flag: '🇮🇹', coreLang: 'en' },
  { code: 'pt', bcp47: 'pt-PT', label: 'Português', flag: '🇵🇹', coreLang: 'en' },
  { code: 'nl', bcp47: 'nl-NL', label: 'Nederlands', flag: '🇳🇱', coreLang: 'en' },
  { code: 'ja', bcp47: 'ja-JP', label: '日本語', flag: '🇯🇵', coreLang: 'en' },
  { code: 'ko', bcp47: 'ko-KR', label: '한국어', flag: '🇰🇷', coreLang: 'en' },
  { code: 'zh', bcp47: 'zh-CN', label: '中文', flag: '🇨🇳', coreLang: 'en' },
  { code: 'ar', bcp47: 'ar-SA', label: 'العربية', flag: '🇸🇦', coreLang: 'en' },
  { code: 'tr', bcp47: 'tr-TR', label: 'Türkçe', flag: '🇹🇷', coreLang: 'en' },
  { code: 'fa', bcp47: 'fa-IR', label: 'فارسی', flag: '🇮🇷', coreLang: 'en' },
  { code: 'hi', bcp47: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳', coreLang: 'en' },
  { code: 'pl', bcp47: 'pl-PL', label: 'Polski', flag: '🇵🇱', coreLang: 'en' },
  { code: 'uk', bcp47: 'uk-UA', label: 'Українська', flag: '🇺🇦', coreLang: 'ru' },
  { code: 'kk', bcp47: 'kk-KZ', label: 'Қазақша', flag: '🇰🇿', coreLang: 'uz' },
  { code: 'ky', bcp47: 'ky-KG', label: 'Кыргызча', flag: '🇰🇬', coreLang: 'uz' },
  { code: 'tk', bcp47: 'tk-TM', label: 'Türkmen', flag: '🇹🇲', coreLang: 'uz' },
  { code: 'az', bcp47: 'az-AZ', label: 'Azərbaycan', flag: '🇦🇿', coreLang: 'uz' },
  { code: 'th', bcp47: 'th-TH', label: 'ไทย', flag: '🇹🇭', coreLang: 'en' },
  { code: 'vi', bcp47: 'vi-VN', label: 'Tiếng Việt', flag: '🇻🇳', coreLang: 'en' },
  { code: 'id', bcp47: 'id-ID', label: 'Indonesia', flag: '🇮🇩', coreLang: 'en' },
  { code: 'sv', bcp47: 'sv-SE', label: 'Svenska', flag: '🇸🇪', coreLang: 'en' },
  { code: 'cs', bcp47: 'cs-CZ', label: 'Čeština', flag: '🇨🇿', coreLang: 'en' },
  { code: 'he', bcp47: 'he-IL', label: 'עברית', flag: '🇮🇱', coreLang: 'en' },
  { code: 'ur', bcp47: 'ur-PK', label: 'اردو', flag: '🇵🇰', coreLang: 'en' },
  { code: 'bn', bcp47: 'bn-IN', label: 'বাংলা', flag: '🇧🇩', coreLang: 'en' },
];

export const BCP47_MAP: Record<string, string> = Object.fromEntries(
  CHAT_LANGUAGES.map((l) => [l.code, l.bcp47])
);

type UIStrings = {
  title: string;
  subtitle: string;
  welcome: string;
  placeholder: string;
  send: string;
  listen: string;
  stop: string;
  audioError: string;
  onSiteTitle: string;
  onSiteDesc: string;
  audioGuideDesc: string;
  disclaimer: string;
  voiceInput: string;
  stopRecording: string;
  languageLabel: string;
  autoDetected: string;
  suggestion1: string;
  suggestion2: string;
  suggestion3: string;
  suggestion4: string;
  suggestion5: string;
  suggestion6: string;
  fallbackNote: string;
};

export const CHAT_UI_STRINGS: Record<string, UIStrings> = {
  en: {
    title: 'Karakalpak Travel AI Guide',
    subtitle: 'Budget guide & virtual on-site tour guide',
    welcome: "Hello! I'm your free local AI guide for Karakalpakstan. I work offline — no setup needed! Ask me about cheap food, free attractions, how to reach Muynak on a budget — or tell me you're at a site right now and I'll guide you like a real tour guide! Tap the microphone to speak, and I'll reply with voice in your language.",
    placeholder: 'Type or speak in any language...',
    send: 'Send',
    listen: 'Listen',
    stop: 'Stop',
    audioError: 'Audio narration unavailable on this device.',
    onSiteTitle: 'On-Site Guide Mode',
    onSiteDesc: "Tell me where you are and I'll be your personal tour guide",
    audioGuideDesc: 'At a site with no guide? Ask me, then tap the speaker icon to listen.',
    disclaimer: 'Local knowledge base. Always verify prices and routes locally.',
    voiceInput: 'Start voice input',
    stopRecording: 'Stop recording',
    languageLabel: 'Language',
    autoDetected: 'Auto-detected',
    suggestion1: 'How to reach Muynak cheaply?',
    suggestion2: 'Cheap food in Nukus',
    suggestion3: 'Free attractions in Karakalpakstan',
    suggestion4: 'Budget transport options',
    suggestion5: "I'm at the Aral Sea, tell me its history",
    suggestion6: "I'm at Moynak Ship Cemetery, guide me",
    fallbackNote: '(Response in English — use Listen for audio in your language)',
  },
  ru: {
    title: 'AI-гид Karakalpak Travel',
    subtitle: 'Бюджетный гид и виртуальный экскурсовод',
    welcome: "Здравствуйте! Я ваш бесплатный местный AI-гид по Каракалпакстану. Работаю без интернета! Спрашивайте о дешёвой еде, бесплатных достопримечательностях, как добраться до Муйнака — или скажите, что вы на месте, и я проведу экскурсию! Нажмите на микрофон, чтобы говорить голосом.",
    placeholder: 'Введите или говорите на любом языке...',
    send: 'Отправить',
    listen: 'Слушать',
    stop: 'Стоп',
    audioError: 'Аудио недоступно на этом устройстве.',
    onSiteTitle: 'Режим экскурсовода',
    onSiteDesc: 'Скажите, где вы, и я буду вашим гидом',
    audioGuideDesc: 'Нет гида на месте? Спросите меня и нажмите на динамик.',
    disclaimer: 'Локальная база знаний. Проверяйте цены и маршруты на месте.',
    voiceInput: 'Голосовой ввод',
    stopRecording: 'Остановить запись',
    languageLabel: 'Язык',
    autoDetected: 'Автоопределение',
    suggestion1: 'Как дёшево добраться до Муйнака?',
    suggestion2: 'Дешёвая еда в Нукусе',
    suggestion3: 'Бесплатные достопримечательности',
    suggestion4: 'Бюджетный транспорт',
    suggestion5: 'Я на Аральском море, расскажи его историю',
    suggestion6: 'Я на кладбище кораблей, будь моим гидом',
    fallbackNote: '(Ответ на английском — нажмите Слушать для аудио)',
  },
  uz: {
    title: 'Karakalpak Travel AI Gidi',
    subtitle: 'Byudjet gidi va virtual ekskursiya',
    welcome: "Salom! Men Qoraqalpog'iston uchun bepul mahalliy AI gidingizman. Internetsiz ishlayman! Arzon ovqat, bepul joylar, Mo'ynoqqa qanday borish haqida so'rang — yoki qayerdaligingizni ayting, men sizni boshqalam! Mikrofon tugmasini bosing va ovozingizda so'rang.",
    placeholder: 'Har qanday tilda yozing yoki gapiring...',
    send: 'Yuborish',
    listen: 'Tinglash',
    stop: "To'xtatish",
    audioError: "Bu qurilmada audio mavjud emas.",
    onSiteTitle: "Ekskursiya rejimi",
    onSiteDesc: "Qayerdaligingizni ayting, men sizga gid bo'lay",
    audioGuideDesc: "Gid yo'qmi? Menidan so'rang va dinamikni bosing.",
    disclaimer: "Mahalliy bilimlar bazasi. Narx va marshrutlarni tekshiring.",
    voiceInput: "Ovozli kirish",
    stopRecording: "Yozishni to'xtatish",
    languageLabel: "Til",
    autoDetected: "Avtomatik",
    suggestion1: "Mo'ynoqqa arzan qanday boraman?",
    suggestion2: "Nukusda arzon ovqat",
    suggestion3: "Bepul joylar",
    suggestion4: "Arzan transport",
    suggestion5: "Orol dengizidaman, tarixini ayt",
    suggestion6: "Kema qabristonidaman, meni boshqal",
    fallbackNote: "(Javob inglizchada — Tinglash tugmasini bosing)",
  },
  kaa: {
    title: 'Karakalpak Travel AI Gidi',
    subtitle: 'Byudjet gidi hám virtual ekskursiya',
    welcome: "Sálem! Men Qaraqalpaqstan ushın biypul jergilikli AI gidińizmen. Internetsiz isleymen! Arzan azıq, biypul jerler, Moynaqqa qalay barıw haqqında sorıń — yaki qayerde ekenińizdi aytıń, men sizdi basshılıq etem! Mikrofon túymesin basıń hám dawısıńızda sorıń.",
    placeholder: 'Hár qanday tilde jazıń yaki sóyleń...',
    send: 'Jiberiw',
    listen: 'Tıńlaw',
    stop: 'Toqtatıw',
    audioError: 'Bul qurılmada audio joq.',
    onSiteTitle: 'Ekskursiya rejimi',
    onSiteDesc: 'Qayerde ekenińizdi aytıń, men sizge gid bolam',
    audioGuideDesc: "Gid joqpa? Sorıń hám dinamikti basıń.",
    disclaimer: 'Jergilikli bilimler bazası. Baha hám baǵdarlardı tekseriń.',
    voiceInput: 'Dawıslı kirisiw',
    stopRecording: 'Jazıwdı toqtatıw',
    languageLabel: 'Til',
    autoDetected: 'Avtomatikalıq',
    suggestion1: 'Moynaqqa arzan qalay baraman?',
    suggestion2: 'Nókiste arzan azıq',
    suggestion3: 'Biypul jerler',
    suggestion4: 'Arzan transport',
    suggestion5: 'Aral teńizideman, tariyxın ayt',
    suggestion6: 'Keme qábiristanındaman, meni basshılıq et',
    fallbackNote: '(Juwap inglis tilinde — Tıńlaw túymesin basıń)',
  },
};

const FALLBACK_STRINGS = CHAT_UI_STRINGS.en;

export function getChatUIStrings(langCode: string): UIStrings {
  return CHAT_UI_STRINGS[langCode] ?? FALLBACK_STRINGS;
}

export function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const browserLangs = navigator.languages ?? [navigator.language];
  for (const bl of browserLangs) {
    const code = bl.toLowerCase().split('-')[0];
    const match = CHAT_LANGUAGES.find((l) => l.code === code);
    if (match) return match.code;
  }
  return 'en';
}

export function getChatLanguage(code: string): ChatLanguage {
  return CHAT_LANGUAGES.find((l) => l.code === code) ?? CHAT_LANGUAGES[0];
}

export function isCoreLanguage(code: string): boolean {
  return ['en', 'ru', 'uz', 'kaa'].includes(code);
}
