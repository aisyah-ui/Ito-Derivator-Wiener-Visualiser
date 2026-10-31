import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Check, ArrowDown } from 'lucide-react';
import { MathView } from '../MathView';

export const LognormalDerivationCards: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeStage, setActiveStage] = useState<number>(4);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Algebraic Cancellation & Derivation of ln S
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 text-xs font-mono">
          {[1, 2, 3, 4].map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeStage === stage
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Stage {stage}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Derivative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeStage >= 1
              ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-sm'
              : 'opacity-50 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            1. First Derivative
          </span>
          <div className="py-2 px-1 text-center bg-slate-50 dark:bg-slate-950 rounded font-mono">
            <MathView math="\dfrac{\partial G}{\partial S} = \dfrac{1}{S}" block className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300" />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Sensitivity to stock price</span>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeStage >= 2
              ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-sm'
              : 'opacity-50 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            2. Second Derivative
          </span>
          <div className="py-2 px-1 text-center bg-slate-50 dark:bg-slate-950 rounded font-mono">
            <MathView math="\dfrac{\partial^2 G}{\partial S^2} = -\, \dfrac{1}{S^2}" block className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400" />
          </div>
          <span className="text-[11px] text-rose-500 dark:text-rose-400 block mt-1 font-semibold">
            Negative sign creates drift drag!
          </span>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            activeStage >= 3
              ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-sm'
              : 'opacity-50 border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            3. Time Derivative
          </span>
          <div className="py-2 px-1 text-center bg-slate-50 dark:bg-slate-950 rounded font-mono">
            <MathView math="\dfrac{\partial G}{\partial t} = 0" block className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300" />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">No explicit time dependency</span>
        </div>
      </div>

      {/* Interactive Substitution Card with Cancellation Highlight */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-mono uppercase text-slate-500 block">
          Step 4: Substitute into Itô's Expansion (Hull Eq 14.14)
        </span>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono overflow-x-auto shadow-inner">
          <MathView
            math="d(\ln S) = \left[ \left(\dfrac{1}{S}\right)\mu S + 0 + \dfrac{1}{2}\left(-\, \dfrac{1}{S^2}\right)\sigma^2 S^2 \right] dt + \left(\dfrac{1}{S}\right)\sigma S \, dz"
            block
            className="text-xs sm:text-sm lg:text-base text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex justify-center text-amber-500 my-1">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-700/60 text-center font-mono shadow-sm">
          <span className="text-[10px] uppercase text-amber-700 dark:text-amber-400 font-bold block mb-1">
            S and S² cancel out completely! (Hull Eq 14.15)
          </span>
          <MathView
            math="d(\ln S) = \left( \mu - \dfrac{\sigma^2}{2} \right) dt + \sigma \, dz"
            block
            className="text-base sm:text-xl font-bold text-amber-800 dark:text-amber-300"
          />
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong>The Final Lognormal Conclusion (Hull Eq 14.19):</strong> Because <MathView math="d(\ln S)" /> has constant drift <MathView math="\mu - \dfrac{1}{2}\sigma^2" /> and constant volatility <MathView math="\sigma" />, integrating over horizon <MathView math="T" /> proves that <MathView math="\ln S_T" /> is normally distributed:
          <div className="text-center py-2.5 font-mono text-cyan-700 dark:text-cyan-300">
            <MathView
              math="\ln S_T \sim \phi\left( \ln S_0 + \left(\mu - \dfrac{\sigma^2}{2}\right)T, \; \sigma^2 T \right)"
              block
              className="text-xs sm:text-sm md:text-base font-bold"
            />
          </div>
          Therefore, stock price <MathView math="S_T" /> is lognormally distributed!
        </div>
      </div>
    </div>
  );
};
