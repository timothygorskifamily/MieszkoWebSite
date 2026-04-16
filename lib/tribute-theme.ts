export type ThemeMode = "day" | "night";
export type ThemeModeWithSystem = ThemeMode | "system";

export type ThemeKey = "sunrise" | "sage" | "sea" | "clay" | "storm";

export type ThemeOption = {
  key: ThemeKey;
  label: string;
  day: string;
  night: string;
};

export type ThemeSettings = {
  theme: ThemeKey;
  mode: ThemeModeWithSystem;
};

export const THEME_STORAGE_KEY = "tribute-theme-settings";
const LEGACY_THEME_STORAGE_KEY = "tribute-theme";

export const THEME_OPTIONS: ThemeOption[] = [
  { key: "sunrise", label: "Sunrise", day: "#f5efe7", night: "#171311" },
  { key: "sage", label: "Sage", day: "#f0f6ef", night: "#11231a" },
  { key: "sea", label: "Sea", day: "#eef8fa", night: "#0e1f2d" },
  { key: "clay", label: "Clay", day: "#f8f2ee", night: "#26170f" },
  { key: "storm", label: "Storm", day: "#f3f6fb", night: "#121826" },
];

export const isThemeKey = (value: string): value is ThemeKey =>
  THEME_OPTIONS.some((theme) => theme.key === value);

export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "day" || value === "night";

export const getSystemThemeMode = (): ThemeMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";

export const getResolvedThemeMode = (mode: ThemeModeWithSystem, systemMode: ThemeMode): ThemeMode =>
  mode === "system" ? systemMode : mode;

export const getThemeClass = (theme: ThemeKey, mode: ThemeMode): string => `theme-${theme}-${mode}`;

export const parseLegacyTheme = (storedTheme: string | null): ThemeSettings | null => {
  if (storedTheme === "dark") {
    return { theme: "sunrise", mode: "night" };
  }

  if (storedTheme === "light") {
    return { theme: "sunrise", mode: "day" };
  }

  if (storedTheme) {
    const [themeName, modeName] = storedTheme.split("-", 2);
    if (isThemeKey(themeName) && (modeName === "day" || modeName === "night")) {
      return { theme: themeName, mode: modeName };
    }
  }

  return null;
};

export const parseStoredTheme = (): ThemeSettings => {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme) as ThemeSettings;
      const hasKnownTheme = isThemeKey(parsed?.theme);
      const hasKnownMode = parsed?.mode === "day" || parsed?.mode === "night" || parsed?.mode === "system";

      if (hasKnownTheme && hasKnownMode) {
        return parsed;
      }
    } catch {
      // fallthrough to legacy parsing
    }
  }

  const legacyTheme = parseLegacyTheme(window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY));
  if (legacyTheme) {
    window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    return legacyTheme;
  }

  return { theme: "sunrise", mode: "system" };
};

export const applyThemeToDocument = (
  theme: ThemeKey,
  themeMode: ThemeModeWithSystem,
  systemMode: ThemeMode,
) => {
  const root = document.documentElement;
  const resolvedMode = getResolvedThemeMode(themeMode, systemMode);
  const nextClass = getThemeClass(theme, resolvedMode);

  root.classList.forEach((className) => {
    if (className.startsWith("theme-")) {
      root.classList.remove(className);
    }
  });

  root.classList.remove("dark");
  root.classList.add(nextClass);
  root.setAttribute("data-tribute-theme", `${theme}-${resolvedMode}`);
  root.setAttribute("data-tribute-active-theme", theme);
  root.setAttribute("data-tribute-mode", themeMode);
  root.setAttribute("data-tribute-resolved-mode", resolvedMode);

  return resolvedMode;
};

