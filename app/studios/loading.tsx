import { StudioSkeleton } from "@/app/components/CardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton h-9 w-32 rounded" />
        <div className="skeleton mt-2 h-5 w-64 rounded" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StudioSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
