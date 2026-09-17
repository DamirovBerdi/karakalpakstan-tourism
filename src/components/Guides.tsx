import { useState, useEffect } from 'react';
import { Star, Phone, MessageCircle, Languages as LangIcon, Award } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { guides as staticGuides, Guide } from '@/data/tourism';
import { supabase } from '@/lib/supabase';

export default function Guides() {
  const { t } = useLang();
  const [allGuides, setAllGuides] = useState<Guide[]>(() => {
    try {
      const cached = localStorage.getItem('kk_custom_guides');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return staticGuides;
  });

interface RawGuide {
  id?: string | number;
  name: string;
  photo: string;
  rating: number;
  reviews_count?: number;
  languages?: string[];
  specialties?: string[];
  daily_rate?: number;
  dailyRate?: number;
  phone?: string;
  whatsapp?: string;
  status?: string;
}

  useEffect(() => {
    async function fetchGuides() {
      try {
        const { data, error } = await supabase.from('guides').select('*').eq('status', 'active');
        if (!error && data && data.length > 0) {
          const mapped: Guide[] = (data as RawGuide[]).map((g) => ({
            id: typeof g.id === 'number' ? g.id : Math.abs(String(g.id).split('').reduce((a: number, b: string) => (a << 5) - a + b.charCodeAt(0), 0)),
            name: g.name,
            photo: g.photo,
            rating: g.rating,
            reviews: g.reviews_count || 1,
            languages: Array.isArray(g.languages) ? g.languages : [],
            specialties: Array.isArray(g.specialties) ? g.specialties : [],
            dailyRate: g.daily_rate || g.dailyRate || 45,
            phone: g.phone || '',
            whatsapp: g.whatsapp || '',
          }));
          setAllGuides(mapped);
          localStorage.setItem('kk_custom_guides', JSON.stringify(mapped));
          return;
        }

        const { data: cfg } = await supabase.from('admin_config').select('value').eq('key', 'custom_guides').maybeSingle();
        if (cfg?.value) {
          const parsed = JSON.parse(cfg.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped: Guide[] = (parsed as RawGuide[]).filter((g) => g.status !== 'inactive').map((g, idx: number) => ({
              id: idx + 1,
              name: g.name,
              photo: g.photo,
              rating: g.rating,
              reviews: g.reviews_count || 1,
              languages: g.languages || [],
              specialties: g.specialties || [],
              dailyRate: g.daily_rate || g.dailyRate || 45,
              phone: g.phone || '',
              whatsapp: g.whatsapp || '',
            }));
            setAllGuides(mapped);
            localStorage.setItem('kk_custom_guides', JSON.stringify(mapped));
          }
        }
      } catch {
        // Keep cached/static guides on network failure
      }
    }

    fetchGuides();

    // Listen for real-time updates from AdminDashboard in the same window/tab
    const handleGuidesUpdated = () => fetchGuides();
    window.addEventListener('kk:guides-updated', handleGuidesUpdated);
    window.addEventListener('storage', handleGuidesUpdated);

    return () => {
      window.removeEventListener('kk:guides-updated', handleGuidesUpdated);
      window.removeEventListener('storage', handleGuidesUpdated);
    };
  }, []);

  return (
    <section id="guides" className="py-20 bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900">{t('guides.title')}</h2>
          <p className="mt-3 text-deepblue-600">{t('guides.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allGuides.map((guide) => (
            <div
              key={guide.id}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-sand-200 overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-deepblue-900 shadow flex items-center gap-1">
                  <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
                  {guide.rating}
                </div>
                <div className="absolute top-3 left-3 rounded-full bg-terracotta-500/90 px-2.5 py-1 text-xs font-medium text-white shadow flex items-center gap-1">
                  <Award className="h-3 w-3" /> Licensed
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-deepblue-900">{guide.name}</h3>
                <p className="text-xs text-deepblue-500 mt-0.5">
                  {guide.reviews} {t('guides.reviews')}
                </p>

                <div className="mt-3">
                  <p className="text-xs font-medium text-deepblue-400 mb-1 flex items-center gap-1">
                    <LangIcon className="h-3 w-3" /> {t('guides.languages')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {guide.languages.map((lang) => (
                      <span key={lang} className="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-deepblue-700">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-medium text-deepblue-400 mb-1">{t('guides.specialties')}</p>
                  <div className="flex flex-wrap gap-1">
                    {guide.specialties.map((s) => (
                      <span key={s} className="rounded-md bg-terracotta-50 px-2 py-0.5 text-xs text-terracotta-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-1 border-t border-sand-100 pt-4">
                  <span className="font-display text-2xl font-bold text-terracotta-600">${guide.dailyRate}</span>
                  <span className="text-sm text-deepblue-500">{t('guides.perDay')}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={`tel:${guide.phone}`}
                    className="flex-1 rounded-lg bg-terracotta-500 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-terracotta-600 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="h-4 w-4" /> {t('guides.book')}
                  </a>
                  <a
                    href={`https://wa.me/${guide.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-deepblue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-deepblue-700 flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4" /> {t('guides.chat')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
