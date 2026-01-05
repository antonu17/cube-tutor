'use client';

import { useEffect } from 'react';

/**
 * Global error boundary that catches errors in the root layout
 * This is a last-resort error handler
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: '500px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Application Error
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '2rem' }}>
              Something went wrong with the application. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && error.message && (
              <div style={{
                background: '#fee',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem',
                textAlign: 'left',
              }}>
                <code style={{ fontSize: '0.875rem', color: '#c00' }}>
                  {error.message}
                </code>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #ddd',
                  background: '#fff',
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
