import { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowLeft, MapPin, Compass, Landmark, Camera, Utensils, Moon, Truck, Wallet, Users, Plane, FileCheck, ShieldAlert, Sparkles, Tent, Gamepad, TrendingUp, Scroll } from 'lucide-react';
import { LanguageProvider, useLang } from '@/lib/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import SosButton from '@/components/SosButton';
import OfflineIndicator from '@/components/OfflineIndicator';
import { initVisitorTracking } from '@/lib/visitorTracking';

// Safe lazy import with auto-retry when a new build deploys new hashed chunks
function lazyRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const pageHasAlreadyBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-refreshed') || 'false'
    );
    try {
      return await componentImport();
    } catch (error) {
      if (!pageHasAlreadyBeenRefreshed) {
        window.sessionStorage.setItem('page-has-been-refreshed', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

// Clear chunk refresh flag after successful load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    window.sessionStorage.setItem('page-has-been-refreshed', 'false');
  });
}

// Lazy load dedicated page components
const SurpriseMe = lazyRetry(() => import('@/components/SurpriseMe'));
const VirtualTour = lazyRetry(() => import('@/components/heritage/VirtualTour'));
const Museums = lazyRetry(() => import('@/components/heritage/Museums'));
const Culture = lazyRetry(() => import('@/components/heritage/Culture'));
const Cuisine = lazyRetry(() => import('@/components/heritage/Cuisine'));
const GpsMap = lazyRetry(() => import('@/components/GpsMap'));
const AroundMe = lazyRetry(() => import('@/components/AroundMe'));
const TripTracker = lazyRetry(() => import('@/components/TripTracker'));
const Reviews = lazyRetry(() => import('@/components/Reviews'));
const Community = lazyRetry(() => import('@/components/Community'));
const QrCheckin = lazyRetry(() => import('@/components/QrCheckin'));
const PhotoContest = lazyRetry(() => import('@/components/PhotoContest'));
const Leaderboard = lazyRetry(() => import('@/components/Leaderboard'));
const MiniGame = lazyRetry(() => import('@/components/MiniGame'));
const ProfileDashboard = lazyRetry(() => import('@/components/ProfileDashboard'));
const MuslimTravel = lazyRetry(() => import('@/components/MuslimTravel'));
const TaxiBooking = lazyRetry(() => import('@/components/TaxiBooking'));
const VisaAssistance = lazyRetry(() => import('@/components/VisaAssistance'));
const FlightBooking = lazyRetry(() => import('@/components/FlightBooking'));
const ToursSection = lazyRetry(() => import('@/components/ToursSection'));
const TravelBuddyMatcher = lazyRetry(() => import('@/components/TravelBuddyMatcher'));
const Guides = lazyRetry(() => import('@/components/Guides'));
const Hotels = lazyRetry(() => import('@/components/Hotels'));
const Transport = lazyRetry(() => import('@/components/Transport'));
const InteractiveMap = lazyRetry(() => import('@/components/InteractiveMap'));
const Essentials = lazyRetry(() => import('@/components/Essentials'));
const PlanExplore = lazyRetry(() => import('@/components/planExplore/PlanExplore'));
const AralExperience = lazyRetry(() => import('@/components/aralExperience/AralExperience'));
const EmergencyKit = lazyRetry(() => import('@/components/EmergencyKit'));
const BudgetPlanner = lazyRetry(() => import('@/components/BudgetPlanner'));
const CurrencyConverter = lazyRetry(() => import('@/components/CurrencyConverter'));
const ChatBot = lazyRetry(() => import('@/components/ChatBot'));
const AdminDashboard = lazyRetry(() => import('@/components/AdminDashboard'));
const HoneypotTrap = lazyRetry(() => import('@/components/HoneypotTrap'));
const TourismAnalytics = lazyRetry(() => import('@/components/TourismAnalytics'));
const HeritageStories = lazyRetry(() => import('@/components/heritage/HeritageStories'));

const HONEYPOT_PATHS = [
  '/admin-panel-bypass',
  '/api/v1/internal-backdoor',
  '/wp-login.php',
  '/phpmyadmin',
  '/cpanel',
  '/shell',
  '/backup.sql',
  '/.env',
];

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-gold-400 border-t-transparent" />
    </div>
  );
}

// Router Hook listening to both URL path and #hash changes
function useCurrentRoute() {
  const getRoute = () => {
    const pathname = window.location.pathname.toLowerCase().replace('/', '');
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (pathname && pathname !== 'admin') return pathname;
    if (hash) return hash;
    return 'home';
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  return route;
}

// Back to Home Banner for Dedicated Pages
function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  const goHome = () => {
    window.location.hash = '';
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950 text-white pt-24 pb-10 border-b border-white/10 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-gold-400 hover:text-ink-950 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>На главную / Back Home</span>
        </button>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-sm sm:text-base text-white/75">{subtitle}</p>}
      </div>
    </div>
  );
}

