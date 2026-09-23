import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Globe2,
  Building2,
  Calendar,
  Compass,
  Landmark,
  Sparkles,
  ArrowUpRight,
  PieChart,
  BarChart3,
  MapPin
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function TourismAnalytics() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'trends' | 'seasonality' | 'origins' | 'destinations'>('trends');

  const YEARLY_STATS = [
    { year: '2020', foreign: 38000, domestic: 420000, growth: '-65%' },
    { year: '2021', foreign: 65000, domestic: 780000, growth: '+71%' },
    { year: '2022', foreign: 112000, domestic: 1250000, growth: '+72%' },
    { year: '2023', foreign: 165000, domestic: 1680000, growth: '+47%' },
    { year: '2024', foreign: 200700, domestic: 2100000, growth: '+21%' },
    { year: '2025 (План)', foreign: 245000, domestic: 2500000, growth: '+22%' },
  ];

  const MONTHLY_SEASONALITY = [
    { month: 'Янв', count: 8500, label: 'Низкий' },
    { month: 'Фев', count: 9200, label: 'Низкий' },
    { month: 'Мар', count: 14800, label: 'Средний' },
    { month: 'Апр', count: 26500, label: 'Пик (Весна)' },
    { month: 'Май', count: 28000, label: 'Пик (Весна)' },
    { month: 'Июн', count: 18500, label: 'Средний' },
    { month: 'Июл', count: 16000, label: 'Жара' },
    { month: 'Авг', count: 19200, label: 'Средний' },
    { month: 'Сен', count: 29400, label: 'Пик (Осень)' },
    { month: 'Окт', count: 27100, label: 'Пик (Осень)' },
    { month: 'Ноя', count: 12300, label: 'Спад' },
    { month: 'Дек', count: 9800, label: 'Низкий' },
  ];

  const ORIGIN_COUNTRIES = [
    { country: 'Казахстан & СНГ', share: 28, count: '56,200', color: 'bg-blue-500' },
    { country: 'Россия & Беларусь', share: 24, count: '48,100', color: 'bg-indigo-500' },
    { country: 'Германия, Франция, ЕС', share: 18, count: '36,100', color: 'bg-emerald-500' },
    { country: 'Япония & Южная Корея', share: 12, count: '24,000', color: 'bg-amber-500' },
    { country: 'Китай & ЮВА', share: 10, count: '20,000', color: 'bg-rose-500' },
    { country: 'США & Другие страны', share: 8, count: '16,300', color: 'bg-purple-500' },
  ];

  const DESTINATION_BREAKDOWN = [
    { name: 'Музей И.В. Савицкого (Нукус)', share: '38%', visitors: '100,000+ / год', badge: 'Лувр в пустыне' },
    { name: 'Муйнак & Кладбище Кораблей Арала', share: '32%', visitors: '75,000+ / год', badge: 'Эко-туризм & Stixia' },
    { name: 'Некрополь Миздахан (Ходжейли)', share: '16%', visitors: '35,000+ / год', badge: 'Зиярат & Легенды' },
    { name: 'Крепости Топрак-Кала & Аяз-Кала', share: '14%', visitors: '28,000+ / год', badge: 'Древний Хорезм' },
  ];

  const maxMonthly = Math.max(...MONTHLY_SEASONALITY.map((m) => m.count));

  return (
    <div className="py-12 bg-sand-50/60 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/20 px-4 py-1.5 text-xs font-bold text-garnet-700 mb-3 border border-gold-400/30">
            <BarChart3 className="h-4 w-4 text-garnet-600" />
            ОФИЦИАЛЬНАЯ АНАЛИТИКА ТУРИЗМА КАРАКАЛПАКСТАНА (2020–2025)
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-ink-900 tracking-tight">
            Динамика Туристского Потока и Статистика
          </h1>
          <p className="mt-3 text-sm sm:text-base text-ink-600 leading-relaxed">
            Подробная статистика притока иностранных и внутренних туристов в Республику Каракалпакстан, ключевые локации, сезонность и инфографика развития региона.
          </p>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Иностр. Туристы (2024)</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Globe2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ink-900">200,700</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +21%
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">Рост против 165,000 в 2023 году</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Внутренний Туризм</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ink-900">2.1 млн</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +25%
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">Посещений из регионов Узбекистана</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Музей И.В. Савицкого</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Landmark className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ink-900">100k+</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Ежегодно
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">Главный культурный бренд КР</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-sand-200 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">Инфраструктура</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ink-900">107</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Отелей / Юрт
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">И 78 лицензированных гидов</p>
          </div>
        </div>

        {/* Tab Selector for Data Views */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-sand-200 pb-4">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trends'
                ? 'bg-garnet-600 text-white shadow-sm'
                : 'bg-white text-ink-700 border border-sand-200 hover:bg-sand-100'
            }`}
          >
            <TrendingUp className="h-4 w-4" /> 5-Летний Тренд (2020–2025)
          </button>
          <button
            onClick={() => setActiveTab('seasonality')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'seasonality'
                ? 'bg-garnet-600 text-white shadow-sm'
                : 'bg-white text-ink-700 border border-sand-200 hover:bg-sand-100'
            }`}
          >
            <Calendar className="h-4 w-4" /> Сезонность По Месяцам
          </button>
          <button
            onClick={() => setActiveTab('origins')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'origins'
                ? 'bg-garnet-600 text-white shadow-sm'
                : 'bg-white text-ink-700 border border-sand-200 hover:bg-sand-100'
            }`}
          >
            <PieChart className="h-4 w-4" /> Страны Прибытия
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'destinations'
                ? 'bg-garnet-600 text-white shadow-sm'
                : 'bg-white text-ink-700 border border-sand-200 hover:bg-sand-100'
            }`}
          >
            <MapPin className="h-4 w-4" /> Популярные Локации
          </button>
        </div>

        {/* Dynamic Data Panel */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-sand-200">
          {activeTab === 'trends' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">
                    Динамика Притока Иностранных Туристов
                  </h3>
                  <p className="text-xs text-ink-500">Восстановление и рост туристического сектора Каракалпакстана</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-garnet-600" /> Иностранные
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-amber-400" /> Внутренние (х10)
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {YEARLY_STATS.map((stat) => (
                  <div key={stat.year} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-ink-800">
                      <span>{stat.year} Год</span>
                      <div className="flex items-center gap-3">
                        <span className="text-garnet-600 font-extrabold">{stat.foreign.toLocaleString()} иностр.</span>
                        <span className="text-ink-400">({stat.growth})</span>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-sand-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-garnet-600 to-amber-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${(stat.foreign / 255000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seasonality' && (
            <div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-1">
                Сезонный График Притока Туристов По Месяцам
              </h3>
              <p className="text-xs text-ink-500 mb-6">
                Пиковые сезоны приходится на Апрель–Май (Весна) и Сентябрь–Октябрь (Осень).
              </p>

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-56 items-end pt-8 pb-4 border-b border-sand-200">
                {MONTHLY_SEASONALITY.map((m) => {
                  const heightPercent = (m.count / maxMonthly) * 100;
                  const isPeak = m.label.includes('Пик');
                  return (
                    <div key={m.month} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-bold text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {(m.count / 1000).toFixed(1)}k
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isPeak ? 'bg-gradient-to-t from-garnet-600 to-amber-500' : 'bg-sand-300 hover:bg-sand-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="mt-2 text-xs font-bold text-ink-700">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'origins' && (
            <div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-1">
                География Иностранных Туристов По Странам
              </h3>
              <p className="text-xs text-ink-500 mb-6">Откуда чаще всего приезжают путешественники в Нукус и Муйнак</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ORIGIN_COUNTRIES.map((item) => (
                  <div key={item.country} className="flex items-center justify-between p-4 rounded-2xl bg-sand-50 border border-sand-200">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-bold text-ink-900">{item.country}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-base font-extrabold text-ink-900">{item.share}%</span>
                      <span className="block text-[10px] text-ink-500">~{item.count} чел.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-1">
                Доля Посещаемости Ключевых Достопримечательностей
              </h3>
              <p className="text-xs text-ink-500 mb-6">Распределение внимания туристов по главным объектам региона</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DESTINATION_BREAKDOWN.map((dest) => (
                  <div key={dest.name} className="p-5 rounded-2xl bg-sand-50 border border-sand-200 flex flex-col justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-gold-400/20 px-2.5 py-0.5 text-[11px] font-bold text-garnet-700 mb-2">
                        {dest.badge}
                      </span>
                      <h4 className="font-display text-base font-bold text-ink-900">{dest.name}</h4>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between border-t border-sand-200/80 pt-3">
                      <span className="text-xs text-ink-500">Посещаемость:</span>
                      <span className="font-display text-sm font-extrabold text-garnet-700">{dest.visitors}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
