"use client";

import { useEffect, useState } from "react";
import { navigationItems, tributeContent } from "@/data/tribute-content";
import { BiographySection } from "@/components/biography-section";
import { GallerySection } from "@/components/gallery-section";
import { HeroSection } from "@/components/hero-section";
import { LegacySection } from "@/components/legacy-section";
import { StickyNav } from "@/components/sticky-nav";
import { TimelineSection } from "@/components/timeline-section";
import { ValuesSection } from "@/components/values-section";

export function TributeExperience() {
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tribute-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextIsDark = storedTheme ? storedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
    setMounted(true);
  }, []);

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
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("tribute-theme", nextIsDark ? "dark" : "light");
  };

  return (
    <>
      <StickyNav
        sections={navigationItems}
        activeSection={activeSection}
        isDark={isDark}
        mounted={mounted}
        onToggleTheme={toggleTheme}
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
          <p>This page is ready for real photos, biography details, and music recordings whenever you are.</p>
        </div>
      </footer>
    </>
  );
}
