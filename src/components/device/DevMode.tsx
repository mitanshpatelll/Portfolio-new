'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Switch } from '@/components/ui/Switch';
import { site } from '@/content/profile';
import { cx } from '@/lib/events';
import { scaleLabel, useDevice } from './DeviceProvider';
import styles from './Device.module.css';

const TAPS_TO_UNLOCK = 7;

/**
 * A small treat for engineers, out of the way of everyone else: tap the version number
 * in the footer seven times, as you would tap "Build number" on an Android phone.
 */
export function DevMode() {
  const device = useDevice();
  const [open, setOpen] = useState(false);
  const taps = useRef(0);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.toggleAttribute('data-bounds', device.bounds);
  }, [device.bounds]);

  const tap = () => {
    if (device.devUnlocked) {
      setOpen(true);
      return;
    }
    taps.current += 1;
    const left = TAPS_TO_UNLOCK - taps.current;
    if (left <= 0) {
      taps.current = 0;
      device.setDevUnlocked(true);
      device.showToast('You are now a developer.');
      setOpen(true);
    } else if (taps.current >= 3) {
      device.showToast(`You are now ${left} ${left === 1 ? 'step' : 'steps'} away from being a developer.`);
    }
  };

  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  return (
    <>
      <button ref={opener} type="button" className={styles.version} onClick={tap}>
        {device.devUnlocked ? `Version ${site.version} · Developer mode` : `Version ${site.version}`}
      </button>
      <DevSheet open={open} onClose={close} />
    </>
  );
}

function DevSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const device = useDevice();
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => sheet.current?.querySelector<HTMLElement>('button, a')?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // The animation-speed dialog sits on top and handles its own Escape.
      if (event.key === 'Escape' && !device.dialog) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, device.dialog]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className={styles.sheetScrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={device.spring(0.3, 0)}
          />
          <motion.div
            key="sheet"
            ref={sheet}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-mode-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={device.spring(0.45, 0.08)}
          >
            <div className={styles.grabber} aria-hidden="true" />
            <h2 id="dev-mode-title" className={styles.sheetTitle}>
              Developer mode
            </h2>
            <p className={styles.sheetText}>For curious engineers. Everyone else: nothing important here.</p>
            <ul className={styles.list}>
              <li>
                <div className={styles.row}>
                  <span className="tile tone-stone">
                    <Icon name="code" />
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>This site</span>
                    <span className={styles.rowSub}>
                      Next.js 16, React 19, Motion and TypeScript. Pages are built ahead of time, GitHub and LeetCode numbers refresh daily, and all the words live in one typed file.
                    </span>
                  </span>
                </div>
              </li>
              <li>
                <SheetButton
                  role="switch"
                  checked={device.bounds}
                  onClick={() => device.setBounds(!device.bounds)}
                  icon="layout"
                  tone="olive"
                  title="Show layout bounds"
                  sub="Outline every element on the page"
                />
              </li>
              <li>
                <SheetButton
                  onClick={() => device.setDialog('animatorScale')}
                  icon="timer"
                  tone="clay"
                  title="Animation speed"
                  sub={scaleLabel(device.animScale)}
                />
              </li>
              <li>
                {/* ?intro forces the opening to play again, at the animation speed set above. */}
                <a className={styles.row} href="/?intro">
                  <span className="tile tone-olive">
                    <Icon name="phone" />
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>Replay intro</span>
                    <span className={styles.rowSub}>The opening animation, at the speed set above</span>
                  </span>
                </a>
              </li>
              <li>
                <a className={styles.row} href="/projects/billify/#engineers" onClick={onClose}>
                  <span className="tile tone-accent">
                    <Icon name="braces" />
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>Billify engineering notes</span>
                    <span className={styles.rowSub}>Offline sync, money in paise, test numbers</span>
                  </span>
                </a>
              </li>
            </ul>
            <button
              type="button"
              className={cx(styles.row, styles.off)}
              onClick={() => {
                device.setDevUnlocked(false);
                device.showToast('Developer mode is off.');
                onClose();
              }}
            >
              Turn off developer mode
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetButton({
  role,
  checked,
  onClick,
  icon,
  tone,
  title,
  sub,
}: {
  role?: 'switch';
  checked?: boolean;
  onClick: () => void;
  icon: 'layout' | 'timer';
  tone: 'olive' | 'clay';
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      className={styles.row}
      role={role}
      aria-checked={role === 'switch' ? Boolean(checked) : undefined}
      onClick={onClick}
    >
      <span className={`tile tone-${tone}`}>
        <Icon name={icon} />
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{title}</span>
        <span className={styles.rowSub}>{sub}</span>
      </span>
      {role === 'switch' && <Switch checked={Boolean(checked)} />}
    </button>
  );
}
