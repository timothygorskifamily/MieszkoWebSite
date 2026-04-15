"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { tributeContent } from "@/data/tribute-content";

type TimelineSectionProps = {
  id: string;
};

export function TimelineSection({ id }: TimelineSectionProps) {
  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Life journey"
          title="A path marked by music, migration, work, and return."
          description="The timeline below is ready for real dates, cities, institutions, and milestones whenever you want to personalize it further."
          align="center"
        />

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[linear-gradient(180deg,rgba(148,99,72,0),rgba(148,99,72,0.55),rgba(148,99,72,0))] md:left-1/2 md:-translate-x-1/2" />

          <ul className="space-y-8">
            {tributeContent.timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.li
                  key={`${item.period}-${item.title}`}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                  className="relative md:grid md:grid-cols-2 md:gap-12"
                >
                  <span className="absolute left-[3px] top-8 h-4 w-4 rounded-full border border-[color:var(--accent)] bg-[color:var(--surface-strong)] md:left-1/2 md:-translate-x-1/2" />

                  {isEven ? (
                    <>
                      <div className="pl-10 md:pl-0 md:pr-12">
                        <div className="timeline-card p-6 md:text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                            {item.chapter}
                          </p>
                          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            {item.period}
                          </p>
                          <h3 className="mt-4 font-display text-3xl leading-tight text-[color:var(--foreground)]">
                            {item.title}
                          </h3>
                          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">{item.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="pl-10 md:pl-12">
                        <div className="timeline-card p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                            {item.chapter}
                          </p>
                          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            {item.period}
                          </p>
                          <h3 className="mt-4 font-display text-3xl leading-tight text-[color:var(--foreground)]">
                            {item.title}
                          </h3>
                          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">{item.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}