// Home Page Visual Shortcut Grid for Dedicated Pages
function HomeExploreGrid() {
  const navigateTo = (path: string) => {
    window.location.hash = `#${path}`;
  };

  const PAGES = [
    { id: 'analytics', icon: TrendingUp, titleRu: 'Статистика & Аналитика', descRu: 'Динамика туризма КР за 5 лет', gradient: 'from-blue-600 to-indigo-700' },
    { id: 'stories', icon: Scroll, titleRu: 'Истории & Древние Легенды', descRu: 'Хорезм, Чилпык, Топрак-Кала & Арал', gradient: 'from-amber-600 to-rose-700' },
    { id: 'gps-map', icon: MapPin, titleRu: 'GPS & Живая Карта', descRu: 'Карта точек и навигация', gradient: 'from-blue-600 to-cyan-600' },
    { id: 'virtual', icon: Camera, titleRu: '360° Виртуальные Туры', descRu: 'Снимки 360° Арала и Муйнака', gradient: 'from-purple-600 to-pink-600' },
    { id: 'museums', icon: Landmark, titleRu: 'Музей Савицкого & Галереи', descRu: 'Русский авангард и история', gradient: 'from-amber-600 to-orange-600' },
    { id: 'culture', icon: Sparkles, titleRu: 'Культура & Ремесла', descRu: 'Костюмы, вышивка и сувениры', gradient: 'from-rose-600 to-red-600' },
    { id: 'cuisine', icon: Utensils, titleRu: 'Номад-Кухня & Рыба', descRu: 'Аральский судак и бешбармак', gradient: 'from-emerald-600 to-teal-600' },
    { id: 'around', icon: Compass, titleRu: 'Вокруг Меня (GPS)', descRu: 'Банкоматы, аптеки и базары', gradient: 'from-cyan-600 to-blue-700' },
    { id: 'taxi', icon: Truck, titleRu: 'Такси 1222 & Трансфер', descRu: '4x4 Джип такси Нукус - Муйнак', gradient: 'from-amber-500 to-yellow-600' },
    { id: 'flights', icon: Plane, titleRu: 'Авиабилеты', descRu: 'Рейсы в Нукус и Ташкент', gradient: 'from-indigo-600 to-blue-800' },
    { id: 'aral', icon: Compass, titleRu: 'Аральское Море', descRu: 'Кладбище кораблей и каньоны', gradient: 'from-blue-700 to-teal-800' },
    { id: 'muslim-travel', icon: Moon, titleRu: 'Халяль & Зиярат', descRu: 'Намаз, Кибла и святые места', gradient: 'from-green-600 to-emerald-800' },
    { id: 'community', icon: Users, titleRu: 'Сообщество & Отзывы', descRu: 'Чат, фотоконкурс и квесты', gradient: 'from-fuchsia-600 to-pink-700' },
    { id: 'budget', icon: Wallet, titleRu: 'Калькулятор Бюджета', descRu: 'Конвертер UZS и рассчет цен', gradient: 'from-teal-600 to-emerald-600' },
  ];

  return (
    <section className="py-16 bg-sand-100/70 border-t border-sand-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-gold-400/20 px-3.5 py-1 text-xs font-bold text-garnet-600 mb-2">
            ВСЕ СЕРВИСЫ И СТРАНИЦЫ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">
            Исследуйте Разделы На Отдельных Страницах
          </h2>
          <p className="mt-2 text-sm sm:text-base text-ink-600 max-w-2xl mx-auto">
            Кликните на любой раздел, чтобы открыть его на отдельной странице!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => navigateTo(page.id)}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-sand-200 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${page.gradient} text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900 group-hover:text-garnet-600 transition-colors">
                    {page.titleRu}
                  </h3>
                  <p className="mt-1 text-xs text-ink-500 line-clamp-2">{page.descRu}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AppContent() {
  const currentPath = window.location.pathname.toLowerCase();
  const route = useCurrentRoute();

  const isHoneypot = HONEYPOT_PATHS.some((p) => currentPath === p || currentPath.startsWith(`${p}/`));

  useEffect(() => {
    if (currentPath !== '/admin' && !isHoneypot) {
      initVisitorTracking();
    }
  }, [currentPath, isHoneypot]);

  if (isHoneypot) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <HoneypotTrap path={currentPath} />
      </Suspense>
    );
  }

  if (currentPath === '/admin') {
    return (
      <Suspense fallback={<SectionLoader />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  // DEDICATED PAGE ROUTER
  const renderRouteContent = () => {
    switch (route) {
      case 'analytics':
      case 'stats':
        return (
          <>
            <PageBanner title="Аналитика & Статистика Туризма (2020–2025)" subtitle="Данные туристского потока, приток гостей и инфографика региона" />
            <TourismAnalytics />
          </>
        );

      case 'stories':
      case 'history':
        return (
          <>
            <PageBanner title="Истории & Древние Легенды" subtitle="Хроники Древнего Хорезма, зороастрийские башни и история Арала" />
            <HeritageStories />
          </>
        );

      case 'tours':
        return (
          <>
            <PageBanner title="Туры & Экскурсии" subtitle="Экспедиции к Аральскому морю, каньоны Устюрта и исторические крепости" />
            <ToursSection />
            <Guides />
            <TravelBuddyMatcher />
          </>
        );

      case 'guides':
        return (
          <>
            <PageBanner title="Персональные Гиды" subtitle="Лицензированные гиды-полиглоты со знанием языков" />
            <Guides />
          </>
        );

      case 'visa':
        return (
          <>
            <PageBanner title="Поддержка E-Visa" subtitle="Проверка права на въезд и официальное оформление визы в Узбекистан" />
            <VisaAssistance />
          </>
        );

      case 'hotels':
        return (
          <>
            <PageBanner title="Отели & Юртовые Лагеря" subtitle="Традиционные юрты на берегу Арала и бутик-отели Нукуса" />
            <Hotels />
          </>
        );

      case 'gps-map':
      case 'gps':
      case 'map':
        return (
          <>
            <PageBanner title="GPS & Живая Карта" subtitle="Интерактивная карта объектов с точным определением геопозиции" />
            <GpsMap />
          </>
        );

      case 'around':
        return (
          <>
            <PageBanner title="Вокруг Меня" subtitle="Находите рестораны, банкоматы, аптеки и базары рядом с вами" />
            <AroundMe />
          </>
        );

      case 'virtual':
        return (
          <>
            <PageBanner title="360° Виртуальные Туры" subtitle="Панорамный обзор музея Савицкого и кладбища кораблей" />
            <VirtualTour />
          </>
        );

      case 'museums':
        return (
          <>
            <PageBanner title="Музеи и Исторические Места" subtitle="Знаменитый Музей Савицкого и древние некрополи" />
            <Museums />
          </>
        );

      case 'culture':
        return (
          <>
            <PageBanner title="Каракалпакская Культура & Ремесла" subtitle="Традиционные костюмы, вышивка и где купить сувениры" />
            <Culture />
          </>
        );

      case 'cuisine':
        return (
          <>
            <PageBanner title="Национальная Номад-Кухня" subtitle="Аральский судак, бешбармак и лучшие рестораны" />
            <Cuisine />
          </>
        );

      case 'taxi':
        return (
          <>
            <PageBanner title="Такси 1222 & Пустынный Трансфер" subtitle="Заказ подготовленных 4x4 джипов и трансферов" />
            <TaxiBooking />
          </>
        );

      case 'flights':
        return (
          <>
            <PageBanner title="Авиабилеты" subtitle="Поиск и бронирование билетов в Нукус и Ташкент" />
            <FlightBooking />
          </>
        );

      case 'aral':
        return (
          <>
            <PageBanner title="Экспедиция к Аральскому Морю" subtitle="Кладбище кораблей в Муйнаке, время открытий и экологя" />
            <AralExperience />
          </>
        );

      case 'muslim-travel':
      case 'muslim':
        return (
          <>
            <PageBanner title="Мусульманский Туризм & Халяль" subtitle="Время намаза, компас Киблы, мечети и зиярат-туры" />
            <MuslimTravel />
          </>
        );

      case 'community':
      case 'reviews':
      case 'contest':
      case 'qr-checkin':
        return (
          <>
            <PageBanner title="Сообщество Путешественников & Отзывы" subtitle="Чат, конкурс фото, отзывы и цифровые QR-значки" />
            <Community />
            <Reviews />
            <PhotoContest />
            <Leaderboard />
            <QrCheckin />
          </>
        );

      case 'budget':
      case 'currency':
        return (
          <>
            <PageBanner title="Планировщик Бюджета & Конвертер UZS" subtitle="Рассчет расходов на поездку и курсы валют" />
            <BudgetPlanner />
            <CurrencyConverter />
          </>
        );

      case 'plan':
      case 'essentials':
      case 'safety':
        return (
          <>
            <PageBanner title="Планировщик Поездки & Безопасность" subtitle="Погода, вещи, правила въезда и экстренный набор" />
            <PlanExplore />
            <Essentials />
            <EmergencyKit />
          </>
        );

      case 'minigame':
      case 'surprise':
        return (
          <>
            <PageBanner title="Мини-Игра & Рулетка Сюрприз" subtitle="Проверьте знания о Каракалпакстане и выберите рандом-тур" />
            <MiniGame />
            <SurpriseMe />
          </>
        );

      case 'profile':
        return (
          <>
            <PageBanner title="Профиль Путешественника" subtitle="Ваши значки, поинты и сохраненные места" />
            <ProfileDashboard />
          </>
        );

      // MAIN DEFAULT HOME PAGE ROUTE
      default:
        return (
          <>
            <Hero />
            <ToursSection />
            <VisaAssistance />
            <Hotels />
            <HomeExploreGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main>
        <Suspense fallback={<SectionLoader />}>{renderRouteContent()}</Suspense>
      </main>
      <Footer />
      <SosButton />
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
