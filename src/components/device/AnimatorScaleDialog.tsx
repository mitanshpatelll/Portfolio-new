'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ANIMATOR_SCALES, scaleLabel, useDevice } from '@/components/device/DeviceProvider';
import styles from './Device.module.css';

export function AnimatorScaleDialog() {
  const device = useDevice();
  const open = device.dialog === 'animatorScale';
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const { setDialog } = device;
  const close = () => setDialog(null);

  useEffect(() => {
    if (open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.requestAnimationFrame(() => panel.current?.querySelector<HTMLInputElement>('input:checked')?.focus());
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setDialog(null);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    opener.current?.focus();
    opener.current = null;
  }, [open, setDialog]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.scrim}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={device.spring(0.3, 0)}
        >
          <motion.div
            ref={panel}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="animator-scale-title"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={device.spring(0.4, 0.18)}
          >
            <h2 id="animator-scale-title" className={styles.dialogTitle}>
              Animator duration scale
            </h2>
            <fieldset className={styles.dialogOptions}>
              <legend className="sr-only">Animation speed</legend>
              {ANIMATOR_SCALES.map((scale) => (
                <label key={scale} className={styles.dialogOption}>
                  <input
                    type="radio"
                    name="animator-scale"
                    checked={device.animScale === scale}
                    onChange={() => {
                      device.setAnimScale(scale);
                      close();
                    }}
                  />
                  {scaleLabel(scale)}
                </label>
              ))}
            </fieldset>
            <div className={styles.dialogActions}>
              <button type="button" className={styles.textButton} onClick={close}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
