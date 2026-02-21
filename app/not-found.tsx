import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been removed.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl font-bold text-accent">404</div>
      <h1 className="text-2xl font-semibold text-foreground">Page Not Found</h1>
      <p className="max-w-md text-muted">
        The anime, manga, or character you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
      >
        Back to Home
      </Link>
    </main>
  );
}
