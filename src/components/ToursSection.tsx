import { useState, useMemo } from 'react';
import {
  Clock,
  Mountain,
  Check,
  X,
  Calendar,
  UserPlus,
  Loader2,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import { tours, TRAVEL_MODES, type TravelMode, type Tour } from '@/data/tours';
import TravelModeSelector from './TravelModeSelector';

export default function ToursSection() {
  const { lang, t } = useLang();
  const [activeMode, setActiveMode] = useState<TravelMode | 'all'>('all');
  const [bookingTour, setBookingTour] = useState<Tour | null>(null);

  const filteredTours = useMemo(() => {
    if (activeMode === 'all') return tours;
    return tours.filter((tour) => tour.modes.includes(activeMode));
  }, [activeMode]);

  const modeIcon = (mode: TravelMode) => TRAVEL_MODES.find((m) => m.mode === mode)?.icon ?? '';

  const difficultyColor = (d: string) => {
    if (d === 'easy') return 'bg-green-100 text-green-700';
    if (d === 'moderate') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <>
      <TravelModeSelector activeMode={activeMode} onModeChange={setActiveMode} />

      <section id="tours" className="py-12 sm:py-16 bg-sand-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900 mb-2">
              {t('tours.title')}
            </h2>
            <p className="text-deepblue-500 text-sm sm:text-base">{t('tours.subtitle')}</p>
          </div>

          {filteredTours.length === 0 ? (
            <div className="rounded-xl bg-white py-16 text-center ring-1 ring-sand-200">
              <p className="text-deepblue-400">{t('tours.noResults')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-subtle ring-1 ring-sand-200 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={getText(tour.title, lang)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {tour.modes.map((mode) => (
                        <span
                          key={mode}
                          className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-deepblue-700 backdrop-blur-sm"
                        >
                          <span>{modeIcon(mode)}</span>
                          {t(`mode.${mode}`)}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-white shadow-medium">
                      {t('tours.from')} ${tour.price}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-lg font-bold text-deepblue-800 mb-1.5 leading-tight">
                      {getText(tour.title, lang)}
                    </h3>
                    <p className="text-sm text-deepblue-500 leading-relaxed mb-3 flex-1">
                      {getText(tour.description, lang)}
                    </p>

                    <div className="flex items-center gap-3 mb-3 text-xs text-deepblue-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-terracotta-500" />
                        {getText(tour.duration, lang)}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${difficultyColor(tour.difficulty)}`}>
                        <Mountain className="h-3 w-3" />
                        {t(`tours.${tour.difficulty}`)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-deepblue-400 mb-1.5">
                        {t('tours.includes')}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {getText<string[]>(tour.includes, lang).map((item: string) => (
                          <span
                            key={item}
                            className="flex items-center gap-0.5 rounded-md bg-sand-100 px-2 py-0.5 text-[10px] text-deepblue-600"
                          >
                            <Check className="h-2.5 w-2.5 text-green-500" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingTour(tour)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 hover:shadow-subtle"
                    >
                      <Tag className="h-4 w-4" />
                      {t('tours.book')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {bookingTour && (
        <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} />
      )}
    </>
  );
}

function BookingModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const { lang, t } = useLang();
  const [guests, setGuests] = useState(1);
  const [buddyOptIn, setBuddyOptIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const totalPrice = tour.price * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    try {
      const { error: insertError } = await supabase.from('tourist_requests').insert({
        name,
        email,
        phone,
        budget_total: (tour.price || 0) * guests,
        group_size: guests,
        duration_days: 1,
        interests: ['tour'],
        tour_name: getText(tour.title, lang),
        travel_date: date || null,
        guests,
        buddy_opt_in: buddyOptIn,
        message: message || null,
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-deepblue-900/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-elevated animate-fade-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-deepblue-800 mb-2">{t('tours.success')}</h3>
          {buddyOptIn && (
            <p className="text-sm text-terracotta-600 mb-4 flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              {t('tours.buddyHint')}
            </p>
          )}
          <button
            onClick={onClose}
            className="rounded-xl bg-deepblue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-800"
          >
            {t('tours.close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deepblue-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-elevated animate-fade-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand-200 bg-white px-5 py-4 rounded-t-2xl">
          <div>
            <h3 className="font-display text-lg font-bold text-deepblue-800">{t('tours.bookingTitle')}</h3>
            <p className="text-xs text-deepblue-500">{getText(tour.title, lang)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 hover:text-deepblue-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-sand-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-deepblue-600">{t('tours.from')} ${tour.price} {t('tours.perPerson')}</span>
              <span className="font-display text-lg font-bold text-terracotta-600">
                ${totalPrice} <span className="text-xs font-normal text-deepblue-400">total</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('tours.name')} required>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-base" />
            </FormField>
            <FormField label={t('tours.phone')} required>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input-base" />
            </FormField>
          </div>

          <FormField label={t('tours.email')}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('tours.date')}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
            </FormField>
            <FormField label={t('tours.guests')} required>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="input-base"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-terracotta-50 p-3 ring-1 ring-terracotta-200 cursor-pointer transition-all hover:bg-terracotta-100">
            <input
              type="checkbox"
              checked={buddyOptIn}
              onChange={(e) => setBuddyOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-terracotta-300 text-terracotta-500 focus:ring-terracotta-400"
            />
            <div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-terracotta-700">
                <UserPlus className="h-4 w-4" />
                {t('tours.buddyCheck')}
              </span>
              <span className="block text-xs text-terracotta-600 mt-0.5">{t('tours.buddyHint')}</span>
            </div>
          </label>

          <FormField label={t('tours.message')}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('tours.messagePlaceholder')}
              rows={3}
              className="input-base resize-none"
            />
          </FormField>

          {error && (
            <p className="text-sm text-red-600">{t('tours.error')}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('tours.submitting')}
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                {t('tours.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-deepblue-700">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </label>
      {children}
    </div>
  );
}
