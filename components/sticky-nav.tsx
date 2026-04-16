"use client";

import { ChevronDown, ChevronUp, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useState } from "react";
import {
  ThemeKey,
  ThemeMode,
  ThemeModeWithSystem,
  ThemeOption,
} from "@/lib/tribute-theme";

type StickyNavProps = {
  sections: { id: string; label: string }[];
  activeSection: string;
  themeOptions: ThemeOption[];
  activeTheme: ThemeKey;
  themeMode: ThemeModeWithSystem;
  resolvedMode: ThemeMode;
  mounted: boolean;
  onToggleTheme: () => void;
  onSetTheme: (theme: ThemeKey, mode: ThemeModeWithSystem) => void;
};

export function StickyNav({
  sections,
  activeSection,
  themeOptions,
  activeTheme,
  themeMode,
  resolvedMode,
  mounted,
  onToggleTheme,
  onSetTheme,
}: StickyNavProps) {
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-4 pt-4">
      <div className="pointer-events-auto mx-auto max-w-7xl rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-ambient backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-start lg:justify-between lg:px-6">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <a href="#home" className="flex min-w-0 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Tribute site
              </span>
              <span className="font-display text-2xl leading-none text-[color:var(--foreground)]">
                Composer. Programmer. Father.
              </span>
            </a>

            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Toggle day and night mode"
                  onClick={onToggleTheme}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] transition-transform hover:-translate-y-0.5"
                >
                  {mounted && resolvedMode === "night" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  aria-label="Open theme panel"
                  onClick={() => setIsThemePanelOpen((current) => !current)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] transition-transform hover:-translate-y-0.5"
                >
                  {isThemePanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {isThemePanelOpen ? (
                <div className="mt-2 w-[20.5rem] rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface)] p-2 lg:shadow-ambient">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]">
                      <Palette className="h-3.5 w-3.5" />
                      Theme
                    </p>
                    <button
                      type="button"
                      onClick={() => onSetTheme(activeTheme, "system")}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold ${
                        themeMode === "system"
                          ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                          : "border-[color:var(--line)] text-[color:var(--muted)]"
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" /> Auto
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {themeOptions.map((theme) => (
                      <div key={theme.key} className="rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-2">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                          {theme.label}
                        </p>
                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onSetTheme(theme.key, "day")}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[0.62rem] font-semibold ${
                              themeMode === "system"
                                ? "text-[color:var(--muted)]"
                                : activeTheme === theme.key && themeMode === "day"
                                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                                  : "border-[color:var(--line)] text-[color:var(--muted)]"
                            }`}
                            aria-label={`Switch to ${theme.label} day theme`}
                          >
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-[color:var(--line)] bg-black/10"
                              style={{ backgroundColor: theme.day }}
                              aria-hidden
                            />
                            Day
                          </button>
                          <button
                            type="button"
                            onClick={() => onSetTheme(theme.key, "night")}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[0.62rem] font-semibold ${
                              themeMode === "system"
                                ? "text-[color:var(--muted)]"
                                : activeTheme === theme.key && themeMode === "night"
                                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                                  : "border-[color:var(--line)] text-[color:var(--muted)]"
                            }`}
                            aria-label={`Switch to ${theme.label} night theme`}
                          >
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-[color:var(--line)] bg-black/10"
                              style={{ backgroundColor: theme.night }}
                              aria-hidden
                            />
                            Night
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <nav className="-mx-1 overflow-x-auto pb-1 lg:mx-0 lg:pb-0" aria-label="Section navigation">
            <ul className="flex min-w-max items-center gap-2 px-1 lg:px-0">
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-[color:var(--accent)] text-[#fffaf4]"
                          : "text-[color:var(--muted)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--foreground)]"
                      }`}
                    >
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href="/music"
            className="hidden rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] hover:-translate-y-0.5 lg:inline-flex"
          >
            Listen to his music
          </a>
        </div>
      </div>
    </header>
  );
}
