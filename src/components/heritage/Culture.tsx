import { useState } from 'react';
import { Shirt, Scissors, ShoppingBag, MapPin, Sparkles, Tag } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import type { Lang } from '@/lib/translations';
import { craftItems, souvenirShops } from '@/data/heritage';

type Tab = 'costumes' | 'crafts';

export default function Culture() {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<Tab>('costumes');

  const filtered = craftItems.filter((c) => c.category === (tab as 'costume' | 'craft'));

  return (
    <section id="culture" className="py-16 sm:py-20 bg-gradient-to-b from-white to-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            {t('culture.title')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('culture.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600 leading-relaxed">{t('culture.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setTab('costumes')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              tab === 'costumes' ? 'bg-terracotta-500 text-white shadow-subtle' : 'bg-white text-deepblue-600 ring-1 ring-sand-300 hover:bg-sand-100'
            }`}
          >
            <Shirt className="h-4 w-4" /> {t('culture.costumes')}
          </button>
          <button
            onClick={() => setTab('crafts')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              tab === 'crafts' ? 'bg-terracotta-500 text-white shadow-subtle' : 'bg-white text-deepblue-600 ring-1 ring-sand-300 hover:bg-sand-100'
            }`}
          >
            <Scissors className="h-4 w-4" /> {t('culture.crafts')}
          </button>
        </div>

        {/* Tab description */}
        <p className="text-center text-sm text-deepblue-500 mb-8 max-w-xl mx-auto">
          {tab === 'costumes' ? t('culture.costumesDesc') : t('culture.craftsDesc')}
        </p>

        {/* Craft grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name[lang as Lang]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-deepblue-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Tag className="h-3 w-3" /> {item.priceRange}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-deepblue-900 mb-1.5">{item.name[lang as Lang]}</h3>
                <p className="text-sm text-deepblue-600 leading-relaxed line-clamp-4">{item.description[lang as Lang]}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Shopping / Souvenirs */}
        <div className="border-t border-sand-200 pt-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-terracotta-600 mb-2">
              <ShoppingBag className="h-5 w-5" />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-deepblue-900">{t('culture.shopping')}</h3>
            </div>
            <p className="text-sm text-deepblue-500 max-w-lg mx-auto">{t('culture.shoppingDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {souvenirShops.map((shop) => (
              <div
                key={shop.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-xs font-bold text-white">{shop.name}</span>
                </div>
                <div className="p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-deepblue-500">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>{shop.location} — {shop.address}</span>
                  </div>
                  <p className="text-xs text-deepblue-600 leading-snug">{shop.specialties[lang as Lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
