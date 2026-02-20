import { MediaSort, MediaStatus, MediaType } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") === "MANGA" ? MediaType.MANGA : MediaType.ANIME;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const category = searchParams.get("category") ?? "trending";
  const perPage = 20;

  try {
    let data;

    switch (category) {
      case "top":
        data = await client.searchMedia({
          type,
          sort: [MediaSort.SCORE],
          page,
          perPage,
        });
        break;

      case "airing":
        data = await client.searchMedia({
          type,
          status: MediaStatus.RELEASING,
          sort: [MediaSort.TRENDING],
          page,
          perPage,
        });
        break;

      case "trending":
      default:
        data = await client.getTrending(type, page, perPage);
        break;
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], pageInfo: {} }, { status: 500 });
  }
}
