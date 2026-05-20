"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Job, DatePeriod } from "@/services/jobs";

interface CachedPage {
  jobs: Job[];
  totalCount: number;
  fetchedAt: number;
}

interface JobsCacheState {
  keyword: string;
  uf: string;
  city: string;
  period: DatePeriod;
  exactMatch: boolean;
  page: number;
  jobs: Job[];
  totalCount: number;
  searched: boolean;
  error: string | null;
  pages: Record<string, CachedPage>;
  pageOrder: string[];
}

interface JobsCacheContextType extends JobsCacheState {
  setKeyword: (v: string) => void;
  setUf: (v: string) => void;
  setCity: (v: string) => void;
  setPeriod: (v: DatePeriod) => void;
  setExactMatch: (v: boolean) => void;
  setPage: (v: number) => void;
  setJobs: (v: Job[]) => void;
  setTotalCount: (v: number) => void;
  setSearched: (v: boolean) => void;
  setError: (v: string | null) => void;
  reset: () => void;
  getCachedPage: (key: string) => CachedPage | null;
  cachePage: (key: string, jobs: Job[], totalCount: number) => void;
}

export const JOBS_CACHE_STORAGE_KEY = "karreify_jobs_cache_v1";
const MAX_CACHED_PAGES = 5;

const defaultState: JobsCacheState = {
  keyword: "",
  uf: "",
  city: "",
  period: "month",
  exactMatch: false,
  page: 1,
  jobs: [],
  totalCount: 0,
  searched: false,
  error: null,
  pages: {},
  pageOrder: [],
};

function loadFromStorage(): JobsCacheState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = sessionStorage.getItem(JOBS_CACHE_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<JobsCacheState>;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

const JobsCacheContext = createContext<JobsCacheContextType | null>(null);

export function JobsCacheProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JobsCacheState>(defaultState);
  const hydratedRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState(loadFromStorage());
    hydratedRef.current = true;
  }, []);

  // Debounce sessionStorage writes. Without this, every keystroke in the
  // search input serializes the entire state (including big job arrays) on
  // the main thread.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    const handle = window.setTimeout(() => {
      try {
        sessionStorage.setItem(JOBS_CACHE_STORAGE_KEY, JSON.stringify(state));
      } catch {
        // sessionStorage may be unavailable (private mode / quota) — degrade silently
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [state]);

  // Build individual stable setters once. Previously the provider called
  // `setField("keyword")` etc. inside the value object on every render — each
  // call returned a brand-new function, so every consumer of useJobsCache
  // saw a new value and re-rendered on every state change.
  const setKeyword = useCallback(
    (v: string) => setState((p) => ({ ...p, keyword: v })),
    []
  );
  const setUf = useCallback(
    (v: string) => setState((p) => ({ ...p, uf: v })),
    []
  );
  const setCity = useCallback(
    (v: string) => setState((p) => ({ ...p, city: v })),
    []
  );
  const setPeriod = useCallback(
    (v: DatePeriod) => setState((p) => ({ ...p, period: v })),
    []
  );
  const setExactMatch = useCallback(
    (v: boolean) => setState((p) => ({ ...p, exactMatch: v })),
    []
  );
  const setPage = useCallback(
    (v: number) => setState((p) => ({ ...p, page: v })),
    []
  );
  const setJobs = useCallback(
    (v: Job[]) => setState((p) => ({ ...p, jobs: v })),
    []
  );
  const setTotalCount = useCallback(
    (v: number) => setState((p) => ({ ...p, totalCount: v })),
    []
  );
  const setSearched = useCallback(
    (v: boolean) => setState((p) => ({ ...p, searched: v })),
    []
  );
  const setError = useCallback(
    (v: string | null) => setState((p) => ({ ...p, error: v })),
    []
  );

  const reset = useCallback(() => {
    setState(defaultState);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(JOBS_CACHE_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const getCachedPage = useCallback(
    (key: string): CachedPage | null => stateRef.current.pages[key] ?? null,
    []
  );

  const cachePage = useCallback(
    (key: string, jobs: Job[], totalCount: number) => {
      setState((prev) => {
        const order = prev.pageOrder.filter((k) => k !== key);
        order.push(key);
        const pages: Record<string, CachedPage> = {
          ...prev.pages,
          [key]: { jobs, totalCount, fetchedAt: Date.now() },
        };
        while (order.length > MAX_CACHED_PAGES) {
          const evicted = order.shift();
          if (evicted) delete pages[evicted];
        }
        return { ...prev, pages, pageOrder: order };
      });
    },
    []
  );

  const value = useMemo<JobsCacheContextType>(
    () => ({
      ...state,
      setKeyword,
      setUf,
      setCity,
      setPeriod,
      setExactMatch,
      setPage,
      setJobs,
      setTotalCount,
      setSearched,
      setError,
      reset,
      getCachedPage,
      cachePage,
    }),
    [
      state,
      setKeyword,
      setUf,
      setCity,
      setPeriod,
      setExactMatch,
      setPage,
      setJobs,
      setTotalCount,
      setSearched,
      setError,
      reset,
      getCachedPage,
      cachePage,
    ]
  );

  return (
    <JobsCacheContext.Provider value={value}>
      {children}
    </JobsCacheContext.Provider>
  );
}

export function useJobsCache() {
  const ctx = useContext(JobsCacheContext);
  if (!ctx) {
    throw new Error("useJobsCache must be used within a JobsCacheProvider");
  }
  return ctx;
}
