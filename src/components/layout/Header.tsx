"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { HamburgerMenu } from "@/src/components/navigation";
import { CubeView3D } from "@/src/components/cube";
import { createSolvedState } from "@/src/lib/cube-engine/state";

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(
  () => import("@/src/components/theme").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: false }
);

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

/**
 * Header component with site branding and navigation
 */
export function Header({ isMenuOpen, onMenuToggle }: HeaderProps) {
  // Create a solved cube state for the logo
  const solvedState = useMemo(() => createSolvedState(), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger + Logo + Title */}
        <div className="flex items-center gap-3">
          <HamburgerMenu isOpen={isMenuOpen} onToggle={onMenuToggle} />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8">
              <CubeView3D
                state={solvedState}
                view="front"
                stickerSize={6}
                className="w-full h-full"
              />
            </div>
            <span className="font-bold text-xl">Cube Tutor</span>
          </Link>
        </div>
        
        {/* Right side: Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
