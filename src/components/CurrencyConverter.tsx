import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowRightLeft,
  TrendingUp,
  AlertTriangle,
  Eye,
  Lightbulb,
  Banknote,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'RUB', flag: '🇷🇺', name: 'Russian Ruble' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  { code: 'UZS', flag: '🇺🇿', name: 'Uzbek Som' },
  { code: 'KZT', flag: '🇰🇿', name: 'Kazakh Tenge' },
  { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan' },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 12650,
  EUR: 13720,
  RUB: 140,
  GBP: 16050,
  UZS: 1,
  KZT: 28,
  CNY: 1750,
};

interface Banknote {
  value: number;
  color: string;
  accentColor: string;
  frontDesign: string;
  backDesign: string;
  security: string;
}

const BANKNOTES: Banknote[] = [
  {
    value: 200000,
    color: 'from-deepblue-500 to-deepblue-700',
    accentColor: 'text-sand-300',
    frontDesign: 'Sadriddin Ayni — Tajik-Persian writer',
    backDesign: 'Registan Square, Samarkand architecture',
    security: 'Holographic stripe + watermark portrait',
  },
  {
    value: 100000,
    color: 'from-terracotta-400 to-terracotta-600',
    accentColor: 'text-sand-100',
    frontDesign: 'Mirzo Ulugbek — astronomer & mathematician',
    backDesign: 'Ulugbek Observatory, Samarkand',
    security: 'Color-shifting ink + security thread',
  },
  {
    value: 50000,
    color: 'from-sand-500 to-sand-700',
    accentColor: 'text-deepblue-900',
    frontDesign: 'Amir Temur (Tamerlane) — historical ruler',
    backDesign: 'Amir Temur monument, Tashkent',
    security: 'Watermark + microprinting + UV features',
  },
  {
    value: 20000,
    color: 'from-deepblue-400 to-deepblue-600',
    accentColor: 'text-sand-300',
    frontDesign: 'Architecture motif — historic madrasah',
    backDesign: 'Kalyan Minaret, Bukhara',
    security: 'Security thread + watermark',
  },
  {
    value: 10000,
    color: 'from-terracotta-300 to-terracotta-500',
    accentColor: 'text-white',
    frontDesign: 'Jamshid al-Kashi — mathematician',
    backDesign: 'Shah-i-Zinda complex, Samarkand',
    security: 'Watermark + latent image',
  },
  {
    value: 5000,
    color: 'from-sand-400 to-sand-600',
    accentColor: 'text-deepblue-900',
    frontDesign: 'Cotton motif — agriculture heritage',
    backDesign: 'Traditional Uzbek textile patterns',
    security: 'Watermark + security thread',
  },
  {
    value: 2000,
    color: 'from-deepblue-300 to-deepblue-500',
    accentColor: 'text-sand-200',
    frontDesign: 'Great Silk Road motif',
    backDesign: 'Camel caravan + desert landscape',
    security: 'Watermark + microprinting',
  },
];

const SCAM_TIPS = [
  'currency.scamTip1',
  'currency.scamTip2',
  'currency.scamTip3',
  'currency.scamTip4',
  'currency.scamTip5',
];

