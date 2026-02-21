/** Studios listing with media previews (browse + API) */
export const STUDIOS_LIST_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [StudioSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      studios(search: $search, sort: $sort) {
        id name isAnimationStudio siteUrl favourites
        media(page: 1, perPage: 6, sort: POPULARITY_DESC) {
          pageInfo { hasNextPage }
          nodes { id title { romaji english } type format coverImage { large medium } siteUrl }
        }
      }
    }
  }
`;

/** Lightweight studio search (no media nodes) */
export const STUDIOS_SEARCH_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [StudioSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      studios(search: $search, sort: $sort) {
        id name favourites
      }
    }
  }
`;

/** Full studio detail with productions + nested staff */
export const STUDIO_DETAIL_QUERY = `
  query ($id: Int, $page: Int, $perPage: Int) {
    Studio(id: $id) {
      id name isAnimationStudio siteUrl favourites
      media(page: $page, perPage: $perPage, sort: POPULARITY_DESC) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        nodes {
          id title { romaji english } type format status
          coverImage { large medium }
          averageScore seasonYear episodes chapters
          staff(perPage: 10, sort: RELEVANCE) {
            edges {
              role
              node { id name { full } image { medium } }
            }
          }
        }
      }
    }
  }
`;

/** Characters + staff edges for a media detail page */
export const MEDIA_CHARACTERS_STAFF_QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      characters(sort: [ROLE, FAVOURITES_DESC], perPage: 25) {
        pageInfo { total hasNextPage }
        edges {
          role
          node { id name { full } image { medium } }
        }
      }
      staff(sort: RELEVANCE, perPage: 25) {
        pageInfo { total hasNextPage }
        edges {
          role
          node { id name { full } image { medium } }
        }
      }
      stats {
        scoreDistribution { score amount }
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      externalLinks {
        id
        url
        site
        type
        icon
        color
      }
    }
  }
`;

/** Staff detail with character roles & media works */
export const STAFF_DETAIL_QUERY = `
  query ($id: Int!, $page: Int, $perPage: Int) {
    Staff(id: $id) {
      id
      name { first middle last full native }
      language
      image { large medium }
      description(asHtml: false)
      primaryOccupations
      gender
      dateOfBirth { year month day }
      dateOfDeath { year month day }
      age
      yearsActive
      homeTown
      bloodType
      favourites
      siteUrl
      characterMedia(page: $page, perPage: $perPage, sort: POPULARITY_DESC) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        edges {
          characterRole
          characterName
          node {
            id title { romaji english } type format coverImage { large medium }
            averageScore seasonYear episodes chapters
          }
          characters {
            id name { full } image { medium }
          }
        }
      }
      staffMedia(page: 1, perPage: 20, sort: POPULARITY_DESC) {
        pageInfo { total }
        edges {
          staffRole
          node {
            id title { romaji english } type format coverImage { large medium }
            averageScore seasonYear
          }
        }
      }
    }
  }
`;

/** Staff browse/search listing (used by staff page + API route) */
export const STAFF_BROWSE_QUERY = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage perPage }
      staff(sort: [FAVOURITES_DESC], search: $search) {
        id
        name { first middle last full native }
        language
        image { large medium }
        description
        primaryOccupations
        gender
        dateOfBirth { year month day }
        dateOfDeath { year month day }
        age
        yearsActive
        homeTown
        bloodType
        favourites
        siteUrl
      }
    }
  }
`;
