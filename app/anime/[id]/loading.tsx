export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="-mt-[4.5rem] skeleton h-72 w-full sm:h-80 md:h-96" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative -mt-28 flex flex-col gap-6 sm:-mt-36 sm:flex-row sm:items-end sm:gap-8">
          <div className="skeleton h-[280px] w-[200px] shrink-0 rounded-xl" />
          <div className="flex flex-col gap-3 pb-2">
            <div className="flex gap-1.5">
              <div className="skeleton h-4 w-10 rounded" />
              <div className="skeleton h-4 w-2 rounded" />
              <div className="skeleton h-4 w-12 rounded" />
              <div className="skeleton h-4 w-2 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
            <div className="skeleton h-10 w-72 rounded" />
            <div className="skeleton h-5 w-48 rounded" />
            <div className="flex gap-3">
              <div className="skeleton h-8 w-16 rounded-lg" />
              <div className="skeleton h-8 w-24 rounded-lg" />
              <div className="skeleton h-8 w-20 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-7 w-16 rounded-full" />
              <div className="skeleton h-7 w-20 rounded-full" />
              <div className="skeleton h-7 w-14 rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis */}
            <div>
              <div className="skeleton mb-3 h-6 w-24 rounded" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
            {/* Characters */}
            <div>
              <div className="skeleton mb-4 h-6 w-28 rounded" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="skeleton aspect-square w-full" />
                    <div className="p-2 space-y-1">
                      <div className="skeleton h-3 w-3/4 rounded" />
                      <div className="skeleton h-2.5 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Staff */}
            <div>
              <div className="skeleton mb-4 h-6 w-16 rounded" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="skeleton aspect-square w-full" />
                    <div className="p-2 space-y-1">
                      <div className="skeleton h-3 w-3/4 rounded" />
                      <div className="skeleton h-2.5 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: info card skeleton */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="skeleton mb-4 h-4 w-24 rounded" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="skeleton h-4 w-20 rounded" />
                    <div className="skeleton h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="skeleton h-48 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
