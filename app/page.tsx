import { MediaType } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import TrendingRankCarousel from "@/app/components/TrendingRankCarousel";
import { client } from "@/app/lib/client";
import { formatScore, getMediaHref, stripHtml } from "@/app/lib/utils";

export const revalidate = 900; // ISR: revalidate every 15 min

export default async function HomePage() {
  const trendingAnime = await client.getTrending(MediaType.ANIME, 1, 10);

  const hero = trendingAnime.results[0];
  const heroTitle =
    hero?.title.english || hero?.title.romaji || "Trending Anime";
  const heroBanner = hero?.bannerImage || hero?.coverImage?.extraLarge;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background banner */}
        <div className="absolute inset-0">
          {heroBanner && (
            <Image
              src={heroBanner}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="gradient-overlay absolute inset-0" />
        </div>

        {/* Hero content grid */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-12 sm:px-6 lg:flex-row lg:items-end lg:gap-8 lg:pb-12 lg:pt-16">
          {/* Left: #1 Trending info */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {hero && (
              <div className="flex items-end gap-5">
                {hero.coverImage?.large && (
                  <Link href={getMediaHref(hero.id)} className="shrink-0">
                    <Image
                      src={hero.coverImage.large}
                      alt={heroTitle}
                      width={120}
                      height={170}
                      className="rounded-xl border border-border shadow-2xl"
                    />
                  </Link>
                )}
                <div className="mb-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                      #1 Trending
                    </span>
                    {hero.averageScore && (
                      <span className="score-badge flex items-center gap-1 rounded bg-background/80 px-2 py-0.5 text-xs font-semibold text-score backdrop-blur-sm">
                        ★ {formatScore(hero.averageScore)}
                      </span>
                    )}
                  </div>
                  <Link href={getMediaHref(hero.id)}>
                    <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl">
                      {heroTitle}
                    </h1>
                  </Link>
                  <p className="line-clamp-2 max-w-lg text-sm text-zinc-300">
                    {stripHtml(hero.description)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hero.genres?.slice(0, 4).map((g) => (
                      <span key={g} className="genre-chip rounded-full px-3 py-1 text-xs font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Ranking cards #2–#10 */}
          <div className="w-full shrink-0 lg:w-[300px]">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
              Top 10 Trending
            </h3>
            <TrendingRankCarousel items={trendingAnime.results.slice(1, 10)} />
          </div>
        </div>
      </section>

      {/* Explore */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
            Browse by category
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            What are you in the mood for?
          </h2>
        </div>

        {/* Main two: Anime & Manga */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/anime"
            className="group relative flex h-40 items-end overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 sm:h-48"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
            <div className="absolute right-4 top-4 text-5xl opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-110 sm:text-6xl">
              ▶
            </div>
            <div className="relative z-10">
              <span className="text-lg font-bold text-foreground sm:text-xl">Anime</span>
              <p className="mt-0.5 text-xs text-muted">Series, films & OVAs</p>
            </div>
          </Link>
          <Link
            href="/manga"
            className="group relative flex h-40 items-end overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 sm:h-48"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-rose-600/10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
            <div className="absolute right-4 top-4 text-5xl opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-110 sm:text-6xl">
              本
            </div>
            <div className="relative z-10">
              <span className="text-lg font-bold text-foreground sm:text-xl">Manga</span>
              <p className="mt-0.5 text-xs text-muted">Manga & light novels</p>
            </div>
          </Link>
        </div>

        {/* Genre pills */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { label: "Action", href: "/search?genre=Action&type=ANIME", accent: "hover:border-red-500/50 hover:text-red-400" },
            { label: "Romance", href: "/search?genre=Romance&type=ANIME", accent: "hover:border-pink-500/50 hover:text-pink-400" },
            { label: "Fantasy", href: "/search?genre=Fantasy&type=ANIME", accent: "hover:border-emerald-500/50 hover:text-emerald-400" },
            { label: "Sci-Fi", href: "/search?genre=Sci-Fi&type=ANIME", accent: "hover:border-cyan-500/50 hover:text-cyan-400" },
            { label: "Comedy", href: "/search?genre=Comedy&type=ANIME", accent: "hover:border-amber-500/50 hover:text-amber-400" },
            { label: "Horror", href: "/search?genre=Horror&type=ANIME", accent: "hover:border-purple-500/50 hover:text-purple-400" },
          ].map((g) => (
            <Link
              key={g.label}
              href={g.href}
              className={`flex items-center justify-center rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium text-muted transition-all duration-200 hover:bg-card-hover ${g.accent}`}
            >
              {g.label}
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
