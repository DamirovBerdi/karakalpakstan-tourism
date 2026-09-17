import { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { TRAVEL_MODES, type TravelMode } from '@/data/tours';

interface Props {
  activeMode: TravelMode | 'all';
  onModeChange: (mode: TravelMode | 'all') => void;
}

export default function TravelModeSelector({ activeMode, onModeChange }: Props) {
  const { t } = useLang();
  const [hovered, setHovered] = useState<TravelMode | 'all' | null>(null);

  return (
    <section className="bg-gradient-to-b from-sand-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900 mb-2">
            {t('mode.title')}
          </h2>
          <p className="text-deepblue-500 text-sm sm:text-base">{t('mode.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <button
            onClick={() => onModeChange('all')}
            onMouseEnter={() => setHovered('all')}
            onMouseLeave={() => setHovered(null)}
            className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 ${
              activeMode === 'all'
                ? 'border-deepblue-600 bg-deepblue-600 text-white shadow-medium scale-105'
                : 'border-sand-200 bg-white text-deepblue-700 hover:border-deepblue-300 hover:shadow-subtle'
            }`}
          >
            <span className="text-3xl sm:text-4xl">🌍</span>
            <span className="font-display font-bold text-sm sm:text-base">{t('mode.all')}</span>
          </button>

          {TRAVEL_MODES.map(({ mode, key, icon }) => {
            const isActive = activeMode === mode;
            const isHovered = hovered === mode;
            return (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                onMouseEnter={() => setHovered(mode)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 ${
                  isActive
                    ? 'border-terracotta-500 bg-terracotta-500 text-white shadow-medium scale-105'
                    : 'border-sand-200 bg-white text-deepblue-700 hover:border-terracotta-300 hover:shadow-subtle'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{icon}</span>
                <span className="font-display font-bold text-sm sm:text-base text-center leading-tight">
                  {t(key)}
                </span>
                {(isActive || isHovered) && (
                  <span
                    className={`text-[10px] sm:text-xs text-center leading-tight transition-opacity ${
                      isActive ? 'text-white/90' : 'text-deepblue-400'
                    }`}
                  >
                    {t(`${key}Desc`)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
