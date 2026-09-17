import { useState, useEffect, useCallback } from 'react';
import { Camera, Heart, Trophy, Upload, Trash2, Loader2, MapPin, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

interface PhotoEntry {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  location: string;
  votes: number;
  created_at: string;
}

export default function PhotoContest() {
  const { t } = useLang();
  const { user } = useAuth();
  const [entries, setEntries] = useState<PhotoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const loadEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('photo_entries')
      .select('*')
      .order('votes', { ascending: false })
      .limit(50);
    if (error) {
      console.error('Load entries error:', error);
    }
    setEntries((data ?? []) as PhotoEntry[]);
    setLoading(false);
  }, []);

  const loadMyVotes = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('photo_votes')
      .select('entry_id')
      .eq('user_id', user.id);
    if (!error && data) {
      setVotedIds(new Set(data.map((v: { entry_id: string }) => v.entry_id)));
    }
  }, [user]);

  useEffect(() => {
    loadEntries();
    loadMyVotes();
  }, [loadEntries, loadMyVotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageUrl.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from('photo_entries')
      .insert({
        user_id: user.id,
        title: title.trim() || 'Untitled',
        image_url: imageUrl.trim(),
        location: location.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Submit error:', error);
      setSubmitting(false);
      return;
    }

    // Award 10 points for participating
    await supabase
      .from('user_points')
      .insert({ user_id: user.id, points: 10, reason: 'contest_entry' });

    setEntries([{ ...data as PhotoEntry }, ...entries]);
    setTitle('');
    setImageUrl('');
    setLocation('');
    setShowForm(false);
    setSubmitting(false);
  };

  const handleVote = async (entryId: string) => {
    if (!user || votedIds.has(entryId)) return;

    const { error } = await supabase
      .from('photo_votes')
      .insert({ user_id: user.id, entry_id: entryId });

    if (error) {
      if (error.code === '23505') return; // already voted
      console.error('Vote error:', error);
      return;
    }

    // Update vote count on entry
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      await supabase
        .from('photo_entries')
        .update({ votes: entry.votes + 1 })
        .eq('id', entryId);
    }

    // Award 2 points for voting
    await supabase
      .from('user_points')
      .insert({ user_id: user.id, points: 2, reason: 'contest_vote' });

    setEntries(entries.map((e) => e.id === entryId ? { ...e, votes: e.votes + 1 } : e));
    setVotedIds(new Set([...votedIds, entryId]));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('photo_entries').delete().eq('id', id);
    if (error) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <section id="contest" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <Camera className="h-3.5 w-3.5" /> Photo Contest
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('contest.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('contest.subtitle')}</p>
        </div>

        {/* Top 3 podium */}
        {entries.length >= 3 && (
          <div className="mb-8 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            {[1, 0, 2].map((idx) => {
              const e = entries[idx];
              if (!e) return null;
              const heights = ['h-32', 'h-40', 'h-28'];
              const medals = ['bg-sand-200 text-sand-700', 'bg-amber-400 text-amber-900', 'bg-orange-300 text-orange-800'];
              const order = [1, 0, 2];
              const podiumPos = order.indexOf(idx);
              return (
                <div key={e.id} className="flex flex-col items-center">
                  <div className={`relative ${heights[podiumPos]} w-full rounded-t-xl overflow-hidden ring-2 ${podiumPos === 1 ? 'ring-amber-400' : 'ring-sand-200'}`}>
                    <img src={e.image_url} alt={e.title} className="h-full w-full object-cover" />
                    <div className={`absolute -top-2 -left-2 rounded-full ${medals[podiumPos]} w-8 h-8 flex items-center justify-center text-sm font-bold shadow-subtle`}>
                      {idx + 1}
                    </div>
                  </div>
                  <div className={`w-full rounded-b-lg ${podiumPos === 1 ? 'bg-amber-400' : 'bg-sand-100'} py-1.5 text-center`}>
                    <p className="text-xs font-bold text-deepblue-900 truncate px-1">{e.title}</p>
                    <p className="text-xs text-deepblue-500 flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 fill-terracotta-500 text-terracotta-500" /> {e.votes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm text-deepblue-500">{entries.length} {t('contest.entries')}</p>
          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-terracotta-600"
            >
              <Upload className="h-4 w-4" /> {t('contest.upload')}
            </button>
          ) : (
            <p className="text-xs text-deepblue-500">{t('contest.loginRequired')}</p>
          )}
        </div>

        {/* Upload form */}
        {showForm && user && (
          <form onSubmit={handleSubmit} className="mb-6 rounded-2xl bg-sand-50 p-5 ring-1 ring-sand-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('contest.title_field')}</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                  placeholder="Sunset at the Ship Graveyard" />
              </div>
              <div>
                <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('contest.location_field')}</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                  placeholder="Moynaq" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('contest.photoUrl')}</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
                className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                placeholder="https://images.pexels.com/..." />
              <p className="text-xs text-deepblue-400 mt-1">{t('contest.photoHint')}</p>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-700 disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {t('contest.submit')}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-xl bg-sand-100 px-4 py-2.5 text-sm font-medium text-deepblue-600 hover:bg-sand-200">
                {t('tracker.cancel')}
              </button>
            </div>
          </form>
        )}

        {/* Photo grid */}
        {loading ? (
          <div className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" /></div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl bg-sand-50 p-8 text-center ring-1 ring-sand-200">
            <ImageIcon className="mx-auto h-10 w-10 text-sand-300 mb-3" />
            <p className="text-deepblue-500">{t('contest.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {entries.map((e, i) => (
              <div key={e.id} className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle">
                <div className="relative aspect-square overflow-hidden">
                  <img src={e.image_url} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {i < 3 && (
                    <div className="absolute top-2 left-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-900 shadow">
                      <Trophy className="inline h-3 w-3 mr-0.5" />#{i + 1}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-deepblue-900 truncate">{e.title}</p>
                  {e.location && (
                    <p className="text-xs text-deepblue-400 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" /> {e.location}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(e.id)}
                        disabled={!user || votedIds.has(e.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                          votedIds.has(e.id)
                            ? 'bg-terracotta-500 text-white cursor-default'
                            : user
                              ? 'bg-terracotta-50 text-terracotta-600 hover:bg-terracotta-100'
                              : 'bg-sand-100 text-sand-400 cursor-not-allowed'
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> {e.votes}
                      </button>
                      <span className="text-[10px] text-deepblue-400">{formatDate(e.created_at)}</span>
                    </div>
                    {user && e.user_id === user.id && (
                      <button onClick={() => handleDelete(e.id)} className="text-deepblue-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
