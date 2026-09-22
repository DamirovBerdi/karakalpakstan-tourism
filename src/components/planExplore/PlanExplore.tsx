import { useState } from 'react';
import {
  CalendarDays,
  Map,
  CloudSun,
  Landmark,
  Compass,
  Moon,
  Users,
  Wallet,
  Sparkles,
  Camera,
  Utensils,
  MapPin,
  Trophy
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import WeatherPacking from './WeatherPacking';
import ItineraryPlanner from './ItineraryPlanner';
import FestivalCalendar from './FestivalCalendar';

import VirtualTour from '@/components/heritage/VirtualTour';
import Museums from '@/components/heritage/Museums';
import Culture from '@/components/heritage/Culture';
import Cuisine from '@/components/heritage/Cuisine';
import GpsMap from '@/components/GpsMap';
import AroundMe from '@/components/AroundMe';
import MuslimTravel from '@/components/MuslimTravel';
import BudgetPlanner from '@/components/BudgetPlanner';
import CurrencyConverter from '@/components/CurrencyConverter';
import Reviews from '@/components/Reviews';
import Community from '@/components/Community';
import PhotoContest from '@/components/PhotoContest';
import Leaderboard from '@/components/Leaderboard';
import MiniGame from '@/components/MiniGame';

type CategoryTab = 'planner' | 'heritage' | 'map' | 'muslim' | 'community';

interface CategoryConfig {
  id: CategoryTab;
  icon: typeof CalendarDays;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  badgeRu: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'planner',
    icon: CalendarDays,
    titleRu: 'Планирование & Инструменты',
    titleEn: 'Planner & Weather',
    descRu: 'Погода, готовые маршруты, календарь фестивалей и калькулятор бюджета',
    descEn: 'Weather, packing tips, festival calendar & budget planner',
    badgeRu: 'ПОЛЕЗНО'
  },
  {
    id: 'heritage',
    icon: Landmark,
    titleRu: 'Культура & 360° Виртуальные Туры',
    titleEn: 'Heritage & 360° Tours',
    descRu: 'Музей Савицкого, 360° туры, ремесла и национальная кухня',
    descEn: 'Savitsky Museum, 360° virtual tours, crafts & nomadic food',
    badgeRu: '360° ИНТЕРАКТИВ'
  },
  {
    id: 'map',
    icon: MapPin,
    titleRu: 'GPS Карта & Локации Рядом',
    titleEn: 'GPS Map & Around Me',
    descRu: 'Интерактивная карта, банкоматы, рестораны и фотоспоты вокруг вас',
    descEn: 'Live GPS navigation, nearby ATMs, cafes & hidden photo spots',
    badgeRu: 'НАВИГАЦИЯ'
  },
  {
    id: 'muslim',
    icon: Moon,
    titleRu: 'Халяль & Зиярат Туризм',
    titleEn: 'Halal & Ziyarat Travel',
    descRu: 'Время намаза, направление Киблы, мечети и священные места',
    descEn: 'Prayer times, Qibla compass, halal dining & holy shrines',
    badgeRu: 'ХАЛЯЛЬ'
  },
  {
    id: 'community',
    icon: Users,
    titleRu: 'Сообщество & Квесты',
    titleEn: 'Community & Games',
    descRu: 'Отзывы туристов, чат, фотоконкурс, квесты и доска лидеров',
    descEn: 'Traveler reviews, community chat, photo contest & mini-game',
    badgeRu: 'ФАН & ИГРЫ'
  }
];

function SubLoader() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-7 w-7 animate-spin rounded-full border-3 border-gold-400 border-t-transparent" />
    </div>
  );
}

export default function PlanExplore() {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('planner');
  const [plannerSubTab, setPlannerSubTab] = useState<'weather' | 'itinerary' | 'festivals' | 'budget'>('weather');

  const isRu = lang === 'ru' || lang === 'kaa' || lang === 'uz';

  return (
    <section id="plan" className="py-16 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 border border-gold-400/30 px-3.5 py-1 text-xs font-semibold text-gold-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Интерактивный Хаб Категорий</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {isRu ? 'Всё о Каракалпакстане в Категориях' : 'Explore Karakalpakstan by Categories'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            {isRu
              ? 'Выберите категорию для глубокого погружения в культуру, GPS-навигацию, планирование маршрутов и общение'
              : 'Select a category below to explore 360° virtual tours, GPS maps, halal guides, weather & community'}
          </p>
        </div>

        {/* Master Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'border-gold-400 bg-gold-400/15 text-white ring-2 ring-gold-400/40 shadow-xl scale-[1.02]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                      isActive ? 'bg-gold-400 text-ink-950 font-bold' : 'bg-white/10 text-gold-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-gold-400 text-ink-950' : 'bg-white/10 text-gold-300'
                    }`}
                  >
                    {cat.badgeRu}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight mb-1">
                    {isRu ? cat.titleRu : cat.titleEn}
                  </h3>
                  <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                    {isRu ? cat.descRu : cat.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Active Content Area */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          {/* CATEGORY 1: PLANNER & WEATHER */}
          {activeCategory === 'planner' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-2xl bg-white/10 p-1.5 border border-white/10 text-xs sm:text-sm font-semibold">
                  <button
                    onClick={() => setPlannerSubTab('weather')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                      plannerSubTab === 'weather' ? 'bg-gold-400 text-ink-950 font-bold shadow-md' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <CloudSun className="h-4 w-4" />
                    <span>Погода & Чемодан</span>
                  </button>
                  <button
                    onClick={() => setPlannerSubTab('itinerary')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                      plannerSubTab === 'itinerary' ? 'bg-gold-400 text-ink-950 font-bold shadow-md' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Map className="h-4 w-4" />
                    <span>Маршруты</span>
                  </button>
                  <button
                    onClick={() => setPlannerSubTab('festivals')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                      plannerSubTab === 'festivals' ? 'bg-gold-400 text-ink-950 font-bold shadow-md' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Фестивали</span>
                  </button>
                  <button
                    onClick={() => setPlannerSubTab('budget')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                      plannerSubTab === 'budget' ? 'bg-gold-400 text-ink-950 font-bold shadow-md' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Бюджет & Валюта</span>
                  </button>
                </div>
              </div>

              {plannerSubTab === 'weather' && <WeatherPacking />}
              {plannerSubTab === 'itinerary' && <ItineraryPlanner />}
              {plannerSubTab === 'festivals' && <FestivalCalendar />}
              {plannerSubTab === 'budget' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BudgetPlanner />
                  <CurrencyConverter />
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 2: HERITAGE & 360° TOURS */}
          {activeCategory === 'heritage' && (
            <div className="space-y-12 animate-fade-in text-ink-900">
              <VirtualTour />
              <Museums />
              <Culture />
              <Cuisine />
            </div>
          )}

          {/* CATEGORY 3: MAP & AROUND ME */}
          {activeCategory === 'map' && (
            <div className="space-y-12 animate-fade-in text-ink-900">
              <GpsMap />
              <AroundMe />
            </div>
          )}

          {/* CATEGORY 4: MUSLIM TRAVEL & HALAL */}
          {activeCategory === 'muslim' && (
            <div className="animate-fade-in text-ink-900">
              <MuslimTravel />
            </div>
          )}

          {/* CATEGORY 5: COMMUNITY & GAMES */}
          {activeCategory === 'community' && (
            <div className="space-y-12 animate-fade-in text-ink-900">
              <Reviews />
              <Community />
              <PhotoContest />
              <MiniGame />
              <Leaderboard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
