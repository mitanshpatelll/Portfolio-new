import 'server-only';

/** Pages that show activity are rebuilt at most once a day. */
const DAY = 60 * 60 * 24;

export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; weeks: ContributionDay[][] };
export type LeetCodeStats = { all: number; easy: number; medium: number; hard: number };

/** GitHub's public contribution calendar, read from the same HTML the profile page uses. */
export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const response = await fetch(`https://github.com/users/${user}/contributions`, { next: { revalidate: DAY } });
    if (!response.ok) return null;
    const html = await response.text();

    const days: ContributionDay[] = [];
    for (const match of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="([0-4])"/g)) {
      days.push({ date: match[1]!, level: Number(match[2]) as ContributionDay['level'] });
    }
    if (days.length === 0) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    // Columns are weeks starting on Sunday, like GitHub's own graph.
    const weeks: ContributionDay[][] = [];
    for (const day of days) {
      const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      if (weekday === 0 || weeks.length === 0) weeks.push([]);
      weeks[weeks.length - 1]!.push(day);
    }

    const totalText = html.replace(/\s+/g, ' ').match(/([\d,]+) contributions? in the last year/);
    const total = totalText ? Number(totalText[1]!.replace(/,/g, '')) : 0;
    return { total, weeks };
  } catch {
    return null;
  }
}

/** Solved-problem counts from LeetCode's public GraphQL API. */
export async function getLeetCodeStats(user: string): Promise<LeetCodeStats | null> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({
        query: 'query($u: String!) { matchedUser(username: $u) { submitStatsGlobal { acSubmissionNum { difficulty count } } } }',
        variables: { u: user },
      }),
      next: { revalidate: DAY },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as {
      data?: { matchedUser?: { submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] } } };
    };
    const counts = json.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
    if (!counts) return null;
    const count = (difficulty: string) => counts.find((item) => item.difficulty === difficulty)?.count ?? 0;
    return { all: count('All'), easy: count('Easy'), medium: count('Medium'), hard: count('Hard') };
  } catch {
    return null;
  }
}
