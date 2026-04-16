"use client";

import { useEffect, useState } from "react";
import {
  ThemeModeWithSystem,
  ThemeMode,
  ThemeKey,
  ThemeOption,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  getSystemThemeMode,
  parseStoredTheme,
  getResolvedThemeMode,
} from "@/lib/tribute-theme";
import { navigationItems, tributeContent } from "@/data/tribute-content";
import { BiographySection } from "@/components/biography-section";
import { GallerySection } from "@/components/gallery-section";
import { HeroSection } from "@/components/hero-section";
import { LegacySection } from "@/components/legacy-section";
import { StickyNav } from "@/components/sticky-nav";
import { TimelineSection } from "@/components/timeline-section";
import { ValuesSection } from "@/components/values-section";

const themeOptions: ThemeOption[] = THEME_OPTIONS;

export function TributeExperience() {
  const [activeSection, setActiveSection] = useState("home");
  const [themeMode, setThemeMode] = useState<ThemeModeWithSystem>("system");
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("sunrise");
  const [systemMode, setSystemMode] = useState<ThemeMode>("day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = parseStoredTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const nextSystemMode = getSystemThemeMode();

    setThemeMode(storedTheme.mode);
    setActiveTheme(storedTheme.theme);
    setSystemMode(nextSystemMode);
    applyThemeToDocument(storedTheme.theme, storedTheme.mode, nextSystemMode);
    setMounted(true);

    const handleSystemThemeChange = () => {
      setSystemMode(getSystemThemeMode());
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  useEffect(() => {
    applyThemeToDocument(activeTheme, themeMode, systemMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme: activeTheme, mode: themeMode }));
  }, [activeTheme, themeMode, systemMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-42% 0px -38% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    navigationItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const targetMode = themeMode === "system" ? systemMode : themeMode;
    setThemeMode(targetMode === "day" ? "night" : "day");
  };

  const setTheme = (theme: ThemeKey, mode: ThemeModeWithSystem) => {
    setActiveTheme(theme);
    setThemeMode(mode);
  };

  return (
    <>
      <StickyNav
        sections={navigationItems}
        activeSection={activeSection}
        themeOptions={themeOptions}
        activeTheme={activeTheme}
        themeMode={themeMode}
        resolvedMode={getResolvedThemeMode(themeMode, systemMode)}
        mounted={mounted}
        onToggleTheme={toggleTheme}
        onSetTheme={setTheme}
      />

      <main className="relative overflow-hidden">
        <HeroSection id="home" />
        <BiographySection id="story" />
        <TimelineSection id="timeline" />
        <GallerySection id="gallery" />
        <ValuesSection id="values" />
        <LegacySection id="legacy" />
      </main>

      <footer className="px-4 pb-10 pt-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[color:var(--line)] pt-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>Built as a living tribute for {tributeContent.site.name}.</p>
        </div>
      </footer>
    </>
  );
}
