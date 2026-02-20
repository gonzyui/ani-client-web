import { CardSkeleton } from "@/app/components/CardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton h-9 w-32 rounded" />
        <div className="skeleton mt-2 h-5 w-64 rounded" />
      </div>
      <div className="mb-8 flex gap-2">
        <div className="skeleton h-10 w-24 rounded-lg" />
        <div className="skeleton h-10 w-24 rounded-lg" />
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
