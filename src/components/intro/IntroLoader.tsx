'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Intro = dynamic(() => import('./Intro').then((module) => module.Intro), { ssr: false });
const Relaunch = dynamic(() => import('./Relaunch').then((module) => module.Relaunch), { ssr: false });

/**
 * Downloads only the animation this page view plays (the boot script in layout.tsx decides): the
 * full intro on a first visit, the close-and-reopen on a refresh, the phone opening the app on a
 * later visit, nothing for search engines, deep links or reduced motion.
 */
export function IntroLoader() {
  const [mode, setMode] = useState<string>();

  useEffect(() => {
    setMode(document.documentElement.dataset.intro);
  }, []);

  if (mode === 'playing') return <Intro />;
  if (mode === 'relaunch' || mode === 'open') return <Relaunch />;
  return null;
}
