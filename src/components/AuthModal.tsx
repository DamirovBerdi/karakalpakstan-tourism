import { useState } from 'react';
import { X, LogIn, UserPlus, Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useLang();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const inputVal = email.trim();
    const passVal = password.trim();

    if (mode === 'signin') {
      const targetEmail = inputVal.includes('@') ? inputVal : `${inputVal.toLowerCase()}@karakalpak.travel`;
      const { error } = await signIn(targetEmail, passVal);
      if (error) setError(error);
      else onClose();
    } else {
      if (username.trim().length < 3) {
        setError('Имя пользователя должно быть не менее 3 символов');
        setLoading(false);
        return;
      }
      if (!inputVal.includes('@') || !inputVal.includes('.')) {
        setError('Пожалуйста, введите корректный Email (например, name@gmail.com)');
        setLoading(false);
        return;
      }
      const { error } = await signUp(inputVal, passVal, username.trim());
      if (error) setError(error);
      else onClose();
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(`Ошибка авторизации через Google: ${error}`);
      }
    } catch {
      setError('Не удалось подключиться к сервису Google Auth. Проверьте настройки Supabase.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deepblue-900/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-elevated overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-deepblue-700 to-deepblue-900 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-white/20 p-1.5 transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5">
              {mode === 'signin' ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}
              </h2>
              <p className="text-sm text-white/70">
                {mode === 'signin' ? t('auth.signInSub') : t('auth.signUpSub')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-sand-300 bg-white py-2.5 px-4 text-sm font-bold text-deepblue-900 transition-all hover:bg-sand-50 hover:border-sand-400 disabled:opacity-60 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-deepblue-600" />
            ) : (
              <>
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Продолжить через Google</span>
              </>
            )}
          </button>

          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-300" />
            </div>
            <span className="relative bg-white px-3 text-xs text-deepblue-400 font-medium">или по email</span>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('auth.username')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-sand-300 bg-sand-50 py-2.5 pl-10 pr-3 text-sm text-deepblue-900 outline-none transition-colors focus:border-deepblue-500 focus:bg-white"
                  placeholder="traveler2026"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-deepblue-700 mb-1">
              {mode === 'signup' ? 'Email (электронная почта)' : 'Email or Username'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
              <input
                type={mode === 'signup' ? 'email' : 'text'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-sand-300 bg-sand-50 py-2.5 pl-10 pr-3 text-sm text-deepblue-900 outline-none transition-colors focus:border-deepblue-500 focus:bg-white"
                placeholder={mode === 'signup' ? 'you@example.com' : 'you@example.com or username'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deepblue-700 mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-sand-300 bg-sand-50 py-2.5 pl-10 pr-3 text-sm text-deepblue-900 outline-none transition-colors focus:border-deepblue-500 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-bold text-white transition-all hover:bg-terracotta-600 disabled:opacity-60 shadow"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === 'signin' ? (
              <>
                <LogIn className="h-4 w-4" /> {t('auth.signInBtn')}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> {t('auth.signUpBtn')}
              </>
            )}
          </button>

          <p className="text-center text-sm text-deepblue-500">
            {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-terracotta-600 hover:text-terracotta-700"
            >
              {mode === 'signin' ? t('auth.signUpBtn') : t('auth.signInBtn')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
