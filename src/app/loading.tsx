export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1600px] flex-col items-center justify-center px-5 py-24">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
        <span className="sr-only">Loading equipment catalog...</span>
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        CRIX · Handcrafted Cricket
      </p>
    </div>
  );
}
