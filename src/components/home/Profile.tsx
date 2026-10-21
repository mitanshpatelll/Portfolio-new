import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CopyEmail } from '@/components/site/CopyEmail';
import { Icon, type IconName } from '@/components/ui/Icon';
import { BrandIcon } from '@/components/ui/Tag';
import type { Brand } from '@/components/ui/brands';
import { apps, links, person } from '@/content/profile';
import styles from './Home.module.css';

const order = (i: number) => ({ '--i': i }) as CSSProperties;

type Social = { href: string; label: string; brand?: Brand; icon?: IconName };

export function Profile() {
  const socials: Social[] = [
    { href: links.github, label: 'GitHub', brand: 'github' },
    { href: links.leetcode, label: 'LeetCode', brand: 'leetcode' },
    ...(links.linkedin ? [{ href: links.linkedin, label: 'LinkedIn', icon: 'link' as const }] : []),
    ...(links.email ? [{ href: `mailto:${links.email}`, label: 'Email', icon: 'mail' as const }] : []),
  ];
  const nowApp = apps.find((app) => app.slug === person.now.app);

  return (
    <section className={styles.profile} aria-label="Profile">
      <div className={styles.profileTop}>
        {/* The photo is shaped like an app icon, with a notification badge for "open to work". */}
        <span className={`${styles.avatar} fade`} style={order(0)}>
          {person.photo ? (
            <Image className={styles.photo} src={person.photo} alt={person.name} width={88} height={88} priority />
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
            <span aria-hidden="true">·</span>
            <span className={styles.platformLine}>
              <BrandIcon brand="android" />
              Android
              <span aria-hidden="true">&amp;</span>
              <BrandIcon brand="apple" />
              iOS
            </span>
            {links.email && (
              <>
                <span aria-hidden="true">·</span>
                <a href={`mailto:${links.email}`}>{links.email}</a>
                <CopyEmail email={links.email} />
              </>
            )}
          </p>
          <ul className={`${styles.socials} fade`} style={order(3)}>
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  {social.brand ? <BrandIcon brand={social.brand} size={16} /> : social.icon && <Icon name={social.icon} />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={`${styles.bio} fade`} style={order(4)}>
        {person.bio}
      </p>

      {nowApp && (
        // What I'm working on, as a phone notification. It drops in like one, too.
        <a className={styles.notification} href={`/projects/${nowApp.slug}/`}>
          <Image className={styles.notificationIcon} src={nowApp.icon} alt="" width={38} height={38} />
          <span className={styles.notificationBody}>
            <span className={styles.notificationHead}>
              <span>{nowApp.name}</span>
              <span className="mono">now</span>
            </span>
            <span className={styles.notificationTitle}>{person.now.title}</span>
            <span className={styles.notificationText}>{person.now.text}</span>
          </span>
        </a>
      )}

      <p className={`${styles.status} mono fade`} style={order(6)}>
        <span className={styles.dot} aria-hidden="true" />
        {`${person.status} · ${person.location}`}
      </p>
    </section>
  );
}
