import { CharacterSort } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import Footer from "@/app/components/Footer";
import InfiniteCharacterGrid from "@/app/components/InfiniteCharacterGrid";

export const metadata = {
  title: "Characters — AniClient",
  description: "Browse popular anime and manga characters.",
};

export const revalidate = 900;

export default async function CharactersBrowsePage() {
  const data = await client.searchCharacters({
    sort: [CharacterSort.FAVOURITES],
    page: 1,
    perPage: 24,
  });

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Characters</h1>
        <p className="mt-2 text-muted">
          Most popular anime &amp; manga characters
        </p>
      </div>

      <InfiniteCharacterGrid
        initialItems={data.results}
        initialPageInfo={data.pageInfo}
      />

      <Footer />
    </PageContainer>
  );
}
