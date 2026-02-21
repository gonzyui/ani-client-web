import { MediaType } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import { formatScore } from "@/app/lib/utils";

export const metadata = {
  title: "Stats",
  description:
    "Fun statistics about anime and manga — genre popularity, studio rankings, format distribution, and more.",
  openGraph: {
    title: "Stats | AniClient",
    description:
      "Fun statistics about anime and manga — genre popularity, studio rankings, format distribution, and more.",
  },
};

export const revalidate = 900;

export default async function StatsPage() {
  // Gather a big enough pool from trending + top rated
  const [trendingAnime, trendingManga, topAnime, topManga] = await Promise.all([
    client.getTrending(MediaType.ANIME, 1, 50),
    client.getTrending(MediaType.MANGA, 1, 50),
    client.searchMedia({ type: MediaType.ANIME, sort: ["SCORE_DESC" as never], page: 1, perPage: 50 }),
    client.searchMedia({ type: MediaType.MANGA, sort: ["SCORE_DESC" as never], page: 1, perPage: 50 }),
  ]);

  const allAnime = [...trendingAnime.results, ...topAnime.results];
  const allManga = [...trendingManga.results, ...topManga.results];
  const allMedia = [...allAnime, ...allManga];

  // Deduplicate
  const seen = new Set<number>();
  const unique = allMedia.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // --- Genre Popularity ---
  const genreCount: Record<string, number> = {};
  const genreScore: Record<string, { total: number; count: number }> = {};
  for (const m of unique) {
    for (const g of m.genres ?? []) {
      genreCount[g] = (genreCount[g] ?? 0) + 1;
      if (m.averageScore) {
        if (!genreScore[g]) genreScore[g] = { total: 0, count: 0 };
        genreScore[g].total += m.averageScore;
        genreScore[g].count++;
      }
    }
  }
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topGenresByScore = Object.entries(genreScore)
    .map(([genre, { total, count }]) => ({ genre, avg: total / count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  // --- Studio stats ---
  const studioData: Record<string, { name: string; id: number; scores: number[]; count: number }> = {};
  for (const m of unique) {
    for (const s of m.studios?.nodes ?? []) {
      if (!s.isAnimationStudio) continue;
      if (!studioData[s.id]) studioData[s.id] = { name: s.name, id: s.id, scores: [], count: 0 };
      studioData[s.id].count++;
      if (m.averageScore) studioData[s.id].scores.push(m.averageScore);
    }
  }
  const topStudios = Object.values(studioData)
    .filter((s) => s.scores.length >= 2)
    .map((s) => ({ ...s, avgScore: s.scores.reduce((a, b) => a + b, 0) / s.scores.length }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  // --- Format Distribution ---
  const formatCount: Record<string, number> = {};
  for (const m of unique) {
    const fmt = m.format?.replace(/_/g, " ") ?? "Unknown";
    formatCount[fmt] = (formatCount[fmt] ?? 0) + 1;
  }
  const topFormats = Object.entries(formatCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const formatTotal = topFormats.reduce((s, [, c]) => s + c, 0);

  // --- Average scores ---
  const animeScores = unique.filter((m) => m.type === "ANIME" && m.averageScore).map((m) => m.averageScore!);
  const mangaScores = unique.filter((m) => m.type === "MANGA" && m.averageScore).map((m) => m.averageScore!);
  const avgAnime = animeScores.length > 0 ? animeScores.reduce((a, b) => a + b, 0) / animeScores.length : 0;
  const avgManga = mangaScores.length > 0 ? mangaScores.reduce((a, b) => a + b, 0) / mangaScores.length : 0;

  // --- Top trending right now ---
  const topTrendingAnime = trendingAnime.results[0];
  const topTrendingManga = trendingManga.results[0];

  return (
    <PageContainer>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Stats</h1>
        <p className="mt-2 text-muted">
          Fun statistics and insights from trending & top-rated anime and manga
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Titles Analyzed" value={unique.length.toString()} />
        <StatCard label="Avg Anime Score" value={formatScore(avgAnime)} accent />
        <StatCard label="Avg Manga Score" value={formatScore(avgManga)} accent />
        <StatCard label="Genres Found" value={Object.keys(genreCount).length.toString()} />
      </div>

      {/* Currently #1 Trending */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topTrendingAnime && (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-light">#1 Trending Anime</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {topTrendingAnime.title.english || topTrendingAnime.title.romaji}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              {topTrendingAnime.averageScore && <span className="text-score">★ {formatScore(topTrendingAnime.averageScore)}</span>}
              <span>·</span>
              <span>{topTrendingAnime.popularity?.toLocaleString("en-US")} popularity</span>
            </div>
          </div>
        )}
        {topTrendingManga && (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-light">#1 Trending Manga</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {topTrendingManga.title.english || topTrendingManga.title.romaji}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              {topTrendingManga.averageScore && <span className="text-score">★ {formatScore(topTrendingManga.averageScore)}</span>}
              <span>·</span>
              <span>{topTrendingManga.popularity?.toLocaleString("en-US")} popularity</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Most Popular Genres */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Most Popular Genres</h2>
          <div className="space-y-3">
            {topGenres.map(([genre, count], i) => {
              const max = topGenres[0][1];
              const pct = (count / max) * 100;
              return (
                <div key={genre}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{i + 1}. {genre}</span>
                    <span className="text-muted">{count} titles</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highest Rated Genres */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Highest Rated Genres</h2>
          <div className="space-y-3">
            {topGenresByScore.map(({ genre, avg }, i) => {
              const max = topGenresByScore[0].avg;
              const pct = (avg / max) * 100;
              return (
                <div key={genre}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{i + 1}. {genre}</span>
                    <span className="font-semibold text-score">★ {formatScore(avg)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Studios by Avg Score */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Top Studios (Avg Score)</h2>
          <div className="space-y-3">
            {topStudios.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {i + 1}. <a href={`/studios/${s.id}`} className="text-accent-light hover:underline">{s.name}</a>
                </span>
                <div className="flex items-center gap-3 text-muted">
                  <span>{s.count} titles</span>
                  <span className="font-semibold text-score">★ {formatScore(s.avgScore)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Format Distribution */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Format Distribution</h2>
          <div className="space-y-3">
            {topFormats.map(([format, count]) => {
              const pct = Math.round((count / formatTotal) * 100);
              return (
                <div key={format}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium uppercase text-foreground">{format}</span>
                    <span className="text-muted">{pct}% ({count})</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 text-center">
      <p className={`text-2xl font-bold ${accent ? "text-score" : "text-foreground"}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
