import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/src/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cube Tutor - Learn Rubik's Cube Algorithms",
    template: "%s | Cube Tutor",
  },
  description: "Interactive platform for learning Rubik's cube solving methods and speedsolving algorithms. Master CFOP, Beginner's method, and more with visual guides and algorithm practice.",
  keywords: ["rubik's cube", "speedsolving", "CFOP", "OLL", "PLL", "algorithms", "cubing", "tutorial", "learn"],
  authors: [{ name: "Cube Tutor" }],
  creator: "Cube Tutor",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cubetutor.com",
    title: "Cube Tutor - Learn Rubik's Cube Algorithms",
    description: "Interactive platform for learning Rubik's cube solving methods and speedsolving algorithms",
    siteName: "Cube Tutor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cube Tutor - Learn Rubik's Cube Algorithms",
    description: "Interactive platform for learning Rubik's cube solving methods and speedsolving algorithms",
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
