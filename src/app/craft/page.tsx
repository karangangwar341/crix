import Image from "next/image";
import Craftsmanship from "@/components/home/Craftsmanship";
import Players from "@/components/home/Players";
import { Reveal, RevealWords } from "@/components/ui/Reveal";

const sections = [
  { title: "Willow Selection", body: "We work directly with growers in the Bowthorpe Valley, selecting only clefts with straight, even grain and minimal blemish." },
  { title: "Manufacturing", body: "Every blade passes through the same seven-stage process our founders established — pressing, shaping, sanding and finishing, entirely by hand." },
  { title: "Hand Crafting", body: "Our craftsmen average over a decade at the bench. Each bat carries the mark of the person who shaped it." },
  { title: "Quality Control", body: "Weight, balance and pickup are measured against tolerance on every single bat before it leaves the workshop." },
  { title: "Technology", body: "Precision templating and digital weight logging support — never replace — the craftsman's hand." },
  { title: "Performance Testing", body: "Prototype profiles are tested in the nets with our professional players before entering production." },
];

export default function CraftPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ball-grass.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-bg/88" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-10">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Our Story</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
            <RevealWords text="Precision meets performance." />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            CRIX was founded on a simple belief: that a cricket bat is a precision instrument, not a commodity. Every
            blade we press carries the same standard our founders set at the bench three decades ago.
          </p>
        </div>
      </section>

      <Craftsmanship />

      <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          {sections.map((s) => (
            <Reveal key={s.title}>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div id="technology" />
      <Players />
    </div>
  );
}
