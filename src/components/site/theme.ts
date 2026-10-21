export type Theme = 'light' | 'dark';

/** The theme showing now: the visitor's saved choice (set by the boot script), else the system's. */
export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Switches the theme and remembers it. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }
}
