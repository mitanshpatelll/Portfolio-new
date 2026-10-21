import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import { AnimatorScaleDialog } from '@/components/device/AnimatorScaleDialog';
import { DeviceProvider } from '@/components/device/DeviceProvider';
import { Toast } from '@/components/device/Toast';
import { person, site } from '@/content/profile';
import './globals.css';

// Manrope is also Billify's font, so the portfolio and the app read the same.
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${person.name}` },
  description: site.description,
  keywords: site.keywords,
  applicationName: `${person.name} Portfolio`,
  authors: [{ name: person.name, url: site.url }],
  creator: person.name,
  publisher: person.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: `${person.name} Portfolio`,
    locale: 'en_IN',
    url: '/',
    title: site.title,
    description: site.description,
    images: [site.image],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [site.image] },
  // Setting icons here replaces the icon.svg file convention, so list it explicitly.
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // Paste the code from Google Search Console into NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0e0f11' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f11' },
  ],
};

// Runs before the first paint:
// - marks JS as available (entrance animations are JS-only, so content stays visible without it);
// - opens in dark unless the visitor chose light (saved choice), so the page never flashes the wrong theme;
// - applies a saved animation speed from developer mode;
// - decides which opening this view gets on the home page: the full intro on the first visit
//   ("playing"), then a short close-and-reopen of the app on every later load ("relaunch", which
//   also starts the page at the top). None for deep links (#section), reduced motion, animations
//   switched off, and search bots / link previewers / Lighthouse, which get the same page without
//   the animation. ?intro forces the full intro. Failsafes end it if it never appears within 8 s,
//   and in any case after 40 s; they set "done" (not remove it) so the hero never fades in twice.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');var scale=1;try{var t=localStorage.getItem('theme');d.dataset.theme=(t==='light'||t==='dark')?t:'dark';var s=JSON.parse(localStorage.getItem('developer-options'));if(s&&s.unlocked&&typeof s.scale==='number'){scale=s.scale;d.style.setProperty('--anim',String(scale))}}catch(e){}try{var force=/[?&]intro(=|&|$)/.test(location.search);var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;var bot=/bot|crawler|spider|slurp|lighthouse|pagespeed|facebookexternalhit|embedly|preview/i.test(navigator.userAgent);if(location.pathname==='/'&&(force||(!location.hash&&!reduce&&!bot&&scale!==0))){var seen=false;try{seen=localStorage.getItem('intro-seen')==='1'}catch(e){}var mode=(seen&&!force)?'relaunch':'playing';d.dataset.intro=mode;if(mode==='relaunch'&&'scrollRestoration' in history)history.scrollRestoration='manual';var end=function(){var m=d.dataset.intro;if(m==='playing'||m==='relaunch')d.dataset.intro='done'};setTimeout(function(){if(!document.querySelector('[data-intro-overlay]'))end()},8000);setTimeout(end,40000*Math.max(1,scale||1))}}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <DeviceProvider>
          {children}
          <Toast />
          <AnimatorScaleDialog />
        </DeviceProvider>
        <Analytics />
      </body>
    </html>
  );
}
