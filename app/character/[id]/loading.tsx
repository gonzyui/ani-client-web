export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header: image + name + badges */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="skeleton h-[310px] w-[220px] shrink-0 rounded-xl" />
          <div className="flex flex-col gap-3">
            <div className="skeleton h-9 w-64 rounded" />
            <div className="skeleton h-5 w-36 rounded" />
            <div className="flex gap-2">
              <div className="skeleton h-8 w-20 rounded-lg" />
              <div className="skeleton h-8 w-16 rounded-lg" />
              <div className="skeleton h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column: About + Appears in */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="skeleton mb-3 h-6 w-16 rounded" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
            <div>
              <div className="skeleton mb-4 h-6 w-28 rounded" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="skeleton aspect-[3/4] w-full" />
                    <div className="p-3 space-y-1">
                      <div className="skeleton h-3.5 w-3/4 rounded" />
                      <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Info card */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="skeleton mb-4 h-4 w-24 rounded" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="skeleton h-4 w-20 rounded" />
                    <div className="skeleton h-4 w-24 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
