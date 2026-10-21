import { ImageResponse } from 'next/og';
import { person } from '@/content/profile';

// The icon iPhones use when the site is added to the home screen, served at /apple-touch-icon.png.
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1b1a18',
          color: '#f1f0ec',
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        {person.initial}
      </div>
    ),
    { width: 180, height: 180 },
  );
}
