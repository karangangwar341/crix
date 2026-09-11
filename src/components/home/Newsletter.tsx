"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Newsletter</p>
        <h2 className="font-display text-3xl sm:text-4xl">Precision meets performance.</h2>
        <p className="mt-3 text-sm text-ink-soft">New releases, workshop stories and early access — no noise.</p>
        {submitted ? (
          <p className="mt-6 text-sm font-medium">You&rsquo;re on the list. Welcome to CRIX.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mx-auto mt-6 flex max-w-sm gap-2"
          >
            <input
              required
              type="email"
              placeholder="Email address"
              className="flex-1 border border-line bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
            />
            <button className="bg-ink px-5 py-3 text-[12px] font-medium uppercase tracking-[0.06em] text-bg">
              Join
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
