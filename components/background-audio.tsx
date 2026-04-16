"use client";

import { ChevronDown, ChevronUp, Moon, Pause, Play, SkipBack, SkipForward, Sun, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { backgroundTrack, musicLibrary } from "@/data/music-manifest";
import { ThemeMode } from "@/lib/tribute-theme";

function parseTrackDuration(value: string) {
  const parts = value.split(":").map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return 0;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}

function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const getResolvedThemeModeFromDom = (): ThemeMode => {
  const resolvedMode = document.documentElement.getAttribute("data-tribute-resolved-mode");
  if (resolvedMode === "night") {
    return "night";
  }

  if (resolvedMode === "day") {
    return "day";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
};

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundTrackIndex = musicLibrary.findIndex((track) => track.fileName === backgroundTrack.fileName);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [resolvedThemeMode, setResolvedThemeMode] = useState<ThemeMode>("day");
  const [volume, setVolume] = useState(0.18);
  const [muted, setMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(backgroundTrackIndex >= 0 ? backgroundTrackIndex : 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(parseTrackDuration(backgroundTrack.duration));
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const isMusicRoute = normalizedPathname === "/music";
  const currentTrack = musicLibrary[currentTrackIndex] ?? backgroundTrack;
  const isMuted = muted || volume === 0;

  useEffect(() => {
    const resolveTheme = () => setResolvedThemeMode(getResolvedThemeModeFromDom());
    resolveTheme();

    const observer = new MutationObserver(resolveTheme);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-tribute-resolved-mode", "data-tribute-mode"],
    });

    mediaQuery.addEventListener("change", resolveTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", resolveTheme);
    };
  }, []);

  useEffect(() => {
    setCurrentTime(0);
    setDurationSeconds(parseTrackDuration(currentTrack.duration));
  }, [currentTrack.duration, currentTrack.fileName]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const syncCurrentTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const syncDuration = () => {
      const nextDuration =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : parseTrackDuration(currentTrack.duration);
      setDurationSeconds(nextDuration);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStarted(true);
    };

    syncCurrentTime();
    syncDuration();

    audio.addEventListener("timeupdate", syncCurrentTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("timeupdate", syncCurrentTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [currentTrack.duration]);

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

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const skipTrack = (offset: number) => {
    if (musicLibrary.length <= 1) {
      return;
    }

    setCurrentTrackIndex((current) => {
      const next = current + offset;
      if (next < 0) {
        return musicLibrary.length - 1;
      }

      if (next >= musicLibrary.length) {
        return 0;
      }

      return next;
    });
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.src} preload="auto" autoPlay />

      <div
        className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[75] border border-[color:var(--line)] bg-[color:var(--surface-strong)] shadow-[0_18px_60px_-32px_rgba(0,0,0,0.5)] transition-all duration-200 sm:inset-x-auto sm:right-4 ${
          isMinimized
            ? "rounded-[18px] px-3.5 py-2.5 sm:w-[min(92vw,20.5rem)]"
            : "rounded-[24px] p-3 sm:w-[min(92vw,34rem)] sm:p-4"
        }`}
      >
        {isMinimized ? (
          <div className="flex items-stretch gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-[#fffaf4] shadow-lg shadow-black/10 transition-transform hover:scale-105"
              aria-label={isPlaying ? "Pause background music" : "Play background music"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground)]/80">
                {resolvedThemeMode === "night" ? (
                  <Moon className="h-3.5 w-3.5 text-[color:var(--foreground)]/80" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-[color:var(--foreground)]/80" />
                )}
                <span>Background music</span>
              </div>
              <p
                className="truncate font-display text-[1rem] leading-tight text-[color:var(--foreground)]"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 text-[0.66rem] text-[color:var(--foreground)]/75">
                <span>{formatPlaybackTime(currentTime)}</span>
                <span>{formatPlaybackTime(durationSeconds)}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface)] p-1.5">
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition-transform hover:scale-105"
                aria-label="Expand background music player"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground)]/80">
                  {resolvedThemeMode === "night" ? (
                    <Moon className="h-3.5 w-3.5 text-[color:var(--foreground)]/80" />
                  ) : (
                    <Sun className="h-3.5 w-3.5 text-[color:var(--foreground)]/80" />
                  )}
                  <p>Music tab</p>
                </div>
                <p className="truncate pr-1 font-display text-xl leading-tight text-[color:var(--foreground)] sm:text-2xl">
                  {currentTrack.title}
                </p>
                <p className="mt-1.5 text-[0.68rem] text-[color:var(--foreground)]/70">
                  {hasStarted
                    ? `Track ${currentTrackIndex + 1} of ${musicLibrary.length} in rotation`
                    : "Press play to start. Position is kept while you navigate."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition-transform hover:scale-105"
                aria-label="Minimize background music player"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface)] p-2 sm:p-3">
                <div className="mb-2 flex items-center justify-between text-[0.68rem] text-[color:var(--foreground)]/75">
                  <span>{formatPlaybackTime(currentTime)}</span>
                  <span>{formatPlaybackTime(durationSeconds)}</span>
                </div>
                <p className="text-center text-[0.57rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]/75">
                  Track {currentTrackIndex + 1} of {musicLibrary.length}
                </p>
                <div className="mt-2 px-1">
                  <input
                    type="range"
                    min="0"
                    max={durationSeconds > 0 ? durationSeconds : 1}
                    step="0.1"
                    value={Math.min(currentTime, durationSeconds > 0 ? durationSeconds : 1)}
                    onChange={(event) => handleProgressChange(Number(event.target.value))}
                    aria-label="Background music progress"
                    className="h-2 w-full cursor-pointer accent-[color:var(--accent)]"
                  />
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => skipTrack(-1)}
                    disabled={musicLibrary.length <= 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)] disabled:opacity-40"
                    aria-label="Previous track"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--accent)] text-[#fffaf4] shadow-lg shadow-black/10 transition-transform hover:scale-105"
                    aria-label={isPlaying ? "Pause background music" : "Play background music"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => skipTrack(1)}
                    disabled={musicLibrary.length <= 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)] disabled:opacity-40"
                    aria-label="Next track"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
                <Link
                  href="/music"
                  className="mt-2 block text-center text-[0.68rem] font-semibold text-[color:var(--accent)] hover:opacity-80"
                >
                  Open music library
                </Link>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-3 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface)] p-2">
                <p className="text-[0.57rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]/75">
                  Audio
                </p>
                <div className="flex w-full flex-col items-center border-t border-[color:var(--line)] pt-2">
                  <button
                    type="button"
                    onClick={() => setMuted((current) => !current)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--foreground)]"
                    aria-label={isMuted ? "Unmute background music" : "Mute background music"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <div className="relative mt-2 h-16 w-6">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={muted ? 0 : volume}
                      onChange={(event) => {
                        const nextVolume = Number(event.target.value);
                        setVolume(nextVolume);
                        setMuted(nextVolume === 0);
                      }}
                      aria-label="Background music volume"
                      className="absolute left-1/2 top-1/2 h-6 w-16 -translate-x-1/2 -translate-y-1/2 -rotate-90 accent-[color:var(--accent)]"
                      style={{ width: "4rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
