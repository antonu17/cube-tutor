'use client';

import { useEffect } from 'react';
import { Container } from '@/src/components/layout';
import { Button } from '@/src/components/ui/button';

/**
 * Error boundary for the application
 * This catches errors in client components and shows a fallback UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
    // In production, you would log to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <Container className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground text-lg">
              We encountered an unexpected error while processing your request.
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="rounded-md bg-destructive/10 p-4 text-left">
              <p className="text-sm font-mono text-destructive break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="outline">
              Go home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
