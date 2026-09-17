import { useState } from 'react';
import { getText } from '@/lib/translations';
import { Clock, MapPin, Phone, Wallet, Star, Landmark, Filter } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import type { Lang } from '@/lib/translations';
import { museums } from '@/data/heritage';
import { trackSpotView } from '@/lib/trackSpotView';

type FilterType = 'all' | 'art' | 'history' | 'ecology';

const filterMap: Record<FilterType, string[]> = {
  all: ['savitsky', 'moynaq-museum', 'berdaq', 'karakalpak-national-museum'],
  art: ['savitsky', 'berdaq'],
  history: ['karakalpak-national-museum', 'berdaq'],
  ecology: ['moynaq-museum'],
};

export default function Museums() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = museums.filter((m) => filterMap[filter].includes(m.id));

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('museums.all') },
    { key: 'art', label: t('museums.art') },
    { key: 'history', label: t('museums.history') },
    { key: 'ecology', label: t('museums.ecology') },
  ];

  return (
    <section id="museums" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <Landmark className="h-3.5 w-3.5" />
            {t('museums.title')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('museums.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600 leading-relaxed">{t('museums.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <Filter className="h-4 w-4 text-deepblue-400" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-deepblue-700 text-white shadow-subtle'
                  : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Museum cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filtered.map((museum) => (
            <article
              key={museum.id}
              onClick={() => trackSpotView(getText(museum.name, lang) || '', 'museum')}
              className="group overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative sm:w-2/5 overflow-hidden flex-shrink-0">
                  <div className="h-48 sm:h-full">
                    <img
                      src={museum.image}
                      alt={museum.name[lang as Lang]}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-deepblue-700 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-terracotta-500 text-terracotta-500" />
                      {museum.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-terracotta-600 mb-1">
                    {museum.type[lang as Lang]}
                  </span>
                  <h3 className="font-display text-lg font-bold text-deepblue-900 leading-tight mb-2">
                    {museum.name[lang as Lang]}
                  </h3>
                  <p className="text-sm text-deepblue-600 leading-relaxed mb-4 line-clamp-3">
                    {museum.description[lang as Lang]}
                  </p>

                  {/* Info grid */}
                  <div className="mt-auto grid grid-cols-1 gap-2 text-xs text-deepblue-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-deepblue-400 mt-0.5 flex-shrink-0" />
                      <span>{museum.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-deepblue-400 mt-0.5 flex-shrink-0" />
                      <span>{museum.hours}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-deepblue-400" />
                        {museum.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5 text-deepblue-400" />
                        {museum.entryFee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
