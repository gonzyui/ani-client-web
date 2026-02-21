import { MediaType } from "ani-client";
import { NextResponse } from "next/server";
import { client } from "@/app/lib/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Grab a pool of trending anime + manga to seed from
    const [anime, manga] = await Promise.all([
      client.getTrending(MediaType.ANIME, 1, 20),
      client.getTrending(MediaType.MANGA, 1, 20),
    ]);

    const pool = [...anime.results, ...manga.results];
    if (pool.length === 0) {
      return NextResponse.json({ recommendation: null });
    }

    // Shuffle and try up to 5 random seeds until we find one with recommendations
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const tries = Math.min(5, shuffled.length);

    for (let i = 0; i < tries; i++) {
      const seed = shuffled[i];
      const recs = await client.getRecommendations(seed.id, { perPage: 10 });
      if (recs.results.length > 0) {
        const pick = recs.results[Math.floor(Math.random() * recs.results.length)];
        return NextResponse.json({
          recommendation: pick.mediaRecommendation,
          basedOn: {
            id: seed.id,
            title: seed.title,
            type: seed.type,
          },
        });
      }
    }

    // Fallback: return a random trending entry itself
    const fallback = shuffled[0];
    return NextResponse.json({
      recommendation: fallback,
      basedOn: null,
    });
  } catch {
    return NextResponse.json({ recommendation: null }, { status: 500 });
  }
}
