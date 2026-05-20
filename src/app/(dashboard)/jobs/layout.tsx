"use client";

import { JobsCacheProvider } from "@/components/providers/JobsCacheProvider";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <JobsCacheProvider>{children}</JobsCacheProvider>;
}
