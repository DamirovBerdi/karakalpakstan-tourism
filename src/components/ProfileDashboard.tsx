import { useState, useEffect, useCallback } from 'react';
import { User as UserIcon, Zap, Award, MapPin, Brain, TrendingUp, LogOut, Loader2, LogIn } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';

interface UserBadge {
  id: string;
  badge_id: string;
  created_at: string;
  badges: {
    id: string;
    name: string;
    description: string;
    place_name: string;
    icon: string;
    points: number;
  };
}

interface CheckIn {
  id: string;
  place_name: string;
  created_at: string;
}

interface QuizResult {
  id: string;
  score: number;
  total: number;
  points_earned: number;
  created_at: string;
}

export default function ProfileDashboard() {
  const { t } = useLang();
  const { user, profile, signOut } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load badges with join
    const { data: badgeData } = await supabase
      .from('user_badges')
      .select('id, badge_id, created_at, badges:badges(id, name, description, place_name, icon, points)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setBadges((badgeData ?? []) as unknown as UserBadge[]);

    // Load checkins
    const { data: checkinData } = await supabase
      .from('trip_checkins')
      .select('id, place_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setCheckins((checkinData ?? []) as CheckIn[]);

    // Load quiz results
    const { data: quizData } = await supabase
      .from('quiz_results')
      .select('id, score, total, points_earned, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setQuizResults((quizData ?? []) as QuizResult[]);

    // Load total points
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', user.id);
    const sum = (pointsData ?? []).reduce((acc: number, p: { points: number }) => acc + p.points, 0);
    setTotalPoints(sum);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) {
    return (
      <section id="profile" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-sand-50 p-8 ring-1 ring-sand-200 shadow-sm">
            <UserIcon className="mx-auto h-12 w-12 text-deepblue-400 mb-3" />
            <h3 className="font-display text-xl font-bold text-deepblue-900 mb-2">Личный Кабинет Туриста</h3>
            <p className="text-deepblue-600 mb-6 max-w-md mx-auto">{t('profile.loginRequired')}</p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-deepblue-700 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-deepblue-800 shadow hover:scale-105"
            >
              <LogIn className="h-4 w-4" />
              Войти или Зарегистрироваться
            </button>
          </div>
        </div>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </section>
    );
  }

  if (loading) {
    return (
      <section id="profile" className="py-16 sm:py-20 bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" />
        </div>
      </section>
    );
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section id="profile" className="py-16 sm:py-20 bg-gradient-to-b from-white to-sand-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile header card */}
        <div className="rounded-2xl bg-gradient-to-br from-deepblue-700 to-deepblue-900 p-6 text-white shadow-medium mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">{profile?.username}</h2>
              {profile?.full_name && <p className="text-sm text-white/70">{profile.full_name}</p>}
              {profile?.bio && <p className="text-sm text-white/60 mt-1">{profile.bio}</p>}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/50">
                {profile?.home_country && <span>{profile.home_country}</span>}
                <span>Member since {profile ? formatDate(profile.created_at) : ''}</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> {t('community.signOut')}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-terracotta-500" />
              <span className="text-xs text-deepblue-500">{t('profile.points')}</span>
            </div>
            <p className="font-display text-2xl font-bold text-deepblue-900">{totalPoints}</p>
          </div>
          <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-deepblue-500">{t('profile.badges')}</span>
            </div>
            <p className="font-display text-2xl font-bold text-deepblue-900">{badges.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-deepblue-500" />
              <span className="text-xs text-deepblue-500">{t('profile.visited')}</span>
            </div>
            <p className="font-display text-2xl font-bold text-deepblue-900">{checkins.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-green-500" />
              <span className="text-xs text-deepblue-500">{t('profile.quizPlayed')}</span>
            </div>
            <p className="font-display text-2xl font-bold text-deepblue-900">{quizResults.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges section */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
            <h3 className="font-display text-lg font-bold text-deepblue-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> {t('profile.earnedBadges')}
            </h3>
            {badges.length === 0 ? (
              <p className="text-sm text-deepblue-400 text-center py-6">{t('profile.noBadges')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((ub) => (
                  <div key={ub.id} className="rounded-xl bg-gradient-to-br from-amber-50 to-sand-50 p-3 ring-1 ring-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
                        <Award className="h-5 w-5 text-amber-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-deepblue-900 truncate">{ub.badges.name}</p>
                      </div>
                    </div>
                    <p className="text-xs text-deepblue-600 leading-snug mb-1">{ub.badges.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-deepblue-400 truncate">{ub.badges.place_name}</span>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-terracotta-600 flex-shrink-0">
                        <Zap className="h-3 w-3" /> {ub.badges.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
            <h3 className="font-display text-lg font-bold text-deepblue-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-deepblue-500" /> {t('profile.activity')}
            </h3>
            {checkins.length === 0 && quizResults.length === 0 ? (
              <p className="text-sm text-deepblue-400 text-center py-6">{t('profile.noActivity')}</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {checkins.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-deepblue-100 flex-shrink-0">
                      <MapPin className="h-4 w-4 text-deepblue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-deepblue-900 truncate">{c.place_name}</p>
                      <p className="text-xs text-deepblue-400">{formatDate(c.created_at)}</p>
                    </div>
                  </div>
                ))}
                {quizResults.slice(0, 3).map((q) => (
                  <div key={q.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                      <Brain className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-deepblue-900 truncate">
                        Quiz: {q.score}/{q.total} correct
                      </p>
                      <p className="text-xs text-deepblue-400">{formatDate(q.created_at)}</p>
                    </div>
                    <span className="text-xs font-bold text-terracotta-600 flex items-center gap-0.5 flex-shrink-0">
                      <Zap className="h-3 w-3" /> {q.points_earned}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
