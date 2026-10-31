import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { MathView } from './MathView';

interface FormulaReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaReferenceModal: React.FC<FormulaReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-2xl p-6 lg:p-8 space-y-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Chapter 14 Quick Reference Sheet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Options, Futures, and Other Derivatives (Hull) · Wiener Processes & Itô's Lemma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Wiener Process (Cyan) */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Element K4: Wiener Process (Standard Brownian Motion)</span>
          </h4>
          <div className="p-4 bg-gradient-to-br from-cyan-50/70 via-sky-50/40 to-white dark:from-cyan-950/40 dark:via-slate-950 dark:to-slate-950 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800/80 space-y-2 text-xs transition-colors">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Increment Equation:</span>
              <MathView math="\Delta z = \epsilon \sqrt{\Delta t}, \quad \epsilon \sim \phi(0, 1)" className="text-cyan-800 dark:text-cyan-300 font-mono font-bold" />
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Expectation & Variance (Δt):</span>
              <MathView math="E[\Delta z] = 0, \quad \text{Var}(\Delta z) = \Delta t, \quad \text{SD}(\Delta z) = \sqrt{\Delta t}" className="text-cyan-800 dark:text-cyan-300 font-mono" />
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Horizon T Distribution:</span>
              <MathView math="z(T) - z(0) \sim \phi(0, T) \implies \text{SD} = \sqrt{T}" className="text-cyan-800 dark:text-cyan-300 font-mono font-bold" />
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Markov Property:</span>
              <span className="text-cyan-800 dark:text-cyan-300 font-mono font-bold">Cov(Δz₁, Δz₂) = 0 for disjoint intervals</span>
            </div>
          </div>
        </div>

        {/* Section 2: Itô's Lemma (Amber/Coral) */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Element K9: Itô's Lemma</span>
          </h4>
          <div className="p-4 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white dark:from-amber-950/40 dark:via-slate-950 dark:to-slate-950 rounded-2xl border-2 border-amber-200 dark:border-amber-800/80 space-y-3 text-xs transition-colors">
            <div className="text-center py-2 px-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">General Form for dx = a dt + b dz</span>
              <MathView
                math="dG = \left( \dfrac{\partial G}{\partial x} a + \dfrac{\partial G}{\partial t} + \dfrac{1}{2} \, \dfrac{\partial^2 G}{\partial x^2} b^2 \right) dt + \dfrac{\partial G}{\partial x} b \, dz"
                block
                className="text-amber-900 dark:text-amber-300 font-mono text-xs sm:text-sm font-bold"
              />
            </div>
            <div className="text-center py-2 px-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">GBM Form for dS = μS dt + σS dz</span>
              <MathView
                math="dG = \left( \dfrac{\partial G}{\partial S} \mu S + \dfrac{\partial G}{\partial t} + \dfrac{1}{2} \, \dfrac{\partial^2 G}{\partial S^2} \sigma^2 S^2 \right) dt + \dfrac{\partial G}{\partial S} \sigma S \, dz"
                block
                className="text-amber-900 dark:text-amber-300 font-mono text-xs sm:text-sm font-bold"
              />
            </div>
            <div className="text-center py-2 px-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Special Case G = ln S (Lognormal Property)</span>
              <MathView
                math="d(\ln S) = \left( \mu - \dfrac{\sigma^2}{2} \right) dt + \sigma \, dz"
                block
                className="text-emerald-900 dark:text-emerald-200 font-mono text-xs sm:text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Differential Multiplication Rules */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Itô Stochastic Multiplication Rules</span>
          </h4>
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              dt × dt = 0
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              dt × dz = 0
            </div>
            <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-xl shadow-xs font-bold">
              dz × dz = dt ★
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Close Reference Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
