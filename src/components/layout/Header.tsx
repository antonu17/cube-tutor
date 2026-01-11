"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Container } from "./Container";
import { HamburgerMenu } from "@/src/components/navigation";
import { CubeView3D } from "@/src/components/cube";
import { createSolvedState } from "@/src/lib/cube-engine/state";

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(
  () => import("@/src/components/theme").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

/**
 * Header component with site branding and navigation
 */
export function Header() {
  // Create a solved cube state for the logo
  const solvedState = useMemo(() => createSolvedState(), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Left side: Hamburger + Logo + Title */}
          <div className="flex items-center gap-2">
            <HamburgerMenu />
            <Link href="/" className="flex items-center gap-2">
              <CubeView3D
                state={solvedState}
                view="front"
                stickerSize={6}
                className="h-6 w-6"
              />
              <span className="font-bold text-xl">Cube Tutor</span>
            </Link>
          </div>
          
          {/* Right side: Theme Toggle */}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
