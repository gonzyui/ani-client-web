"use client";

import type { Media, PageInfo } from "ani-client";
import { useState } from "react";
import InfiniteMediaGrid from "@/app/components/InfiniteMediaGrid";
import { FilterBar, FilteredMediaGrid, EMPTY_FILTERS, type Filters } from "@/app/components/MediaFilters";

interface Tab {
  id: string;
  label: string;
  category: "trending" | "top" | "airing" | "upcoming" | "season";
  items: Media[];
  pageInfo: PageInfo;
}

interface TabbedMediaBrowserProps {
  tabs: Tab[];
  type: "ANIME" | "MANGA";
  genres: string[];
}

export default function TabbedMediaBrowser({ tabs, type, genres }: TabbedMediaBrowserProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    () => new Set([tabs[0].id]),
  );
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setVisitedTabs((prev) => new Set(prev).add(id));
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Browse categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id && !hasActiveFilters}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => {
                handleTabChange(tab.id);
                if (hasActiveFilters) handleReset();
              }}
              className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id && !hasActiveFilters
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? "border border-accent/30 bg-accent/10 text-accent-light"
              : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6">
          <FilterBar
            type={type}
            genres={genres}
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
          />
        </div>
      )}

      {hasActiveFilters ? (
        <FilteredMediaGrid type={type} filters={filters} />
      ) : (
        <>
          {tabs.map((tab) => {
            if (!visitedTabs.has(tab.id)) return null;

            return (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                className={activeTab === tab.id ? "block" : "hidden"}
              >
                <InfiniteMediaGrid
                  initialItems={tab.items}
                  initialPageInfo={tab.pageInfo}
                  type={type}
                  category={tab.category}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
