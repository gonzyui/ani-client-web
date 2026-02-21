import Link from "next/link";

interface InfoItem {
  label: string;
  value: React.ReactNode;
}

interface MediaInfoCardProps {
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  duration?: number | null;
  popularity?: number | null;
  favourites?: number | null;
  source?: string | null;
  studios?: { nodes: Array<{ id: number; name: string; isAnimationStudio: boolean }> } | null;
  siteUrl?: string | null;
}

export default function MediaInfoCard({
  episodes,
  chapters,
  volumes,
  duration,
  popularity,
  favourites,
  source,
  studios,
  siteUrl,
}: MediaInfoCardProps) {
  const items: InfoItem[] = [];

  if (episodes) items.push({ label: "Episodes", value: episodes });
  if (chapters) items.push({ label: "Chapters", value: chapters });
  if (volumes) items.push({ label: "Volumes", value: volumes });
  if (duration) items.push({ label: "Duration", value: `${duration} min` });
  if (popularity) items.push({ label: "Popularity", value: popularity.toLocaleString("en-US") });
  if (favourites) items.push({ label: "Favorites", value: favourites.toLocaleString("en-US") });
  if (source) {
    items.push({
      label: "Source",
      value: source.toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
    });
  }
  if (studios?.nodes?.length) {
    const studioNodes =
      studios.nodes.filter((s) => s.isAnimationStudio).length > 0
        ? studios.nodes.filter((s) => s.isAnimationStudio)
        : [studios.nodes[0]];

    items.push({
      label: "Studio",
      value: (
        <>
          {studioNodes.filter(Boolean).map((s, i, arr) => (
            <span key={`${s.id}-${i}`}>
              <Link href={`/studios/${s.id}`} className="text-accent-light hover:underline">
                {s.name}
              </Link>
              {i < arr.length - 1 && ", "}
            </span>
          ))}
        </>
      ),
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        Information
      </h3>
      <dl className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between">
            <dt className="text-muted">{item.label}</dt>
            <dd className="font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
      {siteUrl && (
        <div className="pt-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent-light hover:underline"
          >
            View on AniList &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
