import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { BrandIcon, TagList } from '@/components/ui/Tag';
import type { App } from '@/content/profile';
import styles from './Home.module.css';

export function AppEntry({ app }: { app: App }) {
  const caseStudy = `/projects/${app.slug}/`;

  return (
    <article className={`card ${styles.app}`}>
      <div className={styles.appHead}>
        <a href={caseStudy} className={styles.appIconLink} tabIndex={-1} aria-hidden="true">
          <Image className={styles.appIcon} src={app.icon} alt="" width={56} height={56} />
        </a>
        <div className={styles.appTitle}>
          <h3 className={styles.appName}>
            <a href={caseStudy}>{app.name}</a>
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
          <a href={caseStudy}>
            <Icon name="file" />
            Case study
          </a>
          <a href={app.source} target="_blank" rel="noreferrer">
            <BrandIcon brand="github" />
            GitHub
          </a>
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

      <ul className={`${styles.facts} mono`}>
        {app.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <TagList tags={app.stack} />
    </article>
  );
}
