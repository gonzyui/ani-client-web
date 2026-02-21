"use client";

import type { Media } from "ani-client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { formatScore, getMediaHref, stripHtml } from "@/app/lib/utils";

interface RecommendationData {
  recommendation: Media | null;
  basedOn: { id: number; title: { romaji: string; english: string | null }; type: string } | null;
}

export default function RecommendationClient() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const fetchRecommendation = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    try {
      const res = await fetch("/api/recommendation");
      const json: RecommendationData = await res.json();
      setData(json);
      // Small delay for the reveal animation
      setTimeout(() => setRevealed(true), 100);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const rec = data?.recommendation;
  const basedOn = data?.basedOn;
  const title = rec?.title?.english || rec?.title?.romaji || rec?.title?.native || "";
  const image = rec?.bannerImage || rec?.coverImage?.extraLarge;
  const cover = rec?.coverImage?.extraLarge || rec?.coverImage?.large;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Recommendation</h1>
        <p className="mt-2 text-muted">
          Not sure what to watch or read? Let us pick something for you.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={fetchRecommendation}
          disabled={loading}
          className="group relative inline-flex items-center gap-3 rounded-2xl bg-accent px-8 py-4 text-lg font-bold text-white shadow-xl shadow-accent/25 transition-all duration-300 hover:bg-accent-light hover:shadow-2xl hover:shadow-accent/40 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Rolling the dice...
            </>
          ) : (
            <>
              <svg className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
              </svg>
              {data ? "Try Again" : "Get a Recommendation"}
            </>
          )}
        </button>
      </div>

      {rec && (
        <div
          className={`mt-10 transition-all duration-500 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          {basedOn && (
            <p className="mb-4 text-center text-sm text-muted">
              Because you might like{" "}
              <Link
                href={getMediaHref(basedOn.id, basedOn.type)}
                className="font-medium text-accent-light hover:underline"
              >
                {basedOn.title.english || basedOn.title.romaji}
              </Link>
            </p>
          )}

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
            {/* Banner */}
            {image && (
              <div className="relative h-48 w-full overflow-hidden sm:h-56">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
            )}

            <div className={`flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-6 ${image ? "-mt-20 relative z-10" : ""}`}>
              {/* Cover */}
              {cover && (
                <Link href={getMediaHref(rec.id, rec.type)} className="shrink-0 self-center sm:self-auto">
                  <Image
                    src={cover}
                    alt={title}
                    width={150}
                    height={212}
                    className="rounded-xl border border-border shadow-xl transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {rec.type && (
                    <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-light">
                      {rec.type}
                    </span>
                  )}
                  {rec.format && (
                    <span className="rounded-lg bg-background/60 px-2.5 py-1 text-xs font-medium text-muted">
                      {rec.format.replace(/_/g, " ")}
                    </span>
                  )}
                  {rec.averageScore && (
                    <span className="score-badge flex items-center gap-1 rounded-lg bg-background/60 px-2.5 py-1 text-xs font-semibold text-score backdrop-blur-md">
                      ★ {formatScore(rec.averageScore)}
                    </span>
                  )}
                  {rec.status && (
                    <span className="rounded-lg bg-background/60 px-2.5 py-1 text-xs font-medium capitalize text-muted">
                      {rec.status.toLowerCase().replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                <Link href={getMediaHref(rec.id, rec.type)}>
                  <h2 className="text-2xl font-extrabold text-foreground transition-colors hover:text-accent-light sm:text-3xl">
                    {title}
                  </h2>
                </Link>

                {rec.description && (
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted">
                    {stripHtml(rec.description)}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {rec.genres?.slice(0, 5).map((g) => (
                    <span
                      key={g}
                      className="genre-chip rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  {rec.episodes && <span>{rec.episodes} episodes</span>}
                  {rec.chapters && !rec.episodes && <span>{rec.chapters} chapters</span>}
                  {rec.seasonYear && <span>· {rec.seasonYear}</span>}
                </div>

                <Link
                  href={getMediaHref(rec.id, rec.type)}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-light hover:shadow-xl hover:shadow-accent/40"
                >
                  View Details
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {data && !rec && (
        <div className="mt-10 text-center text-muted">
          <p>Couldn&apos;t find a recommendation right now. Try again!</p>
        </div>
      )}
    </main>
  );
}
