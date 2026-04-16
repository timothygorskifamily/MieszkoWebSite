"use client";

import { useEffect } from "react";
import {
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  getSystemThemeMode,
  parseStoredTheme,
} from "@/lib/tribute-theme";

export function TributeThemeBootstrap() {
  useEffect(() => {
    const applyTheme = () => {
      const storedTheme = parseStoredTheme();
      const systemMode = getSystemThemeMode();
      applyThemeToDocument(storedTheme.theme, storedTheme.mode, systemMode);
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      applyTheme();
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}

