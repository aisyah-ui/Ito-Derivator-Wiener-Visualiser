import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  Compass,
  X,
} from 'lucide-react';
import { MathView } from './MathView';

export interface QuizQuestionWithBadge {
  id: string;
  badgeName: string;
  badgeIcon: React.ReactNode;
  topicTag: 'K4: Wiener Process' | 'K9: Itô’s Lemma';
  difficulty: 'Foundation' | 'Core Theorem' | 'Advanced Derivation';
  question: string;
  mathPrompt?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hullContext: string;
}

export const MASTER_QUIZ_QUESTIONS: QuizQuestionWithBadge[] = [
  {
    id: 'mq-1',
    badgeName: 'Markov Mindset',
    badgeIcon: <Brain className="w-5 h-5 text-indigo-400" />,
    topicTag: 'K4: Wiener Process',
    difficulty: 'Foundation',
    question:
      'According to Hull Section 14.1 and Week 1 slides, suppose a stock price is $100 today. If the stock follows a Markov process, what impact does its price one week ago or one month ago have on our prediction for future movements?',
    options: [
      {
        id: 'a',
        text: 'Zero impact — the future probability distribution depends strictly on the current price ($100), and past trajectory is completely irrelevant.',
        isCorrect: true,
        explanation:
          'Spot on! The Markov property states that conditional on the present state ($100), all past history is irrelevant. This aligns directly with Weak-Form Market Efficiency.',
      },
      {
        id: 'b',
        text: 'Moderate impact — past momentum indicates whether the future drift will be positive or negative.',
        isCorrect: false,
        explanation:
          'Incorrect. In a Markov process, past prices contain no information about future increments.',
      },
      {
        id: 'c',
        text: 'Strong impact — technical analysis patterns can reliably forecast subsequent price surges.',
        isCorrect: false,
        explanation:
          'Incorrect. As noted in Hull slide 8, weak-form market efficiency ensures that past price charts cannot produce consistently superior returns.',
      },
      {
        id: 'd',
        text: 'The variance rate changes depending on whether the past week was bullish or bearish.',
        isCorrect: false,
        explanation:
          'Incorrect. In a stationary Markov Wiener process, variance rates remain constant per unit of time.',
      },
    ],
    hullContext: 'Hull Ch. 14.1 (p. 316–317) & Lecture Slide 6–8: The Markov Property & Weak-Form Efficiency.',
  },
  {
    id: 'mq-2',
    badgeName: 'Wiener Micro-Shock',
    badgeIcon: <Zap className="w-5 h-5 text-cyan-400" />,
    topicTag: 'K4: Wiener Process',
    difficulty: 'Foundation',
    question:
      'Over a small time interval Δt = 0.04 years (approx. 10 trading days), what are the expected value E[Δz], variance Var(Δz), and standard deviation SD(Δz) of the Wiener increment Δz?',
    mathPrompt: '\\Delta z = \\epsilon \\sqrt{\\Delta t}, \\quad \\Delta t = 0.04',
    options: [
      {
        id: 'a',
        text: 'E[Δz] = 0.04, Var = 0.04, SD = 0.20',
        isCorrect: false,
        explanation:
          'Incorrect. The expected drift of a basic Wiener process is strictly zero, not Δt.',
      },
      {
        id: 'b',
        text: 'E[Δz] = 0, Var(Δz) = 0.04, SD(Δz) = 0.20',
        isCorrect: true,
        explanation:
          'Excellent! E[Δz] = 0. The variance equals Δt = 0.04, so the standard deviation is √0.04 = 0.20 (which is 5 times larger than Δt!).',
      },
      {
        id: 'c',
        text: 'E[Δz] = 0, Var(Δz) = 0.20, SD(Δz) = 0.04',
        isCorrect: false,
        explanation:
          'Incorrect. You inverted variance and standard deviation: Var is Δt (0.04) and SD is √Δt (0.20).',
      },
      {
        id: 'd',
        text: 'E[Δz] = 0, Var(Δz) = 0.0016, SD(Δz) = 0.04',
        isCorrect: false,
        explanation:
          'Incorrect. This treats Δt as the standard deviation and squares it, which violates property 1.',
      },
    ],
    hullContext: 'Hull Equation 14.1 (p. 318) & Lecture Slide 13: Properties of a Wiener Process.',
  },
  {
    id: 'mq-3',
    badgeName: 'Square-Root Horizon',
    badgeIcon: <Compass className="w-5 h-5 text-emerald-400" />,
    topicTag: 'K4: Wiener Process',
    difficulty: 'Core Theorem',
    question:
      'Hull highlights that for Markov processes over successive periods, variances are additive while standard deviations are NOT additive. If the 1-year variance is 1.0, what are the variance and standard deviation of change over 4 years?',
    mathPrompt: 'z(4) - z(0) = \\sum_{i=1}^4 \\Delta z_i',
    options: [
      {
        id: 'a',
        text: 'Variance = 4.0, Standard Deviation = 2.0',
        isCorrect: true,
        explanation:
          'Correct! Independent variances add directly: 1.0 + 1.0 + 1.0 + 1.0 = 4.0. The standard deviation is the square root of total variance: √4.0 = 2.0.',
      },
      {
        id: 'b',
        text: 'Variance = 16.0, Standard Deviation = 4.0',
        isCorrect: false,
        explanation:
          'Incorrect. This erroneously assumes standard deviations are additive (1+1+1+1=4) and squares it to get variance.',
      },
      {
        id: 'c',
        text: 'Variance = 4.0, Standard Deviation = 4.0',
        isCorrect: false,
        explanation:
          'Incorrect. Standard deviation is always the square root of variance, so SD = √4 = 2.0.',
      },
      {
        id: 'd',
        text: 'Variance = 2.0, Standard Deviation = 1.414',
        isCorrect: false,
        explanation:
          'Incorrect. That would be the distribution for 2 years (T = 2), not 4 years.',
      },
    ],
    hullContext: 'Hull Section 14.2 (p. 318) & Lecture Slide 10–11: Variances & Standard Deviations.',
  },
  {
    id: 'mq-4',
    badgeName: 'Itô Table Master',
    badgeIcon: <Sparkles className="w-5 h-5 text-amber-400" />,
    topicTag: 'K9: Itô’s Lemma',
    difficulty: 'Core Theorem',
    question:
      'In stochastic calculus, why does (dz)² equal dt rather than 0 in the continuous limit as dt → 0?',
    mathPrompt: '(dz)^2 = (\\epsilon \\sqrt{dt})^2 = \\epsilon^2 dt',
    options: [
      {
        id: 'a',
        text: 'Because dz is of order √dt, meaning (dz)² is of first order dt. Since E[ε²] = 1, (dz)² converges to dt deterministically.',
        isCorrect: true,
        explanation:
          'Brilliant! Because stochastic increments scale with √dt, their square is of order dt (not dt²). The variance of (dz)² shrinks to zero, so (dz)² = dt with probability 1!',
      },
      {
        id: 'b',
        text: 'Because dt is so large compared to dz that dz absorbs all deterministic drift.',
        isCorrect: false,
        explanation:
          'Incorrect. dt is actually much smaller than √dt as dt → 0.',
      },
      {
        id: 'c',
        text: 'Because standard Taylor expansion rules state that all second derivatives equal 1.',
        isCorrect: false,
        explanation:
          'Incorrect. Ordinary Taylor series sets (dx)² = 0 when dx ~ dt. It is the stochastic nature of Wiener processes that keeps (dz)² alive.',
      },
      {
        id: 'd',
        text: 'It only equals dt if the stock volatility σ is exactly 100%.',
        isCorrect: false,
        explanation:
          'Incorrect. The rule (dz)² = dt holds for any standard Wiener process regardless of the asset volatility.',
      },
    ],
    hullContext: 'Hull Appendix Ch. 14 & Lecture Slide 36: Itô Calculus Multiplication Rules.',
  },
  {
    id: 'mq-5',
    badgeName: 'Jensen’s Convexity',
    badgeIcon: <TrendingUp className="w-5 h-5 text-rose-400" />,
    topicTag: 'K9: Itô’s Lemma',
    difficulty: 'Advanced Derivation',
    question:
      'When applying Itô’s Lemma to G = ln S where dS = μS dt + σS dz, where does the term -½σ² dt in the drift come from?',
    mathPrompt: 'd(\\ln S) = \\left[ \\dfrac{\\partial G}{\\partial S} \\mu S + \\dfrac{1}{2} \\, \\dfrac{\\partial^2 G}{\\partial S^2} \\sigma^2 S^2 \\right] dt + \\dots',
    options: [
      {
        id: 'a',
        text: 'From the second derivative ∂²(ln S)/∂S² = -1/S², which multiplied by ½(σS)² yields -½σ² dt.',
        isCorrect: true,
        explanation:
          'Spot on! The curvature of the natural log is negative (concave). The Itô term ½(∂²G/∂S²)(σS)² = ½(-1/S²)(σ²S²) = -½σ². The S² terms cancel out cleanly!',
      },
      {
        id: 'b',
        text: 'From an exogenous interest rate deduction required by arbitrage pricing.',
        isCorrect: false,
        explanation:
          'Incorrect. This is purely a mathematical consequence of Itô’s lemma on a concave function, not interest rates.',
      },
      {
        id: 'c',
        text: 'From the time derivative ∂G/∂t = -½σ².',
        isCorrect: false,
        explanation:
          'Incorrect. G = ln S has no calendar time variable t, so ∂G/∂t is strictly 0.',
      },
      {
        id: 'd',
        text: 'From the variance of the Wiener process changing dynamically.',
        isCorrect: false,
        explanation:
          'Incorrect. The Wiener process has a constant variance rate of 1.0 per unit time.',
      },
    ],
    hullContext: 'Hull Section 14.7 (p. 328–329) & Lecture Slide 41–42: The Lognormal Property.',
  },
  {
    id: 'mq-6',
    badgeName: 'Lognormal Champion',
    badgeIcon: <Award className="w-5 h-5 text-amber-500" />,
    topicTag: 'K9: Itô’s Lemma',
    difficulty: 'Advanced Derivation',
    question:
      'A stock has an expected arithmetic return μ = 16% per annum and volatility σ = 30% per annum. What is the expected continuously compounded growth rate of ln S according to Hull Section 14.7?',
    mathPrompt: 'E\\left[ \\dfrac{d(\\ln S)}{dt} \\right] = \\mu - \\dfrac{\\sigma^2}{2}',
    options: [
      {
        id: 'a',
        text: '16.0% per year',
        isCorrect: false,
        explanation:
          'Incorrect. 16.0% is μ (the arithmetic return of price). The continuously compounded return is dragged down by volatility.',
      },
      {
        id: 'b',
        text: '11.5% per year',
        isCorrect: true,
        explanation:
          'Correct! Growth rate = μ - σ²/2 = 0.16 - (0.30)²/2 = 0.16 - 0.09/2 = 0.16 - 0.045 = 0.115 (11.5% per year).',
      },
      {
        id: 'c',
        text: '7.0% per year',
        isCorrect: false,
        explanation:
          'Incorrect. You subtracted the full variance σ² (0.09) instead of half the variance σ²/2 (0.045).',
      },
      {
        id: 'd',
        text: '20.5% per year',
        isCorrect: false,
        explanation:
          'Incorrect. You added the volatility correction instead of subtracting it.',
      },
    ],
    hullContext: 'Hull Section 14.7 (p. 329) & Practice Question 14.12.',
  },
];

