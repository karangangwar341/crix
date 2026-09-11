import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const posts = [
  { title: "Reading the grain: what grain count actually tells you", tag: "Craft", image: "/images/bats-on-grass.jpg" },
  { title: "Inside our quality control room", tag: "Manufacturing", image: "/images/stumps-silhouette.jpg" },
  { title: "How to knock in a new bat, properly", tag: "Guide", image: "/images/ball-grass.jpg" },
];

export default function Journal() {
  return (
    <section className="border-t border-line bg-bg-alt">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10">
        <Reveal className="mb-10">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">Journal</p>
          <h2 className="font-display text-4xl sm:text-5xl">From the workshop.</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <Link href="/craft" className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-surface">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-gold">{p.tag}</p>
                <p className="mt-1 flex items-center gap-1 font-display text-xl leading-snug">
                  {p.title}
                  <ArrowUpRight size={15} className="mt-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
