import { CharacterSort } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import InfiniteCharacterGrid from "@/app/components/InfiniteCharacterGrid";
import { PER_PAGE_CHARACTERS } from "@/app/lib/constants";

export const metadata = {
  title: "Characters",
  description: "Browse popular anime and manga characters.",
};

export const revalidate = 900;

export default async function CharactersBrowsePage() {
  const data = await client.searchCharacters({
    sort: ["FAVOURITES_DESC" as CharacterSort],
    page: 1,
    perPage: PER_PAGE_CHARACTERS,
  });

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Characters</h1>
        <p className="mt-2 text-muted">
          Most popular anime & manga characters
        </p>
      </div>

      <InfiniteCharacterGrid
        initialItems={data.results}
        initialPageInfo={data.pageInfo}
      />
    </PageContainer>
  );
}
