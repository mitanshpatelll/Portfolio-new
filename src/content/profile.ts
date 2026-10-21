import type { IconName } from '@/components/ui/Icon';
import type { Brand } from '@/components/ui/brands';

/**
 * Everything the site says lives in this file. Anything set to null is simply not shown,
 * so fill those in as you have them. Real details (photo, company, numbers, screenshots)
 * are what make a portfolio feel like a person made it.
 */

/**
 * The live address, used for canonical links, the sitemap and share previews. Set
 * NEXT_PUBLIC_SITE_URL to your own domain; on Vercel the production domain is used automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const site = {
  url: siteUrl.replace(/\/$/, ''),
  version: '2026.10.19',
  // Share preview served by src/app/og.png/route.tsx.
  image: { url: '/og.png', width: 1200, height: 630, alt: 'Mitansh Patel, React Native Developer' },
  /** What search results show: name first, then what people search for. */
  title: 'Mitansh Patel — React Native Developer Portfolio',
  description:
    'Mitansh Patel, React Native developer in India. Fast, offline-first Android and iOS apps built with Expo and TypeScript: apps, experience, skills and writing.',
  keywords: [
    'Mitansh Patel',
    'Mitansh',
    'React Native developer',
    'React Native developer portfolio',
    'React Native developer India',
    'mobile app developer',
    'Expo',
    'TypeScript',
    'Android',
    'iOS',
    'Billify',
  ],
};

export const person = {
  name: 'Mitansh Patel',
  initial: 'M',
  role: 'React Native Developer',
  location: 'India',
  bio: "I build mobile apps with React Native that stay fast and keep working when the internet doesn't. Right now I'm building Billify, a billing app for kirana stores.",
  status: 'Open to React Native roles',
  // Square photo in public/ (800×800). Set to null to fall back to the initial.
  photo: '/mitansh-patel.jpg' as string | null,
};

/** The opening animation on the home page (plays on every load of the home page). */
export const intro = {
  search: 'Mitansh Patel',
  before: 'Remember when you needed all of these?',
  after: "Now they're all one device.",
};

export const links = {
  // Each one shows up wherever contact options appear.
  email: 'mitanshpatel99@gmail.com' as string | null,
  linkedin: 'https://www.linkedin.com/in/mitanshpatel/' as string | null,
  // TODO: the updated resume PDF, in public/ (e.g. '/mitansh-patel-resume.pdf').
  resume: null as string | null,
  github: 'https://github.com/mitanshpatelll',
  githubUser: 'mitanshpatelll',
  leetcode: 'https://leetcode.com/u/devmitansh/',
  leetcodeUser: 'devmitansh',
};

/** About, in your own voice. **double stars** make a phrase bold. */
export const about = [
  "I'm a **React Native developer** who cares about the parts of an app people only notice when they break: **working without internet**, lists that scroll smoothly, and updates that don't break what already works.",
  "Right now I'm building **Billify** on my own, from the phone app to the server and the database.",
  'Outside that, I write about **JavaScript internals** and practise problems on **LeetCode**.',
];

export type Tag = { label: string; brand?: Brand };

export type App = {
  slug: string;
  name: string;
  icon: string;
  status: string;
  platforms: ('android' | 'ios')[];
  oneLiner: string;
  facts: string[];
  stack: Tag[];
  source: string;
  // TODO: add 3–4 clean phone screenshots (e.g. public/apps/billify/1.png) as { src, alt }.
  screenshots: { src: string; alt: string }[];
  metaTitle: string;
  description: string;
  summary: string;
  problem: string;
  features: { icon: IconName; title: string; text: string }[];
  role: string;
  progress: { built: string[]; next: string };
  engineering: {
    intro: string;
    hardParts: { title: string; text: string }[];
    numbers: { label: string; value: string }[];
    numbersNote: string;
    stack: { label: string; value: string }[];
    notes: { title: string; text: string }[];
  };
};

