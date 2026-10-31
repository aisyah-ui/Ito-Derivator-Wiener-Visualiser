import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Brain, Shuffle, ArrowRight } from 'lucide-react';

export const MarkovMemorylessSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [historyType, setHistoryType] = useState<'rally' | 'crash' | 'choppy'>('rally');
  const [futurePaths, setFuturePaths] = useState<number[][]>([]);

  // Generate 12 future paths starting strictly at 100
  const generateFuturePaths = () => {
    const paths: number[][] = [];
    const steps = 40;
    const dt = 1.0 / steps;
    const sqDt = Math.sqrt(dt);

    for (let p = 0; p < 14; p++) {
      const path: number[] = [100];
      let cur = 100;
      for (let s = 1; s <= steps; s++) {
        // Gaussian shock
        const u = Math.random() || 0.001;
        const v = Math.random() || 0.001;
        const eps = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        cur += eps * sqDt * 16;
        path.push(cur);
      }
      paths.push(path);
    }
    setFuturePaths(paths);
  };

  useEffect(() => {
    generateFuturePaths();
  }, [historyType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 200);

    ctx.clearRect(0, 0, width, height);

    const padLeft = 40;
    const padRight = 30;
    const padY = 20;
    const plotW = width - padLeft - padRight;
    const plotH = height - padY * 2;

    const tMid = padLeft + plotW * 0.45; // Today (t = 0)

    const minPrice = 40;
    const maxPrice = 160;
    const priceToY = (p: number) => padY + ((maxPrice - p) / (maxPrice - minPrice)) * plotH;

    // Grid & Divider
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;

    // Horizontal $100 line
    const y100 = priceToY(100);
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(padLeft, y100);
    ctx.lineTo(width - padRight, y100);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vertical "TODAY" line
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tMid, padY);
    ctx.lineTo(tMid, height - padY);
    ctx.stroke();

    // Labels
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PAST (t < 0)', padLeft + 10, padY + 12);
    ctx.fillText('FUTURE (t > 0)', tMid + 15, padY + 12);
    ctx.fillText('$100 (Today)', padLeft - 35, y100 + 3);

    // Draw the chosen past trajectory
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706'; // amber
    ctx.lineWidth = 2.5;

    const pastSteps = 30;
    for (let i = 0; i <= pastSteps; i++) {
      const frac = i / pastSteps;
      const x = padLeft + frac * (tMid - padLeft);
      let price = 100;
      if (historyType === 'rally') {
        // Starts at 60, rises to 100
        price = 60 + 40 * frac + Math.sin(frac * 8) * 4;
      } else if (historyType === 'crash') {
        // Starts at 140, plunges to 100
        price = 140 - 40 * frac + Math.sin(frac * 8) * 4;
      } else {
        // Choppy sideways around 100
        price = 100 + Math.sin(frac * 15) * 14;
      }
      if (i === pastSteps) price = 100; // Exact current price

      const y = priceToY(price);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw checkpoint dot at $100
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.beginPath();
    ctx.arc(tMid, y100, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw future trajectories branching out from $100
    futurePaths.forEach((path, idx) => {
      ctx.beginPath();
      ctx.lineWidth = idx === 0 ? 2 : 1;
      ctx.strokeStyle =
        idx === 0
          ? isDark ? '#38bdf8' : '#0284c7'
          : isDark
          ? 'rgba(56, 189, 248, 0.25)'
          : 'rgba(2, 132, 199, 0.25)';

      path.forEach((pVal, sIdx) => {
        const frac = sIdx / (path.length - 1);
        const x = tMid + frac * (width - padRight - tMid);
        const y = priceToY(pVal);
        if (sIdx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }, [historyType, futurePaths, isDark]);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Markov Memorylessness Test ($100 Stock)
          </span>
        </div>
        <button
          onClick={generateFuturePaths}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 hover:bg-cyan-200 dark:hover:bg-cyan-900 transition-colors cursor-pointer"
        >
          <Shuffle className="w-3 h-3" />
          <span>Resimulate Future</span>
        </button>
      </div>

      {/* Scenario Buttons */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-mono text-[11px]">Select Past History:</span>
        <button
          onClick={() => setHistoryType('rally')}
          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
            historyType === 'rally'
              ? 'bg-emerald-500 text-white font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Bullish Rally ($60 → $100)
        </button>
        <button
          onClick={() => setHistoryType('crash')}
          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
            historyType === 'crash'
              ? 'bg-rose-500 text-white font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Market Crash ($140 → $100)
        </button>
        <button
          onClick={() => setHistoryType('choppy')}
          className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
            historyType === 'choppy'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Sideways Range (≈$100)
        </button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <canvas ref={canvasRef} className="w-full h-[200px] block" />
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong>Hull Insight:</strong> Switch between the Bullish, Crash, or Sideways past. Notice that the future probability distribution (cyan paths) starting from $100 is <strong>completely independent</strong> of the past trajectory. The past is completely forgotten!
      </p>
    </div>
  );
};
