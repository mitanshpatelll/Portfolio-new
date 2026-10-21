import type { Metadata } from 'next';
import { Profile } from '@/components/home/Profile';
import { About, Activity, Apps, Contact, Experience, Links, Skills, Writing } from '@/components/home/Sections';
import { IntroLoader } from '@/components/intro/IntroLoader';
import { Shell } from '@/components/site/Shell';
import { links, person, site, skills } from '@/content/profile';

export const metadata: Metadata = {
  title: { absolute: site.title },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    title: site.title,
    description: site.description,
    firstName: 'Mitansh',
    lastName: 'Patel',
    username: links.githubUser,
    images: [site.image],
  },
};

// GitHub and LeetCode numbers are fetched at build time and refreshed once a day.
export const revalidate = 86400;

/**
 * Structured data: this page is the profile page of the person Mitansh Patel. ProfilePage is
 * what Google uses for personal profiles; sameAs ties the site to the same person on GitHub,
 * LeetCode and (once added) LinkedIn.
 */
function structuredData() {
  const personId = `${site.url}/#person`;
  const sameAs = [links.github, links.leetcode, links.linkedin].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: `${site.url}/`,
        name: `${person.name} Portfolio`,
        alternateName: person.name,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profile`,
        url: `${site.url}/`,
        name: site.title,
        description: site.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${site.url}/#website` },
        mainEntity: { '@id': personId },
        about: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: person.name,
        givenName: 'Mitansh',
        familyName: 'Patel',
        alternateName: ['Mitansh', links.githubUser, links.leetcodeUser],
        jobTitle: person.role,
        worksFor: { '@type': 'Organization', name: 'GlitchOver', url: 'https://www.glitchover.com' },
        description: person.bio,
        url: `${site.url}/`,
        image: `${site.url}${person.photo ?? site.image.url}`,
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
        knowsAbout: skills.flatMap((group) => group.items.map((item) => item.label)).slice(0, 30),
        hasOccupation: {
          '@type': 'Occupation',
          name: person.role,
          occupationLocation: { '@type': 'Country', name: person.location },
          skills: 'React Native, Expo, TypeScript, JavaScript, Android, iOS, offline-first apps',
        },
        sameAs,
      },
    ],
  };
}

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Shell onHome>
        <Profile />
        <Links />
        <Experience />
        <Writing />
        <Apps />
        <About />
        <Activity />
        <Skills />
        <Contact />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }} />
      </Shell>
    </>
  );
}
