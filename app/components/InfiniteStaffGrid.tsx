"use client";

import type { Staff, PageInfo } from "ani-client";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import StaffCard from "@/app/components/StaffCard";

interface InfiniteStaffGridProps {
  initialItems: Staff[];
  initialPageInfo: PageInfo;
}

export default function InfiniteStaffGrid({
  initialItems,
  initialPageInfo,
}: InfiniteStaffGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<Staff>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/staff?page=${page}`,
    getKey: (s) => s.id,
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((person) => (
          <StaffCard key={person.id} staff={person} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          You've reached the end — {items.length} staff loaded
        </p>
      )}
    </>
  );
}
