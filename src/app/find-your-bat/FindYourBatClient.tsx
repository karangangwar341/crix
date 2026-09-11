"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

interface Answers {
  style?: "Power" | "Control" | "All-round";
  sweetSpot?: "Low" | "Mid" | "High";
  pickup?: "Light" | "Balanced" | "Powerful";
  weight?: "2.7-2.9" | "2.10-2.12" | "3.0+";
  experience?: "Beginner" | "Club" | "Professional";
}

const QUESTIONS: {
  key: keyof Answers;
  question: string;
  options: string[];
}[] = [
  { key: "style", question: "What's your playing style?", options: ["Power", "Control", "All-round"] },
  { key: "sweetSpot", question: "Preferred sweet spot?", options: ["Low", "Mid", "High"] },
  { key: "pickup", question: "Preferred pickup?", options: ["Light", "Balanced", "Powerful"] },
  { key: "weight", question: "Preferred weight?", options: ["2.7-2.9", "2.10-2.12", "3.0+"] },
  { key: "experience", question: "Your experience level?", options: ["Beginner", "Club", "Professional"] },
];

function scoreBat(b: Product, answers: Answers) {
  const s = b.specifications;
  if (!s) return 0;
  let score = 0;
  if (answers.style && s.playingStyle.includes(answers.style)) score += 3;
  if (answers.sweetSpot && s.sweetSpot === answers.sweetSpot) score += 3;
  if (answers.pickup && s.pickup === answers.pickup) score += 3;
  if (answers.experience && s.experience.includes(answers.experience)) score += 2;
  if (answers.weight) {
    const mid = (s.weightMinOz + s.weightMaxOz) / 2;
    if (answers.weight === "2.7-2.9" && mid < 44) score += 2;
    if (answers.weight === "2.10-2.12" && mid >= 44 && mid < 46) score += 2;
    if (answers.weight === "3.0+" && mid >= 46) score += 2;
  }
  return score;
}

export default function FindYourBatClient({ bats }: { bats: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    return [...bats].sort((a, b) => scoreBat(b, answers) - scoreBat(a, answers)).slice(0, 3);
  }, [bats, answers]);

  function select(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 250);
    } else {
      setTimeout(() => setDone(true), 300);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  const currentQ = QUESTIONS[step];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-10">
      <Reveal className="mb-12 text-center">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.2em] text-ink-faint">
          Bat Finder
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">Engineered for your game.</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Answer 5 quick questions to match your batting technique to the right blade geometry.
        </p>
      </Reveal>

      {!done ? (
        <div className="rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-[var(--shadow-card)]">
          <div className="mb-8 flex items-center justify-between text-xs text-ink-faint">
            <span>
              Question {step + 1} of {QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= step ? "w-6 bg-ink" : "w-2 bg-line-soft"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl">{currentQ.question}</h2>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {currentQ.options.map((opt) => {
                  const selected = answers[currentQ.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => select(currentQ.key, opt)}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? "border-ink bg-ink text-bg font-semibold shadow-sm"
                          : "border-line bg-bg hover:border-ink hover:bg-white text-ink"
                      }`}
                    >
                      <p className="text-base">{opt}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="mt-8 flex justify-between border-t border-line-soft pt-6 text-xs">
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-ink-faint hover:text-ink underline"
              >
                ← Previous question
              </button>
              <button onClick={reset} className="text-ink-faint hover:text-ink">
                Start over
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-faint">Top Recommendations</p>
              <h2 className="font-display text-2xl">Crafted to your profile.</h2>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink underline"
            >
              <RotateCcw size={13} /> Retake Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {results.map((b) => (
              <ProductCard key={b.id} product={b} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/bats"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-wider text-bg hover:opacity-90"
            >
              <span>Explore All Bats</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
