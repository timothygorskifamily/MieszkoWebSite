"use client";

import { motion } from "framer-motion";
import { Code2, GraduationCap, Music4, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { tributeContent } from "@/data/tribute-content";

const focusCards = [
  {
    icon: Music4,
    label: "Artistry",
    copy: "Composition came first, shaping the way he understood structure, feeling, and form.",
  },
  {
    icon: GraduationCap,
    label: "Teaching",
    copy: "He brought rigor and generosity to students, rehearsal rooms, and musical leadership.",
  },
  {
    icon: Code2,
    label: "Programming",
    copy: "He rebuilt his career through software, translating creative discipline into technical excellence.",
  },
  {
    icon: RefreshCw,
    label: "Return",
    copy: "Retirement did not close the story. It reopened the artistic voice that had always remained alive.",
  },
];

type BiographySectionProps = {
  id: string;
};

export function BiographySection({ id }: BiographySectionProps) {
  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            eyebrow={tributeContent.biography.eyebrow}
            title={tributeContent.biography.title}
            description={tributeContent.biography.intro}
          />

          <div className="mt-8 space-y-6 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            {tributeContent.biography.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="space-y-6"
        >
          <div className="glass rounded-[30px] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              A life in two languages
            </p>
            <p className="mt-5 font-display text-3xl leading-tight text-[color:var(--foreground)] sm:text-[2.2rem]">
              "{tributeContent.biography.quote}"
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {focusCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="glass rounded-[24px] p-5"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{card.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{card.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}