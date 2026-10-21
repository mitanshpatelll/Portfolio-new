import { ImageResponse } from 'next/og';
import { person, site } from '@/content/profile';

// The preview image for links shared on LinkedIn, WhatsApp, Slack and search results, served at
// /og.png. A route with a file extension is not redirected by trailingSlash, so crawlers get the
// image directly (the opengraph-image file convention would answer with a 308 first).
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: '#0e0f11',
          color: '#f1f0ec',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div
            style={{
              width: 144,
              height: 144,
              borderRadius: 32,
              background: '#f1f0ec',
              color: '#0e0f11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 84,
              fontWeight: 700,
            }}
          >
            {person.initial}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{person.name}</div>
            <div style={{ fontSize: 36, color: '#a3a19b', marginTop: 6 }}>{`${person.role} · Android & iOS`}</div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 56, fontSize: 32, lineHeight: 1.4, color: '#c9c6bf', maxWidth: 980 }}>
          I build mobile apps with React Native that stay fast and keep working when the internet doesn&apos;t.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 44, fontSize: 28, color: '#e2b49b' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#e2b49b' }} />
          {`${person.status} · ${person.location}`}
        </div>
      </div>
    ),
    { width: site.image.width, height: site.image.height },
  );
}
