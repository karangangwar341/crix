"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const stages = [
  { n: "01", title: "Willow Selection", body: "Only the straightest-grained English willow clefts, hand-selected at source, make it into our workshop." },
  { n: "02", title: "Grading", body: "Each cleft is graded on grain count, colour and blemish, from Grade 1 through Grade 3." },
  { n: "03", title: "Pressing", body: "Willow is pressed under precise, controlled tension to build compression without cracking the grain." },
  { n: "04", title: "Shaping", body: "Master craftsmen shape the blade profile, edges and spine by hand against a fixed template." },
  { n: "05", title: "Sanding", body: "Progressive grits bring the blade to a flawless surface, ready for the willow's natural finish." },
  { n: "06", title: "Finishing", body: "A protective anti-scuff sheet and edge binding are applied before the sticker is set." },
  { n: "07", title: "Quality Control", body: "Every bat is weighed, balance-tested and inspected before it earns the CRIX mark." },
];

export default function Craftsmanship() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(stages.length - 1) * 100}%`]);

  return (
    <section ref={ref} className="relative bg-deep text-deep-fg" style={{ height: `${stages.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Image
          src="/images/stumps-silhouette.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep via-deep/85 to-deep" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 lg:px-10">
          <Reveal>
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold-soft">From Willow to Willow</p>
            <h2 className="font-display text-4xl sm:text-5xl">Built from the grain up.</h2>
          </Reveal>
        </div>

        <motion.div style={{ x }} className="relative z-10 mt-12 flex">
          {stages.map((s) => (
            <div key={s.n} className="flex w-screen flex-shrink-0 items-center justify-center px-8">
              <div className="max-w-lg text-center">
                <span className="font-display text-8xl text-gold-soft/40">{s.n}</span>
                <h3 className="mt-4 font-display text-3xl">{s.title}</h3>
                <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-deep-fg/70">{s.body}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[1600px] gap-2 px-5 lg:px-10">
          {stages.map((s) => (
            <div key={s.n} className="h-[2px] flex-1 bg-deep-fg/20" />
          ))}
        </div>
      </div>
    </section>
  );
}
