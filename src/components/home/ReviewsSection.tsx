import { Star } from "lucide-react";
import { generateReviews } from "@/lib/data/reviews";
import { Reveal } from "@/components/ui/Reveal";

export default function ReviewsSection() {
  const reviews = generateReviews("bat-pro-elite-x", 4, 4.8);

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
      <Reveal className="mb-12 text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Reviews</p>
        <h2 className="font-display text-4xl sm:text-5xl">What players say.</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.06} className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={13} fill={s < r.rating ? "#050505" : "none"} color="#050505" />
              ))}
            </div>
            <p className="mt-3 font-medium">{r.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            <p className="mt-4 text-xs text-ink-faint">
              {r.author} {r.verified && "· Verified Purchase"}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
