import type { Recommendation } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { formatScore, formatSeason, formatStatus, getMediaHref, stripHtml } from "@/app/lib/utils";
import { MEDIA_CHARACTERS_STAFF_QUERY } from "@/app/lib/queries";

interface AnimePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AnimePageProps) {
  const { id } = await params;
  try {
    const anime = await client.getMedia(parseInt(id, 10));
    const title = anime.title.english || anime.title.romaji || "Anime";
    return {
      title: `${title} — AniClient`,
      description: stripHtml(anime.description)?.slice(0, 160),
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
  const description = stripHtml(anime.description);

  let characters: Array<{
    id: number;
    name: { full: string | null };
    image: { medium: string | null };
    role: string;
  }> = [];

  let staff: Array<{
    id: number;
    name: { full: string | null };
    image: { medium: string | null };
    role: string;
  }> = [];

  let recommendations: Recommendation[] = [];

  try {
    const [extraData, recsData] = await Promise.all([
      client.raw<{
        Media: {
          characters: {
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
            edges: Array<{
              role: string;
              node: {
                id: number;
                name: { full: string | null };
                image: { medium: string | null };
              };
            }>;
          };
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
    recommendations = recsData.results;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("Failed to fetch extras:", err);
  }

  const relations = anime.relations?.edges ?? [];

  return (
    <main className="min-h-screen">
      {banner ? (
        <div className="-mt-[4.5rem] relative h-72 w-full overflow-hidden sm:h-80 md:h-96">
          <Image src={banner} alt="" fill className="object-cover object-center" sizes="100vw" priority />
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
              />
            </div>
          )}

          <div className="flex flex-col gap-3 pb-2">
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

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Synopsis</h2>
            <p className="leading-relaxed text-muted">
              {description || "No description available."}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              Information
            </h3>
            <dl className="space-y-3 text-sm">
              {anime.episodes && (
                <div className="flex justify-between">
                  <dt className="text-muted">Episodes</dt>
                  <dd className="font-medium text-foreground">{anime.episodes}</dd>
                </div>
              )}
              {anime.chapters && (
                <div className="flex justify-between">
                  <dt className="text-muted">Chapters</dt>
                  <dd className="font-medium text-foreground">{anime.chapters}</dd>
                </div>
              )}
              {anime.volumes && (
                <div className="flex justify-between">
                  <dt className="text-muted">Volumes</dt>
                  <dd className="font-medium text-foreground">{anime.volumes}</dd>
                </div>
              )}
              {anime.duration && (
                <div className="flex justify-between">
                  <dt className="text-muted">Duration</dt>
                  <dd className="font-medium text-foreground">{anime.duration} min</dd>
                </div>
              )}
              {anime.popularity && (
                <div className="flex justify-between">
                  <dt className="text-muted">Popularity</dt>
                  <dd className="font-medium text-foreground">
                    {anime.popularity.toLocaleString('en-US')}
                  </dd>
                </div>
              )}
              {anime.favourites && (
                <div className="flex justify-between">
                  <dt className="text-muted">Favorites</dt>
                  <dd className="font-medium text-foreground">
                    {anime.favourites.toLocaleString('en-US')}
                  </dd>
                </div>
              )}
              {anime.source && (
                <div className="flex justify-between">
                  <dt className="text-muted">Source</dt>
                  <dd className="font-medium capitalize text-foreground">
                    {anime.source.toLowerCase().replace(/_/g, " ")}
                  </dd>
                </div>
              )}
              {anime.studios?.nodes?.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Studio</dt>
                  <dd className="font-medium text-foreground">
                    {(anime.studios.nodes.filter((s) => s.isAnimationStudio).length > 0
                      ? anime.studios.nodes.filter((s) => s.isAnimationStudio)
                      : [anime.studios.nodes[0]]
                    ).filter(Boolean).map((s, i, arr) => (
                      <span key={`${s.id}-${i}`}>
                        <Link
                          href={`/studios/${s.id}`}
                          className="text-accent-light hover:underline"
                        >
                          {s.name}
                        </Link>
                        {i < arr.length - 1 && ", "}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {anime.siteUrl && (
                <div className="pt-2">
                  <a
                    href={anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent-light hover:underline"
                  >
                    View on AniList &rarr;
                  </a>
                </div>
              )}
            </dl>
          </div>
        </div>

        {characters.length > 0 && (
          <section className="mt-12 pb-12">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Characters</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {characters.map((char) => (
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
                        sizes="(max-width: 640px) 50vw, 16vw"
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
          <section className="mt-12">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Staff</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {staff.map((person) => (
                <div
                  key={`${person.id}-${person.role}`}
                  className="anime-card group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {person.image?.medium ? (
                      <Image
                        src={person.image.medium}
                        alt={person.name.full || "Staff"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 16vw"
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
                </div>
              ))}
            </div>
          </section>
        )}

        {relations.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Relations</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {relations.map((edge) => {
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
                          sizes="(max-width: 640px) 50vw, 16vw"
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
          <section className="mt-12 pb-12">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Recommendations</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recommendations.map((rec) => {
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
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
    </main>
  );
}
