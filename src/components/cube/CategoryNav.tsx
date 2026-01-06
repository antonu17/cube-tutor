"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface CategoryNavProps {
  categories: Record<
    string,
    {
      name: string;
      description: string;
      cases: any[];
    }
  >;
}

/**
 * CategoryNav component for quick navigation between categories
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const categoryEntries = Object.entries(categories);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCategory = (categoryKey: string) => {
    const element = document.getElementById(`category-${categoryKey}`);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Navigation bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="p-3">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Jump to:
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {categoryEntries.map(([key, category]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => scrollToCategory(key)}
                className="text-xs h-8 px-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
