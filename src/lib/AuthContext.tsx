import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string;
  home_country: string;
  travel_interests: string[];
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string, userMeta?: Record<string, any>) => {
    try {
      const { data } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
      } else {
        // Auto-create profile for Google OAuth / Social Login
        const fallbackName = userMeta?.full_name || userMeta?.name || userMeta?.email?.split('@')[0] || 'Traveler';
        const fallbackAvatar = userMeta?.avatar_url || userMeta?.picture || null;
        const newProf: Profile = {
          id: uid,
          username: fallbackName,
          full_name: userMeta?.full_name || null,
          avatar_url: fallbackAvatar,
          bio: 'Путешественник по Каракалпакстану 🏜️',
          home_country: 'Uzbekistan',
          travel_interests: ['Аральское море', 'Музей Савицкого'],
          created_at: new Date().toISOString(),
        };
        setProfile(newProf);

        try {
          await supabase.from('community_profiles').upsert({
            id: uid,
            username: fallbackName,
            full_name: userMeta?.full_name || null,
            avatar_url: fallbackAvatar,
          });
        } catch {
          // ignore table constraints
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id, user.user_metadata);
  }, [user, loadProfile]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfile(data.session.user.id, data.session.user.user_metadata).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      (async () => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await loadProfile(newSession.user.id, newSession.user.user_metadata);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      const newProfile: Profile = {
        id: data.user.id,
        username,
        full_name: null,
        avatar_url: null,
        bio: '',
        home_country: '',
        travel_interests: [],
        created_at: new Date().toISOString(),
      };
      setProfile(newProfile);

      try {
        await supabase
          .from('community_profiles')
          .insert({ id: data.user.id, username });
      } catch {
        /* Ignore table missing error so sign up succeeds */
      }
    }
    return { error: null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
