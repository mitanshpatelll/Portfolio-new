import { CopyEmail } from '@/components/site/CopyEmail';
import { Icon, type IconName } from '@/components/ui/Icon';
import { BrandIcon, TagList } from '@/components/ui/Tag';
import type { Brand } from '@/components/ui/brands';
import { about, experience, links, showcase, skills, writing } from '@/content/profile';
import { getContributions, getLeetCodeStats } from '@/lib/activity';
import { Reveal } from '@/components/ui/Reveal';
import { ActivityView } from './ActivityView';
import { AppEntry } from './AppEntry';
import { JobItem } from './JobItem';
import { rich, Section } from './Section';
import styles from './Home.module.css';


export function Apps() {
  return (
    <Section id="apps" title="Apps" note="One codebase, two platforms: React Native for Android and iOS.">
      <div className={styles.apps}>
        {showcase.map((app) => (
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
      <div className={`card ${styles.posts}`}>
        {writing.map((post) => (
          <a key={post.href} className={styles.post} href={post.href}>
            <span className={styles.postTitle}>{post.title}</span>
            <time className={`${styles.postDate} mono`} dateTime={post.date}>
              {post.dateLabel}
            </time>
            <span className={styles.postSummary}>{post.summary}</span>
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
      <dl className={`card ${styles.skillGroups}`}>
        {skills.map((group) => (
          <div key={group.group} className={styles.skillGroup}>
            <dt className={`${styles.groupLabel} mono`}>{group.group}</dt>
            <dd>
              <TagList tags={group.items} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

type ContactLink = { href: string; name: string; handle: string; note: string; brand?: Brand; icon?: IconName; copy?: string };

/** Every way to reach me that is filled in, in the order a recruiter would pick. */
function contactLinks(): ContactLink[] {
  return [
    ...(links.email
      ? [{ href: `mailto:${links.email}`, name: 'Email', handle: links.email, note: 'Best for roles and opportunities.', icon: 'mail' as const, copy: links.email }]
      : []),
    ...(links.linkedin
      ? [{ href: links.linkedin, name: 'LinkedIn', handle: links.linkedin.replace(/^https?:\/\/(www\.)?/, ''), note: 'Work history and recommendations.', icon: 'link' as const }]
      : []),
    { href: links.github, name: 'GitHub', handle: links.githubUser, note: "Code, including Billify's app.", brand: 'github' },
    { href: links.leetcode, name: 'LeetCode', handle: links.leetcodeUser, note: 'Problem-solving practice.', brand: 'leetcode' },
  ];
}

/** Profiles as small cards right under the profile, each with a line on what is there. */
export function Links() {
  return (
    <section className={styles.linksSection} aria-label="Links">
      <Reveal>
        <ul className={styles.linkGrid}>
          {contactLinks().map((link) => (
            <li key={link.name} className={`card ${styles.linkCard}`}>
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="me noreferrer">
                <span className={styles.linkIcon}>
                  {link.brand ? <BrandIcon brand={link.brand} size={16} /> : link.icon && <Icon name={link.icon} />}
                </span>
                <span className={styles.linkText}>
                  <span className={styles.linkName}>
                    {link.name}
                    <span className={`${styles.linkHandle} mono`}>{link.handle}</span>
                  </span>
                  <span className={styles.linkNote}>{link.note}</span>
                </span>
                <Icon name="arrowRight" className={styles.linkArrow} />
              </a>
              {link.copy && <CopyEmail email={link.copy} />}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/** The closing call to action: a line and the quickest ways to reach me, as buttons. */
export function Contact() {
  // The first two ways to reach me (email and LinkedIn once they are filled in), plus the resume.
  const buttons = contactLinks().slice(0, 2);
  if (links.resume) buttons.push({ href: links.resume, name: 'Resume', handle: 'PDF', note: '', icon: 'download' });

  return (
    <Section id="contact" title="Let's work together">
      <div className={`card ${styles.cta}`}>
        <p className={styles.ctaText}>
          {"I'm open to React Native roles: building apps for Android and iOS that stay fast and keep working offline. The quickest way to reach me is below."}
        </p>
        <div className={styles.ctaButtons}>
          {buttons.map((button, index) => (
            <a
              key={button.name}
              className={index === 0 ? `${styles.button} ${styles.buttonPrimary}` : styles.button}
              href={button.href}
              target={button.href.startsWith('http') ? '_blank' : undefined}
              rel="me noreferrer"
            >
              {button.brand ? <BrandIcon brand={button.brand} size={14} /> : button.icon && <Icon name={button.icon} />}
              {button.name === 'Email' ? 'Email me' : button.name}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
