import { AniListError, MediaFormat, MediaSeason, MediaSort, MediaStatus, MediaType } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { clampPage, getCurrentSeason } from "@/app/lib/utils";
import { PER_PAGE_DEFAULT } from "@/app/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") === "MANGA" ? MediaType.MANGA : MediaType.ANIME;
  const page = clampPage(searchParams.get("page"));
  const category = searchParams.get("category") ?? "trending";
  const perPage = PER_PAGE_DEFAULT;

  try {
    let data;

    switch (category) {
      case "filter": {
        const genre = searchParams.get("genre") || undefined;
        const format = (searchParams.get("format") || undefined) as MediaFormat | undefined;
        const status = (searchParams.get("status") || undefined) as MediaStatus | undefined;
        const season = (searchParams.get("season") || undefined) as MediaSeason | undefined;
        const yearStr = searchParams.get("year");
        const seasonYear = yearStr ? parseInt(yearStr, 10) || undefined : undefined;
        const sortStr = searchParams.get("sort") || "POPULARITY_DESC";

        data = await client.searchMedia({
          type,
          genre,
          format,
          status,
          season,
          seasonYear,
          sort: [sortStr as MediaSort],
          page,
          perPage,
        });
        break;
      }

      case "top":
        data = await client.searchMedia({
          type,
          sort: ["SCORE_DESC" as MediaSort],
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

      case "upcoming":
        data = await client.getPlanning({ type, page, perPage });
        break;

      case "season": {
        const { season, year } = getCurrentSeason();
        data = await client.getMediaBySeason({
          season,
          seasonYear: year,
          type,
          page,
          perPage,
        });
        break;
      }

      case "trending":
      default:
        data = await client.getTrending(type, page, perPage);
        break;
    }

    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [], pageInfo: {} }, { status });
  }
}
