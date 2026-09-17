import { useState } from 'react';
import { Clock, Mountain, Camera, Ship, Check, X, Loader2, Calendar, Users, Mail, Phone, User } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { aralTours } from '@/data/aralExperience';
import type { AralTour } from '@/data/aralExperience';

const DIFFICULTY_KEY: Record<AralTour['difficulty'], string> = {
  easy: 'aral.tours.easy',
  moderate: 'aral.tours.moderate',
  hard: 'aral.tours.hard',
};

const DIFFICULTY_STYLE: Record<AralTour['difficulty'], string> = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-sand-200 text-sand-800',
  hard: 'bg-terracotta-100 text-terracotta-700',
};

const TOUR_ICONS: Record<string, typeof Ship> = {
  'moynaq-ship-graveyard': Ship,
  'ustyurt-jeep-expedition': Mountain,
  'aral-yurt-overnight': Mountain,
  'aralsk-photography': Camera,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function AdventureTours() {
  const { t, lang } = useLang();
  const [selectedTour, setSelectedTour] = useState<AralTour | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', groupSize: '1', message: '' });

  const handleOpenBooking = (tour: AralTour) => {
    setSelectedTour(tour);
    setStatus('idle');
    setForm({ name: '', email: '', phone: '', date: '', groupSize: '1', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;
    setStatus('submitting');
    try {
      const { error } = await supabase.from('aral_bookings').insert({
        tour_id: selectedTour.id,
        tour_name: selectedTour.name.en,
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        group_size: parseInt(form.groupSize, 10),
        message: form.message || null,
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-deepblue-900">{t('aral.tours.title')}</h3>
        <p className="mt-1.5 text-sm text-deepblue-600">{t('aral.tours.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aralTours.map((tour, i) => {
          const Icon = TOUR_ICONS[tour.id] ?? Mountain;
          return (
            <div
              key={tour.id}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-sand-200 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.name[lang]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-deepblue-900 flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${DIFFICULTY_STYLE[tour.difficulty]}`}>
                    {t(DIFFICULTY_KEY[tour.difficulty])}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-display text-lg font-bold text-white leading-tight">{tour.name[lang]}</h4>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-deepblue-600 leading-relaxed mb-3 line-clamp-2">{tour.description[lang]}</p>
                <div className="flex items-center gap-3 text-xs text-deepblue-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {tour.duration[lang]}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-deepblue-400 mb-1.5">{t('aral.tours.includes')}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tour.includes.map((item, j) => (
                      <span key={j} className="rounded-md bg-sand-50 px-2 py-0.5 text-[11px] text-deepblue-700 ring-1 ring-sand-100">
                        {item[lang]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-sand-100 pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-deepblue-500">{t('aral.tours.from')}</span>
                    <span className="font-display text-2xl font-bold text-terracotta-600">${tour.price}</span>
                    <span className="text-xs text-deepblue-500">{t('aral.tours.perPerson')}</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(tour)}
                    className="rounded-lg bg-terracotta-500 px-4 py-2 text-xs font-semibold text-white hover:bg-terracotta-600 transition-colors"
                  >
                    {t('aral.tours.book')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => status === 'submitting' ? undefined : setSelectedTour(null)}>
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-elevated" onClick={(e) => e.stopPropagation()}>
            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-display text-lg font-bold text-deepblue-900 mb-2">{t('aral.booking.success')}</h4>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="mt-4 rounded-lg bg-deepblue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-700 transition-colors"
                >
                  {t('aral.booking.close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-sand-100 p-5">
                  <h4 className="font-display text-lg font-bold text-deepblue-900">{t('aral.booking.title')}</h4>
                  <button
                    onClick={() => setSelectedTour(null)}
                    disabled={status === 'submitting'}
                    className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 disabled:opacity-40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-4 rounded-xl bg-sand-50 p-3 ring-1 ring-sand-100">
                    <p className="text-xs font-medium text-deepblue-400 mb-0.5">{t('aral.booking.tour')}</p>
                    <p className="text-sm font-semibold text-deepblue-900">{selectedTour.name[lang]}</p>
                    <p className="text-xs text-terracotta-600 mt-0.5">${selectedTour.price} {t('aral.tours.perPerson')}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Field icon={<User className="h-4 w-4" />} label={t('aral.booking.name')}>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <Field icon={<Mail className="h-4 w-4" />} label={t('aral.booking.email')} type="email">
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <Field icon={<Phone className="h-4 w-4" />} label={t('aral.booking.phone')}>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={<Calendar className="h-4 w-4" />} label={t('aral.booking.date')} type="date">
                        <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                      </Field>
                      <Field icon={<Users className="h-4 w-4" />} label={t('aral.booking.groupSize')}>
                        <input required type="number" min="1" max="20" value={form.groupSize} onChange={(e) => setForm({ ...form, groupSize: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                      </Field>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-deepblue-600 mb-1.5">{t('aral.booking.message')}</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t('aral.booking.messagePlaceholder')}
                        className="w-full rounded-xl bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 placeholder-deepblue-400 ring-1 ring-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 resize-none"
                      />
                    </div>
                    {status === 'error' && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{t('aral.booking.error')}</p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> {t('aral.booking.submitting')}</>
                      ) : (
                        t('aral.booking.submit')
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ icon, label, type: _type = 'text', children }: { icon: React.ReactNode; label: string; type?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-sand-50 ring-1 ring-sand-200 px-3 py-2.5">
      <label className="block text-xs font-medium text-deepblue-600 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-deepblue-400 flex-shrink-0">{icon}</span>
        {children}
      </div>
    </div>
  );
}
