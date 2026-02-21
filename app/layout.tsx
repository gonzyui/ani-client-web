import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BackToTop from "@/app/components/BackToTop";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ani-client-web.vercel.app"),
  title: {
    default: "AniClient — Discover Anime & Manga",
    template: "%s | AniClient",
  },
  description:
    "Browse trending anime, search your favorites, explore characters, staff, studios, and get personalized recommendations — powered by ani-client and AniList.",
  keywords: [
    "anime",
    "manga",
    "AniList",
    "airing schedule",
    "anime characters",
    "voice actors",
    "seiyuu",
    "anime studios",
    "anime recommendations",
    "anime stats",
    "anime compare",
    "seasonal anime",
    "top anime",
    "trending anime",
  ],
  authors: [{ name: "gonzyui" }],
  creator: "AniClient",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AniClient",
    title: "AniClient — Discover Anime & Manga",
    description:
      "Browse trending anime, search your favorites, explore characters, staff, studios, and get personalized recommendations.",
    url: "https://ani-client-web.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniClient — Discover Anime & Manga",
    description:
      "Browse trending anime, search your favorites, explore characters, staff, studios, and get personalized recommendations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ani-client-web.vercel.app",
  },
};

const FOUC_SCRIPT = `(function(){var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <BackToTop />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
