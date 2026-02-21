import { NextResponse, type NextRequest } from "next/server";

/** Rate-limit window in ms (1 minute) */
const WINDOW_MS = 60_000;
/** Max requests per IP per window */
const MAX_REQUESTS = 60;

const hits = new Map<string, { count: number; resetAt: number }>();

function getKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon"
  );
}

/**
 * API rate-limiter — 60 req/min per IP.
 * Only runs on `/api/*` routes thanks to the matcher below.
 */
export default function proxy(req: NextRequest) {
  const key = getKey(req);
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
