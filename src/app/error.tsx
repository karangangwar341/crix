"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-5 py-32 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
        <AlertCircle size={28} />
      </div>
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm text-ink-soft">
        We encountered an issue loading this page. Our engineering team has been notified.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-neutral-400">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg hover:opacity-90 transition-opacity"
        >
          <RotateCcw size={14} /> Try Again
        </button>
        <Link
          href="/"
          className="border border-line px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-ink hover:bg-neutral-50 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
