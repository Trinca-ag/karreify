export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  updated: string;
}

export type DatePeriod = "today" | "week" | "month";

export interface JobSearchFilters {
  keyword: string;
  uf?: string;
  city?: string;
  period: DatePeriod;
  exactMatch?: boolean;
  page?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  totalCount: number;
  page: number;
}

export const DATE_PERIOD_LABELS: Record<DatePeriod, string> = {
  today: "Hoje",
  week: "Última semana",
  month: "Último mês",
};

import { authedFetch } from "@/lib/api-client";

export class JobsSearchError extends Error {
  code?: string;
  status: number;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function searchJobs(filters: JobSearchFilters): Promise<JobSearchResult> {
  const response = await authedFetch("/api/search-jobs", {
    method: "POST",
    body: JSON.stringify(filters),
  });
  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({} as { error?: string; code?: string }));
    throw new JobsSearchError(
      data.error || "Erro ao buscar vagas.",
      response.status,
      data.code
    );
  }
  return response.json();
}

export interface BuyJobsPassResult {
  success: true;
  jobsPassExpiresAt: number;
  jobsPassType: "weekly" | "monthly";
  credits: number;
}

export async function buyJobsPass(passId: "weekly" | "monthly"): Promise<BuyJobsPassResult> {
  const res = await authedFetch("/api/jobs/buy-pass", {
    method: "POST",
    body: JSON.stringify({ passId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new JobsSearchError(
      data?.error || "Erro ao comprar passe.",
      res.status,
      data?.code
    );
  }
  return data;
}

export function formatRelativeDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "Há 1 semana" : `Há ${weeks} semanas`;
  }
  return "Há mais de 1 mês";
}
