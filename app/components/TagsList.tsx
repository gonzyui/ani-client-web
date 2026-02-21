interface Tag {
  id: number;
  name: string;
  description?: string | null;
  rank?: number | null;
  isMediaSpoiler?: boolean | null;
}

interface TagsListProps {
  tags: Tag[];
}

export default function TagsList({ tags }: TagsListProps) {
  if (tags.length === 0) return null;

  const regularTags = tags.filter((t) => !t.isMediaSpoiler).slice(0, 15);
  const spoilerTags = tags.filter((t) => t.isMediaSpoiler);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Tags
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {regularTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded-full bg-card-hover px-2.5 py-1 text-[11px] text-muted"
            title={tag.description || undefined}
          >
            {tag.name}
            {tag.rank != null && (
              <span className="text-[9px] font-medium text-accent-light">
                {tag.rank}%
              </span>
            )}
          </span>
        ))}
        {spoilerTags.length > 0 && (
          <details className="w-full mt-2">
            <summary className="cursor-pointer text-[11px] text-muted hover:text-foreground">
              Show spoiler tags
            </summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {spoilerTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400"
                  title={tag.description || undefined}
                >
                  {tag.name}
                  {tag.rank != null && (
                    <span className="text-[9px] font-medium">{tag.rank}%</span>
                  )}
                </span>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
