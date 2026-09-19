import { useState, useRef, useCallback } from 'react';
import { QrCode, ScanLine, Award, Loader2, CheckCircle2, X, Camera, MapPin, Zap } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  place_name: string;
  icon: string;
  points: number;
  image: string;
}

export default function QrCheckin() {
  const { t } = useLang();
  const { user } = useAuth();
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; badge?: Badge; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = useCallback(async (code: string) => {
    if (!user || !code.trim()) return;
    setSubmitting(true);
    setResult(null);

    const cleanCode = code.trim().toUpperCase();
    const { error: claimError } = await supabase.rpc('claim_qr_badge', {
      p_qr_code: cleanCode,
    });

    if (claimError) {
      const errMsg = claimError.message || '';
      if (errMsg.includes('already earned')) {
        const { data: badge } = await supabase
          .from('badges')
          .select('*')
          .eq('code', cleanCode)
          .maybeSingle();
        setResult({ success: false, badge: (badge as Badge) ?? undefined, message: t('qr.alreadyEarned') });
      } else {
        setResult({ success: false, message: t('qr.invalidCode') });
      }
      setSubmitting(false);
      return;
    }

    const { data: badge } = await supabase
      .from('badges')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    setResult({ success: true, badge: (badge as Badge) ?? undefined, message: t('qr.success') });
    setSubmitting(false);
  }, [user, t]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualCode);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simple approach: user enters code manually after scanning image
    // Real QR scanning would require a library, but we support manual entry
    setManualCode('');
    alert(t('qr.manualHint'));
  };

  return (
    <section id="qr-checkin" className="py-16 sm:py-20 bg-gradient-to-b from-deepblue-50 to-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold text-terracotta-700 mb-3">
            <ScanLine className="h-3.5 w-3.5" /> QR Check-in
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('qr.title')}</h2>
          <p className="mx-auto max-w-2xl text-base text-deepblue-600">{t('qr.subtitle')}</p>
        </div>

        {!user ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-sand-200">
            <QrCode className="mx-auto h-12 w-12 text-deepblue-300 mb-3" />
            <p className="text-deepblue-600">{t('qr.loginRequired')}</p>
          </div>
        ) : (
          <>
            {/* Scanner area */}
            <div className="rounded-2xl bg-white p-6 shadow-subtle ring-1 ring-sand-200 mb-6">
              {/* Visual scanner mock */}
              <div className="relative mx-auto mb-6 h-48 w-full max-w-xs rounded-xl bg-deepblue-900/95 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-4 rounded-lg border-2 border-terracotta-400/60" />
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-terracotta-400 animate-scan" style={{ animation: 'scanMove 2s ease-in-out infinite' }} />
                <QrCode className="h-20 w-20 text-white/30" />
                <style>{`@keyframes scanMove{0%,100%{transform:translateY(0)}50%{transform:translateY(180px)}}`}</style>
              </div>

              <p className="text-center text-sm text-deepblue-500 mb-4">{t('qr.instructions')}</p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-deepblue-700"
                >
                  <Camera className="h-4 w-4" /> {t('qr.scanPhoto')}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-sand-200" />
                <span className="text-xs text-deepblue-400">{t('qr.or')}</span>
                <div className="h-px flex-1 bg-sand-200" />
              </div>

              {/* Manual code entry */}
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="KTK-SAVITSKY-2026"
                  className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 outline-none focus:border-deepblue-500 focus:bg-white font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting || !manualCode.trim()}
                  className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  {t('qr.submit')}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className={`rounded-2xl p-5 shadow-subtle ring-1 transition-all ${
                result.success
                  ? 'bg-green-50 ring-green-200'
                  : result.badge
                    ? 'bg-amber-50 ring-amber-200'
                    : 'bg-red-50 ring-red-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl flex-shrink-0 ${
                    result.success ? 'bg-green-500' : result.badge ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    {result.success ? (
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    ) : (
                      <X className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${result.success ? 'text-green-800' : result.badge ? 'text-amber-800' : 'text-red-800'}`}>
                      {result.message}
                    </p>
                    {result.badge && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-terracotta-500" />
                          <span className="font-bold text-deepblue-900">{result.badge.name}</span>
                        </div>
                        <p className="text-sm text-deepblue-600 mt-1">{result.badge.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-100 px-2.5 py-0.5 text-xs font-bold text-terracotta-700">
                            <Zap className="h-3 w-3" /> +{result.badge.points} {t('qr.points')}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-deepblue-500">
                            <MapPin className="h-3 w-3" /> {result.badge.place_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
