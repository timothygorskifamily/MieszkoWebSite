"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { archivePhotos, archiveVideos, featuredPhotos } from "@/data/gallery-manifest";

const featuredLayout = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-6",
  "md:col-span-6",
];

type GallerySectionProps = {
  id: string;
};

function getMediaKey(item: { type: "photo" | "video"; originalName: string }) {
  return `${item.type}:${item.originalName}`;
}

export function GallerySection({ id }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasVideos = archiveVideos.some(() => true);

  const wallMedia = useMemo(() => {
    const arranged: Array<(typeof archivePhotos)[number] | (typeof archiveVideos)[number]> = [];
    const interval = Math.max(1, Math.ceil(archivePhotos.length / (archiveVideos.length + 1)));
    let videoIndex = 0;

    archivePhotos.forEach((photo, index) => {
      arranged.push(photo);

      if ((index + 1) % interval === 0 && videoIndex < archiveVideos.length) {
        arranged.push(archiveVideos[videoIndex]);
        videoIndex += 1;
      }
    });

    while (videoIndex < archiveVideos.length) {
      arranged.push(archiveVideos[videoIndex]);
      videoIndex += 1;
    }

    return arranged;
  }, []);

  const indexByName = useMemo(
    () => new Map(wallMedia.map((item, index) => [getMediaKey(item), index])),
    [wallMedia],
  );

  const selectedItem = useMemo(
    () => (selectedIndex === null ? null : wallMedia[selectedIndex]),
    [selectedIndex, wallMedia],
  );

  const sectionDescription =
    hasVideos
      ? "This gallery mixes photos and family videos together so every memory appears in one archive wall."
      : "This gallery highlights a few standout portraits first, then opens into a broader wall of family photographs.";

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? current : (current + 1) % wallMedia.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? current : (current - 1 + wallMedia.length) % wallMedia.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, wallMedia]);

  return (
    <section id={id} className="section-anchor px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Photo & video gallery"
          title="A living family archive around Mieszko's story."
          description={sectionDescription}
          align="center"
        />

        <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-12 md:auto-rows-[180px]">
          {featuredPhotos.slice(0, 5).map((item, index) => (
            <motion.button
              key={item.originalName}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              onClick={() => setSelectedIndex(indexByName.get(getMediaKey(item)) ?? null)}
              className={`group relative overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-ambient ${featuredLayout[index]}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left text-stone-50">
                <p className="text-lg font-semibold">{item.caption}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-200/90">{item.note}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Full gallery wall</p>
            <h3 className="mt-3 font-display text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
              Nearly the complete family archive, all in one place.
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--muted)]">
            This masonry wall now pulls from the synced media folders so adding more memories stays straightforward.
          </p>
        </div>

        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {wallMedia.map((item, index) => (
            <motion.button
              key={getMediaKey(item)}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.45, delay: index * 0.01 }}
              onClick={() => setSelectedIndex(index)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] text-left shadow-ambient"
            >
              <div className="relative w-full" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                {item.type === "photo" ? (
                  <>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                  </>
                ) : (
                  <>
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                    <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                      Video
                    </div>
                    <div className="absolute right-4 top-4 inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
                      {item.durationLabel}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white shadow-lg backdrop-blur-md">
                        <PlayCircle className="h-8 w-8" />
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4">
                {item.type === "photo" ? (
                  <p className="font-semibold text-[color:var(--foreground)]">{item.caption}</p>
                ) : null}
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{item.note}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-black/78 px-4 py-8 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-6xl justify-end">
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mx-auto mt-4 grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-black/20"
                style={{ aspectRatio: `${selectedItem.width} / ${selectedItem.height}` }}
              >
                {selectedItem.type === "photo" ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={selectedItem.src}
                      alt={selectedItem.alt}
                      fill
                      sizes="(max-width: 1200px) 100vw, 70vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <video controls playsInline preload="metadata" className="h-full w-full bg-black object-contain">
                    <source src={selectedItem.src} type={selectedItem.mimeType} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.35 }}
                className="rounded-[32px] border border-white/10 bg-white/10 p-6 text-stone-50 backdrop-blur-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-200/80">
                  Archive {selectedItem.type}
                </p>
                {selectedItem.type === "photo" ? (
                  <h3 className="mt-4 font-display text-4xl leading-tight">{selectedItem.caption}</h3>
                ) : null}
                <p className={`${selectedItem.type === "photo" ? "mt-4" : "mt-3"} text-sm leading-7 text-stone-200/85`}>
                  {selectedItem.note}
                </p>
                {selectedItem.type === "video" ? (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone-300/70">Archive video</p>
                    <p className="mt-1.5 text-sm leading-7 text-stone-200/85">
                      Duration: {selectedItem.durationLabel}
                    </p>
                  </>
                ) : null}
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-stone-300/70">{selectedItem.originalName}</p>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((current) =>
                        current === null ? current : (current - 1 + wallMedia.length) % wallMedia.length,
                      )
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 hover:bg-white/15"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((current) =>
                        current === null ? current : (current + 1) % wallMedia.length,
                      )
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 hover:bg-white/15"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
