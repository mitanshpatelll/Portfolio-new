'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useDevice } from '@/components/device/DeviceProvider';
import { person } from '@/content/profile';
import styles from './Device.module.css';

export function Toast() {
  const { toast, spring } = useDevice();

  return (
    // The live region stays mounted so screen readers announce each new message.
    <div className={styles.toastRegion} role="status" aria-live="polite">
      {/* popLayout: a leaving toast steps out of the row so the next one takes its place. */}
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key={toast.id}
            className={styles.toast}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={spring(0.35, 0.2)}
          >
            <span className={styles.toastIcon} aria-hidden="true">
              {person.initial}
            </span>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
