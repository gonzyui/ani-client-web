import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { formatScore, getMediaHref } from "@/app/lib/utils";

interface MediaCardProps {
  media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
  const title =
    media.title.english || media.title.romaji || media.title.native || "Unknown";
  const image =
    media.coverImage?.extraLarge ||
    media.coverImage?.large ||
    media.coverImage?.medium;

  return (
    <Link href={getMediaHref(media.id)} className="group anime-card block">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
              No Image
            </div>
          )}

          {/* Score badge */}
          {media.averageScore && (
            <div className="score-badge absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
              <span className="text-score">★ {formatScore(media.averageScore)}</span>
            </div>
          )}

          {/* Format badge */}
          {media.format && (
            <div className="absolute left-2 top-2 rounded-md bg-accent/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {media.format.replace(/_/g, " ")}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-accent-light">
            {title}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {media.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="genre-chip rounded-full px-2 py-0.5 text-[10px] font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            {media.episodes && <span>{media.episodes} eps</span>}
            {media.chapters && !media.episodes && (
              <span>{media.chapters} ch</span>
            )}
            {media.seasonYear && (
              <>
                {(media.episodes || media.chapters) && <span>·</span>}
                <span>{media.seasonYear}</span>
              </>
            )}
            {media.status && (
              <>
                <span>·</span>
                <span className="capitalize">
                  {media.status.toLowerCase().replace(/_/g, " ")}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
