import { MediaType } from "ani-client";
import { Suspense } from "react";
import MediaGrid from "@/app/components/MediaGrid";
import { CardSkeleton } from "@/app/components/CardSkeleton";
import { SearchIcon } from "@/app/components/Icons";
import { client } from "@/app/lib/client";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; genre?: string; page?: string }>;
}

async function SearchResults({
  query,
  type,
  genre,
  page,
}: {
  query: string;
  type?: string;
  genre?: string;
  page: number;
}) {
  const mediaType =
    type === "MANGA" ? MediaType.MANGA : type === "ANIME" ? MediaType.ANIME : undefined;

  // If no query and no genre, show trending for that type
  const results = (query || genre)
    ? await client.searchMedia({
        query: query || undefined,
        type: mediaType,
        genre: genre || undefined,
        page,
        perPage: 20,
      })
    : await client.getTrending(mediaType ?? MediaType.ANIME, page, 20);

  const title = query
    ? `Results for "${query}"`
    : genre
      ? `${genre} ${mediaType === MediaType.MANGA ? "Manga" : "Anime"}`
      : `Trending ${mediaType === MediaType.MANGA ? "Manga" : "Anime"}`;

  return (
    <>
      {results.results.length > 0 ? (
        <MediaGrid title={title} subtitle={`${results.pageInfo.total ?? "Many"} results found`} items={results.results} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <SearchIcon className="h-16 w-16 text-muted" />
          <h2 className="text-xl font-semibold text-foreground">
            No results found
          </h2>
          <p className="text-muted">
            Try searching with different keywords
          </p>
        </div>
      )}

      {/* Pagination */}
      {results.pageInfo.lastPage && results.pageInfo.lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && (
            <a
              href={`/search?q=${encodeURIComponent(query)}&type=${type ?? ""}${genre ? `&genre=${encodeURIComponent(genre)}` : ""}&page=${page - 1}`}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
            >
              &larr; Previous
            </a>
          )}
          <span className="text-sm text-muted">
            Page {page} of {results.pageInfo.lastPage}
          </span>
          {results.pageInfo.hasNextPage && (
            <a
              href={`/search?q=${encodeURIComponent(query)}&type=${type ?? ""}${genre ? `&genre=${encodeURIComponent(genre)}` : ""}&page=${page + 1}`}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
            >
              Next &rarr;
            </a>
          )}
        </div>
      )}
    </>
  );
}

function SearchSkeleton() {
  return (
    <div>
      <div className="mb-5">
        <div className="skeleton h-7 w-48 rounded" />
        <div className="skeleton mt-2 h-4 w-32 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const type = params.type;
  const genre = params.genre;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      {/* Type filter tabs */}
      <div className="mb-8 flex gap-2">
        {[
          { label: "All", value: "" },
          { label: "Anime", value: "ANIME" },
          { label: "Manga", value: "MANGA" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={`/search?q=${encodeURIComponent(query)}&type=${tab.value}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              (type ?? "") === tab.value
                ? "bg-accent text-white"
                : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} type={type} genre={genre} page={page} />
      </Suspense>
    </main>
  );
}
