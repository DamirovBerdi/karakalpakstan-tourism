import { useState, useRef, useCallback } from 'react';
import { Sparkles, RefreshCw, X, Users, Wallet, Clock, TrendingUp, MapPin } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';

type Difficulty = 'easy' | 'moderate' | 'hard';

interface SurpriseDestination {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  budget: number;
  duration: { en: string; ru: string; uz: string; kaa: string };
  difficulty: Difficulty;
  tourId: number;
}

const DESTINATIONS: SurpriseDestination[] = [
  {
    id: 'moynaq',
    titleKey: 'surprise.moynaqTitle',
    descKey: 'surprise.moynaqDesc',
    image: 'https://images.pexels.com/photos/36446923/pexels-photo-36446923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    budget: 35,
    duration: { en: 'Full day', ru: 'Весь день', uz: "To'liq kun", kaa: 'Tolıq kún' },
    difficulty: 'moderate',
    tourId: 1,
  },
  {
    id: 'savitskiy',
    titleKey: 'surprise.savitskiyTitle',
    descKey: 'surprise.savitskiyDesc',
    image: 'https://images.pexels.com/photos/29608796/pexels-photo-29608796.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    budget: 10,
    duration: { en: '2 hours', ru: '2 часа', uz: '2 soat', kaa: '2 saat' },
    difficulty: 'easy',
    tourId: 4,
  },
  {
    id: 'ustyurt',
    titleKey: 'surprise.ustyurtTitle',
    descKey: 'surprise.ustyurtDesc',
    image: 'https://images.pexels.com/photos/10582941/pexels-photo-10582941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    budget: 40,
    duration: { en: '3-4 hours', ru: '3-4 часа', uz: '3-4 soat', kaa: '3-4 saat' },
    difficulty: 'hard',
    tourId: 2,
  },
  {
    id: 'chilpek',
    titleKey: 'surprise.chilpekTitle',
    descKey: 'surprise.chilpekDesc',
    image: 'https://images.pexels.com/photos/32309988/pexels-photo-32309988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    budget: 25,
    duration: { en: 'Half day', ru: 'Полдня', uz: 'Yarim kun', kaa: 'Yarım kún' },
    difficulty: 'moderate',
    tourId: 6,
  },
  {
    id: 'sudochye',
    titleKey: 'surprise.sudochyeTitle',
    descKey: 'surprise.sudochyeDesc',
    image: 'https://images.pexels.com/photos/7124359/pexels-photo-7124359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    budget: 30,
    duration: { en: 'Full day', ru: 'Весь день', uz: "To'liq kun", kaa: 'Tolıq kún' },
    difficulty: 'moderate',
    tourId: 1,
  },
];

const difficultyColor: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

const difficultyKey: Record<Difficulty, string> = {
  easy: 'surprise.easy',
  moderate: 'surprise.moderate',
  hard: 'surprise.hard',
};

