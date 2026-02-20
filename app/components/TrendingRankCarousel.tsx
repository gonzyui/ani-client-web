"use client";

import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatScore, getMediaHref } from "@/app/lib/utils";

interface TrendingRankCarouselProps {
  items: Media[]; // items #2 to #10
}

export default function TrendingRankCarousel({ items }: TrendingRankCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf: number;

    const step = () => {
      if (!pausedRef.current && el) {
        if (window.innerWidth >= 640) {
          // Vertical scroll on desktop
          el.scrollTop += 0.5;
          // When we've scrolled past the first set of items, jump back
          const half = el.scrollHeight / 2;
          if (el.scrollTop >= half) {
            el.scrollTop -= half;
          }
        } else {
          // Horizontal scroll on mobile
          el.scrollLeft += 0.5;
          const half = el.scrollWidth / 2;
          if (el.scrollLeft >= half) {
            el.scrollLeft -= half;
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Duplicate items so we can loop seamlessly
  const loopedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
      className="ranking-carousel flex gap-3 overflow-x-auto pb-2 sm:flex-col sm:max-h-[380px] sm:overflow-x-visible sm:overflow-y-auto sm:pb-0 sm:pr-1"
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
            href={getMediaHref(anime.id)}
            className="group flex shrink-0 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-white/10 sm:w-full"
            style={{ minWidth: "220px" }}
          >
            {/* Rank number */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/20 text-xs font-bold text-accent-light">
              #{rank}
            </span>

            {/* Thumbnail */}
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

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium text-white group-hover:text-accent-light transition-colors duration-200">
                {title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-400">
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
