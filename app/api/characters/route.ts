import { CharacterSort } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const query = searchParams.get("q") ?? undefined;
  const perPage = 20;

  try {
    const data = await client.searchCharacters({
      query,
      sort: query ? [CharacterSort.SEARCH_MATCH] : [CharacterSort.FAVOURITES],
      page,
      perPage,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], pageInfo: {} }, { status: 500 });
  }
}
