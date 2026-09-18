import { useState, useEffect, useCallback } from 'react';
import {
  Lock, Loader2, LogOut, Users, User, MapPin, TrendingUp, DollarSign, Trophy,
  Globe, Camera, Award, Zap, Calendar, Eye, Phone, ArrowLeft, RefreshCw,
  BarChart3, Activity, Shield, Search, Car,
  Building, Bed, FlaskConical, Monitor, FileText, Star,
  Trash2, Plus, CheckCircle, Briefcase, UserCheck, MessageSquare, Filter, Check, X,
  Receipt, Printer, Send,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { guides as staticGuides } from '@/data/tourism';
import { SUPER_ADMIN_ACCOUNTS, AdminInfo, hashPassword } from '@/lib/adminAuth';
import { generateSampleReceipts, PlatformReceipt } from '@/lib/receipts';

// === Types ===
interface AdminStats {
  totalUsers: number;
  totalCheckins: number;
  totalBadges: number;
  totalPoints: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalPhotos: number;
  totalVotes: number;
  totalQuizPlays: number;
  totalSpotViews: number;
  totalGameWinners: number;
}

interface CountryStat {
  country: string;
  count: number;
}

interface SpotStat {
  spot_name: string;
  views: number;
  category: string;
}

interface BookingRow {
  id: string;
  tour_name: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  group_size: number;
  status: string;
  created_at: string;
}

interface TouristRequestRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget_total: number;
  group_size: number;
  duration_days: number;
  status: string;
  tour_name: string | null;
  travel_date: string | null;
  guests: number | null;
  created_at: string;
}

interface GameWinnerRow {
  id: string;
  game_type: string;
  player_name: string;
  phone: string;
  location: string;
  score: number;
  total: number;
  points_earned: number;
  created_at: string;
}

interface EcoVolunteerRow {
  id: string;
  project_name: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  created_at: string;
}

interface ProfileRow {
  id: string;
  username: string;
  home_country: string;
  created_at: string;
}

interface TaxiBookingRow {
  id: string;
  tracking_id: string;
  tourist_name: string;
  phone: string;
  email: string | null;
  pickup_location: string;
  dropoff_location?: string;
  destination?: string;
  travel_date?: string;
  travel_datetime?: string;
  passengers: number;
  notes?: string;
  total_price?: number;
  commission_rate?: number;
  status: string;
  is_test_mode?: boolean;
  created_at: string;
}

interface HotelBookingRow {
  id: string;
  tracking_id: string;
  hotel_id: string;
  hotel_name: string;
  guest_name: string;
  email: string;
  phone: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  rooms: number;
  nights: number;
  total_price: number;
  commission_rate: number;
  status: string;
  is_test_mode: boolean;
  created_at: string;
}

interface VisitorSessionRow {
  id: string;
  session_token: string;
  ip_address: string;
  country: string;
  user_agent: string;
  page_views: number;
  first_seen: string;
  last_seen: string;
}

interface PageViewRow {
  id: string;
  session_token: string;
  page_path: string;
  page_title: string;
  service_used: string;
  created_at: string;
}

export interface AdminGuide {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews_count: number;
  languages: string[];
  specialties: string[];
  daily_rate: number;
  phone: string;
  whatsapp: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  city: string;
  commission_rate: number;
  active_tours: number;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export interface ReviewRow {
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

export interface AdminSupportMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

type Tab = 'overview' | 'receipts' | 'support' | 'visitors' | 'tourists' | 'spots' | 'bookings' | 'guides' | 'agencies' | 'reviews_mod' | 'taxi' | 'hotels' | 'orders' | 'winners' | 'photos';



// === Component ===
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoggingIn(true);
    setLoginError('');

    const uInput = username.trim();
    const pInput = password.trim();
    const targetEmail = uInput.includes('@') ? uInput : `${uInput.toLowerCase()}@karakalpak.travel`;

    try {
      // 1. Authenticate with Supabase Auth (cryptographically verified server-side JWT session)
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: pInput,
      });

      // If account not yet registered in Supabase Auth, verify super admin credentials and auto-provision
      if (authError && (uInput.toLowerCase() === 'azada122321' || uInput.toLowerCase() === 'damir122321')) {
        const pHash = await hashPassword(pInput);
        const superMatch = SUPER_ADMIN_ACCOUNTS.find(
          (acc) => acc.username.toLowerCase() === uInput.toLowerCase() && acc.passwordHash === pHash
        );
        if (superMatch) {
          const signUpRes = await supabase.auth.signUp({
            email: targetEmail,
            password: pInput,
          });
          if (signUpRes.data.session) {
            authData = signUpRes.data;
            authError = null;
          } else {
            const retryRes = await supabase.auth.signInWithPassword({
              email: targetEmail,
              password: pInput,
            });
            authData = retryRes.data;
            authError = retryRes.error;
          }
        }
      }

      if (!authError && authData?.session) {
        const isSuper = targetEmail.includes('azada122321') || targetEmail.includes('damir122321') || targetEmail.endsWith('@karakalpak.travel');
        const info: AdminInfo = {
          username: uInput,
          role: isSuper ? 'Super Admin' : 'Admin',
          displayName: uInput.includes('damir') ? 'Damir' : (uInput.includes('azada') ? 'Azada' : uInput),
        };
        setAdminInfo(info);
        setAuthed(true);
        setLoggingIn(false);
        return;
      }

      // 2. Offline fallback check for Super Admin
      const pHash = await hashPassword(pInput);
      const superMatch = SUPER_ADMIN_ACCOUNTS.find(
        (acc) => acc.username.toLowerCase() === uInput.toLowerCase() && acc.passwordHash === pHash
      );
      if (superMatch) {
        const info: AdminInfo = { username: superMatch.username, role: superMatch.role, displayName: superMatch.displayName };
        setAdminInfo(info);
        setAuthed(true);
        setLoggingIn(false);
        return;
      }

      setLoginError('Неверный логин или пароль администратора.');
    } catch {
      setLoginError('Ошибка подключения к серверу авторизации.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setAuthed(false);
    setAdminInfo(null);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    let mounted = true;
    async function verifyBackendSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const email = session.user.email ?? '';
          const isSuper = email.includes('azada122321') || email.includes('damir122321') || email.endsWith('@karakalpak.travel');
          if (isSuper) {
            setAdminInfo({
              username: email.split('@')[0],
              role: 'Super Admin',
              displayName: email.includes('damir') ? 'Damir' : 'Azada',
            });
            setAuthed(true);
            return;
          }
        }
      } catch {
        // ignore
      }
    }
    verifyBackendSession();
    return () => { mounted = false; };
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deepblue-900 via-deepblue-800 to-deepblue-950 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 shadow-elevated">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-xs text-sand-300">Karakalpakstan Tourism Portal — Super Admin Control</p>
          </div>

          <form onSubmit={handleLogin} className="rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-elevated ring-1 ring-white/20">
            <label className="block text-xs font-semibold text-deepblue-900 mb-1.5">Username</label>
            <div className="relative mb-3">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                placeholder="Enter admin username"
                className="w-full rounded-xl border border-sand-300 bg-sand-50 pl-10 pr-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white transition-colors"
              />
            </div>
            <label className="block text-xs font-semibold text-deepblue-900 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-sand-300 bg-sand-50 pl-10 pr-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white transition-colors"
              />
            </div>
            {loginError && (
              <p className="mt-2 text-xs font-semibold text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="mt-4 w-full rounded-xl bg-deepblue-700 py-3 text-sm font-bold text-white transition-colors hover:bg-deepblue-800 disabled:opacity-60 shadow"
            >
              {loggingIn ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Sign In as Super Admin'}
            </button>
            <a
              href="/"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs text-deepblue-400 hover:text-deepblue-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to website
            </a>
          </form>

          <p className="mt-4 text-center text-xs text-white/40">
            Super Admin Area — highest level hierarchy credentials active
          </p>
        </div>
      </div>
    );
  }

  return <DashboardPanel onLogout={handleLogout} adminInfo={adminInfo} />;
}