export const apps: App[] = [
  {
    slug: 'billify',
    name: 'Billify',
    // Neutral version of the app icon (graphite and off-white) so it sits with the site's palette.
    icon: '/apps/billify/icon-neutral.png',
    status: 'In development',
    platforms: ['android', 'ios'],
    oneLiner: 'Billing for small grocery shops: scan items, make a bill in seconds and send it on WhatsApp, even offline.',
    facts: ['287 automated tests', '9 end-to-end flows', 'Works offline'],
    stack: [
      { label: 'Expo SDK 57', brand: 'expo' },
      { label: 'React Native 0.86', brand: 'react' },
      { label: 'TypeScript', brand: 'typescript' },
      { label: 'SQLite + Drizzle', brand: 'sqlite' },
      { label: 'Zustand' },
      { label: 'TanStack Query', brand: 'tanstack' },
      { label: 'Fastify 5', brand: 'fastify' },
      { label: 'Postgres 17', brand: 'postgres' },
      { label: 'Maestro' },
    ],
    source: 'https://github.com/mitanshpatelll/billify-app',
    screenshots: [],
    metaTitle: 'Billify: offline billing app for kirana stores',
    description:
      'Billify lets small grocery shops in India bill in seconds by scanning barcodes, even offline, and send customers a digital bill. Built by Mitansh with React Native and Expo.',
    summary:
      'A billing app for small grocery shops in India. Shopkeepers scan items with the phone camera, make a bill in seconds and send it to the customer on WhatsApp, even without internet.',
    problem:
      'Most small grocery shops (kiranas) in India still bill on paper or from memory. Rush hours are slow, stock goes missing, and credit given to regular customers is easy to lose track of. The billing apps that exist are made for accountants, not for the counter when five customers are waiting.',
    features: [
      { icon: 'scan', title: 'Scan to bill', text: 'Point the camera at a barcode and the item is on the bill. A new item can be added on the spot.' },
      { icon: 'wallet', title: 'Loose items', text: 'Sugar, rice and dal sold by weight or by a rupee amount.' },
      { icon: 'check', title: 'Any way to pay', text: 'Cash with change worked out, UPI QR code, credit, or a mix of all three.' },
      { icon: 'message', title: 'Digital bills', text: 'The customer gets the bill as a link on WhatsApp. It opens in any browser, nothing to install.' },
      { icon: 'user', title: 'Credit book (khata)', text: 'Credit for each customer, payment reminders, and a link where they can say "I\'ve paid".' },
      { icon: 'database', title: 'Stock', text: 'Add stock by scanning, see what is running low, and reorder over WhatsApp.' },
      { icon: 'wifiOff', title: 'Works offline', text: 'Every bill is saved on the phone first and sent to the server when the internet comes back.' },
    ],
    role: 'I designed and built all of it on my own: the phone app, the server and the database.',
    progress: {
      built: ['The shop app: billing, payments, credit book and stock', 'The customer side: bills, credit and questions about a bill', 'The server, database and sign-in'],
      next: 'First release to 2–3 real shops for daily use.',
    },
    engineering: {
      intro: 'React Native and Expo on the phone, SQLite as the source of truth, an outbox-based sync engine, and a Fastify + Postgres API.',
      hardParts: [
        {
          title: 'Offline first, without double billing',
          text: 'Every write goes to SQLite and to an outbox in the same transaction. A push and pull sync engine sends the outbox to the API, which records each change once, so a retried request never bills twice.',
        },
        {
          title: 'Money in whole paise',
          text: '₹540.50 is stored as 54050. No floating point anywhere, so totals, discounts and splits never drift by a paisa.',
        },
        {
          title: 'A scanner that counts once',
          text: 'The camera kept re-reading a packet held still, adding it again every 1.8 seconds. Now the same code only counts again after it has left the view.',
        },
      ],
      numbers: [
        { label: 'App tests (Jest)', value: '124' },
        { label: 'API tests (Vitest)', value: '163' },
        { label: 'End-to-end flows (Maestro)', value: '9' },
        { label: 'Sync push, 100 changes', value: '~35 ms' },
        { label: 'Sync pull, 500 rows', value: '~10 ms' },
      ],
      numbersNote: 'Median sync timings: 3 runs of 30 pushes and 180 pulls against a local Postgres on an M-series Mac, 15 Oct 2026.',
      stack: [
        { label: 'App', value: 'React Native, Expo, TypeScript' },
        { label: 'Navigation', value: 'Expo Router' },
        { label: 'On the phone', value: 'SQLite with Drizzle, Zustand, TanStack Query' },
        { label: 'API', value: 'Fastify, TypeScript, OpenAPI' },
        { label: 'Database', value: 'Postgres' },
        { label: 'Sign-in', value: 'Better Auth' },
      ],
      notes: [
        {
          title: 'How a screen gets its data',
          text: 'Screens never touch SQLite or the network. They call feature hooks (useCart, useScanner, useKhata), which read Zustand for the cart, Drizzle live queries for shop data, and TanStack Query for the customer side.',
        },
        {
          title: 'A bug only a phone could find',
          text: "Every API call failed on the device: the API client's middleware failed an instanceof check on React Native. Unit tests run in Node and passed. A Maestro flow on the device caught it.",
        },
      ],
    },
  },
];

