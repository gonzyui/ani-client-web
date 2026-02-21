"use client";

import type { Media, PageInfo } from "ani-client";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import MediaCard from "@/app/components/MediaCard";
import MediaTable from "@/app/components/MediaTable";

interface InfiniteMediaGridProps {
  initialItems: Media[];
  initialPageInfo: PageInfo;
  type: "ANIME" | "MANGA";
  category?: "trending" | "top" | "airing" | "upcoming" | "season";
  viewMode?: "grid" | "table";
}

export default function InfiniteMediaGrid({
  initialItems,
  initialPageInfo,
  type,
  category = "trending",
  viewMode = "grid",
}: InfiniteMediaGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<Media>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/browse?type=${type}&category=${category}&page=${page}`,
    getKey: (m) => m.id,
  });

  return (
    <>
      {viewMode === "table" ? (
        <>
          <MediaTable items={items} preserveOrder={category === "trending"} />
          {loading && (
            <div className="mt-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`tskel-${i}`} className="skeleton h-14 w-full rounded-lg" />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((media, i) => (
            <MediaCard key={media.id} media={media} rank={category === "trending" ? i + 1 : undefined} />
          ))}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={`skel-${i}`} />
            ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          You've reached the end — {items.length} titles loaded
        </p>
      )}
    </>
  );
}
