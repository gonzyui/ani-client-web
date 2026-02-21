# ani-client-web

A modern anime & manga discovery website built with [Next.js 16](https://nextjs.org) and powered by [**ani-client**](https://github.com/gonzyui/ani-client) — a simple, typed client for the AniList GraphQL API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![ani-client](https://img.shields.io/badge/ani--client-1.2.0-8B5CF6)

## Features

- **Trending & Top Rated** — Browse trending and highest-rated anime/manga with tabbed navigation
- **Infinite Scroll** — Seamless lazy-loading grids for anime, manga, characters, staff, and studios
- **Live Search** — Autocomplete search in the navbar with instant AniList results
- **Detail Pages** — Rich anime/manga detail views with synopsis, stats, genres, studios, characters, streaming links, score distribution, and tags
- **Character Browser** — Explore popular characters with favorites count and media appearances
- **Staff Browser** — Discover voice actors, directors, and other staff with career info
- **Studio Browser** — Browse animation studios and their productions with clickable staff links
- **Airing Schedule** — See currently airing anime with countdown timers and calendar view
- **Recommendations** — Get random anime/manga recommendations based on AniList data
- **Compare** — Side-by-side comparison of up to 4 anime/manga titles
- **Stats Dashboard** — Genre popularity, studio rankings, format distribution, and score analytics
- **Genre Filtering** — Browse by genre (Action, Romance, Fantasy, Sci-Fi, Comedy, Horror…)
- **Recently Viewed** — Track and revisit recently viewed titles (client-side, no account needed)
- **Dark / Light Theme** — System-aware theme toggle with `localStorage` persistence
- **Responsive Design** — Mobile-first layout with hamburger menu navigation
- **ISR** — Incremental Static Regeneration (15 min revalidation) for fast page loads
- **Rate Limiting** — API proxy with 60 req/min per IP rate limiting
- **Skeleton Loading** — Per-route `loading.tsx` files with skeleton UI
- **Error Boundaries** — Granular error handling per detail page with retry capability
- **SEO** — Dynamic metadata, Open Graph, Twitter cards, robots.txt, and sitemap.xml
- **Accessibility** — ARIA tablist/combobox roles, keyboard navigation, semantic HTML

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Data | [**ani-client**](https://github.com/gonzyui/ani-client) — AniList GraphQL wrapper |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Testing | [Vitest](https://vitest.dev) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) (recommended)

### Installation

```bash
git clone https://github.com/gonzyui/ani-client-web.git
cd ani-client-web
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

### Tests

```bash
pnpm test          # single run
pnpm test:watch    # watch mode
```

## Project Structure

```
proxy.ts                          # API rate-limiter (Next.js 16 proxy)
vitest.config.ts                  # Vitest configuration
__tests__/
└── utils.test.ts                 # Unit tests for utility functions

app/
├── page.tsx                      # Homepage — hero, trending carousel, genre pills
├── layout.tsx                    # Root layout — navbar, theme provider, analytics
├── loading.tsx                   # Root loading skeleton
├── error.tsx                     # Global error boundary
├── not-found.tsx                 # 404 page
├── globals.css                   # Tailwind v4 theme + custom styles
├── robots.ts                     # robots.txt generation
├── sitemap.ts                    # sitemap.xml generation
│
├── anime/
│   ├── page.tsx                  # Anime browse — trending, top, airing tabs
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx              # Anime detail — 2-column layout with sidebar
│       ├── error.tsx             # Anime-specific error boundary
│       └── loading.tsx
│
├── manga/
│   ├── page.tsx                  # Manga browse — trending, top, publishing tabs
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx              # Re-exports anime/[id] (shared layout)
│       └── loading.tsx
│
├── airing/
│   ├── page.tsx                  # Airing schedule with calendar & countdowns
│   └── loading.tsx
│
├── characters/
│   ├── page.tsx                  # Character browser — infinite grid
│   └── loading.tsx
│
├── character/[id]/
│   ├── page.tsx                  # Character detail — info card, appearances
│   ├── error.tsx                 # Character-specific error boundary
│   └── loading.tsx
│
├── staff/
│   ├── page.tsx                  # Staff browser — infinite grid
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx              # Staff detail — bio, roles, works
│       ├── error.tsx             # Staff-specific error boundary
│       └── loading.tsx
│
├── studios/
│   ├── page.tsx                  # Studio browser — infinite grid
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx              # Studio detail — productions, staff
│       ├── error.tsx             # Studio-specific error boundary
│       └── loading.tsx
│
├── search/
│   ├── page.tsx                  # Search results with type/genre filters
│   └── loading.tsx
│
├── compare/
│   └── page.tsx                  # Side-by-side media comparison (up to 4)
│
├── recommendation/
│   └── page.tsx                  # Random recommendation generator
│
├── stats/
│   ├── page.tsx                  # Stats dashboard — genres, studios, formats
│   └── loading.tsx
│
├── api/
│   ├── airing/route.ts           # Airing schedule data
│   ├── browse/route.ts           # Paginated media browsing
│   ├── characters/route.ts       # Character search
│   ├── compare/route.ts          # Compare media details
│   ├── recommendation/route.ts   # Random recommendations
│   ├── search/route.ts           # Media search
│   ├── staff/route.ts            # Staff browsing
│   └── studios/route.ts          # Studio pagination
│
├── components/
│   ├── Navbar.tsx                # Nav with live search, mobile menu, active links
│   ├── Footer.tsx                # Site footer
│   ├── PageContainer.tsx         # Layout wrapper
│   ├── ThemeProvider.tsx         # Theme context provider
│   ├── ThemeToggle.tsx           # Dark/light toggle button
│   │
│   ├── MediaCard.tsx             # Reusable anime/manga card
│   ├── MediaGrid.tsx             # Static media grid with fade-in
│   ├── MediaTable.tsx            # Tabular media display
│   ├── MediaInfoCard.tsx         # Detail page sidebar info card
│   ├── MediaFilters.tsx          # Browse filter controls
│   │
│   ├── InfiniteMediaGrid.tsx     # Infinite scroll media grid
│   ├── InfiniteCharacterGrid.tsx # Infinite scroll character grid
│   ├── InfiniteStaffGrid.tsx     # Infinite scroll staff grid
│   ├── InfiniteStudioGrid.tsx    # Infinite scroll studio grid
│   │
│   ├── CharacterCard.tsx         # Standalone character card
│   ├── StaffCard.tsx             # Standalone staff card
│   ├── StudioCard.tsx            # Standalone studio card
│   │
│   ├── TabbedMediaBrowser.tsx    # Lazy-mounted tabbed interface
│   ├── TrendingRankCarousel.tsx  # Auto-scrolling ranking carousel
│   ├── AiringCalendar.tsx        # Calendar view for airing schedule
│   ├── Countdown.tsx             # Episode countdown timer
│   ├── Synopsis.tsx              # Expandable synopsis with HTML stripping
│   ├── ScoreDistribution.tsx     # Score distribution bar chart
│   ├── StreamingLinks.tsx        # Streaming service links (next/image)
│   ├── TagsList.tsx              # Tags display with spoiler toggle
│   ├── Breadcrumbs.tsx           # Breadcrumb navigation
│   ├── BackToTop.tsx             # Scroll-to-top button
│   ├── ShareButton.tsx           # Share/copy link button
│   │
│   ├── CompareClient.tsx         # Client-side compare interface
│   ├── RecommendationClient.tsx  # Client-side recommendation UI
│   ├── RecentlyViewed.tsx        # Recently viewed titles display
│   ├── RecentViewTracker.tsx     # Tracks page views to localStorage
│   │
│   ├── CardSkeleton.tsx          # Skeleton loading components
│   ├── FadeIn.tsx                # Fade-in animation wrapper
│   └── Icons.tsx                 # Shared SVG icons
│
└── lib/
    ├── client.ts                 # ani-client singleton with cache config
    ├── constants.ts              # Shared constants (ISR interval, pagination, cache)
    ├── hooks.ts                  # useInfiniteScroll custom hook
    ├── queries.ts                # Shared GraphQL queries (studios, staff, characters)
    ├── recentViews.ts            # Recently-viewed tracking logic
    ├── types.ts                  # Shared TypeScript interfaces & type utilities
    └── utils.ts                  # Helpers (stripHtml, formatScore, clampPage, parseDescriptionFields…)
```

## Powered By

This project is built on top of [**ani-client**](https://github.com/gonzyui/ani-client) — a simple and typed client to fetch anime, manga, characters and user data from [AniList](https://anilist.co). All data displayed on this website comes from the AniList API through ani-client.

```bash
pnpm add ani-client
```

```ts
import { AniClient, MediaType } from "ani-client";

const client = new AniClient();
const trending = await client.getTrending(MediaType.ANIME, 1, 20);
```

## License

This project is open source. See the [LICENSE](LICENSE) file for details.
