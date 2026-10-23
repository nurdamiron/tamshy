import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const region = process.env.AWS_REGION || 'eu-north-1';
const s3Bucket = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;

/** HTTP Security Headers — применяются ко всем маршрутам */
const securityHeaders = [
  // Запрет встраивания страниц в iframe (защита от clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Запрет MIME-sniffing браузером (защита от content-type confusion)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Отправляем Referrer только для same-origin запросов
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Отключаем ненужные браузерные API
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // DNS prefetch для ускорения навигации
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    // Vercel Image Optimization is not used: the account's quota is exhausted
    // (every /_next/image answered 402 on 2026-10-23 and photos vanished).
    // Photos go through our own resizer instead, app/api/img, which is
    // cached by the CDN. Emergency rollback to plain originals: replace the
    // two loader lines with `unoptimized: true`.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // Keep these in sync with lib/imageConfig.ts.
    qualities: [85],
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1600, 2048],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      // Wildcard для всех S3-бакетов AWS (на случай смены бакета без пересборки)
      { protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
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
