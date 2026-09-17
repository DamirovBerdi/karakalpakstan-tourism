import { useState, useCallback, useMemo } from 'react';
import { Crosshair, Loader2, UtensilsCrossed, ShoppingCart, Pill, Store, CreditCard, HeartPulse, Camera, MapPin, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { nearbyPoints, hiddenGems, haversine, formatDistance, type GeoPoint } from '@/data/geoPoints';

type Category = GeoPoint['category'] | 'all';

const CATEGORY_CONFIG: { key: string; value: Category; icon: typeof UtensilsCrossed; color: string }[] = [
  { key: 'around.all', value: 'all', icon: Sparkles, color: 'text-deepblue-600' },
  { key: 'around.restaurants', value: 'restaurant', icon: UtensilsCrossed, color: 'text-terracotta-500' },
  { key: 'around.supermarkets', value: 'supermarket', icon: ShoppingCart, color: 'text-deepblue-500' },
  { key: 'around.pharmacies', value: 'pharmacy', icon: Pill, color: 'text-green-600' },
  { key: 'around.bazaars', value: 'bazaar', icon: Store, color: 'text-amber-600' },
  { key: 'around.atms', value: 'atm', icon: CreditCard, color: 'text-deepblue-700' },
  { key: 'around.hospitals', value: 'hospital', icon: HeartPulse, color: 'text-red-600' },
];

const GEM_DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function AroundMe() {
  const { t } = useLang();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [showGems, setShowGems] = useState(false);

  const detectLocation = useCallback(() => {
    setLocating(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setError(err.message || 'Could not get location');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const sortedPoints = useMemo(() => {
    if (!userLoc) return nearbyPoints;
    const withDist = nearbyPoints.map((p) => ({
      ...p,
      distance: haversine(userLoc.lat, userLoc.lng, p.lat, p.lng),
    }));
    return withDist.sort((a, b) => a.distance - b.distance);
  }, [userLoc]);

  const filtered = activeCategory === 'all' ? sortedPoints : sortedPoints.filter((p) => p.category === activeCategory);

  const sortedGems = useMemo(() => {
    if (!userLoc) return hiddenGems;
    return [...hiddenGems]
      .map((g) => ({ ...g, distance: haversine(userLoc.lat, userLoc.lng, g.lat, g.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [userLoc]);

  return (
    <section id="around" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <MapPin className="h-3.5 w-3.5" /> {t('around.title')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('around.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('around.subtitle')}</p>
        </div>

        {/* Detect location */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            onClick={detectLocation}
            disabled={locating}
            className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-deepblue-700 disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
            {userLoc ? t('around.relocate') : t('around.detectBtn')}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {userLoc && (
            <p className="text-xs text-deepblue-500">
              {t('around.yourLocation')}: {userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Toggle between essentials and gems */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setShowGems(false)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              !showGems ? 'bg-deepblue-700 text-white shadow-subtle' : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
            }`}
          >
            {t('around.essentials')}
          </button>
          <button
            onClick={() => setShowGems(true)}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              showGems ? 'bg-terracotta-500 text-white shadow-subtle' : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
            }`}
          >
            <Camera className="h-4 w-4" /> {t('around.gems')}
          </button>
        </div>

        {/* Essentials list */}
        {!showGems && (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {CATEGORY_CONFIG.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === cat.value
                        ? 'bg-deepblue-600 text-white shadow-subtle'
                        : 'bg-sand-100 text-deepblue-700 hover:bg-sand-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${activeCategory === cat.value ? 'text-white' : cat.color}`} />
                    {t(cat.key)}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(0, 12).map((point) => {
                const config = CATEGORY_CONFIG.find((c) => c.value === point.category)!;
                const Icon = config.icon;
                return (
                  <div
                    key={point.id}
                    className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle"
                  >
                    <div className={`rounded-lg bg-sand-50 p-2.5 flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-deepblue-900 truncate">{point.name}</h3>
                      <p className="text-xs text-deepblue-500 truncate">{point.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {userLoc && 'distance' in point && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600">
                            <MapPin className="h-3 w-3" />
                            {formatDistance((point as GeoPoint & { distance: number }).distance)}
                          </span>
                        )}
                        <span className="text-xs text-deepblue-400">{point.city}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Hidden gems */}
        {showGems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedGems.map((gem) => (
              <article
                key={gem.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${GEM_DIFFICULTY_COLOR[gem.difficulty]}`}>
                      {gem.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display text-sm font-bold text-white">{gem.name}</h3>
                    {userLoc && 'distance' in gem && (
                      <p className="text-xs text-white/80 mt-0.5">
                        {formatDistance((gem as typeof gem & { distance: number }).distance)} away
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-deepblue-600 leading-relaxed mb-2">{gem.description}</p>
                  <div className="flex items-start gap-1.5 rounded-lg bg-terracotta-50 px-3 py-2">
                    <Camera className="h-3.5 w-3.5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-deepblue-700">{gem.photoTips}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
