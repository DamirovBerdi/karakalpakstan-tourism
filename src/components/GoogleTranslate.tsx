import { useState, useRef, useEffect, useCallback } from 'react';
import { Languages, Check, ChevronDown, RotateCcw, Search } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (config: object, elementId: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface GoogleLang {
  code: string;
  label: string;
}

const LANGUAGES: GoogleLang[] = [
  { code: 'af', label: 'Afrikaans' },
  { code: 'sq', label: 'Albanian' },
  { code: 'am', label: 'Amharic' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hy', label: 'Armenian' },
  { code: 'az', label: 'Azerbaijani' },
  { code: 'eu', label: 'Basque' },
  { code: 'be', label: 'Belarusian' },
  { code: 'bn', label: 'Bengali' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'ca', label: 'Catalan' },
  { code: 'ceb', label: 'Cebuano' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'co', label: 'Corsican' },
  { code: 'hr', label: 'Croatian' },
  { code: 'cs', label: 'Czech' },
  { code: 'da', label: 'Danish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'en', label: 'English' },
  { code: 'eo', label: 'Esperanto' },
  { code: 'et', label: 'Estonian' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fr', label: 'French' },
  { code: 'fy', label: 'Frisian' },
  { code: 'gl', label: 'Galician' },
  { code: 'ka', label: 'Georgian' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ht', label: 'Haitian Creole' },
  { code: 'ha', label: 'Hausa' },
  { code: 'haw', label: 'Hawaiian' },
  { code: 'he', label: 'Hebrew' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hmn', label: 'Hmong' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'is', label: 'Icelandic' },
  { code: 'ig', label: 'Igbo' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ga', label: 'Irish' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'jw', label: 'Javanese' },
  { code: 'kn', label: 'Kannada' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'km', label: 'Khmer' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'ko', label: 'Korean' },
  { code: 'ku', label: 'Kurdish' },
  { code: 'ky', label: 'Kyrgyz' },
  { code: 'lo', label: 'Lao' },
  { code: 'la', label: 'Latin' },
  { code: 'lv', label: 'Latvian' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'lb', label: 'Luxembourgish' },
  { code: 'mk', label: 'Macedonian' },
  { code: 'mg', label: 'Malagasy' },
  { code: 'ms', label: 'Malay' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mt', label: 'Maltese' },
  { code: 'mi', label: 'Maori' },
  { code: 'mr', label: 'Marathi' },
  { code: 'mn', label: 'Mongolian' },
  { code: 'my', label: 'Burmese' },
  { code: 'ne', label: 'Nepali' },
  { code: 'no', label: 'Norwegian' },
  { code: 'ny', label: 'Nyanja (Chichewa)' },
  { code: 'or', label: 'Odia (Oriya)' },
  { code: 'ps', label: 'Pashto' },
  { code: 'fa', label: 'Persian' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'sm', label: 'Samoan' },
  { code: 'gd', label: 'Scots Gaelic' },
  { code: 'sr', label: 'Serbian' },
  { code: 'st', label: 'Sesotho' },
  { code: 'sn', label: 'Shona' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'si', label: 'Sinhala' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sl', label: 'Slovenian' },
  { code: 'so', label: 'Somali' },
  { code: 'es', label: 'Spanish' },
  { code: 'su', label: 'Sundanese' },
  { code: 'sw', label: 'Swahili' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tl', label: 'Tagalog (Filipino)' },
  { code: 'tg', label: 'Tajik' },
  { code: 'ta', label: 'Tamil' },
  { code: 'tt', label: 'Tatar' },
  { code: 'te', label: 'Telugu' },
  { code: 'th', label: 'Thai' },
  { code: 'tr', label: 'Turkish' },
  { code: 'tk', label: 'Turkmen' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ug', label: 'Uyghur' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'cy', label: 'Welsh' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yi', label: 'Yiddish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'zu', label: 'Zulu' },
];

const STORAGE_KEY = 'google-translate-lang';

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const translateReady = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSelected(stored);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const waitForGoogle = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let attempts = 0;
      const check = () => {
        if (
          typeof window.google !== 'undefined' &&
          window.google.translate &&
          window.google.translate.TranslateElement
        ) {
          translateReady.current = true;
          resolve();
        } else if (attempts < 40) {
          attempts++;
          setTimeout(check, 250);
        } else {
          resolve();
        }
      };
      check();
    });
  }, []);

  const applyTranslation = useCallback(
    (langCode: string) => {
      if (langCode === 'en') {
        const iframe = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement | null;
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.postMessage('googTeComboRestore', '*');
          } catch {
            // ignore
          }
        }
        const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (selectEl) selectEl.value = 'en';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem(STORAGE_KEY);
        setSelected('');
        setTimeout(() => window.location.reload(), 100);
        return;
      }

      waitForGoogle().then(() => {
        const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (selectEl) {
          selectEl.value = langCode;
          selectEl.dispatchEvent(new Event('change'));
          setSelected(langCode);
          localStorage.setItem(STORAGE_KEY, langCode);
        }
      });
    },
    [waitForGoogle]
  );

  const handleSelect = (langCode: string) => {
    applyTranslation(langCode);
    setOpen(false);
    setSearch('');
  };

  const handleReset = () => {
    applyTranslation('en');
    setOpen(false);
  };

  const filtered = search.trim()
    ? LANGUAGES.filter((l) => l.label.toLowerCase().includes(search.toLowerCase()))
    : LANGUAGES;

  const currentLabel = selected
    ? LANGUAGES.find((l) => l.code === selected)?.label ?? 'Translate'
    : 'Translate';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        aria-label="Translate website"
      >
        <Languages className="h-4 w-4 text-sand-300" />
        <span className="hidden xl:inline max-w-[100px] truncate">{currentLabel}</span>
        <span className="xl:hidden">Translate</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-elevated ring-1 ring-deepblue-900/10 z-[60] overflow-hidden animate-fade-in">
          <div className="border-b border-sand-100 p-2.5">
            <div className="flex items-center gap-2 rounded-lg bg-sand-50 px-2.5 py-2 ring-1 ring-sand-100">
              <Search className="h-3.5 w-3.5 text-deepblue-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 100+ languages..."
                className="w-full bg-transparent text-xs text-deepblue-900 placeholder-deepblue-400/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {selected && (
              <button
                onClick={handleReset}
                className="flex w-full items-center gap-2 border-b border-sand-100 px-4 py-2.5 text-sm text-deepblue-600 transition-colors hover:bg-sand-50"
              >
                <RotateCcw className="h-3.5 w-3.5 text-terracotta-500" />
                <span>Reset to English</span>
              </button>
            )}

            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-xs text-deepblue-400">No languages found</p>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-sand-50 ${
                    selected === l.code ? 'bg-sand-50 font-semibold text-terracotta-600' : 'text-deepblue-800'
                  }`}
                >
                  <span>{l.label}</span>
                  {selected === l.code && <Check className="h-3.5 w-3.5 text-terracotta-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
