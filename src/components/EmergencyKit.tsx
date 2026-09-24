import { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  Navigation,
  Languages,
  AlertTriangle,
  Copy,
  Volume2,
  Phone,
  MessageCircle,
  X,
  MapPin,
  Crosshair,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { safetyPhrases, tourGroupMeetingPoints, type SafetyPhrase } from '@/data/tourism';

type GpsLocation = { lat: number; lng: number; accuracy: number } | null;

const EMERGENCY_NUMBERS = [
  { labelKey: 'safety.sosPolice', number: '102' },
  { labelKey: 'safety.sosAmbulance', number: '103' },
  { labelKey: 'safety.sosGeneral', number: '112' },
  { labelKey: 'safety.sosTouristHotline', number: '1173' },
];

const PHRASE_CATEGORIES = [
  { key: 'safety.translatorEmergency', value: 'emergency' as const },
  { key: 'safety.translatorDirections', value: 'directions' as const },
  { key: 'safety.translatorCommunication', value: 'communication' as const },
  { key: 'safety.translatorMeeting', value: 'meeting' as const },
];

function CompassWidget() {
  const { t } = useLang();
  const [heading, setHeading] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    let handler: ((e: DeviceOrientationEvent) => void) | null = null;
    function setup() {
      if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
        setSupported(false);
        return;
      }
      handler = (e: DeviceOrientationEvent) => {
        if (e.alpha != null) setHeading(360 - e.alpha);
      };
      window.addEventListener('deviceorientation', handler);
    }
    setup();
    return () => {
      if (handler) window.removeEventListener('deviceorientation', handler);
    };
  }, []);

  const cardinals = ['N', 'E', 'S', 'W'];
  const cardinal = heading != null ? cardinals[Math.round(heading / 90) % 4] : '—';

  return (
    <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="h-5 w-5 text-deepblue-600" />
        <h3 className="font-display text-base font-semibold text-deepblue-900">{t('safety.compass')}</h3>
      </div>
      {supported ? (
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40 rounded-full border-4 border-sand-200 bg-sand-50">
            {cardinals.map((c, i) => (
              <span
                key={c}
                className="absolute font-display text-sm font-bold text-deepblue-700"
                style={{
                  top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%',
                  bottom: i === 2 ? '4px' : 'auto',
                  left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%',
                  right: i === 1 ? '4px' : 'auto',
                  transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)',
                }}
              >
                {c}
              </span>
            ))}
            <div
              className="absolute top-1/2 left-1/2 h-16 w-0.5 origin-bottom bg-terracotta-500 transition-transform duration-150"
              style={{ transform: `translate(-50%, -100%) rotate(${heading ?? 0}deg)` }}
            />
            <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deepblue-700" />
          </div>
          <p className="mt-4 text-center">
            <span className="font-display text-2xl font-bold text-deepblue-900">{Math.round(heading ?? 0)}°</span>
            <span className="ml-2 text-lg font-semibold text-terracotta-600">{cardinal}</span>
          </p>
          <p className="text-xs text-deepblue-500 mt-1">{t('safety.compassHeading')}</p>
        </div>
      ) : (
        <p className="text-sm text-deepblue-500 text-center py-8">{t('safety.compassNoSensor')}</p>
      )}
    </div>
  );
}

