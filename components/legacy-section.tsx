"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { tributeContent } from "@/data/tribute-content";

type LegacySectionProps = {
  id: string;
};

export function LegacySection({ id }: LegacySectionProps) {
  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_40%),var(--surface)] px-6 py-10 shadow-ambient backdrop-blur-xl sm:px-8 lg:px-12 lg:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <SectionHeading
            eyebrow="Legacy"
            title={tributeContent.legacy.title}
            description={tributeContent.legacy.reflection}
          />

          <div className="space-y-6">
            <div className="glass-strong rounded-[30px] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">From family</p>
              <p className="mt-4 text-base leading-8 text-[color:var(--foreground)] sm:text-lg">
                {tributeContent.legacy.familyMessage}
              </p>
            </div>

            <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--accent)] px-6 py-8 text-[#fffaf4] shadow-ambient sm:px-8">
              <p className="font-display text-3xl leading-tight sm:text-4xl">"{tributeContent.legacy.quote}"</p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#f6e7d4]">
                {tributeContent.legacy.attribution}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}