"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon style={{ width: '24px', height: '24px' }} />
      ) : (
        <Sun style={{ width: '24px', height: '24px' }} />
      )}
    </Button>
  );
}
