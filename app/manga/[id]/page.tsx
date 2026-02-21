/**
 * Manga detail page — re-exports from the anime detail page since both media
 * types share the same AniList data shape and layout. The anime/[id]/page
 * component already handles type detection via the `type` field on the media
 * object (ANIME vs MANGA) and adapts labels accordingly (episodes→chapters, etc.).
 */
export { default, generateMetadata } from "@/app/anime/[id]/page";
