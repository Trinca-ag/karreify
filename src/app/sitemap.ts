import type { MetadataRoute } from "next";
import { allGuideSlugs } from "@/content/guides";
import { allProfessionSlugs } from "@/content/professions";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const guides: MetadataRoute.Sitemap = allGuideSlugs().map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: slug === "como-fazer-um-curriculo" ? 0.9 : 0.8,
  }));

  const professions: MetadataRoute.Sitemap = allProfessionSlugs().map((slug) => ({
    url: `${BASE}/modelos-de-curriculo/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/modelos-de-curriculo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guias`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...guides,
    ...professions,
    { url: `${BASE}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
