"use client";

import { motion } from "framer-motion";
import { ArrowRight, Disc3, Volume2 } from "lucide-react";
import Link from "next/link";
import { backgroundTrack, featuredTrack, musicLibrary, musicSummary } from "@/data/music-manifest";
import { SectionHeading } from "@/components/section-heading";
import { tributeContent } from "@/data/tribute-content";

const previewTracks = musicLibrary.slice(0, 4);

type MusicSectionProps = {
  id: string;
};

export function MusicSection({ id }: MusicSectionProps) {
  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-[rgba(242,224,206,0.1)] bg-[linear-gradient(145deg,rgba(27,22,21,0.96),rgba(58,41,32,0.98))] px-6 py-10 text-stone-50 shadow-[0_32px_120px_-52px_rgba(24,15,11,0.85)] sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionHeading
            eyebrow={tributeContent.music.eyebrow}
            title="His music now has a dedicated listening room."
            description="These tracks are drawn directly from Mieszko Gorski's real music folder. The homepage offers a preview; the full library lives on a dedicated page designed for listening."
            tone="light"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-300/75">Background soundtrack</p>
            <p className="mt-4 font-display text-3xl leading-tight text-stone-50 sm:text-[2.2rem]">
              {backgroundTrack.title}
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-300/85">{backgroundTrack.description}</p>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] p-3">
              <audio controls preload="none" className="w-full opacity-90">
                <source src={backgroundTrack.src} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300/70">Featured composition</p>
                <h3 className="mt-3 font-display text-4xl leading-tight text-stone-50">{featuredTrack.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-stone-200/75">
                {featuredTrack.duration}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-stone-300/88">{featuredTrack.description}</p>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300/70">Inspiration</p>
              <p className="mt-3 text-sm leading-7 text-stone-200/88">{featuredTrack.inspiration}</p>
            </div>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] p-3">
              <audio controls preload="none" className="w-full opacity-90">
                <source src={featuredTrack.src} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </motion.article>

          <div className="grid gap-4 sm:grid-cols-2">
            {previewTracks.map((track, index) => (
              <motion.article
                key={track.fileName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-stone-100">
                    {track.background ? <Volume2 className="h-5 w-5" /> : <Disc3 className="h-5 w-5" />}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300/70">{track.duration}</span>
                </div>
                <h4 className="mt-4 font-display text-3xl leading-tight text-stone-50">{track.title}</h4>
                <p className="mt-3 text-sm leading-7 text-stone-300/88">{track.description}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-stone-300/88">
            {musicSummary.totalTracks} tracks are now synced from the real `Music` folder and available on the site.
          </p>
          <Link
            href="/music"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[#fffaf4] hover:-translate-y-0.5 hover:opacity-90"
          >
            Open the full music page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}