import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: 'Тамшы — Республиканский конкурс водных проектов школьников',
  description:
    'Платформа водных проектов школьников Казахстана. Министерство водных ресурсов и ирригации РК.',
  keywords: 'тамшы, вода, экология, Казахстан, школьники, проекты, конкурс',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body className={`${onest.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
