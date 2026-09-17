import { useState, useEffect, useCallback } from 'react';
import {
  Moon, Compass, MapPin, Navigation, Loader2, Clock, Sparkles,
  Users, UtensilsCrossed, Landmark, BookOpen, Calendar, Footprints,
  Hand, Shirt, Camera, ChevronRight, Star, CheckCircle2, Info,
  Sunrise, Sunset, CloudSun, Sun,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import {
  mosques, halalRestaurants, heritageSites, jumuahTimes, eidInfo, etiquetteTips,
  type Mosque, type HalalRestaurant, type HeritageSite,
} from '@/data/muslimTravel';
import { trackSpotView } from '@/lib/trackSpotView';

// --- Distance helper ---
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Qibla helper ---
function qiblaDirection(lat: number, lng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const dLng = ((kaabaLng - lng) * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const bearing = Math.atan2(
    Math.sin(dLng) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng),
  );
  return ((bearing * 180) / Math.PI + 360) % 360;
}

const PRAYER_ICONS: Record<string, typeof Moon> = {
  Fajr: Sunrise, Dhuhr: CloudSun, Asr: Sun, Maghrib: Sunset, Isha: Star,
};
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerName = typeof PRAYER_NAMES[number];

type Tab = 'prayer' | 'mosques' | 'halal' | 'heritage' | 'etiquette';

// === Prayer Times + Qibla ===
function PrayerTimesPanel() {
  const { t } = useLang();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [times, setTimes] = useState<Record<PrayerName, string> | null>(null);
  const [qibla, setQibla] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [usingDefault, setUsingDefault] = useState(false);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    setDate(today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));

    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${lat}&longitude=${lng}&method=3`);
      const json = await res.json();
      const dt = json.data.timings;
      setTimes({
        Fajr: dt.Fajr,
        Dhuhr: dt.Dhuhr,
        Asr: dt.Asr,
        Maghrib: dt.Maghrib,
        Isha: dt.Isha,
      });
      setQibla(qiblaDirection(lat, lng));
      setLoading(false);
    } catch {
      setError(t('muslim.prayerError'));
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Default to Nukus
      setUsingDefault(true);
      fetchPrayerTimes(42.4531, 59.6103);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUsingDefault(false);
        fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setUsingDefault(true);
        fetchPrayerTimes(42.4531, 59.6103);
      },
      { timeout: 10000 },
    );
  }, [fetchPrayerTimes]);

  // Compass for Qibla
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const heading = e.alpha ? 360 - e.alpha : 0;
      setCompassHeading(heading);
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  const qiblaRelativeToCompass = qibla !== null ? (qibla - compassHeading + 360) % 360 : 0;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextPrayer = (() => {
    if (!times) return null;
    for (const name of PRAYER_NAMES) {
      const [h, m] = times[name].split(':').map(Number);
      const pm = h * 60 + m;
      if (pm > currentMinutes) return { name, time: times[name], minutesUntil: pm - currentMinutes };
    }
    // Next is Fajr tomorrow
    const [h, m] = times.Fajr.split(':').map(Number);
    const fm = h * 60 + m + 24 * 60;
    return { name: 'Fajr' as PrayerName, time: times.Fajr, minutesUntil: fm - currentMinutes };
  })();

  const formatCountdown = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center ring-1 ring-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date + location */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-deepblue-900">{date}</p>
          <p className="text-xs text-deepblue-500">
            {usingDefault ? t('muslim.defaultLocation') : `${location?.lat.toFixed(3)}, ${location?.lng.toFixed(3)}`}
          </p>
        </div>
      </div>

      {/* Next prayer countdown */}
      {nextPrayer && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-200">{t('muslim.nextPrayer')}</p>
              <p className="font-display text-2xl font-bold">{nextPrayer.name}</p>
              <p className="text-sm text-emerald-100">{nextPrayer.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-emerald-200">{t('muslim.in')}</p>
              <p className="font-display text-2xl font-bold tabular-nums">{formatCountdown(nextPrayer.minutesUntil)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Prayer times list */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
          <h3 className="font-display text-lg font-bold text-deepblue-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" /> {t('muslim.prayerTimes')}
          </h3>
          <div className="space-y-2">
            {times && PRAYER_NAMES.map((name) => {
              const Icon = PRAYER_ICONS[name];
              const isNext = nextPrayer?.name === name;
              return (
                <div
                  key={name}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                    isNext ? 'bg-emerald-50 ring-1 ring-emerald-300' : 'bg-sand-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-deepblue-900">{name}</span>
                  </div>
                  <span className="font-display text-sm font-bold tabular-nums text-deepblue-900">{times[name]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Qibla compass */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
          <h3 className="font-display text-lg font-bold text-deepblue-900 mb-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-600" /> {t('muslim.qibla')}
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative h-44 w-44">
              {/* Compass dial */}
              <div className="absolute inset-0 rounded-full border-4 border-sand-200 bg-sand-50">
                {/* Cardinal points */}
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-deepblue-700">N</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-deepblue-400">S</span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-bold text-deepblue-400">W</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-bold text-deepblue-400">E</span>
              </div>
              {/* Qibla arrow */}
              {qibla !== null && (
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${qiblaRelativeToCompass}deg)` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-1 bg-emerald-600 rounded-full" />
                    <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-emerald-600 -mt-1" />
                    <div className="mt-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">Kaaba</div>
                  </div>
                </div>
              )}
              {/* Center dot */}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deepblue-700" />
            </div>
            <p className="mt-4 text-center text-sm text-deepblue-600">
              {t('muslim.qiblaFrom')} <span className="font-bold text-emerald-700">{qibla?.toFixed(1)}°</span>
              {compassHeading > 0 && (
                <span className="block text-xs text-deepblue-400 mt-1">{t('muslim.compassActive')}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Mosque Finder ===
function MosqueFinderPanel() {
  const { t } = useLang();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [sorted, setSorted] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Sort by city name as fallback
      setSorted([...mosques].sort((a, b) => a.city.localeCompare(b.city)));
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setSorted(
          [...mosques].sort((a, b) =>
            haversine(loc.lat, loc.lng, a.lat, a.lng) - haversine(loc.lat, loc.lng, b.lat, b.lng),
          ),
        );
        setLoading(false);
      },
      () => {
        setSorted([...mosques]);
        setLoading(false);
      },
      { timeout: 10000 },
    );
  }, []);

  const getDistance = (m: Mosque) =>
    userLoc ? haversine(userLoc.lat, userLoc.lng, m.lat, m.lng) : null;

  const navigateTo = (m: Mosque) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-deepblue-600 mb-2">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <span>{userLoc ? t('muslim.sortedByDistance') : t('muslim.allMosques')}</span>
      </div>
      {sorted.map((m) => {
        const dist = getDistance(m);
        return (
          <div key={m.id} className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-sand-200 hover:shadow-subtle transition-all">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <Moon className="h-6 w-6 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-deepblue-900">{m.name}</h4>
              <p className="text-xs text-deepblue-400">{m.nameLocal}</p>
              <p className="text-sm text-deepblue-600 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {m.address}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Clock className="h-3 w-3" /> {t('muslim.jumuah')}: {m.jumuah}
                </span>
                {m.hasWomenSection && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 text-xs font-medium text-deepblue-600">
                    <Users className="h-3 w-3" /> {t('muslim.womenSection')}
                  </span>
                )}
                {m.hasWudu && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 text-xs font-medium text-deepblue-600">
                    <CheckCircle2 className="h-3 w-3" /> {t('muslim.wuduAvailable')}
                  </span>
                )}
                {dist !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-50 px-2 py-0.5 text-xs font-bold text-terracotta-700">
                    <Navigation className="h-3 w-3" /> {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigateTo(m)}
              className="flex-shrink-0 rounded-lg bg-deepblue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-deepblue-700"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// === Halal Dining ===
function HalalDiningPanel() {
  const { t } = useLang();
  const [filter, setFilter] = useState<'all' | 'certified' | 'alcoholFree'>('all');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 10000 },
    );
  }, []);

  const filtered = halalRestaurants.filter((r) => {
    if (filter === 'certified') return r.certified;
    if (filter === 'alcoholFree') return r.alcoholFree;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (userLoc) {
      return haversine(userLoc.lat, userLoc.lng, a.lat, a.lng) - haversine(userLoc.lat, userLoc.lng, b.lat, b.lng);
    }
    return b.rating - a.rating;
  });

  const navigateTo = (r: HalalRestaurant) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`, '_blank');
  };

  const filters: { key: 'all' | 'certified' | 'alcoholFree'; label: string }[] = [
    { key: 'all', label: t('muslim.allDining') },
    { key: 'certified', label: t('muslim.halalCertified') },
    { key: 'alcoholFree', label: t('muslim.alcoholFree') },
  ];

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filter === f.key ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-deepblue-600 ring-1 ring-sand-300 hover:bg-sand-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Restaurant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((r) => {
          const dist = userLoc ? haversine(userLoc.lat, userLoc.lng, r.lat, r.lng) : null;
          return (
            <div key={r.id} className="rounded-xl bg-white p-4 ring-1 ring-sand-200 hover:shadow-subtle transition-all">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <UtensilsCrossed className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-deepblue-900 truncate">{r.name}</h4>
                    {r.certified && (
                      <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {t('muslim.halal')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-deepblue-400">{r.cuisine}</p>
                  <p className="text-sm text-deepblue-600 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" /> {r.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center gap-0.5 text-xs font-medium text-amber-600">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {r.rating}
                    </span>
                    <span className="text-xs text-deepblue-400">{r.priceRange}</span>
                    {r.alcoholFree && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                        {t('muslim.alcoholFree')}
                      </span>
                    )}
                    {dist !== null && (
                      <span className="text-xs font-bold text-terracotta-700">
                        {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigateTo(r)}
                  className="flex-shrink-0 rounded-lg bg-deepblue-600 p-2 text-white transition-colors hover:bg-deepblue-700"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === Islamic Heritage / Ziyarat ===
function HeritagePanel() {
  const { t } = useLang();
  const [selected, setSelected] = useState<HeritageSite | null>(null);

  const typeIcons: Record<HeritageSite['type'], typeof Landmark> = {
    shrine: Moon,
    mosque: Moon,
    necropolis: Landmark,
    khanqah: BookOpen,
  };
  const typeLabels: Record<HeritageSite['type'], string> = {
    shrine: t('muslim.shrine'),
    mosque: t('muslim.mosque'),
    necropolis: t('muslim.necropolis'),
    khanqah: t('muslim.caravanserai'),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {heritageSites.map((s) => {
          const Icon = typeIcons[s.type];
          return (
            <div
              key={s.id}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-sand-200 hover:shadow-medium transition-all cursor-pointer"
              onClick={() => {
                setSelected(s);
                trackSpotView(s.name, 'muslim');
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Icon className="h-2.5 w-2.5" /> {typeLabels[s.type]}
                  </span>
                  <h4 className="font-display text-lg font-bold text-white mt-1 drop-shadow">{s.name}</h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-deepblue-400 mb-1">{s.century}</p>
                <p className="text-sm text-deepblue-600 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-700">
                  {t('muslim.readMore')} <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {typeLabels[selected.type]}
              </span>
              <span className="text-xs text-deepblue-400">{selected.century}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-deepblue-900 mb-1">{selected.name}</h3>
            <p className="text-sm text-deepblue-400 mb-3">{selected.nameLocal}</p>
            <p className="text-sm text-deepblue-700 leading-relaxed mb-4">{selected.description}</p>
            <div className="flex items-center gap-2 text-sm text-deepblue-600 mb-4">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold hover:underline"
              >
                {t('muslim.directions')}
              </a>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              <strong>{t('muslim.significance')}:</strong> {selected.significance}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full rounded-xl bg-sand-100 py-2.5 text-sm font-medium text-deepblue-600 hover:bg-sand-200"
            >
              {t('muslim.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// === Etiquette + Jumu'ah + Eid ===
function EtiquettePanel() {
  const { t } = useLang();
  const iconMap: Record<string, typeof Shirt> = {
    Shirt, Footprints: Footprints, Users, Camera, Hand, Moon,
  };

  return (
    <div className="space-y-6">
      {/* Jumu'ah info */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-5 text-white shadow-medium">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" /> {t('muslim.jumuahSchedule')}
        </h3>
        <div className="space-y-2">
          {jumuahTimes.map((j) => (
            <div key={j.mosque} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5">
              <div>
                <p className="text-sm font-bold">{j.mosque}</p>
                <p className="text-xs text-emerald-200">{j.city} · {j.language}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-200">{t('muslim.khutbah')}</p>
                <p className="text-sm font-bold tabular-nums">{j.khutbahTime}</p>
                <p className="text-xs text-emerald-200">{t('muslim.prayer')}: {j.prayerTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eid info */}
      <div>
        <h3 className="font-display text-lg font-bold text-deepblue-900 mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" /> {t('muslim.eidInfo')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eidInfo.map((e) => (
            <div key={e.name} className="rounded-xl bg-white p-4 ring-1 ring-sand-200">
              <div className="flex items-center gap-2 mb-1">
                <Moon className="h-5 w-5 text-emerald-600" />
                <h4 className="font-bold text-deepblue-900">{e.name}</h4>
              </div>
              <p className="text-xs text-deepblue-400 mb-2">{e.nameLocal} · {e.date}</p>
              <p className="text-sm text-deepblue-600 mb-2">{e.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                  <Clock className="h-3 w-3" /> {t('muslim.prayer')}: {e.prayerTime}
                </span>
                <span className="text-deepblue-400">{e.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Etiquette tips */}
      <div>
        <h3 className="font-display text-lg font-bold text-deepblue-900 mb-3 flex items-center gap-2">
          <Info className="h-5 w-5 text-emerald-600" /> {t('muslim.etiquetteGuide')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {etiquetteTips.map((tip) => {
            const Icon = iconMap[tip.icon] ?? Info;
            return (
              <div key={tip.id} className="rounded-xl bg-white p-4 ring-1 ring-sand-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <Icon className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-deepblue-900 text-sm">{tip.title}</h4>
                    <p className="text-xs text-deepblue-400 mb-1">{tip.titleLocal}</p>
                    <p className="text-xs text-deepblue-600 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === Main wrapper ===
export default function MuslimTravel() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('prayer');

  const tabs: { key: Tab; label: string; icon: typeof Moon }[] = [
    { key: 'prayer', label: t('muslim.tabPrayer'), icon: Clock },
    { key: 'mosques', label: t('muslim.tabMosques'), icon: Moon },
    { key: 'halal', label: t('muslim.tabHalal'), icon: UtensilsCrossed },
    { key: 'heritage', label: t('muslim.tabHeritage'), icon: Landmark },
    { key: 'etiquette', label: t('muslim.tabEtiquette'), icon: BookOpen },
  ];

  return (
    <section id="muslim-travel" className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-3">
            <Moon className="h-3.5 w-3.5" /> Muslim-Friendly Travel
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('muslim.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('muslim.subtitle')}</p>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  tab === tb.key
                    ? 'bg-emerald-600 text-white shadow-subtle'
                    : 'bg-white text-deepblue-600 ring-1 ring-sand-300 hover:bg-sand-50'
                }`}
              >
                <Icon className="h-4 w-4" /> {tb.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-sand-50 p-4 sm:p-6 ring-1 ring-sand-200">
          {tab === 'prayer' && <PrayerTimesPanel />}
          {tab === 'mosques' && <MosqueFinderPanel />}
          {tab === 'halal' && <HalalDiningPanel />}
          {tab === 'heritage' && <HeritagePanel />}
          {tab === 'etiquette' && <EtiquettePanel />}
        </div>
      </div>
    </section>
  );
}
