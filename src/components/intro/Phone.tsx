import type { ReactNode } from 'react';
import { person } from '@/content/profile';
import { AppIcon, homeApps, ObjectArt, StoreGlyph } from './IntroArt';
import styles from './Intro.module.css';

/** The phone's size for this viewport: tall portrait proportions (9:19.5), capped at 600px. */
export function phoneSize(vw: number, vh: number) {
  const h = Math.min(vh * (vw < 640 ? 0.62 : 0.7), 600);
  return { w: (h * 9) / 19.5, h };
}

/** The visitor's local time, shown in the phone's status bar. */
export function clockTime() {
  const now = new Date();
  return `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function StatusBar({ time }: { time: string }) {
  return (
    <div className={styles.status}>
      <span>{time}</span>
      <span className={styles.camera} />
      <span className={styles.statusIcons}>
        <svg viewBox="0 0 18 12" width="15" height="10" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 26 12" width="22" height="10" fill="none" stroke="currentColor">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" opacity="0.5" />
          <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="currentColor" stroke="none" />
        </svg>
      </span>
    </div>
  );
}

/** Home screen: the objects, now apps. `installed` adds my own app after the others. */
export function HomeScreen({ installed = false }: { installed?: boolean }) {
  return (
    <div className={styles.home} data-home>
      <div className={styles.grid}>
        {homeApps.grid.map((app) => (
          <span key={app.label} className={styles.app} data-app-object={app.object}>
            <span className={styles.appTile} data-app-tile>
              <ObjectArt index={app.object} />
            </span>
            <span className={styles.appLabel}>{app.label}</span>
          </span>
        ))}
        {installed && (
          <span className={styles.app} data-my-app>
            <span className={`${styles.appTile} ${styles.myTile}`} data-my-tile>
              <AppIcon className={styles.resultIcon} />
            </span>
            <span className={styles.appLabel}>{person.name}</span>
          </span>
        )}
      </div>
      <div className={styles.dock}>
        {homeApps.dock.map((app) =>
          app.object < 0 ? (
            <span key={app.label} className={styles.app} data-store-app>
              <span className={`${styles.appTile} ${styles.storeTile}`} data-store-icon>
                <StoreGlyph />
              </span>
              <span className={styles.appLabel}>{app.label}</span>
            </span>
          ) : (
            <span key={app.label} className={styles.app} data-app-object={app.object}>
              <span className={styles.appTile} data-app-tile>
                <ObjectArt index={app.object} />
              </span>
              <span className={styles.appLabel}>{app.label}</span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/** The app's splash screen: my icon and name, opened from wherever the app was tapped. */
export function Splash() {
  return (
    <div className={styles.splash} data-splash>
      <span className={styles.splashLogo} data-splash-logo>
        <AppIcon className={styles.splashIcon} />
      </span>
      <span className={styles.splashName} data-splash-name>
        {person.name}
      </span>
    </div>
  );
}

/** Children of the screen go between the status bar and the splash, e.g. the Store. */
export function PhoneScreen({ time, installed, children }: { time: string; installed?: boolean; children?: ReactNode }) {
  return (
    <div className={styles.screen} data-screen>
      <StatusBar time={time} />
      <HomeScreen installed={installed} />
      {children}
      <Splash />
    </div>
  );
}
