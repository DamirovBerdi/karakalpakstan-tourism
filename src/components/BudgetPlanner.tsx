import { useState, useMemo } from 'react';
import { Wallet, Users, Calendar, Heart, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { guides, hotels, transportRoutes, budgetInterests } from '@/data/tourism';

export default function BudgetPlanner() {
  const { t } = useLang();
  const [budget, setBudget] = useState(500);
  const [groupSize, setGroupSize] = useState(2);
  const [duration, setDuration] = useState(5);
  const [interests, setInterests] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const perPersonPerDay = budget / groupSize / duration;

  const recommendations = useMemo(() => {
    const affordableGuides = guides.filter((g) => g.dailyRate <= perPersonPerDay * 0.3);
    const affordableHotels = hotels.filter((h) => h.pricePerNight <= perPersonPerDay * 0.4);
    const affordableTransport = transportRoutes.filter((r) => r.price <= perPersonPerDay * 0.2);
    return { affordableGuides, affordableHotels, affordableTransport };
  }, [perPersonPerDay]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const { error } = await supabase.from('tourist_requests').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        budget_total: budget,
        group_size: groupSize,
        duration_days: duration,
        interests: interests,
        message: form.message,
        per_person_per_day: Math.round(perPersonPerDay * 100) / 100,
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="budget" className="py-20 bg-sand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('budget.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('budget.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Wallet className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-display text-base font-semibold text-deepblue-900">{t('budget.total')}</h3>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-deepblue-600">{t('budget.total')}</span>
                  <span className="font-display text-2xl font-bold text-terracotta-600">${budget}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-terracotta-500"
                />
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-deepblue-500" />
                  <span className="text-sm text-deepblue-600">{t('budget.groupSize')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="flex-1 accent-deepblue-500 mr-3"
                  />
                  <span className="font-semibold text-deepblue-900 text-sm whitespace-nowrap">
                    {groupSize} {t('budget.travelers')}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-deepblue-500" />
                  <span className="text-sm text-deepblue-600">{t('budget.duration')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 accent-deepblue-500 mr-3"
                  />
                  <span className="font-semibold text-deepblue-900 text-sm whitespace-nowrap">
                    {duration} {t('budget.days')}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-sand-50 p-4 text-center">
                <p className="text-xs text-deepblue-500">{t('budget.perDay')}</p>
                <p className="font-display text-2xl font-bold text-deepblue-900">${perPersonPerDay.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-display text-base font-semibold text-deepblue-900">{t('budget.interests')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {budgetInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      interests.includes(interest)
                        ? 'bg-terracotta-500 text-white'
                        : 'bg-sand-100 text-deepblue-700 hover:bg-sand-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
              <h3 className="font-display text-base font-semibold text-deepblue-900 mb-4">
                {t('budget.recommendations')}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-deepblue-500 mb-2">{t('budget.guides')}</p>
                  {recommendations.affordableGuides.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendations.affordableGuides.map((g) => (
                        <span
                          key={g.id}
                          className="rounded-lg bg-sand-50 px-3 py-1.5 text-xs text-deepblue-700 ring-1 ring-sand-100"
                        >
                          {g.name} — ${g.dailyRate}/day
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-terracotta-500">{t('budget.noGuides')}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-deepblue-500 mb-2">{t('budget.hotels')}</p>
                  {recommendations.affordableHotels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendations.affordableHotels.map((h) => (
                        <span
                          key={h.id}
                          className="rounded-lg bg-sand-50 px-3 py-1.5 text-xs text-deepblue-700 ring-1 ring-sand-100"
                        >
                          {h.name} — ${h.pricePerNight}/night
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-terracotta-500">{t('budget.noHotels')}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-deepblue-500 mb-2">{t('budget.transport')}</p>
                  {recommendations.affordableTransport.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendations.affordableTransport.map((r) => (
                        <span
                          key={r.id}
                          className="rounded-lg bg-sand-50 px-3 py-1.5 text-xs text-deepblue-700 ring-1 ring-sand-100"
                        >
                          {r.from} → {r.to} — ${r.price}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-terracotta-500">{t('budget.noTransport')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6">
              <h3 className="font-display text-base font-semibold text-deepblue-900 mb-1">{t('budget.requestForm')}</h3>
              <p className="text-xs text-deepblue-500 mb-4">{t('budget.requestFormDesc')}</p>

              {status === 'success' ? (
                <div className="rounded-xl bg-green-50 p-4 flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{t('budget.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('budget.name')}
                    className="w-full rounded-lg border border-sand-200 px-4 py-2.5 text-sm text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('budget.email')}
                    className="w-full rounded-lg border border-sand-200 px-4 py-2.5 text-sm text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                  />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t('budget.phone')}
                    className="w-full rounded-lg border border-sand-200 px-4 py-2.5 text-sm text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                  />
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('budget.messagePlaceholder')}
                    rows={3}
                    className="w-full rounded-lg border border-sand-200 px-4 py-2.5 text-sm text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-1 focus:ring-terracotta-400 resize-none"
                  />
                  {status === 'error' && (
                    <div className="rounded-lg bg-terracotta-50 p-3 flex items-center gap-2 text-terracotta-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p className="text-xs">{t('budget.error')}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {status === 'submitting' ? t('budget.submitting') : t('budget.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
