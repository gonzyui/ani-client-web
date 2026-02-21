import { AniListError } from "ani-client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/client";
import { clampPage } from "@/app/lib/utils";
import { STAFF_BROWSE_QUERY } from "@/app/lib/queries";
import type { RawStaffPage } from "@/app/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || undefined;
  const page = clampPage(searchParams.get("page"));
  const perPage = 24;

  try {
    const raw = await client.raw<RawStaffPage>(STAFF_BROWSE_QUERY, {
      page,
      perPage,
      search: query || null,
    });
    return NextResponse.json({
      results: raw.Page.staff,
      pageInfo: raw.Page.pageInfo,
    });
  } catch (err) {
    const status = err instanceof AniListError ? err.status : 500;
    return NextResponse.json({ results: [], pageInfo: {} }, { status });
  }
}
