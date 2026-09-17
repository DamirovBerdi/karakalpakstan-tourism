import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  MapPin,
  Calendar,
  Globe,
  X,
  Check,
  Loader2,
  Search,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { supabase } from '@/lib/supabase';
import { DESTINATIONS } from '@/data/tours';

interface BuddyRow {
  id: string;
  name: string;
  destination: string;
  travel_date: string;
  contact: string;
  languages: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface GroupRow {
  id: string;
  title: string;
  destination: string;
  travel_date: string;
  max_members: number;
  current_members: number;
  creator_name: string;
  creator_contact: string;
  cost_per_person: number;
  notes: string | null;
  status: string;
  created_at: string;
}

type Tab = 'find' | 'join';

export default function TravelBuddyMatcher() {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<Tab>('find');
  const [buddies, setBuddies] = useState<BuddyRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState<'buddy' | 'group' | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [joinConfirm, setJoinConfirm] = useState<string | null>(null);

  const [buddyForm, setBuddyForm] = useState({
    name: '',
    destination: DESTINATIONS[0].value,
    travel_date: '',
    contact: '',
    languages: '',
    notes: '',
  });

  const [groupForm, setGroupForm] = useState({
    title: '',
    destination: DESTINATIONS[0].value,
    travel_date: '',
    max_members: 4,
    creator_name: '',
    creator_contact: '',
    cost_per_person: 0,
    notes: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [buddyRes, groupRes] = await Promise.all([
        supabase.from('travel_buddies').select('*').order('created_at', { ascending: false }),
        supabase.from('open_groups').select('*').order('created_at', { ascending: false }),
      ]);
      if (buddyRes.data) setBuddies(buddyRes.data as BuddyRow[]);
      if (groupRes.data) setGroups(groupRes.data as GroupRow[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(
        lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : lang === 'kaa' ? 'uz-UZ' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      );
    } catch {
      return dateStr;
    }
  };

  const handleBuddySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyForm.name || !buddyForm.contact || !buddyForm.travel_date) return;
    setSubmitting(true);
    setErrorMsg(null);
    setSearching(true);

    try {
      const { error } = await supabase.from('travel_buddies').insert({
        name: buddyForm.name,
        destination: buddyForm.destination,
        travel_date: buddyForm.travel_date,
        contact: buddyForm.contact,
        languages: buddyForm.languages || null,
        notes: buddyForm.notes || null,
        status: 'searching',
      });

      if (error) throw error;

      await fetchData();

      const matches = buddies.filter(
        (b) => b.destination === buddyForm.destination && b.travel_date === buddyForm.travel_date && b.status === 'searching'
      );

      setTimeout(() => {
        setSearching(false);
        if (matches.length > 0) {
          setSuccessMsg(t('buddy.matched'));
        } else {
          setSuccessMsg(t('buddy.noMatch'));
        }
        setShowForm(null);
        setBuddyForm({ name: '', destination: DESTINATIONS[0].value, travel_date: '', contact: '', languages: '', notes: '' });
      }, 1500);
    } catch {
      setErrorMsg(t('buddy.error'));
      setSearching(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.title || !groupForm.creator_name || !groupForm.creator_contact || !groupForm.travel_date) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.from('open_groups').insert({
        title: groupForm.title,
        destination: groupForm.destination,
        travel_date: groupForm.travel_date,
        max_members: groupForm.max_members,
        current_members: 1,
        creator_name: groupForm.creator_name,
        creator_contact: groupForm.creator_contact,
        cost_per_person: groupForm.cost_per_person,
        notes: groupForm.notes || null,
        status: 'open',
      });

      if (error) throw error;

      setSuccessMsg(t('buddy.groupSuccess'));
      setShowForm(null);
      setGroupForm({
        title: '',
        destination: DESTINATIONS[0].value,
        travel_date: '',
        max_members: 4,
        creator_name: '',
        creator_contact: '',
        cost_per_person: 0,
        notes: '',
      });
      await fetchData();
    } catch {
      setErrorMsg(t('buddy.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinGroup = async (group: GroupRow) => {
    if (group.current_members >= group.max_members) return;

    try {
      const { error } = await supabase
        .from('open_groups')
        .update({
          current_members: group.current_members + 1,
          status: group.current_members + 1 >= group.max_members ? 'full' : 'open',
        })
        .eq('id', group.id);

      if (error) throw error;

      setJoinConfirm(group.id);
      setSuccessMsg(t('buddy.joinSuccess'));
      await fetchData();
      setTimeout(() => setJoinConfirm(null), 3000);
    } catch {
      setErrorMsg(t('buddy.error'));
    }
  };

  const destLabel = (value: string) => {
    const d = DESTINATIONS.find((d) => d.value === value);
    return d ? getText(d.label, lang) : value;
  };

  return (
    <section id="buddy" className="py-12 sm:py-16 bg-gradient-to-b from-white to-sand-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            {t('buddy.subtitle')}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900 mb-2">
            {t('buddy.title')}
          </h2>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setTab('find')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'find'
                ? 'bg-deepblue-700 text-white shadow-subtle'
                : 'bg-white text-deepblue-600 ring-1 ring-sand-200 hover:bg-sand-50'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            {t('buddy.tabFind')}
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'join'
                ? 'bg-deepblue-700 text-white shadow-subtle'
                : 'bg-white text-deepblue-600 ring-1 ring-sand-200 hover:bg-sand-50'
            }`}
          >
            <Users className="h-4 w-4" />
            {t('buddy.tabJoin')}
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
            <Check className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="ml-auto text-green-600 hover:text-green-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            <X className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-600 hover:text-red-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {tab === 'find' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-deepblue-800">{t('buddy.findTitle')}</h3>
                <p className="text-sm text-deepblue-500">{t('buddy.findDesc')}</p>
              </div>
              <button
                onClick={() => setShowForm('buddy')}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-white shadow-subtle transition-all hover:bg-terracotta-600 hover:shadow-medium"
              >
                <UserPlus className="h-4 w-4" />
                {t('buddy.findBtn')}
              </button>
            </div>

            {searching && (
              <div className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-deepblue-50 py-6 text-deepblue-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">{t('buddy.searching')}</span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-deepblue-400" />
              </div>
            ) : buddies.length === 0 ? (
              <div className="rounded-xl bg-sand-50 py-12 text-center text-deepblue-400 ring-1 ring-sand-200">
                <UserPlus className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">{t('buddy.noBuddies')}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {buddies.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl bg-white p-4 ring-1 ring-sand-200 transition-all hover:shadow-subtle"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-deepblue-100 p-2">
                          <UserCheck className="h-4 w-4 text-deepblue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-deepblue-800 text-sm">{b.name}</p>
                          <p className="text-xs text-deepblue-400">{formatDate(b.created_at)}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        {b.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-deepblue-600">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                        {destLabel(b.destination)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                        {formatDate(b.travel_date)}
                      </p>
                      {b.languages && (
                        <p className="flex items-center gap-1.5">
                          <Globe className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                          {b.languages}
                        </p>
                      )}
                    </div>
                    {b.notes && (
                      <p className="mt-2 text-xs text-deepblue-500 italic border-l-2 border-sand-200 pl-2">
                        {b.notes}
                      </p>
                    )}
                    <a
                      href={`mailto:${b.contact}`}
                      className="mt-3 block w-full rounded-lg bg-deepblue-50 py-2 text-center text-xs font-semibold text-deepblue-700 transition-colors hover:bg-deepblue-100"
                    >
                      {t('buddy.contactInfo')}: {b.contact}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'join' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-deepblue-800">{t('buddy.joinTitle')}</h3>
                <p className="text-sm text-deepblue-500">{t('buddy.joinDesc')}</p>
              </div>
              <button
                onClick={() => setShowForm('group')}
                className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-white shadow-subtle transition-all hover:bg-terracotta-600 hover:shadow-medium"
              >
                <Users className="h-4 w-4" />
                {t('buddy.createGroup')}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-deepblue-400" />
              </div>
            ) : groups.length === 0 ? (
              <div className="rounded-xl bg-sand-50 py-12 text-center text-deepblue-400 ring-1 ring-sand-200">
                <Users className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">{t('buddy.noGroups')}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {groups.map((g) => {
                  const spotsLeft = g.max_members - g.current_members;
                  const isFull = spotsLeft <= 0;
                  const justJoined = joinConfirm === g.id;
                  return (
                    <div
                      key={g.id}
                      className="rounded-xl bg-white p-4 ring-1 ring-sand-200 transition-all hover:shadow-subtle"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-deepblue-800 text-sm">{g.title}</h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isFull
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isFull ? t('buddy.full') : `${spotsLeft} ${t('buddy.spotsLeft')}`}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-deepblue-600 mb-2">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                          {destLabel(g.destination)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                          {formatDate(g.travel_date)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 flex-shrink-0 text-terracotta-500" />
                          {g.current_members}/{g.max_members} {t('buddy.members')}
                        </p>
                        {g.cost_per_person > 0 && (
                          <p className="font-semibold text-terracotta-600">
                            ${g.cost_per_person} {t('tours.perPerson')}
                          </p>
                        )}
                      </div>
                      {g.notes && (
                        <p className="text-xs text-deepblue-500 italic border-l-2 border-sand-200 pl-2 mb-2">
                          {g.notes}
                        </p>
                      )}
                      <p className="text-[10px] text-deepblue-400 mb-2">
                        {t('buddy.created')}: {formatDate(g.created_at)}
                      </p>
                      {justJoined ? (
                        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-green-50 py-2 text-xs font-semibold text-green-700">
                          <Check className="h-4 w-4" />
                          {t('buddy.joinSuccess')}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(g)}
                          disabled={isFull}
                          className="w-full rounded-lg bg-terracotta-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:bg-sand-200 disabled:text-deepblue-400"
                        >
                          {isFull ? t('buddy.full') : t('buddy.joinBtn')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showForm === 'buddy' && (
          <Modal onClose={() => setShowForm(null)} title={t('buddy.findTitle')}>
            <form onSubmit={handleBuddySubmit} className="space-y-3">
              <Field label={t('buddy.yourName')} required>
                <input
                  type="text"
                  value={buddyForm.name}
                  onChange={(e) => setBuddyForm({ ...buddyForm, name: e.target.value })}
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.destination')} required>
                <select
                  value={buddyForm.destination}
                  onChange={(e) => setBuddyForm({ ...buddyForm, destination: e.target.value })}
                  className="input-base"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {getText(d.label, lang)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('buddy.date')} required>
                <input
                  type="date"
                  value={buddyForm.travel_date}
                  onChange={(e) => setBuddyForm({ ...buddyForm, travel_date: e.target.value })}
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.contact')} required>
                <input
                  type="text"
                  value={buddyForm.contact}
                  onChange={(e) => setBuddyForm({ ...buddyForm, contact: e.target.value })}
                  placeholder="Phone, Email, or @Telegram"
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.languages')}>
                <input
                  type="text"
                  value={buddyForm.languages}
                  onChange={(e) => setBuddyForm({ ...buddyForm, languages: e.target.value })}
                  placeholder="English, Russian, Uzbek..."
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.notes')}>
                <textarea
                  value={buddyForm.notes}
                  onChange={(e) => setBuddyForm({ ...buddyForm, notes: e.target.value })}
                  placeholder={t('buddy.notesPlaceholder')}
                  rows={3}
                  className="input-base resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('buddy.submitting')}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    {t('buddy.submitBuddy')}
                  </>
                )}
              </button>
            </form>
          </Modal>
        )}

        {showForm === 'group' && (
          <Modal onClose={() => setShowForm(null)} title={t('buddy.createGroup')}>
            <form onSubmit={handleGroupSubmit} className="space-y-3">
              <Field label={t('buddy.groupTitle')} required>
                <input
                  type="text"
                  value={groupForm.title}
                  onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                  placeholder={t('buddy.groupTitlePlaceholder')}
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.destination')} required>
                <select
                  value={groupForm.destination}
                  onChange={(e) => setGroupForm({ ...groupForm, destination: e.target.value })}
                  className="input-base"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {getText(d.label, lang)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('buddy.date')} required>
                <input
                  type="date"
                  value={groupForm.travel_date}
                  onChange={(e) => setGroupForm({ ...groupForm, travel_date: e.target.value })}
                  required
                  className="input-base"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('buddy.maxMembers')} required>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={groupForm.max_members}
                    onChange={(e) => setGroupForm({ ...groupForm, max_members: parseInt(e.target.value) || 2 })}
                    required
                    className="input-base"
                  />
                </Field>
                <Field label={t('buddy.costPerPerson')}>
                  <input
                    type="number"
                    min={0}
                    value={groupForm.cost_per_person}
                    onChange={(e) => setGroupForm({ ...groupForm, cost_per_person: parseFloat(e.target.value) || 0 })}
                    className="input-base"
                  />
                </Field>
              </div>
              <Field label={t('buddy.yourName')} required>
                <input
                  type="text"
                  value={groupForm.creator_name}
                  onChange={(e) => setGroupForm({ ...groupForm, creator_name: e.target.value })}
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.contact')} required>
                <input
                  type="text"
                  value={groupForm.creator_contact}
                  onChange={(e) => setGroupForm({ ...groupForm, creator_contact: e.target.value })}
                  placeholder="Phone, Email, or @Telegram"
                  required
                  className="input-base"
                />
              </Field>
              <Field label={t('buddy.notes')}>
                <textarea
                  value={groupForm.notes}
                  onChange={(e) => setGroupForm({ ...groupForm, notes: e.target.value })}
                  rows={3}
                  className="input-base resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('buddy.submitting')}
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    {t('buddy.submitGroup')}
                  </>
                )}
              </button>
            </form>
          </Modal>
        )}
      </div>
    </section>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deepblue-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-elevated max-h-[85vh] overflow-y-auto animate-fade-up">
        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-display text-lg font-bold text-deepblue-800">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 hover:text-deepblue-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-deepblue-700">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </label>
      {children}
    </div>
  );
}
