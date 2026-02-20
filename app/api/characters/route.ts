import { AniListError, CharacterSort } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { clampPage } from "@/app/lib/utils";
import { PER_PAGE_DEFAULT } from "@/app/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = clampPage(searchParams.get("page"));
  const query = searchParams.get("q") ?? undefined;
  const perPage = PER_PAGE_DEFAULT;

  try {
    const data = await client.searchCharacters({
      query,
      sort: query ? [CharacterSort.SEARCH_MATCH] : ["FAVOURITES_DESC" as CharacterSort],
      page,
      perPage,
    });

    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [], pageInfo: {} }, { status });
  }
}
