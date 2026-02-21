import { client } from "@/app/lib/client";
import { STAFF_BROWSE_QUERY } from "@/app/lib/queries";
import type { RawStaffPage } from "@/app/lib/types";
import PageContainer from "@/app/components/PageContainer";
import InfiniteStaffGrid from "@/app/components/InfiniteStaffGrid";

export const metadata = {
  title: "Staff & Seiyuu",
  description:
    "Browse voice actors, directors, and anime/manga staff sorted by popularity. Discover the people behind your favorite shows.",
  openGraph: {
    title: "Staff & Seiyuu | AniClient",
    description:
      "Browse voice actors, directors, and anime/manga staff sorted by popularity.",
  },
};

export const revalidate = 900;

export default async function StaffBrowsePage() {
  const raw = await client.raw<RawStaffPage>(STAFF_BROWSE_QUERY, { page: 1, perPage: 24 });
  const data = {
    results: raw.Page.staff,
    pageInfo: raw.Page.pageInfo,
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Staff & Seiyuu</h1>
        <p className="mt-2 text-muted">
          Voice actors, directors, and the people behind anime & manga
        </p>
      </div>

      <InfiniteStaffGrid
        initialItems={data.results}
        initialPageInfo={data.pageInfo}
      />
    </PageContainer>
  );
}
