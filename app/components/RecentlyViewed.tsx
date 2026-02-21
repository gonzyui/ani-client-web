"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type RecentItem, getRecentViews, clearRecentViews } from "@/app/lib/recentViews";

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(getRecentViews());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Recently Viewed
        </h3>
        <button
          onClick={() => {
            clearRecentViews();
            setItems([]);
          }}
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.type === "MANGA" ? `/manga/${item.id}` : `/anime/${item.id}`}
            className="anime-card group block overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                  No Image
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent-light">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
