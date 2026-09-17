import { useState } from 'react';
import { CalendarDays, Map, CloudSun } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import WeatherPacking from './WeatherPacking';
import ItineraryPlanner from './ItineraryPlanner';
import FestivalCalendar from './FestivalCalendar';
import type { Lang } from '@/lib/translations';

type Tab = 'weather' | 'itinerary' | 'festivals';

const TABS: { id: Tab; icon: typeof CalendarDays; labelKey: string }[] = [
  { id: 'weather', icon: CloudSun, labelKey: 'plan.tabWeather' },
  { id: 'itinerary', icon: Map, labelKey: 'plan.tabItinerary' },
  { id: 'festivals', icon: CalendarDays, labelKey: 'plan.tabFestivals' },
];

export default function PlanExplore() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('weather');

  return (
    <section id="plan" className="py-20 bg-gradient-to-b from-sand-50 to-sand-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('plan.title')}</h2>
          <p className="mt-3 text-deepblue-600 max-w-2xl mx-auto">{t('plan.subtitle')}</p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-white p-1.5 ring-1 ring-sand-200 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-deepblue-600 text-white shadow-subtle shadow-deepblue-600/20'
                      : 'text-deepblue-600 hover:bg-sand-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xs:inline sm:inline">{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'weather' && <WeatherPacking />}
          {activeTab === 'itinerary' && <ItineraryPlanner />}
          {activeTab === 'festivals' && <FestivalCalendar />}
        </div>
      </div>
    </section>
  );
}

// Re-export the lang type for convenience
export type { Lang };
