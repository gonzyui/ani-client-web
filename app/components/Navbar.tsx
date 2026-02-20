"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon, PlayIcon, MenuIcon, CloseIcon } from "@/app/components/Icons";
import { getMediaHref } from "@/app/lib/utils";
import ThemeToggle from "@/app/components/ThemeToggle";

interface SearchResult {
  id: number;
  title: string;
  cover: string | null;
  type: string;
  format: string | null;
  year: number | null;
  score: number | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/anime", label: "Anime" },
  { href: "/manga", label: "Manga" },
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

  // Close mobile menu on route change
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Close dropdown on outside click
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
      router.push(getMediaHref(item.id));
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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <PlayIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Ani<span className="text-accent-light">Client</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === link.href ? "font-medium text-foreground" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search + Theme toggle + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={wrapperRef} className="relative">
            <form onSubmit={handleSubmit}>
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search anime..."
                className="h-9 w-40 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
                aria-label="Search anime and manga"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
              />
            </form>

            {/* Dropdown */}
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
                        <li key={item.id} role="option" aria-selected={selectedIndex === i}>
                          <Link
                            href={getMediaHref(item.id)}
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
                                className="h-14 w-10 shrink-0 rounded object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-border text-xs text-muted">
                                ?
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                                {item.type && (
                                  <span className="rounded bg-accent/10 px-1.5 py-0.5 font-medium text-accent-light">
                                    {item.type}
                                  </span>
                                )}
                                {item.format && (
                                  <span>{item.format.replace(/_/g, " ")}</span>
                                )}
                                {item.year && <span>{item.year}</span>}
                                {item.score && (
                                  <span className="text-green-400">
                                    ★ {(item.score / 10).toFixed(1)}
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

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-card-hover hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent-light"
                    : "text-muted hover:bg-card-hover hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
