"use client";

import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatScore, formatStatus, getMediaHref, stripHtml } from "@/app/lib/utils";

const MAX_COMPARE = 4;
const STORAGE_KEY = "ani-compare-ids";

function getStoredIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CompareClient() {
  const [ids, setIds] = useState<number[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; cover: string | null }>>([]);
  const [searching, setSearching] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIds(getStoredIds());
  }, []);

  // Fetch media when IDs change
  useEffect(() => {
    if (ids.length === 0) {
      setMedia([]);
      return;
    }
    setLoading(true);
    fetch(`/api/compare?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => setMedia(data.results ?? []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, [ids]);

  const persist = (newIds: number[]) => {
    setIds(newIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
  };

  const removeId = (id: number) => {
    persist(ids.filter((i) => i !== id));
  };

  const clearAll = () => {
    persist([]);
  };

  const addId = (id: number) => {
    if (ids.includes(id) || ids.length >= MAX_COMPARE) return;
    persist([...ids, id]);
  };

  // Search handler
  const handleSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      const results = (data.results ?? [])
        .filter((r: { kind: string }) => r.kind === "anime" || r.kind === "manga")
        .slice(0, 8)
        .map((r: { id: number; title: string; cover: string | null }) => ({
          id: r.id,
          title: r.title,
          cover: r.cover,
        }));
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const rows: {
    label: string;
    render: (m: Media) => React.ReactNode;
  }[] = [
    {
      label: "Score",
      render: (m) =>
        m.averageScore ? (
          <span className="font-bold text-score">★ {formatScore(m.averageScore)}</span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      label: "Popularity",
      render: (m) => (
        <span className="text-foreground">{m.popularity?.toLocaleString("en-US") ?? "—"}</span>
      ),
    },
    {
      label: "Status",
      render: (m) => <span className="capitalize text-foreground">{formatStatus(m.status)}</span>,
    },
    {
      label: "Format",
      render: (m) => (
        <span className="text-foreground uppercase">{m.format?.replace(/_/g, " ") ?? "—"}</span>
      ),
    },
    {
      label: "Episodes",
      render: (m) => <span className="text-foreground">{m.episodes ?? "—"}</span>,
    },
    {
      label: "Chapters",
      render: (m) => <span className="text-foreground">{m.chapters ?? "—"}</span>,
    },
    {
      label: "Duration",
      render: (m) => (
        <span className="text-foreground">{m.duration ? `${m.duration} min` : "—"}</span>
      ),
    },
    {
      label: "Season",
      render: (m) => (
        <span className="capitalize text-foreground">
          {m.season ? `${m.season.toLowerCase()} ${m.seasonYear ?? ""}` : m.seasonYear ?? "—"}
        </span>
      ),
    },
    {
      label: "Genres",
      render: (m) => (
        <div className="flex flex-wrap gap-1">
          {m.genres?.slice(0, 4).map((g) => (
            <span key={g} className="genre-chip rounded-full px-2 py-0.5 text-[10px]">
              {g}
            </span>
          )) ?? "—"}
        </div>
      ),
    },
    {
      label: "Favorites",
      render: (m) => (
        <span className="text-foreground">{m.favourites?.toLocaleString("en-US") ?? "—"}</span>
      ),
    },
    {
      label: "Source",
      render: (m) => (
        <span className="capitalize text-foreground">{m.source?.toLowerCase().replace(/_/g, " ") ?? "—"}</span>
      ),
    },
    {
      label: "Synopsis",
      render: (m) => (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted">
          {stripHtml(m.description) || "—"}
        </p>
      ),
    },
  ];

  // Find the best score for highlighting
  const bestScore = Math.max(...media.map((m) => m.averageScore ?? 0));
  const bestPop = Math.max(...media.map((m) => m.popularity ?? 0));

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Compare</h1>
        <p className="mt-2 text-muted">
          Compare up to {MAX_COMPARE} anime or manga side by side
        </p>
      </div>

      {/* Search to add */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search to add anime or manga..."
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            disabled={ids.length >= MAX_COMPARE}
          />
          {searchResults.length > 0 && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    addId(r.id);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  disabled={ids.includes(r.id)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-card-hover disabled:opacity-40"
                >
                  {r.cover && (
                    <Image src={r.cover} alt="" width={28} height={40} className="shrink-0 rounded object-cover" />
                  )}
                  <span className="truncate text-sm text-foreground">{r.title}</span>
                  {ids.includes(r.id) && (
                    <span className="ml-auto text-xs text-muted">Added</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 animate-spin text-muted" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
        {ids.length > 0 && (
          <button
            onClick={clearAll}
            className="shrink-0 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
          >
            Clear All
          </button>
        )}
      </div>

      {loading && ids.length > 0 && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `120px repeat(${ids.length}, minmax(160px, 1fr))` }}>
          {Array.from({ length: (ids.length + 1) * 3 }).map((_, i) => (
            <div key={i} className="skeleton h-8 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && media.length >= 2 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            {/* Header — cover + title */}
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="w-28 px-4 py-3" />
                {media.map((m) => {
                  const title = m.title.english || m.title.romaji || "Unknown";
                  const cover = m.coverImage?.large || m.coverImage?.medium;
                  return (
                    <th key={m.id} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Link href={getMediaHref(m.id, m.type)}>
                          {cover && (
                            <Image src={cover} alt={title} width={80} height={112} className="rounded-lg border border-border shadow-lg" />
                          )}
                        </Link>
                        <Link
                          href={getMediaHref(m.id, m.type)}
                          className="line-clamp-2 text-xs font-semibold text-foreground hover:text-accent-light"
                        >
                          {title}
                        </Link>
                        <button
                          onClick={() => removeId(m.id)}
                          className="text-[10px] text-muted hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/50 transition-colors hover:bg-card/50">
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {row.label}
                  </td>
                  {media.map((m) => (
                    <td
                      key={m.id}
                      className={`px-4 py-3 text-center text-sm ${
                        row.label === "Score" && m.averageScore === bestScore && bestScore > 0
                          ? "bg-green-500/5"
                          : row.label === "Popularity" && m.popularity === bestPop && bestPop > 0
                          ? "bg-blue-500/5"
                          : ""
                      }`}
                    >
                      {row.render(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && media.length < 2 && ids.length < 2 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <svg className="h-12 w-12 text-muted/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <h2 className="text-xl font-semibold text-foreground">
            Add at least 2 titles to compare
          </h2>
          <p className="text-muted">
            Search above to add anime or manga, then compare them side by side.
          </p>
        </div>
      )}
    </main>
  );
}
