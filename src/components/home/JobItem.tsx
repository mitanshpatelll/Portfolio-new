'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { useDevice } from '@/components/device/DeviceProvider';
import { Icon } from '@/components/ui/Icon';
import { TagList } from '@/components/ui/Tag';
import type { experience } from '@/content/profile';
import styles from './Home.module.css';

type Job = (typeof experience)[number];

export function JobItem({ job, defaultOpen }: { job: Job; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { spring } = useDevice();
  const panel = useId();
  const placeholder = job.company.startsWith('[');

  return (
    <div className={styles.job}>
      <button
        type="button"
        className={styles.jobButton}
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen(!open)}
      >
        {job.logo ? (
          // A small local logo, so a plain <img> is enough.
          <img className={styles.logo} src={job.logo} alt="" width={36} height={36} />
        ) : (
          <span className={styles.logo} aria-hidden="true">
            {placeholder ? <Icon name="building" /> : job.company.charAt(0)}
          </span>
        )}
        <span className={styles.jobMain}>
          <span className={styles.company}>
            {job.company}
            {job.current && <span className={`${styles.badge} mono`}>Current</span>}
          </span>
          <span className={styles.roleLine}>{`${job.role} · ${job.type}`}</span>
        </span>
        <span className={`${styles.period} mono`}>{job.period}</span>
        <Icon name="chevronRight" className={styles.chevron} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring(0.4, 0)}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.jobBody}>
              <p className={styles.jobSummary}>{job.summary}</p>
              <ul className={styles.points}>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <TagList tags={job.tech} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
