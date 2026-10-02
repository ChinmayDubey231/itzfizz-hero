import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welcome Itzfizz — Scroll-driven hero",
  description:
    "A scroll-driven hero section built with Next.js, Tailwind CSS and GSAP ScrollTrigger.",
};

export const viewport: Viewport = {
  themeColor: "#0e0f0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so intro elements start hidden (see globals.css). */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
