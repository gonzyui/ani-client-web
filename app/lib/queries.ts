// ── Studio types ──

export interface StudioMedia {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string | null; medium: string | null };
  type: string;
  format: string | null;
  averageScore: number | null;
}

export interface StudioData {
  id: number;
  name: string;
  isAnimationStudio: boolean;
  siteUrl: string | null;
  favourites: number | null;
  media: { nodes: StudioMedia[] };
}

export interface StudioPageResult {
  Page: {
    pageInfo: {
      total: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    studios: StudioData[];
  };
}

// ── Studio GraphQL query ──

export const STUDIOS_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [StudioSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      studios(search: $search, sort: $sort) {
        id
        name
        isAnimationStudio
        siteUrl
        favourites
        media(page: 1, perPage: 6, sort: POPULARITY_DESC) {
          nodes {
            id
            title { romaji english }
            coverImage { large medium }
            type
            format
            averageScore
          }
        }
      }
    }
  }
`;
