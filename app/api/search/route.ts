import { AniListError, CharacterSort, type PageInfo, type StudioDetail } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { STUDIOS_SEARCH_QUERY } from "@/app/lib/queries";
import { MAX_QUERY_LENGTH } from "@/app/lib/constants";

interface RawStudioSearchPage {
  Page: {
    pageInfo: PageInfo;
    studios: Pick<StudioDetail, "id" | "name" | "favourites">[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ results: [], error: "Query too long" }, { status: 400 });
  }

  try {
    const [mediaData, charData, studioData] = await Promise.all([
      client.searchMedia({ query, page: 1, perPage: 4 }),
      client.searchCharacters({
        query,
        sort: [CharacterSort.SEARCH_MATCH],
        page: 1,
        perPage: 3,
      }),
      client.raw<RawStudioSearchPage>(STUDIOS_SEARCH_QUERY, {
        page: 1,
        perPage: 3,
        search: query,
        sort: ["SEARCH_MATCH"],
      }),
    ]);

    const mediaResults = mediaData.results.map((m) => ({
      id: m.id,
      kind: m.type === "MANGA" ? ("manga" as const) : ("anime" as const),
      title: m.title.english || m.title.romaji || "Unknown",
      cover: m.coverImage?.medium || m.coverImage?.large || null,
      format: m.format,
      year: m.seasonYear,
      score: m.averageScore,
    }));

    const charResults = charData.results.map((c) => ({
      id: c.id,
      kind: "character" as const,
      title: c.name.full || `${c.name.first ?? ""} ${c.name.last ?? ""}`.trim() || "Unknown",
      cover: c.image?.medium || c.image?.large || null,
      favourites: c.favourites,
    }));

    const studioResults = studioData.Page.studios.map((s) => ({
      id: s.id,
      kind: "studio" as const,
      title: s.name,
      cover: null,
      favourites: s.favourites,
    }));

    const results = [...mediaResults, ...charResults, ...studioResults];

    return NextResponse.json({ results });
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [] }, { status });
  }
}
