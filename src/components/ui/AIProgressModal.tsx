"use client";

import { useEffect } from "react";
import { Sparkles, Check, type LucideIcon } from "lucide-react";

interface AIProgressModalProps {
  isOpen: boolean;
  title: string;
  steps?: string[];
  progress: number;
  message: string;
  icon?: LucideIcon;
  accent?: "primary" | "violet" | "emerald" | "amber" | "sky" | "teal";
}

const ACCENTS = {
  primary: {
    iconBg: "from-primary-500 to-accent-violet",
    barFill: "from-primary-500 via-accent-violet to-accent-cyan",
    glow: "from-primary-500/30 to-accent-violet/30",
    pct: "text-primary-300",
    ringA: "border-t-primary-500 border-r-accent-violet",
    ringB: "border-b-accent-cyan/60",
    stepActive: "from-primary-500 to-accent-violet",
  },
  violet: {
    iconBg: "from-accent-violet to-accent-pink",
    barFill: "from-accent-violet via-accent-pink to-primary-500",
    glow: "from-accent-violet/30 to-accent-pink/30",
    pct: "text-accent-violet",
    ringA: "border-t-accent-violet border-r-accent-pink",
    ringB: "border-b-primary-500/60",
    stepActive: "from-accent-violet to-accent-pink",
  },
  emerald: {
    iconBg: "from-emerald-500 to-teal-500",
    barFill: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "from-emerald-500/30 to-teal-500/30",
    pct: "text-emerald-300",
    ringA: "border-t-emerald-500 border-r-teal-500",
    ringB: "border-b-cyan-500/60",
    stepActive: "from-emerald-500 to-teal-500",
  },
  amber: {
    iconBg: "from-amber-500 to-orange-500",
    barFill: "from-amber-500 via-orange-500 to-pink-500",
    glow: "from-amber-500/30 to-orange-500/30",
    pct: "text-amber-300",
    ringA: "border-t-amber-500 border-r-orange-500",
    ringB: "border-b-pink-500/60",
    stepActive: "from-amber-500 to-orange-500",
  },
  sky: {
    iconBg: "from-sky-500 to-blue-500",
    barFill: "from-sky-500 via-blue-500 to-accent-violet",
    glow: "from-sky-500/30 to-blue-500/30",
    pct: "text-sky-300",
    ringA: "border-t-sky-500 border-r-blue-500",
    ringB: "border-b-accent-violet/60",
    stepActive: "from-sky-500 to-blue-500",
  },
  teal: {
    iconBg: "from-teal-500 to-cyan-500",
    barFill: "from-teal-500 via-cyan-500 to-primary-500",
    glow: "from-teal-500/30 to-cyan-500/30",
    pct: "text-teal-300",
    ringA: "border-t-teal-500 border-r-cyan-500",
    ringB: "border-b-primary-500/60",
    stepActive: "from-teal-500 to-cyan-500",
  },
};

export default function AIProgressModal({
  isOpen,
  title,
  steps = [],
  progress,
  message,
  icon: Icon = Sparkles,
  accent = "primary",
}: AIProgressModalProps) {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const a = ACCENTS[accent];
  const clamped = Math.max(0, Math.min(100, progress));
  const stepCount = steps.length;
  const currentStepIndex =
    stepCount > 0
      ? Math.min(Math.floor((clamped / 100) * stepCount), stepCount - 1)
      : -1;
  const isDone = clamped >= 100;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-dark-900/85 backdrop-blur-md animate-fade-in" />

      {/* Modal card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-modal-pop"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
      >
        {/* Outer gradient border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${a.iconBg} opacity-30 blur-2xl`} />

        {/* Inner card */}
        <div className="relative bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/60">
          {/* Decorative gradient mesh */}
          <div className={`absolute top-0 left-0 w-48 h-48 rounded-full bg-gradient-to-br ${a.glow} blur-3xl opacity-60 pointer-events-none`} />
          <div className={`absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br ${a.glow} blur-3xl opacity-50 pointer-events-none`} />

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-2xl"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative p-8">
            {/* Animated icon with rotating rings */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                {/* Outer ring */}
                <div
                  className={`absolute inset-0 rounded-full border-2 border-transparent ${a.ringA} rotate-slow`}
                  style={{ animationDuration: "2.6s" }}
                />
                {/* Middle ring */}
                <div
                  className={`absolute inset-1.5 rounded-full border-2 border-transparent ${a.ringB} rotate-reverse`}
                  style={{ animationDuration: "3.8s" }}
                />
                {/* Pulsing glow */}
                <div className={`absolute inset-3 rounded-2xl bg-gradient-to-br ${a.iconBg} blur-xl opacity-70 animate-pulse-glow`} />
                {/* Icon container */}
                <div className={`absolute inset-3 rounded-2xl bg-gradient-to-br ${a.iconBg} flex items-center justify-center shadow-lg`}>
                  {isDone ? (
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  ) : (
                    <Icon className="w-7 h-7 text-white animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-center text-xl font-heading font-semibold text-white mb-1.5">
              {title}
            </h3>

            {/* Current message with key-based fade */}
            <p
              key={message}
              className="text-center text-sm text-gray-400 min-h-[20px] mb-6 animate-fade-in"
            >
              {message}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.18em] font-medium">
                  Progresso
                </span>
                <span className={`text-sm font-mono font-semibold ${a.pct}`}>
                  {clamped}%
                </span>
              </div>
              <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                {/* Fill */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${a.barFill} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${clamped}%` }}
                />
                {/* Shimmer overlay (only while in progress) */}
                {!isDone && clamped > 0 && (
                  <div
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent ai-progress-shimmer"
                  />
                )}
              </div>
            </div>

            {/* Step list */}
            {stepCount > 0 && (
              <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1 ai-progress-scroll">
                {steps.map((step, i) => {
                  const done = isDone || i < currentStepIndex;
                  const active = !isDone && i === currentStepIndex;
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${
                        done
                          ? "text-gray-300"
                          : active
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          done
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/30"
                            : active
                            ? `bg-gradient-to-br ${a.stepActive} shadow-md scale-110`
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {done ? (
                          <Check
                            className="w-3 h-3 text-white animate-step-check"
                            strokeWidth={3}
                          />
                        ) : active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        ) : null}
                      </span>
                      <span className={`leading-snug ${active ? "animate-pulse" : ""}`}>
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
