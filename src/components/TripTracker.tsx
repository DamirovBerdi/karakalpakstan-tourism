import { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Clock, Trash2, Camera, Loader2, CheckCircle2, Calendar } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

interface CheckIn {
  id: string;
  place_name: string;
  note: string;
  photo_url: string;
  created_at: string;
  lat: number | null;
  lng: number | null;
}

const QUICK_PLACES = [
  'Savitsky Museum',
  'Moynaq Ship Graveyard',
  'Ustyurt Plateau',
  'Mizdakhan Necropolis',
  'Chilpyk Fortress',
  'Lake Sudochye',
  'Nukus Bazaar',
  'Aral Sea Yurt Camp',
];

export default function TripTracker() {
  const { t } = useLang();
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [note, setNote] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<{ lat: number; lng: number } | null>(null);

  const loadCheckins = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('trip_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Load checkins error:', error);
    }
    setCheckins((data ?? []) as CheckIn[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCheckins();
  }, [loadCheckins]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !placeName.trim()) return;
    setSubmitting(true);

    // Try to get current location
    let lat: number | null = null;
    let lng: number | null = null;
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        // Location optional
      }
    }

    const { data, error } = await supabase
      .from('trip_checkins')
      .insert({
        user_id: user.id,
        place_name: placeName.trim(),
        note: note.trim(),
        photo_url: photoUrl.trim(),
        lat,
        lng,
      })
      .select()
      .single();

    if (error) {
      console.error('Check-in error:', error);
      setSubmitting(false);
      return;
    }

    setCheckins([data as CheckIn, ...checkins]);
    setPlaceName('');
    setNote('');
    setPhotoUrl('');
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('trip_checkins').delete().eq('id', id);
    if (error) return;
    setCheckins(checkins.filter((c) => c.id !== id));
  };

  const detectLoc = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 5000 }
    );
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="tracker" className="py-16 sm:py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <MapPin className="h-3.5 w-3.5" /> Trip Tracker
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('tracker.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('tracker.subtitle')}</p>
        </div>

        {!user ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-sand-200">
            <CheckCircle2 className="mx-auto h-10 w-10 text-deepblue-300 mb-3" />
            <p className="text-deepblue-600">{t('tracker.loginRequired')}</p>
          </div>
        ) : (
          <>
            {/* Check-in button */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-600"
              >
                <Plus className="h-4 w-4" /> {t('tracker.checkIn')}
              </button>
              <button
                onClick={detectLoc}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-deepblue-700 ring-1 ring-sand-300 transition-colors hover:bg-sand-50"
              >
                <MapPin className="h-4 w-4" /> {t('tracker.myLocation')}
              </button>
            </div>

            {/* Check-in form */}
            {showForm && (
              <form onSubmit={handleCheckIn} className="mb-6 rounded-2xl bg-white p-5 shadow-subtle ring-1 ring-sand-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('tracker.placeName')}</label>
                  <input
                    type="text"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    required
                    list="quick-places"
                    className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                    placeholder="e.g. Savitsky Museum"
                  />
                  <datalist id="quick-places">
                    {QUICK_PLACES.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('tracker.note')}</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                      placeholder={t('tracker.notePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('tracker.photoUrl')}</label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                {currentLoc && (
                  <p className="text-xs text-deepblue-500">
                    {t('tracker.locationDetected')}: {currentLoc.lat.toFixed(4)}, {currentLoc.lng.toFixed(4)}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-700 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {t('tracker.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl bg-sand-100 px-4 py-2.5 text-sm font-medium text-deepblue-600 transition-colors hover:bg-sand-200"
                  >
                    {t('tracker.cancel')}
                  </button>
                </div>
              </form>
            )}

            {/* Check-in history */}
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" />
              </div>
            ) : checkins.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-sand-200">
                <MapPin className="mx-auto h-10 w-10 text-deepblue-300 mb-3" />
                <p className="text-deepblue-500">{t('tracker.empty')}</p>
              </div>
            ) : (
              <>
                {/* Stats bar */}
                <div className="mb-4 flex items-center gap-4 rounded-xl bg-deepblue-700 px-5 py-3 text-white">
                  <div>
                    <p className="text-2xl font-bold">{checkins.length}</p>
                    <p className="text-xs text-white/70">{t('tracker.placesVisited')}</p>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(checkins[checkins.length - 1].created_at)} — {formatDate(checkins[0].created_at)}
                  </div>
                </div>

                <div className="space-y-3">
                  {checkins.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle"
                    >
                      {c.photo_url ? (
                        <img src={c.photo_url} alt={c.place_name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-sand-100 flex-shrink-0">
                          <Camera className="h-6 w-6 text-deepblue-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-deepblue-900">{c.place_name}</h3>
                        {c.note && <p className="text-sm text-deepblue-600 mt-0.5">{c.note}</p>}
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-deepblue-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(c.created_at)}
                          {c.lat && c.lng && (
                            <span className="ml-2">GPS: {c.lat.toFixed(3)}, {c.lng.toFixed(3)}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-2 text-deepblue-400 transition-colors hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
