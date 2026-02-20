import { AniListError } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = 20;

  try {
    const data = await client.getAiredEpisodes({ page, perPage });

    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [], pageInfo: {} }, { status });
  }
}
