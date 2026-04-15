"use client";

import { motion } from "framer-motion";
import { Braces, Globe2, GraduationCap, Heart, Music4, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { tributeContent } from "@/data/tribute-content";

const iconMap: Record<string, LucideIcon> = {
  artist: Music4,
  teacher: GraduationCap,
  builder: Globe2,
  programmer: Braces,
  father: Heart,
};

type ValuesSectionProps = {
  id: string;
};

export function ValuesSection({ id }: ValuesSectionProps) {
  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Composer, Programmer, Father"
          title="Different roles, one character."
          description="This section gives shape to the qualities that connect every chapter of his life: artistry, discipline, courage, intelligence, and devotion to family."
          align="center"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {tributeContent.values.map((value, index) => {
            const Icon = iconMap[value.icon];

            return (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="glass rounded-[28px] p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-3xl leading-tight text-[color:var(--foreground)]">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{value.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}