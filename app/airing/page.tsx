import type { AiringSchedule } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import { formatScore, getMediaHref } from "@/app/lib/utils";

export const metadata = {
  title: "Airing Schedule",
  description: "See which anime episodes have recently aired.",
};

export const revalidate = 900;

function formatAiringTime(airingAt: number): string {
  const date = new Date(airingAt * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffH < 1) return "Just aired";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

export default async function AiringPage() {
  const data = await client.getAiredEpisodes({ perPage: 30 });

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Airing Schedule</h1>
        <p className="mt-2 text-muted">
          Recently aired anime episodes in the last 24 hours
        </p>
      </div>

      {data.results.length > 0 ? (
        <div className="space-y-3">
          {data.results.map((ep: AiringSchedule) => {
            const media = ep.media;
            const title = media.title.english || media.title.romaji || "Unknown";
            const cover = media.coverImage?.large || media.coverImage?.medium;

            return (
              <Link
                key={ep.id}
                href={getMediaHref(media.id, media.type)}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                {cover && (
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent-light transition-colors">
                    {title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded bg-accent/20 px-2 py-0.5 font-medium text-accent-light">
                      Episode {ep.episode}
                    </span>
                    {media.format && (
                      <span className="uppercase">{media.format.replace(/_/g, " ")}</span>
                    )}
                    {media.averageScore && (
                      <span className="text-score">★ {formatScore(media.averageScore)}</span>
                    )}
                  </div>
                  {media.genres?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {media.genres.slice(0, 3).map((g) => (
                        <span key={g} className="genre-chip rounded-full px-2 py-0.5 text-[10px] font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-muted">
                    {formatAiringTime(ep.airingAt)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="text-5xl opacity-30" aria-hidden="true">📺</div>
          <h2 className="text-xl font-semibold text-foreground">
            No recently aired episodes
          </h2>
          <p className="text-muted">
            Check back later for the latest airing schedule.
          </p>
        </div>
      )}

    </PageContainer>
  );
}
