"use client";

import { Moon, Sun } from "lucide-react";

type StickyNavProps = {
  sections: { id: string; label: string }[];
  activeSection: string;
  isDark: boolean;
  mounted: boolean;
  onToggleTheme: () => void;
};

export function StickyNav({ sections, activeSection, isDark, mounted, onToggleTheme }: StickyNavProps) {
  return (
    <header className="pointer-events-none sticky top-0 z-50 px-4 pt-4">
      <div className="pointer-events-auto mx-auto max-w-7xl rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-ambient backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Tribute site
              </span>
              <span className="font-display text-2xl leading-none text-[color:var(--foreground)]">
                Composer. Programmer. Father.
              </span>
            </a>
            <button
              type="button"
              aria-label="Toggle light and dark mode"
              onClick={onToggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:-translate-y-0.5"
            >
              {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
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
