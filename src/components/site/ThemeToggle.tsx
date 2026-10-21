'use client';

import { Icon } from '@/components/ui/Icon';
import styles from './Site.module.css';

/** Switches light/dark and remembers it. Which icon shows is decided by CSS, so server and client HTML match. */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try {
        window.localStorage.setItem('theme', next);
      } catch {
        // Storage blocked: the choice lasts for this visit only.
      }
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button type="button" className={styles.iconButton} onClick={toggle} aria-label="Switch between light and dark theme">
      <span className={styles.sun}>
        <Icon name="sun" />
      </span>
      <span className={styles.moon}>
        <Icon name="moon" />
      </span>
    </button>
  );
}
