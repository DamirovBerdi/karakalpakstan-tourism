import { useState, useEffect, useCallback, useRef } from 'react';
import { Users, MessageSquare, Send, Loader2, MapPin, Globe, Calendar, User as UserIcon, Shield, MessageCircle, Lock, LogIn } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';

interface CommunityProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string;
  home_country: string;
  travel_interests: string[];
  created_at: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  sender_name?: string;
  created_at: string;
}

interface GroupMessage {
  id: string;
  channel: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

const GROUP_CHANNELS = [
  { id: 'aral', name: '🌊 Арал & Экспедиции', desc: 'Джип-туры, погода на Устюрте, палатки' },
  { id: 'culture', name: '🏛️ Культура & Музеи', desc: 'Музей Савицкого, Миздахкан, Нукус' },
  { id: 'lounge', name: '💬 Чат путешественников', desc: 'Знакомства, поиск попутчиков, советы' },
];

const INITIAL_GROUP_MESSAGES: GroupMessage[] = [
  { id: 'gm-1', channel: 'aral', sender_id: 'u-1', sender_name: 'Elena Rostova', content: 'Привет всем! Кто собирается на Аральское море в ближайшие дни?', created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'gm-2', channel: 'aral', sender_id: 'u-2', sender_name: 'Азамат Есенов', content: 'Завтра выезжает джип из Нукуса, есть 2 свободных места!', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'gm-3', channel: 'culture', sender_id: 'u-3', sender_name: 'Markus Weber', content: 'Savitsky Museum was absolutely mindblowing today!', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'gm-4', channel: 'lounge', sender_id: 'u-4', sender_name: 'Sophie Laurent', content: 'Any recommendations for good national food in Nukus?', created_at: new Date(Date.now() - 3600000 * 1).toISOString() },
];

const INITIAL_ADMIN_MESSAGES: Message[] = [
  { id: 'am-1', sender_id: 'admin', recipient_id: 'user', content: 'Здравствуйте! Я администратор платформы Karakalpakstan Tourism. Чем могу вам помочь?', read: true, sender_name: 'Super Admin', created_at: new Date(Date.now() - 86400000).toISOString() },
];

export default function Community() {
  const { t } = useLang();
  const { user, profile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'groups' | 'direct' | 'admin_support'>('groups');
  const [activeChannel, setActiveChannel] = useState(GROUP_CHANNELS[0].id);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profiles, setProfiles] = useState<CommunityProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatWith, setChatWith] = useState<CommunityProfile | null>(null);

  // Group messages
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(() => {
    try {
      const cached = localStorage.getItem('kk_all_group_messages');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GROUP_MESSAGES;
  });
  const [newGroupText, setNewGroupText] = useState('');

  // Direct 1-on-1 messages
  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [newDirectText, setNewDirectText] = useState('');

  // Admin Support messages
  const [adminMessages, setAdminMessages] = useState<Message[]>(() => {
    try {
      const cached = localStorage.getItem('kk_admin_support_messages');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_MESSAGES;
  });
  const [newAdminText, setNewAdminText] = useState('');

  const [msgLoading, setMsgLoading] = useState(false);

  // Scroll anchors
  const groupScrollRef = useRef<HTMLDivElement>(null);
  const adminScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (activeTab === 'groups') {
      scrollToBottom(groupScrollRef);
    } else if (activeTab === 'admin_support') {
      scrollToBottom(adminScrollRef);
    }
  }, [groupMessages, adminMessages, activeTab, activeChannel]);

