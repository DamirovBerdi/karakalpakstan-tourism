import { Compass, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const NAV_LINKS = [
  { key: 'nav.virtual', href: '#virtual' },
  { key: 'nav.museums', href: '#museums' },
  { key: 'nav.culture', href: '#culture' },
  { key: 'nav.cuisine', href: '#cuisine' },
  { key: 'nav.gps', href: '#gps-map' },
  { key: 'nav.around', href: '#around' },
  { key: 'nav.tracker', href: '#tracker' },
  { key: 'nav.reviews', href: '#reviews' },
  { key: 'nav.community', href: '#community' },
  { key: 'nav.contest', href: '#contest' },
  { key: 'nav.leaderboard', href: '#leaderboard' },
  { key: 'nav.minigame', href: '#minigame' },
  { key: 'nav.muslim', href: '#muslim-travel' },
  { key: 'nav.taxi', href: '#taxi' },
  { key: 'nav.guides', href: '#guides' },
  { key: 'nav.hotels', href: '#hotels' },
  { key: 'nav.transport', href: '#transport' },
  { key: 'nav.map', href: '#map' },
  { key: 'nav.essentials', href: '#essentials' },
  { key: 'nav.safety', href: '#safety' },
  { key: 'nav.budget', href: '#budget' },
  { key: 'nav.currency', href: '#currency' },
];

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-ink-900 text-white">
      <div className="ornament-muyiz-border h-8 opacity-50" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-gold-400/40">
                <Compass className="h-4 w-4 text-gold-300" />
              </span>
              <span className="font-display text-lg font-bold tracking-tightest">{t('brand.name')}</span>
            </div>
            <p className="text-sm text-white/65 leading-relaxed">{t('footer.aboutDesc')}</p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold mb-4 text-gold-300">{t('footer.quickLinks')}</h3>
            <ul className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-sm text-white/65 transition-colors hover:text-gold-300">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold mb-4 text-gold-300">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm text-white/65">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" /> 1 Takhiryk St, Nukus, Karakalpakstan
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-400" /> +998 (61) 222-33-44
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" /> info@karakalpakstan-travel.uz
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-white/50">{t('footer.follow')}:</span>
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-lg bg-white/[.08] p-2 transition-colors hover:bg-gold-400 hover:text-ink-900"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
