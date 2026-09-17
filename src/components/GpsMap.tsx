import { useState, useCallback } from 'react';
import { MapPin, Crosshair, Share2, Navigation, Loader2, Check } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { mapPoints, type MapPoint } from '@/data/tourism';

const POINT_COLORS: Record<MapPoint['category'], string> = {
  attraction: 'fill-terracotta-500',
  atm: 'fill-deepblue-500',
  restaurant: 'fill-sand-500',
  yurt: 'fill-deepblue-800',
};

// Approximate lat/lng bounds for the SVG map
const SVG_BOUNDS = {
  minLng: 54, maxLng: 66,
  minLat: 40, maxLat: 46,
};

function latLngToSvg(lat: number, lng: number, width = 100, height = 75) {
  const x = ((lng - SVG_BOUNDS.minLng) / (SVG_BOUNDS.maxLng - SVG_BOUNDS.minLng)) * width;
  const y = height - ((lat - SVG_BOUNDS.minLat) / (SVG_BOUNDS.maxLat - SVG_BOUNDS.minLat)) * height;
  return { x, y };
}

export default function GpsMap() {
  const { t } = useLang();
  const { user } = useAuth();
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const detectLocation = useCallback(() => {
    setLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLocating(false);
    },
    (err) => {
      setLocationError(err.message || 'Could not get your location');
      setLocating(false);
    },
    { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const shareLocation = useCallback(async () => {
    if (!userLocation || !user) return;
    const { error } = await supabase.from('location_shares').insert({
      lat: userLocation.lat,
      lng: userLocation.lng,
      label: 'My current location',
    });
    if (error) {
      setLocationError(error.message);
      return;
    }
    const shareUrl = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    if (navigator.share) {
      navigator.share({ title: 'My Location', url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      });
    }
  }, [userLocation, user]);

  const navigateToPoint = useCallback((point: MapPoint) => {
    // Convert SVG coords back to approx lat/lng for routing
    const lat = SVG_BOUNDS.minLat + ((75 - point.y) / 75) * (SVG_BOUNDS.maxLat - SVG_BOUNDS.minLat);
    const lng = SVG_BOUNDS.minLng + (point.x / 100) * (SVG_BOUNDS.maxLng - SVG_BOUNDS.minLng);
    const url = `https://maps.google.com/?daddr=${lat.toFixed(4)},${lng.toFixed(4)}`;
    window.open(url, '_blank');
  }, []);

  const userSvgPos = userLocation ? latLngToSvg(userLocation.lat, userLocation.lng) : null;

  return (
    <section id="gps-map" className="py-16 sm:py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Crosshair className="h-3.5 w-3.5" /> GPS & Geolocation
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('gps.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('gps.subtitle')}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={detectLocation}
            disabled={locating}
            className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-deepblue-700 disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
            {t('gps.detect')}
          </button>

          {userLocation && (
            <button
              onClick={shareLocation}
              disabled={!user}
              className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 disabled:opacity-50"
              title={!user ? t('gps.loginRequired') : ''}
            >
              {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {shared ? t('gps.linkCopied') : t('gps.share')}
            </button>
          )}
        </div>

        {locationError && (
          <div className="mx-auto mb-4 max-w-md rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-700">
            {locationError}
          </div>
        )}

        {userLocation && !user && (
          <p className="mx-auto mb-4 max-w-md text-center text-xs text-deepblue-500">{t('gps.loginRequired')}</p>
        )}

        {/* Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl bg-sand-50 ring-1 ring-sand-200 overflow-hidden aspect-[4/3]">
              <svg viewBox="0 0 100 75" className="h-full w-full">
                <rect x="0" y="0" width="100" height="75" fill="#FAF8F4" />
                <path
                  d="M 10,5 Q 25,12 30,25 Q 28,40 20,50 Q 15,65 25,70 L 80,70 Q 90,65 88,50 Q 92,35 85,20 Q 80,8 70,5 Z"
                  fill="#EAD183" stroke="#AD8A1F" strokeWidth="0.4" opacity="0.6"
                />
                <ellipse cx="32" cy="18" rx="10" ry="4" fill="#C9C1AE" opacity="0.5" />
                <text x="32" y="19" textAnchor="middle" fill="#443F35" fontSize="2.5" fontWeight="600">
                  {t('map.aralSea')}
                </text>
                <path d="M 45,35 Q 55,40 65,55" fill="none" stroke="#948B77" strokeWidth="0.8" opacity="0.5" />
                <circle cx="56" cy="37" r="1.5" fill="#443F35" />
                <text x="59" y="38" fill="#443F35" fontSize="3" fontWeight="700">{t('map.nukus')}</text>
                <circle cx="39" cy="24" r="1" fill="#443F35" />
                <text x="41" y="25" fill="#443F35" fontSize="2.5" fontWeight="600">{t('map.moynaq')}</text>

                {/* Tourist points */}
                {mapPoints.map((point) => (
                  <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r={selectedPoint?.id === point.id ? 2.5 : 1.8}
                    className={`${POINT_COLORS[point.category]} cursor-pointer transition-all`}
                    stroke="white"
                    strokeWidth="0.3"
                    onClick={() => setSelectedPoint(point)}
                  />
                ))}

                {/* User location */}
                {userSvgPos && (
                  <>
                    <circle cx={userSvgPos.x} cy={userSvgPos.y} r="3" fill="#3b82f6" opacity="0.3">
                      <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={userSvgPos.x} cy={userSvgPos.y} r="1.5" fill="#3b82f6" stroke="white" strokeWidth="0.4" />
                  </>
                )}
              </svg>

              {selectedPoint && (
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 backdrop-blur-sm px-4 py-3 shadow-medium ring-1 ring-sand-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-deepblue-900 truncate">{selectedPoint.name}</p>
                      <p className="text-xs text-deepblue-500 capitalize">{selectedPoint.category}</p>
                    </div>
                    <button
                      onClick={() => navigateToPoint(selectedPoint)}
                      className="flex items-center gap-1.5 rounded-lg bg-deepblue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-deepblue-700 flex-shrink-0"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {t('gps.navigate')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="rounded-2xl bg-sand-50 ring-1 ring-sand-200 p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-display text-base font-semibold text-deepblue-900 mb-3">{t('gps.points')}</h3>
            <div className="space-y-2">
              {mapPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`w-full flex items-center gap-2 rounded-xl p-3 text-left transition-all ${
                    selectedPoint?.id === point.id
                      ? 'bg-white shadow-subtle ring-1 ring-terracotta-200'
                      : 'bg-white/60 hover:bg-white'
                  }`}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-deepblue-500" />
                  <span className="text-sm font-medium text-deepblue-900 truncate">{point.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
