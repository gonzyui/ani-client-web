export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="skeleton h-[360px] w-full sm:h-[420px]" />
      {/* Explore skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <div className="skeleton mx-auto h-4 w-32 rounded" />
          <div className="skeleton mx-auto mt-3 h-8 w-64 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-40 rounded-2xl sm:h-48" />
          <div className="skeleton h-40 rounded-2xl sm:h-48" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
