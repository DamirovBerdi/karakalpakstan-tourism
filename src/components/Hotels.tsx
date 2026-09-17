import { useState, useMemo } from 'react';
import {
  Star, Check, Calendar, Users, Bed, Loader2, CheckCircle2,
  Phone, Mail, User, X, Building, FlaskConical,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { hotels, type Hotel } from '@/data/tourism';
import { supabase } from '@/lib/supabase';
import { trackServiceUsage } from '@/lib/visitorTracking';

type FilterType = 'all' | Hotel['type'];

interface BookingForm {
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomTypeId: string;
  notes: string;
}

export default function Hotels() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState<BookingForm>({
    guestName: '', email: '', phone: '', checkIn: '', checkOut: '',
    guests: 1, roomTypeId: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ trackingId: string; nights: number; totalPrice: number } | null>(null);
  const [error, setError] = useState('');

  const filtered = filter === 'all' ? hotels : hotels.filter((h) => h.type === filter);

  const filters: { key: string; value: FilterType }[] = [
    { key: 'hotels.all', value: 'all' },
    { key: 'hotels.hotel', value: 'hotel' },
    { key: 'hotels.yurt', value: 'yurt' },
    { key: 'hotels.guesthouse', value: 'guesthouse' },
  ];

  const selectedRoom = useMemo(() => {
    if (!selectedHotel?.roomTypes) return null;
    return selectedHotel.roomTypes.find((r) => r.id === form.roomTypeId) ?? null;
  }, [selectedHotel, form.roomTypeId]);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }, [form.checkIn, form.checkOut]);

  const estimatedTotal = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const openBooking = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setForm({
      guestName: '', email: '', phone: '', checkIn: '', checkOut: '',
      guests: 1, roomTypeId: hotel.roomTypes?.[0]?.id ?? 'standard', notes: '',
    });
    setSuccess(null);
    setError('');
  };

  const closeBooking = () => {
    setSelectedHotel(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel || !selectedRoom) return;
    if (!form.guestName.trim() || !form.phone.trim() || !form.checkIn || !form.checkOut) {
      setError(t('hotel.requiredFields'));
      return;
    }
    if (nights <= 0) {
      setError(t('hotel.invalidDates'));
      return;
    }

    setSubmitting(true);
    setError('');

    trackServiceUsage('hotel', `booking: ${selectedHotel.name}`).catch(() => {});

    const totalPrice = selectedRoom.pricePerNight * nights;

    const { data, error: insertError } = await supabase
      .from('hotel_bookings')
      .insert({
        hotel_name: selectedHotel.name,
        room_type: selectedRoom.name,
        guest_name: form.guestName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        check_in: form.checkIn,
        check_out: form.checkOut,
        guests: form.guests,
        nights,
        price_per_night: selectedRoom.pricePerNight,
        total_price: totalPrice,
        language: lang,
        notes: form.notes.trim(),
        is_test_mode: false,
        commission_rate: 0,
      })
      .select('tracking_id')
      .single();

    if (insertError || !data) {
      setError(t('hotel.error'));
      setSubmitting(false);
      return;
    }

    setSuccess({ trackingId: data.tracking_id, nights, totalPrice });
    setSubmitting(false);
  };

  const inputClass = 'w-full rounded-xl border border-sand-300 bg-white pl-10 pr-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:ring-2 focus:ring-deepblue-200 transition-all';

  return (
    <section id="hotels" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <Building className="h-3.5 w-3.5" /> {t('hotels.badge')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('hotels.title')}</h2>
          <p className="mt-3 text-base text-deepblue-600">{t('hotels.subtitle')}</p>
        </div>

        {/* Nukus Hotels partner banner */}
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-deepblue-800 to-deepblue-900 p-5 text-white shadow-medium">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-500 shadow-subtle">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-bold">Nukus Hotels Partnership</p>
              <p className="text-xs text-sand-300">{t('hotel.partnerText')}</p>
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-white/20" />
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {['Jipek Joli', 'Pana Hotel', 'Fayz Hotel', 'Nukus Palace'].map((h) => (
              <span key={h} className="rounded-full bg-white/10 px-3 py-1 font-medium">{h}</span>
            ))}
          </div>
        </div>

        {/* Beta Test Mode banner */}
        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl bg-amber-50 px-5 py-3 ring-1 ring-amber-200">
          <FlaskConical className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">{t('beta.tagline')}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filter === f.value
                  ? 'bg-terracotta-500 text-white shadow-subtle'
                  : 'bg-sand-100 text-deepblue-700 hover:bg-sand-200'
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>

        {/* Hotel grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel) => (
            <div
              key={hotel.id}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-sand-200 overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-deepblue-900 shadow flex items-center gap-1">
                  <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
                  {hotel.rating}
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-deepblue-900/80 px-2.5 py-1 text-xs font-medium text-white">
                  {hotel.location}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-deepblue-900">{hotel.name}</h3>

                {/* Room types preview */}
                {hotel.roomTypes && (
                  <div className="mt-2 space-y-1">
                    {hotel.roomTypes.map((rt) => (
                      <div key={rt.id} className="flex items-center justify-between text-xs">
                        <span className="text-deepblue-600 flex items-center gap-1">
                          <Bed className="h-3 w-3" /> {rt.name}
                        </span>
                        <span className="font-semibold text-deepblue-900">${rt.pricePerNight}/night</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-xs font-medium text-deepblue-400 mb-1.5">{t('hotels.amenities')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1 rounded-md bg-sand-50 px-2 py-0.5 text-xs text-deepblue-600 ring-1 ring-sand-100"
                      >
                        <Check className="h-3 w-3 text-terracotta-500" /> {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-sand-100 pt-4">
                  <div>
                    <span className="font-display text-2xl font-bold text-terracotta-600">${hotel.pricePerNight}</span>
                    <span className="text-sm text-deepblue-500">{t('hotels.perNight')}</span>
                  </div>
                  <button
                    onClick={() => openBooking(hotel)}
                    className="rounded-lg bg-deepblue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deepblue-700"
                  >
                    {t('hotels.bookNow')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Booking Modal === */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deepblue-900/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-elevated my-8 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={closeBooking}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-deepblue-400 hover:text-deepblue-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              /* Success screen */
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-deepblue-900 mb-2">{t('hotel.successTitle')}</h3>
                <p className="text-sm text-deepblue-600 mb-4">{t('hotel.successText')}</p>
                <div className="rounded-xl bg-deepblue-50 p-4 ring-1 ring-deepblue-200 mb-3">
                  <p className="text-xs text-deepblue-500 uppercase tracking-wide mb-1">{t('hotel.confirmationNumber')}</p>
                  <p className="font-display text-2xl font-bold text-deepblue-900">{success.trackingId}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-sand-50 p-3">
                    <p className="text-xs text-deepblue-400">{t('hotel.nights')}</p>
                    <p className="font-bold text-deepblue-900">{success.nights}</p>
                  </div>
                  <div className="rounded-lg bg-sand-50 p-3">
                    <p className="text-xs text-deepblue-400">{t('hotel.totalPaid')}</p>
                    <p className="font-bold text-deepblue-900">${success.totalPrice}</p>
                  </div>
                </div>
                <p className="text-xs text-deepblue-400 mb-6">{t('hotel.saveId')}</p>
                <button
                  onClick={closeBooking}
                  className="rounded-xl bg-deepblue-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-deepblue-700"
                >
                  {t('hotel.close')}
                </button>
              </div>
            ) : (
              /* Booking form */
              <div>
                {/* Hotel header */}
                <div className="relative h-32 overflow-hidden rounded-t-2xl">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900/90 to-transparent" />
                  <div className="absolute bottom-3 left-5">
                    <h3 className="font-display text-xl font-bold text-white">{selectedHotel.name}</h3>
                    <p className="text-xs text-sand-300 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-sand-400 text-sand-400" /> {selectedHotel.rating} · {selectedHotel.location}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                  {/* Room type selection */}
                  {selectedHotel.roomTypes && (
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-2">{t('hotel.roomType')}</label>
                      <div className="space-y-2">
                        {selectedHotel.roomTypes.map((rt) => (
                          <button
                            key={rt.id}
                            type="button"
                            onClick={() => setForm({ ...form, roomTypeId: rt.id })}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                              form.roomTypeId === rt.id
                                ? 'border-deepblue-500 bg-deepblue-50 ring-2 ring-deepblue-200'
                                : 'border-sand-300 bg-white hover:bg-sand-50'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-deepblue-900 flex items-center gap-1.5">
                                <Bed className="h-4 w-4 text-deepblue-500" /> {rt.name}
                              </p>
                              <p className="text-xs text-deepblue-400">{rt.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                              <p className="font-display text-lg font-bold text-terracotta-600">${rt.pricePerNight}</p>
                              <p className="text-xs text-deepblue-400">{t('hotels.perNight')}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.checkIn')} *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                        <input
                          type="date" value={form.checkIn}
                          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                          required min={new Date().toISOString().split('T')[0]}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.checkOut')} *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                        <input
                          type="date" value={form.checkOut}
                          onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                          required min={form.checkIn || new Date().toISOString().split('T')[0]}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.guests')}</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                      <select
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })}
                        className={inputClass}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? t('hotel.guest') : t('hotel.guestsPlural')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="border-t border-sand-200 pt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.guestName')} *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                          <input
                            type="text" value={form.guestName}
                            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                            required placeholder="John Smith"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.phone')} *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                          <input
                            type="tel" value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required placeholder="+998 90 123 45 67"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                        <input
                          type="email" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@email.com"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">{t('hotel.notes')}</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                      placeholder={t('hotel.notesPlaceholder')}
                      className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:ring-2 focus:ring-deepblue-200 transition-all"
                    />
                  </div>

                  {/* Price summary */}
                  {selectedRoom && nights > 0 && (
                    <div className="rounded-xl bg-sand-50 p-4 ring-1 ring-sand-200">
                      <div className="flex items-center justify-between text-xs text-deepblue-600 mb-1">
                        <span>${selectedRoom.pricePerNight} x {nights} {nights === 1 ? t('hotel.night') : t('hotel.nights')}</span>
                        <span className="font-semibold">${estimatedTotal}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-sand-200 pt-2 mt-2">
                        <span className="font-display text-sm font-bold text-deepblue-900">{t('hotel.totalPrice')}</span>
                        <span className="font-display text-xl font-bold text-terracotta-600">${estimatedTotal}</span>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3.5 text-sm font-bold text-white transition-all hover:bg-terracotta-600 disabled:opacity-60 shadow-subtle"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    {t('hotel.confirmBooking')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
