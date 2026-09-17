import { useState, useEffect, useCallback } from 'react';
import { Trophy, Award, Zap, MapPin, Medal, Crown, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  badge_count: number;
  checkin_count: number;
}

type Tab = 'points' | 'badges' | 'checkins';

export default function Leaderboard() {
  const { t } = useLang();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('points');

  const loadLeaderboard = useCallback(async () => {
    // Get all profiles
    const { data: profiles, error: profError } = await supabase
      .from('community_profiles')
      .select('*');
    if (profError || !profiles) {
      setLoading(false);
      return;
    }

    // Get points aggregated by user
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('user_id, points');

    const pointsMap = new Map<string, number>();
    (pointsData ?? []).forEach((p: { user_id: string; points: number }) => {
      pointsMap.set(p.user_id, (pointsMap.get(p.user_id) ?? 0) + p.points);
    });

    // Get badge counts by user
    const { data: badgeData } = await supabase
      .from('user_badges')
      .select('user_id');

    const badgeMap = new Map<string, number>();
    (badgeData ?? []).forEach((b: { user_id: string }) => {
      badgeMap.set(b.user_id, (badgeMap.get(b.user_id) ?? 0) + 1);
    });

    // Get check-in counts by user
    const { data: checkinData } = await supabase
      .from('trip_checkins')
      .select('user_id');

    const checkinMap = new Map<string, number>();
    (checkinData ?? []).forEach((c: { user_id: string }) => {
      checkinMap.set(c.user_id, (checkinMap.get(c.user_id) ?? 0) + 1);
    });

    const combined: LeaderboardEntry[] = (profiles as typeof profiles).map((p) => ({
      user_id: p.id,
      username: p.username,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      total_points: pointsMap.get(p.id) ?? 0,
      badge_count: badgeMap.get(p.id) ?? 0,
      checkin_count: checkinMap.get(p.id) ?? 0,
    }));

    setEntries(combined);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const sorted = [...entries].sort((a, b) => {
    if (tab === 'points') return b.total_points - a.total_points;
    if (tab === 'badges') return b.badge_count - a.badge_count;
    return b.checkin_count - a.checkin_count;
  });

  const tabs: { key: Tab; label: string; icon: typeof Zap }[] = [
    { key: 'points', label: t('leaderboard.points'), icon: Zap },
    { key: 'badges', label: t('leaderboard.badges'), icon: Award },
    { key: 'checkins', label: t('leaderboard.visits'), icon: MapPin },
  ];

  const getValue = (e: LeaderboardEntry) => {
    if (tab === 'points') return e.total_points;
    if (tab === 'badges') return e.badge_count;
    return e.checkin_count;
  };

  const getUnit = () => {
    if (tab === 'points') return 'pts';
    if (tab === 'badges') return '';
    return '';
  };

  const podiumColors = ['from-amber-400 to-amber-600', 'from-sand-300 to-sand-500', 'from-orange-400 to-orange-600'];

  return (
    <section id="leaderboard" className="py-16 sm:py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700 mb-3">
            <Crown className="h-3.5 w-3.5" /> {t('leaderboard.title')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('leaderboard.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('leaderboard.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  tab === tb.key ? 'bg-deepblue-700 text-white shadow-subtle' : 'bg-white text-deepblue-600 ring-1 ring-sand-300 hover:bg-sand-50'
                }`}
              >
                <Icon className="h-4 w-4" /> {tb.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" /></div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-sand-200">
            <Trophy className="mx-auto h-10 w-10 text-sand-300 mb-3" />
            <p className="text-deepblue-500">{t('leaderboard.empty')}</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {sorted.length >= 1 && (
              <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
                {[1, 0, 2].map((displayIdx) => {
                  const entry = sorted[displayIdx];
                  if (!entry) return <div key={displayIdx} />;
                  return (
                    <div key={entry.user_id} className="flex flex-col items-center">
                      <div className={`relative mb-2 ${displayIdx === 0 ? 'scale-110' : ''}`}>
                        <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br ${podiumColors[displayIdx]} shadow-medium ring-4 ring-white`}>
                          {entry.avatar_url ? (
                            <img src={entry.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            <span className="text-xl font-bold text-white">{entry.username[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <div className={`absolute -top-2 -right-2 rounded-full ${displayIdx === 0 ? 'bg-amber-500' : displayIdx === 1 ? 'bg-sand-400' : 'bg-orange-500'} w-6 h-6 flex items-center justify-center text-xs font-bold text-white shadow`}>
                          {displayIdx + 1}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-deepblue-900 truncate max-w-full">{entry.username}</p>
                      <p className={`text-base sm:text-lg font-bold ${displayIdx === 0 ? 'text-amber-600' : displayIdx === 1 ? 'text-sand-600' : 'text-orange-600'}`}>
                        {getValue(entry)} {getUnit()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full ranking list */}
            <div className="space-y-2">
              {sorted.map((entry, i) => {
                const isMe = user?.id === entry.user_id;
                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                      isMe
                        ? 'bg-terracotta-50 ring-1 ring-terracotta-200'
                        : 'bg-white ring-1 ring-sand-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      i < 3 ? 'bg-amber-400 text-amber-900' : 'bg-sand-100 text-deepblue-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-deepblue-100">
                      {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-deepblue-600">{entry.username[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-deepblue-900 truncate">
                        {entry.username} {isMe && <span className="text-terracotta-600">({t('leaderboard.you')})</span>}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-deepblue-400">
                        <span className="flex items-center gap-0.5"><Award className="h-3 w-3" /> {entry.badge_count}</span>
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {entry.checkin_count}</span>
                        <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" /> {entry.total_points}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-display text-lg font-bold text-deepblue-900">{getValue(entry)}</p>
                      <p className="text-xs text-deepblue-400">{getUnit()}</p>
                    </div>
                    {i < 3 && <Medal className={`h-5 w-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-sand-400' : 'text-orange-500'} flex-shrink-0`} />}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
