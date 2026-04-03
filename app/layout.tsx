import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/layout/LayoutShell';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: {
    default: 'Tamshy — Экономь воду, сохраняй будущее',
    template: '%s — Tamshy',
  },
  description: 'Информационный веб-сайт проекта по формированию культуры рационального потребления водных ресурсов в Казахстане.',
  keywords: 'тамшы, tamshy, вода, экология, Казахстан, водосбережение, Аральское море, конкурс',
  openGraph: {
    type: 'website',
    locale: 'ru_KZ',
    siteName: 'Tamshy',
    title: 'Tamshy — Экономь воду, сохраняй будущее',
    description: 'Информационный веб-сайт проекта по формированию культуры рационального потребления водных ресурсов в Казахстане.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Tamshy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamshy — Экономь воду, сохраняй будущее',
    description: 'Проект по формированию культуры водосбережения в Казахстане.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${onest.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
