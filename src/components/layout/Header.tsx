"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Container } from "./Container";

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(
  () => import("@/src/components/theme").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

/**
 * Header component with site branding and navigation
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Cube Tutor</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/puzzles"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Puzzles
              </Link>
              <Link
                href="/about"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                About
              </Link>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
