'use client';

import { useAnimate, type AnimationSequence } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { FINGERTIP, HandArt } from './IntroArt';
import { clockTime, PhoneScreen, phoneSize, StatusBar } from './Phone';
import styles from './Intro.module.css';

const easeOut = [0.2, 0, 0, 1] as const;
const easeInOut = [0.65, 0, 0.35, 1] as const;

type Layout = { vw: number; vh: number; w: number; h: number; time: string };
type Point = { x: number; y: number };

/**
 * The shorter openings, once the full intro has been seen (the boot script in layout.tsx decides):
 * - "relaunch", a refresh: the page shrinks into a phone as the open app, a swipe up closes it into
 *   its icon on the home screen, a tap opens it again and the phone zooms back into the site;
 * - "open", coming back later: just the phone on its home screen, a tap on the app, its splash,
 *   and the zoom into the site.
 */
export function Relaunch() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const kind = useRef<'relaunch' | 'open'>('relaunch');
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const card = useRef<HTMLDivElement>(null);
  const pageWidth = useRef(0);
  const playback = useRef<{ stop: () => void } | null>(null);
  const finished = useRef(false);
  const skipping = useRef(false);

  useEffect(() => {
    const mode = document.documentElement.dataset.intro;
    if (mode !== 'relaunch' && mode !== 'open') return;
    kind.current = mode;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setLayout({ vw, vh, ...phoneSize(vw, vh), time: clockTime() });
  }, []);

  // Before the overlay is painted, put a copy of the page in the card so the first frame looks
  // exactly like the page itself. The real page goes back to the top underneath, so the app
  // reopens at the start.
  useLayoutEffect(() => {
    const target = card.current;
    const source = document.querySelector<HTMLElement>('[data-app-root]');
    if (!layout || !target || !source || kind.current !== 'relaunch') return;
    window.scrollTo(0, 0);
    const rect = source.getBoundingClientRect();
    const copy = source.cloneNode(true) as HTMLElement;
    copy.removeAttribute('data-app-root');
    // Sections below the fold reveal on scroll; the phone shows them, so the copy has them all shown.
    copy.querySelectorAll('[data-reveal]').forEach((element) => element.setAttribute('data-shown', 'true'));
    pageWidth.current = rect.width;
    Object.assign(copy.style, { position: 'absolute', top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, margin: '0' });
    target.replaceChildren(copy);
  }, [layout]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.dataset.intro = 'done';
    setLayout(null);
  }, []);

  const skip = useCallback(() => {
    skipping.current = true;
    playback.current?.stop();
    if (!scope.current) {
      finish();
      return;
    }
    animate(scope.current, { opacity: 0 }, { duration: 0.25 }).then(finish);
  }, [animate, scope, finish]);

  useEffect(() => {
    if (!layout) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [layout, skip]);

  useEffect(() => {
    const root = scope.current;
    const cardEl = card.current;
    if (!layout || !root || !cardEl) return;

    const speed = Math.max(0.25, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim')) || 1);
    const t = (seconds: number) => seconds * speed;

    const relaunch = kind.current === 'relaunch';
    const needed = ['[data-screen]', '[data-hand]', '[data-my-tile]', '[data-indicator]'];
    if ((relaunch && !cardEl.firstChild) || needed.some((selector) => !root.querySelector(selector))) {
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
    const icon = box('[data-my-tile]');
    const indicator = box('[data-indicator]');
    const statusHeight = box('[data-app-status]').height;
    const navHeight = box('[data-app-nav]').height;
    const { vw, vh } = layout;

    const tapOn = (rect: DOMRect): Point => ({
      x: rect.left + rect.width / 2 - vw / 2 - FINGERTIP.x * handScale,
      y: rect.top + rect.height / 2 - vh / 2 - FINGERTIP.y * handScale,
    });
    const fromIcon = (rect: DOMRect) =>
      `inset(${rect.top - screen.top}px ${screen.right - rect.right}px ${screen.bottom - rect.bottom}px ${rect.left - screen.left}px round ${rect.width * 0.225}px)`;
    const fullScreen = `inset(0px 0px 0px 0px round ${screenRadius}px)`;
    // The page as the open app: its whole width, from the top, scaled into the screen between the
    // status bar and the home indicator, the way a phone shows a site. On a phone-sized viewport
    // that is the page as it is; on a desktop it is the page's column, which can need more height
    // than the viewport, so the card grows to fit. The card scales from its top-left corner, so
    // each stage is "this crop lands on that box".
    const content = { left: screen.left, top: screen.top + statusHeight, width: screen.width, height: screen.height - statusHeight - navHeight };
    const aspect = content.width / content.height;
    const cropW = Math.min(vw, pageWidth.current || vw);
    const cropH = cropW / aspect;
    const cardH = Math.max(vh, cropH);
    const side = (vw - cropW) / 2;
    cardEl.style.height = `${cardH}px`;
    const land = (rect: { left: number; top: number; width: number }) => {
      const scale = rect.width / cropW;
      return { x: rect.left - side * scale, y: rect.top, scale };
    };
    const onPhone = land(content);
    // Closing it: the top square of the page (the header and my profile) shrinks into its icon.
    const onIcon = land(icon);
    const fullCard = `inset(0px 0px ${cardH - vh}px 0px round 0px)`;
    const phoneCard = `inset(0px ${side}px ${cardH - cropH}px ${side}px round 0px)`;
    const iconCard = `inset(0px ${side}px ${cardH - cropW}px ${side}px round ${cropW * 0.225}px)`;

    const swipe = tapOn(indicator);
    const swipeEnd = { x: swipe.x, y: swipe.y - screen.height * 0.3 };
    const tap = tapOn(icon);
    const zoom = Math.max(vw / layout.w, vh / layout.h) * 1.25;

    // Stage start times, in seconds at normal speed.
    const SHRINK = 0.2;
    const SWIPE = SHRINK + 0.95;
    const CLOSE = SWIPE + 0.35;
    const TAP = relaunch ? CLOSE + 0.75 : 0.95;
    const LAUNCH = TAP + 0.65;
    const EXIT = LAUNCH + 0.75;

    // Opening the app: a tap on its icon, its splash, then the phone zooms into the site.
    const open: AnimationSequence = [
      ['[data-hand]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(TAP + 0.35) }],
      ['[data-my-tile]', { scale: [1, 0.88, 1] }, { duration: t(0.25), at: t(TAP + 0.35) }],
      ['[data-hand]', { opacity: [1, 0], y: [tap.y, tap.y + 40] }, { duration: t(0.35), at: t(LAUNCH) }],
      ['[data-splash]', { opacity: [0, 1] }, { duration: t(0.05), at: t(LAUNCH) }],
      ['[data-splash]', { clipPath: [fromIcon(icon), fullScreen] }, { duration: t(0.5), ease: easeOut, at: t(LAUNCH) }],
      ['[data-splash-logo]', { opacity: [0, 1], scale: [0.85, 1] }, { duration: t(0.35), ease: easeOut, at: t(LAUNCH + 0.15) }],
      ['[data-splash-name]', { opacity: [0, 1], y: [6, 0] }, { duration: t(0.3), at: t(LAUNCH + 0.3) }],
      ['[data-splash-logo]', { scale: [1, 1.35], opacity: [1, 0] }, { duration: t(0.45), ease: easeOut, at: t(EXIT) }],
      ['[data-splash-name]', { opacity: [1, 0] }, { duration: t(0.25), at: t(EXIT) }],
      ['[data-splash]', { backgroundColor: pageColor }, { duration: t(0.4), at: t(EXIT + 0.1) }],
      ['[data-device]', { scale: [1, zoom] }, { duration: t(0.75), ease: easeInOut, at: t(EXIT + 0.15) }],
      [root, { opacity: [1, 0] }, { duration: t(0.3), at: t(EXIT + 0.8) }],
    ];

    // Note: a sequence holds each value's first keyframe from time 0, so anything that appears
    // later must start from its hidden value (opacity 0) in its first segment.
    const sequence: AnimationSequence = relaunch
      ? [
          // 1. The page shrinks into a phone: it was an app all along.
          [
            cardEl,
            { x: [0, onPhone.x], y: [0, onPhone.y], scale: [1, onPhone.scale], clipPath: [fullCard, phoneCard] },
            { duration: t(0.75), ease: easeInOut, at: t(SHRINK) },
          ],
          ['[data-device]', { opacity: [0, 1] }, { duration: t(0.4), at: t(SHRINK + 0.35) }],
          ['[data-app-bars]', { opacity: [0, 1] }, { duration: t(0.3), at: t(SHRINK + 0.5) }],

          // 2. A swipe up from the bottom edge closes it into its icon on the home screen.
          ['[data-hand]', { x: [swipe.x, swipe.x], y: [swipe.y + 70, swipe.y], opacity: [0, 1], rotate: [-8, 0] }, { duration: t(0.35), ease: easeOut, at: t(SWIPE) }],
          ['[data-hand]', { y: [swipe.y, swipeEnd.y] }, { duration: t(0.35), ease: easeOut, at: t(CLOSE) }],
          ['[data-app-bars]', { opacity: [1, 0] }, { duration: t(0.2), at: t(CLOSE) }],
          [
            cardEl,
            { x: [onPhone.x, onIcon.x], y: [onPhone.y, onIcon.y], scale: [onPhone.scale, onIcon.scale], clipPath: [phoneCard, iconCard] },
            { duration: t(0.5), ease: [0.3, 0, 0.2, 1], at: t(CLOSE) },
          ],
          [cardEl, { opacity: [1, 0] }, { duration: t(0.15), at: t(CLOSE + 0.38) }],
          ['[data-home]', { scale: [0.92, 1], opacity: [0.3, 1] }, { duration: t(0.5), ease: easeOut, at: t(CLOSE) }],
          ['[data-my-app]', { opacity: [0, 1] }, { duration: t(0.12), at: t(CLOSE + 0.38) }],

          // 3. A tap opens it again, and, as in the intro, the phone zooms back into the site.
          ['[data-hand]', { x: [swipeEnd.x, tap.x], y: [swipeEnd.y, tap.y] }, { duration: t(0.45), ease: easeOut, at: t(TAP - 0.15) }],
          ...open,
        ]
      : [
          // Coming back: the phone appears on its home screen, and a hand reaches for the app.
          ['[data-device]', { opacity: [0, 1], scale: [0.94, 1] }, { duration: t(0.5), ease: easeOut, at: t(0.1) }],
          [
            '[data-hand]',
            { x: [tap.x + vw * 0.25, tap.x], y: [tap.y + vh * 0.35, tap.y], opacity: [0, 1], rotate: [-12, 0] },
            { duration: t(0.5), ease: easeOut, at: t(TAP - 0.2) },
          ],
          ...open,
        ];

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
  }, [layout, animate, scope, finish]);

  if (!layout) return null;

  return (
    <div ref={scope} className={`${styles.overlay} ${styles.relaunch}`} data-intro-overlay>
      <div className={styles.stage} aria-hidden="true" style={{ '--w': `${layout.w}px`, '--h': `${layout.h}px` } as CSSProperties}>
        <div className={styles.device} data-device>
          <div className={styles.body} />
          <PhoneScreen time={layout.time} installed />
        </div>

        {/* The page itself, as the open app (filled in with a copy of the page before the first paint).
            Only the relaunch starts from the page; coming back starts from the home screen. */}
        <div ref={card} className={styles.card} hidden={kind.current !== 'relaunch'} inert />
        {/* The open app's system bars: the status bar on top, the home indicator at the bottom. */}
        <div className={styles.appBars} data-app-bars>
          <div className={styles.appStatus} data-app-status>
            <StatusBar time={layout.time} />
          </div>
          <div className={styles.appNav} data-app-nav>
            <span className={styles.indicator} data-indicator />
          </div>
        </div>

        <div className={styles.hand} data-hand>
          <HandArt />
        </div>
      </div>

      <button type="button" className={`${styles.skip} mono`} onClick={skip}>
        Skip
      </button>
    </div>
  );
}
