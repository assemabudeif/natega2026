/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/dev.db.gz', './prisma/dev.db'],
    '/*': ['./prisma/dev.db.gz', './prisma/dev.db'],
  },
};

export default nextConfig;
