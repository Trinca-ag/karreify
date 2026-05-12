"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PxControlProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  defaultPx: number | undefined;
  onChange: (v: number | null) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

export default function PxControl({
  icon: Icon,
  label,
  value,
  defaultPx,
  onChange,
  min,
  max,
  disabled = false,
}: PxControlProps) {
  const effective = value ?? defaultPx ?? 0;
  const isOverridden = value != null;
  const isDisabled = disabled || defaultPx == null;

  const [draftStr, setDraftStr] = useState<string>(String(Math.round(effective)));
  const [error, setError] = useState<string | null>(null);

  // Resync the visible input whenever the source of truth changes externally
  // (e.g. +/- buttons, parent reset, default recomputed from new content).
  useEffect(() => {
    setDraftStr(String(Math.round(effective)));
    setError(null);
  }, [effective]);

  const handleInputChange = (raw: string) => {
    setDraftStr(raw);
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "-") {
      setError(null);
      return;
    }
    const n = Number(trimmed);
    if (!Number.isFinite(n) || !/^-?\d+$/.test(trimmed)) {
      setError("Apenas números inteiros");
      return;
    }
    if (n < min) {
      setError(`Valor mínimo permitido: ${min}`);
      return;
    }
    if (n > max) {
      setError(`Valor máximo permitido: ${max}`);
      return;
    }
    setError(null);
    onChange(n);
  };

  const handleBlur = () => {
    // If the typed value is invalid on blur, snap back to the last valid one.
    if (error) {
      setDraftStr(String(Math.round(effective)));
      setError(null);
    }
  };

  const dec = () => onChange(Math.max(Math.round(effective - 1), min));
  const inc = () => onChange(Math.min(Math.round(effective + 1), max));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" /> {label}
        </label>
        {isOverridden && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
            title="Voltar ao padrão"
          >
            padrão
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={effective <= min || isDisabled}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draftStr}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
          disabled={isDisabled}
          className={`flex-1 text-center text-xs font-mono text-gray-200 bg-white/5 border ${
            error ? "border-red-500/70" : "border-white/10"
          } rounded-lg py-1.5 focus:outline-none focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <button
          type="button"
          onClick={inc}
          disabled={effective >= max || isDisabled}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {error && (
        <p className="text-[10px] text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
