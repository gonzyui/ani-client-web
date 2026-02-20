import { AniListClient } from "ani-client";
import { CACHE_MAX_SIZE, CACHE_TTL_MS } from "@/app/lib/constants";

const globalForAniList = globalThis as unknown as {
  aniListClient: AniListClient | undefined;
};

export const client =
  globalForAniList.aniListClient ??
  new AniListClient({
    cache: { ttl: CACHE_TTL_MS, maxSize: CACHE_MAX_SIZE, enabled: true },
  });

if (process.env.NODE_ENV !== "production") {
  globalForAniList.aniListClient = client;
}