function BanknoteCard({ note, highlighted }: { note: Banknote; highlighted: boolean }) {
  const { t } = useLang();
  const [showBack, setShowBack] = useState(false);

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 ${
        highlighted ? 'scale-105 ring-4 ring-terracotta-400 shadow-elevated' : 'ring-1 ring-sand-200 shadow-sm hover:shadow-subtle'
      }`}
    >
      <div
        className={`relative aspect-[2.3/1] rounded-xl bg-gradient-to-br ${note.color} p-3 cursor-pointer overflow-hidden`}
        onClick={() => setShowBack(!showBack)}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="absolute top-2 right-2 text-xs font-bold opacity-60 text-white">UZS</div>

        {showBack ? (
          <div className="relative flex h-full flex-col justify-between p-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${note.accentColor} opacity-80`}>{t('currency.back')}</span>
              <span className={`text-lg font-display font-bold ${note.accentColor}`}>
                {note.value.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`h-12 w-20 rounded border-2 border-current ${note.accentColor} opacity-30`}
              />
            </div>
            <p className={`text-[10px] leading-tight ${note.accentColor} opacity-70`}>{note.backDesign}</p>
          </div>
        ) : (
          <div className="relative flex h-full flex-col justify-between p-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${note.accentColor} opacity-80`}>{t('currency.front')}</span>
              <span className={`text-lg font-display font-bold ${note.accentColor}`}>
                {note.value.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`h-12 w-12 rounded-full border-2 border-current ${note.accentColor} opacity-40 flex items-center justify-center`}
              >
                <span className={`text-[8px] font-bold ${note.accentColor}`}>UZB</span>
              </div>
            </div>
            <p className={`text-[10px] leading-tight ${note.accentColor} opacity-70`}>{note.frontDesign}</p>
          </div>
        )}

        <div className="absolute bottom-1 left-1 rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/80 flex items-center gap-1">
          <Eye className="h-2 w-2" /> {showBack ? t('currency.back') : t('currency.front')}
        </div>
      </div>

      {highlighted && (
        <div className="absolute -top-2 -right-2 rounded-full bg-terracotta-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-medium">
          ✓
        </div>
      )}

      <div className="mt-1.5 group relative">
        <div className="flex items-center justify-center gap-1 text-[10px] text-deepblue-500 cursor-help">
          <Info className="h-3 w-3" /> {t('currency.securityTip')}
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-40 rounded-lg bg-deepblue-900 px-2.5 py-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-medium">
          {note.security}
        </div>
      </div>
    </div>
  );
}

