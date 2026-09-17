import { Car, Bus, Train, Truck, Clock, MapPin, DollarSign } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { transportRoutes, type TransportRoute } from '@/data/tourism';

const MODE_ICONS: Record<TransportRoute['mode'], typeof Car> = {
  taxi: Car,
  bus: Bus,
  train: Train,
  jeep: Truck,
};

const MODE_COLORS: Record<TransportRoute['mode'], string> = {
  taxi: 'bg-terracotta-50 text-terracotta-600 ring-terracotta-200',
  bus: 'bg-deepblue-50 text-deepblue-600 ring-deepblue-200',
  train: 'bg-sand-100 text-sand-700 ring-sand-300',
  jeep: 'bg-deepblue-900 text-sand-300 ring-deepblue-700',
};

export default function Transport() {
  const { t } = useLang();

  return (
    <section id="transport" className="py-20 bg-sand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('transport.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('transport.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {transportRoutes.map((route) => {
            const Icon = MODE_ICONS[route.mode];
            const colorClass = MODE_COLORS[route.mode];
            return (
              <div
                key={route.id}
                className="rounded-2xl bg-white shadow-sm ring-1 ring-sand-200 p-5 transition-all duration-300 hover:shadow-medium"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-xl p-2.5 ring-1 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-md bg-sand-50 px-2.5 py-1 text-xs font-medium text-deepblue-600">
                    {t(`transport.${route.mode}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-deepblue-400">{t('transport.from')}</p>
                    <p className="font-semibold text-deepblue-900">{route.from}</p>
                  </div>
                  <div className="text-deepblue-300">→</div>
                  <div className="flex-1">
                    <p className="text-xs text-deepblue-400">{t('transport.to')}</p>
                    <p className="font-semibold text-deepblue-900">{route.to}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-deepblue-600">
                    <Clock className="h-4 w-4 text-sand-500" />
                    <span className="text-deepblue-400">{t('transport.departure')}:</span>
                    <span className="font-medium">{route.departure}</span>
                  </div>
                  <div className="flex items-center gap-2 text-deepblue-600">
                    <MapPin className="h-4 w-4 text-sand-500" />
                    <span className="text-deepblue-400">{t('transport.duration')}:</span>
                    <span className="font-medium">{route.duration}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-sand-100 pt-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-terracotta-500" />
                    <span className="font-display text-xl font-bold text-terracotta-600">{route.price}</span>
                  </div>
                  <span className="text-xs text-deepblue-500">{t('transport.price')}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-deepblue-800 to-deepblue-900 p-6 sm:p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-sand-400/20 p-2.5 ring-1 ring-sand-400/30">
                  <Truck className="h-7 w-7 text-sand-400" />
                </div>
                <h3 className="font-display text-xl font-bold">{t('transport.rentJeep')}</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-xl">{t('transport.rentJeepDesc')}</p>
            </div>
            <button className="flex-shrink-0 rounded-xl bg-sand-400 px-6 py-3 text-sm font-bold text-deepblue-900 transition-colors hover:bg-sand-300">
              {t('transport.rentJeepBtn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
