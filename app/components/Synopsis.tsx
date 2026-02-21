"use client";

import { useState } from "react";

interface SynopsisProps {
  text: string;
  /** Number of characters before truncation (default 400) */
  limit?: number;
}

export default function Synopsis({ text, limit = 400 }: SynopsisProps) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > limit;

  return (
    <div>
      <p className="leading-relaxed text-muted">
        {needsTruncation && !expanded ? `${text.slice(0, limit).trimEnd()}...` : text}
      </p>
      {needsTruncation && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-accent-light hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
