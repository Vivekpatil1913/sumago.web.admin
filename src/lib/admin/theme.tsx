"use client";

/**
 * Light / dark theme for the admin panel only.
 *
 * The class goes on <html> because the panel's tokens are declared there, but
 * it is scoped to `.admin-dark` — the public website never reads it, so the
 * marketing pages are unaffected whichever theme an editor prefers.
 *
 * The choice is read back before paint by an inline script (see the admin
 * layout), so there is no flash of the wrong theme on load.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "sumago-admin-theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

/** Runs before paint to avoid a flash. Kept in sync with `apply()` below. */
export const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('admin-dark', theme === 'dark');
  } catch (e) {}
})();
`;

function apply(theme: Theme): void {
  document.documentElement.classList.toggle("admin-dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Adopt whatever the boot script already decided, so the two never disagree.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeState(stored ?? (prefersDark ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing — the theme just won't persist.
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Leaving the panel must not leave the site rendering in dark tokens.
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("admin-dark");
    };
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
