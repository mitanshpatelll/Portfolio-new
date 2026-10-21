'use client';

import { motion } from 'motion/react';
import { useDevice } from '@/components/device/DeviceProvider';
import { cx } from '@/lib/events';
import styles from './Switch.module.css';

/** Material 3 switch. Visual only: the row around it is the control, as on Android. */
export function Switch({ checked }: { checked: boolean }) {
  const { spring } = useDevice();

  return (
    <span className={cx(styles.switch, checked && styles.on)} aria-hidden="true">
      <motion.span layout className={styles.thumb} style={{ borderRadius: 999 }} transition={spring(0.35, 0.3)} />
    </span>
  );
}
