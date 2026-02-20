"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon, PlayIcon, MenuIcon, CloseIcon } from "@/app/components/Icons";
import ThemeToggle from "@/app/components/ThemeToggle";
import { SEARCH_DEBOUNCE_MS } from "@/app/lib/constants";

interface SearchResult {
  id: number;
  kind: "anime" | "manga" | "character" | "studio";
  title: string;
  cover: string | null;
  format?: string | null;
  year?: number | null;
  score?: number | null;
  favourites?: number | null;
}

function getResultHref(item: SearchResult): string {
  switch (item.kind) {
    case "anime":
      return `/anime/${item.id}`;
    case "manga":
      return `/manga/${item.id}`;
    case "character":
      return `/character/${item.id}`;
    case "studio":
      return `/studios/${item.id}`;
  }
}

const KIND_LABELS: Record<SearchResult["kind"], string> = {
  anime: "Anime",
  manga: "Manga",
  character: "Character",
  studio: "Studio",
};

const KIND_COLORS: Record<SearchResult["kind"], string> = {
  anime: "text-accent-light bg-accent/10",
  manga: "text-purple-400 bg-purple-400/10",
  character: "text-emerald-400 bg-emerald-400/10",
  studio: "text-amber-400 bg-amber-400/10",
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/anime", label: "Anime" },
  { href: "/manga", label: "Manga" },
  { href: "/airing", label: "Airing" },
  { href: "/characters", label: "Characters" },
  { href: "/studios", label: "Studios" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q.trim())}`,
        { signal: controller.signal },
      );
      const data = await res.json();
      setResults(data.results ?? []);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      const item = results[selectedIndex];
      router.push(getResultHref(item));
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setQuery("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="pointer-events-none sticky top-0 z-50 flex w-full justify-center px-4 pt-4">
    <nav className="nav-pill pointer-events-auto w-auto rounded-2xl border shadow-xl ring-1 ring-black/[0.03] backdrop-blur-2xl transition-all duration-300">
      <div className="flex h-12 items-center gap-1 px-2 sm:px-3">
        <Link href="/" className="nav-surface-hover mr-1 flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent shadow-md shadow-accent/25">
            <PlayIcon className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-sm font-bold tracking-tight sm:inline">
            Ani<span className="text-accent-light">Client</span>
          </span>
        </Link>

        <div className="nav-separator mx-1 hidden h-5 w-px md:block" />

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-[13px] transition-all duration-200 ${
                pathname === link.href
                  ? "nav-surface-active font-medium text-foreground"
                  : "nav-surface-hover text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-separator mx-1 hidden h-5 w-px md:block" />

        <div className="flex items-center gap-1.5">
          <div ref={wrapperRef} className="relative">
            <form onSubmit={handleSubmit}>
              <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="nav-search-input h-8 w-32 rounded-lg border-0 pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent/50 sm:w-44"
                aria-label="Search anime, manga, characters and studios"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
              />
            </form>

            {showDropdown && (
              <div
                className="absolute right-0 top-full z-[60] mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20"
                role="listbox"
              >
                {loading && results.length === 0 ? (
                  <div className="space-y-1 p-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                        <div className="skeleton h-14 w-10 shrink-0 rounded" />
                        <div className="flex-1 space-y-1.5">
                          <div className="skeleton h-3.5 w-3/4 rounded" />
                          <div className="skeleton h-3 w-1/2 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <ul className="max-h-80 overflow-y-auto p-1.5">
                      {results.map((item, i) => (
                        <li key={`${item.kind}-${item.id}`} role="option" aria-selected={selectedIndex === i}>
                          <Link
                            href={getResultHref(item)}
                            onClick={() => {
                              setShowDropdown(false);
                              setQuery("");
                            }}
                            className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                              selectedIndex === i
                                ? "bg-accent/10 text-foreground"
                                : "text-foreground hover:bg-accent/5"
                            }`}
                          >
                            {item.cover ? (
                              <Image
                                src={item.cover}
                                alt={item.title}
                                width={40}
                                height={56}
                                className={`shrink-0 object-cover ${
                                  item.kind === "character"
                                    ? "h-12 w-12 rounded-full"
                                    : "h-14 w-10 rounded"
                                }`}
                              />
                            ) : (
                              <div className={`flex shrink-0 items-center justify-center text-xs text-muted ${
                                item.kind === "character"
                                  ? "h-12 w-12 rounded-full bg-border"
                                  : item.kind === "studio"
                                    ? "h-10 w-10 rounded-lg bg-border"
                                    : "h-14 w-10 rounded bg-border"
                              }`}>
                                {item.kind === "studio" ? "S" : "?"}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                                <span className={`rounded px-1.5 py-0.5 font-medium ${KIND_COLORS[item.kind]}`}>
                                  {KIND_LABELS[item.kind]}
                                </span>
                                {item.format && (
                                  <span>{item.format.replace(/_/g, " ")}</span>
                                )}
                                {item.year && <span>{item.year}</span>}
                                {item.score != null && (
                                  <span className="text-green-400">
                                    ★ {(item.score / 10).toFixed(1)}
                                  </span>
                                )}
                                {item.favourites != null && item.kind !== "anime" && item.kind !== "manga" && (
                                  <span className="text-pink-400">
                                    ♥ {item.favourites.toLocaleString('en-US')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border p-2">
                      <Link
                        href={`/search?q=${encodeURIComponent(query.trim())}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setQuery("");
                        }}
                        className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-accent-light transition-colors hover:bg-accent/5"
                      >
                        See all results for &ldquo;{query.trim()}&rdquo;
                      </Link>
                    </div>
                  </>
                ) : query.trim().length >= 2 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted">
                    No results found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <ThemeToggle />

          <button
            className="nav-surface-hover flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="nav-mobile-divider px-2 pb-2 pt-1 md:hidden">
          <div className="flex flex-wrap gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  pathname === link.href
                    ? "nav-surface-active text-accent-light"
                    : "nav-surface-hover text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
    </div>
  );
}
