export default function Loading() {
  return (
    <div className="-mt-20">
      <div className="relative overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-40">
        <div className="skeleton absolute inset-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:gap-10">
          <div className="flex flex-1 items-end gap-5">
            <div className="skeleton h-[185px] w-[130px] shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="skeleton h-6 w-28 rounded-lg" />
              <div className="skeleton h-10 w-72 rounded-lg" />
              <div className="skeleton h-4 w-96 rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-7 w-16 rounded-full" />
                <div className="skeleton h-7 w-20 rounded-full" />
                <div className="skeleton h-7 w-14 rounded-full" />
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 lg:w-[300px]">
            <div className="skeleton mb-3 h-3 w-28 rounded" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-[60px] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <div className="skeleton mx-auto h-3 w-20 rounded" />
            <div className="skeleton mx-auto mt-3 h-8 w-64 rounded" />
            <div className="skeleton mx-auto mt-2 h-4 w-80 rounded" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="skeleton h-40 rounded-2xl sm:h-44" />
            <div className="skeleton h-40 rounded-2xl sm:h-44" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-[68px] rounded-xl" />
            ))}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="skeleton h-11 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
