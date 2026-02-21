"use client";

import { useEffect } from "react";
import { trackRecentView } from "@/app/lib/recentViews";

interface RecentViewTrackerProps {
  id: number;
  type: string;
  title: string;
  image: string | null;
}

export default function RecentViewTracker({ id, type, title, image }: RecentViewTrackerProps) {
  useEffect(() => {
    trackRecentView({ id, type, title, image });
  }, [id, type, title, image]);

  return null;
}
