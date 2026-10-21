import type { Metadata } from 'next';
import { AppIcon, homeApps, ObjectArt, StoreGlyph } from '@/components/intro/IntroArt';
import { Icon } from '@/components/ui/Icon';
import { Shell } from '@/components/site/Shell';
import { apps, person } from '@/content/profile';
import { RequestedPath } from './RequestedPath';
import styles from './NotFound.module.css';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

/**
 * The 404 page, as a phone with a system dialog over its home screen: the screen asked for is not
 * in the app. The clock reads 4:04. The phone is decoration; the real way out is the text beside it.
 */
export default function NotFound() {
  const featured = apps[0];

  return (
    <Shell onHome={false}>
      <section className={styles.page} aria-labelledby="not-found-title">
        <div className={styles.text}>
          <p className={`${styles.eyebrow} mono`}>Error 404</p>
          <h1 id="not-found-title" className={styles.title}>
            This screen isn&apos;t in the app
          </h1>
          <p className={styles.lead}>
            The page you&apos;re looking for doesn&apos;t exist. It may have moved, or the link has a typo.
          </p>
          <div className={styles.actions}>
            <a className={`${styles.button} ${styles.primary}`} href="/">
              <Icon name="arrowRight" className={styles.back} />
              Back to home
            </a>
            {featured && (
              <a className={styles.button} href={`/projects/${featured.slug}/`}>
                {`${featured.name} case study`}
              </a>
            )}
          </div>
          <p className={`${styles.trace} mono`}>
            <RequestedPath />
          </p>
        </div>

        <div className={styles.phone} aria-hidden="true">
          <div className={styles.screen}>
            <div className={styles.status}>
              <span>4:04</span>
              <span className={styles.camera} />
              <span className={styles.statusIcons}>
                <svg viewBox="0 0 18 12" width="15" height="10" fill="currentColor">
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                  <rect x="10" y="3" width="3" height="9" rx="1" opacity="0.35" />
                  <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
                </svg>
                <svg viewBox="0 0 26 12" width="22" height="10" fill="none" stroke="currentColor">
                  <rect x="0.5" y="0.5" width="22" height="11" rx="3" opacity="0.5" />
                  <rect x="2.5" y="2.5" width="4" height="7" rx="1.5" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>

            {/* The home screen, dimmed behind the dialog */}
            <div className={styles.home}>
              <div className={styles.grid}>
                {homeApps.grid.map((app) => (
                  <span key={app.label} className={styles.app}>
                    <span className={styles.tile}>
                      <ObjectArt index={app.object} />
                    </span>
                    {app.label}
                  </span>
                ))}
              </div>
              <div className={styles.dock}>
                {homeApps.dock.map((app) => (
                  <span key={app.label} className={styles.tile}>
                    {app.object < 0 ? <StoreGlyph /> : <ObjectArt index={app.object} />}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.scrim} />

            <div className={styles.dialog}>
              <AppIcon className={styles.dialogIcon} />
              <p className={styles.dialogTitle}>Screen not found</p>
              <p className={styles.dialogText}>{`${person.name} can't open this page.`}</p>
              <span className={styles.dialogButtons}>
                <span>Close</span>
                <span className={styles.dialogPrimary}>Go home</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
