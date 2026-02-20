import type { MetadataRoute } from "next";

const BASE = "https://ani-client-web.vercel.app/";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/anime`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/manga`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/characters`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/studios`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/airing`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.7 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "always", priority: 0.6 },
  ];
}
