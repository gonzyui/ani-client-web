import { MediaSeason } from "ani-client";
import { MAX_PAGE } from "@/app/lib/constants";

/** Strip HTML tags and decode common entities */
export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(p|div|li|h[1-6])[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  return (score / 10).toFixed(1);
}

export function formatStatus(status: string | null): string {
  if (!status) return "Unknown";
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatSeason(season: string | null, year: number | null): string {
  if (!season && !year) return "TBA";
  const s = season ? season.charAt(0) + season.slice(1).toLowerCase() : "";
  return [s, year].filter(Boolean).join(" ");
}

/** Build the canonical URL for a media detail page */
export function getMediaHref(id: number, type?: string): string {
  return type === "MANGA" ? `/manga/${id}` : `/anime/${id}`;
}

/** Determine the current AniList media season */
export function getCurrentSeason(): { season: MediaSeason; year: number } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  if (month <= 3) return { season: MediaSeason.WINTER, year };
  if (month <= 6) return { season: MediaSeason.SPRING, year };
  if (month <= 9) return { season: MediaSeason.SUMMER, year };
  return { season: MediaSeason.FALL, year };
}

/** Clamp a page number to [1, MAX_PAGE] */
export function clampPage(raw: string | null): number {
  const n = Math.max(1, parseInt(raw ?? "1", 10) || 1);
  return Math.min(n, MAX_PAGE);
}
