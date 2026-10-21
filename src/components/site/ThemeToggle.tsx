'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { applyTheme, currentTheme, type Theme } from './theme';
import styles from './Site.module.css';

// The quick settings that play the switch; their code loads on the first tap.
const ThemeSwitch = dynamic(() => import('./ThemeSwitch').then((module) => module.ThemeSwitch), { ssr: false });

/**
 * Switches light/dark and remembers it. The switch plays out like a phone's: quick settings drop
 * down from the top and the dark theme tile is tapped. Which icon shows is decided by CSS, so
 * server and client HTML match.
 */
export function ThemeToggle() {
  const [switching, setSwitching] = useState<Theme | null>(null);

  const toggle = () => {
    if (switching) return;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    // --anim is 0 with reduced motion or animations switched off in developer mode.
    const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim')) || 0;
    if (speed === 0) applyTheme(next);
    else setSwitching(next);
  };

  return (
    <>
      <button type="button" className={styles.iconButton} onClick={toggle} aria-label="Switch between light and dark theme">
        <span className={styles.sun}>
          <Icon name="sun" />
        </span>
        <span className={styles.moon}>
          <Icon name="moon" />
        </span>
      </button>
      {switching && createPortal(<ThemeSwitch theme={switching} onDone={() => setSwitching(null)} />, document.body)}
    </>
  );
}
