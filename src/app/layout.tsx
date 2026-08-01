import type { Metadata } from "next";
import { Space_Grotesk, Inter, Kalam, JetBrains_Mono } from "next/font/google";
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

// Handwriting accent — placeholder until Hamza's own font is ready.
// Used ONLY for annotations, stamps, sticky notes, captions — never
// for body copy or section titles.
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Utility mono — dates, tags, status labels, "engineering" metadata.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${kalam.variable} ${jetbrainsMono.variable} paper-grain antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
