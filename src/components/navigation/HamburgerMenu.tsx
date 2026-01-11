"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";

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

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * HamburgerMenu component - Hamburger icon button
 */
export function HamburgerMenu({ isOpen, onToggle }: HamburgerMenuProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12 hover:bg-neutral-700"
      style={{ color: '#ededed' }}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      onClick={onToggle}
    >
      <Menu className="h-10 w-10" />
    </Button>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar component - Navigation sidebar panel
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-[66px] bottom-0 z-40 w-[280px] sm:w-[320px] border-r border-neutral-800 transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundColor: '#1a1a1a', color: '#ededed' }}
    >
      <div className="h-full overflow-y-auto p-6">
        <h2 className="font-semibold text-lg mb-6">Navigation</h2>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              {item.children ? (
                <>
                  <div className="font-semibold text-sm opacity-60">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="text-sm opacity-80 hover:opacity-100 transition-opacity py-1"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="font-semibold text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
