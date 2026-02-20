import type { PageInfo, StudioDetail } from "ani-client";
import { client } from "@/app/lib/client";
import PageContainer from "@/app/components/PageContainer";
import InfiniteStudioGrid from "@/app/components/InfiniteStudioGrid";
import { STUDIOS_LIST_QUERY } from "@/app/lib/queries";

interface RawStudioPage {
  Page: {
    pageInfo: PageInfo;
    studios: StudioDetail[];
  };
}

export const metadata = {
  title: "Studios",
  description: "Browse animation studios and their productions.",
};

export const revalidate = 900;

export default async function StudiosBrowsePage() {
  const data = await client.raw<RawStudioPage>(STUDIOS_LIST_QUERY, {
    page: 1,
    perPage: 20,
    sort: ["FAVOURITES_DESC"],
  });

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Studios</h1>
        <p className="mt-2 text-muted">
          Top animation studios and their most popular productions
        </p>
      </div>

      <InfiniteStudioGrid
        initialItems={data.Page.studios}
        initialPageInfo={data.Page.pageInfo}
      />
    </PageContainer>
  );
}
