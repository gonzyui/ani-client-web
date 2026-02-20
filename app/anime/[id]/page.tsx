import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/app/lib/client";
import { formatScore, formatSeason, formatStatus, getMediaHref, stripHtml } from "@/app/lib/utils";

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

  // Fetch related characters using raw query
  let characters: Array<{
    id: number;
    name: { full: string | null };
    image: { medium: string | null };
    role: string;
  }> = [];

  try {
    const charData = await client.raw<{
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
      };
    }>(
      `query ($id: Int) {
        Media(id: $id) {
          characters(sort: [ROLE, FAVOURITES_DESC], perPage: 12) {
            edges {
              role
              node {
                id
                name { full }
                image { medium }
              }
            }
          }
        }
      }`,
      { id: numericId }
    );
    characters =
      charData.Media?.characters?.edges?.map((e) => ({
        ...e.node,
        role: e.role,
      })) ?? [];
  } catch {
    // characters stay empty
  }

  return (
    <main className="min-h-screen">
      {/* Banner */}
      {banner ? (
        <div className="relative h-72 w-full overflow-hidden sm:h-80 md:h-96">
          <Image src={banner} alt="" fill className="object-cover object-center" sizes="100vw" priority />
          <div className="gradient-overlay absolute inset-0" />
        </div>
      ) : (
        <div className="h-24 sm:h-32" />
      )}

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`relative flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8 ${banner ? "-mt-28 sm:-mt-36" : "mt-4"}`}>
          {/* Cover */}
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

          {/* Title & Meta */}
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

        {/* Details grid */}
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {/* Description */}
          <div className="sm:col-span-2">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Synopsis</h2>
            <p className="leading-relaxed text-zinc-400">
              {description || "No description available."}
            </p>
          </div>

          {/* Sidebar info */}
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
                    {anime.popularity.toLocaleString()}
                  </dd>
                </div>
              )}
              {anime.favourites && (
                <div className="flex justify-between">
                  <dt className="text-muted">Favorites</dt>
                  <dd className="font-medium text-foreground">
                    {anime.favourites.toLocaleString()}
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
                    {anime.studios.nodes
                      .filter((s) => s.isAnimationStudio)
                      .map((s) => s.name)
                      .join(", ") || anime.studios.nodes[0]?.name}
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

        {/* Characters */}
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
      </div>
    </main>
  );
}
