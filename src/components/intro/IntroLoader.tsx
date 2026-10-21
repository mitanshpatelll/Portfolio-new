'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Intro = dynamic(() => import('./Intro').then((module) => module.Intro), { ssr: false });

/**
 * Downloads the intro's code only for page views that will play it (the boot script in
 * layout.tsx decides), so search engines, deep links and repeat tools load less JavaScript.
 */
export function IntroLoader() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(document.documentElement.dataset.intro === 'playing');
  }, []);

  return play ? <Intro /> : null;
}