export default function SurpriseMe() {
  const { lang, t } = useLang();
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<SurpriseDestination | null>(null);
  const [reelIndex, setReelIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    setResult(null);

    let count = 0;
    const totalSpins = 20;

    intervalRef.current = setInterval(() => {
      setReelIndex((prev) => (prev + 1) % DESTINATIONS.length);
      count++;

      if (count >= totalSpins) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        const randomIndex = Math.floor(Math.random() * DESTINATIONS.length);
        setReelIndex(randomIndex);
        setResult(DESTINATIONS[randomIndex]);
        setSpinning(false);
        setShowResult(true);
      }
    }, 100);
  }, [spinning]);

  const handleBook = () => {
    if (!result) return;
    const toursSection = document.getElementById('tours');
    if (toursSection) toursSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFindBuddy = () => {
    if (!result) return;
    const buddySection = document.getElementById('buddy');
    if (buddySection) buddySection.scrollIntoView({ behavior: 'smooth' });
  };

  const closeResult = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <>
      {/* The Button Section */}
      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deepblue-800 via-deepblue-700 to-deepblue-900" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)'
        }} />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-500/20 px-4 py-1.5 text-xs font-semibold text-terracotta-200 ring-1 ring-terracotta-400/30 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            {t('surprise.subtitle')}
          </div>

          {/* Slot Machine Reel */}
          <div className="relative mx-auto mb-6 max-w-sm">
            <div className="rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur-sm">
              <div className="relative h-28 sm:h-32 overflow-hidden rounded-xl">
                {/* Spinning reel */}
                <div
                  className={`flex items-center justify-center h-full transition-all ${spinning ? 'surprise-reel-spinning' : ''}`}
                  style={{ opacity: spinning || !result ? 1 : 0 }}
                >
                  <div className="text-center px-4">
                    <img
                      src={DESTINATIONS[reelIndex].image}
                      alt=""
                      className="mx-auto h-16 w-24 sm:h-20 sm:w-32 rounded-lg object-cover shadow-medium"
                    />
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-white truncate">
                      {t(DESTINATIONS[reelIndex].titleKey)}
                    </p>
                  </div>
                </div>

                {/* Idle state */}
                {!spinning && !result && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-terracotta-300 mb-1" />
                      <p className="text-sm font-medium text-white/70">{t('surprise.buttonSub')}</p>
                    </div>
                  </div>
                )}

                {/* Spin overlay gradients */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-deepblue-800 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-deepblue-800 to-transparent" />
              </div>
            </div>
          </div>

          {/* The Button */}
          <button
            onClick={spin}
            disabled={spinning}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-terracotta-500 px-8 py-4 text-base sm:text-lg font-bold text-white shadow-elevated transition-all hover:bg-terracotta-600 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            <span className={`flex h-7 w-7 items-center justify-center ${spinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
              {spinning ? <RefreshCw className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </span>
            {spinning ? t('surprise.spinning') : t('surprise.button')}
          </button>
        </div>
      </section>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm animate-fade-up" onClick={closeResult} />

          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-elevated overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={closeResult}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img src={result.image} alt={t(result.titleKey)} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-white mb-2">
                  <MapPin className="h-3 w-3" />
                  {t('surprise.resultTitle')}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                  {t(result.titleKey)}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-deepblue-600 leading-relaxed">{t(result.descKey)}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-sand-50 p-3 text-center ring-1 ring-sand-200">
                  <Wallet className="mx-auto h-4 w-4 text-terracotta-500 mb-1" />
                  <p className="text-xs text-deepblue-400">{t('surprise.estimatedBudget')}</p>
                  <p className="font-display text-sm font-bold text-deepblue-800">
                    {t('surprise.from')} ${result.budget}
                  </p>
                </div>
                <div className="rounded-xl bg-sand-50 p-3 text-center ring-1 ring-sand-200">
                  <Clock className="mx-auto h-4 w-4 text-deepblue-500 mb-1" />
                  <p className="text-xs text-deepblue-400">{t('surprise.duration')}</p>
                  <p className="font-display text-sm font-bold text-deepblue-800">
                    {getText(result.duration, lang)}
                  </p>
                </div>
                <div className="rounded-xl bg-sand-50 p-3 text-center ring-1 ring-sand-200">
                  <TrendingUp className="mx-auto h-4 w-4 text-deepblue-500 mb-1" />
                  <p className="text-xs text-deepblue-400">{t('surprise.difficulty')}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold mt-0.5 ${difficultyColor[result.difficulty]}`}>
                    {t(difficultyKey[result.difficulty])}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleBook}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-bold text-white transition-all hover:bg-terracotta-600 hover:shadow-subtle"
                >
                  <Sparkles className="h-4 w-4" />
                  {t('surprise.bookTrip')}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleFindBuddy}
                    className="flex items-center justify-center gap-2 rounded-xl bg-deepblue-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deepblue-800"
                  >
                    <Users className="h-4 w-4" />
                    {t('surprise.findBuddy')}
                  </button>
                  <button
                    onClick={spin}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-deepblue-700 ring-1 ring-sand-300 transition-all hover:bg-sand-50 hover:ring-deepblue-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t('surprise.spinAgain')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
