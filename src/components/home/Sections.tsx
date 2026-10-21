import { CopyEmail } from '@/components/site/CopyEmail';
import { Icon, type IconName } from '@/components/ui/Icon';
import { BrandIcon, TagList } from '@/components/ui/Tag';
import type { Brand } from '@/components/ui/brands';
import { about, apps, experience, links, skills, writing } from '@/content/profile';
import { getContributions, getLeetCodeStats } from '@/lib/activity';
import { ActivityView } from './ActivityView';
import { AppEntry } from './AppEntry';
import { JobItem } from './JobItem';
import { rich, Section } from './Section';
import styles from './Home.module.css';


export function Apps() {
  return (
    <Section id="apps" title="Apps" note="One codebase, two platforms: React Native for Android and iOS.">
      <div className={styles.apps}>
        {apps.map((app) => (
          <AppEntry key={app.slug} app={app} />
        ))}
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className={`card ${styles.jobs}`}>
        {experience.map((job, index) => (
          <JobItem key={`${job.company}-${job.period}`} job={job} defaultOpen={index === 0} />
        ))}
      </div>
    </Section>
  );
}

export function About() {
  return (
    <Section id="about" title="About">
      <div className={`card ${styles.about}`}>
        {about.map((paragraph) => (
          <p key={paragraph}>{rich(paragraph)}</p>
        ))}
      </div>
    </Section>
  );
}

export function Writing() {
  return (
    <Section id="writing" title="Writing" more={{ href: '/blog/', label: 'All articles' }}>
      <div className={styles.posts}>
        {writing.map((post) => (
          <a key={post.href} className={`card ${styles.post}`} href={post.href}>
            <span className={styles.postTitle}>{post.title}</span>
            <span className={styles.postSummary}>{post.summary}</span>
            <span className={styles.postMeta}>
              <TagList tags={post.tags.map((label) => ({ label }))} />
              <time className={`${styles.postDate} mono`} dateTime={post.date}>
                <Icon name="calendar" />
                {post.dateLabel}
              </time>
            </span>
            <span className={styles.readMore}>
              Read
              <Icon name="arrowRight" />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}

/** Live numbers from GitHub and LeetCode, refreshed daily. Hidden if both are unreachable. */
export async function Activity() {
  const [github, leetcode] = await Promise.all([getContributions(links.githubUser), getLeetCodeStats(links.leetcodeUser)]);
  if (!github && !leetcode) return null;

  return (
    <Section id="activity" title="Activity">
      <div className={`card ${styles.activityCard}`}>
        <ActivityView github={github} leetcode={leetcode} githubUser={links.githubUser} leetcodeUser={links.leetcodeUser} />
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className={styles.skillGroups}>
        {skills.map((group) => (
          <div key={group.group} className={`card ${styles.skillGroup}`}>
            <p className={`${styles.groupLabel} mono`}>{group.group}</p>
            <TagList tags={group.items} />
          </div>
        ))}
      </div>
    </Section>
  );
}

type ContactRow = { href: string; name: string; handle: string; note: string; brand?: Brand; icon?: IconName; copy?: string };

export function Contact() {
  const rows: ContactRow[] = [
    ...(links.email
      ? [{ href: `mailto:${links.email}`, name: 'Email', handle: links.email, note: 'Best for roles and opportunities.', icon: 'mail' as const, copy: links.email }]
      : []),
    ...(links.linkedin
      ? [{ href: links.linkedin, name: 'LinkedIn', handle: links.linkedin.replace(/^https?:\/\/(www\.)?/, ''), note: 'Work history and recommendations.', icon: 'link' as const }]
      : []),
    { href: links.github, name: 'GitHub', handle: links.githubUser, note: "Code, including Billify's app.", brand: 'github' },
    { href: links.leetcode, name: 'LeetCode', handle: links.leetcodeUser, note: 'Problem-solving practice.', brand: 'leetcode' },
    ...(links.resume ? [{ href: links.resume, name: 'Resume', handle: 'PDF', note: 'One page, up to date.', icon: 'download' as const }] : []),
  ];

  return (
    <Section id="contact" title="Contact">
      <p className={styles.contactIntro}>{"I'm open to React Native roles. The quickest way to reach me is below."}</p>
      <ul className={`card ${styles.contactRows}`}>
        {rows.map((row) => (
          <li key={row.name} className={styles.contactRow}>
            <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className={styles.contactIcon}>
                {row.brand ? <BrandIcon brand={row.brand} size={16} /> : row.icon && <Icon name={row.icon} />}
              </span>
              <span className={styles.contactText}>
                <span className={styles.contactName}>
                  {row.name}
                  <span className={`${styles.contactHandle} mono`}>{row.handle}</span>
                </span>
                <span className={styles.contactNote}>{row.note}</span>
              </span>
              <Icon name="arrowRight" className={styles.contactArrow} />
            </a>
            {row.copy && <CopyEmail email={row.copy} />}
          </li>
        ))}
      </ul>
    </Section>
  );
}
