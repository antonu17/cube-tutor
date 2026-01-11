"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

interface MenuItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Learn",
    href: "#",
    children: [
      { label: "Algorithms", href: "/learn/algorithms" },
    ],
  },
  {
    label: "Practice",
    href: "#",
    children: [
      { label: "Trainer", href: "/practice/trainer" },
      { label: "Timer", href: "/practice/timer" },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
];

/**
 * HamburgerMenu component - Side navigation panel
 */
export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              {item.children ? (
                <>
                  <div className="font-semibold text-sm text-foreground/60">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="text-sm text-foreground/80 hover:text-foreground transition-colors py-1"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="font-semibold text-sm text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
