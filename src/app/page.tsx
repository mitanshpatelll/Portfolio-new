import type { Metadata } from 'next';
import { Profile } from '@/components/home/Profile';
import { About, Activity, Apps, Contact, Experience, Skills, Writing } from '@/components/home/Sections';
import { Intro } from '@/components/intro/Intro';
import { Shell } from '@/components/site/Shell';
import { links, person } from '@/content/profile';

const title = `${person.name} · ${person.role}`;
const description = person.bio;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', title, description, url: '/' },
  twitter: { card: 'summary', title, description },
};

// GitHub and LeetCode numbers are fetched at build time and refreshed once a day.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <Intro />
      <Shell onHome>
        <Profile />
        <Apps />
        <Experience />
        <About />
        <Skills />
        <Writing />
        <Activity />
        <Contact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: person.name,
              jobTitle: person.role,
              description,
              knowsAbout: ['React Native', 'Expo', 'TypeScript', 'JavaScript', 'Offline-first apps'],
              sameAs: [links.github, links.leetcode, links.linkedin].filter(Boolean),
            }),
          }}
        />
      </Shell>
    </>
  );
}
