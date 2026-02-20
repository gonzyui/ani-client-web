import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await client.searchMedia({
      query,
      page: 1,
      perPage: 6,
    });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title.english || m.title.romaji || "Unknown",
      cover: m.coverImage?.medium || m.coverImage?.large || null,
      type: m.type,
      format: m.format,
      year: m.seasonYear,
      score: m.averageScore,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
