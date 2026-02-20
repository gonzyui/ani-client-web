import { MediaSort, MediaStatus, MediaType } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import Footer from "@/app/components/Footer";
import TabbedMediaBrowser from "@/app/components/TabbedMediaBrowser";

export const metadata = {
  title: "Browse Anime — AniClient",
  description: "Discover trending, top rated, and currently airing anime.",
};

export const revalidate = 900;

export default async function AnimeBrowsePage() {
  const [trending, top, airing] = await Promise.all([
    client.getTrending(MediaType.ANIME, 1, 20),
    client.searchMedia({
      type: MediaType.ANIME,
      sort: [MediaSort.SCORE],
      page: 1,
      perPage: 20,
    }),
    client.searchMedia({
      type: MediaType.ANIME,
      status: MediaStatus.RELEASING,
      sort: [MediaSort.TRENDING],
      page: 1,
      perPage: 20,
    }),
  ]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Anime</h1>
        <p className="mt-2 text-muted">
          Explore trending, top rated and currently airing anime
        </p>
      </div>

      <TabbedMediaBrowser
        type="ANIME"
        tabs={[
          { id: "trending", label: "Trending", category: "trending", items: trending.results, pageInfo: trending.pageInfo },
          { id: "top", label: "Top 100", category: "top", items: top.results, pageInfo: top.pageInfo },
          { id: "airing", label: "Currently Airing", category: "airing", items: airing.results, pageInfo: airing.pageInfo },
        ]}
      />

      <Footer />
    </PageContainer>
  );
}
