"use client";

import type { Media, PageInfo } from "ani-client";
import { useState } from "react";
import InfiniteMediaGrid from "@/app/components/InfiniteMediaGrid";

interface Tab {
  id: string;
  label: string;
  category: "trending" | "top" | "airing";
  items: Media[];
  pageInfo: PageInfo;
}

interface TabbedMediaBrowserProps {
  tabs: Tab[];
  type: "ANIME" | "MANGA";
}

export default function TabbedMediaBrowser({ tabs, type }: TabbedMediaBrowserProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    () => new Set([tabs[0].id]),
  );

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setVisitedTabs((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Browse categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content — lazy-mounted, hidden when inactive to preserve state */}
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
    </div>
  );
}
