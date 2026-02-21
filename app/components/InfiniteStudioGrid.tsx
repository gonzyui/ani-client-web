"use client";

import type { StudioDetail, PageInfo } from "ani-client";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { StudioSkeleton } from "@/app/components/CardSkeleton";
import StudioCard from "@/app/components/StudioCard";

interface InfiniteStudioGridProps {
  initialItems: StudioDetail[];
  initialPageInfo: PageInfo;
}

export default function InfiniteStudioGrid({
  initialItems,
  initialPageInfo,
}: InfiniteStudioGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<StudioDetail>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/studios?page=${page}`,
    getKey: (s) => s.id,
  });

  return (
    <>
      <div className="space-y-6">
        {items.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <StudioSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          You've reached the end — {items.length} studios loaded
        </p>
      )}
    </>
  );
}
