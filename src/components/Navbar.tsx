import React from 'react';
import { BookOpen, Sun, Moon, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'K4' | 'K9' | 'OVERVIEW' | 'QUIZ';
  setActiveTab: (tab: 'K4' | 'K9' | 'OVERVIEW' | 'QUIZ') => void;
  onOpenReference: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenReference }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark with vibrant gradient */}
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            ∫
          </span>
          <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 via-indigo-600 to-amber-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-amber-400 bg-clip-text text-transparent whitespace-nowrap">
            Itô Derivator & Wiener Visualiser
          </span>
        </button>

        {/* Zone 2: 4 concise single-line text navigation links with colorful indicators */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`whitespace-nowrap shrink-0 transition-all hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-8 decoration-indigo-500 decoration-2'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Overview & Syllabus
          </button>
          <button
            onClick={() => setActiveTab('K4')}
            className={`whitespace-nowrap shrink-0 transition-all hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ${
              activeTab === 'K4'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold underline underline-offset-8 decoration-cyan-500 decoration-2'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Wiener Process (K4)
          </button>
          <button
            onClick={() => setActiveTab('K9')}
            className={`whitespace-nowrap shrink-0 transition-all hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer ${
              activeTab === 'K9'
                ? 'text-amber-600 dark:text-amber-400 font-bold underline underline-offset-8 decoration-amber-500 decoration-2'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Itô's Lemma (K9)
          </button>
          <button
            onClick={() => setActiveTab('QUIZ')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer ${
              activeTab === 'QUIZ'
                ? 'text-orange-600 dark:text-orange-400 font-bold underline underline-offset-8 decoration-orange-500 decoration-2'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Self-Check Quest</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Mode Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none cursor-pointer shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={onOpenReference}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Formula Reference</span>
          </button>
        </div>
      </div>
    </header>
  );
};
