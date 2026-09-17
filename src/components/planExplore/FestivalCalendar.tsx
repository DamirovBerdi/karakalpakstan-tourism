import { useState, useMemo } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { FESTIVALS, MONTH_NAMES } from '@/data/planExplore';
import type { Lang } from '@/lib/translations';

const LABELS: Record<string, Record<string, string>> = {
  allMonths: { en: 'All Months', ru: 'Все месяцы', uz: 'Barcha oylar', kaa: 'Barlıq aylar' },
  venue: { en: 'Venue', ru: 'Место', uz: 'Joy', kaa: 'Orın' },
  noEvents: { en: 'No events in this month', ru: 'В этом месяце нет событий', uz: "Bu oyda voqealar yo'q", kaa: "Bul ayda waqıyalar joq" },
  date: { en: 'Date', ru: 'Дата', uz: 'Sana', kaa: 'Sana' },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: Record<string, string> }> = {
  cultural: { bg: 'bg-terracotta-100', text: 'text-terracotta-700', label: { en: 'Cultural', ru: 'Культурный', uz: 'Madaniy', kaa: 'Mádeniy' } },
  eco: { bg: 'bg-green-100', text: 'text-green-700', label: { en: 'Eco', ru: 'Эко', uz: 'Eko', kaa: 'Eko' } },
  music: { bg: 'bg-purple-100', text: 'text-purple-700', label: { en: 'Music', ru: 'Музыка', uz: 'Musiqa', kaa: 'Muzıka' } },
  national: { bg: 'bg-deepblue-100', text: 'text-deepblue-700', label: { en: 'National', ru: 'Национальный', uz: 'Milliy', kaa: 'Milliy' } },
  historical: { bg: 'bg-sand-200', text: 'text-sand-800', label: { en: 'Historical', ru: 'Исторический', uz: 'Tarixiy', kaa: 'Tariyxıy' } },
};

function formatDate(month: number, day: number, endDate: number | undefined, lang: Lang) {
  const monthName = getText(MONTH_NAMES[month - 1], lang);
  if (endDate) {
    return `${monthName} ${day}–${endDate}`;
  }
  return `${monthName} ${day}`;
}

export default function FestivalCalendar() {
  const { lang } = useLang();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const tl = (key: string) => LABELS[key]?.[lang] ?? LABELS[key]?.en ?? key;

  const filteredFestivals = useMemo(() => {
    if (selectedMonth === null) return FESTIVALS;
    return FESTIVALS.filter((f) => f.month === selectedMonth);
  }, [selectedMonth]);

  const currentMonth = new Date().getMonth() + 1;
  const monthsWithData = useMemo(() => new Set(FESTIVALS.map((f) => f.month)), []);

  const cycleMonth = (dir: 'prev' | 'next') => {
    if (selectedMonth === null) {
      setSelectedMonth(dir === 'next' ? 1 : 12);
      return;
    }
    if (dir === 'next') {
      setSelectedMonth(selectedMonth === 12 ? 1 : selectedMonth + 1);
    } else {
      setSelectedMonth(selectedMonth === 1 ? 12 : selectedMonth - 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Month selector */}
      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-terracotta-500" />
            <h4 className="font-display text-sm font-semibold text-deepblue-900">
              {selectedMonth !== null ? MONTH_NAMES[selectedMonth - 1][lang] : tl('allMonths')}
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => cycleMonth('prev')}
              className="rounded-lg p-1.5 text-deepblue-600 hover:bg-sand-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedMonth(null)}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-deepblue-600 hover:bg-sand-100 transition-colors"
            >
              {tl('allMonths')}
            </button>
            <button
              onClick={() => cycleMonth('next')}
              className="rounded-lg p-1.5 text-deepblue-600 hover:bg-sand-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Month chips */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {MONTH_NAMES.map((m, i) => {
            const monthNum = i + 1;
            const hasData = monthsWithData.has(monthNum);
            const active = selectedMonth === monthNum;
            const isCurrent = monthNum === currentMonth;
            return (
              <button
                key={monthNum}
                onClick={() => setSelectedMonth(active ? null : monthNum)}
                className={`relative rounded-lg px-2 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : hasData
                    ? 'bg-sand-50 text-deepblue-700 ring-1 ring-sand-200 hover:bg-sand-100'
                    : 'bg-sand-50/50 text-deepblue-400'
                }`}
              >
                {getText(m, lang).slice(0, 3)}
                {isCurrent && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-terracotta-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Festival cards */}
      <div className="space-y-4">
        {filteredFestivals.length === 0 && (
          <div className="rounded-2xl bg-sand-50 ring-1 ring-sand-200 p-8 text-center">
            <Calendar className="h-10 w-10 text-deepblue-300 mx-auto mb-2" />
            <p className="text-sm text-deepblue-500">{tl('noEvents')}</p>
          </div>
        )}
        {filteredFestivals
          .sort((a, b) => a.month - b.month || a.day - b.day)
          .map((festival, i) => {
            const cat = CATEGORY_STYLES[festival.category];
            return (
              <div
                key={festival.id}
                className="overflow-hidden rounded-2xl bg-white ring-1 ring-sand-200 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-40 h-32 sm:h-auto flex-shrink-0">
                    <img
                      src={festival.image}
                      alt={getText(festival.name, lang)}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-center">
                      <p className="font-display text-base font-bold text-deepblue-900 leading-none">
                        {festival.day}
                      </p>
                      <p className="text-[10px] text-deepblue-600 leading-none mt-0.5">
                        {getText(MONTH_NAMES[festival.month - 1], lang).slice(0, 3)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-display text-base font-bold text-deepblue-900 leading-tight">
                        {festival.name[lang]}
                      </h5>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cat.bg} ${cat.text}`}>
                        {cat.label[lang]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-deepblue-500 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(festival.month, festival.day, festival.endDate, lang)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {festival.venue[lang]}
                      </span>
                    </div>
                    <p className="text-sm text-deepblue-700 leading-relaxed">{festival.description[lang]}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
