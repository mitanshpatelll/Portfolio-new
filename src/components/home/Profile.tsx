import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CopyEmail } from '@/components/site/CopyEmail';
import { BrandIcon } from '@/components/ui/Tag';
import { links, person } from '@/content/profile';
import styles from './Home.module.css';

const order = (i: number) => ({ '--i': i }) as CSSProperties;

export function Profile() {

  return (
    <section className={styles.profile} aria-label="Profile">
      <div className={styles.profileTop}>
        {/* The photo is shaped like an app icon, with a notification badge for "open to work". */}
        <span className={`${styles.avatar} fade`} style={order(0)}>
          {person.photo ? (
            <Image className={styles.photo} src={person.photo} alt={person.name} width={64} height={64} priority />
          ) : (
            <span className={`${styles.photo} ${styles.initials}`} aria-hidden="true">
              {person.initial}
            </span>
          )}
          <span className={styles.avatarBadge} title={person.status} aria-hidden="true" />
        </span>
        <div className={styles.profileText}>
          <h1 className={`${styles.name} fade`} style={order(1)}>
            {person.name}
          </h1>
          <p className={`${styles.metaLine} fade`} style={order(2)}>
            <span>{person.role}</span>
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
            <span className={styles.platformLine}>
              <BrandIcon brand="android" />
              Android
              <span aria-hidden="true">&amp;</span>
              <BrandIcon brand="apple" />
              iOS
            </span>
            {links.email && (
              <>
                <span className={styles.sep} aria-hidden="true">
                  ·
                </span>
                <a href={`mailto:${links.email}`}>{links.email}</a>
                <CopyEmail email={links.email} />
              </>
            )}
          </p>
        </div>
      </div>

      <p className={`${styles.bio} fade`} style={order(3)}>
        {person.bio}
      </p>

      <p className={`${styles.status} mono fade`} style={order(4)}>
        <span className={styles.dot} aria-hidden="true" />
        {`${person.status} · ${person.location}`}
      </p>
    </section>
  );
}
