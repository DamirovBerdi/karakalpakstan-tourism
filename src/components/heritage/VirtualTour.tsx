import { useState, useRef, useEffect } from 'react';
import { Camera, Clock, X, ArrowLeft, ArrowRight, Compass, Eye } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import type { Lang } from '@/lib/translations';
import { virtualTours } from '@/data/heritage';
import { trackSpotView } from '@/lib/trackSpotView';

export default function VirtualTour() {
  const { lang, t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [panAngle, setPanAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<number | null>(null);

  const active = virtualTours[activeIndex];

  const openViewer = (index: number) => {
    setActiveIndex(index);
    setShowViewer(true);
    setPanAngle(0);
    trackSpotView(virtualTours[index].name.en || '', 'heritage');
  };

  const closeViewer = () => setShowViewer(false);

  const navigate = (dir: 'prev' | 'next') => {
    setActiveIndex((prev) => {
      if (dir === 'prev') return (prev - 1 + virtualTours.length) % virtualTours.length;
      return (prev + 1) % virtualTours.length;
    });
    setPanAngle(0);
  };

  // Panorama drag handling
  useEffect(() => {
    if (!showViewer || !isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (dragStartRef.current === null) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const delta = clientX - dragStartRef.current;
      dragStartRef.current = clientX;
      setPanAngle((prev) => prev - delta * 0.3);
    };
    const onUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [showViewer, isDragging]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    dragStartRef.current = clientX;
  };

  return (
    <section id="virtual" className="py-16 sm:py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Camera className="h-3.5 w-3.5" />
            360° Virtual Experience
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('virtual.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600 leading-relaxed">{t('virtual.subtitle')}</p>
        </div>

        {/* Location grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {virtualTours.map((tour, i) => (
            <button
              key={tour.id}
              onClick={() => openViewer(i)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all hover:shadow-elevated hover:ring-deepblue-300 text-left"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.name[lang as Lang]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* 360 badge */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-terracotta-500 px-2.5 py-1 text-xs font-bold text-white shadow-medium">
                  <Compass className="h-3 w-3" /> 360°
                </span>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display text-sm font-bold text-white leading-tight mb-1">{tour.name[lang as Lang]}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <Clock className="h-3 w-3" /> {tour.duration}
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-white/90 px-4 py-2 shadow-elevated">
                  <span className="flex items-center gap-2 text-sm font-bold text-deepblue-800">
                    <Eye className="h-4 w-4" /> {t('virtual.launch')}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 360 Viewer Modal */}
      {showViewer && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-deepblue-900/80 backdrop-blur-sm" onClick={closeViewer} />

          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-elevated overflow-hidden animate-fade-up max-h-[92vh] flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 bg-white">
              <div className="min-w-0">
                <p className="text-xs text-deepblue-400">{t('virtual.viewing')}</p>
                <h3 className="font-display text-base sm:text-lg font-bold text-deepblue-900 truncate">{active.name[lang as Lang]}</h3>
              </div>
              <button
                onClick={closeViewer}
                className="flex-shrink-0 rounded-full bg-sand-100 p-2 text-deepblue-600 transition-colors hover:bg-sand-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panorama viewport */}
            <div
              className="relative flex-1 overflow-hidden bg-deepblue-900 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => handleStart(e.clientX)}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              style={{ minHeight: '320px' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${active.image})`,
                  backgroundSize: 'auto 100%',
                  backgroundRepeat: 'repeat-x',
                  backgroundPosition: `${panAngle}px center`,
                  transform: 'scale(1.15)',
                }}
              />

              {/* Vignette */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.5)]" />

              {/* Drag hint */}
              {!isDragging && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
                  {t('virtual.dragHint')}
                </div>
              )}

              {/* Tags */}
              <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap gap-1.5">
                {active.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer controls */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-sand-200 bg-sand-50">
              <button
                onClick={() => navigate('prev')}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-deepblue-700 ring-1 ring-sand-300 transition-colors hover:bg-sand-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('virtual.allLocations')}</span>
              </button>

              <p className="text-sm text-deepblue-500 text-center flex-1 truncate px-2">{active.description[lang as Lang]}</p>

              <button
                onClick={() => navigate('next')}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-deepblue-700 ring-1 ring-sand-300 transition-colors hover:bg-sand-100"
              >
                <span className="hidden sm:inline">{t('virtual.allLocations')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
