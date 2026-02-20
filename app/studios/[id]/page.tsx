import type { PageInfo } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { getMediaHref } from "@/app/lib/utils";
import { HeartIcon } from "@/app/components/Icons";
import { STUDIO_DETAIL_QUERY } from "@/app/lib/queries";
import { PER_PAGE_STUDIO_MEDIA } from "@/app/lib/constants";

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

const STAFF_PER_PAGE = 10;

interface StudioMediaNode {
  id: number;
  title: { romaji: string | null; english: string | null };
  type: string;
  format: string | null;
  status: string | null;
  coverImage: { large: string | null; medium: string | null } | null;
  averageScore: number | null;
  seasonYear: number | null;
  episodes: number | null;
  chapters: number | null;
  staff: {
    edges: Array<{
      role: string;
      node: {
        id: number;
        name: { full: string | null };
        image: { medium: string | null };
      };
    }>;
  } | null;
}

interface RawStudioDetailResult {
  Studio: {
    id: number;
    name: string;
    isAnimationStudio: boolean;
    siteUrl: string | null;
    favourites: number | null;
    media: {
      pageInfo: PageInfo;
      nodes: StudioMediaNode[];
    } | null;
  };
}

export async function generateMetadata({ params }: StudioPageProps) {
  const { id } = await params;
  try {
    const studio = await client.getStudio(parseInt(id, 10));
    return {
      title: `${studio.name} — AniClient`,
      description: `Explore anime produced by ${studio.name}.`,
    };
  } catch {
    return { title: "Not Found — AniClient" };
  }
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  let studio: RawStudioDetailResult["Studio"];
  try {
    const data = await client.raw<RawStudioDetailResult>(STUDIO_DETAIL_QUERY, {
      id: numericId,
      page: 1,
      perPage: PER_PAGE_STUDIO_MEDIA,
    });
    studio = data.Studio;
  } catch {
    notFound();
  }

  if (!studio) notFound();

  const mediaNodes = studio.media?.nodes ?? [];

  const staffMap = new Map<
    number,
    { id: number; name: string; image: string | null; roles: Set<string> }
  >();
  for (const media of mediaNodes) {
    for (const edge of media.staff?.edges ?? []) {
      const s = edge.node;
      if (!staffMap.has(s.id)) {
        staffMap.set(s.id, {
          id: s.id,
          name: s.name.full || "Unknown",
          image: s.image?.medium || null,
          roles: new Set(),
        });
      }
      staffMap.get(s.id)!.roles.add(edge.role);
    }
  }
  const staffList = Array.from(staffMap.values()).slice(0, 24);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {studio.name}
          </h1>
          {studio.isAnimationStudio && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-light">
              Animation Studio
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          {studio.favourites != null && studio.favourites > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <HeartIcon className="h-4 w-4 fill-current text-red-400" />
              {studio.favourites.toLocaleString('en-US')} favorites
            </span>
          )}
          {mediaNodes.length > 0 && (
            <span className="text-sm text-muted">
              {studio.media?.pageInfo.total ?? mediaNodes.length} productions
            </span>
          )}
          {studio.siteUrl && (
            <a
              href={studio.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-light hover:underline"
            >
              View on AniList &rarr;
            </a>
          )}
        </div>
      </div>

      {mediaNodes.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 text-lg font-semibold text-foreground">
            Productions
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {mediaNodes.map((media, idx) => {
              const title = media.title.english || media.title.romaji || "Unknown";
              const cover = media.coverImage?.large || media.coverImage?.medium;
              return (
                <Link
                  key={`${media.id}-${idx}`}
                  href={getMediaHref(media.id, media.type)}
                  className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                        No Image
                      </div>
                    )}
                    {media.averageScore && (
                      <div className="score-badge absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                        <span className="text-score">
                          ★ {(media.averageScore / 10).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent-light">
                      {title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                      {media.format && (
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 font-medium text-accent-light">
                          {media.format.replace(/_/g, " ")}
                        </span>
                      )}
                      {media.seasonYear && <span>{media.seasonYear}</span>}
                      {media.episodes && <span>· {media.episodes} eps</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {staffList.length > 0 && (
        <section className="pb-12">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Staff</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {staffList.map((person) => (
              <div
                key={person.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-square overflow-hidden">
                  {person.image ? (
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 16vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                      ?
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="line-clamp-1 text-xs font-medium text-foreground">
                    {person.name}
                  </p>
                  <p className="line-clamp-1 text-[10px] text-muted">
                    {Array.from(person.roles).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