// === Main Dashboard ===
function DashboardPanel({ onLogout, adminInfo }: { onLogout: () => void; adminInfo: AdminInfo | null }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [countries, setCountries] = useState<CountryStat[]>([]);
  const [spots, setSpots] = useState<SpotStat[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [touristReqs, setTouristReqs] = useState<TouristRequestRow[]>([]);
  const [volunteers, setVolunteers] = useState<EcoVolunteerRow[]>([]);
  const [winners, setWinners] = useState<GameWinnerRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [taxiBookings, setTaxiBookings] = useState<TaxiBookingRow[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBookingRow[]>([]);
  const [_visitorSessions, setVisitorSessions] = useState<VisitorSessionRow[]>([]);
  const [_pageViews, setPageViews] = useState<PageViewRow[]>([]);
  const [photos, setPhotos] = useState<{ id: string; title: string; location: string; votes: number; created_at: string }[]>([]);
  
  // Dynamic management lists
  const [guidesList, setGuidesList] = useState<AdminGuide[]>([]);
  const [agenciesList, setAgenciesList] = useState<AdminAgency[]>([]);
  const [reviewsList, setReviewsList] = useState<ReviewRow[]>([]);

  // Modal / Form states
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [guideName, setGuideName] = useState('');
  const [guidePhoto, setGuidePhoto] = useState('');
  const [guideDailyRate, setGuideDailyRate] = useState(45);
  const [guidePhone, setGuidePhone] = useState('');
  const [guideWhatsapp, setGuideWhatsapp] = useState('');
  const [guideLangs, setGuideLangs] = useState('English, Russian, Karakalpak');
  const [guideSpecs, setGuideSpecs] = useState('Aral Sea, Ustyurt Plateau, Off-road');
  const [guideRating, _setGuideRating] = useState(4.9);

  const [showAddAgencyModal, setShowAddAgencyModal] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [agencyContact, setAgencyContact] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyCity, setAgencyCity] = useState('Nukus');
  const [agencyCommission, setAgencyCommission] = useState(10);
  const [agencyTours, setAgencyTours] = useState(4);

  // Receipts & Support states
  const [receiptsList, _setReceiptsList] = useState<PlatformReceipt[]>(() => generateSampleReceipts());
  const [selectedReceipt, setSelectedReceipt] = useState<PlatformReceipt | null>(null);
  const [receiptFilter, setReceiptFilter] = useState<string>('all');

  const [supportMessages, setSupportMessages] = useState<AdminSupportMessage[]>([
    { id: 'sup-1', sender_id: 'usr_john', sender_name: 'John Miller (USA)', recipient_id: 'admin_support', content: 'Hello! I need a custom 3-day tour to Moynaq and Ustyurt Canyon for 4 people with an English guide.', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'sup-2', sender_id: 'usr_john', sender_name: 'John Miller (USA)', recipient_id: 'admin_support', content: 'Can we include a night in a traditional Yurt at Sudochye Lake?', created_at: new Date(Date.now() - 3600000 * 1.5).toISOString() },
    { id: 'sup-3', sender_id: 'usr_elena', sender_name: 'Elena Rostova (KAZ)', recipient_id: 'admin_support', content: 'Здравствуйте! Как забронировать юртовый лагерь на озере Судочье на 20 сентября?', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  ]);
  const [activeSupportSender, setActiveSupportSender] = useState<string | null>('usr_john');
  const [adminReplyText, setAdminReplyText] = useState('');

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);

    // Parallel fetch all data
    const [
      profilesRes, checkinsRes, badgesRes, pointsRes,
      aralBookingsRes, touristReqsRes, volunteersRes,
      photosRes, votesRes, quizRes, spotViewsRes, winnersRes,
      taxiRes, hotelRes, visitorsRes, pageViewsRes,
      guidesRes, agenciesRes, reviewsRes,
    ] = await Promise.all([
      supabase.from('community_profiles').select('*'),
      supabase.from('trip_checkins').select('id', { count: 'exact', head: true }),
      supabase.from('user_badges').select('id', { count: 'exact', head: true }),
      supabase.from('user_points').select('points'),
      supabase.from('aral_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('tourist_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('eco_volunteers').select('*').order('created_at', { ascending: false }),
      supabase.from('photo_entries').select('*').order('votes', { ascending: false }),
      supabase.from('photo_votes').select('id', { count: 'exact', head: true }),
      supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
      supabase.from('spot_views').select('spot_name, spot_category, viewer_country'),
      supabase.from('game_winners').select('*').order('created_at', { ascending: false }),
      supabase.from('taxi_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('hotel_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('visitor_sessions').select('*').order('last_seen', { ascending: false }).limit(200),
      supabase.from('page_views').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('guides').select('*').order('created_at', { ascending: false }),
      supabase.from('tour_agencies').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);

    const profileList = (profilesRes.data ?? []) as ProfileRow[];
    setProfiles(profileList);
    setTaxiBookings((taxiRes.data ?? []) as TaxiBookingRow[]);
    setHotelBookings((hotelRes.data ?? []) as HotelBookingRow[]);
    setVisitorSessions((visitorsRes.data ?? []) as VisitorSessionRow[]);
    setPageViews((pageViewsRes.data ?? []) as PageViewRow[]);

    // Country stats from profiles
    const countryMap = new Map<string, number>();
    profileList.forEach((p) => {
      const c = p.home_country || 'Unknown';
      countryMap.set(c, (countryMap.get(c) ?? 0) + 1);
    });
    setCountries([...countryMap.entries()].map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count));

    // Spot views aggregation
    const spotMap = new Map<string, { views: number; category: string }>();
    (spotViewsRes.data ?? []).forEach((v: { spot_name: string; spot_category: string }) => {
      const existing = spotMap.get(v.spot_name);
      if (existing) existing.views++;
      else spotMap.set(v.spot_name, { views: 1, category: v.spot_category || 'general' });
    });
    setSpots([...spotMap.entries()].map(([spot_name, val]) => ({ spot_name, views: val.views, category: val.category })).sort((a, b) => b.views - a.views));

    setBookings((aralBookingsRes.data ?? []) as BookingRow[]);
    setTouristReqs((touristReqsRes.data ?? []) as TouristRequestRow[]);
    setVolunteers((volunteersRes.data ?? []) as EcoVolunteerRow[]);
    setWinners((winnersRes.data ?? []) as GameWinnerRow[]);
    setPhotos((photosRes.data ?? []).map((p: { id: string; title: string; location: string; votes: number; created_at: string }) => ({
      id: p.id, title: p.title, location: p.location, votes: p.votes, created_at: p.created_at,
    })));

    // Load Guides with admin_config fallback
    let loadedGuides: AdminGuide[] = [];
    if (!guidesRes.error && guidesRes.data && guidesRes.data.length > 0) {
      loadedGuides = guidesRes.data as AdminGuide[];
    } else {
      const { data: cfgData } = await supabase.from('admin_config').select('value').eq('key', 'custom_guides').maybeSingle();
      if (cfgData?.value) {
        try { loadedGuides = JSON.parse(cfgData.value); } catch { /* ignore fallback parsing */ }
      }
      if (loadedGuides.length === 0) {
        loadedGuides = staticGuides.map((g) => ({
          id: String(g.id),
          name: g.name,
          photo: g.photo,
          rating: g.rating,
          reviews_count: g.reviews,
          languages: g.languages,
          specialties: g.specialties,
          daily_rate: g.dailyRate,
          phone: g.phone,
          whatsapp: g.whatsapp,
          status: 'active',
          created_at: new Date().toISOString(),
        }));
      }
    }
    setGuidesList(loadedGuides);

    // Load Agencies with admin_config fallback
    let loadedAgencies: AdminAgency[] = [];
    if (!agenciesRes.error && agenciesRes.data && agenciesRes.data.length > 0) {
      loadedAgencies = agenciesRes.data as AdminAgency[];
    } else {
      const { data: cfgData } = await supabase.from('admin_config').select('value').eq('key', 'custom_agencies').maybeSingle();
      if (cfgData?.value) {
        try { loadedAgencies = JSON.parse(cfgData.value); } catch { /* ignore fallback parsing */ }
      }
      if (loadedAgencies.length === 0) {
        loadedAgencies = [
          {
            id: 'ag-1',
            name: 'Aral Sea Discovery Tours',
            contact_person: 'Азамат Есенов',
            phone: '+998907001122',
            email: 'aralsea.tours@gmail.com',
            city: 'Nukus',
            commission_rate: 10,
            active_tours: 5,
            status: 'active',
            created_at: new Date().toISOString(),
          },
          {
            id: 'ag-2',
            name: 'Karakalpakstan Eco Travel',
            contact_person: 'Гульнара Джумаева',
            phone: '+998913004455',
            email: 'info@karakalpak-eco.uz',
            city: 'Moynaq',
            commission_rate: 12,
            active_tours: 3,
            status: 'active',
            created_at: new Date().toISOString(),
          },
        ];
      }
    }
    setAgenciesList(loadedAgencies);

    setReviewsList((reviewsRes.data ?? []) as ReviewRow[]);

    const totalPoints = (pointsRes.data ?? []).reduce((sum: number, p: { points: number }) => sum + p.points, 0);
    const totalRevenue = (aralBookingsRes.data ?? []).reduce((sum: number, b: { status: string }) =>
      sum + (b.status === 'confirmed' || b.status === 'completed' ? 150 : 0), 0);

    setStats({
      totalUsers: profileList.length,
      totalCheckins: checkinsRes.count ?? 0,
      totalBadges: badgesRes.count ?? 0,
      totalPoints,
      totalBookings: (aralBookingsRes.data?.length ?? 0) + (touristReqsRes.data?.length ?? 0),
      pendingBookings: (aralBookingsRes.data ?? []).filter((b: { status: string }) => b.status === 'pending').length,
      totalRevenue,
      totalPhotos: photosRes.data?.length ?? 0,
      totalVotes: votesRes.count ?? 0,
      totalQuizPlays: quizRes.count ?? 0,
      totalSpotViews: spotViewsRes.data?.length ?? 0,
      totalGameWinners: winnersRes.data?.length ?? 0,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Actions
  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideName.trim()) return;

    const newGuide: AdminGuide = {
      id: 'g-' + Date.now(),
      name: guideName.trim(),
      photo: guidePhoto.trim() || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: Number(guideRating) || 5.0,
      reviews_count: 1,
      languages: guideLangs.split(',').map((s) => s.trim()).filter(Boolean),
      specialties: guideSpecs.split(',').map((s) => s.trim()).filter(Boolean),
      daily_rate: Number(guideDailyRate) || 45,
      phone: guidePhone.trim() || '+998901234567',
      whatsapp: guideWhatsapp.trim() || '998901234567',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const updated = [newGuide, ...guidesList];
    setGuidesList(updated);
    try {
      localStorage.setItem('kk_custom_guides', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kk:guides-updated', { detail: updated }));
    } catch {
      // ignore
    }

    await supabase.from('guides').insert(newGuide);
    await supabase.from('admin_config').upsert({
      key: 'custom_guides',
      value: JSON.stringify(updated),
      updated_at: new Date().toISOString(),
    });

    setShowAddGuideModal(false);
    setGuideName('');
    setGuidePhoto('');
    setGuidePhone('');
    setGuideWhatsapp('');
  };

  const handleDeleteGuide = async (id: string) => {
    const updated = guidesList.filter((g) => g.id !== id);
    setGuidesList(updated);
    try {
      localStorage.setItem('kk_custom_guides', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kk:guides-updated', { detail: updated }));
    } catch {
      // ignore
    }

    await supabase.from('guides').delete().eq('id', id);
    await supabase.from('admin_config').upsert({
      key: 'custom_guides',
      value: JSON.stringify(updated),
      updated_at: new Date().toISOString(),
    });
  };

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;

    const newAgency: AdminAgency = {
      id: 'ag-' + Date.now(),
      name: agencyName.trim(),
      contact_person: agencyContact.trim() || 'Руководитель',
      phone: agencyPhone.trim() || '+998900000000',
      email: agencyEmail.trim() || 'contact@agency.uz',
      city: agencyCity.trim() || 'Nukus',
      commission_rate: Number(agencyCommission) || 10,
      active_tours: Number(agencyTours) || 3,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const updated = [newAgency, ...agenciesList];
    setAgenciesList(updated);
    try {
      localStorage.setItem('kk_custom_agencies', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kk:agencies-updated', { detail: updated }));
    } catch {
      // ignore
    }

    await supabase.from('tour_agencies').insert(newAgency);
    await supabase.from('admin_config').upsert({
      key: 'custom_agencies',
      value: JSON.stringify(updated),
      updated_at: new Date().toISOString(),
    });

    setShowAddAgencyModal(false);
    setAgencyName('');
    setAgencyContact('');
    setAgencyPhone('');
    setAgencyEmail('');
  };

  const handleDeleteAgency = async (id: string) => {
    const updated = agenciesList.filter((a) => a.id !== id);
    setAgenciesList(updated);
    try {
      localStorage.setItem('kk_custom_agencies', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kk:agencies-updated', { detail: updated }));
    } catch {
      // ignore
    }

    await supabase.from('tour_agencies').delete().eq('id', id);
    await supabase.from('admin_config').upsert({
      key: 'custom_agencies',
      value: JSON.stringify(updated),
      updated_at: new Date().toISOString(),
    });
  };

  const handleDeleteReview = async (id: string) => {
    const updated = reviewsList.filter((r) => r.id !== id);
    setReviewsList(updated);
    await supabase.from('reviews').delete().eq('id', id);
  };

  const handleToggleVerifyReview = async (id: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    const updated = reviewsList.map((r) => r.id === id ? { ...r, is_verified_trip: nextStatus } : r);
    setReviewsList(updated);
    await supabase.from('reviews').update({ is_verified_trip: nextStatus }).eq('id', id);
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'receipts', label: '🧾 Чеки и Финансы', icon: Receipt },
    { key: 'support', label: '💬 Сообщения от туристов', icon: MessageSquare },
    { key: 'guides', label: 'Гиды (Guides)', icon: UserCheck },
    { key: 'agencies', label: 'Турагентства', icon: Briefcase },
    { key: 'reviews_mod', label: 'Отзывы & Оценки', icon: MessageSquare },
    { key: 'visitors', label: 'Visitor Analytics', icon: Monitor },
    { key: 'tourists', label: 'Tourist Origins', icon: Globe },
    { key: 'spots', label: 'Popular Spots', icon: TrendingUp },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'taxi', label: '1222 Taxi', icon: Car },
    { key: 'hotels', label: 'Hotels', icon: Building },
    { key: 'orders', label: 'Order Logs', icon: FileText },
    { key: 'winners', label: 'Game Winners', icon: Trophy },
    { key: 'photos', label: 'Photo Contest', icon: Camera },
  ];

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand-50">
        <Loader2 className="h-10 w-10 animate-spin text-deepblue-600" />
      </div>
    );
  }

  const maxCountryCount = Math.max(...countries.map((c) => c.count), 1);
  const maxSpotViews = Math.max(...spots.map((s) => s.views), 1);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-deepblue-900 text-white shadow-medium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <span className="font-display text-sm sm:text-base font-bold">Admin Dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">{adminInfo?.username || 'Super Admin'}</span>
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 ring-1 ring-amber-400/30 flex items-center gap-1">
                  👑 {adminInfo?.role || 'Super Admin'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadAll} className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
              <a href="/" className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Website</span>
              </a>
              <button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg bg-terracotta-500 px-3 py-1.5 text-xs font-bold hover:bg-terracotta-600 transition-colors">
                <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-14 z-30 bg-white border-b border-sand-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tb) => {
              const Icon = tb.icon;
              return (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    tab === tb.key ? 'bg-deepblue-700 text-white shadow-sm' : 'text-deepblue-600 hover:bg-sand-100'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {tb.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* === OVERVIEW === */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={Users} label="Registered Users" value={stats.totalUsers} color="bg-deepblue-600" />
              <StatCard icon={MapPin} label="Check-ins" value={stats.totalCheckins} color="bg-terracotta-500" />
              <StatCard icon={Award} label="Badges Earned" value={stats.totalBadges} color="bg-amber-500" />
              <StatCard icon={Zap} label="Total Points" value={stats.totalPoints} color="bg-emerald-600" />
              <StatCard icon={Calendar} label="Bookings" value={stats.totalBookings} color="bg-purple-600" />
              <StatCard icon={DollarSign} label="Est. Revenue" value={`$${stats.totalRevenue}`} color="bg-green-600" />
              <StatCard icon={Camera} label="Photos" value={stats.totalPhotos} color="bg-pink-600" />
              <StatCard icon={Trophy} label="Quiz Plays" value={stats.totalQuizPlays} color="bg-indigo-600" />
            </div>

            {/* Partner Services Summary (Beta Test Mode) */}
            <div className="rounded-2xl bg-gradient-to-br from-deepblue-900 to-deepblue-800 p-5 sm:p-6 text-white shadow-medium">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-amber-400" /> Partner Services — Beta Test Period
                </h3>
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
                  1-Month Free Trial · 0% Commission
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <Car className="mx-auto mb-1 h-5 w-5 text-terracotta-400" />
                  <p className="text-xs text-sand-300">Taxi Bookings</p>
                  <p className="font-display text-xl font-bold">{taxiBookings.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <Building className="mx-auto mb-1 h-5 w-5 text-terracotta-400" />
                  <p className="text-xs text-sand-300">Hotel Bookings</p>
                  <p className="font-display text-xl font-bold">{hotelBookings.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <Calendar className="mx-auto mb-1 h-5 w-5 text-amber-400" />
                  <p className="text-xs text-sand-300">Total Bookings</p>
                  <p className="font-display text-xl font-bold">{taxiBookings.length + hotelBookings.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <DollarSign className="mx-auto mb-1 h-5 w-5 text-emerald-400" />
                  <p className="text-xs text-sand-300">Total Revenue</p>
                  <p className="font-display text-xl font-bold tabular-nums">
                    ${(taxiBookings.reduce((s, b) => s + Number(b.total_price || 0), 0) + hotelBookings.reduce((s, b) => s + Number(b.total_price || 0), 0)).toFixed(0)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <Activity className="mx-auto mb-1 h-5 w-5 text-amber-400" />
                  <p className="text-xs text-sand-300">Weekly Bookings</p>
                  <p className="font-display text-xl font-bold">
                    {taxiBookings.filter((b) => new Date(b.created_at) >= new Date(Date.now() - 7 * 86400000)).length +
                      hotelBookings.filter((b) => new Date(b.created_at) >= new Date(Date.now() - 7 * 86400000)).length}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <Activity className="mx-auto mb-1 h-5 w-5 text-terracotta-400" />
                  <p className="text-xs text-sand-300">Monthly Bookings</p>
                  <p className="font-display text-xl font-bold">
                    {taxiBookings.filter((b) => new Date(b.created_at) >= new Date(Date.now() - 30 * 86400000)).length +
                      hotelBookings.filter((b) => new Date(b.created_at) >= new Date(Date.now() - 30 * 86400000)).length}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-400/10 px-4 py-2.5 ring-1 ring-amber-400/20">
                <p className="text-xs text-amber-200 flex items-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5" /> All bookings are tagged as Test Mode. Commission is 0% during the free trial period.
                </p>
                <p className="text-xs font-semibold text-amber-300">
                  Traffic Generated: {stats.totalUsers} users · {stats.totalCheckins} check-ins · {spots.reduce((s, sp) => s + sp.views, 0)} spot views
                </p>
              </div>
            </div>

            {/* Tourist origins + Popular spots side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Country chart */}
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-deepblue-600" /> Tourists By Country
                </h3>
                {countries.length === 0 ? (
                  <EmptyState text="No tourist origin data yet." />
                ) : (
                  <div className="space-y-2.5">
                    {countries.slice(0, 10).map((c) => (
                      <div key={c.country}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-deepblue-700">{c.country}</span>
                          <span className="font-bold text-deepblue-900">{c.count}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-sand-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-deepblue-500 to-deepblue-700 transition-all duration-700"
                            style={{ width: `${(c.count / maxCountryCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular spots chart */}
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-terracotta-600" /> Popular Tourist Spots
                </h3>
                {spots.length === 0 ? (
                  <EmptyState text="No spot view data yet." />
                ) : (
                  <div className="space-y-2.5">
                    {spots.slice(0, 10).map((s) => (
                      <div key={s.spot_name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-deepblue-700 truncate">{s.spot_name}</span>
                          <span className="font-bold text-deepblue-900 flex items-center gap-0.5">
                            <Eye className="h-3 w-3" /> {s.views}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-sand-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-700"
                            style={{ width: `${(s.views / maxSpotViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" /> Recent Bookings
                </h3>
                {bookings.length === 0 ? (
                  <EmptyState text="No bookings yet." />
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex items-center justify-between rounded-lg bg-sand-50 px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-deepblue-900 truncate">{b.tour_name}</p>
                          <p className="text-xs text-deepblue-400">{b.name} · {b.group_size} pax</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Recent Game Winners
                </h3>
                {winners.length === 0 ? (
                  <EmptyState text="No game winners yet." />
                ) : (
                  <div className="space-y-2">
                    {winners.slice(0, 5).map((w) => (
                      <div key={w.id} className="flex items-center justify-between rounded-lg bg-sand-50 px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-deepblue-900 truncate">{w.player_name}</p>
                          <p className="text-xs text-deepblue-400">{w.location || '—'}</p>
                        </div>
                        <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                          {w.score}/{w.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === RECEIPT & FINANCIAL AUDIT ("ЧЕКИ И ФИНАНСЫ") === */}
        {tab === 'receipts' && (
          <div className="space-y-6">
            {/* Financial Summary Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-deepblue-900 to-deepblue-800 p-5 text-white shadow-medium">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-sand-300">Общая выручка заказов</span>
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="font-display text-2xl font-bold tabular-nums">
                  ${receiptsList.reduce((acc, r) => acc + r.totalAmount, 0).toFixed(2)}
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">
                  Собрано с {receiptsList.length} чеков и транзакций
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-deepblue-500">Комиссия платформы</span>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <p className="font-display text-2xl font-bold text-deepblue-900 tabular-nums">
                  ${receiptsList.reduce((acc, r) => acc + r.commissionAmount, 0).toFixed(2)}
                </p>
                <p className="text-[11px] text-amber-600 mt-1 font-medium">
                  Средняя комиссия ~10% (0% в Beta)
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-deepblue-500">Всего выписано чеков</span>
                  <Receipt className="h-5 w-5 text-deepblue-600" />
                </div>
                <p className="font-display text-2xl font-bold text-deepblue-900 tabular-nums">
                  {receiptsList.length}
                </p>
                <p className="text-[11px] text-deepblue-400 mt-1">
                  Такси, Отели, Гиды & Туры
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-deepblue-500">Партнеров в сети</span>
                  <Briefcase className="h-5 w-5 text-terracotta-500" />
                </div>
                <p className="font-display text-2xl font-bold text-deepblue-900 tabular-nums">
                  {agenciesList.length + guidesList.length + 3}
                </p>
                <p className="text-[11px] text-terracotta-600 mt-1">
                  Активные турагентства и гиды
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-deepblue-400 mr-1" />
                {[
                  { id: 'all', label: 'Все чеки' },
                  { id: 'taxi', label: '🚕 Такси' },
                  { id: 'hotel', label: '🏨 Отели' },
                  { id: 'guide_booking', label: '👤 Гиды' },
                  { id: 'aral_tour', label: '🏕️ Туры' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReceiptFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                      receiptFilter === f.id
                        ? 'bg-deepblue-700 text-white shadow'
                        : 'bg-sand-100 text-deepblue-700 hover:bg-sand-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по № чека, туристу или партнеру..."
                  className="w-full rounded-xl border border-sand-300 bg-sand-50 pl-9 pr-3 py-1.5 text-xs text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Receipts List Table */}
            <div className="rounded-2xl bg-white ring-1 ring-sand-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-sand-200 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-deepblue-900 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-deepblue-600" /> Реестр фискальных чеков и заказов
                </h3>
                <span className="text-xs text-deepblue-500">
                  Показано: {receiptsList.filter((r) => {
                    if (receiptFilter !== 'all' && r.serviceType !== receiptFilter) return false;
                    if (search.trim()) {
                      const q = search.toLowerCase();
                      return r.receiptNumber.toLowerCase().includes(q) ||
                        r.userName.toLowerCase().includes(q) ||
                        r.providerName.toLowerCase().includes(q);
                    }
                    return true;
                  }).length} из {receiptsList.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-sand-50 border-b border-sand-200 text-deepblue-600 font-semibold">
                      <th className="py-3 px-4">№ Чека</th>
                      <th className="py-3 px-4">Дата / Время</th>
                      <th className="py-3 px-4">Турист (Покупатель)</th>
                      <th className="py-3 px-4">Категория</th>
                      <th className="py-3 px-4">Исполнитель / Партнер</th>
                      <th className="py-3 px-4">Позиции</th>
                      <th className="py-3 px-4 text-right">Сумма</th>
                      <th className="py-3 px-4 text-right">Комиссия</th>
                      <th className="py-3 px-4">Статус</th>
                      <th className="py-3 px-4 text-center">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {receiptsList
                      .filter((r) => {
                        if (receiptFilter !== 'all' && r.serviceType !== receiptFilter) return false;
                        if (search.trim()) {
                          const q = search.toLowerCase();
                          return r.receiptNumber.toLowerCase().includes(q) ||
                            r.userName.toLowerCase().includes(q) ||
                            r.providerName.toLowerCase().includes(q);
                        }
                        return true;
                      })
                      .map((r) => (
                        <tr key={r.id} className="hover:bg-sand-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-deepblue-800 bg-sand-100 px-2 py-0.5 rounded">
                              {r.receiptNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-deepblue-500">
                            {new Date(r.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-deepblue-900">{r.userName}</p>
                            <p className="text-[10px] text-deepblue-400">{r.userPhone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize font-semibold text-deepblue-700 bg-deepblue-50 px-2 py-0.5 rounded border border-deepblue-100">
                              {r.serviceType === 'taxi' ? '🚕 Такси' : r.serviceType === 'hotel' ? '🏨 Отель' : r.serviceType === 'guide_booking' ? '👤 Гид' : '🏕️ Тур'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-deepblue-800">
                            {r.providerName}
                          </td>
                          <td className="py-3 px-4 text-deepblue-600">
                            {r.items.length} поз. ({r.items[0]?.name || 'Услуга'})
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-deepblue-900 text-sm">
                            ${r.totalAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-600">
                            ${r.commissionAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                              {r.status === 'paid' ? 'Оплачен' : r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedReceipt(r)}
                              className="inline-flex items-center gap-1 rounded-lg bg-deepblue-600 px-3 py-1 text-xs font-bold text-white hover:bg-deepblue-700 shadow-xs transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5" /> Чек
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === TOURIST SUPPORT CHAT INBOX ("СООБЩЕНИЯ ОТ ТУРИСТОВ") === */}
        {tab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[680px]">
            {/* Thread Sidebar */}
            <div className="rounded-2xl bg-white ring-1 ring-sand-200 shadow-sm p-4 flex flex-col h-full">
              <div className="mb-4 pb-3 border-b border-sand-200 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-deepblue-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-deepblue-600" /> Диалоги с туристами
                </h3>
                <span className="rounded-full bg-deepblue-100 px-2.5 py-0.5 text-xs font-bold text-deepblue-800">
                  {Array.from(new Set(supportMessages.map(m => m.sender_id))).length} активных
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {Array.from(new Set(supportMessages.map(m => m.sender_id))).map((senderId) => {
                  const lastMsg = supportMessages.filter(m => m.sender_id === senderId).slice(-1)[0];
                  const senderName = lastMsg?.sender_name || senderId;
                  const isSelected = activeSupportSender === senderId;

                  return (
                    <button
                      key={senderId}
                      onClick={() => setActiveSupportSender(senderId)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-deepblue-700 text-white shadow-md'
                          : 'bg-sand-50 hover:bg-sand-100 text-deepblue-900 border border-sand-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-deepblue-900'}`}>
                          {senderName}
                        </span>
                        <span className={`text-[10px] ${isSelected ? 'text-sand-200' : 'text-deepblue-400'}`}>
                          {new Date(lastMsg?.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isSelected ? 'text-sand-100' : 'text-deepblue-600'}`}>
                        {lastMsg?.content || 'Сообщение...'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Thread Workspace */}
            <div className="lg:col-span-2 rounded-2xl bg-white ring-1 ring-sand-200 shadow-sm p-4 flex flex-col h-full">
              {activeSupportSender ? (
                <>
                  {/* Chat Header */}
                  <div className="pb-3 border-b border-sand-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-base font-bold text-deepblue-900 flex items-center gap-2">
                        <User className="h-4 w-4 text-terracotta-500" />
                        {supportMessages.find(m => m.sender_id === activeSupportSender)?.sender_name || activeSupportSender}
                      </h4>
                      <p className="text-xs text-deepblue-400">Прямое обращение в поддержку / запрос индивидуального тура</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> В сети
                    </span>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3 px-2">
                    {supportMessages
                      .filter(m => m.sender_id === activeSupportSender || m.recipient_id === activeSupportSender)
                      .map((msg) => {
                        const isAdmin = msg.sender_id === 'admin_support' || msg.sender_name.includes('Super Admin') || msg.sender_name.includes('Azada') || msg.sender_name.includes('Damir');
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-bold text-deepblue-500">{msg.sender_name}</span>
                              <span className="text-[10px] text-deepblue-400">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                                isAdmin
                                  ? 'bg-deepblue-900 text-white rounded-tr-none'
                                  : 'bg-sand-100 text-deepblue-900 border border-sand-200 rounded-tl-none'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Quick Action Hints */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {[
                      'Здравствуйте! Мы организуем персональный гид-тур.',
                      'Стоимость тура составит примерно $180 с человека.',
                      'Подтверждаем бронирование на эти даты.',
                    ].map((template) => (
                      <button
                        key={template}
                        onClick={() => setAdminReplyText(template)}
                        className="whitespace-nowrap rounded-lg bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-deepblue-700 hover:bg-sand-200 transition-colors border border-sand-200"
                      >
                        ⚡ {template}
                      </button>
                    ))}
                  </div>

                  {/* Send Reply Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminReplyText.trim() || !activeSupportSender) return;

                      const newMsg: AdminSupportMessage = {
                        id: `sup-${Date.now()}`,
                        sender_id: 'admin_support',
                        sender_name: `👑 ${adminInfo?.username || 'Super Admin'}`,
                        recipient_id: activeSupportSender,
                        content: adminReplyText.trim(),
                        created_at: new Date().toISOString(),
                      };

                      setSupportMessages((prev) => [...prev, newMsg]);
                      setAdminReplyText('');

                      // Send to Supabase DB in background
                      supabase.from('admin_support_messages').insert([newMsg]).then(() => {});
                    }}
                    className="flex items-center gap-2 pt-2 border-t border-sand-200"
                  >
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder={`Ответить пользователю от имени ${adminInfo?.username || 'Super Admin'}...`}
                      className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-4 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-deepblue-700 px-4 py-2 text-xs font-bold text-white hover:bg-deepblue-800 transition-colors shadow"
                    >
                      <Send className="h-3.5 w-3.5" /> Отправить
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center text-deepblue-400">
                  <MessageSquare className="h-10 w-10 text-sand-300 mb-2" />
                  <p className="text-sm font-semibold">Выберите диалог слева для просмотра</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === GUIDES MANAGEMENT === */}
        {tab === 'guides' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <div>
                <h3 className="font-display text-lg font-bold text-deepblue-900 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-deepblue-600" /> Управление гидами (Local Guides Management)
                </h3>
                <p className="text-xs text-deepblue-500 mt-0.5">
                  Добавляйте и редактируйте гидов. Новые гиды мгновенно появляются в основном каталоге сайта.
                </p>
              </div>
              <button
                onClick={() => setShowAddGuideModal(true)}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-terracotta-600 transition-colors"
              >
                <Plus className="h-4 w-4" /> Добавить гида
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guidesList.map((g) => (
                <div key={g.id} className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm flex flex-col justify-between hover:shadow-subtle transition-all">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img src={g.photo} alt={g.name} className="h-16 w-16 rounded-xl object-cover ring-2 ring-sand-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display text-base font-bold text-deepblue-900 truncate">{g.name}</h4>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Active</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span className="font-bold text-deepblue-900">{g.rating}</span>
                          <span className="text-deepblue-400">({g.reviews_count} reviews)</span>
                        </div>
                        <p className="text-sm font-bold text-terracotta-600 mt-1">${g.daily_rate} / день</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-deepblue-500">Языки:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {g.languages.map((l) => (
                            <span key={l} className="rounded bg-sand-100 px-2 py-0.5 font-medium text-deepblue-700">{l}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-deepblue-500">Специализация:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {g.specialties.map((s) => (
                            <span key={s} className="rounded bg-terracotta-50 px-2 py-0.5 font-medium text-terracotta-700">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-sand-100 space-y-1">
                        <p className="text-deepblue-600"><span className="font-medium">Тел:</span> {g.phone}</p>
                        <p className="text-deepblue-600"><span className="font-medium">WhatsApp:</span> {g.whatsapp}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between">
                    <a
                      href={`https://wa.me/${g.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      WhatsApp Чат
                    </a>
                    <button
                      onClick={() => handleDeleteGuide(g.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Add Guide */}
            {showAddGuideModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <form onSubmit={handleSaveGuide} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-elevated space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                    <h3 className="font-display text-lg font-bold text-deepblue-900 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-terracotta-500" /> Добавление гида
                    </h3>
                    <button type="button" onClick={() => setShowAddGuideModal(false)} className="text-sand-400 hover:text-deepblue-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">ФИО / Имя гида</label>
                      <input
                        type="text"
                        required
                        value={guideName}
                        onChange={(e) => setGuideName(e.target.value)}
                        placeholder="Напр. Азиз Бердиев"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Цена за день ($)</label>
                      <input
                        type="number"
                        required
                        value={guideDailyRate}
                        onChange={(e) => setGuideDailyRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">URL Фото гида</label>
                    <input
                      type="url"
                      value={guidePhoto}
                      onChange={(e) => setGuidePhoto(e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Телефон</label>
                      <input
                        type="text"
                        value={guidePhone}
                        onChange={(e) => setGuidePhone(e.target.value)}
                        placeholder="+998901234567"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">WhatsApp (номер без +)</label>
                      <input
                        type="text"
                        value={guideWhatsapp}
                        onChange={(e) => setGuideWhatsapp(e.target.value)}
                        placeholder="998901234567"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">Языки (через запятую)</label>
                    <input
                      type="text"
                      value={guideLangs}
                      onChange={(e) => setGuideLangs(e.target.value)}
                      placeholder="English, Russian, Karakalpak"
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">Специализации (через запятую)</label>
                    <input
                      type="text"
                      value={guideSpecs}
                      onChange={(e) => setGuideSpecs(e.target.value)}
                      placeholder="Aral Sea, Savitsky, History, Off-road"
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-sand-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGuideModal(false)}
                      className="rounded-xl bg-sand-100 px-4 py-2 text-xs font-semibold text-deepblue-700 hover:bg-sand-200"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-deepblue-700 px-5 py-2 text-xs font-bold text-white hover:bg-deepblue-800"
                    >
                      Сохранить гида
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* === AGENCIES MANAGEMENT === */}
        {tab === 'agencies' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <div>
                <h3 className="font-display text-lg font-bold text-deepblue-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-deepblue-600" /> Управление турагентствами и партнёрами
                </h3>
                <p className="text-xs text-deepblue-500 mt-0.5">
                  База партнёрских туристических компаний, туроператоров и их комиссии.
                </p>
              </div>
              <button
                onClick={() => setShowAddAgencyModal(true)}
                className="flex items-center gap-2 rounded-xl bg-deepblue-700 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-deepblue-800 transition-colors"
              >
                <Plus className="h-4 w-4" /> Добавить агентство
              </button>
            </div>

            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-sand-200 text-deepblue-500">
                    <th className="py-2.5 pr-3 font-semibold">Название агентства</th>
                    <th className="py-2.5 pr-3 font-semibold">Контактное лицо</th>
                    <th className="py-2.5 pr-3 font-semibold">Город</th>
                    <th className="py-2.5 pr-3 font-semibold">Телефон / Email</th>
                    <th className="py-2.5 pr-3 font-semibold">Активных туров</th>
                    <th className="py-2.5 pr-3 font-semibold">Комиссия (%)</th>
                    <th className="py-2.5 pr-3 font-semibold">Статус</th>
                    <th className="py-2.5 font-semibold text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {agenciesList.map((ag) => (
                    <tr key={ag.id} className="border-b border-sand-100 hover:bg-sand-50">
                      <td className="py-3 pr-3 font-bold text-deepblue-900">{ag.name}</td>
                      <td className="py-3 pr-3 font-medium text-deepblue-700">{ag.contact_person}</td>
                      <td className="py-3 pr-3 text-deepblue-600">{ag.city}</td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-deepblue-800">{ag.phone}</p>
                        <p className="text-deepblue-400">{ag.email}</p>
                      </td>
                      <td className="py-3 pr-3 font-bold text-deepblue-900">{ag.active_tours} туров</td>
                      <td className="py-3 pr-3 font-bold text-emerald-600">{ag.commission_rate}%</td>
                      <td className="py-3 pr-3">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                          {ag.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteAgency(ag.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Add Agency */}
            {showAddAgencyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <form onSubmit={handleSaveAgency} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-elevated space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                    <h3 className="font-display text-lg font-bold text-deepblue-900 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-deepblue-600" /> Регистрация турагентства
                    </h3>
                    <button type="button" onClick={() => setShowAddAgencyModal(false)} className="text-sand-400 hover:text-deepblue-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">Название турагентства</label>
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Напр. Nukus Silk Road Travel"
                      className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Контактное лицо</label>
                      <input
                        type="text"
                        value={agencyContact}
                        onChange={(e) => setAgencyContact(e.target.value)}
                        placeholder="ФИО директора/менеджера"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Город</label>
                      <input
                        type="text"
                        value={agencyCity}
                        onChange={(e) => setAgencyCity(e.target.value)}
                        placeholder="Nukus, Moynaq, Khiva..."
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Телефон</label>
                      <input
                        type="text"
                        value={agencyPhone}
                        onChange={(e) => setAgencyPhone(e.target.value)}
                        placeholder="+998901234567"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={agencyEmail}
                        onChange={(e) => setAgencyEmail(e.target.value)}
                        placeholder="info@agency.uz"
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Ставка комиссии (%)</label>
                      <input
                        type="number"
                        value={agencyCommission}
                        onChange={(e) => setAgencyCommission(Number(e.target.value))}
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Количество туров</label>
                      <input
                        type="number"
                        value={agencyTours}
                        onChange={(e) => setAgencyTours(Number(e.target.value))}
                        className="w-full rounded-xl border border-sand-300 bg-sand-50 px-3 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sand-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAgencyModal(false)}
                      className="rounded-xl bg-sand-100 px-4 py-2 text-xs font-semibold text-deepblue-700 hover:bg-sand-200"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-deepblue-700 px-5 py-2 text-xs font-bold text-white hover:bg-deepblue-800"
                    >
                      Сохранить турагентство
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* === REVIEWS MODERATION === */}
        {tab === 'reviews_mod' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-deepblue-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-terracotta-500" /> Модерация отзывов & оценок
                </h3>
                <p className="text-xs text-deepblue-500 mt-0.5">
                  Управление отзывами пользователей и верификация постов после поездок (Verified Trip).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="rounded-xl bg-sand-100 px-3 py-1.5 text-deepblue-800">
                  Всего отзывов: {reviewsList.length}
                </span>
              </div>
            </div>

            {reviewsList.length === 0 ? (
              <EmptyState text="Отзывов пока нет. Они появятся здесь после отправки туристами." />
            ) : (
              <div className="space-y-4">
                {reviewsList.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-deepblue-900">{r.author_name || 'Анонимный турист'}</p>
                          <span className="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-deepblue-700 font-medium">
                            {r.place_name}
                          </span>
                          {r.is_verified_trip && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> Подтверждённая поездка
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-deepblue-400 mt-0.5">{new Date(r.created_at).toLocaleString()}</p>
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

                    <p className="text-sm text-deepblue-800 bg-sand-50 p-3 rounded-xl ring-1 ring-sand-100">{r.comment}</p>

                    {r.photo_urls && r.photo_urls.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-1">
                        {r.photo_urls.map((url, i) => (
                          <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-sand-200" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-sand-100">
                      <button
                        onClick={() => handleToggleVerifyReview(r.id, r.is_verified_trip)}
                        className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                          r.is_verified_trip
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-sand-100 text-deepblue-600 hover:bg-sand-200'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        {r.is_verified_trip ? 'Верифицирован (Verified)' : 'Отметить как "После поездки"'}
                      </button>

                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Удалить отзыв
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === TOURIST ORIGINS === */}
        {tab === 'tourists' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-deepblue-600" /> Tourist Origins (Countries & Cities)
              </h3>
              {countries.length === 0 ? (
                <EmptyState text="No tourist origin data yet. Countries appear here when users fill out their profile." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chart */}
                  <div className="space-y-2.5">
                    {countries.map((c) => (
                      <div key={c.country}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-deepblue-700">{c.country}</span>
                          <span className="font-bold text-deepblue-900">{c.count} {c.count === 1 ? 'tourist' : 'tourists'}</span>
                        </div>
                        <div className="h-3 rounded-full bg-sand-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-deepblue-500 to-deepblue-700 transition-all duration-700"
                            style={{ width: `${(c.count / maxCountryCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tourist list */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <p className="text-xs font-semibold text-deepblue-500 uppercase tracking-wide">All Registered Tourists</p>
                    {profiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 rounded-lg bg-sand-50 px-3 py-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-deepblue-100 text-xs font-bold text-deepblue-700">
                          {p.username[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-deepblue-900 truncate">{p.username}</p>
                          <p className="text-xs text-deepblue-400">{p.home_country || 'Country not set'}</p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-deepblue-300">
                          {new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Eco volunteers with country data */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" /> Eco Volunteer Registrations
              </h3>
              {volunteers.length === 0 ? (
                <EmptyState text="No volunteer registrations yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-sand-200 text-deepblue-500">
                        <th className="py-2 pr-3 font-semibold">Name</th>
                        <th className="py-2 pr-3 font-semibold">Country</th>
                        <th className="py-2 pr-3 font-semibold">Project</th>
                        <th className="py-2 pr-3 font-semibold">Phone</th>
                        <th className="py-2 pr-3 font-semibold">Status</th>
                        <th className="py-2 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map((v) => (
                        <tr key={v.id} className="border-b border-sand-100 hover:bg-sand-50">
                          <td className="py-2 pr-3 font-medium text-deepblue-900">{v.name}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{v.country}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{v.project_name}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{v.phone}</td>
                          <td className="py-2 pr-3"><StatusBadge status={v.status} /></td>
                          <td className="py-2 text-deepblue-400">{new Date(v.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === POPULAR SPOTS === */}
        {tab === 'spots' && (
          <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
            <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-terracotta-600" /> Most Popular Tourist Spots
            </h3>
            {spots.length === 0 ? (
              <EmptyState text="No spot view data yet. Views are tracked when users browse tourist spots on the website." />
            ) : (
              <div className="space-y-3">
                {spots.map((s, i) => (
                  <div key={s.spot_name} className="flex items-center gap-3 rounded-xl bg-sand-50 p-3">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      i < 3 ? 'bg-amber-400 text-amber-900' : 'bg-sand-200 text-deepblue-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-deepblue-900 truncate">{s.spot_name}</p>
                      <div className="mt-1 h-2 rounded-full bg-sand-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-700"
                          style={{ width: `${(s.views / maxSpotViews) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-deepblue-900">{s.views}</p>
                      <p className="text-xs text-deepblue-400">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === BOOKINGS === */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {/* Revenue summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings} color="bg-deepblue-600" />
              <StatCard icon={Activity} label="Pending" value={stats.pendingBookings} color="bg-amber-500" />
              <StatCard icon={DollarSign} label="Est. Revenue" value={`$${stats.totalRevenue}`} color="bg-green-600" />
              <StatCard icon={Users} label="Tour Requests" value={touristReqs.length} color="bg-terracotta-500" />
            </div>

            {/* Aral tour bookings */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-deepblue-600" /> Aral Sea Tour Bookings
              </h3>
              {bookings.length === 0 ? (
                <EmptyState text="No Aral Sea bookings yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-sand-200 text-deepblue-500">
                        <th className="py-2 pr-3 font-semibold">Tour</th>
                        <th className="py-2 pr-3 font-semibold">Customer</th>
                        <th className="py-2 pr-3 font-semibold">Phone</th>
                        <th className="py-2 pr-3 font-semibold">Date</th>
                        <th className="py-2 pr-3 font-semibold">Group</th>
                        <th className="py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-sand-100 hover:bg-sand-50">
                          <td className="py-2 pr-3 font-medium text-deepblue-900">{b.tour_name}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{b.name}<br /><span className="text-deepblue-400">{b.email}</span></td>
                          <td className="py-2 pr-3 text-deepblue-600">{b.phone}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{b.date}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{b.group_size}</td>
                          <td className="py-2"><StatusBadge status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tourist requests */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-terracotta-600" /> Tourist Requests & Inquiries
              </h3>
              {touristReqs.length === 0 ? (
                <EmptyState text="No tourist requests yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-sand-200 text-deepblue-500">
                        <th className="py-2 pr-3 font-semibold">Name</th>
                        <th className="py-2 pr-3 font-semibold">Phone</th>
                        <th className="py-2 pr-3 font-semibold">Tour</th>
                        <th className="py-2 pr-3 font-semibold">Budget</th>
                        <th className="py-2 pr-3 font-semibold">Guests</th>
                        <th className="py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {touristReqs.map((r) => (
                        <tr key={r.id} className="border-b border-sand-100 hover:bg-sand-50">
                          <td className="py-2 pr-3 font-medium text-deepblue-900">{r.name}<br /><span className="text-deepblue-400">{r.email}</span></td>
                          <td className="py-2 pr-3 text-deepblue-600">{r.phone}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{r.tour_name || '—'}</td>
                          <td className="py-2 pr-3 text-deepblue-600">${r.budget_total}</td>
                          <td className="py-2 pr-3 text-deepblue-600">{r.guests ?? r.group_size}</td>
                          <td className="py-2"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === 1222 TAXI BOOKINGS === */}
        {tab === 'taxi' && <TaxiTab bookings={taxiBookings} />}

        {/* === HOTEL BOOKINGS === */}
        {tab === 'hotels' && <HotelTab bookings={hotelBookings} />}

        {/* === GAME WINNERS === */}
        {tab === 'winners' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon={Trophy} label="Total Winners" value={stats.totalGameWinners} color="bg-amber-500" />
              <StatCard icon={Zap} label="Quiz Plays" value={stats.totalQuizPlays} color="bg-deepblue-600" />
              <StatCard icon={Award} label="Points Awarded" value={winners.reduce((s, w) => s + w.points_earned, 0)} color="bg-emerald-600" />
            </div>

            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-deepblue-900 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Game Winner Submissions
                </h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-deepblue-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="rounded-lg border border-sand-300 bg-sand-50 pl-8 pr-3 py-1.5 text-xs text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white w-32 sm:w-48"
                  />
                </div>
              </div>

              {winners.length === 0 ? (
                <EmptyState text="No game winners yet. Data appears here when users complete the trivia quiz and submit their contact info." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-sand-200 text-deepblue-500">
                        <th className="py-2 pr-3 font-semibold">Name</th>
                        <th className="py-2 pr-3 font-semibold">Phone</th>
                        <th className="py-2 pr-3 font-semibold">Location</th>
                        <th className="py-2 pr-3 font-semibold">Score</th>
                        <th className="py-2 pr-3 font-semibold">Points</th>
                        <th className="py-2 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {winners
                        .filter((w) =>
                          !search ||
                          w.player_name.toLowerCase().includes(search.toLowerCase()) ||
                          w.phone.includes(search) ||
                          w.location.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((w) => (
                          <tr key={w.id} className="border-b border-sand-100 hover:bg-sand-50">
                            <td className="py-2.5 pr-3">
                              <p className="font-semibold text-deepblue-900">{w.player_name}</p>
                              <p className="text-deepblue-400">{w.game_type}</p>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className="flex items-center gap-1 text-deepblue-600">
                                <Phone className="h-3 w-3" /> {w.phone || '—'}
                              </span>
                            </td>
                            <td className="py-2.5 pr-3 text-deepblue-600">{w.location || '—'}</td>
                            <td className="py-2.5 pr-3">
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-700">
                                {w.score}/{w.total}
                              </span>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className="flex items-center gap-0.5 font-bold text-emerald-600">
                                <Zap className="h-3 w-3" /> {w.points_earned}
                              </span>
                            </td>
                            <td className="py-2.5 text-deepblue-400">
                              {new Date(w.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === PHOTOS === */}
        {tab === 'photos' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon={Camera} label="Total Photos" value={stats.totalPhotos} color="bg-pink-600" />
              <StatCard icon={Award} label="Total Votes" value={stats.totalVotes} color="bg-terracotta-500" />
              <StatCard icon={TrendingUp} label="Avg Votes" value={stats.totalPhotos > 0 ? Math.round(stats.totalVotes / stats.totalPhotos) : 0} color="bg-deepblue-600" />
            </div>

            <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-pink-600" /> Photo Contest Entries
              </h3>
              {photos.length === 0 ? (
                <EmptyState text="No photo entries yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-sand-200 text-deepblue-500">
                        <th className="py-2 pr-3 font-semibold">Title</th>
                        <th className="py-2 pr-3 font-semibold">Location</th>
                        <th className="py-2 pr-3 font-semibold">Votes</th>
                        <th className="py-2 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {photos.map((p, i) => (
                        <tr key={p.id} className="border-b border-sand-100 hover:bg-sand-50">
                          <td className="py-2 pr-3 font-medium text-deepblue-900">
                            {i < 3 && <Trophy className="inline h-3.5 w-3.5 mr-1 text-amber-500" />}
                            {p.title}
                          </td>
                          <td className="py-2 pr-3 text-deepblue-600">{p.location || '—'}</td>
                          <td className="py-2 pr-3">
                            <span className="flex items-center gap-1 font-bold text-terracotta-600">
                              <Award className="h-3 w-3" /> {p.votes}
                            </span>
                          </td>
                          <td className="py-2 text-deepblue-400">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Printable Digital Receipt Inspector Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-elevated overflow-hidden border border-sand-300 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-deepblue-900 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-amber-400" />
                  <h3 className="font-display text-base font-bold">Электронный фискальный чек</h3>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Restaurant-style Receipt Paper Visual */}
              <div className="p-6 bg-sand-50 font-mono text-xs text-deepblue-900 space-y-4 border-b border-sand-200">
                <div className="text-center pb-3 border-b border-dashed border-sand-300">
                  <p className="font-bold text-sm tracking-wider">ENDLESS STEPPE KARAKALPAKSTAN</p>
                  <p className="text-[10px] text-deepblue-500">Туристический портал и Партнерская сеть</p>
                  <p className="text-[10px] text-deepblue-400 mt-1">г. Нукус, Республика Каракалпакстан</p>
                  <p className="font-bold text-terracotta-600 mt-2 text-sm">{selectedReceipt.receiptNumber}</p>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-deepblue-500">Дата и время:</span>
                    <span>{new Date(selectedReceipt.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deepblue-500">Турист:</span>
                    <span className="font-bold">{selectedReceipt.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deepblue-500">Телефон:</span>
                    <span>{selectedReceipt.userPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deepblue-500">Исполнитель/Партнер:</span>
                    <span className="font-bold">{selectedReceipt.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deepblue-500">Способ оплаты:</span>
                    <span>{selectedReceipt.paymentMethod}</span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="pt-2 border-t border-dashed border-sand-300">
                  <p className="font-bold mb-2 text-deepblue-800">Детализация заказа (Items):</p>
                  <div className="space-y-1.5">
                    {selectedReceipt.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-deepblue-500">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                        </div>
                        <span className="font-bold">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown Totals */}
                <div className="pt-3 border-t border-dashed border-sand-300 space-y-1 text-xs">
                  <div className="flex justify-between text-deepblue-600">
                    <span>Подытог (Subtotal):</span>
                    <span>${selectedReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-deepblue-600">
                    <span>НДС (0% Туризм):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-deepblue-600">
                    <span>Комиссия системы ({selectedReceipt.commissionRate}%):</span>
                    <span className="text-emerald-600 font-bold">${selectedReceipt.commissionAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-deepblue-900 text-deepblue-900">
                    <span>ИТОГО К ОПЛАТЕ:</span>
                    <span>${selectedReceipt.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Barcode & Verification Footer */}
                <div className="text-center pt-3 border-t border-dashed border-sand-300 text-[10px] text-deepblue-400 space-y-1">
                  <p className="font-mono tracking-widest text-[9px] text-deepblue-600 font-bold">||||| | |||| ||| ||||| || |||||| | |||</p>
                  <p>СПАСИБО ЗА ПОСЕЩЕНИЕ КАРАКАЛПАКСТАНА!</p>
                  <p className="text-[9px]">Чек сгенерирован автоматически системой управления Endless Steppe.</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-white p-4 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-deepblue-700 px-4 py-2 text-xs font-bold text-white hover:bg-deepblue-800 transition-colors shadow"
                >
                  <Printer className="h-4 w-4" /> Распечатать чек
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-xl bg-sand-100 px-4 py-2 text-xs font-bold text-deepblue-700 hover:bg-sand-200 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// === 1222 Taxi Tab ===
function TaxiTab({ bookings }: { bookings: TaxiBookingRow[] }) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyBookings = bookings.filter((b) => new Date(b.created_at) >= weekAgo);
  const monthlyBookings = bookings.filter((b) => new Date(b.created_at) >= monthAgo);

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_price || 0), 0);
  const totalEarnings = bookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);
  const weeklyEarnings = weeklyBookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);
  const monthlyEarnings = monthlyBookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard icon={Car} label="Total Bookings" value={bookings.length} color="bg-deepblue-600" />
        <StatCard icon={Calendar} label="This Week" value={weeklyBookings.length} color="bg-terracotta-500" />
        <StatCard icon={Activity} label="This Month" value={monthlyBookings.length} color="bg-amber-500" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`${totalRevenue.toFixed(2)}`} color="bg-green-600" />
      </div>

      {/* Commission earnings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-subtle">
          <p className="text-xs text-emerald-100 mb-1">Total Earnings (Commission)</p>
          <p className="font-display text-2xl font-bold tabular-nums">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Weekly Earnings</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">${weeklyEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Monthly Earnings</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">${monthlyEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Pending / Completed</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">{pendingCount} / {completedCount}</p>
        </div>
      </div>

      {/* 1222 Taxi branding bar */}
      <div className="flex items-center gap-3 rounded-xl bg-deepblue-900 px-5 py-3 text-white shadow-subtle">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400">
          <span className="font-display text-sm font-bold text-deepblue-900">1222</span>
        </div>
        <div>
          <p className="font-display text-sm font-bold">1222 Taxi — Booking Management</p>
          <p className="text-xs text-sand-300">Manual booking aggregation · Contract pending · Beta Test Mode (0% commission)</p>
        </div>
      </div>

      {/* Test mode notice */}
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-200">
        <FlaskConical className="h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Beta Test Period:</span> All bookings are tagged as test mode with 0% commission.
          Total traffic: {bookings.length} bookings generated for 1222 Taxi partner report.
        </p>
      </div>

      {/* Bookings table */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
        <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
          <Car className="h-5 w-5 text-deepblue-600" /> All Taxi Bookings
        </h3>
        {bookings.length === 0 ? (
          <EmptyState text="No taxi bookings yet. Bookings will appear here when tourists submit the taxi booking form." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-sand-200 text-deepblue-500">
                  <th className="py-2 pr-3 font-semibold">Tracking ID</th>
                  <th className="py-2 pr-3 font-semibold">Tourist</th>
                  <th className="py-2 pr-3 font-semibold">Route</th>
                  <th className="py-2 pr-3 font-semibold">Date/Time</th>
                  <th className="py-2 pr-3 font-semibold">Pax</th>
                  <th className="py-2 pr-3 font-semibold">Price</th>
                  <th className="py-2 pr-3 font-semibold">Comm.</th>
                  <th className="py-2 pr-3 font-semibold">Earnings</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const earnings = (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100);
                  return (
                    <tr key={b.id} className="border-b border-sand-100 hover:bg-sand-50">
                      <td className="py-2.5 pr-3">
                        <span className="rounded-md bg-deepblue-100 px-1.5 py-0.5 font-bold text-deepblue-800">{b.tracking_id}</span>
                        {b.is_test_mode && (
                          <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">BETA</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3">
                        <p className="font-semibold text-deepblue-900">{b.tourist_name}</p>
                        <p className="text-deepblue-400">{b.phone}</p>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="text-deepblue-600">{b.pickup_location}</span>
                        <span className="text-deepblue-300 mx-1">→</span>
                        <span className="text-deepblue-600">{b.dropoff_location}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-deepblue-600">
                        {new Date(b.travel_datetime || b.travel_date || b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        <br />
                        <span className="text-deepblue-400">{new Date(b.travel_datetime || b.travel_date || b.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-deepblue-600">{b.passengers}</td>
                      <td className="py-2.5 pr-3 font-semibold text-deepblue-900">${Number(b.total_price || 0).toFixed(2)}</td>
                      <td className="py-2.5 pr-3 text-deepblue-600">{Number(b.commission_rate || 0)}%</td>
                      <td className="py-2.5 pr-3 font-bold text-emerald-600">${earnings.toFixed(2)}</td>
                      <td className="py-2.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// === Hotel Bookings Tab ===
function HotelTab({ bookings }: { bookings: HotelBookingRow[] }) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyBookings = bookings.filter((b) => new Date(b.created_at) >= weekAgo);
  const monthlyBookings = bookings.filter((b) => new Date(b.created_at) >= monthAgo);

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_price || 0), 0);
  const totalEarnings = bookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);
  const weeklyEarnings = weeklyBookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);
  const monthlyEarnings = monthlyBookings.reduce((s, b) => s + (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100), 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  // Hotel breakdown
  const hotelMap = new Map<string, number>();
  bookings.forEach((b) => hotelMap.set(b.hotel_name, (hotelMap.get(b.hotel_name) ?? 0) + 1));
  const hotelBreakdown = [...hotelMap.entries()].sort((a, b) => b[1] - a[1]);
  const maxHotelCount = Math.max(...hotelBreakdown.map((h) => h[1]), 1);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard icon={Building} label="Total Bookings" value={bookings.length} color="bg-deepblue-600" />
        <StatCard icon={Calendar} label="This Week" value={weeklyBookings.length} color="bg-terracotta-500" />
        <StatCard icon={Activity} label="This Month" value={monthlyBookings.length} color="bg-amber-500" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`${totalRevenue.toFixed(2)}`} color="bg-green-600" />
      </div>

      {/* Commission earnings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-subtle">
          <p className="text-xs text-emerald-100 mb-1">Total Earnings (Commission)</p>
          <p className="font-display text-2xl font-bold tabular-nums">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Weekly Earnings</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">${weeklyEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Monthly Earnings</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">${monthlyEarnings.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-sand-200 shadow-sm">
          <p className="text-xs text-deepblue-400 mb-1">Pending / Completed</p>
          <p className="font-display text-xl font-bold text-deepblue-900 tabular-nums">{pendingCount} / {completedCount}</p>
        </div>
      </div>

      {/* Nukus Hotels branding bar */}
      <div className="flex items-center gap-3 rounded-xl bg-deepblue-900 px-5 py-3 text-white shadow-subtle">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta-500">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-display text-sm font-bold">Nukus Hotels Partnership — Booking Management</p>
          <p className="text-xs text-sand-300">Jipek Joli · Pana Hotel · Fayz Hotel · Nukus Palace · Beta Test Mode (0% commission)</p>
        </div>
      </div>

      {/* Test mode notice */}
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-200">
        <FlaskConical className="h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Beta Test Period:</span> All bookings are tagged as test mode with 0% commission.
          Total traffic: {bookings.length} bookings generated for Nukus Hotels partner report.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hotel breakdown chart */}
        <div className="rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
          <h3 className="font-display text-sm font-bold text-deepblue-900 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4 text-deepblue-600" /> Bookings by Hotel
          </h3>
          {hotelBreakdown.length === 0 ? (
            <EmptyState text="No data yet." />
          ) : (
            <div className="space-y-2.5">
              {hotelBreakdown.map(([name, count]) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-deepblue-700 truncate">{name}</span>
                    <span className="font-bold text-deepblue-900">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-sand-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-deepblue-500 to-deepblue-700 transition-all duration-700"
                      style={{ width: `${(count / maxHotelCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings table */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 ring-1 ring-sand-200 shadow-sm">
          <h3 className="font-display text-base font-bold text-deepblue-900 mb-4 flex items-center gap-2">
            <Bed className="h-5 w-5 text-deepblue-600" /> All Hotel Bookings
          </h3>
          {bookings.length === 0 ? (
            <EmptyState text="No hotel bookings yet. Bookings will appear here when tourists reserve rooms." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-sand-200 text-deepblue-500">
                    <th className="py-2 pr-3 font-semibold">Booking ID</th>
                    <th className="py-2 pr-3 font-semibold">Hotel</th>
                    <th className="py-2 pr-3 font-semibold">Guest</th>
                    <th className="py-2 pr-3 font-semibold">Dates</th>
                    <th className="py-2 pr-3 font-semibold">Nights</th>
                    <th className="py-2 pr-3 font-semibold">Price</th>
                    <th className="py-2 pr-3 font-semibold">Comm.</th>
                    <th className="py-2 pr-3 font-semibold">Earnings</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const earnings = (Number(b.total_price || 0) * Number(b.commission_rate || 0) / 100);
                    return (
                      <tr key={b.id} className="border-b border-sand-100 hover:bg-sand-50">
                        <td className="py-2.5 pr-3">
                          <span className="rounded-md bg-deepblue-100 px-1.5 py-0.5 font-bold text-deepblue-800">{b.tracking_id}</span>
                          {b.is_test_mode && (
                            <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">BETA</span>
                          )}
                        </td>
                        <td className="py-2.5 pr-3">
                          <p className="font-semibold text-deepblue-900">{b.hotel_name}</p>
                          <p className="text-deepblue-400">{b.room_type}</p>
                        </td>
                        <td className="py-2.5 pr-3">
                          <p className="font-semibold text-deepblue-900">{b.guest_name}</p>
                          <p className="text-deepblue-400">{b.phone}</p>
                        </td>
                        <td className="py-2.5 pr-3 text-deepblue-600">
                          {new Date(b.check_in).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          <span className="text-deepblue-300 mx-1">→</span>
                          {new Date(b.check_out).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-2.5 pr-3 text-deepblue-600">{b.nights}</td>
                        <td className="py-2.5 pr-3 font-semibold text-deepblue-900">${Number(b.total_price || 0).toFixed(2)}</td>
                        <td className="py-2.5 pr-3 text-deepblue-600">{Number(b.commission_rate || 0)}%</td>
                        <td className="py-2.5 pr-3 font-bold text-emerald-600">${earnings.toFixed(2)}</td>
                        <td className="py-2.5"><StatusBadge status={b.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === Helper Components ===
function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number | string; color: string }) {
  return (
    <div className="group rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-sand-200/80 shadow-xs hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${color} shadow-xs group-hover:scale-105 transition-transform`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-500/20">
          Live
        </span>
      </div>
      <p className="font-display text-2xl sm:text-3xl font-extrabold text-deepblue-950 tabular-nums tracking-tight mb-0.5">
        {value}
      </p>
      <p className="text-xs font-semibold text-deepblue-500/90 truncate">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-500/30',
    confirmed: 'bg-blue-50 text-blue-700 ring-blue-500/30',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-500/30',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-500/30',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-500/30',
    participated: 'bg-sky-50 text-sky-700 ring-sky-500/30',
    declined: 'bg-rose-50 text-rose-700 ring-rose-500/30',
  };
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${colors[status] ?? 'bg-sand-100 text-deepblue-600 ring-sand-300'}`}>
      {status}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-sand-50/50 rounded-xl border border-dashed border-sand-300">
      <BarChart3 className="h-10 w-10 text-deepblue-300 mb-2.5" />
      <p className="text-xs font-medium text-deepblue-500 max-w-xs">{text}</p>
    </div>
  );
}
