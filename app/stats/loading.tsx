import PageContainer from "@/app/components/PageContainer";

export default function Loading() {
  return (
    <PageContainer>
      <div className="mb-10">
        <div className="skeleton h-8 w-32 rounded-lg" />
        <div className="skeleton mt-2 h-5 w-72 rounded-lg" />
      </div>
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-72 rounded-xl" />
        ))}
      </div>
    </PageContainer>
  );
}
