import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  className?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title,
  message,
  type = "error",
  className,
  onRetry,
}: ErrorMessageProps) {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  const styles = {
    error: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        styles[type],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          {title && (
            <h3 className="font-semibold text-sm">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
