import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      // Allow all .local domains for multi-tenant development
      {
        protocol: 'http',
        hostname: '*.local',
      },
      // Allow localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  async rewrites() {
    return {
      beforeFiles: [
        {
          // Rewrite domain-based requests to path-based routes
          // Only applies when NOT accessing via localhost (for true multi-tenant domain routing)
          // Excludes admin, api, next, and static assets
          // e.g., luxe-hotels.local/about -> /luxe-hotels.local/about
          source: '/:path((?!admin|api|next|_next/static|_next/image|favicon.ico).*)*',
          destination: '/:tenant/:path*',
          has: [
            {
              type: 'host',
              value: '(?<tenant>(?!localhost).*)',
            },
          ],
        },
      ],
    }
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
