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
      className="h-10 w-10"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon style={{ width: '20px', height: '20px' }} />
      ) : (
        <Sun style={{ width: '20px', height: '20px' }} />
      )}
    </Button>
  );
}
