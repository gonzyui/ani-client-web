import type { Recommendation } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { formatScore, formatSeason, formatStatus, getMediaHref, stripHtml, colorToBlurDataURL } from "@/app/lib/utils";
import { MEDIA_CHARACTERS_STAFF_QUERY } from "@/app/lib/queries";
import type { CharacterEdge, StaffEdge, ScoreDistEntry, ExternalLink, NextAiring } from "@/app/lib/types";
import ShareButton from "@/app/components/ShareButton";
import Countdown from "@/app/components/Countdown";
import Synopsis from "@/app/components/Synopsis";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import RecentViewTracker from "@/app/components/RecentViewTracker";
import MediaInfoCard from "@/app/components/MediaInfoCard";
import ScoreDistribution from "@/app/components/ScoreDistribution";
import StreamingLinks from "@/app/components/StreamingLinks";
import TagsList from "@/app/components/TagsList";

interface AnimePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AnimePageProps) {
  const { id } = await params;
  try {
    const anime = await client.getMedia(parseInt(id, 10));
    const title = anime.title.english || anime.title.romaji || "Anime";
    const description = stripHtml(anime.description)?.slice(0, 160) || `${title} on AniClient`;
    const image = anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large;
    return {
      title: `${title} — AniClient`,
      description,
      openGraph: {
        title: `${title} — AniClient`,
        description,
        type: "website",
        ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} — AniClient`,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return { title: "Not Found — AniClient" };
  }
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  let anime;
  try {
    anime = await client.getMedia(numericId);
  } catch {
    notFound();
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native || "Unknown";
  const banner = anime.bannerImage;
  const cover = anime.coverImage?.extraLarge || anime.coverImage?.large;
  const coverColor = anime.coverImage?.color;
  const blurDataURL = colorToBlurDataURL(coverColor);
  const description = stripHtml(anime.description);

  let characters: CharacterEdge[] = [];
  let staff: StaffEdge[] = [];
  let recommendations: Recommendation[] = [];
  let scoreDistribution: ScoreDistEntry[] = [];
  let nextAiring: NextAiring | null = null;
  let externalLinks: ExternalLink[] = [];
  let charTotal = 0;
  let staffTotal = 0;

  try {
    const [extraData, recsData] = await Promise.all([
      client.raw<{
        Media: {
          characters: {
            pageInfo: { total: number | null; hasNextPage: boolean };
            edges: Array<{
              role: string;
              node: {
                id: number;
                name: { full: string | null };
                image: { medium: string | null };
              };
            }>;
          };
          staff: {
            pageInfo: { total: number | null; hasNextPage: boolean };
            edges: Array<{
              role: string;
              node: {
                id: number;
                name: { full: string | null };
                image: { medium: string | null };
              };
            }>;
          };
          stats: {
            scoreDistribution: Array<{ score: number; amount: number }> | null;
          } | null;
          nextAiringEpisode: {
            airingAt: number;
            timeUntilAiring: number;
            episode: number;
          } | null;
          externalLinks: Array<{
            id: number;
            url: string;
            site: string;
            type: string;
            icon: string | null;
            color: string | null;
          }> | null;
        };
      }>(MEDIA_CHARACTERS_STAFF_QUERY, { id: numericId }),
      client.getRecommendations(numericId, { perPage: 8 }),
    ]);

    characters =
      extraData.Media?.characters?.edges?.map((e) => ({
        ...e.node,
        role: e.role,
      })) ?? [];
    staff =
      extraData.Media?.staff?.edges?.map((e) => ({
        ...e.node,
        role: e.role,
      })) ?? [];
    charTotal = extraData.Media?.characters?.pageInfo?.total ?? characters.length;
    staffTotal = extraData.Media?.staff?.pageInfo?.total ?? staff.length;
    scoreDistribution = extraData.Media?.stats?.scoreDistribution ?? [];
    nextAiring = extraData.Media?.nextAiringEpisode ?? null;
    externalLinks = (extraData.Media?.externalLinks ?? []).filter((l) => l.type === "STREAMING");
    recommendations = recsData.results;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("Failed to fetch extras:", err);
  }

  const relations = anime.relations?.edges ?? [];

  return (
    <main className="min-h-screen">
      <RecentViewTracker id={numericId} type={anime.type || "ANIME"} title={title} image={cover || null} />
      {banner ? (
        <div className="-mt-[4.5rem] relative h-72 w-full overflow-hidden sm:h-80 md:h-96">
          <Image src={banner} alt="" fill className="object-cover object-center" sizes="100vw" priority placeholder={blurDataURL ? "blur" : undefined} blurDataURL={blurDataURL} />
          <div className="gradient-overlay absolute inset-0" />
        </div>
      ) : (
        <div className="h-24 sm:h-32" />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`relative flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8 ${banner ? "-mt-28 sm:-mt-36" : "mt-4"}`}>
          {cover && (
            <div className="shrink-0">
              <Image
                src={cover}
                alt={title}
                width={200}
                height={280}
                className="rounded-xl border-2 border-border shadow-2xl"
                priority
                placeholder={blurDataURL ? "blur" : undefined}
                blurDataURL={blurDataURL}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 pb-2">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: anime.type === "MANGA" ? "Manga" : "Anime", href: anime.type === "MANGA" ? "/manga" : "/anime" },
              { label: title },
            ]} />
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h1>
            {anime.title.romaji && anime.title.english && anime.title.romaji !== anime.title.english && (
              <p className="text-sm text-muted">{anime.title.romaji}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {anime.averageScore && (
                <span className="score-badge flex items-center gap-1 rounded-lg bg-card px-3 py-1.5 text-sm font-bold text-score">
                  ★ {formatScore(anime.averageScore)}
                </span>
              )}
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                {formatStatus(anime.status)}
              </span>
              {anime.format && (
                <span className="rounded-lg bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent-light">
                  {anime.format.replace(/_/g, " ")}
                </span>
              )}
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm text-muted">
                {formatSeason(anime.season, anime.seasonYear)}
              </span>
              <ShareButton title={title} text={description || undefined} />
            </div>
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((g) => (
                <Link
                  key={g}
                  href={`/search?genre=${encodeURIComponent(g)}&type=${anime.type}`}
                  className="genre-chip rounded-full px-3 py-1 text-xs font-medium"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {nextAiring && (
          <div className="mt-6">
            <Countdown airingAt={nextAiring.airingAt} episode={nextAiring.episode} />
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Synopsis</h2>
              <Synopsis text={description || "No description available."} />
            </div>

            {characters.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Characters</h2>
                  {charTotal > 4 && (
                    <a
                      href={`${anime.siteUrl}/characters`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-light hover:underline"
                    >
                      View all {charTotal} &rarr;
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {characters.slice(0, 4).map((char) => (
                    <Link
                      key={char.id}
                      href={`/character/${char.id}`}
                      className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {char.image?.medium ? (
                          <Image
                            src={char.image.medium}
                            alt={char.name.full || "Character"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-accent-light">
                          {char.name.full}
                        </p>
                        <p className="text-[10px] capitalize text-muted">
                          {char.role.toLowerCase()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {staff.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Staff</h2>
                  {staffTotal > 4 && (
                    <a
                      href={`${anime.siteUrl}/staff`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-light hover:underline"
                    >
                      View all {staffTotal} &rarr;
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {staff.slice(0, 4).map((person) => (
                    <Link
                      key={`${person.id}-${person.role}`}
                      href={`/staff/${person.id}`}
                      className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {person.image?.medium ? (
                          <Image
                            src={person.image.medium}
                            alt={person.name.full || "Staff"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-accent-light">
                          {person.name.full}
                        </p>
                        <p className="text-[10px] text-muted">
                          {person.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relations.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Relations</h2>
                  {relations.length > 4 && anime.siteUrl && (
                    <a
                      href={`${anime.siteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-light hover:underline"
                    >
                      View all {relations.length} &rarr;
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {relations.slice(0, 4).map((edge) => {
                    const rel = edge.node;
                    const relTitle = rel.title.english || rel.title.romaji || "Unknown";
                    const relCover = rel.coverImage?.large || rel.coverImage?.medium;
                    const relationType = edge.relationType
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/^\w/, (c: string) => c.toUpperCase());

                    return (
                      <Link
                        key={rel.id}
                        href={getMediaHref(rel.id, rel.type)}
                        className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {relCover ? (
                            <Image
                              src={relCover}
                              alt={relTitle}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                              No Image
                            </div>
                          )}
                          <div className="absolute left-2 top-2 rounded-md bg-accent/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            {relationType}
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent-light">
                            {relTitle}
                          </p>
                          {rel.format && (
                            <p className="mt-0.5 text-[10px] capitalize text-muted">
                              {rel.format.replace(/_/g, " ").toLowerCase()}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {recommendations.length > 0 && (
              <section className="pb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
                  {recommendations.length > 4 && anime.siteUrl && (
                    <a
                      href={`${anime.siteUrl}/recommendations`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent-light hover:underline"
                    >
                      View all &rarr;
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {recommendations.slice(0, 4).map((rec) => {
                    const recMedia = rec.mediaRecommendation;
                    const recTitle = recMedia.title.english || recMedia.title.romaji || "Unknown";
                    const recCover = recMedia.coverImage?.extraLarge || recMedia.coverImage?.large || recMedia.coverImage?.medium;

                    return (
                      <Link
                        key={rec.id}
                        href={getMediaHref(recMedia.id, recMedia.type)}
                        className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {recCover ? (
                            <Image
                              src={recCover}
                              alt={recTitle}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-card-hover text-muted">
                              No Image
                            </div>
                          )}
                          {recMedia.averageScore && (
                            <div className="score-badge absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                              <span className="text-score">★ {formatScore(recMedia.averageScore)}</span>
                            </div>
                          )}
                          {rec.rating != null && rec.rating > 0 && (
                            <div className="absolute left-2 top-2 rounded-md bg-green-600/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                              +{rec.rating}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent-light">
                            {recTitle}
                          </h3>
                          {recMedia.genres?.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {recMedia.genres.slice(0, 2).map((g) => (
                                <span key={g} className="genre-chip rounded-full px-2 py-0.5 text-[10px] font-medium">
                                  {g}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <MediaInfoCard
            episodes={anime.episodes}
            chapters={anime.chapters}
            volumes={anime.volumes}
            duration={anime.duration}
            popularity={anime.popularity}
            favourites={anime.favourites}
            source={anime.source}
            studios={anime.studios}
            siteUrl={anime.siteUrl}
          />

          {anime.type === "ANIME" && anime.trailer?.id && anime.trailer?.site === "youtube" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <h3 className="px-5 pt-4 pb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Trailer
              </h3>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${anime.trailer.id}`}
                  title={`${title} Trailer`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <ScoreDistribution data={scoreDistribution} />
          <StreamingLinks links={externalLinks} />
          {anime.tags?.length > 0 && <TagsList tags={anime.tags} />}

          </div>
        </div>
      </div>
      <div className="h-16" />
    </main>
  );
}
