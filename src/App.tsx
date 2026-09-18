import { useState, useEffect, lazy, Suspense } from 'react';
import { LanguageProvider } from '@/lib/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import SosButton from '@/components/SosButton';
import OfflineIndicator from '@/components/OfflineIndicator';
import { initVisitorTracking } from '@/lib/visitorTracking';

// Synchronously load critical above-the-fold or essential floating UI
// Lazy load non-critical and heavy components
const SurpriseMe = lazy(() => import('@/components/SurpriseMe'));
const VirtualTour = lazy(() => import('@/components/heritage/VirtualTour'));
const Museums = lazy(() => import('@/components/heritage/Museums'));
const Culture = lazy(() => import('@/components/heritage/Culture'));
const Cuisine = lazy(() => import('@/components/heritage/Cuisine'));
const GpsMap = lazy(() => import('@/components/GpsMap'));
const AroundMe = lazy(() => import('@/components/AroundMe'));
const TripTracker = lazy(() => import('@/components/TripTracker'));
const Reviews = lazy(() => import('@/components/Reviews'));
const Community = lazy(() => import('@/components/Community'));
const QrCheckin = lazy(() => import('@/components/QrCheckin'));
const PhotoContest = lazy(() => import('@/components/PhotoContest'));
const Leaderboard = lazy(() => import('@/components/Leaderboard'));
const MiniGame = lazy(() => import('@/components/MiniGame'));
const ProfileDashboard = lazy(() => import('@/components/ProfileDashboard'));
const MuslimTravel = lazy(() => import('@/components/MuslimTravel'));
const TaxiBooking = lazy(() => import('@/components/TaxiBooking'));
const VisaAssistance = lazy(() => import('@/components/VisaAssistance'));
const FlightBooking = lazy(() => import('@/components/FlightBooking'));
const ToursSection = lazy(() => import('@/components/ToursSection'));
const TravelBuddyMatcher = lazy(() => import('@/components/TravelBuddyMatcher'));
const Guides = lazy(() => import('@/components/Guides'));
const Hotels = lazy(() => import('@/components/Hotels'));
const Transport = lazy(() => import('@/components/Transport'));
const InteractiveMap = lazy(() => import('@/components/InteractiveMap'));
const Essentials = lazy(() => import('@/components/Essentials'));
const PlanExplore = lazy(() => import('@/components/planExplore/PlanExplore'));
const AralExperience = lazy(() => import('@/components/aralExperience/AralExperience'));
const EmergencyKit = lazy(() => import('@/components/EmergencyKit'));
const BudgetPlanner = lazy(() => import('@/components/BudgetPlanner'));
const CurrencyConverter = lazy(() => import('@/components/CurrencyConverter'));
const ChatBot = lazy(() => import('@/components/ChatBot'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));

const HoneypotTrap = lazy(() => import('@/components/HoneypotTrap'));

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
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-400 border-t-transparent" />
    </div>
  );
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return pathname;
}

function App() {
  const pathname = usePathname();
  const normalizedPath = pathname.toLowerCase();
  const isHoneypot = HONEYPOT_PATHS.some((p) => normalizedPath === p || normalizedPath.startsWith(`${p}/`));

  useEffect(() => {
    if (pathname !== '/admin' && !isHoneypot) {
      initVisitorTracking();
    }
  }, [pathname, isHoneypot]);

  if (isHoneypot) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <HoneypotTrap path={pathname} />
      </Suspense>
    );
  }

  if (pathname === '/admin') {
    return (
      <Suspense fallback={<SectionLoader />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-sand-50">
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<SectionLoader />}>
            <SurpriseMe />
            <VirtualTour />
            <Museums />
            <Culture />
            <Cuisine />
            <GpsMap />
            <AroundMe />
            <TripTracker />
            <Reviews />
            <Community />
            <QrCheckin />
            <PhotoContest />
            <Leaderboard />
            <MiniGame />
            <MuslimTravel />
            <TaxiBooking />
            <ProfileDashboard />
            <VisaAssistance />
            <FlightBooking />
            <ToursSection />
            <TravelBuddyMatcher />
            <Guides />
            <Hotels />
            <Transport />
            <InteractiveMap />
            <Essentials />
            <PlanExplore />
            <AralExperience />
            <EmergencyKit />
            <BudgetPlanner />
            <CurrencyConverter />
          </Suspense>
        </main>
        <Footer />
        <SosButton />
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
        <OfflineIndicator />
      </div>
    </LanguageProvider>
  );
}

export default App;
