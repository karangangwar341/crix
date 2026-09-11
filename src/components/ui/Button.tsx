"use client";

import { ButtonHTMLAttributes, ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-ink/90 border border-ink",
  secondary: "bg-transparent text-ink border border-ink/70 hover:border-ink",
  ghost: "bg-transparent text-ink border border-transparent hover:border-ink/30",
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  withArrow = false,
  className,
  href,
  ...rest
}: CommonProps & { href?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
  }
  function onMouseLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  }

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)" }}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300",
        variants[variant],
        className
      )}
    >
      {children}
      {withArrow && (
        <ArrowUpRight
          size={15}
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }
  return (
    <button {...rest} className="inline-block">
      {content}
    </button>
  );
}
