'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { useDevice } from '@/components/device/DeviceProvider';
import type { ContributionDay, Contributions, LeetCodeStats } from '@/lib/activity';
import styles from './Home.module.css';

type Tab = 'github' | 'leetcode';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityView({
  github,
  leetcode,
  githubUser,
  leetcodeUser,
}: {
  github: Contributions | null;
  leetcode: LeetCodeStats | null;
  githubUser: string;
  leetcodeUser: string;
}) {
  const { spring } = useDevice();
  const tabs = [...(github ? (['github'] as const) : []), ...(leetcode ? (['leetcode'] as const) : [])];
  const [tab, setTab] = useState<Tab>(tabs[0] ?? 'github');

  return (
    <div>
      {tabs.length > 1 && (
        <div className={`${styles.tabs} mono`} role="tablist" aria-label="Activity source">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              className={styles.tab}
              onClick={() => setTab(name)}
            >
              {tab === name && <motion.span layoutId="activity-tab" className={styles.tabPill} transition={spring(0.35, 0.15)} />}
              <span className={styles.tabText}>{name === 'github' ? 'GitHub' : 'LeetCode'}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'github' && github && <Graph github={github} user={githubUser} />}
      {tab === 'leetcode' && leetcode && <Solved stats={leetcode} user={leetcodeUser} />}
    </div>
  );
}

function Graph({ github, user }: { github: Contributions; user: string }) {
  // Pad the first and last weeks so every column has seven rows, Sunday first.
  const cells: (ContributionDay | null)[] = [];
  github.weeks.forEach((week, index) => {
    const padding = 7 - week.length;
    if (index === 0) cells.push(...Array<null>(padding).fill(null), ...week);
    else cells.push(...week, ...Array<null>(padding).fill(null));
  });

  const months: { label: string; column: number }[] = [];
  github.weeks.forEach((week, index) => {
    const first = week[0];
    if (!first) return;
    const month = Number(first.date.slice(5, 7)) - 1;
    const previous = months[months.length - 1];
    if (!previous || MONTHS[month] !== previous.label) months.push({ label: MONTHS[month]!, column: index + 1 });
  });

  return (
    <figure className={styles.graphFigure}>
      <div className={styles.graphScroll}>
        <div className={styles.graph}>
          <div
            className={`${styles.months} mono`}
            aria-hidden="true"
            style={{ gridTemplateColumns: `repeat(${github.weeks.length}, var(--cell))` }}
          >
            {months.map((month) => (
              <span key={`${month.label}-${month.column}`} style={{ gridColumn: month.column }}>
                {month.label}
              </span>
            ))}
          </div>
          <div
            className={styles.cells}
            role="img"
            aria-label={`${github.total} GitHub contributions in the last year`}
            style={{ gridTemplateColumns: `repeat(${github.weeks.length}, var(--cell))` }}
          >
            {cells.map((day, index) =>
              day ? (
                <span key={day.date} className={styles.cell} data-level={day.level} title={day.date} />
              ) : (
                <span key={`pad-${index}`} className={styles.cellEmpty} />
              ),
            )}
          </div>
        </div>
      </div>
      <figcaption className={`${styles.graphCaption} mono`}>
        <span>{`${github.total} contributions in the last year`}</span>
        <span className={styles.legend} aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={styles.cell} data-level={level} />
          ))}
          More
        </span>
      </figcaption>
      <a className={`${styles.sourceLink} mono`} href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
        {`github.com/${user}`}
      </a>
    </figure>
  );
}

function Solved({ stats, user }: { stats: LeetCodeStats; user: string }) {
  const rows = [
    { label: 'Easy', count: stats.easy, tone: styles.easy },
    { label: 'Medium', count: stats.medium, tone: styles.medium },
    { label: 'Hard', count: stats.hard, tone: styles.hard },
  ];

  return (
    <div className={styles.solved}>
      <p className={styles.solvedTotal}>
        <strong>{stats.all}</strong> problems solved
      </p>
      <dl className={styles.solvedRows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.solvedRow}>
            <dt className="mono">{row.label}</dt>
            <dd>
              <span className={styles.bar}>
                <span className={`${styles.barFill} ${row.tone}`} style={{ width: `${stats.all ? (row.count / stats.all) * 100 : 0}%` }} />
              </span>
              <span className="mono">{row.count}</span>
            </dd>
          </div>
        ))}
      </dl>
      <a className={`${styles.sourceLink} mono`} href={`https://leetcode.com/u/${user}/`} target="_blank" rel="noreferrer">
        {`leetcode.com/u/${user}`}
      </a>
    </div>
  );
}
