export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\n+/g, " ").trim();
}

export function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  return `${(score / 10).toFixed(1)}`;
}

export function formatStatus(status: string | null): string {
  if (!status) return "Unknown";
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatSeason(
  season: string | null,
  year: number | null
): string {
  if (!season && !year) return "TBA";
  const s = season
    ? season.charAt(0) + season.slice(1).toLowerCase()
    : "";
  return [s, year].filter(Boolean).join(" ");
}

/** Centralized helper — change once if route structure evolves */
export function getMediaHref(id: number): string {
  return `/anime/${id}`;
}
