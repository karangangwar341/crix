"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-neutral-900">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-4xl font-bold">System Maintenance</h1>
          <p className="mt-3 text-neutral-500 max-w-md text-sm">
            The storefront is experiencing a temporary service disruption. Please refresh or try again shortly.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
