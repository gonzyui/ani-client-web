"use client";

import type { Character, PageInfo } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import { HeartIcon, PersonIcon } from "@/app/components/Icons";

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
          You&apos;ve reached the end — {items.length} characters loaded
        </p>
      )}
    </>
  );
}

function CharacterCard({ character }: { character: Character }) {
  const name = character.name.full || "Unknown";
  const image = character.image?.large || character.image?.medium;

  return (
    <Link
      href={`/character/${character.id}`}
      className="anime-card group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <PersonIcon />
          </div>
        )}

        {character.favourites != null && character.favourites > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-red-400 backdrop-blur-sm">
            <HeartIcon className="h-3 w-3 fill-red-400" />
            {character.favourites.toLocaleString()}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {name}
        </h3>
        {character.name.native && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {character.name.native}
          </p>
        )}
      </div>
    </Link>
  );
}
