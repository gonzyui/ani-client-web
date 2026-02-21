import { MediaSort, MediaType } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import TabbedMediaBrowser from "@/app/components/TabbedMediaBrowser";
import { getCurrentSeason } from "@/app/lib/utils";

export const metadata = {
  title: "Browse Anime",
  description:
    "Discover trending, top rated, currently airing, seasonal, and upcoming anime. Explore thousands of titles on AniClient.",
  openGraph: {
    title: "Browse Anime | AniClient",
    description:
      "Discover trending, top rated, currently airing, seasonal, and upcoming anime.",
  },
};

export const revalidate = 900;

export default async function AnimeBrowsePage() {
  const { season, year } = getCurrentSeason();
  const seasonLabel = season.charAt(0) + season.slice(1).toLowerCase();

  const [trending, top, seasonal, upcoming, genres] = await Promise.all([
    client.getTrending(MediaType.ANIME, 1, 20),
    client.searchMedia({
      type: MediaType.ANIME,
      sort: ["SCORE_DESC" as MediaSort],
      page: 1,
      perPage: 20,
    }),
    client.getMediaBySeason({
      season,
      seasonYear: year,
      type: MediaType.ANIME,
      sort: ["TRENDING_DESC" as MediaSort],
      page: 1,
      perPage: 20,
    }),
    client.getPlanning({ type: MediaType.ANIME, page: 1, perPage: 20 }),
    client.getGenres(),
  ]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Anime</h1>
        <p className="mt-2 text-muted">
          Explore trending, top rated, seasonal and upcoming anime
        </p>
      </div>

      <TabbedMediaBrowser
        type="ANIME"
        genres={genres}
        tabs={[
          { id: "trending", label: "Trending", category: "trending", items: trending.results, pageInfo: trending.pageInfo },
          { id: "top", label: "Top 100", category: "top", items: top.results, pageInfo: top.pageInfo },
          { id: "season", label: `${seasonLabel} ${year}`, category: "season", items: seasonal.results, pageInfo: seasonal.pageInfo },
          { id: "upcoming", label: "Upcoming", category: "upcoming", items: upcoming.results, pageInfo: upcoming.pageInfo },
        ]}
      />
    </PageContainer>
  );
}
