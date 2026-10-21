'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * The address that was asked for, written the way a navigation error would put it. The 404 page is
 * built ahead of time, so the address is only known in the browser: it fills in after loading.
 */
export function RequestedPath() {
  const pathname = usePathname();
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return <>{path ? `navigate("${path}") · no screen with this name` : ' '}</>;
}
