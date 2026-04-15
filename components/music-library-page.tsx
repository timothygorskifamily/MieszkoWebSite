"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, Music4 } from "lucide-react";
import Link from "next/link";
import { featuredTrack, musicLibrary } from "@/data/music-manifest";

export function MusicLibraryPage() {
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  const stopBackgroundAudio = () => {
    window.dispatchEvent(new Event("tribute:stop-background-audio"));
  };

  const registerAudio = (id: string, element: HTMLAudioElement | null) => {
    if (!element) {
      audioElements.current.delete(id);
      return;
    }
    audioElements.current.set(id, element);
  };

  const stopOtherTracks = (activeTrackId: string) => {
    audioElements.current.forEach((audio, id) => {
      if (id !== activeTrackId) {
        audio.pause();
      }
    });
  };

  return (
    <main className="min-h-screen px-4 pb-52 pt-20 sm:pb-32 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] shadow-ambient backdrop-blur-xl hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tribute
          </Link>
        </div>

        <section className="relative mt-8 overflow-hidden rounded-[32px] border border-[rgba(242,224,206,0.1)] bg-[linear-gradient(145deg,rgba(27,22,21,0.96),rgba(58,41,32,0.98))] px-5 py-8 text-stone-50 shadow-[0_32px_120px_-52px_rgba(24,15,11,0.85)] sm:mt-10 sm:rounded-[40px] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="grid gap-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.3em] text-stone-300/75">
                The music of Mieszko Gorski
              </span>
              <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[0.98] tracking-[-0.03em] sm:mt-6 sm:text-6xl lg:text-7xl">
                A return to composition, now with an entire life behind it.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300/85 sm:mt-6 sm:text-lg sm:leading-8">
                This page showcases the real recordings from the project's `Music` folder. It is designed as a dedicated listening room within the tribute site: quiet, elegant, and centered on the music he is creating now.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.article
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="glass-strong rounded-[28px] p-5 sm:rounded-[34px] sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">Featured composition</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:mt-4 sm:text-5xl">
                  {featuredTrack.title}
                </h2>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)] sm:h-14 sm:w-14">
                <Music4 className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:mt-5 sm:text-base sm:leading-8">
              {featuredTrack.description}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              {featuredTrack.inspiration}
            </p>

            <div className="mt-6 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3">
              <audio
                controls
                preload="none"
                className="w-full opacity-90"
                onPlay={() => {
                  stopBackgroundAudio();
                  stopOtherTracks("featured");
                }}
                ref={(element) => registerAudio("featured", element)}
              >
                <source src={featuredTrack.src} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="space-y-5"
          >
            <div className="glass rounded-[24px] p-5 sm:rounded-[28px] sm:p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--accent)]">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-2xl text-[color:var(--foreground)] sm:mt-5 sm:text-3xl">A quiet listening room</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                The library below is built directly from the real recordings in the repository, so adding or replacing music later stays straightforward.
              </p>
            </div>
          </motion.aside>
        </section>

        <section className="mt-12 sm:mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Full library</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {musicLibrary.map((track, index) => (
              <motion.article
                key={track.fileName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="glass rounded-[24px] p-5 sm:rounded-[28px] sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                      {track.background ? "Background track" : track.featured ? "Featured track" : "Library track"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-[color:var(--foreground)] sm:mt-3 sm:text-3xl">
                      {track.title}
                    </h3>
                  </div>
                  <span className="w-fit rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                    {track.duration}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:mt-4">{track.description}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:mt-4">{track.inspiration}</p>

                <div className="mt-5 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3">
                  <audio
                    controls
                    preload="none"
                    className="w-full opacity-90"
                    onPlay={() => {
                      stopBackgroundAudio();
                      stopOtherTracks(`library-${track.fileName}`);
                    }}
                    ref={(element) => registerAudio(`library-${track.fileName}`, element)}
                  >
                    <source src={track.src} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
