'use client';

import { motion, useAnimate, useMotionValue, useTransform, type AnimationSequence } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { intro, person } from '@/content/profile';
import { AppIcon, FINGERTIP, HandArt, ObjectArt, objectCount, objectNames } from './IntroArt';
import { clockTime, PhoneScreen, phoneSize } from './Phone';
import styles from './Intro.module.css';

const easeOut = [0.2, 0, 0, 1] as const;
const easeIn = [0.7, 0, 0.84, 0] as const;
const overshoot = [0.34, 1.56, 0.64, 1] as const;

type Layout = {
  vw: number;
  vh: number;
  w: number;
  h: number;
  /** The phone is drawn this much smaller while the objects merge, so the ring around it has room. */
  mergeScale: number;
  objects: { x: number; y: number }[];
  time: string;
};
type Point = { x: number; y: number };

/**
 * Phone size and where each object floats: a loose ring around the (smaller, merge-time) phone,
 * at slightly uneven distances so it reads as natural rather than a grid, kept clear of the
 * phone, the caption at the top and the screen edges.
 */
function measure(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw < 640;
  const { w, h } = phoneSize(vw, vh);
  const mergeScale = Math.min(1, (vh * (narrow ? 0.5 : 0.6)) / h);
  const mergeW = w * mergeScale;
  const mergeH = h * mergeScale;
  const chip = narrow ? 44 : 64;
  const maxX = vw / 2 - chip / 2 - (narrow ? 14 : 40);
  const maxY = vh / 2 - chip / 2 - (narrow ? 60 : 70);
  const rx = Math.min(maxX, mergeW / 2 + (narrow ? 70 : 190));
  const ry = Math.min(maxY, mergeH / 2 + (narrow ? 80 : 80));
  const objects = Array.from({ length: objectCount }, (_, index) => {
    const angle = -Math.PI / 2 + (index / objectCount) * Math.PI * 2 + (index % 2 ? 0.07 : -0.05);
    const wobble = 1 + 0.05 * Math.sin(index * 2.4 + 1);
    const x = Math.cos(angle) * rx * wobble;
    let y = Math.sin(angle) * ry * wobble;
    // Anything above or below the phone is pushed out until its chip and its name clear the phone.
    if (Math.abs(x) < mergeW / 2 + chip / 2 + 4) {
      if (y < 0) y = Math.min(y, -(mergeH / 2 + chip / 2 + 24));
      else y = Math.max(y, mergeH / 2 + chip / 2 + 8);
    }
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  });
  return { vw, vh, w, h, mergeScale, objects, time: clockTime() };
}

/**
 * The opening: a rectangle appears, the things a phone replaced fly into it, it becomes a phone
 * whose home screen holds them as apps. A cursor opens the Store, searches for me, installs the
 * app, opens it, the splash screen plays its exit and the phone zooms into the site.
 * Only runs when the boot script in layout.tsx marked this page view with data-intro="playing",
 * which is the first visit; later visits get the shorter Relaunch.
 */
