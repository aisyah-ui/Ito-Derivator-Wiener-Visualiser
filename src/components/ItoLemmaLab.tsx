import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Puzzle,
  RotateCcw,
  Sliders,
  MoveRight,
  Calculator,
  GitBranch,
  ArrowDown,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { MathView } from './MathView';
import {
  PUZZLE_TERMS,
} from '../data/chapter14Content';
import { ConstantDriftFailureSim } from './ito/ConstantDriftFailureSim';
import { StochasticTaylorConvergenceSim } from './ito/StochasticTaylorConvergenceSim';
import { ForwardContractSim } from './ito/ForwardContractSim';
import { LognormalDerivationCards } from './ito/LognormalDerivationCards';
import { FlowProgressStepper, FlowStep } from './FlowProgressStepper';

const ITO_FLOW_STEPS: FlowStep[] = [
  { id: 'ito-step-1', number: 1, label: 'Stock Dynamics & GBM', shortTitle: '1. GBM Dynamics', badgeColor: 'from-orange-500 to-rose-600', accentHex: '#f97316' },
  { id: 'ito-step-2', number: 2, label: 'The Itô Process', shortTitle: '2. Itô Process', badgeColor: 'from-purple-500 to-indigo-600', accentHex: '#a855f7' },
  { id: 'ito-step-3', number: 3, label: 'Theorem & (dz)²=dt', shortTitle: '3. (dz)²=dt Proof', badgeColor: 'from-emerald-500 to-teal-600', accentHex: '#10b981' },
  { id: 'ito-step-4', number: 4, label: 'Forward Contracts', shortTitle: '4. Forwards', badgeColor: 'from-cyan-500 to-blue-600', accentHex: '#06b6d4' },
  { id: 'ito-step-5', number: 5, label: 'Lognormal Derivation', shortTitle: '5. Lognormal', badgeColor: 'from-pink-500 to-rose-600', accentHex: '#ec4899' },
  { id: 'ito-step-6', number: 6, label: 'Formula Puzzle Workshop', shortTitle: '6. Workshop', badgeColor: 'from-amber-400 via-orange-500 to-pink-500', accentHex: '#eab308' },
];

interface ItoLemmaLabProps {
  onGoToQuiz?: () => void;
}

