import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Activity, RefreshCw } from 'lucide-react';
import { MathView } from '../MathView';

export const FractalLimitSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTier, setActiveTier] = useState<'all' | 'coarse' | 'medium' | 'fractal'>('all');
  const [seed, setSeed] = useState<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 240);

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;

    // Helper to generate a Brownian bridge from seed
    const generatePath = (stepCount: number, scale: number) => {
      const pts: { x: number; y: number }[] = [];
      let val = 0;
      const dt = 1.0 / stepCount;
      const sqDt = Math.sqrt(dt);

      // Simple deterministic pseudorandom using seed
      let s = seed * 12345;
      const rand = () => {
        s = (s * 16807) % 2147483647;
        return (s / 2147483647 - 0.5) * 2;
      };

      for (let i = 0; i <= stepCount; i++) {
        pts.push({ x: i / stepCount, y: val });
        val += rand() * sqDt * scale;
      }
      return pts;
    };

    const drawSubPlot = (
      pts: { x: number; y: number }[],
      yOffset: number,
      plotH: number,
      color: string,
      label: string,
      lineWidth: number
    ) => {
      const padX = 25;
      const w = width - padX * 2;

      // Base line
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, yOffset + plotH);
      ctx.lineTo(padX + w, yOffset + plotH);
      ctx.stroke();

      // Label
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(label, padX + 5, yOffset + 12);

      // Plot
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      const minY = -2.5;
      const maxY = 2.5;
      const mapY = (val: number) => yOffset + plotH - ((val - minY) / (maxY - minY)) * plotH;

      pts.forEach((p, idx) => {
        const px = padX + p.x * w;
        const py = mapY(p.y);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    };

    if (activeTier === 'all') {
      const h3 = height / 3;
      const pts1 = generatePath(12, 1.8);
      const pts2 = generatePath(40, 1.8);
      const pts3 = generatePath(200, 1.8);

      drawSubPlot(pts1, 0, h3 - 10, isDark ? '#f43f5e' : '#e11d48', 'Figure 14.1 (a): Relatively Large Δt (Coarse)', 1.8);
      drawSubPlot(pts2, h3, h3 - 10, isDark ? '#f59e0b' : '#d97706', 'Figure 14.1 (b): Smaller Value of Δt (Jagged)', 1.4);
      drawSubPlot(pts3, h3 * 2, h3 - 10, isDark ? '#38bdf8' : '#0284c7', 'Figure 14.1 (c): The True Process as Δt → 0 (Fractal)', 1.0);
    } else if (activeTier === 'coarse') {
      const pts = generatePath(12, 1.8);
      drawSubPlot(pts, 10, height - 30, isDark ? '#f43f5e' : '#e11d48', 'Hull Figure 14.1 (a): Coarse Δt Zig-Zag', 2.2);
    } else if (activeTier === 'medium') {
      const pts = generatePath(40, 1.8);
      drawSubPlot(pts, 10, height - 30, isDark ? '#f59e0b' : '#d97706', 'Hull Figure 14.1 (b): Denser Δt Sampling', 1.8);
    } else {
      const pts = generatePath(350, 1.8);
      drawSubPlot(pts, 10, height - 30, isDark ? '#38bdf8' : '#0284c7', 'Hull Figure 14.1 (c): Continuous Fractal Limit Δt → 0', 1.2);
    }
  }, [activeTier, seed, isDark]);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Hull Figure 14.1: The Limit as Δt → 0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveTier('all')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTier === 'all'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All 3 Tiers
            </button>
            <button
              onClick={() => setActiveTier('coarse')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTier === 'coarse'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Coarse
            </button>
            <button
              onClick={() => setActiveTier('medium')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTier === 'medium'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setActiveTier('fractal')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTier === 'fractal'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Limit Δt→0
            </button>
          </div>
          <button
            onClick={() => setSeed((prev) => prev + 1)}
            className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Generate new path realization"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <canvas ref={canvasRef} className="w-full h-[240px] block" />
      </div>

      <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 rounded-lg text-xs text-slate-700 dark:text-slate-300">
        <strong>Mathematical Principle from Hull p. 319:</strong> Because <MathView math="\text{SD} = \sqrt{\Delta t}" /> shrinks much slower than <MathView math="\Delta t" />, as <MathView math="\Delta t \to 0" />, the path never smooths out. The expected path length is <strong>infinite</strong> and crosses any horizontal level an infinite number of times in any interval!
      </div>
    </div>
  );
};
