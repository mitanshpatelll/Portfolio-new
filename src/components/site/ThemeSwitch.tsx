'use client';

import { useAnimate } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';
import { FINGERTIP, HandArt, ObjectArt } from '@/components/intro/IntroArt';
import { applyTheme, type Theme } from './theme';
import styles from './ThemeSwitch.module.css';

const easeOut = [0.2, 0, 0, 1] as const;

/**
 * The theme switch, the way a phone does it: quick settings drop down from the top of the screen,
 * a tap on the dark theme tile changes the theme (the page fades over to it), and the panel goes
 * back up. Tapping the dimmed page or pressing Esc finishes it at once.
 */
export function ThemeSwitch({ theme, onDone }: { theme: Theme; onDone: () => void }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const finished = useRef(false);
  const playback = useRef<{ stop: () => void } | null>(null);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    playback.current?.stop();
    if (document.documentElement.dataset.theme !== theme) applyTheme(theme);
    onDone();
  }, [theme, onDone]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  useEffect(() => {
    const root = scope.current;
    const panel = root?.querySelector<HTMLElement>('[data-panel]');
    const tile = root?.querySelector<HTMLElement>('[data-theme-tile]');
    const hand = root?.querySelector<HTMLElement>('[data-hand]');
    if (!root || !panel || !tile || !hand) {
      finish();
      return;
    }

    // Developer mode's animation speed (--anim) stretches or squeezes the whole thing.
    const speed = Math.max(0.25, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim')) || 1);
    const t = (seconds: number) => seconds * speed;

    // The panel waits above the screen (see the CSS), so the tile's resting place is that far lower.
    const hidden = -(panel.offsetTop + panel.offsetHeight + 16);
    const rect = tile.getBoundingClientRect();
    const handScale = hand.offsetWidth / FINGERTIP.width;
    const press = {
      x: rect.left + rect.width * 0.5 - FINGERTIP.x * handScale,
      y: rect.top - hidden + rect.height * 0.55 - FINGERTIP.y * handScale,
    };

    const controls = animate([
      ['[data-shade]', { opacity: [0, 1] }, { duration: t(0.3), at: 0 }],
      [panel, { y: [hidden, 0] }, { duration: t(0.45), ease: easeOut, at: 0 }],
      ['[data-hand]', { x: [press.x + 50, press.x], y: [press.y + 110, press.y], opacity: [0, 1], rotate: [-10, 0] }, { duration: t(0.35), ease: easeOut, at: t(0.35) }],
      ['[data-hand]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(0.75) }],
      [tile, { scale: [1, 0.94, 1] }, { duration: t(0.25), at: t(0.75) }],
      ['[data-hand]', { opacity: [1, 0], y: [press.y, press.y + 30] }, { duration: t(0.3), at: t(1.25) }],
      [panel, { y: [0, hidden] }, { duration: t(0.35), ease: [0.4, 0, 1, 1], at: t(1.35) }],
      ['[data-shade]', { opacity: [1, 0] }, { duration: t(0.3), at: t(1.4) }],
    ]);
    playback.current = controls;

    // The theme changes as the tile is pressed. A view transition cross-fades the page to it.
    const flip = window.setTimeout(() => {
      const change = () => applyTheme(theme);
      if (document.startViewTransition) document.startViewTransition(change);
      else change();
    }, t(0.85) * 1000);

    let cancelled = false;
    controls.then(() => {
      if (!cancelled) finish();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(flip);
      controls.stop();
    };
  }, [animate, scope, theme, finish]);

  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div ref={scope} className={styles.root} aria-hidden="true">
      <div className={styles.shade} data-shade onClick={finish} />
      <div className={styles.panel} data-panel>
        <div className={styles.head}>
          <span className={styles.time}>{time}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.tiles}>
          <span className={`${styles.tile} ${styles.on}`}>
            <svg viewBox="0 0 24 24">
              <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" />
              <circle cx="12" cy="19.5" r="0.8" />
            </svg>
            Wi-Fi
          </span>
          <span className={styles.tile}>
            <svg viewBox="0 0 24 24">
              <path d="m7 7 10 10-5 4V3l5 4L7 17" />
            </svg>
            Bluetooth
          </span>
          <span className={styles.tile}>
            <ObjectArt index={1} />
            Torch
          </span>
          <span className={`${styles.tile} ${styles.themeTile}`} data-theme-tile>
            <svg viewBox="0 0 24 24">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            </svg>
            Dark theme
          </span>
        </div>
        <span className={styles.brightness} />
        <span className={styles.handle} />
      </div>
      <div className={styles.hand} data-hand>
        <HandArt />
      </div>
    </div>
  );
}
