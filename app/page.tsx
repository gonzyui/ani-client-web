import { Suspense } from "react";
import { MediaType } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import TrendingRankCarousel from "@/app/components/TrendingRankCarousel";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import { client } from "@/app/lib/client";
import { formatScore, getMediaHref, stripHtml } from "@/app/lib/utils";

export const revalidate = 900;

export default async function HomePage() {
  const [trendingAnime, trendingManga, genres] = await Promise.all([
    client.getTrending(MediaType.ANIME, 1, 10),
    client.getTrending(MediaType.MANGA, 1, 10),
    client.getGenres(),
  ]);

  const hero = trendingAnime.results[0];
  const heroTitle =
    hero?.title.english || hero?.title.romaji || "Trending Anime";
  const heroBanner = hero?.bannerImage || hero?.coverImage?.extraLarge;

  return (
    <main className="-mt-20">
      <section className="relative overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-40">
        <div className="absolute inset-0 bg-background">
          {heroBanner && (
            <div className="absolute inset-x-0 top-0">
              <Image
                src={heroBanner}
                alt=""
                width={1920}
                height={500}
                className="h-auto w-full"
                priority
                sizes="100vw"
                quality={90}
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/50 to-transparent" />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {hero && (
              <div className="flex items-end gap-5">
                {hero.coverImage?.large && (
                  <Link
                    href={getMediaHref(hero.id)}
                    className="shrink-0 transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={hero.coverImage.large}
                      alt={heroTitle}
                      width={130}
                      height={185}
                      className="rounded-2xl border border-border shadow-2xl shadow-black/20"
                    />
                  </Link>
                )}
                <div className="mb-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/30">
                      #1 Trending
                    </span>
                    {hero.averageScore && (
                      <span className="score-badge flex items-center gap-1 rounded-lg bg-background/60 px-2.5 py-1 text-xs font-semibold text-score backdrop-blur-md">
                        ★ {formatScore(hero.averageScore)}
                      </span>
                    )}
                  </div>
                  <Link href={getMediaHref(hero.id)}>
                    <h1 className="text-2xl font-extrabold leading-tight text-foreground drop-shadow-lg sm:text-4xl lg:text-5xl">
                      {heroTitle}
                    </h1>
                  </Link>
                  <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    {stripHtml(hero.description)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hero.genres?.slice(0, 5).map((g) => (
                      <span
                        key={g}
                        className="genre-chip rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={getMediaHref(hero.id)}
                    className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-light hover:shadow-xl hover:shadow-accent/40"
                  >
                    View Details
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="grid w-full shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[520px]">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                Top 10 Anime
              </h3>
              <TrendingRankCarousel items={trendingAnime.results.slice(1, 10)} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                Top 10 Manga
              </h3>
              <TrendingRankCarousel items={trendingManga.results.slice(0, 10)} startRank={1} type="MANGA" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-light">
              Explore
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              What are you in the mood for?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Jump into anime or manga, or browse by genre to find your next obsession.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Link
              href="/anime"
              className="group relative flex h-40 items-end overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 sm:h-44"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
              <div className="absolute right-4 top-4 text-6xl opacity-15 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110 sm:text-7xl" aria-hidden="true">
                ▶
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-foreground">Anime</span>
                <p className="mt-1 text-sm text-muted">Series, films & OVAs</p>
              </div>
            </Link>
            <Link
              href="/manga"
              className="group relative flex h-40 items-end overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 sm:h-44"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-rose-600/10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
              <div className="absolute right-4 top-4 text-6xl opacity-15 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110 sm:text-7xl" aria-hidden="true">
                本
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-foreground">Manga</span>
                <p className="mt-1 text-sm text-muted">Manga & light novels</p>
              </div>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            <Link
              href="/characters"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-emerald-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Characters</span>
            </Link>
            <Link
              href="/staff"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-violet-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Staff</span>
            </Link>
            <Link
              href="/studios"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-amber-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Studios</span>
            </Link>
            <Link
              href="/recommendation"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-cyan-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Recommend</span>
            </Link>
            <Link
              href="/compare"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-orange-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Compare</span>
            </Link>
            <Link
              href="/stats"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-pink-500/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-pink-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Stats</span>
            </Link>
            <Link
              href="/search"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-accent/40 hover:bg-card-hover"
            >
              <svg className="h-4 w-4 shrink-0 text-accent-light" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Search</span>
            </Link>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Browse by genre
            </h3>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
              {genres.slice(0, 18).map((genre) => (
                <Link
                  key={genre}
                  href={`/search?genre=${encodeURIComponent(genre)}&type=ANIME`}
                  className="flex items-center justify-center rounded-xl border border-border bg-card px-3 py-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-card-hover hover:border-accent/50 hover:text-accent-light"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>

          <Suspense fallback={null}>
            <RecentlyViewed />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
