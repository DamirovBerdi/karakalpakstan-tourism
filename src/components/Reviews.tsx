import { useState, useEffect, useCallback } from 'react';
import { Star, Plus, Loader2, Send, Trash2, MessageSquare, User as UserIcon, CheckCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  user_id: string | null;
  place_id: string;
  place_name: string;
  rating: number;
  comment: string;
  photo_urls: string[];
  author_name: string | null;
  country: string | null;
  is_verified_trip?: boolean;
  trip_date?: string;
  created_at: string;
}

const REVIEWABLE_PLACES = [
  { id: 'savitsky', name: 'Savitsky Museum' },
  { id: 'moynaq', name: 'Moynaq Ship Graveyard' },
  { id: 'ustyurt', name: 'Ustyurt Plateau' },
  { id: 'mizdakhan', name: 'Mizdakhan Necropolis' },
  { id: 'chilpyk', name: 'Chilpyk Fortress' },
  { id: 'sudochye', name: 'Lake Sudochye' },
  { id: 'berdaq', name: 'Berdaq Museum' },
  { id: 'nukus-bazaar', name: 'Nukus Bazaar' },
  { id: 'aral-tour', name: 'Aral Sea Expedition Tour' },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user_id: null,
    place_id: 'moynaq',
    place_name: 'Moynaq Ship Graveyard',
    rating: 5,
    comment: 'Unbelievable historical place. Standing next to the old ships on what used to be the Aral Sea bed is an experience you will never forget.',
    photo_urls: ['https://images.pexels.com/photos/28949995/pexels-photo-28949995.jpeg?auto=compress&cs=tinysrgb&w=600'],
    author_name: 'Elena Rostova',
    country: 'Germany',
    is_verified_trip: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rev-2',
    user_id: null,
    place_id: 'savitsky',
    place_name: 'Savitsky Museum',
    rating: 5,
    comment: 'The world-famous collection of Russian Avant-Garde art in the middle of Karakalpakstan. Highly recommended guide tour!',
    photo_urls: [],
    author_name: 'Markus Weber',
    country: 'Switzerland',
    is_verified_trip: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export default function Reviews() {
  const { t } = useLang();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(REVIEWABLE_PLACES[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isPostTrip, setIsPostTrip] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterPlace, setFilterPlace] = useState<string>('all');

  const loadReviews = useCallback(async () => {
    try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (filterPlace !== 'all') {
        query = query.eq('place_id', filterPlace);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setReviews(data as Review[]);
      } else {
        setReviews(filterPlace === 'all' ? INITIAL_REVIEWS : INITIAL_REVIEWS.filter((r) => r.place_id === filterPlace));
      }
    } catch {
      setReviews(INITIAL_REVIEWS);
    }
    setLoading(false);
  }, [filterPlace]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setSubmitting(true);

    const photos = photoUrl.trim() ? [photoUrl.trim()] : [];

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        place_id: selectedPlace.id,
        place_name: selectedPlace.name,
        rating,
        comment: comment.trim(),
        photo_urls: photos,
        category: isPostTrip ? 'post_trip' : 'place',
        target_id: selectedPlace.id,
        target_name: selectedPlace.name,
        author_name: user.email ? user.email.split('@')[0] : 'Путешественник',
        country: null,
        title: '',
        is_verified_trip: isPostTrip,
      })
      .select()
      .single();

    if (error) {
      console.error('Review submit error:', error);
      setSubmitting(false);
      return;
    }

    setReviews([data as Review, ...reviews]);
    setComment('');
    setPhotoUrl('');
    setRating(5);
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) return;
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <MessageSquare className="h-3.5 w-3.5" /> Reviews & Experiences
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('reviews.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('reviews.subtitle')}</p>
        </div>

        {/* Stats */}
        {reviews.length > 0 && (
          <div className="mb-6 flex items-center justify-center gap-6 rounded-xl bg-sand-50 px-6 py-3 ring-1 ring-sand-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-deepblue-900">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-deepblue-500">{t('reviews.avgRating')}</p>
            </div>
            <div className="h-8 w-px bg-sand-300" />
            <div className="text-center">
              <p className="text-2xl font-bold text-deepblue-900">{reviews.length}</p>
              <p className="text-xs text-deepblue-500">{t('reviews.totalReviews')}</p>
            </div>
          </div>
        )}

        {/* Filter + Add button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <select
            value={filterPlace}
            onChange={(e) => { setFilterPlace(e.target.value); setLoading(true); }}
            className="rounded-xl border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-deepblue-700 outline-none focus:border-deepblue-500"
          >
            <option value="all">{t('reviews.allPlaces')}</option>
            {REVIEWABLE_PLACES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-terracotta-600"
            >
              <Plus className="h-4 w-4" /> {t('reviews.add')}
            </button>
          ) : (
            <p className="text-xs text-deepblue-500">{t('reviews.loginRequired')}</p>
          )}
        </div>

        {/* Review form */}
        {showForm && user && (
          <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-white p-5 shadow-subtle ring-1 ring-sand-200 space-y-4">
            {/* Post-trip toggle */}
            <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-sand-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${isPostTrip ? 'text-emerald-600' : 'text-sand-400'}`} />
                <div>
                  <p className="text-xs font-bold text-deepblue-900">Отзыв после поездки (Post-Trip Review)</p>
                  <p className="text-[11px] text-deepblue-500">Отметьте, если вы лично посещали эту локацию или были в туре</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPostTrip}
                onChange={(e) => setIsPostTrip(e.target.checked)}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('reviews.place')}</label>
              <select
                value={selectedPlace.id}
                onChange={(e) => setSelectedPlace(REVIEWABLE_PLACES.find((p) => p.id === e.target.value)!)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
              >
                {REVIEWABLE_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('reviews.rating')}</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-1"
                  >
                    <Star
                      className={`h-7 w-7 transition-all ${
                        n <= rating ? 'fill-terracotta-500 text-terracotta-500' : 'text-sand-300 hover:text-terracotta-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('reviews.comment')}</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white resize-none"
                placeholder={t('reviews.commentPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('reviews.photoUrl')}</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t('reviews.submit')}
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

        {/* Reviews list */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl bg-sand-50 p-8 text-center ring-1 ring-sand-200">
            <Star className="mx-auto h-10 w-10 text-sand-300 mb-3" />
            <p className="text-deepblue-500">{t('reviews.empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-deepblue-100 flex-shrink-0">
                      <UserIcon className="h-5 w-5 text-deepblue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-deepblue-900">{r.author_name || t('reviews.anonymous')}</p>
                        {r.is_verified_trip && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                            <CheckCircle className="h-3 w-3 text-emerald-600" /> Подтверждённая поездка
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-deepblue-400">{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${n <= r.rating ? 'fill-terracotta-500 text-terracotta-500' : 'text-sand-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-deepblue-600">
                    {r.place_name}
                  </span>
                </div>
                <p className="text-sm text-deepblue-700 leading-relaxed">{r.comment}</p>
                {r.photo_urls && r.photo_urls.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {r.photo_urls.map((url, i) => (
                      <img key={i} src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                    ))}
                  </div>
                )}
                {user && r.user_id === user.id && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" /> {t('reviews.delete')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