export const ItoLemmaLab: React.FC<ItoLemmaLabProps> = ({ onGoToQuiz }) => {
  // --- Stage 02 State-dependent Itô Process Sandbox ---
  const [stateX, setStateX] = useState<number>(20);
  const driftA = 0.05 * stateX; // a(x) = 0.05 * x
  const volB = 0.2 * stateX; // b(x) = 0.2 * x

  // --- Stage 06 Puzzle Builder State ---
  const [placedSlots, setPlacedSlots] = useState<{
    slotDrift: string | null;
    slotTheta: string | null;
    slotConvexity: string | null;
    slotDiffusion: string | null;
  }>({
    slotDrift: null,
    slotTheta: null,
    slotConvexity: null,
    slotDiffusion: null,
  });

  const [puzzleCompleted, setPuzzleCompleted] = useState<boolean>(false);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  const checkPuzzle = (updatedSlots: typeof placedSlots) => {
    const isComplete =
      updatedSlots.slotDrift === 'term-first-deriv' &&
      updatedSlots.slotTheta === 'term-time-decay' &&
      updatedSlots.slotConvexity === 'term-ito-correction' &&
      updatedSlots.slotDiffusion === 'term-stochastic-shock';

    if (isComplete && !puzzleCompleted) {
      setPuzzleCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePlaceTerm = (slotKey: keyof typeof placedSlots, termId: string) => {
    const updated = { ...placedSlots, [slotKey]: termId };
    setPlacedSlots(updated);
    setSelectedTermId(null);
    checkPuzzle(updated);
  };

  const handleClearSlot = (slotKey: keyof typeof placedSlots) => {
    const updated = { ...placedSlots, [slotKey]: null };
    setPlacedSlots(updated);
    setPuzzleCompleted(false);
  };

  const handleResetPuzzle = () => {
    setPlacedSlots({
      slotDrift: null,
      slotTheta: null,
      slotConvexity: null,
      slotDiffusion: null,
    });
    setPuzzleCompleted(false);
    setSelectedTermId(null);
  };

  // --- Stage 06 Parameter Simulator ---
  const [paramMu, setParamMu] = useState<number>(0.15); // 15% drift
  const [paramSigma, setParamSigma] = useState<number>(0.30); // 30% volatility
  const itoCorrectionValue = 0.5 * paramSigma * paramSigma;
  const geometricGrowthRate = paramMu - itoCorrectionValue;

  const scrollToStep = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 transition-colors">
      {/* Topic Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-white via-amber-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <GitBranch className="w-4 h-4" />
              <span>Chapter 14 · Group B Element (K9)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              Itô's Lemma Learning Stream
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Explore the calculus of stochastic processes arranged as a continuous <strong>downward learning river</strong>. Follow the mathematical journey from stock price dynamics to Itô's formula, the discovery that <MathView math="(dz)^2 = dt" />, forward contract pricing, and the derivation of lognormal stock returns.
            </p>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-amber-800 dark:text-amber-300 self-start md:self-center shadow-sm">
            Hull Ch. 14.3 – 14.7 (p. 322–330)
          </div>
        </div>

        {/* Downward Roadmap Quick-Jump Buttons with Colorful Accents */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase mr-1">Quick Jump:</span>
          {[
            { id: 'ito-step-1', label: '1. Stock Dynamics (GBM)', color: 'hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400' },
            { id: 'ito-step-2', label: '2. The Itô Process', color: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400' },
            { id: 'ito-step-3', label: '3. (dz)² = dt Proof', color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400' },
            { id: 'ito-step-4', label: '4. Forward Contracts', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
            { id: 'ito-step-5', label: '5. Lognormal Proof', color: 'hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400' },
            { id: 'ito-step-6', label: '6. Formula Workshop', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => scrollToStep(pill.id)}
              className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer shadow-xs ${pill.color}`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Sticky Progress Stepper */}
      <FlowProgressStepper
        steps={ITO_FLOW_STEPS}
        topicColor="amber"
        topicLabel="Itô's Lemma (K9)"
      />

      {/* CONTINUOUS DOWNWARD FLOW STREAM */}
      <div className="relative pl-6 sm:pl-10 space-y-16">
        {/* Continuous Left Vertical Flow Spine - Rainbow Gradient */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-1.5 bg-gradient-to-b from-orange-400 via-purple-500 via-emerald-400 via-cyan-400 via-pink-500 to-amber-400 rounded-full shadow-sm shadow-orange-500/20" />

        {/* ================= STAGE 01: ECONOMIC FOUNDATIONS (ORANGE/CORAL) ================= */}
        <div id="ito-step-1" className="relative group scroll-mt-24">
          {/* Milestone Node on Spine */}
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-orange-500/30">
            01
          </div>

          <div className="bg-gradient-to-br from-orange-50/50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 border-2 border-orange-300/80 dark:border-orange-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-orange-500 space-y-6">
            <div className="border-b border-orange-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-orange-600 dark:text-orange-400 font-extrabold block mb-1">
                Stage 01 · Economic Foundations
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Why Constant Drift Fails: Stock Prices & Geometric Brownian Motion (Hull 14.3)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Why a constant dollar drift <MathView math="dx = a \, dt + b \, dz" /> fails for stock prices, and why returns must scale proportionally with price.
              </p>
            </div>

            {/* Interactive Constant Drift Failure vs GBM Simulator */}
            <ConstantDriftFailureSim />

            <div className="p-4 bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 rounded-2xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <strong className="text-orange-900 dark:text-orange-300 block text-sm font-mono text-center">
                The Geometric Brownian Motion (GBM) Formula:
              </strong>
              <div className="py-2 text-center font-mono text-base text-orange-800 dark:text-orange-300 font-bold">
                <MathView math="dS = \mu S \, dt + \sigma S \, dz \iff \dfrac{dS}{S} = \mu \, dt + \sigma \, dz" block />
              </div>
              <p className="leading-relaxed">
                As John Hull explains on page 323: in a small interval <MathView math="\Delta t" />, the expected proportional return is <MathView math="\mu \Delta t" /> and the standard deviation of return is <MathView math="\sigma \sqrt{\Delta t}" />. Stock volatility <MathView math="\sigma" /> is percentage volatility!
              </p>
            </div>
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-purple-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STAGE 02: THE ITÔ PROCESS (PURPLE) ================= */}
        <div id="ito-step-2" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-purple-500/30">
            02
          </div>

          <div className="bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20 border-2 border-purple-300/80 dark:border-purple-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-purple-500 space-y-6">
            <div className="border-b border-purple-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-purple-600 dark:text-purple-400 font-extrabold block mb-1">
                Stage 02 · State-Dependent Dynamics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                The Itô Process: State & Time Dependent Parameters (Hull 14.2 & Slide 22)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                In a generalized Itô process, the drift and diffusion coefficients are continuous functions of state <MathView math="x" /> and time <MathView math="t" />.
              </p>
            </div>

            {/* Prominent Formula Highlight Banner */}
            <div className="p-4 bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl text-center space-y-2">
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 block uppercase">
                General Itô Process Definition (Hull Equation 14.11)
              </span>
              <MathView
                math="dx = a(x, t)\,dt + b(x, t)\,dz"
                block
                className="text-lg sm:text-xl text-purple-900 dark:text-purple-200 font-mono font-bold"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Where <MathView math="dx" /> is the change over interval <MathView math="dt" />, with state-dependent drift <MathView math="a(x, t)" /> and volatility <MathView math="b(x, t)" /> driven by Wiener increment <MathView math="dz" />.
              </p>
            </div>

            {/* Interactive Vector Indicator for Itô Process */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-purple-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 uppercase">Live State Parameter Explorer:</span>
                    <MathView math="dx = a(x,t)\,dt + b(x,t)\,dz" className="text-purple-600 dark:text-purple-400 font-bold" />
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <span>Current State:</span>
                  <MathView math={`x = ${stateX}`} className="text-purple-600 dark:text-purple-400 font-bold" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">State Variable <MathView math="x" /> Level</span>
                  <span>{stateX} units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={stateX}
                  onChange={(e) => setStateX(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              {/* Dynamic Vector Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="uppercase">Instantaneous Drift Vector</span>
                    <MathView math="a(x, t) = 0.05 \times x" className="text-purple-600 dark:text-purple-400 font-bold" />
                  </div>
                  <div className="flex items-center gap-2 text-base font-bold text-purple-600 dark:text-purple-400 font-mono">
                    <MoveRight className="w-5 h-5 text-purple-500" />
                    <span>+{driftA.toFixed(2)} units / yr</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-purple-500 transition-all duration-200"
                      style={{ width: `${(driftA / 2.5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="uppercase">Instantaneous Volatility</span>
                    <MathView math="b(x, t) = 0.20 \times x" className="text-cyan-600 dark:text-cyan-400 font-bold" />
                  </div>
                  <div className="flex items-center gap-2 text-base font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                    <span className="text-cyan-500 font-bold">±</span>
                    <span>{volB.toFixed(2)} units (Var = {(volB * volB).toFixed(1)})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-200"
                      style={{ width: `${(volB / 10.0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Markov Consistency:</strong> Notice that even though <MathView math="a(x,t)" /> and <MathView math="b(x,t)" /> change dynamically, they depend <em>strictly</em> on the current state <MathView math="x" /> at time <MathView math="t" />, not on prior trajectory history.
              </p>
            </div>
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-emerald-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STAGE 03: THEOREM & (dz)^2 = dt (EMERALD) ================= */}
        <div id="ito-step-3" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-emerald-500/30">
            03
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-emerald-300/80 dark:border-emerald-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-emerald-500 space-y-6">
            <div className="border-b border-emerald-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-extrabold block mb-1">
                Stage 03 · The Stochastic Calculus Miracle
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                <span>Itô's Lemma Theorem & The Proof that</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  <MathView math="(dz)^2 = dt" className="text-xl sm:text-2xl font-bold" />
                </span>
                <span className="text-slate-500 font-normal text-sm sm:text-base">(Hull p. 327, Slide 36)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                In classical calculus, <MathView math="(dx)^2 \to 0" />. In stochastic calculus, <MathView math="(\Delta z)^2 = \epsilon^2 \Delta t" /> has non-zero expected value, and by the Law of Large Numbers its variance vanishes to zero: <MathView math="(dz)^2 = dt" />!
              </p>
            </div>

            {/* Interactive LLN Convergence Simulator */}
            <StochasticTaylorConvergenceSim />

            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold block">
                The Master Formula (Hull Equation 14.12)
              </span>
              <MathView
                math="dG = \left[ \dfrac{\partial G}{\partial x} a + \dfrac{\partial G}{\partial t} + \dfrac{1}{2} \, \dfrac{\partial^2 G}{\partial x^2} \, b^2 \right] dt + \dfrac{\partial G}{\partial x} \, b \, dz"
                block
                className="text-base sm:text-lg text-emerald-900 dark:text-emerald-300 font-mono font-bold"
              />
            </div>
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-cyan-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STAGE 04: FORWARD CONTRACTS (CYAN) ================= */}
        <div id="ito-step-4" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-cyan-500/30">
            04
          </div>

          <div className="bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 border-2 border-cyan-300/80 dark:border-cyan-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-cyan-500 space-y-6">
            <div className="border-b border-cyan-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 font-extrabold block mb-1">
                Stage 04 · Financial Derivative Application
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2.5">
                <span>Application to Forward Contracts:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-xl bg-cyan-100/70 dark:bg-cyan-950/70 border border-cyan-300 dark:border-cyan-700/80 text-cyan-800 dark:text-cyan-300 shadow-sm font-mono">
                  <MathView math="F = S \cdot e^{r(T - t)}" className="text-lg sm:text-xl font-bold text-cyan-700 dark:text-cyan-300" />
                </span>
                <span className="text-slate-500 font-normal text-sm sm:text-base">(Hull p. 328)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                See how partial derivatives with respect to price and time combine to reveal that forward contracts also follow geometric Brownian motion with expected return <MathView math="(\mu - r)" />.
              </p>
            </div>

            {/* Interactive Forward Contract Simulator */}
            <ForwardContractSim />
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-pink-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STAGE 05: LOGNORMAL DERIVATION (PINK) ================= */}
        <div id="ito-step-5" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-pink-500/30">
            05
          </div>

          <div className="bg-gradient-to-br from-pink-50/50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-pink-950/20 border-2 border-pink-300/80 dark:border-pink-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-pink-500 space-y-6">
            <div className="border-b border-pink-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-pink-600 dark:text-pink-400 font-extrabold block mb-1">
                Stage 05 · The Landmark Proof
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step-by-Step Derivation of the Lognormal Property: G = ln S (Hull 14.7)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Follow each partial derivative step and watch how second-order curvature cancels the underlying price <MathView math="S" />, introducing the fundamental volatility drag <MathView math="-\frac{1}{2}\sigma^2" />.
              </p>
            </div>

            {/* Interactive Lognormal Derivation Cards */}
            <LognormalDerivationCards />
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-amber-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STAGE 06: PUZZLE & WORKSHOP (AMBER/GOLD) ================= */}
        <div id="ito-step-6" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-orange-500/30">
            06
          </div>

          <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-amber-500 space-y-8">
            <div className="border-b border-amber-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-extrabold block mb-1">
                Stage 06 · Interactive Formula Workshop
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Interactive Itô Equation Assembler & Volatility Drag Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Assemble the full Itô expansion formula piece by piece, and interact with the live growth rate calculator to see how volatility lowers geometric compounding.
              </p>
            </div>

            {/* Puzzle Box */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Assemble Itô's Total Differential Formula
                  </h4>
                </div>
                <button
                  onClick={handleResetPuzzle}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Target Equation Display with Drop Slots */}
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm sm:text-base font-mono">
                  <span className="font-bold text-amber-600 dark:text-amber-400">dG = [</span>

                  {/* Slot 1: Drift */}
                  <div
                    onClick={() => {
                      if (selectedTermId) handlePlaceTerm('slotDrift', selectedTermId);
                      else if (placedSlots.slotDrift) handleClearSlot('slotDrift');
                    }}
                    className={`min-w-[130px] min-h-[3.8rem] py-1 px-3 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                      placedSlots.slotDrift === 'term-first-deriv'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : placedSlots.slotDrift
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : selectedTermId
                        ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {placedSlots.slotDrift ? (
                      <MathView math={PUZZLE_TERMS.find((t) => t.id === placedSlots.slotDrift)?.latex || ''} block className="text-xs sm:text-sm" />
                    ) : (
                      <span className="text-[11px] font-sans font-medium">State Drift</span>
                    )}
                  </div>

                  <span className="text-slate-400 font-bold">+</span>

                  {/* Slot 2: Theta */}
                  <div
                    onClick={() => {
                      if (selectedTermId) handlePlaceTerm('slotTheta', selectedTermId);
                      else if (placedSlots.slotTheta) handleClearSlot('slotTheta');
                    }}
                    className={`min-w-[100px] min-h-[3.8rem] py-1 px-3 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                      placedSlots.slotTheta === 'term-time-decay'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : placedSlots.slotTheta
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : selectedTermId
                        ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {placedSlots.slotTheta ? (
                      <MathView math={PUZZLE_TERMS.find((t) => t.id === placedSlots.slotTheta)?.latex || ''} block className="text-xs sm:text-sm" />
                    ) : (
                      <span className="text-[11px] font-sans font-medium">Time Decay</span>
                    )}
                  </div>

                  <span className="text-slate-400 font-bold">+</span>

                  {/* Slot 3: Convexity */}
                  <div
                    onClick={() => {
                      if (selectedTermId) handlePlaceTerm('slotConvexity', selectedTermId);
                      else if (placedSlots.slotConvexity) handleClearSlot('slotConvexity');
                    }}
                    className={`min-w-[140px] min-h-[3.8rem] py-1 px-3 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                      placedSlots.slotConvexity === 'term-ito-correction'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : placedSlots.slotConvexity
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : selectedTermId
                        ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {placedSlots.slotConvexity ? (
                      <MathView math={PUZZLE_TERMS.find((t) => t.id === placedSlots.slotConvexity)?.latex || ''} block className="text-xs sm:text-sm" />
                    ) : (
                      <span className="text-[11px] font-sans font-medium">Itô Convexity</span>
                    )}
                  </div>

                  <span className="font-bold text-amber-600 dark:text-amber-400">] dt +</span>

                  {/* Slot 4: Diffusion */}
                  <div
                    onClick={() => {
                      if (selectedTermId) handlePlaceTerm('slotDiffusion', selectedTermId);
                      else if (placedSlots.slotDiffusion) handleClearSlot('slotDiffusion');
                    }}
                    className={`min-w-[130px] min-h-[3.8rem] py-1 px-3 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                      placedSlots.slotDiffusion === 'term-stochastic-shock'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : placedSlots.slotDiffusion
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : selectedTermId
                        ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {placedSlots.slotDiffusion ? (
                      <MathView math={PUZZLE_TERMS.find((t) => t.id === placedSlots.slotDiffusion)?.latex || ''} block className="text-xs sm:text-sm" />
                    ) : (
                      <span className="text-[11px] font-sans font-medium">Diffusion</span>
                    )}
                  </div>

                  <span className="font-bold text-cyan-600 dark:text-cyan-400">dz</span>
                </div>
              </div>

              {/* Reservoir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PUZZLE_TERMS.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => setSelectedTermId(term.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTermId === term.id
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="py-2 px-1 text-center bg-slate-50 dark:bg-slate-950 rounded-lg mb-1.5 flex items-center justify-center min-h-[3.25rem]">
                      <MathView math={term.latex} block className="text-xs font-mono text-amber-700 dark:text-amber-300" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{term.name}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{term.description}</span>
                  </button>
                ))}
              </div>

              {puzzleCompleted && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>All Itô terms positioned correctly! You have mastered the formula architecture.</span>
                </div>
              )}
            </div>

            {/* Live Parameter Calculator */}
            <div className="p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h5 className="text-xs font-mono uppercase font-bold text-slate-900 dark:text-white">
                  Live Growth Rate Simulator: Expected Return (μ) vs Continuously Compounded (μ - σ²/2)
                </h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-mono mb-1">
                    <span>Expected Return (μ)</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">{(paramMu * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.30"
                    step="0.01"
                    value={paramMu}
                    onChange={(e) => setParamMu(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-mono mb-1">
                    <span>Volatility (σ)</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-300">{(paramSigma * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.80"
                    step="0.01"
                    value={paramSigma}
                    onChange={(e) => setParamSigma(parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Arithmetic (μ)</span>
                  <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">+{(paramMu * 100).toFixed(2)}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Drag (-σ²/2)</span>
                  <span className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">-{(itoCorrectionValue * 100).toFixed(2)}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Geometric Growth</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{(geometricGrowthRate * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMPLETION CALLOUT ================= */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-300/40 dark:border-amber-800/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Completed the Itô's Lemma Stream!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                You've mastered proportional price dynamics, the stochastic Taylor expansion, the (dz)² = dt identity, and lognormal returns. Put your knowledge to the test in the Self-Check Quest!
              </p>
            </div>
          </div>
          <button
            onClick={onGoToQuiz}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trophy className="w-4 h-4" />
            <span>Go to Self-Check Quest (Earn Badges & Trophy)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
