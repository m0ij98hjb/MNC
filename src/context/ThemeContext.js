"use client";

import { createContext, useContext, useEffect, useState } from "react";

// NOTE: naming is inverted for historical reasons —
// theme "dark" (html.dark) renders the LIGHT look, theme "light" renders the dark/black look.
// The light look is the site default.
export const THEME_STORAGE_KEY = "mnc-theme-v2";
export const DEFAULT_THEME = "dark";
// Theme toggle is hidden for now. While false, the navbar shows no toggle and
// everyone gets the default (light) look, ignoring any saved choice; set back
// to true to restore the toggle and each visitor's saved preference.
export const THEME_TOGGLE_ENABLED = false;

const ThemeContext = createContext({ theme: DEFAULT_THEME, toggleTheme: () => {} });

function readSavedTheme() {
  if (!THEME_TOGGLE_ENABLED) return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const saved = readSavedTheme();
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
