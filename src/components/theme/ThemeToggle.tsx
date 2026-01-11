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
        <Moon className="h-9 w-9" style={{ width: '36px', height: '36px' }} />
      ) : (
        <Sun className="h-9 w-9" style={{ width: '36px', height: '36px' }} />
      )}
    </Button>
  );
}
