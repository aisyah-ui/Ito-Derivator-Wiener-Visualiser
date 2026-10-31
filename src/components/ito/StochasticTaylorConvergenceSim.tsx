import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Play, RotateCcw } from 'lucide-react';
import { MathView } from '../MathView';

export const StochasticTaylorConvergenceSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sampleSize, setSampleSize] = useState<number>(100);
  const [computedMeanEps2, setComputedMeanEps2] = useState<number>(0.985);
  const [selectedRule, setSelectedRule] = useState<'dz2' | 'dtdt' | 'dtdz'>('dz2');

  const runSimulation = (n: number) => {
    setSampleSize(n);
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const u = Math.random() || 0.001;
      const v = Math.random() || 0.001;
      const eps = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      sum += eps * eps;
    }
    const mean = sum / n;
    setComputedMeanEps2(parseFloat(mean.toFixed(3)));
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 flex-wrap">
            <span className="uppercase text-slate-500">Interactive Law of Large Numbers Proof:</span>
            <span className="normal-case text-amber-700 dark:text-amber-400 flex items-center gap-1 font-semibold">
              Why <MathView math="(dz)^2 = dt" className="text-xs sm:text-sm font-bold" />
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500">Sample N:</span>
          {[20, 100, 500, 2000].map((n) => (
            <button
              key={n}
              onClick={() => runSimulation(n)}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                sampleSize === n
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              N = {n}
            </button>
          ))}
        </div>
      </div>

      {/* Numerical Convergence Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">Average of ε² across {sampleSize} shocks:</span>
          <span className="text-base font-bold text-amber-600 dark:text-amber-400">
            E[ε²] ≈ {computedMeanEps2.toFixed(3)} (Exact Limit = 1.000)
          </span>
        </div>

        {/* Visual Target Thermometer */}
        <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (computedMeanEps2 / 1.5) * 100)}%` }}
          />
          <div className="absolute top-0 bottom-0 left-[66.6%] w-0.5 bg-rose-500" title="Theoretical Mean 1.0" />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>0.0</span>
          <span className="text-rose-500 font-bold flex items-center gap-1">
            <span>Target = 1.000</span> (<MathView math="dt" className="text-rose-500 font-bold" />)
          </span>
          <span>1.5</span>
        </div>
      </div>

      {/* Interactive Multiplication Table Tiles */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
          Click an Itô Differential Product:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedRule('dtdt')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedRule === 'dtdt'
                ? 'bg-slate-200 dark:bg-slate-800 border-slate-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
              <MathView math="dt \times dt = 0" />
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Order <MathView math="(dt)^2" />; shrinks to zero
            </span>
          </button>

          <button
            onClick={() => setSelectedRule('dtdz')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedRule === 'dtdz'
                ? 'bg-slate-200 dark:bg-slate-800 border-slate-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
              <MathView math="dt \times dz = 0" />
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Order <MathView math="dt^{3/2}" />; shrinks to zero
            </span>
          </button>

          <button
            onClick={() => setSelectedRule('dz2')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedRule === 'dz2'
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="font-mono font-bold text-sm text-amber-700 dark:text-amber-300">
              <MathView math="dz \times dz = dt" />
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-1 font-semibold flex items-center gap-1">
              <span>Crucial Non-Zero Term!</span> (<MathView math="(dz)^2 = dt" />)
            </span>
          </button>
        </div>
      </div>

      {/* Explanatory callout for selected rule */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-slate-700 dark:text-slate-300">
        {selectedRule === 'dz2' && (
          <p>
            <strong>Why <MathView math="(dz)^2 = dt" className="font-bold text-amber-800 dark:text-amber-300" /> is deterministic:</strong> Since <MathView math="\Delta z = \epsilon \sqrt{\Delta t}" />, squaring it gives <MathView math="(\Delta z)^2 = \epsilon^2 \Delta t" />. Because <MathView math="E[\epsilon^2] = 1" /> and its variance vanishes as <MathView math="\Delta t \to 0" />, <MathView math="(dz)^2" /> converges with probability 1 to a completely deterministic time step <MathView math="dt" />! This produces the <MathView math="\dfrac{1}{2} \, \dfrac{\partial^2 G}{\partial x^2} \, b^2 \, dt" /> term in Itô's Lemma.
          </p>
        )}
        {selectedRule === 'dtdt' && (
          <p>
            <strong>Why <MathView math="(dt)^2 = 0" className="font-bold" />:</strong> In continuous calculus, an interval squared (e.g. 0.0001² = 0.00000001) is negligibly small compared to first-order <MathView math="dt" />. Therefore, all terms of order <MathView math="dt^2" /> vanish in the continuous limit.
          </p>
        )}
        {selectedRule === 'dtdz' && (
          <p>
            <strong>Why <MathView math="dt \times dz = 0" className="font-bold" />:</strong> Since <MathView math="dz \sim \sqrt{dt}" />, their product is of order <MathView math="dt \times \sqrt{dt} = dt^{3/2}" />. This is strictly higher order than <MathView math="dt^1" />, so it drops out of the continuous Taylor expansion.
          </p>
        )}
      </div>
    </div>
  );
};
