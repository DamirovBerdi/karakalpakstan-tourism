import { Smartphone, CreditCard, Coins, FileText, Users, HeartPulse } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const ESSENTIALS = [
  { icon: Smartphone, key: 'sim', color: 'from-terracotta-400 to-terracotta-600' },
  { icon: CreditCard, key: 'cards', color: 'from-deepblue-400 to-deepblue-600' },
  { icon: Coins, key: 'currency', color: 'from-sand-400 to-sand-600' },
  { icon: FileText, key: 'registration', color: 'from-terracotta-400 to-terracotta-600' },
  { icon: Users, key: 'etiquette', color: 'from-deepblue-400 to-deepblue-600' },
  { icon: HeartPulse, key: 'health', color: 'from-sand-400 to-sand-600' },
];

export default function Essentials() {
  const { t } = useLang();

  return (
    <section id="essentials" className="py-20 bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('essentials.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('essentials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ESSENTIALS.map(({ icon: Icon, key, color }) => (
            <div
              key={key}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-sand-200 p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 shadow-sm`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-deepblue-900 mb-2">{t(`essentials.${key}`)}</h3>
              <p className="text-sm text-deepblue-600 leading-relaxed">{t(`essentials.${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
