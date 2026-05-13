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

export async function searchJobs(filters: JobSearchFilters): Promise<JobSearchResult> {
  const response = await fetch("/api/search-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({} as { error?: string }));
    throw new Error(data.error || "Erro ao buscar vagas.");
  }
  return response.json();
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
