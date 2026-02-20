"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "ani-client";
import MediaCard from "@/app/components/MediaCard";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import { SCROLL_ROOT_MARGIN } from "@/app/lib/constants";

export interface Filters {
  genre: string;
  format: string;
  status: string;
  season: string;
  year: string;
  sort: string;
}

export const EMPTY_FILTERS: Filters = {
  genre: "",
  format: "",
  status: "",
  season: "",
  year: "",
  sort: "",
};

const ANIME_FORMATS = [
  { value: "", label: "Any" },
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Music" },
];

const MANGA_FORMATS = [
  { value: "", label: "Any" },
  { value: "MANGA", label: "Manga" },
  { value: "NOVEL", label: "Light Novel" },
  { value: "ONE_SHOT", label: "One Shot" },
];

const STATUSES = [
  { value: "", label: "Any" },
  { value: "RELEASING", label: "Releasing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Not Yet Released" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "HIATUS", label: "Hiatus" },
];

const SEASONS = [
  { value: "", label: "Any" },
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

const SORT_OPTIONS = [
  { value: "", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score ↓" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "FAVOURITES_DESC", label: "Favorites ↓" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "START_DATE", label: "Oldest" },
  { value: "TITLE_ENGLISH", label: "Title A → Z" },
];

function generateYears(): { value: string; label: string }[] {
  const current = new Date().getFullYear() + 1;
  const years: { value: string; label: string }[] = [{ value: "", label: "Any" }];
  for (let y = current; y >= 1970; y--) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

const YEARS = generateYears();

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FilterBarProps {
  type: "ANIME" | "MANGA";
  genres: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function FilterBar({ type, genres, filters, onChange, onReset }: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const genreOptions = [
    { value: "", label: "Any" },
    ...genres.map((g) => ({ value: g, label: g })),
  ];

  const formatOptions = type === "ANIME" ? ANIME_FORMATS : MANGA_FORMATS;

  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
        <SelectFilter
          label="Genre"
          value={filters.genre}
          options={genreOptions}
          onChange={(v) => update("genre", v)}
        />
        <SelectFilter
          label="Format"
          value={filters.format}
          options={formatOptions}
          onChange={(v) => update("format", v)}
        />
        <SelectFilter
          label="Status"
          value={filters.status}
          options={STATUSES}
          onChange={(v) => update("status", v)}
        />
        <SelectFilter
          label="Season"
          value={filters.season}
          options={SEASONS}
          onChange={(v) => update("season", v)}
        />
        <SelectFilter
          label="Year"
          value={filters.year}
          options={YEARS}
          onChange={(v) => update("year", v)}
        />
        <SelectFilter
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(v) => update("sort", v)}
        />
        <div className="flex items-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`h-9 w-full rounded-lg border px-3 text-sm font-medium transition-all ${
              hasActiveFilters
                ? "border-accent/30 bg-accent/10 text-accent-light hover:bg-accent/20"
                : "cursor-not-allowed border-border bg-card-hover text-muted"
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilteredMediaGridProps {
  type: "ANIME" | "MANGA";
  filters: Filters;
}

export function FilteredMediaGrid({ type, filters }: FilteredMediaGridProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(false);

    const filterKey = JSON.stringify(filters);

  const buildUrl = useCallback(
    (p: number) => {
      const params = new URLSearchParams();
      params.set("type", type);
      params.set("category", "filter");
      params.set("page", String(p));
      if (filters.genre) params.set("genre", filters.genre);
      if (filters.format) params.set("format", filters.format);
      if (filters.status) params.set("status", filters.status);
      if (filters.season) params.set("season", filters.season);
      if (filters.year) params.set("year", filters.year);
      if (filters.sort) params.set("sort", filters.sort);
      return `/api/browse?${params.toString()}`;
    },
    [type, filters],
  );

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setItems([]);
    setPage(1);
    pageRef.current = 1;
    setHasMore(false);
    hasMoreRef.current = false;
    setLoading(true);

    fetch(buildUrl(1), { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.results ?? []);
        const next = data.pageInfo?.hasNextPage ?? false;
        setHasMore(next);
        hasMoreRef.current = next;
        setTotalResults(data.pageInfo?.total ?? 0);
        setPage(1);
        pageRef.current = 1;
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setItems([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, type]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const nextPage = pageRef.current + 1;

    try {
      const res = await fetch(buildUrl(nextPage));
      const data = await res.json();
      setItems((prev) => [...prev, ...(data.results ?? [])]);
      const next = data.pageInfo?.hasNextPage ?? false;
      setHasMore(next);
      hasMoreRef.current = next;
      setPage(nextPage);
      pageRef.current = nextPage;
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("Filter fetch failed:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: SCROLL_ROOT_MARGIN },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">No results</p>
        <p className="text-sm text-muted">
          Try adjusting your filters to find something
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted">
        {totalResults > 0 ? `${totalResults.toLocaleString('en-US')} results` : `${items.length} results`}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={`skel-${i}`} />
          ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-10" />}
      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          You've reached the end — {items.length} titles loaded
        </p>
      )}
    </>
  );
}
