import { useState, useCallback } from 'react';
import { GamepadIcon, CheckCircle2, XCircle, Loader2, Trophy, Zap, RotateCcw, Brain, User, Phone, MapPin, Send } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getText } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { quizQuestions } from '@/data/quizData';

export default function MiniGame() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [winnerPhone, setWinnerPhone] = useState('');
  const [winnerLocation, setWinnerLocation] = useState('');
  const [showWinnerForm, setShowWinnerForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = quizQuestions[currentQ];

  const start = () => {
    setStarted(true);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const selectAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const next = useCallback(async () => {
    if (currentQ + 1 >= quizQuestions.length) {
      // Finished
      setFinished(true);
      setStarted(false);

      if (user && score > 0) {
        setSubmitting(true);
        await supabase.rpc('submit_quiz_result', {
          p_score: score,
          p_total: quizQuestions.length,
        });
        setSubmitting(false);
      }
      if (score >= 7) {
        setShowWinnerForm(true);
      }
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [currentQ, score, user]);

  const accuracy = Math.round((score / quizQuestions.length) * 100);
  const pointsEarned = score * 15;

  if (!started && !finished) {
    return (
      <section id="minigame" className="py-16 sm:py-20 bg-gradient-to-b from-deepblue-50 to-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-deepblue-100 px-4 py-1.5 text-xs font-semibold text-deepblue-700 mb-3">
              <GamepadIcon className="h-3.5 w-3.5" /> Mini-Game
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-deepblue-900 mb-3">{t('quiz.title')}</h2>
            <p className="mx-auto max-w-xl text-base text-deepblue-600">{t('quiz.subtitle')}</p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-subtle ring-1 ring-sand-200 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-deepblue-600 to-deepblue-800">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-deepblue-900 mb-2">{t('quiz.quizName')}</h3>
            <p className="text-sm text-deepblue-500 mb-4">{t('quiz.description')}</p>
            <div className="flex items-center justify-center gap-4 mb-6 text-sm">
              <span className="flex items-center gap-1.5 text-deepblue-600">
                <GamepadIcon className="h-4 w-4" /> {quizQuestions.length} {t('quiz.questions')}
              </span>
              <span className="flex items-center gap-1.5 text-terracotta-600">
                <Zap className="h-4 w-4" /> +15 {t('quiz.perCorrect')}
              </span>
            </div>
            <button
              onClick={start}
              className="flex items-center gap-2 rounded-xl bg-terracotta-500 px-8 py-3 text-base font-bold text-white transition-all hover:bg-terracotta-600 shadow-subtle"
            >
              <GamepadIcon className="h-5 w-5" /> {t('quiz.start')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const passed = score >= 7;
    return (
      <section id="minigame" className="py-16 sm:py-20 bg-gradient-to-b from-deepblue-50 to-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-subtle ring-1 ring-sand-200 text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${passed ? 'bg-green-500' : 'bg-amber-500'}`}>
              {passed ? <Trophy className="h-8 w-8 text-white" /> : <Brain className="h-8 w-8 text-white" />}
            </div>
            <h3 className="font-display text-2xl font-bold text-deepblue-900 mb-2">
              {passed ? t('quiz.greatJob') : t('quiz.goodTry')}
            </h3>
            <p className="text-lg text-deepblue-700 mb-4">
              {score} / {quizQuestions.length} {t('quiz.correct')}
            </p>

            {/* Score visualization */}
            <div className="mx-auto mb-6 max-w-xs">
              <div className="flex justify-between text-xs text-deepblue-500 mb-1">
                <span>{t('quiz.accuracy')}</span>
                <span>{accuracy}%</span>
              </div>
              <div className="h-3 rounded-full bg-sand-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* Points earned */}
            <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-5 py-2 mb-6">
              <Zap className="h-5 w-5 text-terracotta-600" />
              <span className="font-bold text-terracotta-700">+{pointsEarned} {t('quiz.pointsEarned')}</span>
            </div>

            {/* Winner contact form */}
            {showWinnerForm && !submitted && (
              <div className="mb-6 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200 text-left">
                <div className="mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-bold text-amber-800">You won! Claim your prize</p>
                </div>
                <p className="text-xs text-amber-700 mb-3">Submit your contact details to claim your reward and bonus points.</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!winnerName.trim()) return;
                  setSubmitting(true);
                  await supabase.from('game_winners').insert({
                    user_id: user?.id ?? null,
                    game_type: 'karakalpak_trivia',
                    player_name: winnerName.trim(),
                    phone: winnerPhone.trim(),
                    location: winnerLocation.trim(),
                    score,
                    total: quizQuestions.length,
                    points_earned: pointsEarned,
                  });
                  setSubmitting(false);
                  setSubmitted(true);
                }} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-deepblue-700 mb-1">Your Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                      <input type="text" value={winnerName} onChange={(e) => setWinnerName(e.target.value)} required
                        className="w-full rounded-lg border border-sand-300 bg-white pl-9 pr-3 py-2 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                        placeholder="Full name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                        <input type="tel" value={winnerPhone} onChange={(e) => setWinnerPhone(e.target.value)}
                          className="w-full rounded-lg border border-sand-300 bg-white pl-9 pr-3 py-2 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                          placeholder="+998..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-deepblue-700 mb-1">City / Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deepblue-400" />
                        <input type="text" value={winnerLocation} onChange={(e) => setWinnerLocation(e.target.value)}
                          className="w-full rounded-lg border border-sand-300 bg-white pl-9 pr-3 py-2 text-sm text-deepblue-900 outline-none focus:border-deepblue-500"
                          placeholder="Nukus, Moynaq..." />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit & Claim Prize
                  </button>
                </form>
              </div>
            )}

            {submitted && (
              <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
                <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Submitted! We will contact you with your prize.
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  start();
                  setShowWinnerForm(false);
                  setSubmitted(false);
                  setWinnerName('');
                  setWinnerPhone('');
                  setWinnerLocation('');
                }}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-deepblue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-deepblue-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {t('quiz.playAgain')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Active quiz
  return (
    <section id="minigame" className="py-16 sm:py-20 bg-gradient-to-b from-deepblue-50 to-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-deepblue-900">{t('quiz.quizName')}</h2>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-deepblue-500 mb-1">
            <span>{currentQ + 1} / {quizQuestions.length}</span>
            <span>{t('quiz.score')}: {score}</span>
          </div>
          <div className="h-2 rounded-full bg-sand-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-terracotta-500 transition-all duration-500"
              style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl bg-white p-6 shadow-subtle ring-1 ring-sand-200">
          <h3 className="font-display text-lg font-bold text-deepblue-900 mb-5">
            {getText(question.question, lang)}
          </h3>

          <div className="space-y-3">
            {getText<string[]>(question.options, lang).map((opt, idx) => {
              const isCorrect = idx === question.correctIndex;
              const isSelected = idx === selected;
              let style = 'border-sand-300 bg-sand-50 hover:bg-sand-100 text-deepblue-900';
              if (answered) {
                if (isCorrect) style = 'border-green-500 bg-green-50 text-green-900';
                else if (isSelected) style = 'border-red-500 bg-red-50 text-red-900';
                else style = 'border-sand-200 bg-sand-50 text-deepblue-400';
              }
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  disabled={answered}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <button
              onClick={next}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-deepblue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-deepblue-700"
            >
              {currentQ + 1 >= quizQuestions.length ? t('quiz.finish') : t('quiz.next')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
