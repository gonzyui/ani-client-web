"use client";

import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatScore, getMediaHref } from "@/app/lib/utils";

interface TrendingRankCarouselProps {
  items: Media[];
}

export default function TrendingRankCarousel({ items }: TrendingRankCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const visibleRef = { current: true };
    let raf: number;

    const step = () => {
      if (!pausedRef.current && visibleRef.current && el) {
        if (window.innerWidth >= 640) {
          el.scrollTop += 0.5;
          const half = el.scrollHeight / 2;
          if (el.scrollTop >= half) el.scrollTop -= half;
        } else {
          el.scrollLeft += 0.5;
          const half = el.scrollWidth / 2;
          if (el.scrollLeft >= half) el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(el);

    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const loopedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
      className="ranking-carousel flex gap-3 overflow-x-auto pb-2 sm:flex-col sm:max-h-[300px] sm:overflow-x-visible sm:overflow-y-auto sm:pb-0 sm:pr-1"
      style={{ scrollBehavior: "auto" }}
    >
      {loopedItems.map((anime, i) => {
        const rank = (i % items.length) + 2;
        const title =
          anime.title.english || anime.title.romaji || anime.title.native || "Unknown";
        const cover =
          anime.coverImage?.large || anime.coverImage?.medium;

        return (
          <Link
            key={`${anime.id}-${i}`}
            href={getMediaHref(anime.id, "ANIME")}
            className="group flex shrink-0 items-center gap-3 rounded-lg border border-border bg-card/50 p-2 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-card-hover sm:w-full"
            style={{ minWidth: "220px" }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/20 text-xs font-bold text-accent-light">
              #{rank}
            </span>
            {cover && (
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={cover}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-accent-light transition-colors duration-200">
                {title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
                {anime.averageScore && (
                  <span className="flex items-center gap-0.5 text-score">
                    ★ {formatScore(anime.averageScore)}
                  </span>
                )}
                {anime.episodes && <span>{anime.episodes} eps</span>}
                {anime.format && (
                  <span className="uppercase">{anime.format.replace(/_/g, " ")}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
