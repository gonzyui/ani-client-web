export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <div className="skeleton h-10 w-64 rounded" />
        <div className="skeleton mt-3 h-5 w-40 rounded" />
        <div className="mt-4 flex gap-3">
          <div className="skeleton h-8 w-28 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      </div>

      <div className="skeleton mb-4 h-7 w-40 rounded" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[3/4] rounded-xl" />
            <div className="skeleton mt-2 h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>

      <div className="skeleton mb-4 mt-12 h-7 w-24 rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-xl" />
        ))}
      </div>
    </main>
  );
}
