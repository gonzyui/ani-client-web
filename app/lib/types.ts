/** Centralized types shared across the application */

export interface CharacterEdge {
  id: number;
  name: { full: string | null };
  image: { medium: string | null };
  role: string;
}

export interface StaffEdge {
  id: number;
  name: { full: string | null };
  image: { medium: string | null };
  role: string;
}

export interface ScoreDistEntry {
  score: number;
  amount: number;
}

export interface ExternalLink {
  id: number;
  url: string;
  site: string;
  type: string;
  icon: string | null;
  color: string | null;
}

export interface NextAiring {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface InfoField {
  key: string;
  value: string;
}

/** Fuzzy date as returned by AniList (year/month/day can each be null) */
export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

/** Paged response shape used by API routes and the raw client */
export interface RawPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

/** Raw staff browse page response (shared by staff page + API route) */
export interface RawStaffPage {
  Page: {
    pageInfo: RawPageInfo;
    staff: import("ani-client").Staff[];
  };
}

/** Raw studio listing page response (shared by studios page + API route) */
export interface RawStudioPage {
  Page: {
    pageInfo: import("ani-client").PageInfo;
    studios: import("ani-client").StudioDetail[];
  };
}
