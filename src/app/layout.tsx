import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinite Desire | A Cosmic Love Experience",
  description: "Explore a beautiful 3D cosmic journey of love and memories. A personalized Valentine's experience featuring interactive 3D elements, music, and digital love letters.",
  keywords: ["Valentine's Day", "Love Letter", "Cosmic Love", "3D Experience", "Love Quiz", "Digital Memories"],
  authors: [{ name: "Ari-ICU" }],
  openGraph: {
    title: "Infinite Desire | A Cosmic Love Experience",
    description: "Explore a beautiful 3D cosmic journey of love and memories.",
    url: "https://valentines-day.ari-icu.me", // Placeholder or update if known
    siteName: "Infinite Desire",
    images: [
      {
        url: "/og-image.png", // They should add this later or I can generate a placeholder mention
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinite Desire | A Cosmic Love Experience",
    description: "A cosmic journey through love and memories.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
