import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const region = process.env.AWS_REGION || 'eu-north-1';
const s3Bucket = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      ...(s3Bucket
        ? [
            {
              protocol: 'https',
              hostname: `${s3Bucket}.s3.${region}.amazonaws.com`,
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);
