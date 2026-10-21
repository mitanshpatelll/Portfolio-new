import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Home.module.css';

export function Section({
  id,
  title,
  more,
  note,
  children,
}: {
  id: string;
  title: string;
  more?: { href: string; label: string };
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <Reveal>
        <div className={styles.titleRow}>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          {more && (
            <a className={styles.more} href={more.href}>
              {more.label}
              <Icon name="arrowRight" />
            </a>
          )}
        </div>
        {note && <p className={`${styles.note} mono`}>{note}</p>}
        {children}
      </Reveal>
    </section>
  );
}

/** Turns **phrase** into bold text, for copy written in the content file. */
export function rich(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 ? <strong key={index}>{part}</strong> : part));
}
