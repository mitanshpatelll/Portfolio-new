import type { MetadataRoute } from 'next';
import { person, site } from '@/content/profile';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: person.name,
    description: site.description,
    start_url: '/',
    display: 'browser',
    background_color: '#0e0f11',
    theme_color: '#0e0f11',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
