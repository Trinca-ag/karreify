"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(JOBS_CACHE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage may be unavailable (private mode / quota) — degrade silently
    }
  }, [state]);

  const setField = useCallback(
    <K extends keyof JobsCacheState>(key: K) =>
      (value: JobsCacheState[K]) => {
        setState((prev) => ({ ...prev, [key]: value }));
      },
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

  return (
    <JobsCacheContext.Provider
      value={{
        ...state,
        setKeyword: setField("keyword"),
        setUf: setField("uf"),
        setCity: setField("city"),
        setPeriod: setField("period"),
        setExactMatch: setField("exactMatch"),
        setPage: setField("page"),
        setJobs: setField("jobs"),
        setTotalCount: setField("totalCount"),
        setSearched: setField("searched"),
        setError: setField("error"),
        reset,
        getCachedPage,
        cachePage,
      }}
    >
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
