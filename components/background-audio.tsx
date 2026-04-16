"use client";

import { ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { backgroundTrack, musicLibrary } from "@/data/music-manifest";

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundTrackIndex = musicLibrary.findIndex((track) => track.fileName === backgroundTrack.fileName);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(0.18);
  const [muted, setMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(backgroundTrackIndex >= 0 ? backgroundTrackIndex : 0);
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const isMusicRoute = normalizedPathname === "/music";
  const currentTrack = musicLibrary[currentTrackIndex] ?? backgroundTrack;
  const isMuted = muted || volume === 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMusicRoute) {
      return;
    }

    let cancelled = false;

    const attemptStart = async () => {
      try {
        audio.currentTime = 0;
        audio.volume = muted ? 0 : volume;
        await audio.play();
        if (!cancelled) {
          setIsPlaying(true);
          setHasStarted(true);
        }
      } catch {
        if (!cancelled) {
          setIsPlaying(false);
        }
      }
    };

    void attemptStart();

    const unlock = () => {
      if (!audio.paused) {
        return;
      }

      void attemptStart();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [currentTrackIndex, isMusicRoute, muted, volume]);

  useEffect(() => {
    if (!isMusicRoute) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [isMusicRoute]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const advanceTrack = () => {
      const nextIndex = (currentTrackIndex + 1) % musicLibrary.length;
      setCurrentTrackIndex(nextIndex);
    };

    audio.addEventListener("ended", advanceTrack);
    return () => audio.removeEventListener("ended", advanceTrack);
  }, [currentTrackIndex]);

  useEffect(() => {
    const stopBackgroundAudio = () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };

    window.addEventListener("tribute:stop-background-audio", stopBackgroundAudio);

    return () => window.removeEventListener("tribute:stop-background-audio", stopBackgroundAudio);
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasStarted(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const volumeControlValue = isMuted ? 0 : volume;

  return (
    <>
      <audio ref={audioRef} src={currentTrack.src} preload="auto" autoPlay />

      <div
        className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[75] border border-[color:var(--line)] bg-[color:var(--surface-strong)] shadow-ambient backdrop-blur-xl sm:inset-x-auto sm:right-4 ${
          isMinimized
            ? "rounded-full px-3 py-2 sm:w-[min(92vw,18rem)]"
            : "rounded-[24px] p-3 sm:w-[min(92vw,24rem)] sm:rounded-[26px] sm:p-4"
        }`}
      >
        {isMinimized ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-[#fffaf4] hover:-translate-y-0.5"
              aria-label={isPlaying ? "Pause background music" : "Play background music"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Background music
              </p>
              <p className="truncate font-display text-lg leading-none text-[color:var(--foreground)]">{currentTrack.title}</p>
            </div>

            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:-translate-y-0.5"
              aria-label="Expand background music player"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">
                  Background music
                </p>
                <p className="mt-1.5 truncate pr-2 font-display text-xl leading-none text-[color:var(--foreground)] sm:mt-2 sm:text-2xl">
                  {currentTrack.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-[color:var(--muted)] sm:text-sm sm:leading-6">
                  {hasStarted
                    ? "Playing softly in the background and rotating through the full library."
                    : "Playback will begin automatically when your browser allows it or after your first interaction."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((current) => !current)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:-translate-y-0.5"
                  aria-label={isMuted ? "Unmute background music" : "Mute background music"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:-translate-y-0.5"
                  aria-label="Minimize background music player"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 sm:mt-4">
              <button
                type="button"
                onClick={togglePlayback}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--accent)] text-[#fffaf4] hover:-translate-y-0.5"
                aria-label={isPlaying ? "Pause background music" : "Play background music"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumeControlValue}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  setVolume(nextVolume);
                  setMuted(nextVolume === 0);
                }}
                aria-label="Background music volume"
                className="h-2 w-full cursor-pointer accent-[color:var(--accent)]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs sm:mt-4 sm:text-sm">
              <span className="text-[color:var(--muted)]">{currentTrack.duration}</span>
              <Link href="/music" className="font-semibold text-[color:var(--accent)] hover:opacity-80">
                Open music page
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

