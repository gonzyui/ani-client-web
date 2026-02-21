import type { Metadata } from "next";
import RecommendationClient from "@/app/components/RecommendationClient";

export const metadata: Metadata = {
  title: "Get a Recommendation",
  description:
    "Get a random anime or manga recommendation based on trending titles. Discover your next favorite!",
  openGraph: {
    title: "Get a Recommendation | AniClient",
    description:
      "Get a random anime or manga recommendation based on trending titles.",
  },
};

export default function RecommendationPage() {
  return <RecommendationClient />;
}
