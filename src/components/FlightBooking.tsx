import { useState, useMemo } from 'react';
import {
  Plane,
  Search,
  Loader2,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  Check,
  X,
  Users,
  DollarSign,
  Filter,
  Info,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { supabase } from '@/lib/supabase';

type TripType = 'round-trip' | 'one-way';
type CabinClass = 'economy' | 'business' | 'first';

interface Airport {
  code: string;
  city: { en: string; ru: string; uz: string; kaa: string };
}

const AIRPORTS: Airport[] = [
  { code: 'NCU', city: { en: 'Nukus', ru: 'Нукус', uz: 'Nukus', kaa: 'Nókis' } },
  { code: 'TAS', city: { en: 'Tashkent', ru: 'Ташкент', uz: 'Toshkent', kaa: 'Tashkent' } },
  { code: 'IST', city: { en: 'Istanbul', ru: 'Стамбул', uz: 'Istanbul', kaa: 'Istanbul' } },
  { code: 'DXB', city: { en: 'Dubai', ru: 'Дубай', uz: 'Dubay', kaa: 'Dubay' } },
  { code: 'FRA', city: { en: 'Frankfurt', ru: 'Франкфурт', uz: 'Frankfurt', kaa: 'Frankfurt' } },
  { code: 'LHR', city: { en: 'London', ru: 'Лондон', uz: 'London', kaa: 'London' } },
  { code: 'CDG', city: { en: 'Paris', ru: 'Париж', uz: 'Parij', kaa: 'Parij' } },
  { code: 'JFK', city: { en: 'New York', ru: 'Нью-Йорк', uz: 'New York', kaa: 'New York' } },
  { code: 'LAX', city: { en: 'Los Angeles', ru: 'Лос-Анджелес', uz: 'Los Angeles', kaa: 'Los Angeles' } },
  { code: 'DEL', city: { en: 'Delhi', ru: 'Дели', uz: 'Dehli', kaa: 'Dehli' } },
  { code: 'PEK', city: { en: 'Beijing', ru: 'Пекин', uz: 'Pekin', kaa: 'Pekin' } },
  { code: 'MOW', city: { en: 'Moscow', ru: 'Москва', uz: 'Moskva', kaa: 'Moskva' } },
  { code: 'ICN', city: { en: 'Seoul', ru: 'Сеул', uz: 'Seul', kaa: 'Seul' } },
  { code: 'HND', city: { en: 'Tokyo', ru: 'Токио', uz: 'Tokio', kaa: 'Tokio' } },
];

interface MockFlight {
  airline: string;
  airlineCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
}

const AIRLINES = [
  { name: 'Uzbekistan Airways', code: 'HY' },
  { name: 'Turkish Airlines', code: 'TK' },
  { name: 'Flydubai', code: 'FZ' },
  { name: 'Aeroflot', code: 'SU' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'Qatar Airways', code: 'QR' },
];

function generateFlights(from: string, to: string, date: string, maxBudget: number, cabinClass: CabinClass): MockFlight[] {
  if (!from || !to || !date) return [];
  const classMultiplier = cabinClass === 'business' ? 2.5 : cabinClass === 'first' ? 4 : 1;
  const results: MockFlight[] = [];
  const times = ['06:00', '08:30', '10:15', '12:45', '14:20', '17:05', '19:30', '22:00'];

  AIRLINES.forEach((airline, i) => {
    const basePrice = 180 + ((i * 47 + from.charCodeAt(0) * 13 + to.charCodeAt(0) * 7) % 200);
    const stops = i < 2 ? 0 : i < 4 ? 1 : 2;
    const durationH = 4 + stops * 3 + (i % 3);
    const durationM = (i * 17) % 60;
    const price = Math.round((basePrice + stops * 40) * classMultiplier);

    if (price <= maxBudget) {
      const departTime = times[i % times.length];
      const arriveHour = (parseInt(departTime.slice(0, 2)) + durationH) % 24;
      const arriveMin = (parseInt(departTime.slice(3)) + durationM) % 60;
      results.push({
        airline: airline.name,
        airlineCode: airline.code,
        departTime,
        arriveTime: `${String(arriveHour).padStart(2, '0')}:${String(arriveMin).padStart(2, '0')}`,
        duration: `${durationH}h ${durationM}m`,
        stops,
        price,
      });
    }
  });

  return results.sort((a, b) => a.price - b.price);
}

const POPULAR_ROUTES = [
  { from: 'IST', to: 'TAS', label: { en: 'Istanbul → Tashkent', ru: 'Стамбул → Ташкент', uz: 'Istanbul → Toshkent', kaa: 'Istanbul → Tashkent' } },
  { from: 'DXB', to: 'TAS', label: { en: 'Dubai → Tashkent', ru: 'Дубай → Ташкент', uz: 'Dubay → Toshkent', kaa: 'Dubay → Tashkent' } },
  { from: 'MOW', to: 'NCU', label: { en: 'Moscow → Nukus', ru: 'Москва → Нукус', uz: 'Moskva → Nukus', kaa: 'Moskva → Nókis' } },
  { from: 'TAS', to: 'NCU', label: { en: 'Tashkent → Nukus', ru: 'Ташкент → Нукус', uz: 'Toshkent → Nukus', kaa: 'Tashkent → Nókis' } },
];

export default function FlightBooking() {
  const { lang, t } = useLang();
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [from, setFrom] = useState('IST');
  const [to, setTo] = useState('TAS');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [maxBudget, setMaxBudget] = useState(1000);
  const [searching, setSearching] = useState(false);
  const [outboundFlights, setOutboundFlights] = useState<MockFlight[]>([]);
  const [returnFlights, setReturnFlights] = useState<MockFlight[]>([]);
  const [selectedOutbound, setSelectedOutbound] = useState<MockFlight | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<MockFlight | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });

  const airportLabel = (code: string) => {
    const a = AIRPORTS.find((a) => a.code === code);
    return a ? `${getText(a.city, lang)} (${a.code})` : code;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !departDate) return;
    setSearching(true);
    setOutboundFlights([]);
    setReturnFlights([]);
    setSelectedOutbound(null);
    setSelectedReturn(null);

    setTimeout(() => {
      const out = generateFlights(from, to, departDate, maxBudget, cabinClass);
      setOutboundFlights(out);
      if (tripType === 'round-trip' && returnDate) {
        const ret = generateFlights(to, from, returnDate, maxBudget, cabinClass);
        setReturnFlights(ret);
      }
      setSearching(false);
    }, 1200);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleRouteClick = (routeFrom: string, routeTo: string) => {
    setFrom(routeFrom);
    setTo(routeTo);
  };

  const totalPrice = useMemo(() => {
    let total = selectedOutbound?.price ?? 0;
    if (tripType === 'round-trip' && selectedReturn) total += selectedReturn.price;
    return total * passengers;
  }, [selectedOutbound, selectedReturn, passengers, tripType]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBookingError(false);
    try {
      const { error } = await supabase.from('tourist_requests').insert({
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        budget_total: totalPrice || 0,
        group_size: passengers || 1,
        duration_days: tripType === 'round-trip' ? 7 : 1,
        interests: ['flight'],
        tour_name: `Flight: ${from}-${to}${tripType === 'round-trip' ? ' (Round Trip)' : ''}`,
        travel_date: departDate || null,
        guests: passengers,
        buddy_opt_in: false,
        message: `Flight booking: ${selectedOutbound?.airline} ${from}→${to} ${departTime}${selectedReturn ? ` | Return: ${selectedReturn.airline} ${to}→${from} ${returnDate}` : ''} | Total: $${totalPrice}`,
      });
      if (error) throw error;
      setBookingSuccess(true);
    } catch {
      setBookingError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const departTime = selectedOutbound ? `${selectedOutbound.departTime} - ${selectedOutbound.arriveTime}` : '';
  const resetSearch = () => {
    setOutboundFlights([]);
    setReturnFlights([]);
    setSelectedOutbound(null);
    setSelectedReturn(null);
  };

  const canBook = selectedOutbound && (tripType === 'one-way' || selectedReturn);

  return (
    <section id="flights" className="py-12 sm:py-16 bg-gradient-to-b from-white to-deepblue-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <Plane className="h-3.5 w-3.5" />
            {t('flights.roundTrip')}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900 mb-2">{t('flights.title')}</h2>
          <p className="text-deepblue-500 text-sm sm:text-base max-w-2xl mx-auto">{t('flights.subtitle')}</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="rounded-2xl bg-white p-5 sm:p-6 shadow-medium ring-1 ring-sand-200 mb-6">
          {/* Trip Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                tripType === 'round-trip' ? 'bg-deepblue-700 text-white' : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" />
              {t('flights.roundTrip')}
            </button>
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                tripType === 'one-way' ? 'bg-deepblue-700 text-white' : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
              }`}
            >
              <ArrowRight className="h-4 w-4" />
              {t('flights.oneWay')}
            </button>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 mb-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.from')}</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-base">
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>{getText(a.city, lang)} ({a.code})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-center pb-1">
              <button type="button" onClick={handleSwap} className="rounded-full bg-sand-100 p-2.5 text-deepblue-500 transition-all hover:bg-sand-200 hover:scale-110">
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.to')}</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="input-base">
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>{getText(a.city, lang)} ({a.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.depart')}</label>
              <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} required className="input-base" />
            </div>
            {tripType === 'round-trip' && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.return')}</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-base" />
              </div>
            )}
          </div>

          {/* Passengers, Class, Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.passengers')}</label>
              <select value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))} className="input-base">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.class')}</label>
              <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value as CabinClass)} className="input-base">
                <option value="economy">{t('flights.economy')}</option>
                <option value="business">{t('flights.business')}</option>
                <option value="first">{t('flights.first')}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-deepblue-700">
                {t('flights.budget')}: ${maxBudget}
              </label>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="w-full accent-terracotta-500 mt-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={searching || !departDate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 hover:shadow-subtle disabled:opacity-50"
          >
            {searching ? <><Loader2 className="h-4 w-4 animate-spin" />{t('flights.searching')}</> : <><Search className="h-4 w-4" />{t('flights.search')}</>}
          </button>
        </form>

        {/* Popular Routes */}
        {outboundFlights.length === 0 && !searching && (
          <div className="mb-6">
            <h3 className="font-display text-sm font-bold text-deepblue-700 mb-3 flex items-center gap-2">
              <Plane className="h-4 w-4 text-terracotta-500" />
              {t('flights.popularRoutes')}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={`${route.from}-${route.to}`}
                  onClick={() => handleRouteClick(route.from, route.to)}
                  className="rounded-xl bg-white p-3 text-left ring-1 ring-sand-200 transition-all hover:shadow-subtle hover:ring-terracotta-300"
                >
                  <p className="text-sm font-semibold text-deepblue-800">{getText(route.label, lang)}</p>
                  <p className="text-xs text-deepblue-400 mt-0.5">{airportLabel(route.from)} → {airportLabel(route.to)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Outbound Results */}
        {outboundFlights.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-deepblue-800 flex items-center gap-2">
                <Plane className="h-5 w-5 text-terracotta-500" />
                {t('flights.outbound')}: {airportLabel(from)} → {airportLabel(to)}
              </h3>
              <button onClick={resetSearch} className="text-xs text-deepblue-400 hover:text-deepblue-600">
                {t('flights.close')}
              </button>
            </div>
            <div className="space-y-2">
              {outboundFlights.map((flight, i) => (
                <FlightCard
                  key={`out-${i}`}
                  flight={flight}
                  selected={selectedOutbound === flight}
                  onSelect={() => setSelectedOutbound(flight)}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}

        {/* Return Results */}
        {tripType === 'round-trip' && returnFlights.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-deepblue-800 flex items-center gap-2 mb-3">
              <Plane className="h-5 w-5 text-terracotta-500 rotate-180" />
              {t('flights.returnFlight')}: {airportLabel(to)} → {airportLabel(from)}
            </h3>
            <div className="space-y-2">
              {returnFlights.map((flight, i) => (
                <FlightCard
                  key={`ret-${i}`}
                  flight={flight}
                  selected={selectedReturn === flight}
                  onSelect={() => setSelectedReturn(flight)}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {outboundFlights.length === 0 && returnFlights.length === 0 && searching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-deepblue-400" />
          </div>
        )}

        {outboundFlights.length === 0 && returnFlights.length === 0 && !searching && departDate && from && to && (
          <div className="rounded-xl bg-sand-50 py-12 text-center ring-1 ring-sand-200">
            <Filter className="mx-auto h-10 w-10 mb-2 text-deepblue-300" />
            <p className="text-sm text-deepblue-400">{t('flights.noResults')}</p>
          </div>
        )}

        {/* Selected Summary + Book Button */}
        {canBook && (
          <div className="sticky bottom-4 z-30 mx-auto max-w-3xl rounded-2xl bg-deepblue-800 p-4 text-white shadow-elevated animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold">{t('flights.outbound')}</span>
                  <span>{selectedOutbound.airline} · {selectedOutbound.departTime} → {selectedOutbound.arriveTime}</span>
                </div>
                {tripType === 'round-trip' && selectedReturn && (
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold">{t('flights.returnFlight')}</span>
                    <span>{selectedReturn.airline} · {selectedReturn.departTime} → {selectedReturn.arriveTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-white/80 text-xs">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{passengers}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{t('flights.totalPrice')}: <strong className="text-white text-base">${totalPrice}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 hover:shadow-medium whitespace-nowrap"
              >
                <Check className="h-4 w-4" />
                {t('flights.bookNow')}
              </button>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-deepblue-900/50 backdrop-blur-sm" onClick={() => setShowBooking(false)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-elevated animate-fade-up max-h-[85vh] overflow-y-auto">
              {bookingSuccess ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-deepblue-800 mb-2">{t('flights.bookingSuccess')}</h3>
                  <button onClick={() => { setShowBooking(false); setBookingSuccess(false); }} className="mt-4 rounded-xl bg-deepblue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-800">
                    {t('flights.close')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand-200 bg-white px-5 py-4 rounded-t-2xl">
                    <h3 className="font-display text-lg font-bold text-deepblue-800">{t('flights.confirmBooking')}</h3>
                    <button onClick={() => setShowBooking(false)} className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 hover:text-deepblue-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleBookingSubmit} className="p-5 space-y-4">
                    {/* Summary */}
                    <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-sand-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-deepblue-500">{t('flights.outbound')}</span>
                        <span className="font-semibold text-deepblue-800">{selectedOutbound?.airline} · {selectedOutbound?.departTime}→{selectedOutbound?.arriveTime}</span>
                      </div>
                      {tripType === 'round-trip' && selectedReturn && (
                        <div className="flex justify-between">
                          <span className="text-deepblue-500">{t('flights.returnFlight')}</span>
                          <span className="font-semibold text-deepblue-800">{selectedReturn.airline} · {selectedReturn.departTime}→{selectedReturn.arriveTime}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-sand-200 pt-1.5 mt-1.5">
                        <span className="text-deepblue-500">{t('flights.totalPrice')} ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})</span>
                        <span className="font-display text-lg font-bold text-terracotta-600">${totalPrice}</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.yourName')} *</label>
                      <input type="text" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} required className="input-base" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.yourEmail')} *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} required className="input-base" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-deepblue-700">{t('flights.yourPhone')} *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} required className="input-base" />
                    </div>

                    {bookingError && <p className="text-sm text-red-600">{t('flights.bookingError')}</p>}

                    <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50">
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />{t('flights.searching')}</> : <><Check className="h-4 w-4" />{t('flights.submitBooking')}</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Note */}
        <p className="mt-6 flex items-start gap-2 text-xs text-deepblue-400 max-w-2xl mx-auto">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {t('flights.note')}
        </p>
      </div>
    </section>
  );
}

function FlightCard({
  flight,
  selected,
  onSelect,
  t,
}: {
  flight: MockFlight;
  selected: boolean;
  onSelect: () => void;
  t: (key: string) => string;
}) {
  const stopsLabel = flight.stops === 0 ? t('flights.stops') : flight.stops === 1 ? t('flights.stops_one') : t('flights.stops_two');

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
        selected
          ? 'bg-terracotta-50 ring-2 ring-terracotta-400 shadow-sm'
          : 'bg-white ring-1 ring-sand-200 hover:ring-deepblue-200 hover:shadow-sm'
      }`}
    >
      {/* Airline */}
      <div className="flex items-center gap-2 w-32 sm:w-40 flex-shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-deepblue-100 text-xs font-bold text-deepblue-700">
          {flight.airlineCode}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-deepblue-800 leading-tight">{flight.airline}</p>
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-2 flex-1">
        <div className="text-center">
          <p className="text-sm font-bold text-deepblue-800">{flight.departTime}</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-[10px] text-deepblue-400 flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {flight.duration}
          </p>
          <div className="flex items-center gap-1 w-full">
            <div className="h-px flex-1 bg-sand-300" />
            <Plane className="h-3 w-3 text-deepblue-400" />
            <div className="h-px flex-1 bg-sand-300" />
          </div>
          <p className="text-[10px] text-deepblue-400">{stopsLabel}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-deepblue-800">{flight.arriveTime}</p>
        </div>
      </div>

      {/* Price + Select */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p className="font-display text-lg font-bold text-terracotta-600">${flight.price}</p>
        </div>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
          selected ? 'border-terracotta-500 bg-terracotta-500' : 'border-sand-300'
        }`}>
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
      </div>
    </button>
  );
}