function GpsMap() {
  const { t } = useLang();
  const [location, setLocation] = useState<GpsLocation>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'error' | 'ready'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg(t('safety.gpsNotSupported'));
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setStatus('ready');
      },
      () => {
        setStatus('error');
        setErrorMsg(t('safety.gpsNotSupported'));
      },
      { enableHighAccuracy: true }
    );
  }, [t]);

  const gpsX = location ? 50 + (location.lng - 59) * 5 : null;
  const gpsY = location ? 50 - (location.lat - 43) * 5 : null;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-deepblue-600" />
          <h3 className="font-display text-base font-semibold text-deepblue-900">{t('safety.gps')}</h3>
        </div>
        <button
          onClick={getLocation}
          className="rounded-lg bg-deepblue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-deepblue-700 flex items-center gap-1.5"
        >
          <Crosshair className="h-3.5 w-3.5" />
          {status === 'locating' ? t('safety.gpsLocating') : t('safety.gpsMyLocation')}
        </button>
      </div>

      <div className="relative rounded-xl bg-sand-50 ring-1 ring-sand-200 overflow-hidden aspect-video mb-4">
        <svg viewBox="0 0 100 60" className="h-full w-full">
          <rect x="0" y="0" width="100" height="60" fill="#FAF8F4" />
          <path
            d="M 10,5 Q 25,10 30,20 Q 28,35 20,45 Q 15,55 25,58 L 80,58 Q 90,55 88,40 Q 92,25 85,15 Q 80,5 70,5 Z"
            fill="#EAD183"
            stroke="#AD8A1F"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <ellipse cx="32" cy="15" rx="8" ry="3" fill="#C9C1AE" opacity="0.5" />
          <text x="32" y="16" textAnchor="middle" fill="#443F35" fontSize="2" fontWeight="600">
            {t('map.aralSea')}
          </text>
          {tourGroupMeetingPoints.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x * 0.8 + 10} cy={pt.y * 0.7 + 5} r="1.2" fill="#443F35" />
              <text x={pt.x * 0.8 + 12} y={pt.y * 0.7 + 6} fill="#443F35" fontSize="1.5">
                {pt.name}
              </text>
            </g>
          ))}
          {gpsX != null && gpsY != null && (
            <g>
              <circle cx={gpsX} cy={gpsY} r="3" fill="#A31E3D" opacity="0.3" className="animate-pulse" />
              <circle cx={gpsX} cy={gpsY} r="1.5" fill="#A31E3D" stroke="white" strokeWidth="0.3" />
              <text x={gpsX + 2} y={gpsY + 1} fill="#8A1833" fontSize="1.8" fontWeight="700">
                {t('safety.gpsMyLocation')}
              </text>
            </g>
          )}
        </svg>
      </div>

      {status === 'error' && <p className="text-sm text-terracotta-600">{errorMsg}</p>}
      {status === 'ready' && location && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-sand-50 p-2.5">
            <p className="text-xs text-deepblue-400">Latitude</p>
            <p className="font-mono font-semibold text-deepblue-900">{location.lat.toFixed(5)}</p>
          </div>
          <div className="rounded-lg bg-sand-50 p-2.5">
            <p className="text-xs text-deepblue-400">Longitude</p>
            <p className="font-mono font-semibold text-deepblue-900">{location.lng.toFixed(5)}</p>
          </div>
          <div className="rounded-lg bg-sand-50 p-2.5">
            <p className="text-xs text-deepblue-400">{t('safety.gpsAccuracy')}</p>
            <p className="font-mono font-semibold text-deepblue-900">±{Math.round(location.accuracy)}m</p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-medium text-deepblue-400 mb-2">{t('safety.gpsMeetingPoints')}</p>
        <div className="flex flex-wrap gap-1.5">
          {tourGroupMeetingPoints.map((pt, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-sand-50 px-2 py-1 text-xs text-deepblue-600 ring-1 ring-sand-100"
            >
              <MapPin className="h-3 w-3 text-deepblue-400" /> {pt.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TranslatorWidget() {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<SafetyPhrase['category']>('emergency');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = safetyPhrases.filter((p) => p.category === activeCategory);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const bcpMap: Record<string, string> = {
        ru: 'ru-RU',
        en: 'en-US',
        uz: 'uz-UZ',
        kaa: 'uz-UZ',
      };
      const bcp47 = bcpMap[lang] || 'ru-RU';
      utterance.lang = bcp47;
      const voices = speechSynthesis.getVoices();
      const langPrefix = bcp47.split('-')[0].toLowerCase();
      const langVoices = voices.filter((v) => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === bcp47.toLowerCase() || vLang.startsWith(langPrefix);
      });
      if (langVoices.length > 0) {
        utterance.voice = langVoices[0];
      }
      speechSynthesis.speak(utterance);
    }
  };

  const copy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6 lg:col-span-2">
      <div className="flex items-center gap-2 mb-1">
        <Languages className="h-5 w-5 text-deepblue-600" />
        <h3 className="font-display text-base font-semibold text-deepblue-900">{t('safety.translator')}</h3>
      </div>
      <p className="text-xs text-deepblue-500 mb-4">{t('safety.translatorDesc')}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {PHRASE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat.value
                ? 'bg-deepblue-600 text-white'
                : 'bg-sand-100 text-deepblue-700 hover:bg-sand-200'
            }`}
          >
            {t(cat.key)}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
        {filtered.map((phrase) => (
          <div key={phrase.id} className="rounded-xl bg-sand-50 p-3 ring-1 ring-sand-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-deepblue-900">
                  {phrase.translations[lang] ?? phrase.translations.en}
                </p>
                {lang !== 'en' && <p className="mt-0.5 text-xs text-deepblue-500 italic">{phrase.translations.en}</p>}
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => speak(phrase.translations[lang] ?? phrase.translations.en)}
                  className="rounded-lg p-1.5 text-deepblue-500 hover:bg-deepblue-50 transition-colors"
                  aria-label="Speak"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => copy(phrase.translations[lang] ?? phrase.translations.en, phrase.id)}
                  className="rounded-lg p-1.5 text-deepblue-500 hover:bg-deepblue-50 transition-colors"
                  aria-label="Copy"
                >
                  <Copy className={`h-4 w-4 ${copiedId === phrase.id ? 'text-terracotta-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SosWidget() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState<GpsLocation>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleSos = () => {
    setModalOpen(true);
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
          setGettingLocation(false);
        },
        () => setGettingLocation(false),
        { enableHighAccuracy: true }
      );
    } else {
      setGettingLocation(false);
    }
  };

  const mapsLink = location ? `https://maps.google.com/?q=${location.lat},${location.lng}` : '';
  const sosMessage = location
    ? `EMERGENCY! I need help. My location: ${location.lat}, ${location.lng} (accuracy: ±${Math.round(location.accuracy)}m). Google Maps: ${mapsLink}`
    : '';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-display text-base font-semibold">{t('safety.sos')}</h3>
      </div>
      <p className="text-sm text-white/90 mb-4">{t('safety.sosDesc')}</p>

      <button
        onClick={handleSos}
        className="w-full rounded-xl bg-white py-4 font-display text-lg font-bold text-terracotta-600 transition-all hover:bg-sand-50 hover:shadow-medium flex items-center justify-center gap-2"
      >
        <AlertTriangle className="h-5 w-5" /> {t('safety.sosBtn')}
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 text-deepblue-900 shadow-elevated animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-terracotta-600">{t('safety.sosModal')}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 hover:bg-sand-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {gettingLocation && (
              <p className="text-sm text-deepblue-600 text-center py-4">{t('safety.sosGettingLocation')}</p>
            )}

            {location && !gettingLocation && (
              <div className="space-y-3">
                <div className="rounded-xl bg-sand-50 p-3 text-sm">
                  <p className="font-mono text-deepblue-900">
                    {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </p>
                  <p className="text-xs text-deepblue-500 mt-1">
                    {t('safety.gpsAccuracy')}: ±{Math.round(location.accuracy)}m
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(sosMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-green-600 py-3 text-center text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4" /> {t('safety.sosShareWhatsApp')}
                  </a>
                  <a
                    href={`sms:?body=${encodeURIComponent(sosMessage)}`}
                    className="rounded-xl bg-deepblue-600 py-3 text-center text-sm font-semibold text-white hover:bg-deepblue-700 flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4" /> {t('safety.sosShareSMS')}
                  </a>
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-sand-100 pt-4">
              <p className="text-xs font-semibold text-deepblue-700 mb-2">{t('safety.sosEmergencyNumbers')}</p>
              <div className="grid grid-cols-2 gap-2">
                {EMERGENCY_NUMBERS.map((num) => (
                  <a
                    key={num.number}
                    href={`tel:${num.number}`}
                    className="flex items-center gap-2 rounded-lg bg-terracotta-50 px-3 py-2 text-sm font-medium text-terracotta-700 hover:bg-terracotta-100 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <div>
                      <p className="text-xs">{t(num.labelKey)}</p>
                      <p className="font-bold">{num.number}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmergencyKit() {
  const { t } = useLang();

  return (
    <section id="safety" className="py-20 bg-deepblue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">{t('safety.title')}</h2>
          <p className="mt-3 text-sand-300">{t('safety.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CompassWidget />
          <GpsMap />
          <TranslatorWidget />
          <SosWidget />
        </div>
      </div>
    </section>
  );
}
