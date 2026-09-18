import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { LANGUAGES, type Lang } from '@/lib/translations';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 shrink-0 whitespace-nowrap"
        aria-label="Switch language"
      >
        <Globe className="h-3.5 w-3.5 text-gold-400 shrink-0" />
        <span className="text-sm">{current.flag}</span>
        <span className="hidden 2xl:inline">{current.label}</span>
        <span className="2xl:hidden font-bold">{current.code.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-elevated ring-1 ring-deepblue-900/10 z-50 overflow-hidden animate-fade-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as Lang);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-sand-100 ${
                lang === l.code ? 'bg-sand-50 font-semibold text-terracotta-600' : 'text-deepblue-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                {l.label}
              </span>
              {lang === l.code && <Check className="h-4 w-4 text-terracotta-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
