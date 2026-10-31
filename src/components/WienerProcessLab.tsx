import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  TrendingUp,
  Brain,
  Activity,
  Compass,
  ArrowDown,
  Trophy,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MathView } from './MathView';
import { useTheme } from '../context/ThemeContext';
import { DiscreteVsContinuousSim } from './wiener/DiscreteVsContinuousSim';
import { MarkovMemorylessSim } from './wiener/MarkovMemorylessSim';
import { VarianceAdderSim } from './wiener/VarianceAdderSim';
import { FractalLimitSim } from './wiener/FractalLimitSim';
import { GeneralizedWienerSim } from './wiener/GeneralizedWienerSim';
import { FlowProgressStepper, FlowStep } from './FlowProgressStepper';

const WIENER_FLOW_STEPS: FlowStep[] = [
  { id: 'wiener-step-1', number: 1, label: 'Continuous vs Discrete', shortTitle: '1. Foundations', badgeColor: 'from-cyan-500 to-blue-600', accentHex: '#06b6d4' },
  { id: 'wiener-step-2', number: 2, label: 'The Markov Property', shortTitle: '2. Markov', badgeColor: 'from-purple-500 to-indigo-600', accentHex: '#a855f7' },
  { id: 'wiener-step-3', number: 3, label: 'Additive Variances (√T)', shortTitle: '3. Additive Var', badgeColor: 'from-emerald-500 to-teal-600', accentHex: '#10b981' },
  { id: 'wiener-step-4', number: 4, label: 'Basic Process & Limit', shortTitle: '4. Basic Process', badgeColor: 'from-rose-500 to-pink-600', accentHex: '#f43f5e' },
  { id: 'wiener-step-5', number: 5, label: 'Generalized Process', shortTitle: '5. Generalized', badgeColor: 'from-amber-500 to-orange-600', accentHex: '#f59e0b' },
  { id: 'wiener-step-6', number: 6, label: 'Shock & Multi-Path Simulator', shortTitle: '6. Live Simulator', badgeColor: 'from-indigo-600 to-cyan-500', accentHex: '#6366f1' },
];

function generateGaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface WienerProcessLabProps {
  onGoToQuiz?: () => void;
}

