# ani-client-web

A modern anime & manga discovery website built with [Next.js 16](https://nextjs.org) and powered by [**ani-client**](https://github.com/gonzyui/ani-client) — a simple, typed client for the AniList GraphQL API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![ani-client](https://img.shields.io/badge/ani--client-1.1.0-8B5CF6)

## Features

- **Trending & Top Rated** — Browse trending and highest-rated anime/manga with tabbed navigation
- **Infinite Scroll** — Seamless lazy-loading grids for anime, manga, characters, and studios
- **Live Search** — Autocomplete search in the navbar with instant AniList results
- **Detail Pages** — Rich anime/manga detail views with synopsis, stats, genres, studios, and characters
- **Character Browser** — Explore popular characters with favorites count and media appearances
- **Studio Browser** — Discover animation studios and their notable works
- **Genre Filtering** — Browse by genre (Action, Romance, Fantasy, Sci-Fi, Comedy, Horror)
- **Dark / Light Theme** — System-aware theme toggle with `localStorage` persistence
- **Responsive Design** — Mobile-first layout with hamburger menu navigation
- **ISR** — Incremental Static Regeneration (15 min revalidation) for fast page loads
- **Skeleton Loading** — Per-route `loading.tsx` files with skeleton UI
- **Error Boundary** — Graceful error handling with retry capability
- **Accessibility** — ARIA tablist/combobox roles, keyboard navigation, semantic HTML

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Data | [**ani-client**](https://github.com/gonzyui/ani-client) — AniList GraphQL wrapper |
| Language | [TypeScript 5](https://www.typescriptlang.org) |

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

## Project Structure

```
app/
├── page.tsx                      # Homepage — hero, trending carousel, genre pills
├── layout.tsx                    # Root layout — navbar, theme provider
├── loading.tsx                   # Root loading skeleton
├── error.tsx                     # Global error boundary
├── not-found.tsx                 # 404 page
├── globals.css                   # Tailwind v4 theme + custom styles
│
├── anime/
│   ├── page.tsx                  # Anime browse — trending, top, airing tabs
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx              # Anime detail page
│       └── loading.tsx
│
├── manga/
│   ├── page.tsx                  # Manga browse — trending, top, publishing tabs
│   └── loading.tsx
│
├── characters/
│   ├── page.tsx                  # Character browser — infinite grid
│   └── loading.tsx
│
├── character/[id]/
│   ├── page.tsx                  # Character detail page
│   └── loading.tsx
│
├── studios/
│   ├── page.tsx                  # Studio browser — infinite grid
│   └── loading.tsx
│
├── search/
│   ├── page.tsx                  # Search results with type/genre filters
│   └── loading.tsx
│
├── api/
│   ├── browse/route.ts           # Paginated media browsing
│   ├── search/route.ts           # Media search
│   ├── characters/route.ts       # Character search
│   └── studios/route.ts          # Studio pagination
│
├── components/
│   ├── Navbar.tsx                # Nav with live search, mobile menu, active links
│   ├── MediaCard.tsx             # Reusable anime/manga card
│   ├── MediaGrid.tsx             # Static media grid
│   ├── InfiniteMediaGrid.tsx     # Infinite scroll media grid
│   ├── InfiniteCharacterGrid.tsx # Infinite scroll character grid
│   ├── InfiniteStudioGrid.tsx    # Infinite scroll studio grid
│   ├── TabbedMediaBrowser.tsx    # Lazy-mounted tabbed interface
│   ├── TrendingRankCarousel.tsx  # Auto-scrolling ranking carousel
│   ├── CardSkeleton.tsx          # Skeleton components
│   ├── PageContainer.tsx         # Layout wrapper
│   ├── Icons.tsx                 # Shared SVG icons
│   ├── FadeIn.tsx                # Fade-in animation wrapper
│   ├── Footer.tsx                # Site footer
│   ├── ThemeProvider.tsx         # Theme context provider
│   └── ThemeToggle.tsx           # Dark/light toggle button
│
└── lib/
    ├── client.ts                 # ani-client singleton
    ├── hooks.ts                  # useInfiniteScroll custom hook
    ├── queries.ts                # Shared GraphQL queries & types
    └── utils.ts                  # Helpers (stripHtml, formatScore, getMediaHref…)
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