export function Intro() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const typed = useMotionValue(0);
  const query = useTransform(typed, (value) => intro.search.slice(0, Math.round(value)));
  const playback = useRef<{ stop: () => void } | null>(null);
  const finished = useRef(false);
  const skipping = useRef(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'playing') return;
    // From now on this browser gets the short "close and reopen" version (see layout.tsx).
    try {
      localStorage.setItem('intro-seen', '1');
    } catch {}
    setLayout(measure());
  }, []);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    // 'done' (rather than removing it) keeps the hero from fading in a second time.
    document.documentElement.dataset.intro = 'done';
    const url = new URL(window.location.href);
    if (url.searchParams.has('intro')) {
      url.searchParams.delete('intro');
      window.history.replaceState(null, '', url);
    }
    setLayout(null);
  }, []);

  const skip = useCallback(() => {
    skipping.current = true;
    playback.current?.stop();
    if (!scope.current) {
      finish();
      return;
    }
    animate(scope.current, { opacity: 0 }, { duration: 0.3 }).then(finish);
  }, [animate, scope, finish]);

  useEffect(() => {
    if (!layout) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [layout, skip]);

  // Build the timeline once the overlay is laid out, so every tap and launch uses real positions.
  useEffect(() => {
    const root = scope.current;
    if (!layout || !root) return;

    // Developer mode's animation speed (--anim) stretches or squeezes the whole intro.
    const speed = Math.max(0.25, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim')) || 1);
    const t = (seconds: number) => seconds * speed;

    const missing = ['[data-device]', '[data-screen]', '[data-hand]', '[data-store-icon]', '[data-result-icon]', '[data-get-area]', '[data-app-tile]'].some(
      (selector) => !root.querySelector(selector),
    );
    if (missing) {
      finish();
      return;
    }
    const box = (selector: string) => root.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
    const screenEl = root.querySelector<HTMLElement>('[data-screen]')!;
    const screen = screenEl.getBoundingClientRect();
    const screenRadius = parseFloat(getComputedStyle(screenEl).borderTopLeftRadius) || 0;
    const pageColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
    const hand = root.querySelector<HTMLElement>('[data-hand]')!;
    const handScale = hand.offsetWidth / FINGERTIP.width;

    // The hand's top-left corner sits at the stage centre; these move it so the fingertip lands on a target.
    const tapOn = (rect: DOMRect): Point => ({
      x: rect.left + rect.width / 2 - layout.vw / 2 - FINGERTIP.x * handScale,
      y: rect.top + rect.height / 2 - layout.vh / 2 - FINGERTIP.y * handScale,
    });
    // A clip that starts exactly over an icon and grows to the whole screen: how apps open.
    const fromIcon = (rect: DOMRect) =>
      `inset(${rect.top - screen.top}px ${screen.right - rect.right}px ${screen.bottom - rect.bottom}px ${rect.left - screen.left}px round ${rect.width * 0.225}px)`;
    const fullScreen = `inset(0px 0px 0px 0px round ${screenRadius}px)`;

    const storeIcon = box('[data-store-icon]');
    const resultIcon = box('[data-result-icon]');
    const storeTap = tapOn(storeIcon);
    const getTap = tapOn(box('[data-get-area]'));
    const rest = { x: getTap.x + 34, y: getTap.y + 64 };
    const zoom = Math.max(layout.vw / layout.w, layout.vh / layout.h) * 1.25;
    const m = layout.mergeScale;

    // Where each object lands: its own app tile on the home screen. Tiles are measured at full
    // size, and the phone is drawn at mergeScale during the merge, so offsets from its centre scale.
    const device = box('[data-device]');
    const deviceCentre = { x: device.left + device.width / 2, y: device.top + device.height / 2 };
    const chip = root.querySelector<HTMLElement>('[data-object="0"]')?.offsetWidth ?? 64;
    const landing = layout.objects.map((_, index) => {
      const tile = root.querySelector<HTMLElement>(`[data-app-object="${index}"] [data-app-tile]`);
      if (!tile) return { x: 0, y: 0, scale: 0.4 };
      const rect = tile.getBoundingClientRect();
      return {
        x: (rect.left + rect.width / 2 - deviceCentre.x) * m + (deviceCentre.x - layout.vw / 2),
        y: (rect.top + rect.height / 2 - deviceCentre.y) * m + (deviceCentre.y - layout.vh / 2),
        scale: (rect.width * m) / chip,
      };
    });

    // Stage start times, in seconds at normal speed. The objects appear and float with their
    // names, the rectangle becomes a phone with an empty home screen, then each object flies
    // into its own app slot, one at a time, and the home screen fills up.
    const APPEAR = 0.9;
    const APPEAR_GAP = 0.12;
    const FORM = APPEAR + objectCount * APPEAR_GAP + 0.75;
    const MERGE = FORM + 0.8;
    const MERGE_GAP = 0.3;
    const FLIGHT = 0.95;
    const MERGED = MERGE + (objectCount - 1) * MERGE_GAP + FLIGHT;
    const GROW = MERGED + 0.45;
    const STORE = GROW + 0.7;
    const QUERY = STORE + 1.35;
    const GET = QUERY + 1.4;
    const OPEN = GET + 1.75;
    const LAUNCH = OPEN + 0.7;
    const EXIT = LAUNCH + 1.0;

    // Note: a sequence holds each value's first keyframe from time 0, so anything that appears
    // later must start from its hidden value (opacity 0) in its first segment.
    const sequence: AnimationSequence = [
      // 1. A rectangle draws itself.
      ['[data-device]', { opacity: [0, 1], scale: [0.92 * m, m] }, { duration: t(0.8), ease: easeOut, at: 0 }],
      ['[data-outline]', { strokeDashoffset: [1, 0] }, { duration: t(0.9), ease: 'easeInOut', at: 0 }],
      ['[data-caption="before"]', { opacity: [0, 1], y: [8, 0] }, { duration: t(0.5), at: t(0.3) }],

      // 2. It becomes a phone with an empty home screen, waiting for its apps.
      ['[data-body]', { opacity: [0, 1] }, { duration: t(0.5), at: t(FORM) }],
      ['[data-outline-svg]', { opacity: [1, 0] }, { duration: t(0.4), at: t(FORM + 0.2) }],
      ['[data-screen]', { opacity: [0, 1], scale: [0.97, 1] }, { duration: t(0.5), ease: easeOut, at: t(FORM + 0.25) }],
      ['[data-caption="before"]', { opacity: [1, 0], y: [0, -8] }, { duration: t(0.4), at: t(MERGE - 0.5) }],
      ['[data-caption="after"]', { opacity: [0, 1], y: [8, 0] }, { duration: t(0.5), at: t(MERGE - 0.2) }],
    ];

    // 3. Everything a phone replaced drifts in around it with its name. Then, one at a time, each
    //    one curves into its own app slot, turning from a round chip into an app icon, and the
    //    app appears there with a small bounce.
    layout.objects.forEach((position, index) => {
      const appear = APPEAR + index * APPEAR_GAP;
      const fly = MERGE + index * MERGE_GAP;
      const land = fly + FLIGHT;
      const end = landing[index]!;
      const dx = end.x - position.x;
      const dy = end.y - position.y;
      const distance = Math.hypot(dx, dy) || 1;
      const bend = distance * 0.22 * (index % 2 ? 1 : -1);
      const mid = { x: position.x + dx / 2 - (dy / distance) * bend, y: position.y + dy / 2 + (dx / distance) * bend };
      sequence.push(
        [
          `[data-object="${index}"]`,
          { opacity: [0, 1], scale: [0.5, 1], x: [position.x * 1.12, position.x], y: [position.y * 1.12, position.y] },
          { duration: t(0.55), ease: overshoot, at: t(appear) },
        ],
        [`[data-object-label="${index}"]`, { opacity: [0, 1], y: [4, 0] }, { duration: t(0.3), at: t(appear + 0.2) }],
        [`[data-object-label="${index}"]`, { opacity: [1, 0] }, { duration: t(0.2), at: t(fly) }],
        [
          `[data-object="${index}"]`,
          {
            x: [position.x, mid.x, end.x],
            y: [position.y, mid.y, end.y],
            scale: [1, (1 + end.scale) / 2, end.scale],
            borderRadius: ['50%', '36%', '22.5%'],
          },
          { duration: t(FLIGHT), times: [0, 0.5, 1], ease: ['easeIn', 'easeOut'], at: t(fly) },
        ],
        [`[data-object="${index}"]`, { opacity: [1, 0] }, { duration: t(0.12), at: t(land - 0.04) }],
        [`[data-app-object="${index}"]`, { opacity: [0, 1] }, { duration: t(0.15), at: t(land - 0.06) }],
        [`[data-app-object="${index}"] [data-app-tile]`, { scale: [0.86, 1.08, 1] }, { duration: t(0.35), at: t(land - 0.06) }],
        ['[data-device]', { scale: [m, m * 1.012, m] }, { duration: t(0.2), at: t(land) }],
      );
    });

    sequence.push(
      // The Store arrives last, then the phone grows to full size for the rest of the story.
      ['[data-store-app]', { opacity: [0, 1], scale: [0.6, 1] }, { duration: t(0.4), ease: overshoot, at: t(MERGED + 0.1) }],
      ['[data-caption="after"]', { opacity: [1, 0] }, { duration: t(0.4), at: t(GROW) }],
      ['[data-device]', { scale: [m, 1] }, { duration: t(0.6), ease: easeOut, at: t(GROW) }],

      // 4. The cursor opens the Store.
      [
        '[data-hand]',
        { x: [storeTap.x + layout.vw * 0.3, storeTap.x], y: [storeTap.y + layout.vh * 0.4, storeTap.y], opacity: [0, 1], rotate: [-12, 0] },
        { duration: t(0.6), ease: easeOut, at: t(STORE) },
      ],
      ['[data-hand]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(STORE + 0.65) }],
      ['[data-store-icon]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(STORE + 0.65) }],
      ['[data-store]', { opacity: [0, 1] }, { duration: t(0.05), at: t(STORE + 0.85) }],
      ['[data-store]', { clipPath: [fromIcon(storeIcon), fullScreen] }, { duration: t(0.45), ease: easeOut, at: t(STORE + 0.85) }],
      ['[data-home]', { scale: [1, 0.94], opacity: [1, 0.3] }, { duration: t(0.45), ease: easeOut, at: t(STORE + 0.85) }],
      ['[data-hand]', { x: [storeTap.x, rest.x], y: [storeTap.y, rest.y] }, { duration: t(0.5), ease: easeOut, at: t(STORE + 1.0) }],

      // 5. It searches for me.
      [typed, [0, intro.search.length], { duration: t(intro.search.length * 0.075), ease: 'linear', at: t(QUERY) }],
      ['[data-result]', { opacity: [0, 1], y: [10, 0] }, { duration: t(0.4), ease: easeOut, at: t(QUERY + 1.05) }],
      ['[data-result-icon]', { scale: [0.6, 1.1, 1] }, { duration: t(0.45), at: t(QUERY + 1.1) }],

      // 6. Get → download ring → Open.
      ['[data-hand]', { x: [rest.x, getTap.x], y: [rest.y, getTap.y] }, { duration: t(0.4), ease: easeOut, at: t(GET) }],
      ['[data-hand]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(GET + 0.45) }],
      ['[data-get-area]', { scale: [1, 0.9, 1] }, { duration: t(0.25), at: t(GET + 0.45) }],
      ['[data-get]', { opacity: [1, 0], scale: [1, 0.7] }, { duration: t(0.2), at: t(GET + 0.6) }],
      ['[data-progress]', { opacity: [0, 1], scale: [0.7, 1] }, { duration: t(0.2), at: t(GET + 0.7) }],
      ['[data-hand]', { y: [getTap.y, getTap.y + 26] }, { duration: t(0.3), ease: easeOut, at: t(GET + 0.7) }],
      ['[data-ring]', { strokeDashoffset: [1, 0] }, { duration: t(1.0), ease: 'easeInOut', at: t(GET + 0.75) }],
      ['[data-progress]', { opacity: [1, 0] }, { duration: t(0.15), at: t(OPEN - 0.05) }],
      ['[data-open]', { opacity: [0, 1], scale: [0.7, 1] }, { duration: t(0.3), ease: overshoot, at: t(OPEN) }],
      ['[data-hand]', { y: [getTap.y + 26, getTap.y] }, { duration: t(0.3), ease: easeOut, at: t(OPEN + 0.1) }],
      ['[data-hand]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(OPEN + 0.45) }],
      ['[data-open]', { scale: [1, 0.9, 1] }, { duration: t(0.25), at: t(OPEN + 0.45) }],
      ['[data-hand]', { opacity: [1, 0], y: [getTap.y, getTap.y + 40] }, { duration: t(0.35), at: t(LAUNCH) }],

      // 7. The app opens on its splash screen…
      ['[data-splash]', { opacity: [0, 1] }, { duration: t(0.05), at: t(LAUNCH) }],
      ['[data-splash]', { clipPath: [fromIcon(resultIcon), fullScreen] }, { duration: t(0.5), ease: easeOut, at: t(LAUNCH) }],
      ['[data-splash-logo]', { opacity: [0, 1], scale: [0.85, 1] }, { duration: t(0.35), ease: easeOut, at: t(LAUNCH + 0.2) }],
      ['[data-splash-name]', { opacity: [0, 1], y: [6, 0] }, { duration: t(0.3), at: t(LAUNCH + 0.35) }],

      // 8. …the splash plays its exit, the phone zooms in, and the portfolio is underneath.
      ['[data-splash-logo]', { scale: [1, 1.35], opacity: [1, 0] }, { duration: t(0.45), ease: easeOut, at: t(EXIT) }],
      ['[data-splash-name]', { opacity: [1, 0] }, { duration: t(0.25), at: t(EXIT) }],
      ['[data-splash]', { backgroundColor: pageColor }, { duration: t(0.4), at: t(EXIT + 0.1) }],
      ['[data-device]', { scale: [1, zoom] }, { duration: t(0.75), ease: [0.65, 0, 0.35, 1], at: t(EXIT + 0.15) }],
      [root, { opacity: [1, 0] }, { duration: t(0.3), at: t(EXIT + 0.8) }],
    );

    // A stopped timeline may still resolve, so only a timeline that really ran to the end finishes the intro.
    let cancelled = false;
    const controls = animate(sequence);
    playback.current = controls;
    controls.then(() => {
      if (!cancelled && !skipping.current) finish();
    });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [layout, animate, scope, typed, finish]);

  if (!layout) return null;

  return (
    <div ref={scope} className={styles.overlay} data-intro-overlay>
      <div
        className={styles.stage}
        aria-hidden="true"
        style={{ '--w': `${layout.w}px`, '--h': `${layout.h}px` } as CSSProperties}
      >
        <p className={`${styles.caption} mono`} data-caption="before">
          {intro.before}
        </p>
        <p className={`${styles.caption} mono`} data-caption="after">
          {intro.after}
        </p>

        <div className={styles.device} data-device>
          <svg className={styles.outline} data-outline-svg viewBox={`0 0 ${layout.w} ${layout.h}`}>
            <rect data-outline x="1" y="1" width={layout.w - 2} height={layout.h - 2} rx={layout.w * 0.15} pathLength={1} />
          </svg>
          <div className={styles.body} data-body />

          <PhoneScreen time={layout.time}>
            {/* The Store */}
            <div className={styles.store} data-store>
              <p className={styles.storeTitle}>Search</p>
              <div className={styles.search}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <motion.span className={styles.query}>{query}</motion.span>
                <span className={styles.caret} />
              </div>
              <div className={styles.result} data-result>
                <span className={styles.resultIconWrap} data-result-icon>
                  <AppIcon className={styles.resultIcon} />
                </span>
                <span className={styles.resultText}>
                  <span className={styles.resultName}>{person.name}</span>
                  <span className={styles.resultRole}>{person.role}</span>
                </span>
                <span className={styles.getArea} data-get-area>
                  <span className={styles.get} data-get>
                    Get
                  </span>
                  <span className={styles.progress} data-progress>
                    <svg viewBox="0 0 24 24">
                      <circle className={styles.ringTrack} cx="12" cy="12" r="9" />
                      <circle className={styles.ring} data-ring cx="12" cy="12" r="9" pathLength={1} />
                      <rect className={styles.ringStop} x="9.5" y="9.5" width="5" height="5" rx="1" />
                    </svg>
                  </span>
                  <span className={styles.open} data-open>
                    Open
                  </span>
                </span>
              </div>
            </div>
          </PhoneScreen>
        </div>

        {layout.objects.map((_, index) => (
          <div key={index} className={styles.object} data-object={index}>
            {/* Each object bobs gently on its own rhythm while it waits. */}
            <span className={styles.objectFloat} style={{ '--bob-delay': `${-index * 0.37}s` } as CSSProperties}>
              <ObjectArt index={index} />
              <span className={`${styles.objectLabel} mono`} data-object-label={index}>
                {objectNames[index]}
              </span>
            </span>
          </div>
        ))}

        <div className={styles.hand} data-hand>
          <HandArt />
        </div>
      </div>

      <button type="button" className={`${styles.skip} mono`} onClick={skip}>
        Skip intro
      </button>
    </div>
  );
}
