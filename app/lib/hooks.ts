"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions<T> {
  initialItems: T[];
  initialHasMore: boolean;
  fetchUrl: (page: number) => string;
  parseResponse?: (data: unknown) => { results: T[]; hasNextPage: boolean };
}

function defaultParser<T>(data: unknown) {
  const d = data as { results: T[]; pageInfo?: { hasNextPage?: boolean } };
  return {
    results: d.results ?? [],
    hasNextPage: d.pageInfo?.hasNextPage ?? false,
  };
}

export function useInfiniteScroll<T>({
  initialItems,
  initialHasMore,
  fetchUrl,
  parseResponse,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Refs for callbacks to avoid re-creating loadMore unnecessarily
  const fetchUrlRef = useRef(fetchUrl);
  const parseRef = useRef(parseResponse ?? defaultParser<T>);
  fetchUrlRef.current = fetchUrl;
  parseRef.current = parseResponse ?? defaultParser<T>;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const nextPage = page + 1;
    try {
      const res = await fetch(fetchUrlRef.current(nextPage));
      const data = await res.json();
      const { results, hasNextPage } = parseRef.current(data);

      setItems((prev) => [...prev, ...results]);
      setPage(nextPage);
      setHasMore(hasNextPage);
    } catch {
      // silently fail — user can scroll again
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, loading, hasMore, sentinelRef };
}
