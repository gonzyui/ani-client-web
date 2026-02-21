import { CardSkeleton } from "@/app/components/CardSkeleton";
import PageContainer from "@/app/components/PageContainer";

export default function Loading() {
  return (
    <PageContainer>
      <div className="mb-8">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton mt-2 h-5 w-80 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </PageContainer>
  );
}
