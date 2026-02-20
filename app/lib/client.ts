import { AniListClient } from "ani-client";

const globalForAniList = globalThis as unknown as {
  aniListClient: AniListClient | undefined;
};

export const client =
  globalForAniList.aniListClient ??
  new AniListClient({
    cache: {
      ttl: 1000 * 60 * 30, // 30 min
      maxSize: 500,
      enabled: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForAniList.aniListClient = client;
}
