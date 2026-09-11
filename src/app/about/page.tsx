import { MagneticButton } from "@/components/ui/Button";
import { Reveal, RevealWords } from "@/components/ui/Reveal";

const stats = [
  { value: "30+", label: "Years of Craft" },
  { value: "12", label: "Master Craftsmen" },
  { value: "40+", label: "Professional Players" },
  { value: "100%", label: "Hand-Finished" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-10">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">About CRIX</p>
        <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
          <RevealWords text="Engineered for the moment." />
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          We build cricket equipment for players who take the game seriously — from junior academies to
          international dressing rooms. No shortcuts, no compromises, no filler.
        </p>
      </section>

      <section className="border-y border-line bg-bg-alt">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-5 py-16 sm:grid-cols-4 lg:px-10">
          {stats.map((s) => (
            <Reveal key={s.label} className="text-center">
              <p className="font-display text-4xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-faint">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Want to see how it&rsquo;s made?</h2>
          <div className="mt-6 flex justify-center gap-4">
            <MagneticButton href="/craft" withArrow>
              Discover the Craft
            </MagneticButton>
            <MagneticButton href="/business" variant="secondary">
              Business Enquiries
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
