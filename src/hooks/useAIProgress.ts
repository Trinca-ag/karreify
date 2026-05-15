"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAIProgressOptions {
  messages: string[];
  finalMessage?: string;
  /**
   * Tempo (em segundos) em que a curva atinge ~80%. A curva é assintótica:
   * sobe rápido no início, desacelera ao se aproximar de 95%, e nunca chega
   * em 100% sozinha — só vai a 100% quando `stop()` for chamado.
   */
  expectedDuration?: number;
}

export function useAIProgress({
  messages,
  finalMessage = "Concluído!",
  expectedDuration = 12,
}: UseAIProgressOptions) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const messagesRef = useRef(messages);
  const durationRef = useRef(expectedDuration);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    durationRef.current = expectedDuration;
  }, [expectedDuration]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stopInterval();
    const initial = messagesRef.current[0] ?? "";
    setProgress(0);
    setMessage(initial);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const duration = durationRef.current || 12;
      const t = elapsed / duration;
      // Curva assintótica: ~56% em 0.5·d, ~80% em 1·d, ~92% em 2·d, máx 95%.
      const target = 95 * (1 - Math.exp(-1.8 * t));
      const rounded = Math.max(0, Math.min(95, Math.round(target)));
      setProgress(rounded);

      const msgs = messagesRef.current;
      if (msgs.length > 0) {
        const idx = Math.min(
          Math.floor((rounded / 95) * msgs.length),
          msgs.length - 1,
        );
        setMessage(msgs[idx]);
      }
    }, 180);
  }, [stopInterval]);

  const stop = useCallback(() => {
    stopInterval();
    setProgress(100);
    setMessage(finalMessage);
  }, [finalMessage, stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setProgress(0);
    setMessage("");
  }, [stopInterval]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  return { progress, message, start, stop, reset };
}
