import { CardSkeleton } from "@/app/components/CardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton h-9 w-40 rounded" />
        <div className="skeleton mt-2 h-5 w-72 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
