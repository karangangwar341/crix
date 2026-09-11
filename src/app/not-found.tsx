import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-32 text-center">
      <p className="font-display text-6xl">404</p>
      <h1 className="mt-4 font-display text-2xl">This page isn&rsquo;t in our collection.</h1>
      <p className="mt-2 text-sm text-ink-soft">The page you&rsquo;re looking for may have moved or no longer exists.</p>
      <Link href="/" className="mt-8 inline-block bg-ink px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-bg">
        Back to Home
      </Link>
    </div>
  );
}
