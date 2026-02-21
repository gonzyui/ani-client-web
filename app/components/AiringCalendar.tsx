"use client";

import type { AiringSchedule } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatScore, getMediaHref } from "@/app/lib/utils";

interface AiringCalendarProps {
  days: string[];
  grouped: Record<number, AiringSchedule[]>;
  weekStart: string;
}

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDayDate(weekStart: string, dayIdx: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayIdx);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AiringCalendar({ days, grouped, weekStart }: AiringCalendarProps) {
  const now = new Date();
  const jsDay = now.getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;

  const [activeDay, setActiveDay] = useState(todayIdx);

  const episodes = grouped[activeDay] ?? [];

  return (
    <div>
      {/* Day tabs */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Days of the week">
        {days.map((day, i) => {
          const count = grouped[i]?.length ?? 0;
          const isToday = i === todayIdx;
          const isActive = i === activeDay;
          return (
            <button
              key={day}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDay(i)}
              className={`relative flex shrink-0 flex-col items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              <span className="text-xs font-bold">{day.slice(0, 3)}</span>
              <span className="mt-0.5 text-[10px] opacity-70">{getDayDate(weekStart, i)}</span>
              {count > 0 && (
                <span className={`mt-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-accent/10 text-accent-light"
                }`}>
                  {count}
                </span>
              )}
              {isToday && !isActive && (
                <span className="absolute -top-1 right-1 h-2 w-2 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Episode list */}
      {episodes.length > 0 ? (
        <div className="space-y-2">
          {episodes.map((ep) => {
            const media = ep.media;
            const title = media.title.english || media.title.romaji || "Unknown";
            const cover = media.coverImage?.large || media.coverImage?.medium;
            const aired = ep.airingAt * 1000 < Date.now();

            return (
              <Link
                key={ep.id}
                href={getMediaHref(media.id, media.type)}
                className={`group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 ${
                  aired
                    ? "border-border hover:border-accent/40"
                    : "border-accent/20 hover:border-accent/50"
                }`}
              >
                {cover && (
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent-light">
                    {title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded bg-accent/20 px-2 py-0.5 font-medium text-accent-light">
                      Episode {ep.episode}
                    </span>
                    {media.format && (
                      <span className="uppercase">{media.format.replace(/_/g, " ")}</span>
                    )}
                    {media.averageScore && (
                      <span className="text-score">★ {formatScore(media.averageScore)}</span>
                    )}
                  </div>
                  {media.genres?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {media.genres.slice(0, 3).map((g) => (
                        <span key={g} className="genre-chip rounded-full px-2 py-0.5 text-[10px] font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className={`text-xs font-bold ${aired ? "text-muted" : "text-accent-light"}`}>
                    {formatTime(ep.airingAt)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {aired ? "Aired" : "Upcoming"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="text-5xl opacity-30" aria-hidden="true">📺</div>
          <h2 className="text-xl font-semibold text-foreground">
            No episodes on {days[activeDay]}
          </h2>
          <p className="text-muted">
            Try checking another day of the week.
          </p>
        </div>
      )}
    </div>
  );
}
