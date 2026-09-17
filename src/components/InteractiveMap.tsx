import { useState } from 'react';
import { MapPin, CreditCard, UtensilsCrossed, Tent, Info } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { mapPoints, type MapPoint } from '@/data/tourism';

type Category = 'all' | MapPoint['category'];

const CATEGORY_CONFIG: {
  key: string;
  value: Category;
  icon: typeof MapPin;
  color: string;
}[] = [
  { key: 'map.all', value: 'all', icon: Info, color: 'text-deepblue-600' },
  { key: 'map.attractions', value: 'attraction', icon: MapPin, color: 'text-terracotta-500' },
  { key: 'map.atms', value: 'atm', icon: CreditCard, color: 'text-deepblue-500' },
  { key: 'map.restaurants', value: 'restaurant', icon: UtensilsCrossed, color: 'text-sand-600' },
  { key: 'map.yurtCamps', value: 'yurt', icon: Tent, color: 'text-deepblue-800' },
];

const POINT_COLORS: Record<MapPoint['category'], string> = {
  attraction: 'fill-terracotta-500',
  atm: 'fill-deepblue-500',
  restaurant: 'fill-sand-500',
  yurt: 'fill-deepblue-800',
};

export default function InteractiveMap() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const filtered =
    activeCategory === 'all' ? mapPoints : mapPoints.filter((p) => p.category === activeCategory);

  return (
    <section id="map" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('map.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('map.subtitle')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl bg-sand-50 ring-1 ring-sand-200 overflow-hidden aspect-[4/3]">
              <svg viewBox="0 0 100 75" className="h-full w-full">
                <rect x="0" y="0" width="100" height="75" fill="#FAF8F4" />
                <path
                  d="M 10,5 Q 25,12 30,25 Q 28,40 20,50 Q 15,65 25,70 L 80,70 Q 90,65 88,50 Q 92,35 85,20 Q 80,8 70,5 Z"
                  fill="#EAD183"
                  stroke="#AD8A1F"
                  strokeWidth="0.4"
                  opacity="0.6"
                />
                <ellipse cx="32" cy="18" rx="10" ry="4" fill="#C9C1AE" opacity="0.5" />
                <text x="32" y="19" textAnchor="middle" fill="#443F35" fontSize="2.5" fontWeight="600">
                  {t('map.aralSea')}
                </text>
                <path d="M 45,35 Q 55,40 65,55" fill="none" stroke="#948B77" strokeWidth="0.8" opacity="0.5" />
                <text x="55" y="50" fill="#443F35" fontSize="2" opacity="0.7">
                  {t('map.amuDarya')}
                </text>
                <circle cx="56" cy="37" r="1.5" fill="#443F35" />
                <text x="59" y="38" fill="#443F35" fontSize="3" fontWeight="700">
                  {t('map.nukus')}
                </text>
                <circle cx="39" cy="24" r="1" fill="#443F35" />
                <text x="41" y="25" fill="#443F35" fontSize="2.5" fontWeight="600">
                  {t('map.moynaq')}
                </text>
                <circle cx="62" cy="55" r="1" fill="#443F35" />
                <text x="64" y="56" fill="#443F35" fontSize="2.5" fontWeight="600">
                  {t('map.kungrad')}
                </text>
                {filtered.map((point) => (
                  <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r={selectedPoint?.id === point.id ? 2.5 : 1.8}
                    className={`${POINT_COLORS[point.category]} transition-all cursor-pointer ${
                      hoveredPoint?.id === point.id ? 'opacity-80' : 'opacity-100'
                    }`}
                    stroke="white"
                    strokeWidth="0.3"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => setSelectedPoint(point)}
                  />
                ))}
              </svg>

              {hoveredPoint && (
                <div className="pointer-events-none absolute top-2 left-2 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-2 text-xs shadow-medium ring-1 ring-sand-200">
                  <p className="font-semibold text-deepblue-900">{hoveredPoint.name}</p>
                </div>
              )}

              <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 text-xs shadow">
                <p className="font-semibold text-deepblue-700 mb-1">{t('map.legend')}</p>
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-terracotta-500" /> {t('map.attractions')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-deepblue-500" /> {t('map.atms')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sand-500" /> {t('map.restaurants')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-deepblue-800" /> {t('map.yurtCamps')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-sand-50 ring-1 ring-sand-200 p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
            <h3 className="font-display text-base font-semibold text-deepblue-900 mb-3">{t('map.points')}</h3>
            <div className="space-y-2">
              {filtered.map((point) => {
                const config = CATEGORY_CONFIG.find((c) => c.value === point.category)!;
                const Icon = config.icon;
                return (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className={`w-full text-left rounded-xl p-3 transition-all ${
                      selectedPoint?.id === point.id
                        ? 'bg-white shadow-subtle ring-1 ring-terracotta-200'
                        : 'bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${config.color}`} />
                      <span className="text-sm font-medium text-deepblue-900">{point.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
