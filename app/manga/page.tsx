import { MediaSort, MediaStatus, MediaType } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import Footer from "@/app/components/Footer";
import TabbedMediaBrowser from "@/app/components/TabbedMediaBrowser";

export const metadata = {
  title: "Browse Manga — AniClient",
  description: "Discover trending, top rated, and currently releasing manga.",
};

export const revalidate = 900;

export default async function MangaBrowsePage() {
  const [trending, top, releasing] = await Promise.all([
    client.getTrending(MediaType.MANGA, 1, 20),
    client.searchMedia({
      type: MediaType.MANGA,
      sort: [MediaSort.SCORE],
      page: 1,
      perPage: 20,
    }),
    client.searchMedia({
      type: MediaType.MANGA,
      status: MediaStatus.RELEASING,
      sort: [MediaSort.TRENDING],
      page: 1,
      perPage: 20,
    }),
  ]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manga</h1>
        <p className="mt-2 text-muted">
          Explore trending, top rated and currently releasing manga
        </p>
      </div>

      <TabbedMediaBrowser
        type="MANGA"
        tabs={[
          { id: "trending", label: "Trending", category: "trending", items: trending.results, pageInfo: trending.pageInfo },
          { id: "top", label: "Top 100", category: "top", items: top.results, pageInfo: top.pageInfo },
          { id: "releasing", label: "Currently Publishing", category: "airing", items: releasing.results, pageInfo: releasing.pageInfo },
        ]}
      />

      <Footer />
    </PageContainer>
  );
}
