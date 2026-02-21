import { MediaSeason } from "ani-client";
import { MAX_PAGE } from "@/app/lib/constants";

/** Generate a tiny 1×1 SVG data-URL for use as a blur placeholder */
export function colorToBlurDataURL(hex: string | null | undefined): string | undefined {
  if (!hex) return undefined;
  const clean = hex.replace("#", "");
  return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect fill='%23${clean}' width='1' height='1'/></svg>`;
}

/** Format an AniList fuzzy date (year/month/day) into a readable string */
export function formatFuzzyDate(d: { year: number | null; month: number | null; day: number | null } | null): string | null {
  if (!d) return null;
  const parts: string[] = [];
  if (d.month) parts.push(new Date(2000, d.month - 1).toLocaleString("en-US", { month: "long" }));
  if (d.day) parts.push(String(d.day));
  if (d.year) parts.push(String(d.year));
  return parts.length > 0 ? parts.join(" ") : null;
}

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

/**
 * Parse AniList character/staff descriptions that contain structured fields
 * like `__Height:__ 190 cm` mixed with prose text.
 * Returns extracted key-value pairs and the remaining bio text.
 */
export function parseDescriptionFields(html: string | null): {
  fields: Array<{ key: string; value: string }>;
  bio: string;
} {
  if (!html) return { fields: [], bio: "" };

  const fields: Array<{ key: string; value: string }> = [];

  // Work on the raw HTML/markdown mix.
  // AniList uses patterns like:  __Key:__ Value  or  **Key:** Value
  // They can be separated by <br>, <br/>, newlines, or just inline.
  // We extract them and keep the remaining text as the bio.

  let remaining = html;

  // Pattern: __Key:__ Value (up to next __ or <br> or end)
  const fieldRegex = /(?:__|<b>|\*\*)([^_*<]+?)(?::)(?:__|<\/b>|\*\*)\s*([^_*]*?)(?=(?:__|<b>|\*\*)[^_*<]+?:|<br\s*\/?>.*?(?:__|<b>|\*\*)|$)/gi;

  // Simpler, more reliable approach: split by <br> or newlines, then check each segment
  const lines = remaining
    .split(/<br\s*\/?>|\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const bioLines: string[] = [];

  for (const line of lines) {
    // Match __Key:__ Value or **Key:** Value or <b>Key:</b> Value
    const match = line.match(/^(?:__|<b>|\*\*)(.+?)(?::?\s*)(?:__|<\/b>|\*\*)\s*(.+)$/);
    if (match) {
      const key = match[1].replace(/:$/, "").trim();
      // Clean HTML from value
      const value = match[2]
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (key && value) {
        fields.push({ key, value });
      }
    } else {
      // Not a field line — it's part of the bio
      bioLines.push(line);
    }
  }

  const bio = stripHtml(bioLines.join(" "));

  return { fields, bio };
}
