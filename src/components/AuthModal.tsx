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
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setError('Username must be at least 3 characters');
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
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-bold text-white transition-all hover:bg-terracotta-600 disabled:opacity-60"
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