  // Realtime Broadcast Channel Listener
  useEffect(() => {
    const channel = supabase
      .channel('kk_community_realtime')
      .on('broadcast', { event: 'new_group_msg' }, ({ payload }) => {
        if (payload && payload.channel) {
          setGroupMessages((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            const updated = [...prev, payload];
            try {
              localStorage.setItem('kk_all_group_messages', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      })
      .on('broadcast', { event: 'new_admin_msg' }, ({ payload }) => {
        if (payload) {
          setAdminMessages((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            const updated = [...prev, payload];
            try {
              localStorage.setItem('kk_admin_support_messages', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load profiles for 1-on-1 chat
  const loadProfiles = useCallback(async () => {
    try {
      const cached = localStorage.getItem('kk_community_profiles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProfiles(parsed);
          setLoading(false);
        }
      }
    } catch {}

    try {
      const { data } = await supabase
        .from('community_profiles')
        .select('*')
        .neq('id', user?.id ?? '00000000-0000-0000-0000-000000000000')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) {
        const safeProfiles = data.map((p: any) => ({
          ...p,
          travel_interests: Array.isArray(p.travel_interests) ? p.travel_interests : []
        }));
        setProfiles(safeProfiles as CommunityProfile[]);
        try {
          localStorage.setItem('kk_community_profiles', JSON.stringify(safeProfiles));
        } catch {}
      }
    } catch {
      // keep cached
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load 1-on-1 direct messages
  const loadDirectMessages = useCallback(async (otherId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('traveler_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${user.id}))`)
      .order('created_at', { ascending: true });
    setDirectMessages((data ?? []) as Message[]);
  }, [user]);

  // Load Admin support messages
  const loadAdminMessages = useCallback(async () => {
    try {
      const key = user ? `support_chats_${user.id}` : 'support_chats_global';
      const { data } = await supabase
        .from('admin_config')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      if (data?.value) {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdminMessages(parsed);
          try {
            localStorage.setItem('kk_admin_support_messages', JSON.stringify(parsed));
          } catch {}
        }
      }
    } catch {
      // keep state
    }
  }, [user]);

  // Load Group messages for active channel
  const loadGroupMessages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('admin_config')
        .select('value')
        .eq('key', `group_msg_${activeChannel}`)
        .maybeSingle();
      if (data?.value) {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGroupMessages((prev) => {
            const other = prev.filter((m) => m.channel !== activeChannel);
            const updated = [...other, ...parsed];
            try {
              localStorage.setItem('kk_all_group_messages', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      }
    } catch {
      // fallback
    }
  }, [activeChannel]);

  useEffect(() => {
    loadProfiles();
    loadAdminMessages();
    loadGroupMessages();

    // Polling timer for live updates
    const timer = setInterval(() => {
      loadAdminMessages();
      loadGroupMessages();
    }, 3000);

    return () => clearInterval(timer);
  }, [loadProfiles, loadAdminMessages, loadGroupMessages]);

  // Handlers
  const handleSendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupText.trim() || !user) return;

    const senderName = profile?.username || user?.email?.split('@')[0] || 'Турист';
    const newMsg: GroupMessage = {
      id: 'gm-' + Date.now(),
      channel: activeChannel,
      sender_id: user.id,
      sender_name: senderName,
      content: newGroupText.trim(),
      created_at: new Date().toISOString(),
    };

    const updated = [...groupMessages, newMsg];
    setGroupMessages(updated);
    setNewGroupText('');

    try {
      localStorage.setItem('kk_all_group_messages', JSON.stringify(updated));
    } catch {}

    // Broadcast live event to all connected users
    try {
      supabase.channel('kk_community_realtime').send({
        type: 'broadcast',
        event: 'new_group_msg',
        payload: newMsg,
      });
    } catch {}

    // Persist to admin_config safely
    try {
      await supabase.from('admin_config').upsert({
        key: `group_msg_${activeChannel}`,
        value: JSON.stringify(updated.filter((m) => m.channel === activeChannel)),
        updated_at: new Date().toISOString(),
      });
    } catch {}
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !chatWith || !newDirectText.trim()) return;
    setMsgLoading(true);

    const { data, error } = await supabase
      .from('traveler_messages')
      .insert({
        sender_id: user.id,
        recipient_id: chatWith.id,
        content: newDirectText.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setDirectMessages([...directMessages, data as Message]);
    } else {
      const fallbackMsg: Message = {
        id: 'dm-' + Date.now(),
        sender_id: user.id,
        recipient_id: chatWith.id,
        content: newDirectText.trim(),
        read: false,
        created_at: new Date().toISOString(),
      };
      setDirectMessages([...directMessages, fallbackMsg]);
    }
    setNewDirectText('');
    setMsgLoading(false);
  };

  const handleSendAdminSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminText.trim() || !user) return;
    setMsgLoading(true);

    const senderName = profile?.username || user?.email?.split('@')[0] || 'Турист';
    const newMsg: Message = {
      id: 'am-' + Date.now(),
      sender_id: user.id,
      recipient_id: 'admin_support',
      content: newAdminText.trim(),
      read: false,
      sender_name: senderName,
      created_at: new Date().toISOString(),
    };

    const updated = [...adminMessages, newMsg];
    setAdminMessages(updated);
    setNewAdminText('');

    try {
      localStorage.setItem('kk_admin_support_messages', JSON.stringify(updated));
    } catch {}

    // Broadcast live event to all connected users
    try {
      supabase.channel('kk_community_realtime').send({
        type: 'broadcast',
        event: 'new_admin_msg',
        payload: newMsg,
      });
    } catch {}

    // Save support message to admin_config safely
    try {
      await supabase.from('admin_config').upsert({
        key: `support_chats_${user.id}`,
        value: JSON.stringify(updated),
        updated_at: new Date().toISOString(),
      });
    } catch {}

    setMsgLoading(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openChat = (p: CommunityProfile) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setChatWith(p);
    loadDirectMessages(p.id);
  };

  const unreadCount = directMessages.filter((m) => !m.read && m.recipient_id === user?.id).length;

  return (
    <section id="community" className="py-16 sm:py-20 bg-gradient-to-b from-white to-sand-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <MessageSquare className="h-3.5 w-3.5" /> Karakalpakstan Chat Hub
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">Сообщество и Чат-Центр</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">
            Общайтесь в тематических групповых чатах, пишите туристам лично и запрашивайте туры напрямую у Администраторов!
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'groups'
                ? 'bg-deepblue-700 text-white shadow-medium'
                : 'bg-white text-deepblue-700 hover:bg-sand-100 ring-1 ring-sand-200'
            }`}
          >
            <Users className="h-4 w-4" /> Групповые чаты
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'direct'
                ? 'bg-deepblue-700 text-white shadow-medium'
                : 'bg-white text-deepblue-700 hover:bg-sand-100 ring-1 ring-sand-200'
            }`}
          >
            <MessageCircle className="h-4 w-4" /> Личные сообщения
          </button>
          <button
            onClick={() => setActiveTab('admin_support')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'admin_support'
                ? 'bg-terracotta-500 text-white shadow-medium ring-2 ring-terracotta-400'
                : 'bg-white text-terracotta-600 hover:bg-terracotta-50 ring-1 ring-terracotta-200'
            }`}
          >
            <Shield className="h-4 w-4 text-amber-300" /> Чат с Администрацией
          </button>
        </div>

        {/* === 1. GROUP CHANNELS === */}
        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl bg-white ring-1 ring-sand-200 shadow-sm p-4 sm:p-6">
            {/* Channel List */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-sand-200 pr-0 md:pr-4 pb-4 md:pb-0">
              <h3 className="text-xs font-bold text-deepblue-400 uppercase tracking-wider mb-2">Каналы общения</h3>
              {GROUP_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left rounded-xl p-3 transition-all ${
                    activeChannel === ch.id
                      ? 'bg-deepblue-50 text-deepblue-900 ring-1 ring-deepblue-200 font-bold'
                      : 'hover:bg-sand-50 text-deepblue-700'
                  }`}
                >
                  <p className="text-sm font-bold">{ch.name}</p>
                  <p className="text-[11px] text-deepblue-500 mt-0.5">{ch.desc}</p>
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="md:col-span-2 flex flex-col justify-between h-[420px]">
              <div ref={groupScrollRef} className="overflow-y-auto space-y-3 pr-2 flex-1 scroll-smooth">
                {groupMessages
                  .filter((m) => m.channel === activeChannel)
                  .map((m) => {
                    const isMe = m.sender_id === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`rounded-xl p-3 ring-1 space-y-1 transition-all ${
                          isMe
                            ? 'bg-deepblue-50 border-l-4 border-deepblue-600 ring-deepblue-200 ml-6'
                            : 'bg-sand-50 ring-sand-200 mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-deepblue-900 flex items-center gap-1.5">
                            <UserIcon className="h-3.5 w-3.5 text-deepblue-500" /> {m.sender_name} {isMe && '(Вы)'}
                          </span>
                          <span className="text-deepblue-400 text-[10px]">{formatTime(m.created_at)}</span>
                        </div>
                        <p className="text-xs text-deepblue-800 leading-relaxed">{m.content}</p>
                      </div>
                    );
                  })}
              </div>

              {/* Input Form or Auth Prompt */}
              {!user ? (
                <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-deepblue-50 p-3.5 ring-1 ring-deepblue-200">
                  <div className="flex items-center gap-2 text-xs text-deepblue-800">
                    <Lock className="h-4 w-4 text-deepblue-600 flex-shrink-0" />
                    <span>Для отправки сообщений зарегистрируйтесь или войдите в аккаунт.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="flex-shrink-0 rounded-lg bg-deepblue-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-deepblue-800 transition-colors flex items-center gap-1.5 shadow"
                  >
                    <LogIn className="h-3.5 w-3.5" /> Войти / Зарегистрироваться
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendGroupMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newGroupText}
                    onChange={(e) => setNewGroupText(e.target.value)}
                    placeholder={`Напишите сообщение как ${profile?.username || user?.email?.split('@')[0]}...`}
                    className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-3.5 py-2.5 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-deepblue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-deepblue-800 flex items-center gap-1.5 shadow"
                  >
                    <Send className="h-3.5 w-3.5" /> Отправить
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* === 3. ADMIN SUPPORT CHAT === */}
        {activeTab === 'admin_support' && (
          <div className="rounded-2xl bg-white ring-1 ring-sand-200 shadow-sm p-6 max-w-3xl mx-auto space-y-5">
            <div className="flex items-center gap-3 border-b border-sand-200 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-600 flex-shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-deepblue-900 flex items-center gap-2">
                  Связь с Администрацией сайта <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Онлайн</span>
                </h3>
                <p className="text-xs text-deepblue-500 mt-0.5">
                  Задавайте любые вопросы по индивидуальным турам, бронированию джипов, отелям или логистике. Super Admin ответит вам здесь!
                </p>
              </div>
            </div>

            {/* Message Thread */}
            <div ref={adminScrollRef} className="h-72 overflow-y-auto space-y-3 pr-2 scroll-smooth">
              {adminMessages.map((m) => {
                const isAdmin = m.sender_id === 'admin' || m.sender_id === 'admin_support';
                return (
                  <div key={m.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs space-y-1 ${
                        isAdmin
                          ? 'bg-deepblue-900 text-white shadow-sm ring-1 ring-deepblue-800'
                          : 'bg-terracotta-500 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-80 gap-3">
                        <span className="font-bold flex items-center gap-1">
                          {isAdmin ? <Shield className="h-3 w-3 text-amber-400" /> : <UserIcon className="h-3 w-3" />}
                          {isAdmin ? 'Super Admin' : m.sender_name || 'Вы'}
                        </span>
                        <span>{formatTime(m.created_at)}</span>
                      </div>
                      <p className="leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form or Auth Prompt */}
            {!user ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-terracotta-50 p-4 ring-1 ring-terracotta-200">
                <div className="flex items-center gap-2 text-xs text-terracotta-900">
                  <Lock className="h-4 w-4 text-terracotta-600 flex-shrink-0" />
                  <span>Для связи с Администрацией сайта пожалуйста зарегистрируйтесь или войдите в аккаунт.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="flex-shrink-0 rounded-lg bg-terracotta-500 px-4 py-2 text-xs font-bold text-white hover:bg-terracotta-600 transition-colors flex items-center gap-1.5 shadow"
                >
                  <LogIn className="h-3.5 w-3.5" /> Войти / Зарегистрироваться
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendAdminSupportMessage} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newAdminText}
                  onChange={(e) => setNewAdminText(e.target.value)}
                  placeholder={`Здравствуйте! Задайте вопрос администратору (${profile?.username || user?.email?.split('@')[0]})...`}
                  className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 text-xs text-deepblue-900 outline-none focus:border-terracotta-500"
                />
                <button
                  type="submit"
                  disabled={msgLoading}
                  className="rounded-xl bg-terracotta-500 px-5 py-3 text-xs font-bold text-white hover:bg-terracotta-600 disabled:opacity-60 flex items-center gap-1.5 shadow"
                >
                  <Send className="h-4 w-4" /> Отправить
                </button>
              </form>
            )}
          </div>
        )}

        {/* === DIRECT MESSAGES TAB ("ЛИЧНЫЕ ЧАТЫ ТУРИСТОВ") === */}
        {activeTab === 'direct' && (
          <div className="space-y-6">
            {/* My profile card */}
            {user && profile && (
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-deepblue-700 to-deepblue-900 p-5 text-white shadow-subtle">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold">{profile.username}</h3>
                    {profile.full_name && <p className="text-sm text-white/70">{profile.full_name}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/60">
                      {profile.home_country && (
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {profile.home_country}</span>
                      )}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="flex items-center gap-1.5 rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold">
                        <MessageSquare className="h-3.5 w-3.5" /> {unreadCount}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="flex-shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/20"
                  >
                    {t('community.signOut')}
                  </button>
                </div>
                {profile.bio && <p className="mt-3 text-sm text-white/80">{profile.bio}</p>}
                {Array.isArray(profile.travel_interests) && profile.travel_interests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.travel_interests.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Travelers list */}
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-deepblue-400" />
              </div>
            ) : !user ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-sand-200 space-y-4">
                <Users className="mx-auto h-10 w-10 text-deepblue-300" />
                <p className="text-deepblue-600 text-sm">{t('community.loginRequired')}</p>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-deepblue-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-deepblue-800 transition-colors shadow"
                >
                  <LogIn className="h-4 w-4" /> Войти / Зарегистрироваться
                </button>
              </div>
            ) : profiles.length === 0 ? (
              <div className="rounded-2xl bg-sand-50 p-8 text-center ring-1 ring-sand-200">
                <p className="text-deepblue-500">{t('community.noTravelers')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sand-200 transition-all hover:shadow-subtle"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-deepblue-100 flex-shrink-0">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-deepblue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold text-deepblue-900 truncate">{p.username}</h3>
                        {p.home_country && (
                          <p className="text-xs text-deepblue-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {p.home_country}
                          </p>
                        )}
                      </div>
                    </div>
                    {p.bio && <p className="text-xs text-deepblue-600 leading-relaxed mb-3 line-clamp-2">{p.bio}</p>}
                    {Array.isArray(p.travel_interests) && p.travel_interests.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {p.travel_interests.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-sand-100 px-2 py-0.5 text-xs text-deepblue-600">{tag}</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => openChat(p)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-deepblue-50 py-2 text-xs font-semibold text-deepblue-700 transition-colors hover:bg-deepblue-100"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> {t('community.message')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat modal */}
        {chatWith && user && (
          <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={() => setChatWith(null)} />

            <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[600px]">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-deepblue-100 flex-shrink-0">
                    {chatWith.avatar_url ? (
                      <img src={chatWith.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-deepblue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-deepblue-900">{chatWith.username}</p>
                    {chatWith.home_country && <p className="text-xs text-deepblue-400">{chatWith.home_country}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setChatWith(null)}
                  className="rounded-full p-1 text-deepblue-400 hover:bg-sand-100 hover:text-deepblue-600"
                >
                  ✕
                </button>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sand-50/50">
                {directMessages.length === 0 ? (
                  <p className="text-center text-xs text-deepblue-400 py-6">{t('community.noMessages')}</p>
                ) : (
                  directMessages.map((m) => {
                    const isMine = m.sender_id === user.id;
                    return (
                      <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                            isMine ? 'bg-deepblue-700 text-white' : 'bg-white text-deepblue-900 shadow-sm ring-1 ring-sand-200'
                          }`}
                        >
                          <p className="leading-relaxed">{m.content}</p>
                          <span
                            className={`block text-[10px] mt-1 text-right ${
                              isMine ? 'text-white/70' : 'text-deepblue-400'
                            }`}
                          >
                            {formatTime(m.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendDirectMessage} className="p-3 bg-white border-t border-sand-200 flex gap-2">
                <input
                  type="text"
                  value={newDirectText}
                  onChange={(e) => setNewDirectText(e.target.value)}
                  placeholder={t('community.typeMessage')}
                  className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-3.5 py-2 text-xs text-deepblue-900 outline-none focus:border-deepblue-500"
                />
                <button
                  type="submit"
                  disabled={msgLoading || !newDirectText.trim()}
                  className="rounded-xl bg-deepblue-700 px-4 py-2 text-xs font-bold text-white hover:bg-deepblue-800 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Global Auth Modal triggerable anywhere in Community */}
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </section>
  );
}
