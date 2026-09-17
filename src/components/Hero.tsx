import { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { guides, hotels, transportRoutes } from '@/data/tourism';

const HERO_IMAGE = 'https://images.pexels.com/photos/28949995/pexels-photo-28949995.jpeg?auto=compress&cs=tinysrgb&w=1920';

export default function Hero() {
  const { t } = useLang();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: { type: string; title: string; subtitle: string }[] = [];
    guides.forEach((g) => {
      if (g.name.toLowerCase().includes(q) || g.specialties.some((s) => s.toLowerCase().includes(q)))
        results.push({ type: 'Guide', title: g.name, subtitle: g.specialties.join(', ') });
    });
    hotels.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q))
        results.push({ type: 'Hotel', title: h.name, subtitle: h.location });
    });
    transportRoutes.forEach((r) => {
      if (r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q))
        results.push({ type: 'Transport', title: `${r.from} → ${r.to}`, subtitle: r.mode });
    });
    return results;
  }, [query]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Karakalpakstan Ustyurt plateau cliffs at sunset"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/65 via-ink-900/55 to-ink-900/85" />
        <div className="ornament-muyiz-anchor absolute -right-16 -top-16 h-[420px] w-[420px] opacity-[.07] pointer-events-none" />
        <div className="ornament-muyiz-anchor absolute -left-24 bottom-0 h-[320px] w-[320px] opacity-[.05] -scale-x-100 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center pt-20 pb-12">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-200 ring-1 ring-gold-400/25">
            <MapPin className="h-4 w-4" /> Karakalpakstan, Uzbekistan
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white text-balance leading-[1.08] tracking-tightest">
            {t('hero.slogan')}
          </h1>
          <p className="mt-5 text-xl sm:text-2xl font-semibold text-gold-300">{t('hero.subtitle')}</p>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
            {t('hero.desc')}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl bg-white/95 backdrop-blur-sm shadow-elevated p-2">
            <div className="flex items-center gap-2">
              <Search className="ml-3 h-5 w-5 flex-shrink-0 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full bg-transparent py-3 text-ink-900 placeholder-ink-400/60 focus:outline-none text-sm sm:text-base"
              />
              <button className="flex-shrink-0 rounded-xl bg-garnet-500 px-4 sm:px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-garnet-600">
                {t('hero.searchBtn')}
              </button>
            </div>
          </div>

          {query.trim() && (
            <div className="mt-3 rounded-xl bg-white/95 backdrop-blur-sm shadow-elevated overflow-hidden text-left max-h-64 overflow-y-auto scrollbar-thin">
              {searchResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-ink-500">{t('hero.noResults')}</p>
              ) : (
                <>
                  <p className="px-4 py-2 text-xs font-medium text-ink-400 border-b border-ink-100">
                    {searchResults.length} {t('hero.results')}
                  </p>
                  {searchResults.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 transition-colors border-b border-ink-50 last:border-0"
                    >
                      <span className="rounded-md bg-gold-50 px-2 py-0.5 text-xs font-medium text-garnet-600">
                        {r.type}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{r.title}</p>
                        <p className="text-xs text-ink-500">{r.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div
          className="mt-9 flex flex-wrap items-center justify-center gap-5 text-sm text-white/65 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> 50+ {t('hero.startPlanning')}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Year-round
          </span>
        </div>
      </div>

      <div className="ornament-muyiz-border absolute bottom-0 left-0 right-0 h-10 opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink-50 to-transparent" />
    </section>
  );
}
