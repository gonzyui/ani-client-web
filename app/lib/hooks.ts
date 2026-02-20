"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCROLL_ROOT_MARGIN } from "@/app/lib/constants";

interface UseInfiniteScrollOptions<T> {
  initialItems: T[];
  initialHasMore: boolean;
  fetchUrl: (page: number) => string;
  parseResponse?: (data: unknown) => { results: T[]; hasNextPage: boolean };
  getKey?: (item: T) => string | number;
}

function defaultParser<T>(data: unknown): { results: T[]; hasNextPage: boolean } {
  const d = data as { results?: T[]; pageInfo?: { hasNextPage?: boolean } };
  return {
    results: d.results ?? [],
    hasNextPage: d.pageInfo?.hasNextPage ?? false,
  };
}

/** Infinite scroll hook with a stable IntersectionObserver */
export function useInfiniteScroll<T>({
  initialItems,
  initialHasMore,
  fetchUrl,
  parseResponse,
  getKey,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(initialHasMore);
  const loadingRef = useRef(false);
  const fetchUrlRef = useRef(fetchUrl);
  const parseRef = useRef(parseResponse ?? defaultParser<T>);
  const getKeyRef = useRef(getKey);

  fetchUrlRef.current = fetchUrl;
  parseRef.current = parseResponse ?? defaultParser<T>;
  getKeyRef.current = getKey;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const nextPage = pageRef.current + 1;
    try {
      const res = await fetch(fetchUrlRef.current(nextPage));
      const data = await res.json();
      const { results, hasNextPage } = parseRef.current(data);

      setItems((prev) => {
        const keyFn = getKeyRef.current;
        if (!keyFn) return [...prev, ...results];
        const seen = new Set(prev.map(keyFn));
        const unique = results.filter((item) => !seen.has(keyFn(item)));
        return [...prev, ...unique];
      });
      pageRef.current = nextPage;
      hasMoreRef.current = hasNextPage;
      setHasMore(hasNextPage);
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("Infinite scroll:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: SCROLL_ROOT_MARGIN },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, loading, hasMore, sentinelRef };
}
