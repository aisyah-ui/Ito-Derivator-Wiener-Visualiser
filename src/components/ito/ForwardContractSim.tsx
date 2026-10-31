import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, TrendingDown, ArrowRight } from 'lucide-react';
import { MathView } from '../MathView';

export const ForwardContractSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [stockDriftMu, setStockDriftMu] = useState<number>(0.12); // 12%
  const [interestRateR, setInterestRateR] = useState<number>(0.05); // 5%
  const [volatilitySigma, setVolatilitySigma] = useState<number>(0.20); // 20%
  const [spotPriceS, setSpotPriceS] = useState<number>(50); // $50
  const [timeToMaturity, setTimeToMaturity] = useState<number>(0.5); // 0.5 yr

  const forwardPrice = spotPriceS * Math.exp(interestRateR * timeToMaturity);
  const forwardDrift = stockDriftMu - interestRateR;

  return (
    <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 transition-colors">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
          Forward Contract Pricing & Stochastic Dynamics: Hull Section 14.7 (Eq 14.16)
        </span>
      </div>

      {/* Hero Master Formula Display with Exponent Power Architecture */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-950/40 dark:via-blue-950/30 dark:to-slate-900 rounded-2xl border-2 border-cyan-300 dark:border-cyan-700/80 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-cyan-700 dark:text-cyan-300 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              Forward Contract Pricing Equation
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight py-1">
              <MathView math="F(S, t) = S \cdot e^{r(T - t)}" block={false} className="text-2xl sm:text-3xl lg:text-4xl text-cyan-700 dark:text-cyan-300" />
            </div>
          </div>

          {/* Exponent Power Breakdown Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Spot Price Base</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1">
                <MathView math="S" /> <span className="text-slate-500 text-[11px]">(${spotPriceS.toFixed(2)})</span>
              </span>
            </div>
            <div className="text-cyan-500 font-extrabold text-base">×</div>
            <div className="px-3.5 py-2 rounded-xl bg-cyan-100/80 dark:bg-cyan-950/80 border-2 border-cyan-300 dark:border-cyan-700 shadow-sm text-center">
              <span className="text-[10px] uppercase text-cyan-700 dark:text-cyan-300 block font-extrabold">Power of Exponent</span>
              <span className="font-black text-cyan-900 dark:text-cyan-100 flex items-center justify-center gap-1.5 text-sm">
                <MathView math="e^{r(T - t)}" className="text-sm font-extrabold text-cyan-700 dark:text-cyan-300" />
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-normal">
                  (power = <MathView math="r(T - t)" />)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Summary */}
        <div className="pt-3 border-t border-cyan-200/60 dark:border-cyan-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-200/50 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 font-bold text-[11px]">
              Continuous Carry
            </span>
            <span>
              Exponent Power <MathView math="r(T - t)" /> = {(interestRateR * 100).toFixed(1)}% × {timeToMaturity.toFixed(1)} yr = <strong>{(interestRateR * timeToMaturity).toFixed(4)}</strong>
            </span>
          </div>
          <div className="font-extrabold text-slate-900 dark:text-white text-sm bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800 shadow-sm">
            Forward Price <MathView math="F" /> = <span className="text-cyan-600 dark:text-cyan-400">${forwardPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Spot Price (S):</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">${spotPriceS.toFixed(0)}</span>
          </div>
          <input
            type="range"
            min="20"
            max="150"
            step="5"
            value={spotPriceS}
            onChange={(e) => setSpotPriceS(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Stock Drift (μ):</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{(stockDriftMu * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.25"
            step="0.01"
            value={stockDriftMu}
            onChange={(e) => setStockDriftMu(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Risk-free Rate (r):</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{(interestRateR * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.12"
            step="0.01"
            value={interestRateR}
            onChange={(e) => setInterestRateR(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1">
              <span>Maturity</span> (<MathView math="T - t" className="font-semibold text-slate-700 dark:text-slate-300" />):
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{timeToMaturity.toFixed(1)} yrs</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={timeToMaturity}
            onChange={(e) => setTimeToMaturity(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Step-by-Step Itô Derivation for Forward Contract */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800/80 shadow-sm space-y-4">
        {/* Header with Equation & Exponent Power Callout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-extrabold block">
              Hull Section 14.7 (Equation 14.16)
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
              <span>Step-by-Step Partial Derivatives of</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-700 font-mono text-cyan-800 dark:text-cyan-200">
                <MathView math="F(S, t) = S \cdot e^{r(T - t)}" className="font-extrabold" />
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span className="text-slate-400">Power of Exponent:</span>
            <MathView math="r(T - t)" className="font-bold text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>

        {/* 3 Detailed Cards: Delta, Theta, Gamma with explicit e^{r(T - t)} */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          {/* Delta Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold border-b border-slate-200/60 dark:border-slate-800/80 pb-1">
              <span>1. Delta: ∂F/∂S</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">w.r.t Spot Price S</span>
            </div>
            <div className="py-1">
              <MathView
                math="\dfrac{\partial F}{\partial S} = e^{r(T - t)}"
                block
                className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400"
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              <MathView math="\dfrac{\partial}{\partial S}\left[ S \cdot e^{r(T - t)} \right] = e^{r(T - t)}" />
            </span>
          </div>

          {/* Theta Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold border-b border-slate-200/60 dark:border-slate-800/80 pb-1">
              <span>2. Theta: ∂F/∂t</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">w.r.t Calendar Time t</span>
            </div>
            <div className="py-1">
              <MathView
                math="\dfrac{\partial F}{\partial t} = -\, r S \cdot e^{r(T - t)} = -\, r F"
                block
                className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400"
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              <MathView math="\frac{\partial}{\partial t}[r(T - t)] = -\, r \implies -\, r F" />
            </span>
          </div>

          {/* Gamma Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold border-b border-slate-200/60 dark:border-slate-800/80 pb-1">
              <span>3. Gamma: ∂²F/∂S²</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Curvature</span>
            </div>
            <div className="py-1">
              <MathView
                math="\dfrac{\partial^2 F}{\partial S^2} = 0"
                block
                className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
              <MathView math="\dfrac{\partial}{\partial S}\left( e^{r(T - t)} \right) = 0" /> (Zero Convexity)
            </span>
          </div>
        </div>

        {/* Rigorous Step-by-Step Substitution into Itô's Lemma */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-1.5 text-xs">
            <span className="uppercase text-slate-500 font-bold">
              Substituted into Itô's Lemma Expansion (Hull Equation 14.16):
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-[11px] hidden sm:inline">
              <MathView math="F = S \cdot e^{r(T - t)}" />
            </span>
          </div>

          {/* Expansion Formula with Color Highlights */}
          <div className="space-y-2 text-center overflow-x-auto py-1">
            <div className="text-[11px] text-slate-500">
              General Itô formula: <MathView math="dF = \left[ \dfrac{\partial F}{\partial t} + \mu S \dfrac{\partial F}{\partial S} + \dfrac{1}{2}\sigma^2 S^2 \dfrac{\partial^2 F}{\partial S^2} \right] dt + \sigma S \dfrac{\partial F}{\partial S} \, dz" />
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">
                Direct Substitution of <MathView math="e^{r(T - t)}" /> for each derivative:
              </span>
              <MathView
                math="dF = \left[ -\, r S \cdot e^{r(T - t)} + \mu S \cdot e^{r(T - t)} + \dfrac{1}{2}\sigma^2 S^2 (0) \right] dt + \sigma S \cdot e^{r(T - t)} \, dz"
                block
                className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400">
              Since <MathView math="F = S \cdot e^{r(T - t)}" className="text-cyan-600 dark:text-cyan-400 font-bold" />, substitute <MathView math="F" /> across all terms:
            </div>

            <MathView
              math="dF = \left[ -\, r F + \mu F \right] dt + \sigma F \, dz = (\mu - r)F \, dt + \sigma F \, dz"
              block
              className="text-xs sm:text-sm font-extrabold text-cyan-700 dark:text-cyan-300"
            />
          </div>
        </div>

        <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-lg border border-cyan-300 dark:border-cyan-700/60 text-center font-mono">
          <span className="text-[10px] uppercase text-cyan-700 dark:text-cyan-400 font-bold block mb-1">
            Simplified Forward Return Dynamics
          </span>
          <MathView
            math="dF = (\mu - r)F \, dt + \sigma F \, dz \iff \dfrac{dF}{F} = (\mu - r)\, dt + \sigma \, dz"
            block
            className="text-sm sm:text-base font-bold text-cyan-800 dark:text-cyan-300"
          />
        </div>
      </div>

      {/* Visual Comparison: Underlying Stock vs Forward Contract */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Spot Stock S */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200">Underlying Stock S</span>
            <MathView math="dS = \mu S \, dt + \sigma S \, dz" className="text-slate-500 text-[11px]" />
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 font-mono text-center">
            <span className="text-[10px] text-slate-500 block">Expected Growth Rate:</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <MathView math="\mu =" /> +{(stockDriftMu * 100).toFixed(1)}% / yr
            </span>
          </div>
        </div>

        {/* Forward Contract F */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200">Forward Contract F</span>
            <MathView math="dF = (\mu - r)F \, dt + \sigma F \, dz" className="text-slate-500 text-[11px]" />
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 font-mono text-center">
            <span className="text-[10px] text-slate-500 block">Expected Growth Rate:</span>
            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1">
              <MathView math="\mu - r =" /> +{(forwardDrift * 100).toFixed(1)}% / yr
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-slate-700 dark:text-slate-300">
        <strong>Hull Key Conclusion:</strong> Since <MathView math="\dfrac{\partial^2 F}{\partial S^2} = 0" /> (the forward price is a linear function of stock price), there is NO second-order convexity correction. The forward contract follows Geometric Brownian Motion with identical percentage volatility <MathView math="\sigma" />, but with its growth rate shifted downwards by risk-free rate <MathView math="r" />.
      </div>
    </div>
  );
};
