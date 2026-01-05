"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Check, Copy } from "lucide-react";

interface AlgorithmNotationProps {
  notation: string;
  className?: string;
}

/**
 * AlgorithmNotation component for displaying algorithm notation with copy functionality
 */
export function AlgorithmNotation({ notation, className }: AlgorithmNotationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-muted px-4 py-3 font-mono text-sm">
          {notation}
        </code>
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
