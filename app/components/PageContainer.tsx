interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main
      className={`mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 ${className}`}
    >
      {children}
    </main>
  );
}
