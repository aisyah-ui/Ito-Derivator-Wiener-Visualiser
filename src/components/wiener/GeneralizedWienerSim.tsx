import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { MathView } from '../MathView';

export const GeneralizedWienerSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sliders matching Hull Figure 14.2 defaults
  const [driftA, setDriftA] = useState<number>(0.3); // a = 0.3
  const [volB, setVolB] = useState<number>(1.5); // b = 1.5
  const [seed, setSeed] = useState<number>(42);

  const horizonT = 3.0; // 3 years

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 220);

    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 35;
    const padY = 20;
    const plotW = width - padLeft - padRight;
    const plotH = height - padY * 2;

    const minX = -3.0;
    const maxX = 5.0;
    const xToY = (val: number) => padY + ((maxX - val) / (maxX - minX)) * plotH;
    const tToX = (t: number) => padLeft + (t / horizonT) * plotW;

    // Grid
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    const zeroY = xToY(0);
    ctx.beginPath();
    ctx.moveTo(padLeft, zeroY);
    ctx.lineTo(width - padRight, zeroY);
    ctx.stroke();

    // Axis Labels
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('0', padLeft - 15, zeroY + 3);
    ctx.fillText('Time', width - padRight - 20, height - 5);

    // Generate pure Wiener process path
    const steps = 100;
    const dt = horizonT / steps;
    const sqDt = Math.sqrt(dt);

    let s = seed * 9973;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s / 2147483647 - 0.5) * 2;
    };

    const wienerPts: number[] = [0];
    let curZ = 0;
    for (let i = 1; i <= steps; i++) {
      curZ += rand() * sqDt;
      wienerPts.push(curZ);
    }

    // 1. Draw pure Wiener process (dz) at bottom
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.2;
    for (let i = 0; i <= steps; i++) {
      const t = (horizonT * i) / steps;
      const px = tToX(t);
      const py = xToY(wienerPts[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 2. Draw deterministic straight line dx = a dt (x = a*t)
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(tToX(0), xToY(0));
    ctx.lineTo(tToX(horizonT), xToY(driftA * horizonT));
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Generalized Wiener Process: x = a*t + b*z
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2.2;
    for (let i = 0; i <= steps; i++) {
      const t = (horizonT * i) / steps;
      const genX = driftA * t + volB * wienerPts[i];
      const px = tToX(t);
      const py = xToY(genX);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // End point labels
    const endT = horizonT;
    const endDriftY = xToY(driftA * endT);
    const endGenY = xToY(driftA * endT + volB * wienerPts[steps]);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
    ctx.fillText('dx = a dt', width - padRight + 4, endDriftY + 3);

    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.fillText('dx = a dt + b dz', width - padRight + 4, endGenY + 3);
  }, [driftA, volB, seed, isDark]);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Hull Figure 14.2: Drift Line vs Generalized Process
          </span>
        </div>
        <button
          onClick={() => setSeed((prev) => prev + 1)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>New Realization</span>
        </button>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Drift Rate (a):</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">a = {driftA.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-0.5"
            max="1.5"
            step="0.05"
            value={driftA}
            onChange={(e) => setDriftA(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Noise Scale (b):</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">b = {volB.toFixed(2)} (Var Rate = {(volB * volB).toFixed(2)})</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={volB}
            onChange={(e) => setVolB(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <canvas ref={canvasRef} className="w-full h-[220px] block" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 block">Expected Change</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">E[Δx] = a T = {(driftA * horizonT).toFixed(2)}</span>
        </div>
        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 block">Variance Rate</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">Var Rate = b² = {(volB * volB).toFixed(2)}</span>
        </div>
        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 block">Standard Deviation</span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">SD = b√T = {(volB * Math.sqrt(horizonT)).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
