import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A stray lockfile in the home folder would otherwise be taken as the workspace root.
  turbopack: { root: path.join(__dirname) },
  // The blog in public/ uses relative links (../css/style.css), which need folder-style URLs.
  trailingSlash: true,
  async rewrites() {
    return [
      { source: '/blog/', destination: '/blog/index.html' },
      { source: '/are-you-a-js-pro/', destination: '/are-you-a-js-pro/index.html' },
    ];
  },
};

export default nextConfig;
