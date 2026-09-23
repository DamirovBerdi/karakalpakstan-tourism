import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Crosshair,
  Share2,
  Navigation,
  Loader2,
  Check,
  Layers,
  ExternalLink,
  Compass,
  Building2,
  Utensils,
  Tent,
  Landmark,
  Globe
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { mapPoints, type MapPoint } from '@/data/tourism';

// Leaflet CDN URLs
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

// Category Badge Icons & Colors
const CATEGORY_META: Record<MapPoint['category'], { icon: typeof Landmark; color: string; labelRu: string }> = {
  attraction: { icon: Landmark, color: '#e11d48', labelRu: 'Достопримечательность' },
  atm: { icon: Building2, color: '#2563eb', labelRu: 'Банкомат / Обмен' },
  restaurant: { icon: Utensils, color: '#059669', labelRu: 'Ресторан / Кафе' },
  yurt: { icon: Tent, color: '#d97706', labelRu: 'Юртовый лагерь' },
};

export default function GpsMap() {
  const { t, lang } = useLang();
  const { user } = useAuth();

  const [selectedPoint, setSelectedPoint] = useState<MapPoint>(mapPoints[0]);
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<number, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  // 1. Dynamically Load Leaflet JS & CSS
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = LEAFLET_JS;
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!L) return;

    // Default center on Karakalpakstan (Nukus)
    const map = L.map(mapContainerRef.current, {
      center: [selectedPoint.lat, selectedPoint.lng],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Satellite tile layer (Esri World Imagery)
    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    // Street tile layer (OpenStreetMap)
    const streetLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    const activeTile = mapType === 'satellite' ? satLayer : streetLayer;
    activeTile.addTo(map);
    tileLayerRef.current = activeTile;
    mapInstanceRef.current = map;

    // Add Markers for all map points
    mapPoints.forEach((point) => {
      const meta = CATEGORY_META[point.category];
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${meta.color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: transform 0.2s ease;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${point.nameRu || point.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">${point.descRu || ''}</p>
          <a href="https://maps.google.com/?daddr=${point.lat},${point.lng}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            background: #e11d48;
            color: white;
            text-decoration: none;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
          ">Маршрут в Google Maps ➔</a>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedPoint(point);
      });

      markersRef.current.set(point.id, marker);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded]);

  // 3. Switch Tile Layer (Satellite vs Street)
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!L) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer =
      mapType === 'satellite'
        ? L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { maxZoom: 18, attribution: 'Tiles &copy; Esri' }
          )
        : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
          });

    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapType, leafletLoaded]);

  // 4. Pan/FlyTo when Selected Point Changes
  const handleSelectPoint = (point: MapPoint) => {
    setSelectedPoint(point);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 14, {
        duration: 1.5,
      });

      const marker = markersRef.current.get(point.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // 5. Detect User Geolocation
  const detectLocation = useCallback(() => {
    setLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Геолокация не поддерживается вашим браузером');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setLocating(false);

        if (mapInstanceRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const L = (window as any).L;
          if (L) {
            if (userMarkerRef.current) {
              mapInstanceRef.current.removeLayer(userMarkerRef.current);
            }

            const userIcon = L.divIcon({
              className: 'user-gps-marker',
              html: `
                <div style="position: relative; width: 24px; height: 24px;">
                  <div style="position: absolute; inset: 0; background-color: #3b82f6; border-radius: 50%; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="position: absolute; inset: 4px; background-color: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<b>Вы находитесь здесь</b>')
              .openPopup();

            mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
          }
        }
      },
      (err) => {
        setLocationError(err.message || 'Не удалось определить геолокацию');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // 6. Share Location
  const shareLocation = useCallback(async () => {
    if (!userLocation || !user) return;
    const { error } = await supabase.from('location_shares').insert({
      lat: userLocation.lat,
      lng: userLocation.lng,
      label: 'Моя текущая геолокация',
    });
    if (error) {
      setLocationError(error.message);
      return;
    }
    const shareUrl = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    if (navigator.share) {
      navigator.share({ title: 'Моя локация в Узбекистане', url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      });
    }
  }, [userLocation, user]);

  return (
    <section id="gps-map" className="py-16 sm:py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Crosshair className="h-3.5 w-3.5" /> {t('gps.satHeader')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">
            {t('gps.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">
            {t('gps.subtitle')}
          </p>
        </div>

        {/* Top Control Bar (GPS & Layer Switcher) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-sand-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={detectLocation}
              disabled={locating}
              className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-deepblue-700 disabled:opacity-60 shadow-sm"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
              {t('gps.detect')}
            </button>

            {userLocation && (
              <button
                onClick={shareLocation}
                disabled={!user}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 disabled:opacity-50 shadow-sm"
              >
                {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {shared ? t('gps.linkCopied') : t('gps.share')}
              </button>
            )}
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center rounded-xl bg-sand-100 p-1 border border-sand-200">
            <button
              onClick={() => setMapType('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapType === 'satellite' ? 'bg-deepblue-900 text-white shadow-xs' : 'text-deepblue-700 hover:text-black'
              }`}
            >
              <Globe className="h-3.5 w-3.5" /> {t('gps.satellite')}
            </button>
            <button
              onClick={() => setMapType('street')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapType === 'street' ? 'bg-deepblue-900 text-white shadow-xs' : 'text-deepblue-700 hover:text-black'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> {t('gps.street')}
            </button>
          </div>
        </div>

        {locationError && (
          <div className="mx-auto mb-4 max-w-md rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-700">
            {locationError}
          </div>
        )}

        {/* Map and Points Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Leaflet Satellite Map Container (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="relative rounded-2xl bg-sand-200 border border-sand-300 overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[540px] shadow-inner">
              {/* Map Mount Point */}
              <div ref={mapContainerRef} className="h-full w-full z-0" />

              {!leafletLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-sand-100/90 backdrop-blur-xs z-10">
                  <Loader2 className="h-8 w-8 text-deepblue-600 animate-spin mb-2" />
                  <span className="text-sm font-semibold text-deepblue-800">{t('gps.loadingMap')}</span>
                </div>
              )}
            </div>

            {/* Selected Location Details Card */}
            {selectedPoint && (
              <div className="rounded-2xl bg-white p-5 border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-terracotta-100 px-2.5 py-0.5 text-xs font-bold text-terracotta-700">
                      {CATEGORY_META[selectedPoint.category].labelRu}
                    </span>
                    <span className="text-xs font-mono font-semibold text-ink-500">
                      GPS: {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-deepblue-950">
                    {lang === 'en' ? selectedPoint.name : selectedPoint.nameRu || selectedPoint.name}
                  </h3>
                  <p className="text-xs text-ink-600">{selectedPoint.descRu || selectedPoint.address}</p>
                </div>

                <a
                  href={`https://maps.google.com/?daddr=${selectedPoint.lat},${selectedPoint.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-terracotta-600 shrink-0 shadow-xs"
                >
                  <Navigation className="h-4 w-4" /> {t('gps.routeBtn')} <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </div>
            )}
          </div>

          {/* Interactive Locations List (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-white p-4 border border-sand-200 shadow-sm max-h-[620px] flex flex-col">
            <h3 className="font-display text-base font-bold text-deepblue-950 mb-3 px-2 flex items-center justify-between">
              <span>{t('gps.locationsList')}</span>
              <span className="text-xs font-semibold text-ink-500">{mapPoints.length} {t('gps.placesCount')}</span>
            </h3>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {mapPoints.map((point) => {
                const isSelected = selectedPoint.id === point.id;
                const meta = CATEGORY_META[point.category];
                const IconComponent = meta.icon;

                return (
                  <button
                    key={point.id}
                    onClick={() => handleSelectPoint(point)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/40 shadow-xs'
                        : 'bg-sand-50/60 border-sand-200 hover:border-sand-300 hover:bg-sand-100/60'
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white mt-0.5 shadow-xs"
                      style={{ backgroundColor: meta.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-bold text-ink-900 truncate">
                        {lang === 'en' ? point.name : point.nameRu || point.name}
                      </h4>
                      <p className="text-xs text-ink-500 truncate mt-0.5">
                        {point.nameRu || point.address}
                      </p>
                      <span className="inline-block text-[10px] font-mono text-ink-400 mt-1">
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </span>
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
