import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Play, Pause } from 'lucide-react';

export const DiscreteVsContinuousSim: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'discrete' | 'weekly' | 'continuous'>('continuous');
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 180);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 180;
    };
    window.addEventListener('resize', handleResize);

    // Pre-generate smooth underlying Brownian wave
    const totalPoints = 120;
    const rawWave: number[] = [0];
    let cur = 0;
    for (let i = 1; i < totalPoints; i++) {
      cur += (Math.random() - 0.5) * 12;
      rawWave.push(cur);
    }

    let offset = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.lineWidth = 1;
      const centerY = height / 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      const stepSize = mode === 'discrete' ? 24 : mode === 'weekly' ? 8 : 2;

      ctx.beginPath();
      ctx.strokeStyle =
        mode === 'discrete'
          ? isDark ? '#f43f5e' : '#e11d48'
          : mode === 'weekly'
          ? isDark ? '#fbbf24' : '#d97706'
          : isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = mode === 'continuous' ? 2 : 1.5;

      const sampledPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < totalPoints; i += stepSize) {
        const x = (i / totalPoints) * width;
        const index = (i + offset) % totalPoints;
        const y = centerY + rawWave[index];
        sampledPoints.push({ x, y });
      }

      if (mode === 'discrete') {
        // Draw step stair-case
        for (let i = 0; i < sampledPoints.length - 1; i++) {
          const p1 = sampledPoints[i];
          const p2 = sampledPoints[i + 1];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Discrete dot
          ctx.fillStyle = isDark ? '#f43f5e' : '#e11d48';
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Continuous line
        ctx.beginPath();
        sampledPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        if (mode === 'weekly') {
          // Dots on weekly samples
          ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
          sampledPoints.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      if (isAnimating) {
        offset = (offset + 1) % totalPoints;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mode, isAnimating, isDark]);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
            Interactive Sampling Dynamics (Hull p. 316)
          </span>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMode('discrete')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'discrete'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Discrete (Δt = 1 Mo)
          </button>
          <button
            onClick={() => setMode('weekly')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'weekly'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Weekly (Δt = 1 Wk)
          </button>
          <button
            onClick={() => setMode('continuous')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'continuous'
                ? 'bg-cyan-600 dark:bg-cyan-500 text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Continuous (Δt → 0)
          </button>
        </div>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <canvas ref={canvasRef} className="w-full h-[180px] block" />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>
          Current Representation: <strong className="text-slate-800 dark:text-slate-200 uppercase">{mode}</strong>
        </span>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isAnimating ? 'Pause Flow' : 'Resume Flow'}</span>
        </button>
      </div>
    </div>
  );
};
