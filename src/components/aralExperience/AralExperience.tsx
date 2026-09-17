import { useState } from 'react';
import { Clock, Compass, Leaf } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { trackSpotView } from '@/lib/trackSpotView';
import AralTimeMachine from './AralTimeMachine';
import AdventureTours from './AdventureTours';
import EcoVolunteering from './EcoVolunteering';

type Tab = 'timeMachine' | 'tours' | 'eco';

const TABS: { id: Tab; icon: typeof Clock; labelKey: string }[] = [
  { id: 'timeMachine', icon: Clock, labelKey: 'aral.tabTimeMachine' },
  { id: 'tours', icon: Compass, labelKey: 'aral.tabTours' },
  { id: 'eco', icon: Leaf, labelKey: 'aral.tabEco' },
];

export default function AralExperience() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('timeMachine');

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const spotMap: Record<Tab, string> = {
      timeMachine: 'Aral Sea Time Machine',
      tours: 'Aral Sea Adventure Tours',
      eco: 'Aral Eco Volunteering',
    };
    trackSpotView(spotMap[tab], 'aral');
  };

  return (
    <section id="aral" className="py-20 bg-gradient-to-b from-sand-100 to-sand-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('aral.title')}</h2>
          <p className="mt-3 text-deepblue-600 max-w-2xl mx-auto">{t('aral.subtitle')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-white p-1.5 ring-1 ring-sand-200 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-terracotta-500 text-white shadow-subtle shadow-terracotta-500/20'
                      : 'text-deepblue-600 hover:bg-sand-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'timeMachine' && <AralTimeMachine />}
          {activeTab === 'tours' && <AdventureTours />}
          {activeTab === 'eco' && <EcoVolunteering />}
        </div>
      </div>
    </section>
  );
}
