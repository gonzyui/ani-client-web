"use client";

import Image from "next/image";
import Link from "next/link";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { StudioSkeleton } from "@/app/components/CardSkeleton";
import { HeartIcon } from "@/app/components/Icons";
import { getMediaHref } from "@/app/lib/utils";
import type { StudioData } from "@/app/lib/queries";

interface InfiniteStudioGridProps {
  initialItems: StudioData[];
  initialPageInfo: {
    hasNextPage: boolean;
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
}

export default function InfiniteStudioGrid({
  initialItems,
  initialPageInfo,
}: InfiniteStudioGridProps) {
  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll<StudioData>({
    initialItems,
    initialHasMore: initialPageInfo.hasNextPage ?? false,
    fetchUrl: (page) => `/api/studios?page=${page}`,
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
          You&apos;ve reached the end — {items.length} studios loaded
        </p>
      )}
    </>
  );
}

function StudioCard({ studio }: { studio: StudioData }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/30">
      <div className="p-5 sm:p-6">
        {/* Studio header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-foreground">{studio.name}</h3>
            {studio.isAnimationStudio && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light">
                Animation Studio
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {studio.favourites != null && studio.favourites > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted">
                <HeartIcon className="h-4 w-4 fill-red-400" />
                {studio.favourites.toLocaleString()}
              </span>
            )}
            {studio.siteUrl && (
              <a
                href={studio.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-light hover:underline"
              >
                AniList ↗
              </a>
            )}
          </div>
        </div>

        {/* Media grid */}
        {studio.media.nodes.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {studio.media.nodes.map((media) => {
              const title =
                media.title.english || media.title.romaji || "Unknown";
              const cover =
                media.coverImage?.large || media.coverImage?.medium;

              return (
                <Link
                  key={media.id}
                  href={getMediaHref(media.id)}
                  className="group relative overflow-hidden rounded-lg"
                  title={title}
                >
                  <div className="relative aspect-[3/4] bg-card">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="w-full p-2">
                        <p className="line-clamp-2 text-xs font-medium text-white">
                          {title}
                        </p>
                        {media.averageScore && (
                          <p className="mt-0.5 text-xs text-green-400">
                            ★ {(media.averageScore / 10).toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
