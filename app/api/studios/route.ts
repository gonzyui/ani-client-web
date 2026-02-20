import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { STUDIOS_QUERY, type StudioPageResult } from "@/app/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const query = searchParams.get("q") ?? undefined;
  const perPage = 20;

  try {
    const data = await client.raw<StudioPageResult>(STUDIOS_QUERY, {
      page,
      perPage,
      search: query || undefined,
      sort: query ? ["SEARCH_MATCH"] : ["FAVOURITES_DESC"],
    });

    return NextResponse.json({
      results: data.Page.studios,
      pageInfo: data.Page.pageInfo,
    });
  } catch {
    return NextResponse.json({ results: [], pageInfo: {} }, { status: 500 });
  }
}