export const WienerProcessLab: React.FC<WienerProcessLabProps> = ({ onGoToQuiz }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // --- Step 6 Simulator States ---
  const [epsilon, setEpsilon] = useState<number>(1.25);
  const [deltaT, setDeltaT] = useState<number>(0.04);
  const sqrtDeltaT = Math.sqrt(deltaT);
  const deltaZ = epsilon * sqrtDeltaT;

  const [pathCount, setPathCount] = useState<number>(15);
  const [horizonT, setHorizonT] = useState<number>(1.0);
  const [steps, setSteps] = useState<number>(100);
  const [showEnvelopes, setShowEnvelopes] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(100);

  const [simPaths, setSimPaths] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateNewPaths = useCallback(() => {
    const dt = horizonT / steps;
    const sqDt = Math.sqrt(dt);
    const newPaths: number[][] = [];

    for (let p = 0; p < pathCount; p++) {
      const path: number[] = [0];
      let currentZ = 0;
      for (let s = 1; s <= steps; s++) {
        const eps = generateGaussian();
        currentZ += eps * sqDt;
        path.push(currentZ);
      }
      newPaths.push(path);
    }

    setSimPaths(newPaths);
    setActiveStepIndex(steps);
  }, [horizonT, steps, pathCount]);

  useEffect(() => {
    generateNewPaths();
  }, [generateNewPaths]);

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      animId = window.setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps) return 1;
          return prev + 1;
        });
      }, 50);
    }
    return () => {
      if (animId) clearInterval(animId);
    };
  }, [isPlaying, steps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || simPaths.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const axisColor = isDark ? '#475569' : '#94a3b8';
    const textColor = '#64748b';
    const envelopeFill = isDark ? 'rgba(14, 165, 233, 0.05)' : 'rgba(2, 132, 199, 0.08)';
    const envelope2SdStroke = isDark ? 'rgba(14, 165, 233, 0.4)' : 'rgba(2, 132, 199, 0.45)';
    const envelope1SdStroke = isDark ? 'rgba(56, 189, 248, 0.8)' : '#0284c7';
    const leadPathColor = isDark ? '#38bdf8' : '#0284c7';

    const padLeft = 45;
    const padRight = 50;
    const padTop = 25;
    const padBottom = 35;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    const maxZ = Math.max(2.6, 2.8 * Math.sqrt(horizonT));
    const minZ = -maxZ;

    const tToX = (t: number) => padLeft + (t / horizonT) * plotWidth;
    const zToY = (z: number) => padTop + ((maxZ - z) / (maxZ - minZ)) * plotHeight;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const zSteps = [-2, -1, 0, 1, 2];
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    zSteps.forEach((zVal) => {
      if (zVal >= minZ && zVal <= maxZ) {
        const y = zToY(zVal);
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();
        ctx.fillText(zVal.toFixed(1), padLeft - 8, y + 4);
      }
    });

    const zeroY = zToY(0);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, zeroY);
    ctx.lineTo(width - padRight, zeroY);
    ctx.stroke();

    const tIntervals = 5;
    ctx.textAlign = 'center';
    for (let i = 0; i <= tIntervals; i++) {
      const tVal = (horizonT * i) / tIntervals;
      const x = tToX(tVal);
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, height - padBottom);
      ctx.stroke();
      ctx.fillText(`${tVal.toFixed(2)}y`, x, height - padBottom + 16);
    }

    if (showEnvelopes) {
      ctx.fillStyle = envelopeFill;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(2 * Math.sqrt(t));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(-2 * Math.sqrt(t));
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = envelope2SdStroke;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(2 * Math.sqrt(t));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(-2 * Math.sqrt(t));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = envelope1SdStroke;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(Math.sqrt(t));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (horizonT * i) / steps;
        const x = tToX(t);
        const y = zToY(-Math.sqrt(t));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const currentStepIndexVal = Math.min(activeStepIndex, steps);
    simPaths.forEach((path, idx) => {
      ctx.beginPath();
      const isLead = idx === 0;
      ctx.lineWidth = isLead ? 2.5 : 1.2;
      ctx.strokeStyle = isLead
        ? leadPathColor
        : isDark
        ? `hsla(${(idx * 37) % 360}, 75%, 65%, 0.35)`
        : `hsla(${(idx * 37) % 360}, 65%, 45%, 0.30)`;

      for (let s = 0; s <= currentStepIndexVal; s++) {
        const t = (horizonT * s) / steps;
        const z = path[s];
        const x = tToX(t);
        const y = zToY(z);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isLead && currentStepIndexVal > 0) {
        const headT = (horizonT * currentStepIndexVal) / steps;
        const headZ = path[currentStepIndexVal];
        ctx.fillStyle = leadPathColor;
        ctx.beginPath();
        ctx.arc(tToX(headT), zToY(headZ), 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    if (activeStepIndex === steps) {
      const rightX = width - padRight + 6;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.textAlign = 'left';
      const sdVal = Math.sqrt(horizonT);
      ctx.fillText(`+1σ = +${sdVal.toFixed(2)}`, rightX, zToY(sdVal) + 3);
      ctx.fillText(`-1σ = -${sdVal.toFixed(2)}`, rightX, zToY(-sdVal) + 3);
    }
  }, [simPaths, activeStepIndex, horizonT, steps, showEnvelopes, isDark]);

  const scrollToStep = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 transition-colors">
      {/* Topic Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-white via-cyan-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/30 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Chapter 14 · Group A Element (K4)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              The Wiener Process Learning Stream
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Experience the complete theory arranged as a continuous <strong>downward learning river</strong>. Scroll down or click any stage to dive into interactive simulations, real-time memoryless tests, additive variance blocks, and fractal paths.
            </p>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-cyan-800 dark:text-cyan-300 self-start md:self-center shadow-sm">
            Hull Ch. 14.1 – 14.2
          </div>
        </div>

        {/* Downward Roadmap Quick-Jump Pills with Colorful Hover & Accents */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase mr-1">Quick Jump:</span>
          {[
            { id: 'wiener-step-1', label: '1. Foundations', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
            { id: 'wiener-step-2', label: '2. Markov Property', color: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400' },
            { id: 'wiener-step-3', label: '3. Additive Variances', color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400' },
            { id: 'wiener-step-4', label: '4. Basic Process', color: 'hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400' },
            { id: 'wiener-step-5', label: '5. Generalized Process', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
            { id: 'wiener-step-6', label: '6. Live Simulator', color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
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
        steps={WIENER_FLOW_STEPS}
        topicColor="cyan"
        topicLabel="Wiener Process (K4)"
      />

      {/* CONTINUOUS DOWNWARD FLOW STREAM */}
      <div className="relative pl-6 sm:pl-10 space-y-16">
        {/* Continuous Left Vertical Flow Spine - Rainbow Gradient */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-1.5 bg-gradient-to-b from-cyan-400 via-purple-500 via-emerald-400 via-rose-500 via-amber-400 to-indigo-500 rounded-full shadow-sm shadow-cyan-500/20" />

        {/* ================= STEP 1: FOUNDATIONS (CYAN) ================= */}
        <div id="wiener-step-1" className="relative group scroll-mt-24">
          {/* Milestone Node on Spine */}
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-cyan-500/30">
            01
          </div>

          <div className="bg-gradient-to-br from-cyan-50/50 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 border-2 border-cyan-300/80 dark:border-cyan-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-cyan-500 space-y-6">
            <div className="border-b border-cyan-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 font-extrabold block mb-1">
                Stage 01 · Conceptual Foundations
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Stochastic Processes: Discrete vs Continuous (Hull p. 316)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Any variable changing unpredictably over time is stochastic. See in real time how discrete steps transform into continuous waves as <MathView math="\Delta t \to 0" />.
              </p>
            </div>

            {/* Interactive Sampling Simulator */}
            <DiscreteVsContinuousSim />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-sm">
                  Time Domain Dimension
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Discrete-Time:</strong> Changes occur only at specified intervals (e.g., daily market close).<br />
                  <strong>Continuous-Time:</strong> Changes occur smoothly at every infinitesimal tick <MathView math="\Delta t \to 0" />.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-sm">
                  State Space Dimension
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Discrete-Variable:</strong> Restricted to fixed ticks (e.g., cent increments).<br />
                  <strong>Continuous-Variable:</strong> Can take any real value on the continuous spectrum.
                </p>
              </div>
            </div>
          </div>

          {/* Downward Connector Arrow */}
          <div className="flex items-center justify-center py-4 text-purple-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STEP 2: MARKOV PROPERTY (PURPLE) ================= */}
        <div id="wiener-step-2" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-purple-500/30">
            02
          </div>

          <div className="bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20 border-2 border-purple-300/80 dark:border-purple-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-purple-500 space-y-6">
            <div className="border-b border-purple-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-purple-600 dark:text-purple-400 font-extrabold block mb-1">
                Stage 02 · Memoryless Mechanics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                The Markov Property & Market Efficiency (Hull Section 14.1)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore John Hull's classic $100 stock price experiment: past history is completely forgotten.
              </p>
            </div>

            {/* Interactive Memoryless Simulator */}
            <MarkovMemorylessSim />

            <div className="p-4 bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <strong className="text-purple-900 dark:text-purple-300 block text-sm font-mono">
                Mathematical Definition of Markov Condition:
              </strong>
              <div className="py-2 text-center font-mono text-purple-800 dark:text-purple-300 font-bold">
                <MathView math="P(z_{t+s} \le x \mid z_u, 0 \le u \le t) = P(z_{t+s} \le x \mid z_t)" />
              </div>
              <p className="leading-relaxed">
                Notice in the simulation above: whether the stock rallied from $60 or plunged from $140 to reach $100, the future probability cone is <strong>100% identical</strong>. The past path imparts zero momentum. This underpins Weak-Form Market Efficiency.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center py-4 text-emerald-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STEP 3: ADDITIVE VARIANCES (EMERALD) ================= */}
        <div id="wiener-step-3" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-emerald-500/30">
            03
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-emerald-300/80 dark:border-emerald-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-emerald-500 space-y-6">
            <div className="border-b border-emerald-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-extrabold block mb-1">
                Stage 03 · Statistical Mechanics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Variances are Additive, Standard Deviations Scale with √T (Slides 10–11)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Stack independent time horizons and observe why financial uncertainty expands with <MathView math="\sqrt{T}" /> rather than linearly.
              </p>
            </div>

            {/* Interactive Variance Block Simulator */}
            <VarianceAdderSim />

            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <strong className="text-emerald-900 dark:text-emerald-300 block font-semibold">
                Hull's Fundamental Principle (Slide 10):
              </strong>
              <div className="py-2 text-center font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                <MathView math="\text{Var}(z(T) - z(0)) = \sum_{i=1}^N \Delta t = T \implies \text{SD}(z(T) - z(0)) = \sqrt{T}" />
              </div>
              <p className="leading-relaxed">
                Because increments across non-overlapping intervals are independent (Markov property), their variances add directly. Over 4 years, variance is 4.0, which means risk (standard deviation) is <MathView math="\sqrt{4} = 2.0" />, doubling rather than quadrupling!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center py-4 text-rose-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STEP 4: BASIC WIENER PROCESS (ROSE) ================= */}
        <div id="wiener-step-4" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-rose-500/30">
            04
          </div>

          <div className="bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 border-2 border-rose-300/80 dark:border-rose-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-rose-500 space-y-6">
            <div className="border-b border-rose-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-rose-600 dark:text-rose-400 font-extrabold block mb-1">
                Stage 04 · Textbook Figure 14.1
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                The Basic Wiener Process Equation & Continuous Fractal Limit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Watch the process become infinitely jagged everywhere as <MathView math="\Delta t \to 0" /> (Hull p. 318–320).
              </p>
            </div>

            {/* Interactive Hull Figure 14.1 */}
            <FractalLimitSim />

            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <span className="text-xs font-mono uppercase text-rose-600 dark:text-rose-400 font-bold block">
                Fundamental Definition (Hull Equation 14.1)
              </span>
              <MathView
                math="\Delta z = \epsilon \sqrt{\Delta t}, \quad \epsilon \sim \phi(0, 1)"
                block
                className="text-xl md:text-2xl text-rose-800 dark:text-rose-300 font-mono font-bold"
              />
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1 font-semibold">
                <span className="text-rose-700 dark:text-rose-300">Mean = 0</span>
                <span>·</span>
                <span className="text-rose-700 dark:text-rose-300">Variance = Δt</span>
                <span>·</span>
                <span className="text-rose-700 dark:text-rose-300">Standard Deviation = √Δt</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center py-4 text-amber-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STEP 5: GENERALIZED WIENER PROCESS (AMBER) ================= */}
        <div id="wiener-step-5" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-amber-500/30">
            05
          </div>

          <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-amber-500 space-y-6">
            <div className="border-b border-amber-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-extrabold block mb-1">
                Stage 05 · Textbook Figure 14.2
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Generalized Wiener Process: Drift Velocity vs Noise Band
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Drag the drift rate <MathView math="a" /> and noise scale <MathView math="b" /> to see how <MathView math="dx = a dt + b dz" /> oscillates around the deterministic trend line.
              </p>
            </div>

            {/* Interactive Hull Figure 14.2 */}
            <GeneralizedWienerSim />
          </div>

          <div className="flex items-center justify-center py-4 text-indigo-500">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* ================= STEP 6: LIVE MULTI-PATH SANDBOX (INDIGO) ================= */}
        <div id="wiener-step-6" className="relative group scroll-mt-24">
          <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-mono font-extrabold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-950 shadow-lg shadow-cyan-500/30">
            06
          </div>

          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-indigo-300/80 dark:border-indigo-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md transition-all hover:border-indigo-500 space-y-6">
            <div className="border-b border-indigo-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase text-indigo-600 dark:text-indigo-400 font-extrabold block mb-1">
                Stage 06 · Full Interactive Sandbox
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Wiener Shock Visualiser & Multi-Path Diffusion Canvas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manipulate micro-shocks <MathView math="\epsilon" /> and interval <MathView math="\Delta t" /> to directly perceive why volatility dwarfs deterministic drift over short horizons.
              </p>
            </div>

            {/* Micro-shock sliders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Micro-Shock Parameters</span>
                  <button
                    onClick={() => setEpsilon(parseFloat(generateGaussian().toFixed(2)))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-950/50 dark:hover:bg-cyan-900/50 border border-cyan-300 dark:border-cyan-800/50 rounded-md transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Randomize ε
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Gaussian Shock (ε)</span>
                    <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{epsilon > 0 ? `+${epsilon.toFixed(2)}` : epsilon.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.05"
                    value={epsilon}
                    onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Time Interval (Δt)</span>
                    <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{deltaT.toFixed(4)} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.25"
                    step="0.002"
                    value={deltaT}
                    onChange={(e) => setDeltaT(parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/30 rounded text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-cyan-800 dark:text-cyan-400 block mb-0.5">Scale Disparity:</span>
                  <p>
                    <MathView math={`\\Delta t = ${deltaT.toFixed(4)}`} /> vs <MathView math={`\\sqrt{\\Delta t} = ${sqrtDeltaT.toFixed(4)}`} />.
                    The standard deviation is <span className="text-cyan-700 dark:text-cyan-300 font-bold font-mono">{(sqrtDeltaT / deltaT).toFixed(1)}× larger</span>!
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-500 block mb-1">
                    Live Formula Evaluation
                  </span>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-center font-mono my-2">
                    <MathView
                      math={`\\Delta z = (${epsilon > 0 ? '+' : ''}${epsilon.toFixed(2)}) \\times \\sqrt{${deltaT.toFixed(4)}} = ${deltaZ > 0 ? '+' : ''}${deltaZ.toFixed(4)}`}
                      className="text-base sm:text-lg text-cyan-700 dark:text-cyan-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">E[Δz]</span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">0.0</span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Var(Δz)</span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{deltaT.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">SD(Δz)</span>
                    <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">{sqrtDeltaT.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Multi-path Area */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Diffusion Envelope Canvas: <MathView math="\pm \sqrt{t}" /> (68.3%) & <MathView math="\pm 2\sqrt{t}" /> (95.4%)
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Animate Paths'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      generateNewPaths();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resimulate</span>
                  </button>
                </div>
              </div>

              <div className="relative bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-2">
                <canvas ref={canvasRef} width={900} height={350} className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMPLETION CALLOUT ================= */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-amber-500/10 border border-cyan-300/40 dark:border-cyan-800/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-xl text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Completed the Wiener Process Stream!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                You've traversed continuous modeling, Markov memorylessness, additive variances, and stochastic diffusion. Ready to test your mastery?
              </p>
            </div>
          </div>
          <button
            onClick={onGoToQuiz}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trophy className="w-4 h-4" />
            <span>Go to Self-Check Quest (Earn Badges)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
