import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { MathView } from '../MathView';

export const ConstantDriftFailureSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modelType, setModelType] = useState<'constant' | 'gbm'>('gbm');
  const [dollarDrift, setDollarDrift] = useState<number>(5.0); // $5/yr
  const [percentageReturn, setPercentageReturn] = useState<number>(0.14); // 14%/yr

  // Two stocks: Stock A ($10) and Stock B ($100)
  const stockAPrice = 10;
  const stockBPrice = 100;

  const returnA =
    modelType === 'constant'
      ? (dollarDrift / stockAPrice) * 100
      : percentageReturn * 100;

  const returnB =
    modelType === 'constant'
      ? (dollarDrift / stockBPrice) * 100
      : percentageReturn * 100;

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Comparison: Constant Drift vs Geometric Brownian Motion
          </span>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button
            onClick={() => setModelType('constant')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              modelType === 'constant'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Constant Dollar Drift (Flawed)
          </button>
          <button
            onClick={() => setModelType('gbm')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              modelType === 'gbm'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Percentage Return (GBM Model)
          </button>
        </div>
      </div>

      {/* Model Parameter Control */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
        {modelType === 'constant' ? (
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Fixed Dollar Drift (a):</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">${dollarDrift.toFixed(1)} / year</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="1.0"
              value={dollarDrift}
              onChange={(e) => setDollarDrift(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Constant Expected Percentage Return (μ):</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{(percentageReturn * 100).toFixed(1)}% / year</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.30"
              step="0.01"
              value={percentageReturn}
              onChange={(e) => setPercentageReturn(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Visual Stock Cards Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stock A ($10) */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200">Stock A (Initial Price = $10)</span>
            <span className="text-slate-500">Penny / Mid Cap</span>
          </div>
          <div className="py-2 px-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-center">
            <span className="text-xs text-slate-500 block">Annualized Return:</span>
            <span className={`text-lg font-bold ${modelType === 'constant' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              +{returnA.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stock B ($100) */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200">Stock B (Initial Price = $100)</span>
            <span className="text-slate-500">Blue Chip</span>
          </div>
          <div className="py-2 px-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-center">
            <span className="text-xs text-slate-500 block">Annualized Return:</span>
            <span className={`text-lg font-bold ${modelType === 'constant' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              +{returnB.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Economic Evaluation Banner */}
      {modelType === 'constant' ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-lg text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>
            <strong>The Economic Flaw:</strong> If drift is constant (+${dollarDrift}), Stock A earns an absurd +{returnA.toFixed(1)}% while Stock B earns only +{returnB.toFixed(1)}%! In market equilibrium, investors require consistent percentage return irrespective of whether the stock trades at $10 or $100.
          </p>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>The GBM Solution (Hull Eq 14.6):</strong> Scaling drift with price (<MathView math="\text{Drift} = \mu S" />) gives both stocks an identical, fair expected percentage return of +{(percentageReturn * 100).toFixed(1)}% per year!
          </p>
        </div>
      )}
    </div>
  );
};
