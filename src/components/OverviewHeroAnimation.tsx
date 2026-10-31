import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Sparkles, Shuffle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const OverviewHeroAnimation: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [particlesCount, setParticlesCount] = useState<number>(5);
  const animFrameRef = useRef<number | null>(null);

  // 5 vibrant paths with colorful identities
  const PATH_DEFINITIONS = [
    { label: 'Shock Path α', color: isDark ? '#38bdf8' : '#0284c7', glow: '#0ea5e9' }, // Cyan
    { label: 'Shock Path β', color: isDark ? '#ec4899' : '#db2777', glow: '#f43f5e' }, // Pink / Fuchsia
    { label: 'Shock Path γ', color: isDark ? '#fbbf24' : '#d97706', glow: '#f59e0b' }, // Amber / Gold
    { label: 'Shock Path δ', color: isDark ? '#34d399' : '#059669', glow: '#10b981' }, // Emerald
    { label: 'Shock Path ε', color: isDark ? '#a78bfa' : '#7c3aed', glow: '#8b5cf6' }, // Purple
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 210);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 210;
    };
    window.addEventListener('resize', handleResize);

    const paths: {
      points: { x: number; y: number }[];
      color: string;
      glow: string;
      speed: number;
      curX: number;
      curY: number;
    }[] = PATH_DEFINITIONS.map((def) => ({
      points: [{ x: 0, y: height / 2 }],
      color: def.color,
      glow: def.glow,
      speed: 1.8 + Math.random() * 0.4,
      curX: 0,
      curY: height / 2,
    }));

    const render = () => {
      // Clear with soft fade for colorful trailing stream
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.28)' : 'rgba(255, 255, 255, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const centerY = height / 2;

      // Colorful Grid guidelines
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;

      // Central drift = 0 axis
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic dispersion cone (±sqrt(t)) with colorful gradient fill
      const gradUpper = ctx.createLinearGradient(0, centerY - 60, width, centerY);
      gradUpper.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      gradUpper.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
      gradUpper.addColorStop(1, 'rgba(236, 72, 153, 0.2)');

      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const t = x / width;
        const envelope = 48 * Math.sqrt(t);
        ctx.lineTo(x, centerY - envelope);
      }
      ctx.stroke();

      ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.4)' : 'rgba(219, 39, 119, 0.4)';
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const t = x / width;
        const envelope = 48 * Math.sqrt(t);
        ctx.lineTo(x, centerY + envelope);
      }
      ctx.stroke();

      // Update and draw each stochastic path
      paths.forEach((p, idx) => {
        if (idx >= particlesCount) return;

        if (isRunning && p.curX < width) {
          // Wiener increment: Δz = ε * sqrt(Δt)
          const eps = (Math.random() - 0.5) * 2;
          const dt = 1.6;
          const dy = eps * Math.sqrt(dt) * 11;

          p.curX += p.speed;
          p.curY = Math.max(12, Math.min(height - 12, p.curY + dy));
          p.points.push({ x: p.curX, y: p.curY });

          if (p.points.length > 500) {
            p.points.shift();
          }
        }

        // Draw path with shadow glow
        if (p.points.length > 1) {
          ctx.save();
          ctx.shadowColor = p.glow;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.2;
          ctx.moveTo(p.points[0].x, p.points[0].y);
          for (let i = 1; i < p.points.length; i++) {
            ctx.lineTo(p.points[i].x, p.points[i].y);
          }
          ctx.stroke();
          ctx.restore();

          // Draw active pulse head with concentric ring
          const head = p.points[p.points.length - 1];
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Auto restart when reaching end
        if (p.curX >= width) {
          p.curX = 0;
          p.curY = centerY;
          p.points = [{ x: 0, y: centerY }];
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, isDark, particlesCount]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 dark:border-indigo-800/80 bg-gradient-to-br from-indigo-50/40 via-white to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 p-4 sm:p-5 shadow-lg shadow-indigo-500/5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent block">
              Multi-Path Stochastic Diffusion Wave
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Watch independent Brownian paths spread out proportionally to <strong className="text-cyan-600 dark:text-cyan-400">√t</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors shadow-xs cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Wave' : 'Resume Wave'}</span>
          </button>
          <button
            onClick={() => setParticlesCount((prev) => (prev === 5 ? 2 : 5))}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-200 dark:border-cyan-800 bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 transition-colors shadow-xs cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{particlesCount === 5 ? 'Show 2 Paths' : 'Show 5 Paths'}</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[180px] sm:h-[210px] block cursor-crosshair" />
      </div>

      {/* Colorful Legend Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-indigo-100 dark:border-slate-800/80 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {PATH_DEFINITIONS.slice(0, particlesCount).map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{
                backgroundColor: `${p.color}15`,
                borderColor: `${p.color}60`,
                color: p.color,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
        <span className="text-slate-500 dark:text-slate-400 font-semibold">
          Theoretical Funnel: <span className="text-cyan-500 font-bold">±σ√t</span> (SD = √T)
        </span>
      </div>
    </div>
  );
};
