import { useState, useEffect, useRef } from 'react';
import { Menu, X, Compass, ChevronDown, LogIn, LogOut, User as UserIcon, Layers } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/AuthContext';

const TOP_LINKS = [
  { key: 'nav.tours', href: '#tours' },
  { key: 'nav.virtual', href: '#virtual' },
  { key: 'nav.aral', href: '#aral' },
  { key: 'nav.hotels', href: '#hotels' },
  { key: 'nav.taxi', href: '#taxi' },
  { key: 'nav.budget', href: '#budget' },
];

const CATEGORIZED_NAV = [
  {
    icon: '🏛',
    titleKey: 'nav.catHeritage',
    links: [
      { key: 'nav.virtual', href: '#virtual' },
      { key: 'nav.museums', href: '#museums' },
      { key: 'nav.culture', href: '#culture' },
      { key: 'nav.cuisine', href: '#cuisine' },
      { key: 'nav.aral', href: '#aral' },
    ],
  },
  {
    icon: '🗺',
    titleKey: 'nav.catTours',
    links: [
      { key: 'nav.tours', href: '#tours' },
      { key: 'nav.buddy', href: '#buddy' },
      { key: 'nav.guides', href: '#guides' },
      { key: 'nav.hotels', href: '#hotels' },
      { key: 'nav.flights', href: '#flights' },
      { key: 'nav.visa', href: '#visa' },
    ],
  },
  {
    icon: '🚕',
    titleKey: 'nav.catServices',
    links: [
      { key: 'nav.gps', href: '#gps-map' },
      { key: 'nav.around', href: '#around' },
      { key: 'nav.tracker', href: '#tracker' },
      { key: 'nav.map', href: '#map' },
      { key: 'nav.transport', href: '#transport' },
      { key: 'nav.taxi', href: '#taxi' },
    ],
  },
  {
    icon: '🏆',
    titleKey: 'nav.catCommunity',
    links: [
      { key: 'nav.reviews', href: '#reviews' },
      { key: 'nav.community', href: '#community' },
      { key: 'nav.qr', href: '#qr-checkin' },
      { key: 'nav.contest', href: '#contest' },
      { key: 'nav.leaderboard', href: '#leaderboard' },
      { key: 'nav.minigame', href: '#minigame' },
      { key: 'nav.muslim', href: '#muslim-travel' },
    ],
  },
  {
    icon: '🧰',
    titleKey: 'nav.catTools',
    links: [
      { key: 'nav.essentials', href: '#essentials' },
      { key: 'nav.plan', href: '#plan' },
      { key: 'nav.safety', href: '#safety' },
      { key: 'nav.budget', href: '#budget' },
      { key: 'nav.currency', href: '#currency' },
    ],
  },
];

export default function Navbar() {
  const { t } = useLang();
  const { user, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink-900/95 backdrop-blur-md shadow-elevated py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Fixed Brand Logo & Untranslated Name */}
        <a href="#home" className="flex items-center gap-2.5 text-white shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gold-400/40 bg-gold-400/10">
            <Compass className="h-5 w-5 text-gold-300" />
          </span>
          <div className="hidden sm:block">
            <span className="block font-display text-base font-bold leading-tight tracking-tight text-white">
              Endless Steppe Karakalpakstan
            </span>
            <span className="block text-[10px] text-ink-300 font-medium">{t('brand.tagline')}</span>
          </div>
        </a>

        {/* Desktop Primary Nav & Mega Dropdown */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
          {TOP_LINKS.map((link, idx) => (
            <a
              key={link.key}
              href={link.href}
              className={`text-sm font-medium text-white/90 transition-colors hover:text-gold-300 whitespace-nowrap ${
                idx >= 4 ? 'hidden xl:inline' : 'inline'
              }`}
            >
              {t(link.key)}
            </a>
          ))}

          {/* Mega-Menu Dropdown Button */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 xl:px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:text-gold-300 whitespace-nowrap"
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>{t('nav.allSections')}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-[720px] max-h-[80vh] overflow-y-auto rounded-2xl bg-ink-900/98 border border-white/10 p-6 shadow-2xl backdrop-blur-xl z-50 animate-fade-in scrollbar-none text-white">
                <div className="grid grid-cols-3 gap-6">
                  {CATEGORIZED_NAV.map((cat) => (
                    <div key={cat.titleKey} className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{t(cat.titleKey)}</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {cat.links.map((link) => (
                          <li key={link.key}>
                            <a
                              href={link.href}
                              onClick={() => setDropdownOpen(false)}
                              className="block text-xs font-medium text-white/80 transition-colors hover:text-gold-300 hover:translate-x-1 duration-150"
                            >
                              {t(link.key)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher />
          {user ? (
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <a href="#community" className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-gold-300 whitespace-nowrap">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>{profile?.username ?? 'Profile'}</span>
              </a>
              <button onClick={signOut} className="text-white/80 hover:text-gold-300 transition-colors shrink-0" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-garnet-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-garnet-600 shrink-0 whitespace-nowrap shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" /> <span>{t('auth.signInBtn')}</span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden rounded-lg p-2 text-white hover:bg-white/10 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-ink-900/98 backdrop-blur-md animate-fade-in max-h-[85vh] overflow-y-auto scrollbar-none border-t border-white/10 px-4 py-4">
          {/* Mobile Auth Bar */}
          <div className="mb-4 pb-3 border-b border-white/10 sm:hidden">
            {user ? (
              <div className="flex items-center justify-between">
                <a
                  href="#community"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-gold-300"
                >
                  <UserIcon className="h-4 w-4 text-gold-400" />
                  <span>{profile?.username ?? 'Profile'}</span>
                </a>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setAuthOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-garnet-500 py-2.5 text-xs font-bold text-white transition-colors hover:bg-garnet-600 shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>{t('auth.signInBtn')}</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {CATEGORIZED_NAV.map((cat) => (
              <div key={cat.titleKey}>
                <p className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span>{t(cat.titleKey)}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {cat.links.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 hover:text-gold-300"
                    >
                      {t(link.key)}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {authOpen && <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
