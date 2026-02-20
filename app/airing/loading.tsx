export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton h-9 w-48 rounded" />
        <div className="skeleton mt-2 h-5 w-80 rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className="skeleton h-20 w-14 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
            <div className="skeleton h-3 w-12 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
