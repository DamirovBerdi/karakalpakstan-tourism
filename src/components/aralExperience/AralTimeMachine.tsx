import { useState, useRef, useEffect } from 'react';
import { Clock, Waves, TrendingDown, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { aralTimeline } from '@/data/aralExperience';
import type { Lang } from '@/lib/translations';

const MAX_AREA = 68900;

function formatArea(area: number, lang: Lang): string {
  const km2 = lang === 'ru' ? 'км²' : 'km²';
  return `${area.toLocaleString()} ${km2}`;
}

export default function AralTimeMachine() {
  const { t, lang } = useLang();
  const [index, setIndex] = useState(0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const current = aralTimeline[index];
  const areaPercent = Math.round((current.area / MAX_AREA) * 100);
  const nextIndex = Math.min(index + 1, aralTimeline.length - 1);
  const prevIndex = Math.max(index - 1, 0);

  useEffect(() => {
    if (sliderRef.current) sliderRef.current.value = String(index);
  }, [index]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-deepblue-900">{t('aral.timeMachine.title')}</h3>
        <p className="mt-1.5 text-sm text-deepblue-600">{t('aral.timeMachine.desc')}</p>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm font-medium text-deepblue-700">
            <Clock className="h-4 w-4 text-terracotta-500" />
            {t('aral.timeMachine.year')}
          </span>
          <span className="font-display text-3xl font-bold text-terracotta-600 tabular-nums">{current.year}</span>
        </div>

        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={aralTimeline.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer aral-slider"
          style={{
            background: `linear-gradient(to right, #443F35 ${areaPercent}%, #AD8A1F ${areaPercent}%)`,
          }}
        />

        <div className="flex justify-between mt-1.5 text-[10px] text-deepblue-400 font-medium">
          <span>1960</span>
          <span className="text-terracotta-500 font-semibold">{t('aral.timeMachine.dragHint')}</span>
          <span>2024</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-deepblue-50 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Waves className="h-4 w-4 text-deepblue-500" />
              <span className="text-xs font-medium text-deepblue-600">{t('aral.timeMachine.area')}</span>
            </div>
            <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">{formatArea(current.area, lang)}</p>
            <div className="mt-2 h-2 rounded-full bg-deepblue-100 overflow-hidden">
              <div
                className="h-full bg-deepblue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${areaPercent}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl bg-terracotta-50 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown className="h-4 w-4 text-terracotta-500" />
              <span className="text-xs font-medium text-terracotta-700">{t('aral.timeMachine.level')}</span>
            </div>
            <p className="font-display text-xl font-bold text-terracotta-700 tabular-nums">
              {current.levelDrop > 0 ? `−${current.levelDrop} m` : '0 m'}
            </p>
            <div className="mt-2 h-2 rounded-full bg-terracotta-100 overflow-hidden">
              <div
                className="h-full bg-terracotta-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((current.levelDrop / 31) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-sand-50 p-4">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="h-5 w-5 text-sand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-sand-800 uppercase tracking-wide mb-1">{t('aral.timeMachine.fact')}</p>
              <p className="text-sm text-deepblue-800 leading-relaxed">{current.fact[lang]}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {current.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-terracotta-500" />
              <p className="text-sm text-deepblue-600 leading-relaxed">{m[lang]}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex(prevIndex)}
            disabled={index === 0}
            className="flex items-center gap-1 rounded-lg bg-sand-100 px-3 py-2 text-xs font-medium text-deepblue-700 hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {aralTimeline[prevIndex]?.year}
          </button>
          <span className="text-xs text-deepblue-400 font-medium tabular-nums">
            {index + 1} / {aralTimeline.length}
          </span>
          <button
            onClick={() => setIndex(nextIndex)}
            disabled={index === aralTimeline.length - 1}
            className="flex items-center gap-1 rounded-lg bg-sand-100 px-3 py-2 text-xs font-medium text-deepblue-700 hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {aralTimeline[nextIndex]?.year}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
