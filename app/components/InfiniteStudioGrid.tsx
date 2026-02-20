"use client";

import type { StudioDetail, PageInfo } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteScroll } from "@/app/lib/hooks";
import { StudioSkeleton } from "@/app/components/CardSkeleton";
import { HeartIcon } from "@/app/components/Icons";
import { getMediaHref } from "@/app/lib/utils";
import FadeIn from "@/app/components/FadeIn";

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

function StudioCard({ studio }: { studio: StudioDetail }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/30">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/studios/${studio.id}`} className="text-lg font-bold text-foreground hover:text-accent-light transition-colors">
              {studio.name}
            </Link>
            {studio.isAnimationStudio && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light">
                Animation Studio
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {studio.favourites != null && studio.favourites > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted">
                <HeartIcon className="h-4 w-4 fill-current text-red-400" />
                {studio.favourites.toLocaleString('en-US')}
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

        {studio.media && studio.media.nodes.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {studio.media.nodes.map((media, idx) => {
              const title =
                media.title.english || media.title.romaji || "Unknown";
              const cover =
                media.coverImage?.large || media.coverImage?.medium;

              return (
                <Link
                  key={`${media.id}-${idx}`}
                  href={getMediaHref(media.id, media.type)}
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
