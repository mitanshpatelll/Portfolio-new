import type { ReactNode } from 'react';
import { person } from '@/content/profile';
import styles from './Intro.module.css';

/** Things a phone replaced, drawn on the same 24px grid as the site's icons. */
const objects: { name: string; art: ReactNode }[] = [
  {
    name: 'Typewriter',
    art: (
      <>
        <path d="M7 8V3h10v5" />
        <rect x="4" y="8" width="16" height="2.5" rx="1" />
        <path d="M3 10.5h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M6.5 14h.01M9.5 14h.01M12.5 14h.01M15.5 14h.01M18 14h.01M8 17.5h8" />
      </>
    ),
  },
  {
    name: 'Torch',
    art: (
      <>
        <path d="M8 2h8l-1.5 5h-5z" />
        <rect x="9.5" y="7" width="5" height="14" rx="1.5" />
        <path d="M12 11v2.5M4 4.5 2.5 3.5M20 4.5l1.5-1M4.5 8H3M19.5 8H21" />
      </>
    ),
  },
  {
    name: 'Alarm clock',
    art: (
      <>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M12 9.5V13l2.5 1.5M5 3 2.5 5.5M19 3l2.5 2.5M6.5 19 4.5 21M17.5 19l2 2" />
      </>
    ),
  },
  {
    name: 'Camera',
    art: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </>
    ),
  },
  {
    name: 'Calculator',
    art: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <rect x="8" y="5" width="8" height="4" rx="0.5" />
        <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" />
      </>
    ),
  },
  {
    name: 'Map',
    art: <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" />,
  },
  {
    name: 'Radio',
    art: (
      <>
        <rect x="2" y="8" width="20" height="13" rx="2" />
        <path d="M6 8l11-5M16 12h2.5M16 15h2.5M16 18h2.5" />
        <circle cx="8.5" cy="14.5" r="3" />
      </>
    ),
  },
  {
    name: 'Compass',
    art: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
      </>
    ),
  },
  {
    name: 'Calendar',
    art: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18M8 15h.01M12 15h.01M16 15h.01" />
      </>
    ),
  },
  {
    name: 'Letters',
    art: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    name: 'Telephone',
    art: (
      <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 3.2 1.8h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.2 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.6 1.8z" />
    ),
  },
  {
    name: 'Wallet',
    art: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 10h18M16 15h2M6 6V5.5A2.5 2.5 0 0 1 8.5 3H17" />
      </>
    ),
  },
];

export const objectCount = objects.length;
export const objectNames = objects.map((object) => object.name);

export function ObjectArt({ index }: { index: number }) {
  const object = objects[index];
  if (!object) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {object.art}
    </svg>
  );
}

/** Where the fingertip is inside the hand drawing (viewBox units), so the tap lands exactly on target. */
export const FINGERTIP = { x: 22, y: 2, width: 64, height: 80 };

/** The cursor: an outlined pointing hand, white fill and a dark line, so it doesn't pick a skin tone. */
export function HandArt() {
  return (
    <svg viewBox="0 0 64 80" aria-hidden="true">
      <path
        className={styles.handFill}
        d="M16 46V8a6 6 0 0 1 12 0v22a5.5 5.5 0 0 1 11 1a5.2 5.2 0 0 1 10 3a4.8 4.8 0 0 1 9.4 3V54c0 12-8 20-20 20h-6c-7 0-11.5-3-15-8L5 55a4.2 4.2 0 0 1 6.5-5.3z"
      />
      <path className={styles.handLine} d="M28 30v7M39 31v6M49 34v5" />
    </svg>
  );
}

/** The portfolio's own "app icon": the photo once there is one, otherwise a green M. */
export function AppIcon({ className }: { className?: string }) {
  if (person.photo) {
    // A small local photo, so a plain <img> is enough.
    return <img className={className} src={person.photo} alt="" />;
  }
  return <span className={className ? `${className} ${styles.monogram}` : styles.monogram}>{person.initial}</span>;
}

/**
 * The objects come back as apps on the phone's home screen, under the names a phone gives them.
 * `object` is the index into the drawings above.
 */
export const homeApps = {
  grid: [
    { object: 0, label: 'Notes' },
    { object: 1, label: 'Torch' },
    { object: 2, label: 'Clock' },
    { object: 4, label: 'Calculator' },
    { object: 5, label: 'Maps' },
    { object: 6, label: 'Music' },
    { object: 7, label: 'Compass' },
    { object: 8, label: 'Calendar' },
    { object: 11, label: 'Wallet' },
  ],
  dock: [
    { object: 10, label: 'Phone' },
    { object: 9, label: 'Mail' },
    { object: -1, label: 'Store' },
    { object: 3, label: 'Camera' },
  ],
};

/** A generic store icon (a shopping bag), so no real store's trademark is used. */
export function StoreGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1.2 12H6.2z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
