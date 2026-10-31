import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WienerProcessLab } from './components/WienerProcessLab';
import { ItoLemmaLab } from './components/ItoLemmaLab';
import { MasterQuizSection } from './components/MasterQuizSection';
import { OverviewHeroAnimation } from './components/OverviewHeroAnimation';
import { FormulaReferenceModal } from './components/FormulaReferenceModal';
import { MathView } from './components/MathView';
import {
  TrendingUp,
  GitBranch,
  ArrowRight,
  GraduationCap,
  Trophy,
  Target,
  Award,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'K4' | 'K9' | 'OVERVIEW' | 'QUIZ'>('OVERVIEW');
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors">
      {/* Strict 3-Zone Top Navigation with Light/Dark Mode Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReference={() => setIsReferenceOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Switcher Segmented Control */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-200/90 dark:bg-slate-900/90 backdrop-blur border border-slate-300 dark:border-slate-800 rounded-2xl shadow-inner transition-colors gap-1.5">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Lab Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('K4')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'K4'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>K4: Wiener Process</span>
            </button>
            <button
              onClick={() => setActiveTab('K9')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'K9'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>K9: Itô's Lemma</span>
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'QUIZ'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-md shadow-orange-500/35 ring-2 ring-amber-400/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${activeTab === 'QUIZ' ? 'text-amber-200 animate-bounce' : 'text-amber-500'}`} />
              <span>Self-Check Quest</span>
            </button>
          </div>
        </div>

        {/* ================= Tab 1: OVERVIEW & OBJECTIVES ================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Banner with Side-by-Side Step-by-Step Itô Derivator & Multi-Path Diffusion Wave */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-cyan-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-cyan-950/40 border-2 border-indigo-200 dark:border-indigo-800/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-indigo-500/5 transition-colors">
              {/* Colorful Glow Blobs */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Side: Step-by-Step Itô Derivator Presentation & Launch Controls */}
                <div className="lg:col-span-6 xl:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                      Financial Derivatives
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                      Hull Chapter 14
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Interactive Lab Studio
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent text-balance leading-tight">
                    Step-by-Step Itô Derivator & Wiener Shock Visualiser
                  </h1>

                  <p className="text-base sm:text-lg text-indigo-900/80 dark:text-indigo-200 font-medium">
                    Continuous-Flow Visual Learning · Master Stochastic Calculus with Confidence
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Designed for mathematical science students specializing in financial mathematics. Transform dry textbook formulas into vivid interactive Brownian funnels, dynamic Markov simulations, and gamified Itô expansion puzzles.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('K4')}
                      className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
                    >
                      <span>Start Wiener Flow (K4)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('K9')}
                      className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer"
                    >
                      <span>Explore Itô's Lemma (K9)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('QUIZ')}
                      className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-orange-500/30 hover:scale-102 cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-200" />
                      <span>Enter Trophy Quest</span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Multi-Path Stochastic Diffusion Wave at the SIDE */}
                <div className="lg:col-span-6 xl:col-span-6 w-full">
                  <OverviewHeroAnimation />
                </div>
              </div>
            </div>

            {/* EXPLICIT LEARNING OBJECTIVES SECTION - VIBRANT COLOR CODED */}
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 rounded-3xl shadow-md space-y-6 transition-colors">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span>Syllabus Competencies & Learning Outcomes</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  What You Will Master in Chapter 14
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Each color-coded milestone guarantees complete conceptual and practical mastery:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1: Sky/Cyan */}
                <div className="p-4.5 bg-gradient-to-br from-cyan-50/70 via-sky-50/40 to-white dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800/60 shadow-xs hover:border-cyan-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300">
                      Classification
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Continuous vs Discrete Processes
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Classify stochastic processes along discrete/continuous time and state dimensions, understanding why stock prices are modeled as continuous streams.
                  </p>
                </div>

                {/* 2: Violet/Purple */}
                <div className="p-4.5 bg-gradient-to-br from-purple-50/70 via-violet-50/40 to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800/60 shadow-xs hover:border-purple-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300">
                      Memoryless
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    The Markov Condition & Market Efficiency
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Prove mathematically why the current price contains all available information, showing how past charts provide zero forecasting edge in efficient markets.
                  </p>
                </div>

                {/* 3: Emerald/Teal */}
                <div className="p-4.5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/60 shadow-xs hover:border-emerald-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                      Scaling Law
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Additive Variances vs Square-Root SD
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Understand why variances add linearly across independent time intervals (<MathView math="\text{Var} = T" />) while standard deviations scale with <MathView math="\sqrt{T}" />.
                  </p>
                </div>

                {/* 4: Rose/Fuchsia */}
                <div className="p-4.5 bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-800/60 shadow-xs hover:border-rose-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      4
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
                      Diffusion
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Wiener Process & Geometric Brownian Motion
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Formulate <MathView math="\Delta z = \epsilon \sqrt{\Delta t}" />, generalized Wiener processes <MathView math="dx = a dt + b dz" />, and stock price GBM <MathView math="dS = \mu S dt + \sigma S dz" />.
                  </p>
                </div>

                {/* 5: Amber/Gold */}
                <div className="p-4.5 bg-gradient-to-br from-amber-50/70 via-yellow-50/40 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-amber-200 dark:border-amber-800/60 shadow-xs hover:border-amber-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      5
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                      Calculus
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Itô's Lemma & The (dz)² = dt Discovery
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Discover why stochastic Taylor expansions require the second derivative term, proving that <MathView math="(dz)^2 = dt" /> with zero asymptotic variance.
                  </p>
                </div>

                {/* 6: Indigo/Blue */}
                <div className="p-4.5 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs hover:border-indigo-400 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                      6
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300">
                      Lognormal
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Lognormal Returns & Curvature Drag
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Derive <MathView math="d(\ln S)" />, revealing why continuously compounded geometric growth equals arithmetic expected return minus volatility drag <MathView math="-\frac{1}{2}\sigma^2" />.
                  </p>
                </div>
              </div>
            </div>

            {/* The 2 Core Chapter 14 Modules Cards - Vivid Glowing Borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* K4 Card */}
              <div
                onClick={() => setActiveTab('K4')}
                className="group p-6 sm:p-7 bg-gradient-to-br from-cyan-50/70 via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/40 border-2 border-cyan-400/80 dark:border-cyan-600/80 rounded-3xl hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/15 transition-all cursor-pointer space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                      Group A Element: K4
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  The Wiener Process (6-Stage Stream)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stage 1 Foundations → Stage 2 Markov Property → Stage 3 Additive Variances → Stage 4 Fractal Limit → Stage 5 Generalized Drift → Stage 6 Interactive Shock Simulator.
                </p>
                <div className="p-3.5 bg-cyan-50/90 dark:bg-slate-950 rounded-xl border border-cyan-200 dark:border-cyan-800 text-center font-mono text-xs font-bold text-cyan-800 dark:text-cyan-300 shadow-inner">
                  <MathView math="\Delta z = \epsilon \sqrt{\Delta t}, \quad \text{Var}(z(T)) = T \implies \text{SD} = \sqrt{T}" />
                </div>
              </div>

              {/* K9 Card */}
              <div
                onClick={() => setActiveTab('K9')}
                className="group p-6 sm:p-7 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border-2 border-amber-400/80 dark:border-amber-600/80 rounded-3xl hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/15 transition-all cursor-pointer space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                      Group B Element: K9
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  Itô's Lemma (6-Stage Stream)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stage 1 Geometric Brownian Motion → Stage 2 Itô Process → Stage 3 (dz)²=dt Proof → Stage 4 Forward Contracts → Stage 5 Lognormal Property → Stage 6 Formula Puzzle.
                </p>
                <div className="p-3.5 bg-amber-50/90 dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-amber-800 text-center font-mono text-xs font-bold text-amber-800 dark:text-amber-300 shadow-inner">
                  <MathView math="d(\ln S) = \left( \mu - \frac{\sigma^2}{2} \right) dt + \sigma \, dz" />
                </div>
              </div>
            </div>

            {/* Invitation Banner to Dedicated Self-Check Quest */}
            <div className="p-6 sm:p-7 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-pink-500/15 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border-2 border-amber-400/90 dark:border-amber-600/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-lg shadow-orange-500/5">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl text-white shadow-md shadow-orange-500/30">
                  <Trophy className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Unlock 6 Chapter 14 Badges & Claim the Grand Trophy!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    All self-check questions are consolidated in the Quest arena. Answer correctly to collect jewel badges and complete the assignment challenge.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('QUIZ')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 hover:scale-103 transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>Enter Self-Check Quest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= Tab 2: ELEMENT K4 — WIENER PROCESS ================= */}
        {activeTab === 'K4' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <WienerProcessLab onGoToQuiz={() => setActiveTab('QUIZ')} />
          </div>
        )}

        {/* ================= Tab 3: ELEMENT K9 — ITÔ'S LEMMA ================= */}
        {activeTab === 'K9' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ItoLemmaLab onGoToQuiz={() => setActiveTab('QUIZ')} />
          </div>
        )}

        {/* ================= Tab 4: DEDICATED SELF-CHECK QUEST (EXCLUSIVE QUIZ HOME) ================= */}
        {activeTab === 'QUIZ' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <MasterQuizSection />
          </div>
        )}
      </main>

      {/* Chapter 14 Reference Modal */}
      <FormulaReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Step-by-Step Itô Derivator & Wiener Shock Visualiser · Financial Derivatives (Hull Chapter 14)</span>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span>K4: Wiener Process</span>
            <span>·</span>
            <span>K9: Itô's Lemma</span>
            <span>·</span>
            <span>Dedicated Self-Check Quest</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
