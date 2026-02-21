import { MediaSort, MediaStatus, MediaType } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import TabbedMediaBrowser from "@/app/components/TabbedMediaBrowser";

export const metadata = {
  title: "Browse Manga",
  description:
    "Discover trending, top rated, currently releasing, and upcoming manga. Explore thousands of titles on AniClient.",
  openGraph: {
    title: "Browse Manga | AniClient",
    description:
      "Discover trending, top rated, currently releasing, and upcoming manga.",
  },
};

export const revalidate = 900;

export default async function MangaBrowsePage() {
  const [trending, top, releasing, upcoming, genres] = await Promise.all([
    client.getTrending(MediaType.MANGA, 1, 20),
    client.searchMedia({
      type: MediaType.MANGA,
      sort: ["SCORE_DESC" as MediaSort],
      page: 1,
      perPage: 20,
    }),
    client.searchMedia({
      type: MediaType.MANGA,
      status: MediaStatus.RELEASING,
      sort: ["TRENDING_DESC" as MediaSort],
      page: 1,
      perPage: 20,
    }),
    client.getPlanning({ type: MediaType.MANGA, page: 1, perPage: 20 }),
    client.getGenres(),
  ]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manga</h1>
        <p className="mt-2 text-muted">
          Explore trending, top rated, currently releasing and upcoming manga
        </p>
      </div>

      <TabbedMediaBrowser
        type="MANGA"
        genres={genres}
        tabs={[
          { id: "trending", label: "Trending", category: "trending", items: trending.results, pageInfo: trending.pageInfo },
          { id: "top", label: "Top 100", category: "top", items: top.results, pageInfo: top.pageInfo },
          { id: "releasing", label: "Currently Publishing", category: "airing", items: releasing.results, pageInfo: releasing.pageInfo },
          { id: "upcoming", label: "Upcoming", category: "upcoming", items: upcoming.results, pageInfo: upcoming.pageInfo },
        ]}
      />
    </PageContainer>
  );
}