export const experience = [
  {
    // From the GlitchOver app's git history (Mitansh, mitansh@glitchover.com): 266 commits,
    // Jul 2025 to Oct 2026, about 80% of the app's commits in that time.
    // TODO: confirm the title, employment type and start date against LinkedIn.
    company: 'GlitchOver',
    logo: null as string | null,
    role: 'React Native Developer',
    type: 'Full-time',
    period: 'Jul 2025 – Present',
    current: true,
    summary:
      "GlitchOver is a gaming platform where fans book live sessions with streamers and play in community tournaments. I'm the main developer on its Android and iOS app, with about 80% of the app's commits since July 2025.",
    points: [
      'Built the tournament system end to end: sign-ups and invite-only events, brackets in five formats (single and double elimination, round robin, Swiss, battle royale), a match scheduler, and live chat during matches.',
      'Built live-session booking: slot booking and requests, a real-time queue with checkout, payments and invoices, kept in sync for every viewer over WebSockets.',
      'Added sign-in with Apple and Google, OTP verification, push notifications and over-the-air updates, and shipped versions 2.0 through 3.0.',
      'Kept the app current and fast: upgraded Expo SDK 52 → 57 and React Native to 0.86, and added skeleton loaders, image caching, lazy-loaded screens and crash fixes.',
    ],
    tech: [
      { label: 'React Native', brand: 'react' },
      { label: 'Expo', brand: 'expo' },
      { label: 'JavaScript', brand: 'javascript' },
      { label: 'Redux Toolkit', brand: 'redux' },
      { label: 'Socket.IO' },
      { label: 'Reanimated' },
      { label: 'Firebase' },
    ] as Tag[],
  },
];

export const writing = [
  {
    title: 'Are You a JS Pro? Try This.',
    href: '/are-you-a-js-pro/',
    summary: 'Ten JavaScript output puzzles on typeof, ==, NaN, -0 and the + operator, with the exact rules behind every answer.',
    tags: ['JavaScript', 'Type Coercion', 'Interview Prep'],
    date: '2026-10-08',
    dateLabel: 'October 8, 2026',
  },
];

export const skills: { group: string; items: Tag[] }[] = [
  {
    group: 'Mobile',
    items: [
      { label: 'React Native', brand: 'react' },
      { label: 'Expo', brand: 'expo' },
      { label: 'Expo Router', brand: 'expo' },
      { label: 'Android', brand: 'android' },
      { label: 'iOS', brand: 'apple' },
      { label: 'Unistyles' },
      { label: 'Offline sync' },
    ],
  },
  {
    group: 'Languages',
    items: [
      { label: 'TypeScript', brand: 'typescript' },
      { label: 'JavaScript', brand: 'javascript' },
      { label: 'Python', brand: 'python' },
      { label: 'C++', brand: 'cplusplus' },
      { label: 'C', brand: 'c' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { label: 'React.js', brand: 'react' },
      { label: 'Next.js', brand: 'nextjs' },
      { label: 'Redux Toolkit', brand: 'redux' },
      { label: 'RTK Query', brand: 'redux' },
      { label: 'TanStack Query', brand: 'tanstack' },
      { label: 'Zustand' },
      { label: 'Vite', brand: 'vite' },
      { label: 'PWA', brand: 'pwa' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { label: 'Node.js', brand: 'node' },
      { label: 'Express.js', brand: 'express' },
      { label: 'Fastify', brand: 'fastify' },
      { label: 'REST APIs' },
      { label: 'WebSockets' },
      { label: 'JWT', brand: 'jwt' },
      { label: 'Passport.js', brand: 'passport' },
      { label: 'OAuth 2.0' },
      { label: 'Better Auth', brand: 'betterauth' },
      { label: 'OpenAPI', brand: 'openapi' },
    ],
  },
  {
    group: 'AI / ML',
    items: [
      { label: 'LLM API Integration (Gemini, Cerebras, Groq)', brand: 'gemini' },
      { label: 'RAG Pipelines' },
      { label: 'Vector Search (MongoDB Atlas $vectorSearch)', brand: 'mongodb' },
      { label: 'LLM Fallback / Resilience Architecture' },
      { label: 'Prompt Engineering' },
    ],
  },
  {
    group: 'Databases',
    items: [
      { label: 'PostgreSQL', brand: 'postgres' },
      { label: 'SQLite', brand: 'sqlite' },
      { label: 'Drizzle', brand: 'drizzle' },
      { label: 'MongoDB', brand: 'mongodb' },
      { label: 'MySQL', brand: 'mysql' },
      { label: 'SQL Server' },
      { label: 'Indexing & Aggregation' },
      { label: 'Query Optimization' },
    ],
  },
  {
    group: 'Architecture',
    items: [
      { label: 'Microservices' },
      { label: 'Event-Driven Systems' },
      { label: 'MVC' },
      { label: 'Factory Pattern' },
      { label: 'Concurrency' },
      { label: 'ACID Transactions' },
      { label: 'Rate Limiting' },
      { label: 'Idempotent APIs' },
    ],
  },
  {
    group: 'Testing',
    items: [
      { label: 'Jest', brand: 'jest' },
      { label: 'Maestro' },
      { label: 'Vitest', brand: 'vitest' },
    ],
  },
  {
    group: 'DevOps & Tools',
    items: [
      { label: 'Git', brand: 'git' },
      { label: 'Bitbucket CI/CD', brand: 'bitbucket' },
      { label: 'Xcode', brand: 'xcode' },
      { label: 'Android Studio', brand: 'androidstudio' },
      { label: 'Agile / Scrum' },
    ],
  },
];
