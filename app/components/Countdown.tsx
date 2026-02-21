"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  airingAt: number;
  episode: number;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return "Airing now";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (d === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

export default function Countdown({ airingAt, episode }: CountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, airingAt - Math.floor(Date.now() / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, airingAt - Math.floor(Date.now() / 1000));
      setRemaining(diff);
      if (diff <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [airingAt]);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-accent-light">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-xs text-muted">Episode {episode}</p>
        <p className="text-sm font-semibold text-accent-light">{formatTime(remaining)}</p>
      </div>
    </div>
  );
}
