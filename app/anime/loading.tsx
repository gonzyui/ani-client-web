export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton h-9 w-32 rounded" />
        <div className="skeleton mt-2 h-5 w-64 rounded" />
      </div>

      {/* Tab buttons row */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["w-24", "w-20", "w-32", "w-24", "w-28"].map((w, i) => (
          <div key={i} className={`skeleton h-10 ${w} rounded-lg`} />
        ))}
      </div>

      {/* View toggle + filters row */}
      <div className="mb-4 flex items-center gap-2">
        <div className="skeleton h-9 w-20 rounded-lg" />
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-4 border-b border-border bg-card px-3 py-3">
          <div className="skeleton h-3 w-6 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton hidden h-3 w-12 rounded sm:block" />
          <div className="skeleton hidden h-3 w-16 rounded md:block" />
          <div className="skeleton hidden h-3 w-12 rounded md:block" />
          <div className="skeleton hidden h-3 w-10 rounded lg:block" />
          <div className="skeleton hidden h-3 w-14 rounded lg:block" />
        </div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5">
            <div className="skeleton h-3 w-6 rounded" />
            <div className="skeleton h-12 w-8 shrink-0 rounded" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="skeleton h-3.5 w-2/5 rounded" />
              <div className="skeleton h-2.5 w-1/4 rounded" />
            </div>
            <div className="skeleton hidden h-3 w-10 rounded sm:block" />
            <div className="skeleton hidden h-3 w-14 rounded md:block" />
            <div className="skeleton hidden h-3 w-8 rounded md:block" />
            <div className="skeleton hidden h-3 w-10 rounded lg:block" />
            <div className="skeleton hidden h-5 w-16 rounded-full lg:block" />
          </div>
        ))}
      </div>
    </main>
  );
}
