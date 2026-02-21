import type { Metadata } from "next";
import CompareClient from "@/app/components/CompareClient";

export const metadata: Metadata = {
  title: "Compare Anime & Manga",
  description:
    "Compare up to 4 anime or manga side by side — scores, popularity, episodes, genres, and more.",
  openGraph: {
    title: "Compare Anime & Manga | AniClient",
    description:
      "Compare up to 4 anime or manga side by side — scores, popularity, episodes, genres, and more.",
  },
};

export default function ComparePage() {
  return <CompareClient />;
}
