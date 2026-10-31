import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Compass, Plus, RotateCcw } from 'lucide-react';
import { MathView } from '../MathView';

export const VarianceAdderSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [years, setYears] = useState<number>(3); // 1 to 5 years

  const variance = years * 1.0;
  const standardDeviation = Math.sqrt(variance);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Variance Accumulation vs √T Dispersion
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYears((prev) => Math.min(5, prev + 1))}
            disabled={years === 5}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add +1 Year Horizon</span>
          </button>
          <button
            onClick={() => setYears(1)}
            className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset to 1 year"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: Building block tower for Variance */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">Additive Variance Blocks:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Var(T) = {variance.toFixed(1)} per {years} yrs
            </span>
          </div>

          {/* Stacking Block Visualizer */}
          <div className="space-y-1.5 pt-1">
            {Array.from({ length: years }).map((_, i) => (
              <div
                key={i}
                className="p-2 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-xs font-mono text-amber-900 dark:text-amber-300 flex justify-between items-center animate-in slide-in-from-bottom-2 duration-200"
              >
                <span>Year {i + 1} Increment: ΔVar = 1.0</span>
                <span className="text-[10px] bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded font-bold">
                  +1.0
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Variances of non-overlapping intervals sum directly: <MathView math="\text{Var} = \sum \text{Var}_i = T" />.
          </p>
        </div>

        {/* Right: Non-linear Standard Deviation Funnel */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">Standard Deviation (Risk):</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              SD = √{years} ≈ {standardDeviation.toFixed(3)}
            </span>
          </div>

          {/* Comparative horizontal bars showing √T growth */}
          <div className="space-y-2 pt-1">
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Linear Time Scale (T = {years})</span>
                <span>{(years / 5) * 100}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(years / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Diffusion Uncertainty (√T = {standardDeviation.toFixed(2)})</span>
                <span>{((standardDeviation / Math.sqrt(5)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(standardDeviation / Math.sqrt(5)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Standard deviations are <strong>NOT additive</strong>: 4 years doubles the risk (√4 = 2), but does NOT quadruple it!
          </p>
        </div>
      </div>
    </div>
  );
};
