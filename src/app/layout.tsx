import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Display face — used sparingly for section titles, gives a
// blueprint / technical-drawing feel.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Body face — clean, quiet, does the actual reading work.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Utility mono — dates, tags, status labels, "engineering" metadata.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Hamza's actual handwriting, digitized — the real "hand" font.
// Registers directly as --font-custom-1 so the font picker in every
// edit form can select it by name; also aliased to --font-hand below
// so it becomes the site-wide handwriting accent everywhere at once.
const hamzaHandwriting = localFont({
  src: "../fonts/HamzasHandwriting.ttf",
  variable: "--font-custom-1",
  display: "swap",
});

// Elms Sans (variable weight) — second custom font, available as its
// own picker option without being wired in as a default anywhere yet.
const elmsSans = localFont({
  src: "../fonts/ElmsSans-Variable.ttf",
  variable: "--font-custom-2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamza's Lab — Building software. Breaking software. Learning why.",
  description:
    "A living engineering notebook: projects, failures, ideas, and lessons from a software engineering student's journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // IMPORTANT: the font `variable` classes go on <html>, not <body>.
  // globals.css defines --font-display/--font-hand/etc at :root (= <html>),
  // referencing these next/font variables — CSS custom properties only
  // resolve from the same element or an ancestor, never a descendant, so
  // if these classes lived on <body> (a descendant of :root) every var()
  // reference in :root would silently fail to resolve. This is why font
  // changes appeared to have no effect before.
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${hamzaHandwriting.variable} ${elmsSans.variable}`}
    >
      <body className="paper-grain antialiased">{children}</body>
    </html>
  );
}
