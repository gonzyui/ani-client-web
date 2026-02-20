"use client";

import type { Media, PageInfo } from "ani-client";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import MediaCard from "@/app/components/MediaCard";

interface InfiniteMediaGridProps {
  initialItems: Media[];
  initialPageInfo: PageInfo;
  type: "ANIME" | "MANGA";
  category?: "trending" | "top" | "airing";
}

export default function InfiniteMediaGrid({
  initialItems,
  initialPageInfo,
  type,
  category = "trending",
}: InfiniteMediaGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<Media>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/browse?type=${type}&category=${category}&page=${page}`,
  });

  return (
    <>
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
          You&apos;ve reached the end — {items.length} titles loaded
        </p>
      )}
    </>
  );
}
