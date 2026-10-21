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
  authors: [{ name: person.name }],
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
// - decides whether this view gets the intro: every load of the home page, except deep links
//   (#section), reduced motion, or animations switched off (?intro forces it). Failsafes uncover the
//   page if the intro never appears within 8 s, and in any case after 40 s.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');var scale=1;try{var t=localStorage.getItem('theme');d.dataset.theme=(t==='light'||t==='dark')?t:'dark';var s=JSON.parse(localStorage.getItem('developer-options'));if(s&&s.unlocked&&typeof s.scale==='number'){scale=s.scale;d.style.setProperty('--anim',String(scale))}}catch(e){}try{var force=/[?&]intro(=|&|$)/.test(location.search);var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(location.pathname==='/'&&(force||(!location.hash&&!reduce&&scale!==0))){d.dataset.intro='playing';setTimeout(function(){if(d.dataset.intro==='playing'&&!document.querySelector('[data-intro-overlay]'))delete d.dataset.intro},8000);setTimeout(function(){delete d.dataset.intro},40000*Math.max(1,scale||1))}}catch(e){}})()`;

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
