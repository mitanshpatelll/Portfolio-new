import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { Shell } from '@/components/site/Shell';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { BrandIcon, TagList } from '@/components/ui/Tag';
import { apps, person, site } from '@/content/profile';
import styles from './Project.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

async function appFor(params: Props['params']) {
  const { slug } = await params;
  return apps.find((app) => app.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await appFor(params);
  if (!app) return {};
  const url = `/projects/${app.slug}/`;
  return {
    title: app.metaTitle,
    description: app.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: app.metaTitle, description: app.description, url, images: [site.image] },
    twitter: { card: 'summary_large_image', title: app.metaTitle, description: app.description, images: [site.image] },
  };
}

const order = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * A made-up QR-like pattern (not a real code), shown blurred while there is no build to link to.
 * Three corner squares and a fixed scatter of cells, so it looks the same on every render.
 */
function PlaceholderQr() {
  const size = 25;
  let seed = 7;
  const next = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const inCorner = (x: number, y: number) => (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
  const cells: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inCorner(x, y) && next() > 0.52) cells.push([x, y]);
    }
  }
  const corners = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  return (
    <svg viewBox={`-1 -1 ${size + 2} ${size + 2}`} shapeRendering="crispEdges">
      {corners.map(([x = 0, y = 0]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="currentColor" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="var(--surface)" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

function Block({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.block}>
      <Reveal>
        <h2 className={styles.blockTitle}>{title}</h2>
        {children}
      </Reveal>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const app = await appFor(params);
  if (!app) notFound();
  const { engineering } = app;

  return (
    <Shell onHome={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                name: app.name,
                description: app.description,
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Android, iOS',
                url: `${site.url}/projects/${app.slug}/`,
                image: `${site.url}${app.icon}`,
                sameAs: app.source,
                author: { '@type': 'Person', '@id': `${site.url}/#person`, name: person.name, url: `${site.url}/` },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: person.name, item: `${site.url}/` },
                  { '@type': 'ListItem', position: 2, name: app.name, item: `${site.url}/projects/${app.slug}/` },
                ],
              },
            ],
          }),
        }}
      />
      <header className={styles.header}>
        <a className={`${styles.back} fade`} style={order(0)} href="/#apps">
          <Icon name="back" />
          All apps
        </a>
        <div className={styles.identity}>
          <Image className={`${styles.icon} fade`} style={order(1)} src={app.icon} alt="" width={72} height={72} priority />
          <div>
            <h1 className={`${styles.name} fade`} style={order(2)}>
              {app.name}
              <span className={`${styles.badge} mono`}>{app.status}</span>
            </h1>
            <p className={`${styles.platforms} fade`} style={order(3)}>
              {app.platforms.map((platform) => (
                <span key={platform}>
                  <BrandIcon brand={platform === 'android' ? 'android' : 'apple'} />
                  {platform === 'android' ? 'Android' : 'iOS'}
                </span>
              ))}
              <a href={app.source} target="_blank" rel="noreferrer">
                <BrandIcon brand="github" />
                Source
              </a>
            </p>
          </div>
        </div>
        <p className={`${styles.summary} fade`} style={order(4)}>
          {app.summary}
        </p>
        <div className="fade" style={order(5)}>
          <TagList tags={app.stack} />
        </div>

        {/* Try it on your phone: a QR code once there is a test build; until then, a note. */}
        <div className={`${styles.tryIt} fade`} style={order(6)}>
          <div className={styles.qr} aria-hidden="true">
            <PlaceholderQr />
            {!app.tryIt.url && <span className={`${styles.qrBadge} mono`}>Soon</span>}
          </div>
          <div>
            <p className={styles.tryTitle}>
              Try it on your phone
              {!app.tryIt.url && <span className={`${styles.badge} mono`}>In development</span>}
            </p>
            <p className={styles.tryText}>{app.tryIt.note}</p>
            {app.tryIt.url && (
              <a className={styles.tryLink} href={app.tryIt.url}>
                Get the test build
                <Icon name="arrowRight" />
              </a>
            )}
          </div>
        </div>

        {app.screenshots.length > 0 && (
          <ul className={`${styles.shots} fade`} style={order(7)} aria-label={`${app.name} screenshots`}>
            {app.screenshots.map((shot) => (
              <li key={shot.src}>
                <Image className={styles.shot} src={shot.src} alt={shot.alt} width={360} height={780} />
              </li>
            ))}
          </ul>
        )}
      </header>

      <Block title="The problem">
        <p className={styles.text}>{app.problem}</p>
      </Block>

      <Block title="What it does">
        <ul className={styles.features}>
          {app.features.map((feature) => (
            <li key={feature.title}>
              <span className={styles.featureIcon}>
                <Icon name={feature.icon} />
              </span>
              <span>
                <span className={styles.featureTitle}>{feature.title}</span>
                <span className={styles.featureText}>{feature.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="My role">
        <p className={styles.text}>{app.role}</p>
      </Block>

      <Block title="Where it stands">
        <ul className={styles.checklist}>
          {app.progress.built.map((item) => (
            <li key={item}>
              <Icon name="check" />
              {item}
            </li>
          ))}
        </ul>
        <p className={styles.next}>
          <span className="mono">Next</span>
          {app.progress.next}
        </p>
      </Block>

      <Block id="engineers" title="For engineers">
        <p className={styles.text}>{engineering.intro}</p>

        <h3 className={`${styles.subTitle} mono`}>How a bill syncs</h3>
        <ol className={styles.flow}>
          {engineering.flow.map((step, index) => (
            <li key={step.title}>
              <span className={`${styles.flowStep} mono`}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.flowTitle}>{step.title}</span>
              <span className={styles.flowText}>{step.text}</span>
            </li>
          ))}
        </ol>
        <p className={styles.footnote}>{engineering.flowNote}</p>

        <h3 className={`${styles.subTitle} mono`}>The hard parts</h3>
        <div className={styles.notes}>
          {engineering.hardParts.map((part) => (
            <article key={part.title}>
              <h4 className={styles.noteTitle}>{part.title}</h4>
              <p className={styles.noteText}>{part.text}</p>
            </article>
          ))}
        </div>

        <h3 className={`${styles.subTitle} mono`}>Decisions and trade-offs</h3>
        <div className={styles.decisions}>
          {engineering.decisions.map((decision) => (
            <article key={decision.choice}>
              <h4 className={styles.noteTitle}>{decision.choice}</h4>
              <p className={styles.noteText}>{decision.why}</p>
              <p className={styles.cost}>
                <span className="mono">Cost</span>
                {decision.cost}
              </p>
            </article>
          ))}
        </div>

        <h3 className={`${styles.subTitle} mono`}>Numbers</h3>
        <dl className={styles.numbers}>
          {engineering.numbers.map((number) => (
            <div key={number.label}>
              <dt>{number.label}</dt>
              <dd className="mono">{number.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.footnote}>{engineering.numbersNote}</p>

        <h3 className={`${styles.subTitle} mono`}>Stack</h3>
        <dl className={styles.stack}>
          {engineering.stack.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <h3 className={`${styles.subTitle} mono`}>Notes</h3>
        <div className={styles.notes}>
          {engineering.notes.map((note) => (
            <article key={note.title}>
              <h4 className={styles.noteTitle}>{note.title}</h4>
              <p className={styles.noteText}>{note.text}</p>
            </article>
          ))}
        </div>
      </Block>
    </Shell>
  );
}