export const MasterQuizSection: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false);

  const totalQuestions = MASTER_QUIZ_QUESTIONS.length;
  const correctCount = unlockedBadges.length;
  const progressPercent = Math.round((correctCount / totalQuestions) * 100);

  // Synthesizes a golden triumph fanfare arpeggio using the browser's Web Audio API
  const playFanfareSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch {
      // Audio context may be restricted by environment; safe no-op
    }
  };

  // Spectacular multi-stage confetti celebration
  const triggerGrandConfetti = () => {
    // 1. Center burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#eab308', '#06b6d4'],
    });

    // 2. Left celebration cannon
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 70,
        origin: { x: 0.05, y: 0.75 },
        colors: ['#eab308', '#f97316', '#06b6d4', '#a855f7', '#ec4899'],
      });
    }, 250);

    // 3. Right celebration cannon
    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 70,
        origin: { x: 0.95, y: 0.75 },
        colors: ['#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#eab308'],
      });
    }, 450);

    // 4. Golden starry shower
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { y: 0.3 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
      });
    }, 750);
  };

  const handleSelectOption = (q: QuizQuestionWithBadge, optId: string) => {
    // If already answered this option, ignore
    if (userAnswers[q.id] === optId) return;

    setUserAnswers((prev) => ({ ...prev, [q.id]: optId }));

    const selected = q.options.find((o) => o.id === optId);
    if (selected?.isCorrect) {
      if (!unlockedBadges.includes(q.id)) {
        const nextBadges = [...unlockedBadges, q.id];
        setUnlockedBadges(nextBadges);

        // Immediate individual question confetti
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });

        // If ALL unlocked, trigger Grand Trophy Pop-up Modal + Mega Confetti
        if (nextBadges.length === totalQuestions) {
          setShowTrophyModal(true);
          playFanfareSound();
          setTimeout(() => {
            triggerGrandConfetti();
          }, 200);
        }
      }
    } else {
      // If changed to incorrect, remove badge if it was there
      if (unlockedBadges.includes(q.id)) {
        setUnlockedBadges((prev) => prev.filter((id) => id !== q.id));
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setUnlockedBadges([]);
    setShowTrophyModal(false);
  };

  return (
    <section className="bg-gradient-to-br from-amber-50/40 via-white to-purple-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-8 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Consolidated Chapter 14 Evaluation & Honors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-purple-600 dark:from-amber-400 dark:via-orange-300 dark:to-purple-300 bg-clip-text text-transparent">
            Self-Check Master Quest & Badge Awards
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test your stochastic calculus mastery across the Wiener Process (K4) and Itô’s Lemma (K9). Answer all {totalQuestions} questions correctly to unlock jewel-toned mastery badges and claim the Grand Academic Trophy!
          </p>
        </div>

        <button
          onClick={handleResetQuiz}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 transition-all shadow-xs self-start md:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quest</span>
        </button>
      </div>

      {/* Progress & Badge Trophy Showcase Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-amber-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-indigo-200/80 dark:border-indigo-800/80 rounded-2xl space-y-4 transition-all shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
              Mastery Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {correctCount} / {totalQuestions} Badges Unlocked
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xs">
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          {correctCount === totalQuestions && (
            <button
              onClick={() => {
                setShowTrophyModal(true);
                playFanfareSound();
                triggerGrandConfetti();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer animate-pulse"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>View Grand Trophy Pop-Up 🏆</span>
            </button>
          )}
        </div>

        {/* Rainbow Progress Bar */}
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 via-emerald-500 to-amber-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Badges Ribbon with Distinct Jewel Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {MASTER_QUIZ_QUESTIONS.map((q, idx) => {
            const isUnlocked = unlockedBadges.includes(q.id);
            const badgeThemes = [
              { color: 'border-purple-400 bg-purple-50/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 ring-purple-400/30' },
              { color: 'border-cyan-400 bg-cyan-50/90 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 ring-cyan-400/30' },
              { color: 'border-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 ring-emerald-400/30' },
              { color: 'border-amber-400 bg-amber-50/90 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 ring-amber-400/30' },
              { color: 'border-rose-400 bg-rose-50/90 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 ring-rose-400/30' },
              { color: 'border-blue-400 bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 ring-blue-400/30' },
            ];
            const theme = badgeThemes[idx % badgeThemes.length];

            return (
              <div
                key={q.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isUnlocked
                    ? `${theme.color} shadow-lg ring-2`
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-45 grayscale'
                }`}
              >
                <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-white/80 dark:bg-slate-900/80 shadow-xs' : 'bg-slate-200 dark:bg-slate-800'}`}>
                  {q.badgeIcon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {q.badgeName}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {isUnlocked ? '★ Unlocked' : `Locked (Q${idx + 1})`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PERSISTENT IN-PAGE 100% COMPLETION SUMMARY BANNER */}
      {correctCount === totalQuestions && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border-2 border-amber-400/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 shadow-md shrink-0">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Quest Complete • 6 of 6 Badges Unlocked
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Stochastic Calculus Laureate Trophy Awarded
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Click below to reopen the Grand Trophy pop-up celebration anytime!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowTrophyModal(true);
              playFanfareSound();
              triggerGrandConfetti();
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer shrink-0"
          >
            <Trophy className="w-4 h-4" />
            <span>Open Trophy Pop-Up 🏆</span>
          </button>
        </div>
      )}

      {/* FULL SCREEN GRAND TROPHY CELEBRATION POP-UP MODAL */}
      {showTrophyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowTrophyModal(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Pop-up Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-amber-100/60 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-amber-400 dark:border-amber-500 shadow-2xl shadow-amber-500/30 text-center space-y-6 overflow-hidden animate-in zoom-in-95 duration-300 my-auto"
          >
            {/* Background ambient radial glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setShowTrophyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
              title="Close Trophy Pop-Up"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Giant Glowing Trophy Badge with animated sparkles and floating stars */}
            <div className="relative inline-flex items-center justify-center pt-2">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 dark:bg-amber-500/30 blur-xl animate-pulse" />
              <div className="relative p-5 sm:p-6 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-500 text-white shadow-xl shadow-amber-500/40 border-4 border-amber-200 dark:border-amber-400">
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin duration-1000" />
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>

            {/* Award Title and Subtitle */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-[11px] font-mono font-bold tracking-wider text-amber-800 dark:text-amber-300 uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Academic Excellence Certificate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Financial Mathematics Laureate Award
              </h3>
              <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-amber-600 via-orange-600 to-purple-600 dark:from-amber-400 dark:via-orange-300 dark:to-purple-300 bg-clip-text text-transparent mt-1">
                Grand Master of Chapter 14: Wiener Processes & Itô's Lemma
              </p>
            </div>

            {/* Official Commendation Card */}
            <div className="p-4 sm:p-5 bg-white/80 dark:bg-slate-950/70 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Score: 6 / 6 (100% Perfect Mastery)</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">Hull Ch. 14 Verified</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Outstanding work! You have proven deep mathematical mastery of continuous Markov stochastic processes (<strong>Group A: K4</strong>), square-root diffusion scaling (Var = Δt, SD = √Δt), the stochastic multiplication table ((dz)² = dt), and Jensen's inequality convexity adjustment in lognormal stock returns d(ln S) = (μ - σ²/2)dt + σ dz (<strong>Group B: K9</strong>).
              </p>
            </div>

            {/* 6 Unlocked Badges Showcase Inside the Pop-Up */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-left">
                Your 6 Unlocked Collector Badges
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MASTER_QUIZ_QUESTIONS.map((q, idx) => {
                  const badgeThemes = [
                    'border-purple-300 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
                    'border-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300',
                    'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
                    'border-amber-300 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
                    'border-rose-300 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
                    'border-blue-300 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
                  ];
                  const theme = badgeThemes[idx % badgeThemes.length];
                  return (
                    <div
                      key={q.id}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left shadow-xs ${theme}`}
                    >
                      <div className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 shadow-xs shrink-0">
                        {q.badgeIcon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate">{q.badgeName}</div>
                        <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Unlocked</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pop-up Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  playFanfareSound();
                  triggerGrandConfetti();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Confetti Celebration 🎉</span>
              </button>
              <button
                onClick={() => setShowTrophyModal(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Review Questions & Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-6">
        {MASTER_QUIZ_QUESTIONS.map((q, qIdx) => {
          const selectedOptId = userAnswers[q.id];
          const isAnswered = !!selectedOptId;
          const chosenOption = q.options.find((o) => o.id === selectedOptId);
          const isCorrect = chosenOption?.isCorrect ?? false;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all shadow-md ${
                isCorrect
                  ? 'bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-400 dark:border-emerald-600 shadow-emerald-500/10'
                  : q.topicTag === 'K4: Wiener Process'
                  ? 'bg-gradient-to-br from-cyan-50/40 via-white to-sky-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 border-cyan-200 dark:border-cyan-800/80'
                  : 'bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-amber-200 dark:border-amber-800/80'
              }`}
            >
              {/* Card Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-xl text-white text-xs font-mono font-extrabold flex items-center justify-center shadow-xs ${
                    q.topicTag === 'K4: Wiener Process'
                      ? 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                      : 'bg-gradient-to-tr from-amber-500 to-orange-600'
                  }`}>
                    Q{qIdx + 1}
                  </span>
                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                    q.topicTag === 'K4: Wiener Process'
                      ? 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}>
                    {q.topicTag}
                  </span>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    [{q.difficulty}]
                  </span>
                </div>

                {/* Badge Status Indicator */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isCorrect
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isCorrect ? `★ ${q.badgeName} Unlocked!` : `Earn: ${q.badgeName}`}</span>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed mb-2">
                {q.question}
              </p>

              {q.mathPrompt && (
                <div className="py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono my-3 transition-colors">
                  <MathView math={q.mathPrompt} block className="text-xs sm:text-sm md:text-base text-cyan-800 dark:text-cyan-300 font-bold" />
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                {q.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  let style =
                    'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700';

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      style =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-400/30';
                    } else if (isSelected && !opt.isCorrect) {
                      style =
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-200';
                    } else {
                      style =
                        'bg-slate-100/40 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800/40 text-slate-400 dark:text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q, opt.id)}
                      className={`text-left p-3.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono">
                        {opt.id.toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Feedback */}
              {isAnswered && chosenOption && (
                <div
                  className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                    chosenOption.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    {chosenOption.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-emerald-800 dark:text-emerald-300">
                          Correct! Badge Unlocked: {q.badgeName}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="text-rose-800 dark:text-rose-300">
                          Theoretical Refinement Needed
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-1">{chosenOption.explanation}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <strong className="text-slate-700 dark:text-slate-300">Textbook Reference:</strong> {q.hullContext}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
