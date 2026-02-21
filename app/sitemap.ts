import type { MetadataRoute } from "next";

const BASE = "https://aniclient.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/anime`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/manga`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/airing`, lastModified: now, changeFrequency: "always", priority: 0.9 },
    { url: `${BASE}/characters`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/staff`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/studios`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/stats`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/recommendation`, lastModified: now, changeFrequency: "always", priority: 0.7 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: "always", priority: 0.6 },
  ];
}
