import { useState } from 'react';
import {
  Plane,
  Check,
  X,
  Loader2,
  Globe,
  FileText,
  CreditCard,
  Mail,
  Clock,
  DollarSign,
  Calendar,
  ExternalLink,
  Search,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { supabase } from '@/lib/supabase';

type VisaStatus = 'visa_free' | 'e_visa' | 'visa_on_arrival';

interface CountryRule {
  code: string;
  status: VisaStatus;
  days?: string;
}

const COUNTRY_RULES: CountryRule[] = [
  { code: 'US', status: 'e_visa' },
  { code: 'GB', status: 'e_visa' },
  { code: 'DE', status: 'visa_free', days: '90 days' },
  { code: 'FR', status: 'visa_free', days: '90 days' },
  { code: 'IT', status: 'visa_free', days: '90 days' },
  { code: 'ES', status: 'visa_free', days: '90 days' },
  { code: 'NL', status: 'visa_free', days: '90 days' },
  { code: 'BE', status: 'visa_free', days: '90 days' },
  { code: 'PL', status: 'visa_free', days: '90 days' },
  { code: 'CN', status: 'visa_free', days: '30 days' },
  { code: 'JP', status: 'visa_free', days: '90 days' },
  { code: 'KR', status: 'visa_free', days: '60 days' },
  { code: 'MY', status: 'visa_free', days: '90 days' },
  { code: 'SG', status: 'visa_free', days: '90 days' },
  { code: 'TR', status: 'visa_free', days: '90 days' },
  { code: 'BR', status: 'visa_free', days: '90 days' },
  { code: 'AR', status: 'visa_free', days: '90 days' },
  { code: 'IL', status: 'visa_free', days: '90 days' },
  { code: 'IN', status: 'e_visa' },
  { code: 'PK', status: 'e_visa' },
  { code: 'BD', status: 'e_visa' },
  { code: 'ID', status: 'e_visa' },
  { code: 'PH', status: 'e_visa' },
  { code: 'TH', status: 'visa_free', days: '90 days' },
  { code: 'AE', status: 'visa_free', days: '90 days' },
  { code: 'SA', status: 'visa_free', days: '90 days' },
  { code: 'QA', status: 'visa_free', days: '90 days' },
  { code: 'KW', status: 'visa_free', days: '90 days' },
  { code: 'EG', status: 'e_visa' },
  { code: 'ZA', status: 'e_visa' },
  { code: 'NG', status: 'e_visa' },
  { code: 'KE', status: 'e_visa' },
  { code: 'CA', status: 'e_visa' },
  { code: 'AU', status: 'e_visa' },
  { code: 'NZ', status: 'e_visa' },
  { code: 'RU', status: 'visa_free', days: '90 days' },
  { code: 'UA', status: 'visa_free', days: '90 days' },
  { code: 'KZ', status: 'visa_free', days: '90 days' },
  { code: 'KG', status: 'visa_free', days: '90 days' },
  { code: 'TJ', status: 'visa_free', days: '90 days' },
  { code: 'TM', status: 'visa_free', days: '90 days' },
  { code: 'AZ', status: 'visa_free', days: '90 days' },
  { code: 'AM', status: 'visa_free', days: '90 days' },
  { code: 'BY', status: 'visa_free', days: '90 days' },
  { code: 'MD', status: 'visa_free', days: '90 days' },
  { code: 'GE', status: 'visa_free', days: '90 days' },
  { code: 'RO', status: 'visa_free', days: '90 days' },
  { code: 'BG', status: 'visa_free', days: '90 days' },
  { code: 'HR', status: 'visa_free', days: '90 days' },
  { code: 'CZ', status: 'visa_free', days: '90 days' },
  { code: 'HU', status: 'visa_free', days: '90 days' },
  { code: 'SK', status: 'visa_free', days: '90 days' },
  { code: 'SI', status: 'visa_free', days: '90 days' },
  { code: 'LT', status: 'visa_free', days: '90 days' },
  { code: 'LV', status: 'visa_free', days: '90 days' },
  { code: 'EE', status: 'visa_free', days: '90 days' },
  { code: 'PT', status: 'visa_free', days: '90 days' },
  { code: 'GR', status: 'visa_free', days: '90 days' },
  { code: 'IE', status: 'visa_free', days: '90 days' },
  { code: 'AT', status: 'visa_free', days: '90 days' },
  { code: 'CH', status: 'visa_free', days: '90 days' },
  { code: 'SE', status: 'visa_free', days: '90 days' },
  { code: 'NO', status: 'visa_free', days: '90 days' },
  { code: 'DK', status: 'visa_free', days: '90 days' },
  { code: 'FI', status: 'visa_free', days: '90 days' },
  { code: 'IS', status: 'visa_free', days: '90 days' },
  { code: 'LU', status: 'visa_free', days: '90 days' },
  { code: 'MT', status: 'visa_free', days: '90 days' },
  { code: 'CY', status: 'visa_free', days: '90 days' },
  { code: 'MX', status: 'e_visa' },
  { code: 'CO', status: 'e_visa' },
  { code: 'CL', status: 'e_visa' },
  { code: 'PE', status: 'e_visa' },
  { code: 'VN', status: 'e_visa' },
  { code: 'LK', status: 'e_visa' },
  { code: 'IR', status: 'e_visa' },
  { code: 'AF', status: 'e_visa' },
  { code: 'IQ', status: 'e_visa' },
  { code: 'Other', status: 'e_visa' },
];

const COUNTRY_NAMES: Record<string, { en: string; ru: string; uz: string; kaa: string }> = {
  US: { en: 'United States', ru: 'США', uz: 'AQSh', kaa: 'AQSh' },
  GB: { en: 'United Kingdom', ru: 'Великобритания', uz: 'Birlashgan Qirollik', kaa: 'Birlengen Patshalıq' },
  DE: { en: 'Germany', ru: 'Германия', uz: 'Germaniya', kaa: 'Germaniya' },
  FR: { en: 'France', ru: 'Франция', uz: 'Fransiya', kaa: 'Franciya' },
  IT: { en: 'Italy', ru: 'Италия', uz: 'Italiya', kaa: 'Italiya' },
  ES: { en: 'Spain', ru: 'Испания', uz: 'Ispaniya', kaa: 'Ispaniya' },
  NL: { en: 'Netherlands', ru: 'Нидерланды', uz: 'Niderlandiya', kaa: 'Niderlandiya' },
  BE: { en: 'Belgium', ru: 'Бельгия', uz: 'Belgiya', kaa: 'Belgiya' },
  PL: { en: 'Poland', ru: 'Польша', uz: 'Polsha', kaa: 'Polsha' },
  CN: { en: 'China', ru: 'Китай', uz: 'Xitoy', kaa: 'Qıtay' },
  JP: { en: 'Japan', ru: 'Япония', uz: 'Yaponiya', kaa: 'Yaponiya' },
  KR: { en: 'South Korea', ru: 'Южная Корея', uz: 'Janubiy Koreya', kaa: 'Qubla Koreya' },
  MY: { en: 'Malaysia', ru: 'Малайзия', uz: 'Malayziya', kaa: 'Malayziya' },
  SG: { en: 'Singapore', ru: 'Сингапур', uz: 'Singapur', kaa: 'Singapur' },
  TR: { en: 'Turkey', ru: 'Турция', uz: 'Turkiya', kaa: 'Turkiya' },
  BR: { en: 'Brazil', ru: 'Бразилия', uz: 'Braziliya', kaa: 'Braziliya' },
  AR: { en: 'Argentina', ru: 'Аргентина', uz: 'Argentina', kaa: 'Argentina' },
  IL: { en: 'Israel', ru: 'Израиль', uz: 'Isroil', kaa: 'Izrail' },
  IN: { en: 'India', ru: 'Индия', uz: 'Hindiston', kaa: 'Hindstan' },
  PK: { en: 'Pakistan', ru: 'Пакистан', uz: 'Pokiston', kaa: 'Pokistan' },
  BD: { en: 'Bangladesh', ru: 'Бангладеш', uz: 'Bangladesh', kaa: 'Bangladesh' },
  ID: { en: 'Indonesia', ru: 'Индонезия', uz: 'Indoneziya', kaa: 'Indoneziya' },
  PH: { en: 'Philippines', ru: 'Филиппины', uz: 'Filippin', kaa: 'Filippin' },
  TH: { en: 'Thailand', ru: 'Таиланд', uz: 'Tailand', kaa: 'Tailand' },
  AE: { en: 'UAE', ru: 'ОАЭ', uz: 'BAA', kaa: 'BAA' },
  SA: { en: 'Saudi Arabia', ru: 'Саудовская Аравия', uz: 'Saudiya Arabistoni', kaa: 'Saudiya Arabistanı' },
  QA: { en: 'Qatar', ru: 'Катар', uz: 'Qatar', kaa: 'Qatar' },
  KW: { en: 'Kuwait', ru: 'Кувейт', uz: 'Kuvayt', kaa: 'Kuvayt' },
  EG: { en: 'Egypt', ru: 'Египет', uz: 'Misr', kaa: 'Misr' },
  ZA: { en: 'South Africa', ru: 'ЮАР', uz: 'JAR', kaa: 'QAR' },
  NG: { en: 'Nigeria', ru: 'Нигерия', uz: 'Nigeriya', kaa: 'Nigeriya' },
  KE: { en: 'Kenya', ru: 'Кения', uz: 'Keniya', kaa: 'Keniya' },
  CA: { en: 'Canada', ru: 'Канада', uz: 'Kanada', kaa: 'Kanada' },
  AU: { en: 'Australia', ru: 'Австралия', uz: 'Avstraliya', kaa: 'Avstraliya' },
  NZ: { en: 'New Zealand', ru: 'Новая Зеландия', uz: 'Yangi Zelandiya', kaa: 'Jañı Zelandiya' },
  RU: { en: 'Russia', ru: 'Россия', uz: 'Rossiya', kaa: 'Rossiya' },
  UA: { en: 'Ukraine', ru: 'Украина', uz: 'Ukraina', kaa: 'Ukraina' },
  KZ: { en: 'Kazakhstan', ru: 'Казахстан', uz: 'Qozog\'iston', kaa: 'Qazaqstan' },
  KG: { en: 'Kyrgyzstan', ru: 'Кыргызстан', uz: 'Qirg\'iziston', kaa: 'Qırǵızstan' },
  TJ: { en: 'Tajikistan', ru: 'Таджикистан', uz: 'Tojikiston', kaa: 'Tajikstan' },
  TM: { en: 'Turkmenistan', ru: 'Туркменистан', uz: 'Turkmaniston', kaa: 'Turkmenstan' },
  AZ: { en: 'Azerbaijan', ru: 'Азербайджан', uz: 'Ozarbayjon', kaa: 'Azerbayjan' },
  AM: { en: 'Armenia', ru: 'Армения', uz: 'Armaniston', kaa: 'Armanstan' },
  BY: { en: 'Belarus', ru: 'Беларусь', uz: 'Belarus', kaa: 'Belarus' },
  MD: { en: 'Moldova', ru: 'Молдова', uz: 'Moldova', kaa: 'Moldova' },
  GE: { en: 'Georgia', ru: 'Грузия', uz: 'Gruziya', kaa: 'Gruziya' },
  RO: { en: 'Romania', ru: 'Румыния', uz: 'Ruminiya', kaa: 'Ruminiya' },
  BG: { en: 'Bulgaria', ru: 'Болгария', uz: 'Bolgariya', kaa: 'Bolgariya' },
  HR: { en: 'Croatia', ru: 'Хорватия', uz: 'Xorvatiya', kaa: 'Xorvatiya' },
  CZ: { en: 'Czech Republic', ru: 'Чехия', uz: 'Chexiya', kaa: 'Chexiya' },
  HU: { en: 'Hungary', ru: 'Венгрия', uz: 'Vengriya', kaa: 'Vengriya' },
  SK: { en: 'Slovakia', ru: 'Словакия', uz: 'Slovakiya', kaa: 'Slovakiya' },
  SI: { en: 'Slovenia', ru: 'Словения', uz: 'Sloveniya', kaa: 'Sloveniya' },
  LT: { en: 'Lithuania', ru: 'Литва', uz: 'Litva', kaa: 'Litva' },
  LV: { en: 'Latvia', ru: 'Латвия', uz: 'Latviya', kaa: 'Latviya' },
  EE: { en: 'Estonia', ru: 'Эстония', uz: 'Estoniya', kaa: 'Estoniya' },
  PT: { en: 'Portugal', ru: 'Португалия', uz: 'Portugaliya', kaa: 'Portugaliya' },
  GR: { en: 'Greece', ru: 'Греция', uz: 'Yunoniston', kaa: 'Greciya' },
  IE: { en: 'Ireland', ru: 'Ирландия', uz: 'Irlandiya', kaa: 'Irlandiya' },
  AT: { en: 'Austria', ru: 'Австрия', uz: 'Avstriya', kaa: 'Avstriya' },
  CH: { en: 'Switzerland', ru: 'Швейцария', uz: 'Shveysariya', kaa: 'Shveysariya' },
  SE: { en: 'Sweden', ru: 'Швеция', uz: 'Shvetsiya', kaa: 'Shveciya' },
  NO: { en: 'Norway', ru: 'Норвегия', uz: 'Norvegiya', kaa: 'Norvegiya' },
  DK: { en: 'Denmark', ru: 'Дания', uz: 'Daniya', kaa: 'Daniya' },
  FI: { en: 'Finland', ru: 'Финляндия', uz: 'Finlandiya', kaa: 'Finlandiya' },
  IS: { en: 'Iceland', ru: 'Исландия', uz: 'Islandiya', kaa: 'Islandiya' },
  LU: { en: 'Luxembourg', ru: 'Люксембург', uz: 'Lyuksemburg', kaa: 'Lyuksemburg' },
  MT: { en: 'Malta', ru: 'Мальта', uz: 'Malta', kaa: 'Malta' },
  CY: { en: 'Cyprus', ru: 'Кипр', uz: 'Kipr', kaa: 'Kipr' },
  MX: { en: 'Mexico', ru: 'Мексика', uz: 'Meksika', kaa: 'Meksika' },
  CO: { en: 'Colombia', ru: 'Колумбия', uz: 'Kolumbiya', kaa: 'Kolumbiya' },
  CL: { en: 'Chile', ru: 'Чили', uz: 'Chili', kaa: 'Chili' },
  PE: { en: 'Peru', ru: 'Перу', uz: 'Peru', kaa: 'Peru' },
  VN: { en: 'Vietnam', ru: 'Вьетнам', uz: 'Vyetnam', kaa: 'Vyetnam' },
  LK: { en: 'Sri Lanka', ru: 'Шри-Ланка', uz: 'Shri-Lanka', kaa: 'Shri-Lanka' },
  IR: { en: 'Iran', ru: 'Иран', uz: 'Eron', kaa: 'Iran' },
  AF: { en: 'Afghanistan', ru: 'Афганистан', uz: 'Afg\'oniston', kaa: 'Afganstan' },
  IQ: { en: 'Iraq', ru: 'Ирак', uz: 'Iroq', kaa: 'Iraq' },
  Other: { en: 'Other / Not listed', ru: 'Другая / Нет в списке', uz: 'Boshqa / Ro\'yxatda yo\'q', kaa: 'Basqa / Dizimde joq' },
};

const VISA_TYPES = [
  { value: 'tourist', key: 'visa.tourist' },
  { value: 'business', key: 'visa.business' },
  { value: 'transit', key: 'visa.transit' },
];

export default function VisaAssistance() {
  const { lang, t } = useLang();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [eligibility, setEligibility] = useState<VisaStatus | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [statusEmail, setStatusEmail] = useState('');
  const [statusResult, setStatusResult] = useState<{ status: string; fullName: string } | null>(null);
  const [statusSearching, setStatusSearching] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    nationality: '',
    passport_number: '',
    email: '',
    phone: '',
    arrival_date: '',
    departure_date: '',
    visa_type: 'tourist',
    purpose: '',
  });

  const handleCheck = () => {
    if (!selectedCountry) return;
    const rule = COUNTRY_RULES.find((r) => r.code === selectedCountry);
    if (rule) setEligibility(rule.status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const { error: insertError } = await supabase.from('visa_applications').insert({
        full_name: form.full_name,
        nationality: form.nationality,
        passport_number: form.passport_number,
        email: form.email,
        phone: form.phone,
        arrival_date: form.arrival_date,
        departure_date: form.departure_date,
        visa_type: form.visa_type,
        purpose: form.purpose || null,
        status: 'pending',
      });
      if (insertError) throw insertError;
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusEmail) return;
    setStatusSearching(true);
    setStatusError(false);
    setStatusResult(null);
    try {
      const { data, error: queryError } = await supabase
        .from('visa_applications')
        .select('status, full_name')
        .eq('email', statusEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (queryError) throw queryError;
      if (data) {
        setStatusResult({ status: data.status, fullName: data.full_name });
      } else {
        setStatusError(true);
      }
    } catch {
      setStatusError(true);
    } finally {
      setStatusSearching(false);
    }
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: t('visa.statusPending'),
      submitted: t('visa.statusSubmitted'),
      approved: t('visa.statusApproved'),
      rejected: t('visa.statusRejected'),
    };
    return map[status] || status;
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      submitted: 'bg-deepblue-100 text-deepblue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-sand-100 text-deepblue-700';
  };

  return (
    <section id="visa" className="py-12 sm:py-16 bg-gradient-to-b from-deepblue-50 to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('visa.assistedTitle')}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900 mb-2">
            {t('visa.title')}
          </h2>
          <p className="text-deepblue-500 text-sm sm:text-base max-w-2xl mx-auto">{t('visa.subtitle')}</p>
        </div>

        {/* Eligibility Checker */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-subtle ring-1 ring-sand-200 mb-6">
          <h3 className="font-display text-lg font-bold text-deepblue-800 mb-1">{t('visa.eligibilityTitle')}</h3>
          <p className="text-sm text-deepblue-500 mb-4">{t('visa.whoNeedsDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setEligibility(null);
              }}
              className="input-base flex-1"
            >
              <option value="">{t('visa.selectCountry')}</option>
              {COUNTRY_RULES.map((rule) => (
                <option key={rule.code} value={rule.code}>
                  {getText(COUNTRY_NAMES[rule.code], lang) || rule.code}
                </option>
              ))}
            </select>
            <button
              onClick={handleCheck}
              disabled={!selectedCountry}
              className="flex items-center justify-center gap-2 rounded-xl bg-deepblue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-800 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {t('visa.check')}
            </button>
          </div>

          {eligibility && (
            <div className="mt-4 animate-fade-up">
              {eligibility === 'visa_free' && (
                <ResultCard
                  color="green"
                  icon={<Check className="h-6 w-6" />}
                  title={t('visa.visaFree')}
                  desc={t('visa.visaFreeDesc')}
                  onAction={() => setEligibility(null)}
                  actionLabel={t('visa.checkAnother')}
                />
              )}
              {eligibility === 'e_visa' && (
                <ResultCard
                  color="terracotta"
                  icon={<FileText className="h-6 w-6" />}
                  title={t('visa.eVisaRequired')}
                  desc={t('visa.eVisaRequiredDesc')}
                  onAction={() => setShowForm(true)}
                  actionLabel={t('visa.applyTitle')}
                  secondaryAction={() => setEligibility(null)}
                  secondaryLabel={t('visa.checkAnother')}
                />
              )}
              {eligibility === 'visa_on_arrival' && (
                <ResultCard
                  color="deepblue"
                  icon={<Plane className="h-6 w-6" />}
                  title={t('visa.visaOnArrival')}
                  desc={t('visa.visaOnArrivalDesc')}
                  onAction={() => setEligibility(null)}
                  actionLabel={t('visa.checkAnother')}
                />
              )}
            </div>
          )}
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <InfoCard icon={<Clock className="h-5 w-5" />} label={t('visa.processingTime')} value={t('visa.days3to5')} />
          <InfoCard icon={<DollarSign className="h-5 w-5" />} label={t('visa.fee')} value={t('visa.usd20')} />
          <InfoCard icon={<Calendar className="h-5 w-5" />} label={t('visa.validity')} value={t('visa.days90')} />
        </div>

        {/* Step Guide */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-subtle ring-1 ring-sand-200 mb-6">
          <h3 className="font-display text-lg font-bold text-deepblue-800 mb-4">{t('visa.guideTitle')}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard step="1" icon={<FileText className="h-5 w-5" />} title={t('visa.step1')} desc={t('visa.step1Desc')} />
            <StepCard step="2" icon={<Globe className="h-5 w-5" />} title={t('visa.step2')} desc={t('visa.step2Desc')} />
            <StepCard step="3" icon={<CreditCard className="h-5 w-5" />} title={t('visa.step3')} desc={t('visa.step3Desc')} />
            <StepCard step="4" icon={<Mail className="h-5 w-5" />} title={t('visa.step4')} desc={t('visa.step4Desc')} />
          </div>
        </div>

        {/* Assisted Service + Apply Button */}
        <div className="rounded-2xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 p-5 sm:p-6 text-white shadow-medium mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold mb-1">{t('visa.assistedTitle')}</h3>
              <p className="text-sm text-white/90 max-w-md">{t('visa.assistedDesc')}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-terracotta-600 shadow-subtle transition-all hover:shadow-medium whitespace-nowrap"
            >
              <FileText className="h-4 w-4" />
              {t('visa.applyTitle')}
            </button>
          </div>
        </div>

        {/* Status Checker */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-subtle ring-1 ring-sand-200">
          <h3 className="font-display text-lg font-bold text-deepblue-800 mb-3">{t('visa.checkStatus')}</h3>
          <form onSubmit={handleStatusCheck} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={statusEmail}
              onChange={(e) => setStatusEmail(e.target.value)}
              placeholder={t('visa.enterEmail')}
              className="input-base flex-1"
            />
            <button
              type="submit"
              disabled={statusSearching}
              className="flex items-center justify-center gap-2 rounded-xl bg-deepblue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-800 disabled:opacity-50"
            >
              {statusSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {t('visa.checkStatus')}
            </button>
          </form>
          {statusResult && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-sand-50 p-4 ring-1 ring-sand-200 animate-fade-up">
              <div className="rounded-full bg-deepblue-100 p-2">
                <Info className="h-5 w-5 text-deepblue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-deepblue-800">{statusResult.fullName}</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1 ${statusColor(statusResult.status)}`}>
                  {statusLabel(statusResult.status)}
                </span>
              </div>
            </div>
          )}
          {statusError && (
            <p className="mt-3 text-sm text-red-600">{t('visa.noApplication')}</p>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deepblue-900/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-elevated animate-fade-up">
            {success ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-deepblue-800 mb-2">{t('visa.success')}</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSuccess(false);
                    setForm({ full_name: '', nationality: '', passport_number: '', email: '', phone: '', arrival_date: '', departure_date: '', visa_type: 'tourist', purpose: '' });
                  }}
                  className="mt-4 rounded-xl bg-deepblue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-800"
                >
                  {t('visa.close')}
                </button>
              </div>
            ) : (
              <>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand-200 bg-white px-5 py-4 rounded-t-2xl">
                  <div>
                    <h3 className="font-display text-lg font-bold text-deepblue-800">{t('visa.applyTitle')}</h3>
                    <p className="text-xs text-deepblue-500">{t('visa.applyDesc')}</p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 hover:text-deepblue-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-3">
                  <FormField label={t('visa.fullName')} required>
                    <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="input-base" />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={t('visa.nationality')} required>
                      <input type="text" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} required className="input-base" />
                    </FormField>
                    <FormField label={t('visa.passport')} required>
                      <input type="text" value={form.passport_number} onChange={(e) => setForm({ ...form, passport_number: e.target.value })} required className="input-base" />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={t('visa.email')} required>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-base" />
                    </FormField>
                    <FormField label={t('visa.phone')} required>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input-base" />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={t('visa.arrival')} required>
                      <input type="date" value={form.arrival_date} onChange={(e) => setForm({ ...form, arrival_date: e.target.value })} required className="input-base" />
                    </FormField>
                    <FormField label={t('visa.departure')} required>
                      <input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} required className="input-base" />
                    </FormField>
                  </div>
                  <FormField label={t('visa.visaType')} required>
                    <select value={form.visa_type} onChange={(e) => setForm({ ...form, visa_type: e.target.value })} className="input-base">
                      {VISA_TYPES.map((vt) => (
                        <option key={vt.value} value={vt.value}>{t(vt.key)}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label={t('visa.purpose')}>
                    <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder={t('visa.purposePlaceholder')} rows={2} className="input-base resize-none" />
                  </FormField>
                  {error && <p className="text-sm text-red-600">{t('visa.error')}</p>}
                  <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50">
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />{t('visa.submitting')}</> : <><FileText className="h-4 w-4" />{t('visa.submit')}</>}
                  </button>
                  <a href="https://e-visa.gov.uz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-xs text-deepblue-500 hover:text-deepblue-700 transition-colors">
                    <ExternalLink className="h-3 w-3" />
                    {t('visa.officialLink')}
                  </a>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ResultCard({
  color,
  icon,
  title,
  desc,
  onAction,
  actionLabel,
  secondaryAction,
  secondaryLabel,
}: {
  color: 'green' | 'terracotta' | 'deepblue';
  icon: React.ReactNode;
  title: string;
  desc: string;
  onAction: () => void;
  actionLabel: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}) {
  const colors = {
    green: 'bg-green-50 ring-green-200 text-green-700',
    terracotta: 'bg-terracotta-50 ring-terracotta-200 text-terracotta-700',
    deepblue: 'bg-deepblue-50 ring-deepblue-200 text-deepblue-700',
  };
  const btnColors = {
    green: 'bg-green-600 hover:bg-green-700',
    terracotta: 'bg-terracotta-500 hover:bg-terracotta-600',
    deepblue: 'bg-deepblue-700 hover:bg-deepblue-800',
  };
  return (
    <div className={`rounded-xl p-4 ring-1 ${colors[color]} animate-fade-up`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2 shadow-sm">{icon}</div>
        <div className="flex-1">
          <p className="font-display font-bold text-sm">{title}</p>
          <p className="text-xs mt-1 opacity-90">{desc}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={onAction} className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${btnColors[color]}`}>
              {actionLabel}
            </button>
            {secondaryAction && (
              <button onClick={secondaryAction} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-deepblue-600 ring-1 ring-sand-200 hover:bg-sand-50 transition-colors">
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-sand-200">
      <div className="rounded-full bg-terracotta-100 p-2 text-terracotta-600">{icon}</div>
      <div>
        <p className="text-xs text-deepblue-400">{label}</p>
        <p className="font-display font-bold text-sm text-deepblue-800">{value}</p>
      </div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: { step: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-sand-50 p-4 ring-1 ring-sand-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deepblue-700 text-xs font-bold text-white">{step}</span>
        <span className="text-terracotta-500">{icon}</span>
      </div>
      <p className="font-semibold text-xs text-deepblue-800 mb-1">{title}</p>
      <p className="text-xs text-deepblue-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-deepblue-700">
        {label} {required && <span className="text-terracotta-500">*</span>}
      </label>
      {children}
    </div>
  );
}
