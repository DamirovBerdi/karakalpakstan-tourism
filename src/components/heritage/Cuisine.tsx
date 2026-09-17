import { UtensilsCrossed, Leaf, MapPin, Clock, Phone, ChefHat, DollarSign } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import type { Lang } from '@/lib/translations';
import { dishes, restaurants } from '@/data/heritage';

export default function Cuisine() {
  const { lang, t } = useLang();

  return (
    <section id="cuisine" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {t('cuisine.title')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('cuisine.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600 leading-relaxed">{t('cuisine.subtitle')}</p>
        </div>

        {/* Dishes */}
        <div className="mb-12">
          <h3 className="font-display text-xl font-bold text-deepblue-800 mb-5 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-terracotta-500" />
            {t('cuisine.dishes')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dishes.map((dish) => (
              <article
                key={dish.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name[lang as Lang]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-full bg-deepblue-900/80 px-2.5 py-0.5 text-xs font-medium capitalize text-white backdrop-blur-sm">
                      {dish.type}
                    </span>
                    {dish.vegetarian && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-600/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                        <Leaf className="h-3 w-3" /> {t('cuisine.vegetarian')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-display text-base font-bold text-deepblue-900 mb-1.5">{dish.name[lang as Lang]}</h4>
                  <p className="text-sm text-deepblue-600 leading-relaxed line-clamp-4">{dish.description[lang as Lang]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="border-t border-sand-200 pt-10">
          <h3 className="font-display text-xl font-bold text-deepblue-800 mb-5 flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-terracotta-500" />
            {t('cuisine.restaurants')}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {restaurants.map((r) => (
              <article
                key={r.id}
                className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated"
              >
                <div className="relative sm:w-1/3 overflow-hidden flex-shrink-0">
                  <div className="h-40 sm:h-full">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Price level */}
                  <div className="absolute top-3 right-3 flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 backdrop-blur-sm">
                    {[1, 2, 3].map((n) => (
                      <DollarSign
                        key={n}
                        className={`h-3 w-3 ${n <= r.priceLevel ? 'text-green-600' : 'text-sand-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display text-base font-bold text-deepblue-900 leading-tight">{r.name}</h4>
                    <span className="flex-shrink-0 rounded-full bg-sand-100 px-2 py-0.5 text-xs font-medium text-deepblue-600">
                      {r.location}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-terracotta-600 mb-2">{r.cuisine[lang as Lang]}</p>

                  <div className="rounded-lg bg-terracotta-50 px-3 py-2 mb-3">
                    <p className="text-xs text-deepblue-400 mb-0.5">{t('cuisine.signatureDish')}</p>
                    <p className="text-sm font-semibold text-deepblue-800">{r.signatureDish[lang as Lang]}</p>
                  </div>

                  <div className="space-y-1 text-xs text-deepblue-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 text-deepblue-400 mt-0.5 flex-shrink-0" />
                      <span>{r.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-deepblue-400" />
                        {r.hours}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-deepblue-400" />
                        {r.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
