import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface FlowStep {
  id: string;
  number: number;
  label: string;
  shortTitle: string;
  badgeColor: string; // e.g. 'from-cyan-500 to-blue-600'
  accentHex: string;  // e.g. '#06b6d4'
}

interface FlowProgressStepperProps {
  steps: FlowStep[];
  topicColor: 'cyan' | 'amber';
  topicLabel: string;
}

export const FlowProgressStepper: React.FC<FlowProgressStepperProps> = ({
  steps,
  topicColor,
  topicLabel,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  // Scroll spy via IntersectionObserver to automatically detect which stage is in the viewport
  useEffect(() => {
    const handleScroll = () => {
      // Find the element currently closest to the top of viewport
      const scrollPos = window.scrollY + 220; // offset for header & sticky stepper

      let current = 1;
      steps.forEach((step) => {
        const el = document.getElementById(step.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            current = step.number;
          }
        }
      });

      setActiveStep(current);
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        for (let i = 1; i <= current; i++) {
          next.add(i);
        }
        return Array.from(next);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps]);

  const scrollToStep = (id: string, stepNumber: number) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 140; // accommodate sticky header + stepper
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveStep(stepNumber);
    }
  };

  const handlePrev = () => {
    const target = Math.max(1, activeStep - 1);
    const step = steps.find((s) => s.number === target);
    if (step) scrollToStep(step.id, target);
  };

  const handleNext = () => {
    const target = Math.min(steps.length, activeStep + 1);
    const step = steps.find((s) => s.number === target);
    if (step) scrollToStep(step.id, target);
  };

  const currentStepObj = steps.find((s) => s.number === activeStep) || steps[0];
  const progressPercent = Math.round(((activeStep - 1) / (steps.length - 1)) * 100);

  const isCyan = topicColor === 'cyan';

  return (
    <div className="sticky top-[72px] z-30 transition-all">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-3 sm:p-4 shadow-lg shadow-slate-900/5 dark:shadow-slate-950/40">
        {/* Top Info Row */}
        <div className="flex items-center justify-between gap-3 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                isCyan ? 'bg-cyan-500' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px]">
              {topicLabel} Progress:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">
              Stage {activeStep} of {steps.length}
            </span>
            <span className="hidden sm:inline-block text-slate-400">·</span>
            <span
              className="hidden sm:inline-block font-semibold truncate max-w-[200px] lg:max-w-xs text-xs"
              style={{ color: currentStepObj.accentHex }}
            >
              {currentStepObj.label}
            </span>
          </div>

          {/* Quick Prev / Next Step Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {progressPercent}% Explored
            </span>
            <button
              onClick={handlePrev}
              disabled={activeStep === 1}
              aria-label="Previous step"
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                activeStep === 1
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Jump to previous stage"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeStep === steps.length}
              aria-label="Next step"
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                activeStep === steps.length
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Jump to next stage"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Stepper Nodes & Connecting Rails */}
        <div className="relative">
          {/* Background Connecting Rail */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full z-0" />

          {/* Active Fill Rail */}
          <div
            className={`absolute top-1/2 left-4 -translate-y-1/2 h-1.5 rounded-full z-0 transition-all duration-300 ${
              isCyan
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
            }`}
            style={{
              width: `calc(${((activeStep - 1) / (steps.length - 1)) * 100}% - 8px)`,
            }}
          />

          {/* Stepper Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            {steps.map((step) => {
              const isActive = step.number === activeStep;
              const isPast = step.number < activeStep;
              const isCompleted = completedSteps.includes(step.number);

              return (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(step.id, step.number)}
                  className="group flex flex-col items-center focus:outline-none cursor-pointer"
                  title={`Jump to Stage ${step.number}: ${step.label}`}
                >
                  {/* Step Bubble Circle */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-extrabold text-xs transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-tr ${step.badgeColor} text-white shadow-lg ring-4 ring-white dark:ring-slate-900 scale-115`
                        : isPast
                        ? 'bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Step Label (Hidden on small mobile, visible on tablet+) */}
                  <div className="hidden md:flex flex-col items-center mt-1.5 max-w-[85px] text-center">
                    <span
                      className={`text-[10px] font-bold leading-tight truncate transition-colors ${
                        isActive
                          ? 'text-slate-900 dark:text-white font-extrabold'
                          : isPast
                          ? 'text-slate-600 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`}
                    >
                      {step.shortTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
