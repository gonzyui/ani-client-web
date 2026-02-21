import { AniListError } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";

/** GET /api/compare?ids=1,2,3 — fetch multiple media by IDs */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0)
    .slice(0, 6);

  if (ids.length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await Promise.all(ids.map((id) => client.getMedia(id)));
    return NextResponse.json({ results });
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [] }, { status });
  }
}
