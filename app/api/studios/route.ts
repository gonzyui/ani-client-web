import { AniListError, type PageInfo, type StudioDetail } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { STUDIOS_LIST_QUERY } from "@/app/lib/queries";
import { clampPage, } from "@/app/lib/utils";
import { PER_PAGE_DEFAULT } from "@/app/lib/constants";

interface RawStudioPage {
  Page: {
    pageInfo: PageInfo;
    studios: StudioDetail[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = clampPage(searchParams.get("page"));
  const query = searchParams.get("q") ?? undefined;
  const perPage = PER_PAGE_DEFAULT;

  try {
    const data = await client.raw<RawStudioPage>(STUDIOS_LIST_QUERY, {
      page,
      perPage,
      search: query || undefined,
      sort: query ? ["SEARCH_MATCH"] : ["FAVOURITES_DESC"],
    });

    return NextResponse.json({
      results: data.Page.studios,
      pageInfo: data.Page.pageInfo,
    });
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [], pageInfo: {} }, { status });
  }
}
