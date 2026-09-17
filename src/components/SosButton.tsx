import { useState, useEffect } from 'react';
import { Siren, X, Phone, MapPin, Share2, ChevronDown, ShieldAlert } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const CALL_BUTTONS = [
  { key: 'sos.callPolice', number: '102', color: 'bg-deepblue-600 hover:bg-deepblue-700', icon: Siren },
  { key: 'sos.callTourist', number: '1173', color: 'bg-green-600 hover:bg-green-700', icon: Phone },
  { key: 'sos.callEmergency', number: '103', color: 'bg-terracotta-600 hover:bg-terracotta-700', icon: ShieldAlert },
];

const GUIDE_STEPS = ['sos.guide.1', 'sos.guide.2', 'sos.guide.3', 'sos.guide.4', 'sos.guide.5'];

type GpsLocation = { lat: number; lng: number } | null;

export default function SosButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<GpsLocation>(null);
  const [locating, setLocating] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const shareMessage = location
    ? `EMERGENCY: I need help. My exact location: ${location.lat}, ${location.lng}. Google Maps: https://maps.google.com/?q=${location.lat},${location.lng}`
    : '';

  useEffect(() => {
    if (open) getLocation();
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-terracotta-600 px-4 py-3.5 text-white shadow-elevated ring-4 ring-terracotta-600/20 transition-all hover:bg-terracotta-700 hover:scale-105 sm:px-5"
        aria-label="SOS Emergency"
      >
        <span className="absolute inset-0 rounded-full bg-terracotta-600 animate-pulse-ring" />
        <Siren className="h-6 w-6 relative" />
        <span className="font-display font-bold text-sm relative hidden sm:inline">SOS</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-elevated animate-fade-up max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-5 py-4 flex items-center justify-between text-white rounded-t-3xl z-10">
              <div className="flex items-center gap-2">
                <Siren className="h-6 w-6" />
                <div>
                  <h3 className="font-display text-lg font-bold leading-tight">{t('sos.title')}</h3>
                  <p className="text-xs text-white/80">{t('sos.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                {CALL_BUTTONS.map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <a
                      key={btn.key}
                      href={`tel:${btn.number}`}
                      className={`flex items-center gap-3 rounded-2xl ${btn.color} px-4 py-4 text-white transition-all hover:scale-[1.02] shadow-sm`}
                    >
                      <div className="rounded-xl bg-white/20 p-2.5">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{t(btn.key)}</p>
                        <p className="font-display text-xl font-bold">{btn.number}</p>
                      </div>
                      <Phone className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-sand-200">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="h-5 w-5 text-deepblue-600" />
                  <h4 className="font-display text-sm font-semibold text-deepblue-900">{t('sos.shareLocation')}</h4>
                </div>

                {locating && (
                  <p className="text-sm text-deepblue-500 text-center py-2">{t('safety.gpsLocating')}</p>
                )}

                {location && !locating && (
                  <>
                    <div className="rounded-lg bg-white p-3 mb-3 ring-1 ring-sand-100">
                      <p className="flex items-center gap-1.5 text-xs text-deepblue-500 mb-1">
                        <MapPin className="h-3 w-3" /> GPS
                      </p>
                      <p className="font-mono text-sm font-semibold text-deepblue-900">
                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-green-600 py-2.5 text-center text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                      >
                        {t('sos.shareWhatsApp')}
                      </a>
                      <a
                        href={`https://t.me/share/url?url=https://maps.google.com/?q=${location.lat},${location.lng}&text=${encodeURIComponent('EMERGENCY: I need help. My location:')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-deepblue-500 py-2.5 text-center text-xs font-semibold text-white hover:bg-deepblue-600 transition-colors"
                      >
                        {t('sos.shareTelegram')}
                      </a>
                    </div>
                  </>
                )}

                {!location && !locating && (
                  <button
                    onClick={getLocation}
                    className="w-full rounded-xl bg-deepblue-600 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-700 transition-colors"
                  >
                    {t('sos.getLocation')}
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-deepblue-100 overflow-hidden">
                <button
                  onClick={() => setGuideOpen(!guideOpen)}
                  className="w-full flex items-center justify-between bg-deepblue-50 px-4 py-3 text-left transition-colors hover:bg-deepblue-100"
                >
                  <span className="text-sm font-semibold text-deepblue-900">{t('sos.guideTitle')}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-deepblue-600 transition-transform ${guideOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {guideOpen && (
                  <div className="p-4 space-y-2.5 animate-fade-in">
                    {GUIDE_STEPS.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta-100 text-xs font-bold text-terracotta-600">
                          {i + 1}
                        </span>
                        <p className="text-sm text-deepblue-700 leading-relaxed">{t(step)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-xl bg-sand-100 py-2.5 text-sm font-medium text-deepblue-700 hover:bg-sand-200 transition-colors"
              >
                {t('sos.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
