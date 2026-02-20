export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="-mt-[4.5rem] skeleton h-72 w-full sm:h-80 md:h-96" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative -mt-28 flex flex-col gap-6 sm:-mt-36 sm:flex-row sm:items-end sm:gap-8">
          <div className="skeleton h-[280px] w-[200px] shrink-0 rounded-xl" />
          <div className="flex flex-col gap-3 pb-2">
            <div className="skeleton h-10 w-72 rounded" />
            <div className="skeleton h-5 w-48 rounded" />
            <div className="flex gap-3">
              <div className="skeleton h-8 w-16 rounded-lg" />
              <div className="skeleton h-8 w-24 rounded-lg" />
              <div className="skeleton h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="space-y-3 sm:col-span-2">
            <div className="skeleton h-6 w-24 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
