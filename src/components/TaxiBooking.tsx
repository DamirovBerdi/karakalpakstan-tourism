import { useState } from 'react';
import {
  Car, MapPin, Navigation, Calendar, Users, Loader2, CheckCircle2,
  Phone, Mail, User, Clock, Info, Send, ChevronRight, Shield, Star, FlaskConical,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { trackServiceUsage } from '@/lib/visitorTracking';

const POPULAR_PICKUPS = [
  'Nukus Airport (NCU)',
  'Nukus Train Station',
  'Savitsky Museum, Nukus',
  'Nukus City Center',
  'Moynaq Town',
  'Kungrad',
  'Chimboy',
  'Turtkul',
];

const POPULAR_DESTINATIONS = [
  'Moynaq Ship Graveyard',
  'Mizdakhan Necropolis',
  'Savitsky Museum, Nukus',
  'Ustyurt Plateau',
  'Chilpyk Fortress',
  'Lake Sudochye',
  'Aral Sea Yurt Camp',
  'Nukus Airport (NCU)',
];

export default function TaxiBooking() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    touristName: '',
    email: '',
    phone: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: 1,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ trackingId: string } | null>(null);
  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.touristName.trim() || !form.phone.trim() || !form.pickup.trim() || !form.dropoff.trim() || !form.date || !form.time) {
      setError(t('taxi.requiredFields'));
      return;
    }

    setSubmitting(true);
    setError('');

    trackServiceUsage('taxi', `booking: ${form.pickup} → ${form.dropoff}`).catch(() => {});

    const trackingId = `#SK-${Math.floor(1000 + Math.random() * 9000)}`;
    const travelDatetime = `${form.date}T${form.time}:00`;

    const { error: insertError } = await supabase
      .from('taxi_bookings')
      .insert({
        tracking_id: trackingId,
        tourist_name: form.touristName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pickup_location: form.pickup.trim(),
        dropoff_location: form.dropoff.trim(),
        travel_datetime: travelDatetime,
        passengers: form.passengers,
        notes: form.notes.trim(),
        language: lang,
        is_test_mode: false,
        commission_rate: 0,
      });

    if (insertError) {
      setError(t('taxi.error'));
      setSubmitting(false);
      return;
    }

    setSuccess({ trackingId });
    setSubmitting(false);
    setForm({
      touristName: '', email: '', phone: '', pickup: '', dropoff: '',
      date: '', time: '', passengers: 1, notes: '',
    });
  };

  const inputClass = 'w-full rounded-xl border border-sand-300 bg-white pl-10 pr-3 py-3 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:ring-2 focus:ring-deepblue-200 transition-all';

  return (
    <section id="taxi" className="py-16 sm:py-20 bg-gradient-to-b from-deepblue-50 via-white to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Car className="h-3.5 w-3.5" /> {t('taxi.badge')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('taxi.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('taxi.subtitle')}</p>
        </div>

        {/* 1222 Taxi partner banner */}
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-deepblue-800 to-deepblue-900 p-5 text-white shadow-medium">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-400 shadow-subtle">
              <span className="font-display text-xl font-bold text-deepblue-900">1222</span>
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-bold">1222 Taxi</p>
              <p className="text-xs text-sand-300">{t('taxi.officialPartner')}</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-white/20" />
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-amber-400" /> {t('taxi.trusted')}</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {t('taxi.rated')}</span>
          </div>
        </div>

        {/* Beta Test Mode banner */}
        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl bg-amber-50 px-5 py-3 ring-1 ring-amber-200">
          <FlaskConical className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">{t('beta.tagline')}</p>
        </div>

        {success ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-elevated ring-1 ring-emerald-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-deepblue-900 mb-2">{t('taxi.successTitle')}</h3>
            <p className="text-sm text-deepblue-600 mb-4">{t('taxi.successText')}</p>
            <div className="rounded-xl bg-deepblue-50 p-4 ring-1 ring-deepblue-200 mb-4">
              <p className="text-xs text-deepblue-500 uppercase tracking-wide mb-1">{t('taxi.trackingId')}</p>
              <p className="font-display text-2xl font-bold text-deepblue-900">{success.trackingId}</p>
            </div>
            <p className="text-xs text-deepblue-400 mb-6">{t('taxi.saveId')}</p>
            <button
              onClick={() => setSuccess(null)}
              className="rounded-xl bg-deepblue-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-deepblue-700"
            >
              {t('taxi.bookAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-medium ring-1 ring-sand-200 space-y-5">
            {/* Tourist info */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-deepblue-900 uppercase tracking-wide">
                <User className="h-4 w-4 text-deepblue-600" /> {t('taxi.sectionContact')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.name')} *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <input
                      type="text" value={form.touristName}
                      onChange={(e) => handleChange('touristName', e.target.value)}
                      required placeholder="John Smith"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.phone')} *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <input
                      type="tel" value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required placeholder="+998 90 123 45 67"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <input
                      type="email" value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Route info */}
            <div className="border-t border-sand-200 pt-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-deepblue-900 uppercase tracking-wide">
                <Navigation className="h-4 w-4 text-terracotta-600" /> {t('taxi.sectionRoute')}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.pickup')} *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                    <input
                      type="text" value={form.pickup}
                      onChange={(e) => handleChange('pickup', e.target.value)}
                      required list="pickup-places"
                      placeholder={t('taxi.pickupPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                  <datalist id="pickup-places">
                    {POPULAR_PICKUPS.map((p) => <option key={p} value={p} />)}
                  </datalist>
                </div>

                {/* Visual route arrow */}
                <div className="flex items-center justify-center -my-2">
                  <ChevronRight className="h-5 w-5 rotate-90 text-deepblue-300" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.dropoff')} *</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-terracotta-600" />
                    <input
                      type="text" value={form.dropoff}
                      onChange={(e) => handleChange('dropoff', e.target.value)}
                      required list="dest-places"
                      placeholder={t('taxi.dropoffPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                  <datalist id="dest-places">
                    {POPULAR_DESTINATIONS.map((d) => <option key={d} value={d} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Date/time/passengers */}
            <div className="border-t border-sand-200 pt-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-deepblue-900 uppercase tracking-wide">
                <Clock className="h-4 w-4 text-deepblue-600" /> {t('taxi.sectionTime')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.date')} *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <input
                      type="date" value={form.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      required min={new Date().toISOString().split('T')[0]}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.time')} *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <input
                      type="time" value={form.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.passengers')}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                    <select
                      value={form.passengers}
                      onChange={(e) => handleChange('passengers', parseInt(e.target.value))}
                      className={inputClass}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? t('taxi.person') : t('taxi.people')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-sand-200 pt-5">
              <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('taxi.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
                placeholder={t('taxi.notesPlaceholder')}
                className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:ring-2 focus:ring-deepblue-200 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3.5 text-sm font-bold text-white transition-all hover:bg-terracotta-600 disabled:opacity-60 shadow-subtle"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {t('taxi.submit')}
            </button>

            <p className="text-center text-xs text-deepblue-400 flex items-center justify-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> {t('taxi.disclaimer')}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
