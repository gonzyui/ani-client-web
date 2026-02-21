"use client";

import type { Character, PageInfo } from "ani-client";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import CharacterCard from "@/app/components/CharacterCard";

interface InfiniteCharacterGridProps {
  initialItems: Character[];
  initialPageInfo: PageInfo;
}

export default function InfiniteCharacterGrid({
  initialItems,
  initialPageInfo,
}: InfiniteCharacterGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<Character>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/characters?page=${page}`,
    getKey: (c) => c.id,
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((char) => (
          <CharacterCard key={char.id} character={char} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-10" />}

      {!hasMore && items.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          You've reached the end — {items.length} characters loaded
        </p>
      )}
    </>
  );
}
