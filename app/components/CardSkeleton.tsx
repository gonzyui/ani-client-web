export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="skeleton aspect-[3/4]" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-6">
      <div className="skeleton mb-4 h-6 w-48 rounded" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, j) => (
          <div key={j} className="skeleton aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
