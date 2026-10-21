import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { BrandIcon, TagList } from '@/components/ui/Tag';
import type { AppCard } from '@/content/profile';
import styles from './Home.module.css';

export function AppEntry({ app }: { app: AppCard }) {
  const caseStudy = app.caseStudy ? `/projects/${app.slug}/` : null;
  // The icon and name lead to the case study, or else to the first store listing.
  const home = caseStudy ?? app.stores?.[0]?.href;
  const external = !caseStudy && !!home;

  return (
    <article className={`card ${styles.app}`}>
      <div className={styles.appHead}>
        {home ? (
          <a
            href={home}
            className={styles.appIconLink}
            tabIndex={-1}
            aria-hidden="true"
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            <Image className={styles.appIcon} src={app.icon} alt="" width={44} height={44} />
          </a>
        ) : (
          <Image className={styles.appIcon} src={app.icon} alt="" width={44} height={44} />
        )}
        <div className={styles.appTitle}>
          <h3 className={styles.appName}>
            {home ? (
              <a href={home} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {app.name}
              </a>
            ) : (
              app.name
            )}
            <span className={`${styles.badge} mono`}>{app.status}</span>
          </h3>
          <p className={styles.platforms}>
            {app.platforms.map((platform) => (
              <span key={platform}>
                <BrandIcon brand={platform === 'android' ? 'android' : 'apple'} />
                {platform === 'android' ? 'Android' : 'iOS'}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.appLinks}>
          {caseStudy && (
            <a href={caseStudy}>
              <Icon name="file" />
              Case study
            </a>
          )}
          {app.source && (
            <a href={app.source} target="_blank" rel="noreferrer">
              <BrandIcon brand="github" />
              GitHub
            </a>
          )}
          {app.stores?.map((store) => (
            <a key={store.store} href={store.href} target="_blank" rel="noreferrer">
              <BrandIcon brand={store.store === 'App Store' ? 'apple' : 'android'} />
              {store.store}
            </a>
          ))}
        </div>
      </div>

      <p className={styles.appText}>{app.oneLiner}</p>

      {app.screenshots.length > 0 && (
        <ul className={styles.shots} aria-label={`${app.name} screenshots`}>
          {app.screenshots.map((shot) => (
            <li key={shot.src}>
              <Image className={styles.shot} src={shot.src} alt={shot.alt} width={300} height={650} />
            </li>
          ))}
        </ul>
      )}

      <div className={styles.factsClip}>
        <ul className={`${styles.facts} mono`}>
          {app.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
      <TagList tags={app.stack} />
    </article>
  );
}
