import type { ReactNode } from 'react';
import { DevMode } from '@/components/device/DevMode';
import { Icon } from '@/components/ui/Icon';
import { links, person } from '@/content/profile';
import { ThemeToggle } from './ThemeToggle';
import styles from './Site.module.css';

const nav = [
  { href: '#apps', label: 'Apps' },
  { href: '#experience', label: 'Experience' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];

/** The bordered column every page sits in, with the header and footer. */
export function Shell({ children, onHome }: { children: ReactNode; onHome: boolean }) {
  return (
    <div className={styles.column} data-app-root>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Main">
          {!onHome && (
            <a href="/" className={styles.home}>
              {person.name}
            </a>
          )}
          {nav.map((item) => (
            <a key={item.href} href={onHome ? item.href : `/${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          {links.resume && (
            <a className={styles.pill} href={links.resume} target="_blank" rel="noreferrer">
              Resume
              <Icon name="external" />
            </a>
          )}
          <ThemeToggle />
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className={styles.footer}>
        <p>{`© 2026 ${person.name} · Built with Next.js and TypeScript`}</p>
        <DevMode />
      </footer>
    </div>
  );
}
