import type { Media } from "ani-client";
import Link from "next/link";
import MediaCard from "@/app/components/MediaCard";
import FadeIn from "@/app/components/FadeIn";

interface MediaGridProps {
  title: string;
  subtitle?: string;
  items: Media[];
  viewAllHref?: string;
}

export default function MediaGrid({
  title,
  subtitle,
  items,
  viewAllHref,
}: MediaGridProps) {
  return (
    <FadeIn>
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-accent-light transition-colors hover:text-accent"
            >
              View all &rarr;
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((media, i) => (
            <FadeIn key={media.id} delay={i * 60}>
              <MediaCard media={media} />
            </FadeIn>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
