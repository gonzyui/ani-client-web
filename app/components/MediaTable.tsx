"use client";

import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatScore, getMediaHref } from "@/app/lib/utils";

type SortField = "title" | "score" | "popularity" | "episodes" | "year" | "status";
type SortDir = "asc" | "desc";

interface MediaTableProps {
  items: Media[];
  preserveOrder?: boolean;
}

function getTitle(m: Media): string {
  return m.title.english || m.title.romaji || m.title.native || "Unknown";
}

function getSortValue(m: Media, field: SortField): string | number {
  switch (field) {
    case "title": return getTitle(m).toLowerCase();
    case "score": return m.averageScore ?? 0;
    case "popularity": return m.popularity ?? 0;
    case "episodes": return m.episodes ?? m.chapters ?? 0;
    case "year": return m.seasonYear ?? 0;
    case "status": return m.status ?? "";
    default: return 0;
  }
}

export default function MediaTable({ items, preserveOrder }: MediaTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(preserveOrder ? null : "popularity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortReset = () =>
    sortField && preserveOrder ? (
      <button
        onClick={() => { setSortField(null); setSortDir("desc"); }}
        className="ml-2 text-[10px] text-accent-light hover:underline"
      >
        Reset
      </button>
    ) : null;

  const sorted = sortField
    ? [...items].sort((a, b) => {
        const aVal = getSortValue(a, sortField);
        const bVal = getSortValue(b, sortField);
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      })
    : items;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="ml-1 text-muted/40">↕</span>;
    return <span className="ml-1 text-accent-light">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const headerBtn = (field: SortField, label: string, className = "") => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center text-left text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-foreground ${className}`}
    >
      {label}
      <SortIcon field={field} />
    </button>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="w-8 px-3 py-3 text-center text-xs font-semibold text-muted">
              # <SortReset />
            </th>
            <th className="px-3 py-3">{headerBtn("title", "Title")}</th>
            <th className="hidden px-3 py-3 sm:table-cell">{headerBtn("score", "Score")}</th>
            <th className="hidden px-3 py-3 md:table-cell">{headerBtn("popularity", "Popularity")}</th>
            <th className="hidden px-3 py-3 md:table-cell">{headerBtn("episodes", "Eps/Ch")}</th>
            <th className="hidden px-3 py-3 lg:table-cell">{headerBtn("year", "Year")}</th>
            <th className="hidden px-3 py-3 lg:table-cell">{headerBtn("status", "Status")}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((media, i) => {
            const title = getTitle(media);
            const cover = media.coverImage?.medium || media.coverImage?.large;
            const href = getMediaHref(media.id, media.type);

            return (
              <tr
                key={media.id}
                className="border-b border-border/50 bg-background transition-colors hover:bg-card"
              >
                <td className="px-3 py-2.5 text-center text-xs text-muted">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <Link href={href} className="flex items-center gap-3 group">
                    {cover && (
                      <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded">
                        <Image src={cover} alt={title} fill className="object-cover" sizes="32px" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground transition-colors group-hover:text-accent-light">
                        {title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {media.format && (
                          <span className="text-[10px] uppercase text-muted">{media.format.replace(/_/g, " ")}</span>
                        )}
                        {media.genres?.slice(0, 2).map((g) => (
                          <span key={g} className="genre-chip rounded-full px-1.5 py-0 text-[10px]">{g}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="hidden px-3 py-2.5 sm:table-cell">
                  {media.averageScore ? (
                    <span className="font-semibold text-score">★ {formatScore(media.averageScore)}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="hidden px-3 py-2.5 text-muted md:table-cell">
                  {media.popularity?.toLocaleString("en-US") ?? "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-muted md:table-cell">
                  {media.episodes ?? media.chapters ?? "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-muted lg:table-cell">
                  {media.seasonYear ?? "—"}
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  {media.status ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      media.status === "RELEASING"
                        ? "bg-green-500/10 text-green-400"
                        : media.status === "FINISHED"
                        ? "bg-blue-500/10 text-blue-400"
                        : media.status === "NOT_YET_RELEASED"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-card text-muted"
                    }`}>
                      {media.status.toLowerCase().replace(/_/g, " ")}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
