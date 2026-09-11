import { MagneticButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export default function FindYourBatTeaser() {
  return (
    <section className="border-y border-line bg-deep text-deep-fg">
      <div className="mx-auto max-w-[1600px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold-soft">Find Your Bat</p>
          <h2 className="font-display text-4xl sm:text-6xl">Not sure where to start?</h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-deep-fg/70">
            Answer five questions about your game and we&rsquo;ll match you with the bat built for it — playing
            style, sweet spot, pickup, weight and experience.
          </p>
          <div className="mt-8">
            <MagneticButton href="/find-your-bat" variant="primary" withArrow>
              Start the Quiz
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
