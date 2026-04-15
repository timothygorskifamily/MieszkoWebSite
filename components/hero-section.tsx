"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Cpu, Music4, Sparkles } from "lucide-react";
import Image from "next/image";
import { heroPhoto, featuredPhotos } from "@/data/gallery-manifest";
import { tributeContent } from "@/data/tribute-content";

const chapterCards = [
  {
    icon: Music4,
    title: "Music first",
    copy: "Composition, teaching, and orchestral life formed the earliest chapter of his work.",
  },
  {
    icon: Cpu,
    title: "Reinvented through code",
    copy: "He translated discipline and intelligence into a second life in programming.",
  },
  {
    icon: Sparkles,
    title: "Returned to creation",
    copy: "Now retirement opens space again for writing music with lived depth and freedom.",
  },
];

const heroSupportingPhotos = featuredPhotos.slice(1, 3);

type HeroSectionProps = {
  id: string;
};

export function HeroSection({ id }: HeroSectionProps) {
  return (
    <section id={id} className="section-anchor relative isolate overflow-hidden px-4 pb-24 pt-28 sm:pb-32 sm:pt-36">
      <div className="ambient-orb left-[4%] top-24 h-64 w-64 opacity-70" />
      <div className="ambient-orb right-[8%] top-32 h-72 w-72 opacity-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_48%)]" />
      <div className="absolute inset-x-0 top-20 -z-10 h-[30rem] bg-[repeating-linear-gradient(180deg,transparent_0,transparent_35px,rgba(113,83,61,0.07)_35px,rgba(113,83,61,0.07)_36px)] opacity-60" />

      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="font-display text-5xl leading-[0.95] tracking-[-0.03em] text-[color:var(--foreground)] sm:text-6xl lg:text-8xl"
          >
            {tributeContent.site.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl"
          >
            {tributeContent.site.heroSubheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href={tributeContent.site.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[#fffaf4] shadow-ambient hover:-translate-y-0.5 hover:opacity-90"
            >
              {tributeContent.site.primaryCta.label}
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href={tributeContent.site.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] hover:-translate-y-0.5 hover:bg-[color:var(--surface-strong)]"
            >
              {tributeContent.site.secondaryCta.label}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <span className="text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {tributeContent.site.storyIntro}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            {tributeContent.site.heroHighlights.map((highlight) => (
              <div
                key={highlight}
                className="glass rounded-[22px] px-4 py-4 text-sm font-medium text-[color:var(--foreground)]"
              >
                {highlight}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18 }}
          className="glass relative overflow-hidden rounded-[34px] p-4 sm:p-5"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/10">
            <div className="relative aspect-[4/5] sm:aspect-[5/6]">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-stone-50 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-200/80">Featured portrait</p>
              <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{heroPhoto.caption}</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-stone-200/90">{heroPhoto.note}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {heroSupportingPhotos.map((photo, index) => (
              <motion.div
                key={photo.originalName}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 + index * 0.12 }}
                className="relative overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-strong)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-stone-50">
                  <p className="font-semibold">{photo.caption}</p>
                  <p className="mt-1 text-xs leading-6 text-stone-200/85">{photo.note}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              A remarkable life in chapters
            </p>

            <div className="mt-5 space-y-4">
              {chapterCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.24 + index * 0.12 }}
                    className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{card.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{card.copy}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