export default function CurrencyConverter() {
  const { t } = useLang();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('UZS');
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [uzsBreakdown, setUzsBreakdown] = useState<number | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.rates) {
        const uzsRate = data.rates.UZS;
        const newRates: Record<string, number> = { UZS: 1 };
        CURRENCIES.forEach((c) => {
          if (c.code !== 'UZS' && data.rates[c.code]) {
            newRates[c.code] = uzsRate / data.rates[c.code];
          }
        });
        setRates(newRates);
        setLastUpdated(new Date(data.time_last_update_unix * 1000));
        setUsingFallback(false);
      }
    } catch {
      setRates(FALLBACK_RATES);
      setUsingFallback(true);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convertedAmount = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const fromRate = rates[fromCurrency] ?? FALLBACK_RATES[fromCurrency] ?? 1;
    const toRate = rates[toCurrency] ?? FALLBACK_RATES[toCurrency] ?? 1;
    return (amt / fromRate) * toRate;
  }, [amount, fromCurrency, toCurrency, rates]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const breakdown = useMemo(() => {
    if (!uzsBreakdown || uzsBreakdown <= 0) return [];
    let remaining = uzsBreakdown;
    const result: { note: Banknote; count: number }[] = [];
    [...BANKNOTES]
      .sort((a, b) => b.value - a.value)
      .forEach((note) => {
        const count = Math.floor(remaining / note.value);
        if (count > 0) {
          result.push({ note, count });
          remaining -= count * note.value;
        }
      });
    return result;
  }, [uzsBreakdown]);

  const breakdownNoteValues = new Set(breakdown.map((b) => b.note.value));

  return (
    <section id="currency" className="py-20 bg-gradient-to-b from-white to-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 px-4 py-1.5 text-sm font-medium text-terracotta-600 ring-1 ring-terracotta-200 mb-3">
            <Banknote className="h-4 w-4" /> {t('nav.currency')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('currency.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('currency.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-terracotta-500" />
                <h3 className="font-display text-base font-semibold text-deepblue-900">{t('currency.converter')}</h3>
              </div>
              <button
                onClick={fetchRates}
                disabled={loading}
                className="rounded-lg p-2 text-deepblue-500 hover:bg-sand-100 transition-colors disabled:opacity-50"
                aria-label="Refresh rates"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-deepblue-500 text-center py-12">{t('currency.loading')}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-deepblue-500 mb-1.5 block">{t('currency.amount')}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-sand-200 px-4 py-3 text-lg font-semibold text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                  <div>
                    <label className="text-xs font-medium text-deepblue-500 mb-1.5 block">{t('currency.from')}</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full rounded-xl border border-sand-200 px-3 py-3 text-sm font-medium text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200 bg-white"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={swap}
                    className="rounded-xl bg-sand-100 p-3 text-deepblue-600 hover:bg-sand-200 transition-colors mb-0.5"
                    aria-label="Swap currencies"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>

                  <div>
                    <label className="text-xs font-medium text-deepblue-500 mb-1.5 block">{t('currency.to')}</label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full rounded-xl border border-sand-200 px-3 py-3 text-sm font-medium text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200 bg-white"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-deepblue-700 to-deepblue-900 p-5 text-white">
                  <p className="text-xs text-sand-300 mb-1">{t('currency.converted')}</p>
                  <p className="font-display text-3xl font-bold">
                    {convertedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}{' '}
                    <span className="text-lg text-sand-300">{toCurrency}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/70">
                      {t('currency.rateLabel')}: 1 {fromCurrency} ={' '}
                      {((rates[fromCurrency] ?? 1) > 0
                        ? (rates[toCurrency] ?? 1) / (rates[fromCurrency] ?? 1)
                        : 0
                      ).toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
                      {toCurrency}
                    </span>
                    {lastUpdated && (
                      <span className="text-white/50">
                        {t('currency.lastUpdated')}: {lastUpdated.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {usingFallback && (
                  <div className="rounded-lg bg-sand-100 p-3 text-xs text-sand-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {t('currency.fallbackRates')}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-terracotta-500" />
              <h3 className="font-display text-base font-semibold text-deepblue-900">
                {t('currency.banknoteSuggestion')}
              </h3>
            </div>
            <p className="text-xs text-deepblue-500 mb-4">{t('currency.banknoteSuggestionDesc')}</p>

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                placeholder="Amount in UZS"
                value={uzsBreakdown ?? ''}
                onChange={(e) => setUzsBreakdown(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 rounded-xl border border-sand-200 px-4 py-2.5 text-sm font-medium text-deepblue-900 focus:border-terracotta-400 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
              />
              {toCurrency === 'UZS' && (
                <button
                  onClick={() => setUzsBreakdown(Math.round(convertedAmount))}
                  className="rounded-xl bg-deepblue-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-deepblue-700 transition-colors whitespace-nowrap"
                >
                  {t('currency.suggestBanknotes')}
                </button>
              )}
            </div>

            {breakdown.length === 0 ? (
              <div className="text-center py-8">
                <Banknote className="h-10 w-10 text-sand-300 mx-auto mb-2" />
                <p className="text-sm text-deepblue-400">{t('currency.noSuggestion')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {breakdown.map(({ note, count }) => (
                  <div
                    key={note.value}
                    className="flex items-center justify-between rounded-xl bg-sand-50 p-3 ring-1 ring-sand-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg bg-gradient-to-br ${note.color} px-3 py-1.5`}>
                        <span className={`text-sm font-display font-bold ${note.accentColor}`}>
                          {note.value.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-deepblue-600">UZS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-terracotta-50 px-2.5 py-1 text-sm font-bold text-terracotta-600">
                        × {count}
                      </span>
                      <span className="text-sm font-semibold text-deepblue-900">
                        = {(note.value * count).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl bg-deepblue-50 p-3 text-center">
                  <p className="text-xs text-deepblue-500">Total</p>
                  <p className="font-display text-xl font-bold text-deepblue-900">
                    {uzsBreakdown?.toLocaleString()} UZS
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-sand-200 p-6 shadow-sm mb-12">
          <div className="flex items-center gap-2 mb-1">
            <Banknote className="h-5 w-5 text-deepblue-600" />
            <h3 className="font-display text-lg font-semibold text-deepblue-900">{t('currency.banknoteGuide')}</h3>
          </div>
          <p className="text-sm text-deepblue-500 mb-6">{t('currency.banknoteGuideDesc')}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BANKNOTES.map((note) => (
              <BanknoteCard key={note.value} note={note} highlighted={breakdownNoteValues.has(note.value)} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-800 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-display text-xl font-bold">{t('currency.scamTitle')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCAM_TIPS.map((tipKey, i) => (
              <div key={tipKey} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed">{t(tipKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
